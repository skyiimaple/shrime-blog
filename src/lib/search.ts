import { Meilisearch } from 'meilisearch'
import type { Payload } from 'payload'

export const POSTS_INDEX = 'posts'

export function getSearchClient() {
  const host = process.env.MEILISEARCH_HOST
  const apiKey = process.env.MEILISEARCH_API_KEY

  if (!host) {
    return null
  }

  return new Meilisearch({
    host,
    apiKey,
  })
}

type PostDoc = {
  id: string | number
  slug?: string | null
  title?: string | null
  excerpt?: string | null
  category?: string | null
  publishedAt?: string | null
  locale?: string
}

export async function syncPostToSearch(doc: PostDoc, payload: Payload) {
  const client = getSearchClient()

  if (!client || !doc.slug) {
    return
  }

  const index = client.index(POSTS_INDEX)

  try {
    await index.getSettings()
  } catch {
    await client.createIndex(POSTS_INDEX, { primaryKey: 'id' })
    await index.updateSettings({
      searchableAttributes: ['title', 'excerpt', 'category', 'tags'],
      filterableAttributes: ['category', 'locale'],
    })
  }

  const tagsResult = await payload.find({
    collection: 'posts',
    where: { id: { equals: doc.id } },
    depth: 1,
    locale: (doc.locale as 'zh' | 'en') || 'zh',
  })

  const post = tagsResult.docs[0]
  const tags =
    post && Array.isArray(post.tags)
      ? post.tags
          .map((tag) => (typeof tag === 'object' && tag !== null ? tag.name : null))
          .filter(Boolean)
          .join(', ')
      : ''

  await index.addDocuments([
    {
      id: String(doc.id),
      slug: doc.slug,
      title: doc.title,
      excerpt: doc.excerpt,
      category: doc.category,
      publishedAt: doc.publishedAt,
      locale: doc.locale || 'zh',
      tags,
    },
  ])
}

export async function searchPosts(query: string, locale: string, limit = 20) {
  const client = getSearchClient()

  if (!client) {
    return []
  }

  try {
    const result = await client.index(POSTS_INDEX).search(query, {
      limit,
      filter: `locale = "${locale}"`,
    })

    return result.hits as Array<{
      id: string
      slug: string
      title: string
      excerpt?: string
      category?: string
      publishedAt?: string
    }>
  } catch {
    return []
  }
}
