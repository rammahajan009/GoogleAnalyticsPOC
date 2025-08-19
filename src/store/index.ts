import { configureStore } from '@reduxjs/toolkit';
import { all } from 'redux-saga/effects';

// Import reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Import sagas
import { authSaga } from './sagas/authSaga';
import { userSaga } from './sagas/userSaga';

const createSagaMiddleware = require('redux-saga').default

// Root saga
function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
  ]);
}

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
});

// Run saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
