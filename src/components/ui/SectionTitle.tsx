import { cn } from '@/lib/utils'

type SectionTitleProps = {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        'flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      <span className="h-5 w-1 rounded-full bg-accent" aria-hidden />
      {children}
    </h2>
  )
}
