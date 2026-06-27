import { TagChip } from '@/components/tags/TagChip'
import { PageTitle } from '@/components/ui/PageTitle'
import { getPayloadClient } from '@/lib/payload'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TagsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('tags')
  const payload = await getPayloadClient()

  const tags = await payload.find({
    collection: 'tags',
    locale: locale as 'zh' | 'en',
    limit: 100,
    sort: 'name',
  })

  return (
    <div className="pt-6 md:pt-8">
      <PageTitle className="mb-8">{t('title')}</PageTitle>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {tags.docs.map((tag) => (
          <TagChip
            key={tag.id}
            name={tag.name}
            slug={tag.slug}
            color={tag.color}
            className="min-h-[52px]"
          />
        ))}
      </div>
    </div>
  )
}
