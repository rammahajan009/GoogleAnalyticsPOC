import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginRequest,
  logoutRequest,
  clearError,
} from '../store/slices/authSlice';
import {
  fetchUsersRequest,
  fetchUserProfileRequest,
  clearUserError,
} from '../store/slices/userSlice';
import { withErrorBoundary } from '../utils/http-client/withErrorBoundary';
import { Config } from 'react-native-config';
import Typography from './Typography';
import Button from './Button';
import { ResponsiveStyleSheet } from '../utils/ResponsiveStyle/ResponsiveStyleSheet';

const ReduxSagaExampleContent: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Auth state
  const { user, isAuthenticated, isLoading: authLoading, error: authError } = useAppSelector(state => state.auth);
  
  // User state
  const { users, currentUser, isLoading: userLoading, error: userError } = useAppSelector(state => state.user);

  // Local state
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');

  // Handle login
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    dispatch(loginRequest({ email, password }));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  // Handle fetch users
  const handleFetchUsers = () => {
    dispatch(fetchUsersRequest());
  };

  // Handle fetch user profile
  const handleFetchProfile = () => {
    dispatch(fetchUserProfileRequest());
  };

  // Clear errors
  const handleClearAuthError = () => {
    dispatch(clearError());
  };

  const handleClearUserError = () => {
    dispatch(clearUserError());
  };

  // Auto-fetch users when authenticated
  useEffect(() => {
    if (isAuthenticated && users.length === 0) {
      handleFetchUsers();
    }
  }, [isAuthenticated]);

  return (
    <ScrollView style={styles.container}>
      <Typography h2 style={styles.title}>
        🔄 Redux Saga + HTTP Client {Config.API_BASE_URL}
      </Typography>
      
      <Typography body2 style={styles.subtitle}>
        Example of using Redux Saga with the HTTP client utility
      </Typography>

      {/* Authentication Section */}
      <View style={styles.section}>
        <Typography h2 style={styles.sectionTitle}>
          🔐 Authentication
        </Typography>
        
        {!isAuthenticated ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button
              primary
              onPress={handleLogin}
              loading={authLoading}
              fullWidth
            >
              Find a Job
            </Button>
          </View>
        ) : (
          <View>
            <Typography body1 style={styles.userInfo}>
              Welcome, {user?.name || user?.email}!
            </Typography>
            <Button
              primary
              onPress={handleLogout}
              loading={authLoading}
              fullWidth
            >
              Logout
            </Button>
          </View>
        )}

        {authError && (
          <View style={styles.errorContainer}>
            <Typography body2 style={styles.errorText}>
              {authError}
            </Typography>
            <Button
              ghost
              small
              onPress={handleClearAuthError}
            >
              ✕
            </Button>
          </View>
        )}
      </View>

      {/* User Operations Section */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Typography h2 style={styles.sectionTitle}>
            👥 User Operations
          </Typography>
          
          <View style={styles.buttonRow}>
            <Button
              outline
              borderRadius='none'
              onPress={handleFetchUsers}
              loading={userLoading}
            >
              Fetch Users
            </Button>

            <Button
              primary
              borderRadius='none'
              onPress={handleFetchProfile}
              loading={userLoading}
            >
              Fetch Profile
            </Button>
          </View>

          {userError && (
            <View style={styles.errorContainer}>
              <Typography body2 style={styles.errorText}>
                {userError}
              </Typography>
                          <Button
              ghost
              small
              onPress={handleClearUserError}
            >
              ✕
            </Button>
            </View>
          )}
        </View>
      )}

      {/* Data Display Section */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Typography h2 style={styles.sectionTitle}>
            📊 Data Display
          </Typography>
          
          {/* Current User Profile */}
          {currentUser && (
            <View style={styles.dataContainer}>
              <Typography h3 style={styles.dataTitle}>
                Current User Profile:
              </Typography>
              <Typography body2 style={styles.dataText}>
                ID: {currentUser.id}
              </Typography>
              <Typography body2 style={styles.dataText}>
                Name: {currentUser.name}
              </Typography>
              <Typography body2 style={styles.dataText}>
                Email: {currentUser.email}
              </Typography>
            </View>
          )}

          {/* Users List */}
          {users.length > 0 && (
            <View style={styles.dataContainer}>
              <Typography h3 style={styles.dataTitle}>
                Users ({users.length}):
              </Typography>
              {users.map((user, index) => (
                <View key={user.id} style={styles.userItem}>
                  <Typography body1 style={styles.userName}>
                    {user.name}
                  </Typography>
                  <Typography caption style={styles.userEmail}>
                    {user.email}
                  </Typography>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Typography h2 style={styles.infoTitle}>
          ℹ️ How It Works:
        </Typography>
        <Typography body1 style={styles.infoText}>
          1. **Redux Store** - Manages application state{'\n'}
          2. **Redux Saga** - Handles side effects (API calls){'\n'}
          3. **HTTP Client** - Makes actual API requests{'\n'}
          4. **Actions** - Trigger sagas and update state{'\n'}
          5. **Components** - Display data and dispatch actions
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ResponsiveStyleSheet.responsiveSpacing(5),
    backgroundColor: ResponsiveStyleSheet.getThemeColors().surface,
  },
  title: {
    textAlign: 'center',
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(2),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(6),
    color: ResponsiveStyleSheet.getThemeColors().textSecondary,
  },
  section: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().surface,
    padding: ResponsiveStyleSheet.responsiveSpacing(5),
    borderRadius: ResponsiveStyleSheet.responsiveBorderRadius('lg'),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(5),
    ...ResponsiveStyleSheet.responsiveShadow('base'),
  },
  sectionTitle: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  input: {
    borderWidth: 1,
    borderColor: ResponsiveStyleSheet.getThemeColors().placeholder,
    borderRadius: ResponsiveStyleSheet.responsiveBorderRadius('md'),
    padding: ResponsiveStyleSheet.responsiveSpacing(3),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    fontSize: ResponsiveStyleSheet.typography('base'),
    backgroundColor: ResponsiveStyleSheet.getThemeColors().surface,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ResponsiveStyleSheet.responsiveSpacing(3),
  },
  userInfo: {
    color: ResponsiveStyleSheet.getThemeColors().text,
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().error + '20', // 20% opacity
    padding: ResponsiveStyleSheet.responsiveSpacing(2),
    borderRadius: ResponsiveStyleSheet.responsiveBorderRadius('md'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: ResponsiveStyleSheet.getThemeColors().error,
  },
  errorText: {
    color: ResponsiveStyleSheet.getThemeColors().error,
    flex: 1,
    marginRight: ResponsiveStyleSheet.responsiveSpacing(2),
  },

  dataContainer: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().background,
    padding: ResponsiveStyleSheet.responsiveSpacing(4),
    borderRadius: ResponsiveStyleSheet.responsiveBorderRadius('md'),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
  },
  dataTitle: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(2),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  dataText: {
    color: ResponsiveStyleSheet.getThemeColors().textSecondary,
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(1),
  },
  userItem: {
    padding: ResponsiveStyleSheet.responsiveSpacing(2),
    borderBottomWidth: 1,
    borderBottomColor: ResponsiveStyleSheet.getThemeColors().placeholder,
  },
  userName: {
    color: ResponsiveStyleSheet.getThemeColors().text,
    fontWeight: '600',
  },
  userEmail: {
    color: ResponsiveStyleSheet.getThemeColors().textSecondary,
  },
  infoSection: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().primary + '10', // 10% opacity
    padding: ResponsiveStyleSheet.responsiveSpacing(5),
    borderRadius: ResponsiveStyleSheet.responsiveBorderRadius('lg'),
    borderLeftWidth: 4,
    borderLeftColor: ResponsiveStyleSheet.getThemeColors().primary,
  },
  infoTitle: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(2),
    color: ResponsiveStyleSheet.getThemeColors().primary,
  },
  infoText: {
    color: ResponsiveStyleSheet.getThemeColors().primary,
    lineHeight: ResponsiveStyleSheet.lineHeight(16, 1.4),
  },
});



