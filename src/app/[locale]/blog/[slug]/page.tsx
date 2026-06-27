import { RichTextContent } from '@/components/blog/RichTextContent'
import { CommentSection } from '@/components/comments/CommentSection'
import { BackLink } from '@/components/ui/BackLink'
import { cn } from '@/lib/utils'
import { getPayloadClient } from '@/lib/payload'
import { format } from 'date-fns'
import { enUS, zhCN } from 'date-fns/locale'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const tBlog = await getTranslations('blog')
  const tCategory = await getTranslations('category')
  const tCommon = await getTranslations('common')
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    locale: locale as 'zh' | 'en',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 1,
  })

  const post = result.docs[0]

  if (!post) {
    notFound()
  }

  const dateLocale = locale === 'zh' ? zhCN : enUS
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), locale === 'zh' ? 'yyyy年M月d日' : 'MMM d, yyyy', {
        locale: dateLocale,
      })
    : null

  return (
    <article className="pt-6 md:pt-8">
      <BackLink href="/blog">{tCommon('backToBlog')}</BackLink>

      <header className="mt-6 border-b border-border pb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 font-medium',
              post.category === 'tech'
                ? 'bg-accent-soft text-accent'
                : 'bg-success-soft text-success',
            )}
          >
            {tCategory(post.category as 'tech' | 'life')}
          </span>
          {formattedDate && (
            <span>
              {tBlog('publishedAt')} {formattedDate}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-lg leading-relaxed text-muted">{post.excerpt}</p>}
      </header>

      <div className="py-8">
        {post.content && <RichTextContent data={post.content} />}
      </div>

      <CommentSection postId={String(post.id)} locale={locale} />
    </article>
  )
}
