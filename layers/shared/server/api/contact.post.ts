import { getRequestIP, readBody } from 'h3'
import { isContactRateLimited } from '../utils/contact/rateLimit'
import { sendContactEmail } from '../utils/contact/sendContactEmail'
import { validateContactPayload } from '../utils/contact/validateContactPayload'
import type { ContactFormPayload } from '../utils/contact/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody<ContactFormPayload>(event)

  if (body._gotcha) {
    return { ok: true }
  }

  const ip = getRequestIP(event, { xForwardedFor: true })

  if (isContactRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests'
    })
  }

  const validation = validateContactPayload(body)

  if (!validation.ok) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: validation.errors }
    })
  }

  const contactConfig = config.contactForm
  const source = config.public.app || contactConfig.siteName

  await sendContactEmail(validation.data, {
    smtpHost: contactConfig.smtpHost,
    smtpPort: contactConfig.smtpPort,
    smtpSecure: contactConfig.smtpSecure,
    smtpUser: contactConfig.smtpUser,
    smtpPass: contactConfig.smtpPass,
    to: contactConfig.to,
    from: contactConfig.from || contactConfig.smtpUser,
    fromName: contactConfig.fromName,
    siteName: contactConfig.siteName,
    source
  })

  return { ok: true }
})
