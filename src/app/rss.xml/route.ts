import { getPayloadClient } from '@/lib/payload'
import { getBaseUrl } from '@/lib/utils'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayloadClient()
  const baseUrl = getBaseUrl()

  const posts = await payload.find({
    collection: 'posts',
    locale: 'zh',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  })

  const items = posts.docs
    .map((post) => {
      if (!post.slug || !post.title) return ''

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/zh/blog/${post.slug}</link>
      <guid>${baseUrl}/zh/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Maple's Blog</title>
    <link>${baseUrl}</link>
    <description>生活与技术的开发者博客</description>
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
