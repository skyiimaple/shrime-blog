import { SearchBox } from '@/components/search/SearchBox'
import { PageTitle } from '@/components/ui/PageTitle'
import { getSearchClient } from '@/lib/search'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('search')
  const searchEnabled = Boolean(getSearchClient())

  return (
    <div className="max-w-2xl pt-6 md:pt-8">
      <PageTitle className="mb-6">{t('title')}</PageTitle>
      {!searchEnabled && <p className="mb-4 text-sm text-muted">{t('meilisearchOff')}</p>}
      <SearchBox locale={locale} initialQuery={q || ''} />
    </div>
  )
}
