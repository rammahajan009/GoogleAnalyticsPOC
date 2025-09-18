import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { loader, LoaderInstance } from './LoaderService';
import Loader from './Loader';

const LoaderProvider: React.FC = React.memo(() => {
  const [currentLoader, setCurrentLoader] = useState<LoaderInstance | null>(null);

  // Memoize the subscription callback to prevent unnecessary re-subscriptions
  const handleLoaderChange = useCallback((loaderInstance: LoaderInstance | null) => {
    setCurrentLoader(loaderInstance);
  }, []);

  useEffect(() => {
    const unsubscribe = loader.subscribe(handleLoaderChange);
    return unsubscribe;
  }, [handleLoaderChange]);

  // Memoize the loader props to prevent unnecessary re-renders of Loader component
  const loaderProps = useMemo(() => {
    if (!currentLoader) return null;
    
    return {
      visible: currentLoader.visible,
      size: currentLoader.options.size,
      id: currentLoader.id,
    };
  }, [currentLoader?.visible, currentLoader?.options.size, currentLoader?.id]);

  if (!currentLoader || !loaderProps) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Loader {...loaderProps} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
});

export default LoaderProvider;
