import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './index';
import { withErrorBoundary } from '../utils/http-client/withErrorBoundary';

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  );
};

export default Provider;
