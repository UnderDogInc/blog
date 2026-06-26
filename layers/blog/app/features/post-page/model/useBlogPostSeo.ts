import type { Post } from '~/entities/post'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from '../../../shared/seo/constants'
import { buildBlogPostingJsonLd, buildPublisher } from '../../../shared/seo/json-ld'
import { resolveSeoImage, useSiteOrigin } from '../../../shared/seo/resolveSeo'

export function useBlogPostSeo(
  post: ComputedRef<Post | null | undefined>
) {
  const route = useRoute()
  const toMediaUrl = useResolveMediaUrl()

  const siteOrigin = useSiteOrigin()

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
    return resolveSeoImage(fromPost ?? preview, siteOrigin.value, DEFAULT_OG_IMAGE)
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
