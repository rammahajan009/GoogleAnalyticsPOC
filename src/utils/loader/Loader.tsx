import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  AccessibilityInfo,
} from 'react-native';
import { ModalManager, ModalType } from '../ModalManager';

export interface LoaderProps {
  visible: boolean;
  size?: 'small' | 'large';
  id?: string;
}

const Loader: React.FC<LoaderProps> = React.memo(({
  visible,
  size = 'large',
  id = 'default-loader',
}) => {
  // Register with ModalManager and get z-index
  const zIndex = useMemo(() => {
    if (visible) {
      return ModalManager.register(id, ModalType.LOADER, visible);
    } else {
      ModalManager.unregister(id);
      return null;
    }
  }, [id, visible]);

  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility('Loading');
    }
  }, [visible]);

  // Memoize accessibility props to prevent object recreation
  const accessibilityProps = useMemo(() => ({
    accessible: true,
    accessibilityLabel: "Loader",
    accessibilityHint: "Loading in progress",
    accessibilityRole: "progressbar" as const,
    accessibilityLiveRegion: "polite" as const,
    importantForAccessibility: "yes" as const,
  }), []);

  // Memoize ActivityIndicator props
  const activityIndicatorProps = useMemo(() => ({
    size,
    color: "#007AFF",
    accessible: true,
    accessibilityLabel: "Loading spinner",
    accessibilityRole: "progressbar" as const,
  }), [size]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.loaderContainer,
        zIndex ? { zIndex } : undefined,
      ]}
      {...accessibilityProps}
    >
      <ActivityIndicator {...activityIndicatorProps} />
    </View>
  );
});

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loader;
