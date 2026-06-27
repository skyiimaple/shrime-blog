import { PostCard } from '@/components/blog/PostCard'
import { HomeBanner } from '@/components/home/HomeBanner'
import { HomeSidebar } from '@/components/home/HomeSidebar'
import { ProfileSidebar } from '@/components/home/ProfileSidebar'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tHome = await getTranslations('home')
  const payload = await getPayloadClient()

  const [posts, tags] = await Promise.all([
    payload.find({
      collection: 'posts',
      locale: locale as 'zh' | 'en',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 10,
      depth: 1,
    }),
    payload.find({
      collection: 'tags',
      locale: locale as 'zh' | 'en',
      limit: 12,
      sort: 'name',
    }),
  ])

  const popularPosts = posts.docs
    .filter((post) => post.slug && post.title)
    .slice(0, 5)
    .map((post) => ({
      slug: post.slug!,
      title: post.title!,
    }))

  return (
    <div className="pb-4">
      <div className="banner-bleed overflow-hidden">
        <HomeBanner />
      </div>

      <div className="relative z-[1] -mt-10 grid gap-6 md:-mt-14 lg:-mt-16 lg:grid-cols-12 lg:gap-8 lg:items-start">
        <div className="lg:col-span-3">
          <ProfileSidebar />
        </div>

        <div className="lg:col-span-6">
          {posts.docs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
              {tHome('empty')}
            </p>
          ) : (
            <div className="space-y-5">
              {posts.docs.map((post) => (
                <PostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category as 'tech' | 'life'}
                  publishedAt={post.publishedAt}
                  locale={locale}
                  variant="card"
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <HomeSidebar
            popularPosts={popularPosts}
            tags={tags.docs.map((tag) => ({
              id: tag.id,
              name: tag.name,
              slug: tag.slug,
              color: tag.color,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
