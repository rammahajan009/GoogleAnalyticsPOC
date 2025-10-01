import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

export const defaultEmptyDotSize = 8;

export interface EmptyDotProps {
  sizeRatio?: number;
}

const EmptyDot: React.FC<EmptyDotProps> = React.memo(({ sizeRatio = 1.0 }) => {
  const dotStyle = useMemo(() => ({
    width: defaultEmptyDotSize * sizeRatio,
    height: defaultEmptyDotSize * sizeRatio,
  }), [sizeRatio]);
  
  return (
    <View
      style={[styles.emptyDot, dotStyle]}
    />
  );
});

EmptyDot.displayName = 'EmptyDot';

const styles = StyleSheet.create({
  emptyDot: {
    // Empty dot for spacing
  },
});

export default EmptyDot;
