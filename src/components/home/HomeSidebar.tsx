import { TagChip } from '@/components/tags/TagChip'
import { ACCENT_COLOR } from '@/lib/theme'
import { CardGradient, cardGlowStyle } from '@/components/ui/CardGradient'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

type PopularPost = {
  slug: string
  title: string
}

type TagItem = {
  id: string | number
  name: string
  slug: string
  color?: string | null
}

type HomeSidebarProps = {
  popularPosts: PopularPost[]
  tags: TagItem[]
}

export async function HomeSidebar({ popularPosts, tags }: HomeSidebarProps) {
  const t = await getTranslations('home')
  const glowColor = ACCENT_COLOR

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm"
        style={cardGlowStyle(glowColor)}
      >
        <CardGradient color={glowColor} size="sm" />
        <div className="relative text-center">
          {/* <Image
            src="/logo.png"
            alt=""
            width={64}
            height={64}
            className="mx-auto rounded-xl ring-1 ring-border"
          /> */}
          <h3 className="mt-3 text-sm font-semibold">{t('welcomeTitle')}</h3>
          <p className="mt-2 text-xs leading-6 text-muted">{t('welcomeDesc')}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">{t('popularPosts')}</h3>
        <ol className="space-y-3">
          {popularPosts.map((post, index) => (
            <li key={post.slug} className="flex gap-3 text-sm">
              <span className="shrink-0 font-bold text-accent">{index + 1}</span>
              <Link
                href={`/blog/${post.slug}`}
                className="line-clamp-2 leading-6 text-foreground transition hover:text-accent"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {tags.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{t('tagCloud')}</h3>
            <Link href="/tags" className="text-xs text-muted transition hover:text-accent">
              {t('viewAllTags')}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                slug={tag.slug}
                color={tag.color}
                className="px-3 py-1.5 text-xs"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
