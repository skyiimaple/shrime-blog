import type { Where } from 'payload'
import { PostCard } from '@/components/blog/PostCard'
import { PageTitle } from '@/components/ui/PageTitle'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const payload = await getPayloadClient()

  const where: Where =
    category === 'tech' || category === 'life'
      ? {
          and: [
            { _status: { equals: 'published' } },
            { category: { equals: category } },
          ],
        }
      : { _status: { equals: 'published' } }

  const posts = await payload.find({
    collection: 'posts',
    locale: locale as 'zh' | 'en',
    where,
    sort: '-publishedAt',
    limit: 50,
  })

  const filters = [
    { key: 'all', value: undefined },
    { key: 'tech', value: 'tech' },
    { key: 'life', value: 'life' },
  ] as const

  const activeFilter = category || 'all'

  return (
    <div className="pt-6 md:pt-8">
      <PageTitle className="mb-6">{t('title')}</PageTitle>

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === (filter.value || 'all')

          return (
            <Link
              key={filter.key}
              href={filter.value ? `/blog?category=${filter.value}` : '/blog'}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                isActive
                  ? 'border-accent bg-accent text-white shadow-sm'
                  : 'border-border text-muted hover:border-accent/40 hover:text-accent',
              )}
            >
              {t(filter.key)}
            </Link>
          )
        })}
      </div>

      {posts.docs.length === 0 ? (
        <p className="text-sm text-muted">{t('noPosts')}</p>
      ) : (
        <div className="grid gap-4">
          {posts.docs.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category as 'tech' | 'life'}
              publishedAt={post.publishedAt}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  )
}
