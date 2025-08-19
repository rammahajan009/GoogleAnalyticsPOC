import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

export interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  retryText?: string;
  title?: string;
  showDebugInfo?: boolean;
  onRetry?: () => void; // External retry function
  // Redux error handling
  reduxErrors?: Array<{ message: string; type: string }>;
  onReduxErrorRetry?: (errorType: string) => void;
  customStyles?: {
    container?: any;
    title?: any;
    message?: any;
    buttonContainer?: any;
    retryButton?: any;
    retryButtonText?: any;
  };
}

export interface WithErrorBoundaryProps {
  error?: Error;
}

export type WithErrorBoundaryComponent<P = {}> = ComponentType<P & WithErrorBoundaryProps>;

/**
 * Higher-Order Component that wraps a component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary
      fallback={options.fallback}
      onError={options.onError}
      retryText={options.retryText}

      title={options.title}
      showDebugInfo={options.showDebugInfo}
      onRetry={options.onRetry}
      reduxErrors={options.reduxErrors}
      onReduxErrorRetry={options.onReduxErrorRetry}
      customStyles={options.customStyles}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Decorator version of withErrorBoundary (for class components)
 */
export function withErrorBoundaryDecorator(options: WithErrorBoundaryOptions = {}) {
  return function <P extends object>(Component: ComponentType<P>): ComponentType<P> {
    return withErrorBoundary(Component, options);
  };
}

/**
 * Type helper for components wrapped with error boundary
 */
export type WithErrorBoundary<P> = ComponentType<P & WithErrorBoundaryProps>;
