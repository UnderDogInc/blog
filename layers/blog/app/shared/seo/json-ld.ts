import type { Post } from '~/entities/post'
import { SITE_PUBLISHER } from './constants'

interface OrganizationSchema {
  '@type': 'Organization'
  name: string
  url: string
}

export function buildPublisher(origin: string): OrganizationSchema {
  return {
    '@type': 'Organization',
    name: SITE_PUBLISHER,
    url: origin
  }
}

export function buildBlogPostingJsonLd(options: {
  post: Post
  pageUrl: string
  imageUrl?: string
  publisher: OrganizationSchema
}) {
  const { post, pageUrl, imageUrl, publisher } = options

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    ...(post.createdAt ? { datePublished: post.createdAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.category?.name ? { articleSection: post.category.name } : {}),
    author: publisher,
    publisher,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    url: pageUrl
  }
}

export function buildWebSiteJsonLd(options: {
  origin: string
  name: string
  description: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: options.name,
    description: options.description,
    url: options.origin,
    inLanguage: 'ru-RU',
    publisher: buildPublisher(options.origin)
  }
}

export function buildItemListJsonLd(options: {
  posts: Post[]
  origin: string
  resolveImage: (path?: string) => string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: options.posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${options.origin}/post/${post.id}`,
      name: post.title,
      ...(post.preview ? { image: options.resolveImage(post.preview) } : {})
    }))
  }
}
