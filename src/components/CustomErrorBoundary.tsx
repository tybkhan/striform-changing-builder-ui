import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class CustomErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: false }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes('Support for defaultProps will be removed from memo components')) {
      console.warn('Suppressed defaultProps warning:', error.message)
    } else {
      console.error('Uncaught error:', error, errorInfo)
    }
  }

  public render() {
    return this.props.children
  }
}

export default CustomErrorBoundary