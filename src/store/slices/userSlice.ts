import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authSlice';

// Types
export interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Fetch users actions
    fetchUsersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action: PayloadAction<User[]>) => {
      state.isLoading = false;
      state.users = action.payload;
      state.error = null;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch user profile actions
    fetchUserProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    fetchUserProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update user actions
    updateUserRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      // Update in users array if exists
      const userIndex = state.users.findIndex(u => u.id === action.payload.id);
      if (userIndex !== -1) {
        state.users[userIndex] = action.payload;
      }
      state.error = null;
    },
    updateUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear error
    clearUserError: (state) => {
      state.error = null;
    },

    // Reset state
    resetUserState: (state) => {
      state.users = [];
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserProfileRequest,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  clearUserError,
  resetUserState,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
