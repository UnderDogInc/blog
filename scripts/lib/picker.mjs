import { spawn } from 'node:child_process'
import { stdin as input, stdout as output } from 'node:process'

export function runPnpm(root, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', args, {
      cwd: root,
      stdio: 'inherit'
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`Process stopped: ${signal}`))
        return
      }

      resolve(code ?? 0)
    })
  })
}

export async function runParallel(root, scripts, staggerMs = 3000) {
  const children = []

  for (const [index, script] of scripts.entries()) {
    children.push(
      spawn('pnpm', [script], {
        cwd: root,
        stdio: 'inherit'
      })
    )

    if (staggerMs > 0 && index < scripts.length - 1) {
      await new Promise((resolve) => {
        setTimeout(resolve, staggerMs)
      })
    }
  }

  const stopAll = () => {
    for (const child of children) {
      if (!child.killed) {
        child.kill('SIGTERM')
      }
    }
  }

  process.on('SIGINT', stopAll)
  process.on('SIGTERM', stopAll)

  const codes = await Promise.all(
    children.map(
      (child) =>
        new Promise((resolve) => {
          child.on('exit', (code) => resolve(code ?? 0))
        })
    )
  )

  return Math.max(...codes)
}

export async function runSequential(root, scripts) {
  for (const script of scripts) {
    const code = await runPnpm(root, [script])

    if (code !== 0) {
      return code
    }
  }

  return 0
}

function formatRow(app, index, selectedIndex) {
  const active = index === selectedIndex
  const marker = active ? '\x1b[36m›\x1b[0m' : ' '
  const label = active ? `\x1b[1m\x1b[36m${app.label.padEnd(8)}\x1b[0m` : ` ${app.label.padEnd(8)}`

  return `${marker} ${label}`
}

export function pickApp({ title, apps }) {
  if (!input.isTTY) {
    return Promise.reject(new Error('Interactive menu requires a TTY'))
  }

  return new Promise((resolve, reject) => {
    let selectedIndex = 0
    let alternateScreenActive = false

    const render = () => {
      const lines = [
        '',
        `\x1b[1m${title}\x1b[0m`,
        '',
        ...apps.map((app, index) => formatRow(app, index, selectedIndex))
      ]

      output.write(`\x1b[H\x1b[J${lines.join('\n')}`)
    }

    const enterAlternateScreen = () => {
      if (alternateScreenActive) {
        return
      }

      output.write('\x1b[?1049h\x1b[H\x1b[J\x1b[?25l')
      alternateScreenActive = true
    }

    const cleanup = () => {
      input.setRawMode(false)
      input.pause()
      input.removeListener('data', onKey)

      if (alternateScreenActive) {
        output.write('\x1b[?1049l\x1b[?25h')
        alternateScreenActive = false
      } else {
        output.write('\x1b[?25h')
      }
    }

    const onKey = (chunk) => {
      const key = String(chunk)

      if (key === '\u0003' || key === '\u0004') {
        cleanup()
        process.exit(0)
      }

      if (key === '\r' || key === '\n') {
        cleanup()
        resolve(apps[selectedIndex])
        return
      }

      if (key === '\u001b[A' || key === '\u001bOA' || key.endsWith('\u001b[A')) {
        selectedIndex = Math.max(0, selectedIndex - 1)
        render()
        return
      }

      if (key === '\u001b[B' || key === '\u001bOB' || key.endsWith('\u001b[B')) {
        selectedIndex = Math.min(apps.length - 1, selectedIndex + 1)
        render()
      }
    }

    input.setRawMode(true)
    input.resume()
    input.setEncoding('utf8')
    input.on('data', onKey)

    input.on('error', (error) => {
      cleanup()
      reject(error)
    })

    enterAlternateScreen()
    render()
  })
}
