import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@presentation/components/ui/Button'
import { USER_STRINGS } from '@presentation/constants/userFacingStrings'
import { AlertTriangle } from 'lucide-react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof window !== 'undefined' && typeof window.console?.error === 'function') {
      window.console.error('[AppErrorBoundary] caught error:', error, info)
    }
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="app-shell min-h-dvh flex flex-col items-center justify-center px-6 text-center bg-surface">
        <div className="h-16 w-16 rounded-2xl bg-danger-soft text-danger-text inline-flex items-center justify-center mb-5 shadow-card">
          <AlertTriangle className="h-9 w-9" />
        </div>
        <h1 className="title-lg mb-2">{USER_STRINGS.errorBoundary.title}</h1>
        <p className="body-sm mb-7 text-text-muted">{USER_STRINGS.errorBoundary.description}</p>
        <Button size="lg" isBlock variant="primary" onClick={this.handleReload}>
          {USER_STRINGS.errorBoundary.ctaReload}
        </Button>
      </div>
    )
  }
}
