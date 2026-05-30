import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { stdout as output } from 'node:process'
import { pickApp, runParallel, runPnpm, runSequential } from './lib/picker.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2]

const configs = {
  dev: {
    title: 'App to run',
    startLabel: 'Starting',
    apps: [
      { label: 'blog', script: 'dev:blog' },
      { label: 'writer', script: 'dev:writer' },
      { label: 'resto', script: 'dev:resto' },
      { label: 'all', script: 'all' }
    ],
    runAll(scripts) {
      return runParallel(root, scripts)
    }
  },
  build: {
    title: 'App to build',
    startLabel: 'Building',
    apps: [
      { label: 'blog', script: 'build:blog' },
      { label: 'writer', script: 'build:writer' },
      { label: 'resto', script: 'build:resto' },
      { label: 'all', script: 'all' }
    ],
    runAll(scripts) {
      return runSequential(root, scripts)
    }
  }
}

const config = configs[mode]

if (!config) {
  console.error(`Unknown mode: ${mode}. Use "dev" or "build".`)
  process.exit(1)
}

async function main() {
  const selected = await pickApp({
    title: config.title,
    apps: config.apps
  })

  output.write(`${config.startLabel} \x1b[1m${selected.label}\x1b[0m...\n\n`)

  if (selected.script === 'all') {
    const scripts = config.apps.filter((app) => app.script !== 'all').map((app) => app.script)
    const code = await config.runAll(scripts)
    process.exit(code)
  }

  const code = await runPnpm(root, [selected.script])
  process.exit(code)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
