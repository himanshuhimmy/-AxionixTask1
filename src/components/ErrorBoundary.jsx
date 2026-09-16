import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled rendering error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-600" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              An unexpected error occurred while rendering this page. You can try again, or head
              back to the dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => window.location.assign('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button onClick={this.handleReset}>Try again</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
