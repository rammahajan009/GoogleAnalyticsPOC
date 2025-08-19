import { call, put, takeLatest } from 'redux-saga/effects';
import { ApiService } from '../../utils/http-client/apiService';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserProfileRequest,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
} from '../slices/userSlice';
import { User } from '../slices/authSlice';

// Fetch users saga
function* fetchUsersSaga(): Generator<any, void, any> {
  try {
    // Make API call using HTTP client - using JSONPlaceholder real API
    const users: User[] = yield call(ApiService.get, '/users');
    
    // JSONPlaceholder returns real user data, transform it to match our User interface
    const realUsers: User[] = users.map(user => ({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      avatar: undefined, // JSONPlaceholder doesn't provide avatars
    }));
    
    // Dispatch success action
    yield put(fetchUsersSuccess(realUsers));
    
  } catch (error: any) {
    // Handle different types of errors with better error messages
    let errorMessage = 'Failed to fetch users';
    
    if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please login again';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied';
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
    console.error('Fetch users saga error:', error);
    
    yield put(fetchUsersFailure(errorMessage));
  }
}

// Fetch user profile saga
function* fetchUserProfileSaga(): Generator<any, void, any> {
  try {
    // Make API call using HTTP client - using JSONPlaceholder real API
    const user: any = yield call(ApiService.get, '/users/1');
    
    // JSONPlaceholder returns real user data, transform it to match our User interface
    const realUser: User = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      avatar: undefined, // JSONPlaceholder doesn't provide avatars
    };
    
    // Dispatch success action
    yield put(fetchUserProfileSuccess(realUser));
    
  } catch (error: any) {
    // Handle different types of errors
    let errorMessage = 'Failed to fetch user profile';
    
    if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please login again';
    } else if (error.response?.status === 404) {
      errorMessage = 'User profile not found';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection';
    } else if (error.message) {
      errorMessage = error.message;
    }

    yield put(fetchUserProfileFailure(errorMessage));
  }
}

// Update user saga
function* updateUserSaga(action: ReturnType<typeof updateUserRequest>): Generator<any, void, any> {
  try {
    const userData: Partial<User> = action.payload as any;
    
    // Make API call using HTTP client - using JSONPlaceholder real API
    const response: any = yield call(
      ApiService.put,
      `/users/${userData.id || 1}`,
      userData
    );
    
    // JSONPlaceholder returns the updated user data
    const updatedUser: User = {
      id: response.id.toString(),
      email: response.email || userData.email || 'user@example.com',
      name: response.name || userData.name || 'Updated User',
      avatar: undefined, // JSONPlaceholder doesn't provide avatars
    };
    
    // Dispatch success action
    yield put(updateUserSuccess(updatedUser));
    
  } catch (error: any) {
    // Handle different types of errors
    let errorMessage = 'Failed to update user';
    
    if (error.response?.status === 400) {
      errorMessage = 'Invalid data. Please check your input';
    } else if (error.response?.status === 401) {
      errorMessage = 'Unauthorized. Please login again';
    } else if (error.response?.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection';
    } else if (error.message) {
      errorMessage = error.message;
    }

    yield put(updateUserFailure(errorMessage));
  }
}

// Watch for user actions
export function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserProfileRequest.type, fetchUserProfileSaga);
  yield takeLatest(updateUserRequest.type, updateUserSaga);
}
