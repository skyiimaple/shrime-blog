import { CardGradient, cardGlowStyle } from '@/components/ui/CardGradient'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ACCENT_COLOR } from '@/lib/theme'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

type AboutFact = {
  label: string
  value: string
}

type AboutContact = {
  label: string
  href: string
  external?: boolean
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  const facts = t.raw('facts') as AboutFact[]
  const paragraphs = t.raw('paragraphs') as string[]
  const stackList = t.raw('stackList') as string[]
  const contacts = t.raw('contacts') as AboutContact[]

  const glowColor = ACCENT_COLOR

  return (
    <article className="mx-auto max-w-2xl pt-6 md:pt-8">
      <header className="mb-10 flex items-center gap-5 border-b border-border pb-8">
        <Image
          src="/logo.png"
          alt=""
          width={80}
          height={80}
          className="rounded-2xl ring-1 ring-border shadow-sm"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{t('title')}</h1>
          <p className="mt-2 text-sm text-muted">
            {locale === 'zh' ? '生活与技术的个人博客' : 'Personal blog · life & tech'}
          </p>
        </div>
      </header>

      <section className="mb-10">
        <SectionTitle className="mb-5">{t('intelTitle')}</SectionTitle>
        <ul className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
          {facts.map((fact) => (
            <li key={fact.label} className="flex gap-3 text-sm leading-7 md:text-base">
              <span className="shrink-0 font-semibold text-accent">{fact.label}：</span>
              <span className="text-foreground">{fact.value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <SectionTitle className="mb-5">{t('blogTitle')}</SectionTitle>
        <div className="space-y-5 text-base leading-8 text-muted">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle className="mb-5">{t('stackTitle')}</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {stackList.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section
        className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm md:p-6"
        style={cardGlowStyle(glowColor)}
      >
        <CardGradient color={glowColor} size="sm" />
        <SectionTitle className="relative mb-4">{t('contactTitle')}</SectionTitle>
        <div className="relative flex flex-wrap gap-3">
          {contacts.map((contact) =>
            contact.external ? (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                {contact.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <a
                key={contact.label}
                href={contact.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                {contact.label}
              </a>
            ),
          )}
        </div>
      </section>
    </article>
  )
}
