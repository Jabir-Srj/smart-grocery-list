import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="error-boundary" 
          role="alert" 
          aria-live="assertive"
        >
          <div className="error-content">
            <div className="error-icon" aria-hidden="true">
              <AlertTriangle size={40} />
            </div>
            <h2>Something went wrong</h2>
            <p>
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-actions">
              <button 
                onClick={this.handleReset} 
                className="btn-primary"
                type="button"
                aria-label="Try loading the application again"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-secondary"
                type="button"
                aria-label="Refresh the page"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
