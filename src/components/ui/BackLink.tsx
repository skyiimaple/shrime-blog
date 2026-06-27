import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

type BackLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      aria-label={typeof children === 'string' ? children : undefined}
      className={cn(
        'group inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted shadow-sm transition',
        'hover:border-accent/40 hover:bg-accent-soft hover:text-accent hover:shadow',
        className,
      )}
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        aria-hidden
      />
    </Link>
  )
}
