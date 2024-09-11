import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="md:-px-6 flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Something went wrong.
          </h2>
          <details
            className="mt-4 rounded bg-white p-4 shadow-lg dark:bg-gray-400"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {this.state.error && (
              <summary className="text-lg font-semibold">
                {this.state.error.toString()}
              </summary>
            )}
            <br />
            {this.state.errorInfo && (
              <pre className="text-sm">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
