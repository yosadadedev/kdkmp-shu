import { cn } from '@presentation/utils/cn'

export interface SkeletonProps {
  widthClass?: string
  heightClass?: string
  rounded?: string
  className?: string
  inline?: boolean
}

export const Skeleton = ({
  widthClass,
  heightClass = 'h-4',
  rounded = 'rounded-md',
  className,
  inline = false,
}: SkeletonProps) => (
  <div
    aria-hidden
    className={cn(
      'shimmer-bg animate-skeleton-shimmer',
      inline ? 'inline-block align-middle' : 'block',
      widthClass ?? 'w-full',
      heightClass,
      rounded,
      className,
    )}
  />
)

export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('card-padded space-y-3', className)} aria-hidden>
    <Skeleton widthClass="w-1/2" heightClass="h-5" />
    <Skeleton widthClass="w-3/4" heightClass="h-3" />
    <div className="h-px w-full bg-border-light my-2" />
    <Skeleton widthClass="w-1/3" heightClass="h-8" rounded="rounded-lg" />
    <Skeleton widthClass="w-2/5" heightClass="h-4" />
  </div>
)
