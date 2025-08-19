import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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

      
      <Text style={styles.title}>🔄 Redux Saga + HTTP Client {Config.API_BASE_URL}</Text>
      <Text style={styles.subtitle}>
        Example of using Redux Saga with the HTTP client utility
      </Text>

      {/* Authentication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Authentication</Text>
        
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
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleLogin}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.userInfo}>
              Welcome, {user?.name || user?.email}!
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleLogout}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {authError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{authError}</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAuthError}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* User Operations Section */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 User Operations</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleFetchUsers}
              disabled={userLoading}
            >
              {userLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Fetch Users</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleFetchProfile}
              disabled={userLoading}
            >
              {userLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Fetch Profile</Text>
              )}
            </TouchableOpacity>
          </View>

          {userError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{userError}</Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearUserError}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Data Display Section */}
      {isAuthenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Data Display</Text>
          
          {/* Current User Profile */}
          {currentUser && (
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Current User Profile:</Text>
              <Text style={styles.dataText}>ID: {currentUser.id}</Text>
              <Text style={styles.dataText}>Name: {currentUser.name}</Text>
              <Text style={styles.dataText}>Email: {currentUser.email}</Text>
            </View>
          )}

          {/* Users List */}
          {users.length > 0 && (
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Users ({users.length}):</Text>
              {users.map((user, index) => (
                <View key={user.id} style={styles.userItem}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>ℹ️ How It Works:</Text>
        <Text style={styles.infoText}>
          1. **Redux Store** - Manages application state{'\n'}
          2. **Redux Saga** - Handles side effects (API calls){'\n'}
          3. **HTTP Client** - Makes actual API requests{'\n'}
          4. **Actions** - Trigger sagas and update state{'\n'}
          5. **Components** - Display data and dispatch actions
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#D70015',
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#D70015',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
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
