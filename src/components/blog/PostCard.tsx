'use client'

import { CardGradient, CATEGORY_COLORS, cardGlowStyle } from '@/components/ui/CardGradient'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

type PostCardProps = {
  slug: string
  title: string
  excerpt?: string | null
  category: 'tech' | 'life'
  publishedAt?: string | null
  locale: string
  variant?: 'list' | 'card'
  glowColor?: string | null
}

export function PostCard({
  slug,
  title,
  excerpt,
  category,
  publishedAt,
  locale,
  variant = 'list',
  glowColor,
}: PostCardProps) {
  const t = useTranslations('category')
  const tBlog = useTranslations('blog')
  const dateLocale = locale === 'zh' ? zhCN : enUS
  const color = glowColor || CATEGORY_COLORS[category]

  const formattedDate = publishedAt
    ? format(new Date(publishedAt), locale === 'zh' ? 'yyyy年M月d日' : 'MMM d, yyyy', {
        locale: dateLocale,
      })
    : null

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition',
        'hover:-translate-y-0.5 hover:shadow-md',
        variant === 'card' ? 'p-5 md:p-6' : 'p-5',
      )}
      style={cardGlowStyle(color)}
    >
      <CardGradient color={color} />

      <div className="relative">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2
            className={cn(
              'min-w-0 flex-1 font-bold leading-snug tracking-tight transition',
              variant === 'card'
                ? 'text-xl group-hover:text-accent'
                : 'text-lg font-semibold group-hover:text-accent',
            )}
          >
            <Link
              href={`/blog/${slug}`}
              className={variant === 'card' ? 'text-accent hover:opacity-80' : undefined}
            >
              {title}
            </Link>
          </h2>
          <span
            className={cn(
              'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
              category === 'tech' ? 'bg-accent-soft text-accent' : 'bg-success-soft text-success',
            )}
          >
            {t(category)}
          </span>
        </div>

        {formattedDate && (
          <time dateTime={publishedAt ?? undefined} className="mb-3 block text-xs text-muted">
            {formattedDate}
          </time>
        )}

        {excerpt && (
          <p
            className={cn(
              'text-sm leading-7 text-muted',
              variant === 'card' ? 'mt-3 line-clamp-3' : 'mt-2 line-clamp-2 leading-6',
            )}
          >
            {excerpt}
          </p>
        )}

        <Link
          href={`/blog/${slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium transition hover:opacity-80"
          style={{ color }}
        >
          {tBlog('readMore')}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
