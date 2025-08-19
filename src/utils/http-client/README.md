# HTTP Client Utility

A robust, Axios-based HTTP client utility for React Native projects with built-in error handling, authentication support, and Redux Saga integration.

## 🚀 Features

- **🔐 Authentication**: Bearer token support with automatic header injection
- **🔄 Error Handling**: Comprehensive error formatting and classification
- **📱 React Native Ready**: Optimized for mobile development
- **🎯 TypeScript**: Full TypeScript support with proper type definitions
- **⚡ Performance**: Singleton pattern for efficient resource usage
- **🔧 Configurable**: Environment-based configuration
- **🚨 Error Boundary Integration**: Seamless integration with React Error Boundaries

## 📦 Installation

The HTTP client is already included in your project. No additional installation required.

## 🏗️ Architecture

```
src/utils/http-client/
├── HttpClient.ts          # Core HTTP client class
├── HttpConfig.ts          # Configuration and constants
├── apiService.ts          # API service layer for Redux Saga
├── ErrorBoundary.tsx      # React Error Boundary component
├── withErrorBoundary.tsx  # HOC for wrapping components
└── index.ts              # Module exports
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file
API_BASE_URL=https://api.example.com
HTTP_TIMEOUT=30000
```

### Configuration File

```typescript
// src/utils/http-client/HttpConfig.ts
export const HTTP_CLIENT_CONFIG: HttpClientConfig = {
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.HTTP_TIMEOUT || '30000', 10),
};
```

## 📖 Basic Usage

### 1. Import the HTTP Client

```typescript
import { httpClient } from './utils/http-client';

// Or import specific components
import { HttpClient } from './utils/http-client/HttpClient';
import { ErrorBoundary } from './utils/http-client/ErrorBoundary';
```

### 2. Make API Calls

```typescript
// GET request
const users = await httpClient.get('/users');

// POST request with data
const newUser = await httpClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request with authentication
const updatedUser = await httpClient.put('/users/1', {
  name: 'Jane Doe'
}, 'your-bearer-token');

// DELETE request
await httpClient.delete('/users/1');
```

### 3. Handle Responses

```typescript
try {
  const response = await httpClient.get('/users');
  console.log('Users:', response.data);
} catch (error) {
  if (error.isNetworkError) {
    console.log('Network error occurred');
  } else if (error.isRetryable) {
    console.log('Error is retryable');
  }
}
```

## 🔐 Authentication

### Bearer Token Support

```typescript
// With token
const response = await httpClient.get('/protected-route', 'your-bearer-token');

// Without token (public routes)
const response = await httpClient.get('/public-route');
```

### Automatic Token Injection

The client automatically adds the `Authorization: Bearer {token}` header when a token is provided.

## 🚨 Error Handling

### Error Types

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
  isNetworkError: boolean;
  isRetryable: boolean;
}
```

### Error Classification

- **Network Errors**: Connection failures, timeouts
- **HTTP Errors**: 4xx, 5xx status codes
- **Authentication Errors**: 401, 403 status codes
- **Retryable Errors**: 408, 429, 500, 502, 503, 504

### Error Formatting

```typescript
// All errors are automatically formatted
try {
  await httpClient.get('/users');
} catch (error) {
  console.log(error.message);        // User-friendly message
  console.log(error.isRetryable);    // Whether to retry
  console.log(error.isNetworkError); // Network issue flag
}
```

## 🔄 Redux Saga Integration

### API Service Layer

```typescript
// src/utils/http-client/apiService.ts
export class ApiService {
  static async getUsers() {
    return httpClient.get('/users');
  }
  
  static async createUser(userData: any) {
    return httpClient.post('/users', userData);
  }
}
```

### Saga Usage

```typescript
import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../utils/http-client/apiService';

