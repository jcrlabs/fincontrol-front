import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-lg w-full bg-white rounded-lg border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error de aplicación</h2>
            <p className="text-sm font-mono text-red-600 bg-red-50 rounded p-3 break-all">
              {this.state.error.message}
            </p>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
