import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { ApiService } from '../../utils/http-client/apiService';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
} from '../slices/authSlice';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

// Helper functions
function createUserFromResponse(response: any, credentials: LoginCredentials) {
  return {
    id: response.id.toString(),
    email: credentials.email,
    name: credentials.email.split('@')[0],
    avatar: undefined,
  };
}

function generateTokens(response: any) {
  const timestamp = Date.now();
  return {
    token: `token_${response.id}_${timestamp}`,
    refreshToken: `refresh_${response.id}_${timestamp}`,
  };
}

function getErrorMessage(error: any): string {
  if (error.response?.status === 401) return 'Invalid email or password';
  if (error.response?.status === 400) return 'Please check your input';
  if (error.response?.status === 500) return 'Server error. Please try again later';
  if (error.code === 'ERR_NETWORK') return 'Network error. Please check your connection';
  if (error.code === 'ECONNABORTED') return 'Request timeout. Please try again';
  return error.message || 'Unknown error occurred';
}

// Login saga
function* loginSaga(action: ReturnType<typeof loginRequest>): Generator<any, void, any> {
  try {
    const credentials: LoginCredentials = action.payload as any;
    const response: any = yield call(ApiService.post, '/posts', credentials);
    
    const realUser = createUserFromResponse(response, credentials);
    const { token: realToken, refreshToken: realRefreshToken } = generateTokens(response);
    
    ApiService.setAuthTokens(realToken, realRefreshToken);
    yield put(loginSuccess({ user: realUser, token: realToken, refreshToken: realRefreshToken }));

  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    console.error('Login saga error:', error);
    console.error(`Login failed: ${errorMessage}`);
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
    console.error('Logout saga error:', error);
    console.warn(`Logout API failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}, but clearing local state anyway`);
    
    ApiService.clearTokens();
    yield put(logoutSuccess());
  }
}

// Watch for auth actions
export function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeEvery(logoutRequest.type, logoutSaga);
}
