import nodemailer from 'nodemailer'
import type { ContactFormPayload } from './types'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

interface ContactEmailConfig {
  smtpHost: string
  smtpPort: number
  smtpSecure?: boolean
  smtpUser: string
  smtpPass: string
  to: string
  from: string
  fromName?: string
  siteName: string
  source: string
}

function formatFromAddress(fromName: string | undefined, fromEmail: string): string {
  if (!fromName) {
    return fromEmail
  }

  return `"${fromName.replaceAll('"', '\\"')}" <${fromEmail}>`
}

export async function sendContactEmail(
  payload: Required<Pick<ContactFormPayload, 'name' | 'phone' | 'email'>> &
    Pick<ContactFormPayload, 'message'>,
  config: ContactEmailConfig
) {
  if (!config.smtpUser || !config.smtpPass) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact form is not configured'
    })
  }

  const secure = config.smtpSecure ?? config.smtpPort === 465

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure,
    requireTLS: !secure && config.smtpPort === 587,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass
    }
  })

  const subject = `[${config.siteName}] Новая заявка`
  const rows = [
    ['Имя', payload.name],
    ['Телефон', payload.phone],
    ['Email', payload.email],
    ['Источник', config.source],
    ...(payload.message ? [['Сообщение', payload.message] as const] : [])
  ]

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
  const html = `
    <h2>Новая заявка — ${escapeHtml(config.siteName)}</h2>
    <table cellpadding="6" cellspacing="0">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`
        )
        .join('')}
    </table>
  `

  await transporter.sendMail({
    from: formatFromAddress(config.fromName, config.from),
    to: config.to,
    replyTo: payload.email,
    subject,
    text,
    html
  })
}
