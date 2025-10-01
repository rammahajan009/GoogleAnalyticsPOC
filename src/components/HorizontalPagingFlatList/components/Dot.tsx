import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import EmptyDot from './EmptyDot';
import { getDotStyle } from '../util/DotUtils';

// Custom hook to get previous value
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = React.useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface DotProps {
  idx: number;
  curPage: number;
  maxPage: number;
  activeColor: string;
  inactiveColor?: string;
  sizeRatio: number;
}

const Dot: React.FC<DotProps> = React.memo((props) => {
  const { idx, curPage, maxPage, activeColor, inactiveColor, sizeRatio } = props;
  
  const [animVal] = useState(new Animated.Value(1)); // Start at 1 to prevent initial flicker
  
  const initialType = useMemo(() => 
    getDotStyle({ idx, curPage, maxPage }), 
    [idx, curPage, maxPage]
  );
  
  const [type, setType] = useState(initialType);

  const initialDotColor = useMemo(() => {
    if (curPage === idx) {
      return activeColor;
    }
    return inactiveColor ?? activeColor;
  }, [curPage, idx, activeColor, inactiveColor]);

  const [dotColor, setDotColor] = useState<string>(initialDotColor);

  const prevType = usePrevious(type);
  const prevDotColor = usePrevious<string>(dotColor);

  const nextType = useMemo(() => 
    getDotStyle({ idx, curPage, maxPage }), 
    [idx, curPage, maxPage]
  );

  const nextDotColor = useMemo(() => 
    curPage === idx ? activeColor : (inactiveColor ?? activeColor),
    [curPage, idx, activeColor, inactiveColor]
  );

  const needsAnimation = useMemo(() => 
    nextType.size !== (prevType?.size || 3) ||
    nextType.opacity !== (prevType?.opacity || 0.2),
    [nextType.size, nextType.opacity, prevType?.size, prevType?.opacity]
  );

  const startAnimation = useCallback(() => {
    animVal.setValue(0);
    setType(nextType);
    setDotColor(nextDotColor);
    
    Animated.timing(animVal, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [animVal, nextType, nextDotColor]);

  const updateStatesOnly = useCallback(() => {
    setType(nextType);
    setDotColor(nextDotColor);
  }, [nextType, nextDotColor]);

  useEffect(() => {
    if (needsAnimation) {
      startAnimation();
    } else {
      updateStatesOnly();
    }
  }, [needsAnimation, startAnimation, updateStatesOnly]);

  const animStyle = useMemo(() => {
    const size = animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (prevType?.size || 3) * sizeRatio,
        type.size * sizeRatio,
      ],
    });

    const backgroundColor = animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [prevDotColor ?? activeColor, dotColor],
    });

    return {
      width: size,
      height: size,
      backgroundColor,
      borderRadius: animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [
          (prevType?.size || 3) * sizeRatio * 0.5,
          type.size * sizeRatio * 0.5,
        ],
      }),
      opacity: animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [prevType?.opacity || 0.2, type.opacity],
      }),
    };
  }, [
    animVal,
    dotColor,
    prevDotColor,
    prevType?.opacity,
    prevType?.size,
    activeColor,
    sizeRatio,
    type.opacity,
    type.size,
  ]);

  const shouldShowEmptyDot = useMemo(() => {
    if (curPage < 3) {
      return idx >= 5;
    } else if (curPage < 4) {
      return idx > 5;
    }
    return false;
  }, [curPage, idx]);

  const containerStyle = useMemo(() => ({
    margin: 3 * sizeRatio,
  }), [sizeRatio]);

  if (shouldShowEmptyDot) {
    return <EmptyDot sizeRatio={sizeRatio} />;
  }

  return (
    <Animated.View
      style={[containerStyle, animStyle]}
    />
  );
});

Dot.displayName = 'Dot';

export default Dot;
