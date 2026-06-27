import { PostCard } from '@/components/blog/PostCard'
import { BackLink } from '@/components/ui/BackLink'
import { ACCENT_COLOR } from '@/lib/theme'
import { CardGradient, cardGlowStyle } from '@/components/ui/CardGradient'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; tag: string }>
}

export default async function TagDetailPage({ params }: Props) {
  const { locale, tag: tagSlug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tags')
  const tCommon = await getTranslations('common')
  const payload = await getPayloadClient()

  const tagResult = await payload.find({
    collection: 'tags',
    locale: locale as 'zh' | 'en',
    where: { slug: { equals: tagSlug } },
    limit: 1,
  })

  const tag = tagResult.docs[0]

  if (!tag) {
    notFound()
  }

  const posts = await payload.find({
    collection: 'posts',
    locale: locale as 'zh' | 'en',
    where: {
      and: [{ _status: { equals: 'published' } }, { tags: { contains: tag.id } }],
    },
    sort: '-publishedAt',
  })

  const glowColor = tag.color || ACCENT_COLOR

  return (
    <div className="pt-6 md:pt-8">
      <BackLink href="/tags">{tCommon('backToTags')}</BackLink>

      <section
        className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
        style={cardGlowStyle(glowColor)}
      >
        <CardGradient color={glowColor} size="lg" />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: glowColor }}>
            #{tag.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {posts.docs.length} {t('posts')}
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-4">
        {posts.docs.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            category={post.category as 'tech' | 'life'}
            publishedAt={post.publishedAt}
            locale={locale}
            glowColor={glowColor}
          />
        ))}
      </div>
    </div>
  )
}
