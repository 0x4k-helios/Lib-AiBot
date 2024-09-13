import React, { Component } from "react";
import { AlertTriangle, RefreshCw, ChevronDown } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOpen: false,
    };
  }

  // This lifecycle is invoked after an error has been thrown by a descendant component
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // This lifecycle is invoked after an error has been thrown by a descendant component
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  // Toggle the details section open/closed
  toggleDetails = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  // Reload the page
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 text-center dark:from-gray-900 dark:to-gray-800">
          <AlertTriangle
            size={64}
            className="mb-6 text-red-500 dark:text-red-400"
          />
          <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-100">
            Oops! Something went wrong.
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            We're sorry, but an unexpected error occurred.
          </p>

          {/* Reload button */}
          <button
            onClick={this.handleReload}
            className="mb-8 inline-flex items-center rounded-full bg-blue-500 px-6 py-3 text-lg font-medium text-white transition-all duration-300 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Reload Page
          </button>

          {/* Error details section */}
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <button
              onClick={this.toggleDetails}
              className="flex w-full items-center justify-between text-left text-lg font-semibold text-gray-700 dark:text-gray-300"
            >
              <span>Error Details</span>
              <ChevronDown
                className={`h-5 w-5 transform transition-transform duration-200 ${this.state.isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {this.state.isOpen && (
              <div className="mt-4">
                <p className="mb-2 text-red-600 dark:text-red-400">
                  {this.state.error && this.state.error.toString()}
                </p>
                <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-400">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
