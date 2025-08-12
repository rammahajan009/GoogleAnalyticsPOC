import React, { useState, useRef, useEffect, forwardRef, ForwardedRef, useImperativeHandle } from 'react';
import {
  View,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

interface StickyScrollViewRef {
  scrollTo: (y: number, animated?: boolean) => void;
  scrollToComponent: (componentRef: React.RefObject<View>, animated?: boolean, offset?: number) => void;
  scrollToTop: (animated?: boolean) => void;
  scrollToBottom: (animated?: boolean) => void;
}

interface StickyScrollViewProps {
  topContent: React.ReactNode;
  buttonContent: React.ReactNode;
  bottomContent: React.ReactNode;
  stickyHeaderIndices?: number[];
}

const StickyScrollView = forwardRef<StickyScrollViewRef, StickyScrollViewProps>(({
  topContent,
  buttonContent,
  bottomContent,
  stickyHeaderIndices,
}, ref) => {
  const [isButtonStuck, setIsButtonStuck] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [cachedButtonHeight, setCachedButtonHeight] = useState(0);
  const [topContentHeight, setTopContentHeight] = useState(0);
  const buttonRef = useRef<View>(null);
  const topContentRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const lastScrollDirection = useRef<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  const screenHeight = Dimensions.get('window').height;

  // Expose scrollTo methods to parent
  useImperativeHandle(ref, () => ({
    scrollTo: (y: number, animated: boolean = true) => {
      scrollViewRef.current?.scrollTo({ y, animated });
    },
    scrollToComponent: (componentRef: React.RefObject<View>, animated: boolean = true, offset: number = 0) => {
      if (componentRef.current) {
        componentRef.current.measure((x, y, width, height, pageX, pageY) => {
          const scrollY = pageY + offset;
          scrollViewRef.current?.scrollTo({ y: scrollY, animated });
        });
      }
    },
    scrollToTop: (animated: boolean = true) => {
      scrollViewRef.current?.scrollTo({ y: 0, animated });
    },
    scrollToBottom: (animated: boolean = true) => {
      scrollViewRef.current?.scrollToEnd({ animated });
    },
  }));

  // Initialize button state based on position
  useEffect(() => {
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          const buttonCenterY = pageY + (height / 2);
          const stickyAppearThreshold = buttonCenterY - screenHeight + 50;
          
          if (pageY > stickyAppearThreshold) {
            setIsButtonStuck(true);
            buttonAnimation.setValue(1);
          } else {
            setIsButtonStuck(false);
            buttonAnimation.setValue(0);
          }
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [screenHeight]);



  const measureButtonPosition = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x, y, width, height });
        // Cache the button height when first measured
        if (height > 0 && cachedButtonHeight === 0) {
          setCachedButtonHeight(height);
        }
      });
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const currentScreenHeight = layoutMeasurement.height;
    
    let buttonTopPosition, buttonBottom;
    
    if (buttonLayout.height > 0) {
      buttonTopPosition = buttonLayout.y;
      buttonBottom = buttonTopPosition + buttonLayout.height;
    } else {
      const scrollContentPadding = 20;
      const fallbackHeight = 8 * 95;
      
      buttonTopPosition = (topContentHeight > 0 ? topContentHeight : fallbackHeight) + scrollContentPadding;
      buttonBottom = buttonTopPosition + (cachedButtonHeight || 80); // Use cached height or fallback
    }

    
    const buttonCenterY = buttonTopPosition;
    const stickyAppearThreshold = buttonCenterY - currentScreenHeight + cachedButtonHeight;
    const stickyDisappearThreshold = buttonTopPosition - currentScreenHeight + cachedButtonHeight + 10;
    
    const currentScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';
    
    if (scrollY > stickyDisappearThreshold && currentScrollDirection === 'down' && isButtonStuck) {
      setIsButtonStuck(false);
      buttonAnimation.setValue(0);
      lastScrollDirection.current = 'down';
    } else if (scrollY < stickyAppearThreshold && currentScrollDirection === 'up' && !isButtonStuck) {
      lastScrollDirection.current = 'up';
      setIsButtonStuck(true);
      buttonAnimation.setValue(1);
    }
    
    lastScrollY.current = scrollY;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        stickyHeaderIndices={stickyHeaderIndices}
      >
        {/* Top Content */}
        <View 
          ref={topContentRef} 
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTopContentHeight(height);
          }}
        >
          {topContent}
        </View>

        {/* Button positioned in content */}
        <Animated.View
          ref={buttonRef}
          onLayout={measureButtonPosition}
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
              height: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [cachedButtonHeight || buttonLayout.height || 80, 0],
              }),
              marginVertical: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
              transform: [
                {
                  scale: buttonAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.8],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              if (height > 0 && cachedButtonHeight === 0) {
                setCachedButtonHeight(height);
              }
            }}
          >
            {buttonContent}
          </View>
        </Animated.View>

        {/* Bottom Content */}
        <View>
          {bottomContent}
        </View>
      </ScrollView>

      {/* Sticky Button */}
      <Animated.View
        style={[
          styles.stickyButtonContainer,
          {
            transform: [
              {
                translateY: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
              {
                scale: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: buttonAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <View
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0 && cachedButtonHeight === 0) {
              setCachedButtonHeight(height);
            }
          }}
        >
          {buttonContent}
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StickyScrollView; 