import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error('ErrorBoundary: Caught error:', error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary: Error details:', error, errorInfo);
    
    // Don't update state if it's a React error #300 (state update after unmount)
    if (error.message && error.message.includes('Minified React error #300')) {
      console.warn('ErrorBoundary: Ignoring React error #300 (state update after unmount)');
      return;
    }
    
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-light to-white">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue</h2>
              <p className="text-gray-600 mb-6">
                L'application a rencontré une erreur inattendue. Veuillez réessayer.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left bg-gray-100 p-4 rounded-lg mb-6 text-sm font-mono text-gray-800 max-h-32 overflow-y-auto">
                  <strong>Erreur:</strong> {this.state.error.message}
                  {this.state.errorInfo && (
                    <>
                      <br />
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </button>
                <button
                  onClick={this.handleReload}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Actualiser la page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
