"use client";

import React from "react";
import ErrorAlert from "./ui/error-alert";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === "development";
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-red-600 text-4xl">⚠️</div>
            </div>
            
            <ErrorAlert
              title="Something went wrong"
              message={
                isDevelopment && this.state.error
                  ? `Development Error: ${this.state.error.message}`
                  : "An unexpected error occurred. Please try refreshing the page."
              }
              retry={this.handleRetry}
              onDismiss={this.handleReload}
            />
            
            {isDevelopment && this.state.error && (
              <details className="mt-6 text-left bg-gray-100 p-4 rounded-lg">
                <summary className="font-semibold cursor-pointer mb-2">Error Details (Development Only)</summary>
                <pre className="text-xs overflow-auto whitespace-pre-wrap text-gray-700">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <pre className="text-xs overflow-auto whitespace-pre-wrap text-gray-700 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={this.handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                aria-label="Try again"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                aria-label="Reload page"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;