import { cn } from '@/lib/utils'

type PageTitleProps = {
  children: React.ReactNode
  className?: string
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={cn('text-2xl font-bold tracking-tight text-foreground md:text-3xl', className)}>
      {children}
    </h1>
  )
}