function* fetchUsersSaga() {
  try {
    const response = yield call(ApiService.getUsers);
    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

export function* userSaga() {
  yield takeLatest('FETCH_USERS_REQUEST', fetchUsersSaga);
}
```

### Error Boundary Integration

```typescript
import { withErrorBoundary } from '../utils/http-client/withErrorBoundary';

const ReduxSagaExample = withErrorBoundary(ReduxSagaExampleContent, {
  title: '🔄 Redux Saga Error',
  retryText: 'Retry',
  showDebugInfo: true,
  reduxErrors: reduxErrors,
  onReduxErrorRetry: handleReduxErrorRetry,
});
```

## 🛡️ Error Boundary

### Basic Usage

```typescript
import { ErrorBoundary } from './utils/http-client/ErrorBoundary';

<ErrorBoundary
  title="Something went wrong"
  retryText="Try Again"
  onRetry={() => handleRetry()}
>
  <YourComponent />
</ErrorBoundary>
```

### HOC Pattern

```typescript
import { withErrorBoundary } from './utils/http-client/withErrorBoundary';

const WrappedComponent = withErrorBoundary(YourComponent, {
  title: 'Error Title',
  retryText: 'Retry',
  showDebugInfo: true,
  onRetry: () => handleRetry(),
});
```

### Redux Error Handling

```typescript
const WrappedComponent = withErrorBoundary(YourComponent, {
  reduxErrors: [
    { message: 'Network error', type: 'auth' },
    { message: 'Timeout error', type: 'user' }
  ],
  onReduxErrorRetry: (errorType: string) => {
    if (errorType === 'auth') dispatch(loginRequest());
    if (errorType === 'user') dispatch(fetchUsersRequest());
  },
});
```

## 🎨 Customization

### Custom Styles

```typescript
const customStyles = {
  container: { backgroundColor: '#f0f0f0' },
  title: { color: '#ff0000' },
  retryButton: { backgroundColor: '#00ff00' },
};

<ErrorBoundary customStyles={customStyles}>
  <YourComponent />
</ErrorBoundary>
```

### Custom Error Messages

```typescript
<ErrorBoundary
  title="Custom Error Title"
  retryText="Custom Retry Text"
>
  <YourComponent />
</ErrorBoundary>
```

## 🔍 Debug Information

Enable debug information to see detailed error details:

```typescript
<ErrorBoundary showDebugInfo={true}>
  <YourComponent />
</ErrorBoundary>
```

Debug info includes:
- Error stack trace
- Component stack
- Error details
- Scrollable content

## 📱 React Native Specific

### Network Security (iOS)

For iOS, ensure your `Info.plist` has proper network security settings:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Metro Bundler

The HTTP client works seamlessly with Metro bundler and React Native's development environment.

## 🧪 Testing

### Unit Tests

```typescript
import { httpClient } from './utils/http-client';

describe('HttpClient', () => {
  it('should make GET request', async () => {
    const response = await httpClient.get('/test');
    expect(response).toBeDefined();
  });
});
```

### Error Testing

```typescript
it('should handle network errors', async () => {
  try {
    await httpClient.get('/invalid-url');
  } catch (error) {
    expect(error.isNetworkError).toBe(true);
  }
});
```

## 🚀 Performance Tips

1. **Singleton Pattern**: The client is already a singleton, no need to create new instances
2. **Token Caching**: Store tokens in AsyncStorage and pass them to the client
3. **Error Boundary**: Use Error Boundaries strategically to prevent app crashes
4. **Debug Mode**: Disable `showDebugInfo` in production

## 🔧 Troubleshooting

### Common Issues

1. **Network Error on iOS**: Check `NSAppTransportSecurity` settings
2. **Timeout Issues**: Adjust `HTTP_TIMEOUT` in configuration
3. **Authentication Errors**: Verify token format and expiration
4. **Error Boundary Not Showing**: Check if errors are being caught by Redux Saga

### Debug Steps

1. Enable debug information in Error Boundary
2. Check console logs for detailed error messages
3. Verify network connectivity
4. Check API endpoint availability

## 📚 API Reference

### HttpClient Methods

- `get(url, token?)` - GET request
- `post(url, data, token?)` - POST request
- `put(url, data, token?)` - PUT request
- `delete(url, token?)` - DELETE request
- `isErrorRetryable(error)` - Check if error is retryable

### ErrorBoundary Props

- `children` - React components to wrap
- `title` - Error title text
- `retryText` - Retry button text
- `showDebugInfo` - Show debug information
- `onRetry` - Retry function
- `reduxErrors` - Redux state errors
- `onReduxErrorRetry` - Redux error retry function
- `customStyles` - Custom styling options

### withErrorBoundary HOC

- `withErrorBoundary(Component, options)` - Wrap component with Error Boundary
- `withErrorBoundaryDecorator(options)` - Decorator pattern for class components

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update this README for new functionality
4. Test thoroughly on both iOS and Android

## 📄 License

This utility is part of your project and follows the same license terms.

---

**Happy coding! 🚀**

For questions or issues, check the error logs and debug information first.