// Create the wrapped component with Error Boundary
// Create a wrapper component that has access to Redux state
const ReduxSagaExampleWrapper: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Auth state
  const { error: authError } = useAppSelector(state => state.auth);
  
  // User state
  const { error: userError } = useAppSelector(state => state.user);

  // Prepare Redux errors for Error Boundary
  const reduxErrors: Array<{ message: string; type: string }> = [];
  if (authError) {
    reduxErrors.push({ message: authError, type: 'auth' });
  }
  if (userError) {
    reduxErrors.push({ message: userError, type: 'user' });
  }

  // Handle Redux error retry
  const handleReduxErrorRetry = (errorType: string) => {
    console.log('🔄 Retry triggered for error type:', errorType);
    console.log('🔄 Current reduxErrors:', reduxErrors);
    
    if (errorType === 'auth') {
      console.log('🔄 Dispatching loginRequest...');
      dispatch(loginRequest({ email: 'user@example.com', password: 'password123' }));
    } else if (errorType === 'user') {
      console.log('🔄 Dispatching fetchUsersRequest...');
      dispatch(fetchUsersRequest());
    }
  };

  // Wrap the content with Error Boundary
  const WrappedContent = withErrorBoundary(ReduxSagaExampleContent, {
    onError: (error: Error, errorInfo: React.ErrorInfo) => {
      console.error('ReduxSagaExample Error:', error, errorInfo);
    },
    title: '🔄 Redux Saga Error',
    retryText: 'Retry',
    showDebugInfo: true,
    // Pass Redux errors to Error Boundary
    reduxErrors: reduxErrors,
    onReduxErrorRetry: handleReduxErrorRetry,
  });

  return <WrappedContent />;
};

const ReduxSagaExample = ReduxSagaExampleWrapper;

export default ReduxSagaExample;
