import { MapPinOff } from 'lucide-react'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'

export function NotFoundPage() {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="app-shell min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-surface">
      <div className="h-16 w-16 rounded-2xl bg-danger-soft text-danger-text inline-flex items-center justify-center mb-5 shadow-card">
        <MapPinOff className="h-9 w-9" />
      </div>
      <h1 className="title-lg mb-2">{USER_STRINGS.notFound.title}</h1>
      <p className="body-sm mb-7 text-text-muted">{USER_STRINGS.notFound.description}</p>
      <Button size="lg" isBlock variant="primary" onClick={handleReload}>
        {USER_STRINGS.notFound.ctaReload}
      </Button>
    </div>
  )
}
