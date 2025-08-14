import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';

interface StickyScrollViewRef {
  scrollTo: (y: number, animated?: boolean) => void;
  scrollToComponent: (componentRef: React.RefObject<View>, animated?: boolean, offset?: number) => void;
  scrollToTop: (animated?: boolean) => void;
  scrollToBottom: (animated?: boolean) => void;
  scrollToSection: (sectionName: string, animated?: boolean) => void;
  registerSection: (sectionName: string, yPosition: number) => void;
}

interface StickyScrollViewProps {
  header: React.ReactNode;
  tabs: React.ReactNode;
  top: React.ReactNode;
  buttonContent: React.ReactNode;
  footer: React.ReactNode;
  stickyHeaderIndices?: number[];
  onSectionChange?: (sectionName: string) => void;
}

const StickyScrollView = forwardRef<StickyScrollViewRef, StickyScrollViewProps>(({
  header,
  tabs,
  top,
  buttonContent,
  footer,
  stickyHeaderIndices,
  onSectionChange,
}, ref) => {
  const [isButtonStuck, setIsButtonStuck] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [cachedButtonHeight, setCachedButtonHeight] = useState(0);
  const [cachedButtonCenterY, setCachedButtonCenterY] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<Record<string, number>>({});
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const buttonRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const lastScrollDirection = useRef<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  const screenHeight = Dimensions.get('window').height;

  // Helper function to get current section based on scroll position
  const getCurrentSection = (scrollY: number): string | null => {
    let currentSection: string | null = null;
    let minDistance = Infinity;

    // Adjust scroll position to account for sticky tabs height
    const adjustedScrollY = scrollY + tabsHeight;

    Object.entries(sectionPositions).forEach(([name, position]) => {
      const distance = Math.abs(adjustedScrollY - position);
      if (distance < minDistance) {
        minDistance = distance;
        currentSection = name;
      }
    });

    return currentSection;
  };

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
    scrollToSection: (sectionName: string, animated: boolean = true) => {
      const position = sectionPositions[sectionName];
      if (position !== undefined) {
        // Adjust position to account for sticky tabs height
        const adjustedPosition = Math.max(0, position - tabsHeight);

        setIsProgrammaticScroll(true);
        scrollViewRef.current?.scrollTo({ y: adjustedPosition, animated });

        // Reset the flag after animation completes
        if (animated) {
          setTimeout(() => setIsProgrammaticScroll(false), 300);
        } else {
          setIsProgrammaticScroll(false);
        }
      } else {
        console.warn(`Section '${sectionName}' not found. Available sections:`, Object.keys(sectionPositions));
      }
    },
    registerSection: (sectionName: string, yPosition: number) => {
      setSectionPositions(prev => ({ ...prev, [sectionName]: yPosition }));

    },
  }));

  // Initialize button state based on position
  useEffect(() => {
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          const buttonCenterY = pageY + (height / 2);
          const stickyAppearThreshold = buttonCenterY - screenHeight + 50;

          // Cache the button center Y position
          if (height > 0 && pageY > 0) {
            setCachedButtonCenterY(buttonCenterY);
          }

          if (pageY > stickyAppearThreshold) {
            setIsButtonStuck(true);
          } else {
            setIsButtonStuck(false);
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
        // Cache the button center Y position
        if (height > 0 && pageY > 0) {
          const centerY = pageY + (height / 2);
          setCachedButtonCenterY(centerY);
        }
      });
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const currentScreenHeight = layoutMeasurement.height;

    // Check for section changes and notify parent (only for manual scrolling)
    if (onSectionChange && Object.keys(sectionPositions).length > 0 && !isProgrammaticScroll) {
      const currentSection = getCurrentSection(scrollY);
      if (currentSection) {
        onSectionChange(currentSection);
      }
    }

    let buttonTopPosition, buttonBottom;

    if (buttonLayout.height > 0) {
      buttonTopPosition = buttonLayout.y;
      buttonBottom = buttonTopPosition + buttonLayout.height;
    } else {
      const scrollContentPadding = 20;
              const fallbackHeight = 8 * 95;
        buttonTopPosition = cachedButtonCenterY;
      buttonBottom = buttonTopPosition + (cachedButtonHeight || 80); // Use cached height or fallback
    }

    
    // Use cached button center position when button is not visible
    let buttonCenterY;
    if (buttonLayout.height > 0) {
      buttonCenterY = buttonTopPosition;
    } else {
      // Use cached center position when button layout is not available
      buttonCenterY = cachedButtonCenterY > 0 ? cachedButtonCenterY : buttonTopPosition;
    }
    
    const stickyAppearThreshold = buttonCenterY - currentScreenHeight + cachedButtonHeight;
    const stickyDisappearThreshold = buttonTopPosition - currentScreenHeight + cachedButtonHeight / 2;

    const currentScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';

    if (scrollY > stickyDisappearThreshold && currentScrollDirection === 'down' && isButtonStuck) {
      setIsButtonStuck(false);
      lastScrollDirection.current = 'down';
    } else if (scrollY < stickyAppearThreshold && currentScrollDirection === 'up' && !isButtonStuck) {
      lastScrollDirection.current = 'up';
      setIsButtonStuck(true);
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
        {/* Header - Index 0 */}
        {header}

        {/* Tabs - Index 1 (Will be sticky) */}
        <View
          style={{ width: '100%', alignSelf: 'stretch' }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setTabsHeight(height);
          }}
        >
          {tabs}
        </View>

        {/* Top - Index 2 */}
        {top}

        {/* Button positioned in content */}
        <View
          ref={buttonRef}
          onLayout={measureButtonPosition}
          style={[
            styles.buttonContainer,
            {
              opacity: isButtonStuck ? 0 : 1,
              display: isButtonStuck ? 'none' : 'flex',
              marginVertical: isButtonStuck ? 0 : 30,
            },
          ]}
        >
          <View
            style={styles.buttonContentWrapper}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              if (height > 0 && cachedButtonHeight === 0) {
                setCachedButtonHeight(height);
              }
              // Also cache center position if we have button layout
              if (height > 0 && buttonLayout.y > 0) {
                const centerY = buttonLayout.y + (height / 2);
                setCachedButtonCenterY(centerY);
              }
            }}
          >
            {buttonContent}
          </View>
        </View>

        {/* Footer */}
        {footer}
      </ScrollView>

      {/* Sticky Button */}
      {isButtonStuck && (
        <View style={styles.stickyButtonContainer}>
          <View
            style={styles.buttonContentWrapper}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              if (height > 0 && cachedButtonHeight === 0) {
                setCachedButtonHeight(height);
              }
              // Also cache center position if we have button layout
              if (height > 0 && buttonLayout.y > 0) {
                const centerY = buttonLayout.y + (height / 2);
                setCachedButtonCenterY(centerY);
              }
            }}
          >
            {buttonContent}
          </View>
        </View>
      )}
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
    width: '100%',
    alignSelf: 'stretch',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  stickyButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  buttonContentWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
});

export default StickyScrollView; 