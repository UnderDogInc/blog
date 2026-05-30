import type { Post } from '~/entities/post'
import { DEFAULT_DESCRIPTION, SITE_NAME } from '../../../shared/seo/constants'
import { buildBlogPostingJsonLd, buildPublisher } from '../../../shared/seo/json-ld'
import { resolveOgImage, resolveSiteOrigin } from '../../../shared/seo/resolveSeo'

export function useBlogPostSeo(
  post: ComputedRef<Post | null | undefined>
) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const toMediaUrl = useResolveMediaUrl()

  const siteOrigin = computed(() =>
    resolveSiteOrigin(config.public.siteUrl, config.public.blogUrl)
  )

  const pageUrl = computed(() => `${siteOrigin.value}/post/${route.params.id}`)

  const title = computed(() =>
    post.value?.title ? `${post.value.title} — ${SITE_NAME}` : SITE_NAME
  )

  const description = computed(
    () => post.value?.description?.trim() || DEFAULT_DESCRIPTION
  )

  const ogImage = computed(() => {
    const preview = post.value?.preview
    const fromPost = preview ? toMediaUrl(preview) : undefined
    return resolveOgImage(fromPost, siteOrigin.value)
  })

  const jsonLd = computed(() => {
    if (!post.value) {
      return null
    }

    return buildBlogPostingJsonLd({
      post: post.value,
      pageUrl: pageUrl.value,
      imageUrl: ogImage.value,
      publisher: buildPublisher(siteOrigin.value)
    })
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogSiteName: SITE_NAME,
    ogType: 'article',
    ogLocale: 'ru_RU',
    ogUrl: pageUrl,
    ogImage,
    ogImageAlt: title,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage
  })

  useHead(() => ({
    link: post.value ? [{ rel: 'canonical', href: pageUrl.value }] : [],
    script: jsonLd.value
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(jsonLd.value)
          }
        ]
      : []
  }))
}
