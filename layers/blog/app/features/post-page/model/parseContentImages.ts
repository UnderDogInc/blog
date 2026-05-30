import { buildMediaUrl } from '#shared/lib/useMediaUrl'

function extractAttr(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'))
  return match?.[1]
}

function buildImageTag(attrs: string, apiBase: string, apiOrigin?: string) {
  const srcMatch = attrs.match(/src=["']([^"']+)["']/i)
  if (!srcMatch) {
    return null
  }

  const src = buildMediaUrl(srcMatch[1], apiBase, apiOrigin)
  const alt = extractAttr(attrs, 'alt') ?? ''
  const width = extractAttr(attrs, 'width')
  const height = extractAttr(attrs, 'height')
  const style = extractAttr(attrs, 'style')

  const parts = [
    `src="${src}"`,
    `alt="${alt}"`,
    'loading="lazy"',
    'decoding="async"',
    'class="content-image-img"'
  ]

  if (width) {
    parts.push(`width="${width}"`)
  }

  if (height) {
    parts.push(`height="${height}"`)
  }

  if (style) {
    parts.push(`style="${style}"`)
  }

  return `<img ${parts.join(' ')} />`
}

export function parseContentImages(html: string, apiBase: string, apiOrigin?: string) {
  if (!html) {
    return ''
  }

  return html.replace(/<img([^>]*?)>/gi, (match, attrs: string) => {
    const imageTag = buildImageTag(attrs, apiBase, apiOrigin)

    if (!imageTag) {
      return match
    }

    return `
      <figure class="content-image not-prose">
        ${imageTag}
      </figure>
    `
  })
}
