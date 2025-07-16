import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white rounded-xl shadow-soft p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Bir Hata Oluştu
              </h1>
              
              <p className="text-gray-600 mb-6">
                Uygulama beklenmedik bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleReload}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sayfayı Yenile
                </button>
                
                <a
                  href="/"
                  className="btn btn-outline w-full"
                >
                  Ana Sayfaya Dön
                </a>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Hata Detayları (Geliştirici Modu)
                  </summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto max-h-32">
                    <div className="font-mono whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {this.state.errorInfo.componentStack}
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
