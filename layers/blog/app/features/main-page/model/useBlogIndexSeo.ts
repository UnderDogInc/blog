import type { Post } from '~/entities/post'
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../../../shared/seo/constants'
import {
  buildItemListJsonLd,
  buildWebSiteJsonLd
} from '../../../shared/seo/json-ld'
import { resolveOgImage, resolveSiteOrigin } from '../../../shared/seo/resolveSeo'

export function useBlogIndexSeo(options: {
  activeCategory: ComputedRef<{ name: string; key: string } | null>
  currentPage: ComputedRef<number>
  posts: ComputedRef<Post[]>
}) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const toMediaUrl = useResolveMediaUrl()

  const siteOrigin = computed(() =>
    resolveSiteOrigin(config.public.siteUrl, config.public.blogUrl)
  )

  const title = computed(() => {
    const parts: string[] = []

    if (options.activeCategory.value) {
      parts.push(options.activeCategory.value.name)
    } else {
      parts.push('Блог о разработке и дизайне')
    }

    if (options.currentPage.value > 1) {
      parts.push(`страница ${options.currentPage.value}`)
    }

    parts.push(SITE_NAME)

    return parts.join(' — ')
  })

  const description = computed(() => {
    if (options.activeCategory.value) {
      return `Статьи в категории «${options.activeCategory.value.name}». ${DEFAULT_DESCRIPTION}`
    }

    return DEFAULT_DESCRIPTION
  })

  const canonicalUrl = computed(() => {
    const url = new URL(siteOrigin.value + route.path)

    if (options.activeCategory.value) {
      url.searchParams.set('category', options.activeCategory.value.key)
    }

    if (options.currentPage.value > 1) {
      url.searchParams.set('page', String(options.currentPage.value))
    }

    return url.toString()
  })

  const ogImage = computed(() => {
    const preview = options.posts.value[0]?.preview
    const fromPost = preview ? toMediaUrl(preview) : undefined
    return resolveOgImage(fromPost, siteOrigin.value)
  })

  const jsonLd = computed(() => {
    const website = buildWebSiteJsonLd({
      origin: siteOrigin.value,
      name: SITE_NAME,
      description: description.value
    })

    if (!options.posts.value.length) {
      return website
    }

    return [
      website,
      buildItemListJsonLd({
        posts: options.posts.value,
        origin: siteOrigin.value,
        resolveImage: toMediaUrl
      })
    ]
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE_NAME,
    ogType: 'website',
    ogLocale: 'ru_RU',
    ogUrl: canonicalUrl,
    ogImage,
    ogImageAlt: title,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage
  })

  useHead(() => ({
    link: [{ rel: 'canonical', href: canonicalUrl.value }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd.value)
      }
    ]
  }))
}
