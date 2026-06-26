export const POST_IMAGE_ACCEPT = 'image/webp,image/avif,.webp,.avif'

export const POST_IMAGE_MIME_TYPES = ['image/webp', 'image/avif'] as const

export const POST_IMAGE_EXTENSIONS = ['.webp', '.avif'] as const

/** Максимальный размер загружаемого изображения */
export const POST_IMAGE_MAX_BYTES = 2 * 1024 * 1024

export function formatImageSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} Б`
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} КБ`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.0', '')} МБ`
}

export function validatePostImageFile(file: File): string | null {
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ''
  const mimeAllowed = POST_IMAGE_MIME_TYPES.includes(
    file.type as (typeof POST_IMAGE_MIME_TYPES)[number]
  )
  const extensionAllowed = POST_IMAGE_EXTENSIONS.includes(
    extension as (typeof POST_IMAGE_EXTENSIONS)[number]
  )

  if (!mimeAllowed && !extensionAllowed) {
    return 'Допустимы только изображения WebP или AVIF'
  }

  if (file.size > POST_IMAGE_MAX_BYTES) {
    return `Файл слишком большой (максимум ${formatImageSize(POST_IMAGE_MAX_BYTES)})`
  }

  return null
}
