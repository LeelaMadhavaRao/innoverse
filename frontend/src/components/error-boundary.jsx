import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <Alert variant="destructive">
              <AlertTitle>Something went wrong</AlertTitle>
              <AlertDescription>
                An error occurred while rendering this component. Please refresh the page or contact support if the problem persists.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-x-2">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                variant="default"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-sm overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
