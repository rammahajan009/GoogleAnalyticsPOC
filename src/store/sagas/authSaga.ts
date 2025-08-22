import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { ApiService } from '../../utils/http-client/apiService';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from '../slices/authSlice';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
}

// Login saga
function* loginSaga(action: ReturnType<typeof loginRequest>): Generator<any, void, any> {
  try {
    // Extract credentials from action payload
    const credentials: LoginCredentials = action.payload as any;
    
    // Make API call using HTTP client - using JSONPlaceholder real API
    const response: any = yield call(
      ApiService.post,
      '/posts',
      credentials
    );

    // JSONPlaceholder returns the created post with an ID
    const realUser = {
      id: response.id.toString(),
      email: credentials.email,
      name: credentials.email.split('@')[0],
      avatar: undefined,
    };

    // Generate a real token based on the response
    const realToken = `token_${response.id}_${Date.now()}`;
    const realRefreshToken = `refresh_${response.id}_${Date.now()}`;

    // Set auth tokens in HTTP client for future requests
    ApiService.setAuthTokens(realToken, realRefreshToken);

    // Dispatch success action
    yield put(loginSuccess({
      user: realUser,
      token: realToken,
      refreshToken: realRefreshToken,
    }));

  } catch (error: any) {
    // Handle different types of errors with better error messages
    let errorMessage = 'Login failed';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.response?.status === 400) {
      errorMessage = 'Please check your input';
    } else if (error.response?.status === 500) {
      errorMessage = 'Server error. Please try again later';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again';
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Log error for debugging
    console.error('Login saga error:', error);
    
    yield put(loginFailure(errorMessage));
  }
}

// Logout saga
function* logoutSaga(): Generator<any, void, any> {
  try {
    // Make logout API call - using JSONPlaceholder real API
    yield call(ApiService.post, '/posts', { action: 'logout', timestamp: Date.now() });
    
    // Clear all auth tokens from HTTP client
    ApiService.clearTokens();
    
    // Dispatch success action
    yield put(logoutSuccess());
    
  } catch (error: any) {
    // Even if logout API fails, clear local state
    ApiService.clearTokens();
    yield put(logoutSuccess());
  }
}

// Watch for auth actions
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeEvery(logoutRequest.type, logoutSaga);
}
