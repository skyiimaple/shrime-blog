'use client'

import { ProfileSocialLinks } from '@/components/home/ProfileSocialLinks'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Globe, MapPin, Rss } from 'lucide-react'

export function ProfileSidebar() {
  const tHome = useTranslations('home')

  const infoItems = [tHome('profileBio'), tHome('profileSite'), tHome('profileStatus')]

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-border bg-card px-5 pb-6 pt-3 text-center shadow-sm">
        <div className="mt-2 flex justify-center">
          <Image
            src="/avatar.png"
            alt=""
            width={240}
            height={240}
            className="h-36 w-auto max-w-full object-contain object-bottom md:h-40"
            priority
          />
        </div>

        <p className="mt-2 text-sm leading-6 text-muted">{tHome('profileMotto')}</p>

        <ul className="mt-5 space-y-2.5 text-sm text-muted">
          {infoItems.map((item) => (
            <li key={item} className="flex items-center justify-center gap-2.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <ProfileSocialLinks />

        <div className="mt-6 border-t border-border pt-5">
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="h-3.5 w-3.5 text-muted" />
            {tHome('mySites')}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link
              href="/blog"
              className="rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted shadow-sm transition hover:border-accent hover:text-accent"
            >
              {tHome('blogSite')}
            </Link>
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted shadow-sm transition hover:border-accent hover:text-accent"
            >
              <Rss className="h-3 w-3" />
              RSS
            </a>
            <Link
              href="/tags"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted shadow-sm transition hover:border-accent hover:text-accent"
            >
              <Globe className="h-3 w-3" />
              {tHome('tagsSite')}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
