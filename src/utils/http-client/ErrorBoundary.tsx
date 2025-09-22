import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  retryText?: string;
  title?: string;
  showDebugInfo?: boolean;
  onRetry?: () => void; // External retry function
  // New props for Redux state errors
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

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }



  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    // Call external retry function if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    // Reset the error state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };



  getErrorMessage = (): string => {
    const { error } = this.state;
    
    if (!error) return 'An unknown error occurred';

    // Simply return the error message directly
    return error.message || 'An unexpected error occurred';
  };

  render() {
    // Check for Redux state errors
    const hasReduxErrors = this.props.reduxErrors && this.props.reduxErrors.length > 0;
    
    if (this.state.hasError || hasReduxErrors) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI with customizable styles
      const containerStyle = [
        styles.errorContainer,
        this.props.customStyles?.container
      ];
      const titleStyle = [
        styles.errorTitle,
        this.props.customStyles?.title
      ];
      const messageStyle = [
        styles.errorMessage,
        this.props.customStyles?.message
      ];
      const buttonContainerStyle = [
        styles.buttonContainer,
        this.props.customStyles?.buttonContainer
      ];
      const retryButtonStyle = [
        styles.retryButton,
        this.props.customStyles?.retryButton
      ];
      const retryButtonTextStyle = [
        styles.retryButtonText,
        this.props.customStyles?.title
      ];

      // Determine error message and type
      let errorMessage = '';
      let errorType = '';
      
      if (this.state.hasError && this.state.error) {
        errorMessage = this.getErrorMessage();
        errorType = 'react';
      } else if (hasReduxErrors) {
        errorMessage = this.props.reduxErrors[0].message;
        errorType = this.props.reduxErrors[0].type;
      }

      return (
        <View style={containerStyle}>
          <Text style={titleStyle}>
            {this.props.title || '⚠️ Error Occurred'}
          </Text>
          <Text style={messageStyle}>{errorMessage}</Text>
          
          <View style={buttonContainerStyle}>
            {this.props.onReduxErrorRetry && errorType !== 'react' ? (
              <TouchableOpacity 
                style={retryButtonStyle} 
                onPress={() => this.props.onReduxErrorRetry!(errorType)}
              >
                <Text style={retryButtonTextStyle}>
                  {this.props.retryText || 'Retry'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={retryButtonStyle} onPress={this.handleRetry}>
                <Text style={retryButtonTextStyle}>
                  {this.props.retryText || 'Reset'}
                </Text>
              </TouchableOpacity>
            )}
            

          </View>

          {this.props.showDebugInfo && __DEV__ && this.state.error && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <ScrollView 
                style={styles.debugScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  debugContainer: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
    maxHeight: 200, // Limit height to prevent UI disruption
  },
  debugScrollView: {
    maxHeight: 150, // Scrollable area height
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  retryInfo: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default ErrorBoundary;
