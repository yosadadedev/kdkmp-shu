import { cn } from '@presentation/utils/cn'
import { User } from 'lucide-react'

export interface AvatarCircleProps {
  fullName: string
  size?: 'xl' | 'lg' | 'md' | 'sm'
  tone?: 'brand' | 'neutral' | 'success'
  className?: string
  showInitial?: boolean
}

const sizeMap = {
  xl: 'h-16 w-16 text-xl',
  lg: 'h-14 w-14 text-lg',
  md: 'h-11 w-11 text-base',
  sm: 'h-9 w-9 text-sm',
}

const toneMap = {
  brand: 'bg-brand-100 text-brand-700',
  neutral: 'bg-surface-muted text-text-muted',
  success: 'bg-success-soft text-success-text',
}

const extractInitials = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) return ''
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return `${first}${last}`.toUpperCase()
}

export function AvatarCircle({
  fullName,
  size = 'lg',
  tone = 'brand',
  className,
  showInitial = true,
}: AvatarCircleProps) {
  const initials = extractInitials(fullName)
  const hasInitial = showInitial && initials.length > 0
  return (
    <span
      aria-hidden={!hasInitial}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-extrabold tracking-wide select-none',
        sizeMap[size],
        toneMap[tone],
        className,
      )}
    >
      {hasInitial ? initials : <User className="h-1/2 w-1/2" />}
    </span>
  )
}
