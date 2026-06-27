import { cn } from '@/lib/utils'

type SiteTitleProps = {
  children: React.ReactNode
  className?: string
}

export function SiteTitle({ children, className }: SiteTitleProps) {
  return (
    <span className={cn('site-title text-lg font-bold tracking-tight md:text-xl', className)}>
      {children}
    </span>
  )
}
