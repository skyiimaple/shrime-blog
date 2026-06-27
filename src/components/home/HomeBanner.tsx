import Image from 'next/image'
import { cn } from '@/lib/utils'

type HomeBannerProps = {
  className?: string
}

export function HomeBanner({ className }: HomeBannerProps) {
  return (
    <div
      className={cn(
        'relative h-64 w-full overflow-hidden md:h-80 lg:h-[26rem]',
        className,
      )}
    >
      <Image
        src="/banner.jpg"
        alt=""
        fill
        priority
        className="object-cover object-[center_25%]"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-30% to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/15 via-transparent to-rose-900/10" />

      <div
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-b from-transparent via-background/40 to-background"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background md:h-36 lg:h-44"
        aria-hidden
      />
    </div>
  )
}
