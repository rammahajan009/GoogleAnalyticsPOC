import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
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
  registerSection: (sectionName: string, yPosition: number, height?: number) => void;
  registerFooterSection: (sectionName: string, yPosition: number, height?: number) => void;
}

interface StickyScrollViewProps {
  header: React.ReactNode;
  tabs: React.ReactNode;
  top: React.ReactNode;
  buttonContent: React.ReactNode;
  footer: React.ReactNode;
  stickyHeaderIndices?: number[];
  onSectionChange?: (sectionName: string) => void;
  externalOffset?: number;
}

const StickyScrollView = forwardRef<StickyScrollViewRef, StickyScrollViewProps>(({
  header,
  tabs,
  top,
  buttonContent,
  footer,
  stickyHeaderIndices,
  onSectionChange,
  externalOffset = 0,
}, ref) => {
  const [isButtonStuck, setIsButtonStuck] = useState(false);
  const [cachedButtonHeight, setCachedButtonHeight] = useState(0);
  const [cachedButtonCenterY, setCachedButtonCenterY] = useState(0);
  const [sectionPositions, setSectionPositions] = useState<Record<string, { y: number; height: number; isFooter?: boolean }>>({});
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const [tabsHeight, setTabsHeight] = useState(0);
  const buttonRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const lastScrollDirection = useRef<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);
  const currentSectionRef = useRef<string | null>(null);
  const debouncedSectionChange = useRef<NodeJS.Timeout | null>(null);

  const screenHeight = Dimensions.get('window').height;

  // Function to calculate section heights dynamically
  const calculateSectionHeights = useCallback((sections: Record<string, { y: number; isFooter?: boolean }>) => {
    const sortedSections = Object.entries(sections).sort(([, a], [, b]) => a.y - b.y);
    
    const updatedSections: Record<string, { y: number; height: number; isFooter?: boolean }> = {};
    
    for (let i = 0; i < sortedSections.length; i++) {
      const [name, sectionData] = sortedSections[i];
      const nextSection = sortedSections[i + 1];
      
      let height = 200; // Default height
      
      // Calculate height from current section to next section
      if (nextSection) {
        height = nextSection[1].y - sectionData.y;
      }
      
      updatedSections[name] = {
        ...sectionData,
        height
      };
    }
    
    return updatedSections;
  }, []);

  // Helper function to get current section based on scroll position
  const getCurrentSection = useCallback((scrollY: number): string | null => {
    const sectionKeys = Object.keys(sectionPositions);
    if (sectionKeys.length === 0) return null;
    
    // Adjust scroll position to account for sticky tabs height
    const adjustedScrollY = scrollY + tabsHeight;
    
    // Find the last section that has started (top is visible) but hasn't completely scrolled out
    let activeSection: string | null = null;
    
    for (const [name, sectionData] of Object.entries(sectionPositions)) {
      const { y: sectionY, height: sectionHeight } = sectionData;
      const sectionBottom = sectionY + sectionHeight;
      
      // A section is considered active if:
      // 1. Its top has passed the current scroll position (section has started)
      // 2. Its bottom hasn't passed the current scroll position (section hasn't completely scrolled out)
      if (sectionY <= adjustedScrollY && sectionBottom > adjustedScrollY) {
        activeSection = name;
      }
    }

    // If no section is currently visible, find the closest section that should be active
    if (!activeSection) {
      let minDistance = Infinity;
      
      for (const [name, sectionData] of Object.entries(sectionPositions)) {
        const { y: sectionY } = sectionData;
        const distance = Math.abs(adjustedScrollY - sectionY);
        if (distance < minDistance) {
          minDistance = distance;
          activeSection = name;
        }
      }
    }

    return activeSection;
  }, [sectionPositions, tabsHeight]);

  // Debounced section change handler to reduce excessive callbacks
  const handleSectionChange = useCallback((sectionName: string) => {
    if (debouncedSectionChange.current) {
      clearTimeout(debouncedSectionChange.current);
    }
    
    debouncedSectionChange.current = setTimeout(() => {
      onSectionChange?.(sectionName);
    }, 50); // Reduced from 100ms to 50ms for better responsiveness
  }, [onSectionChange]);

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
      const sectionData = sectionPositions[sectionName];
      if (sectionData !== undefined) {
        // Adjust position to account for sticky tabs height
        const adjustedPosition = Math.max(0, sectionData.y - tabsHeight);

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
    registerSection: (sectionName: string, yPosition: number, height: number = 0) => {
      setSectionPositions(prev => {
        const newSections = { ...prev, [sectionName]: { y: yPosition, height: 0, isFooter: false } };
        return calculateSectionHeights(newSections);
      });
    },
    registerFooterSection: (sectionName: string, yPosition: number, height: number = 0) => {
      setSectionPositions(prev => {
        const newSections = { ...prev, [sectionName]: { y: yPosition, height: 0, isFooter: true } };
        return calculateSectionHeights(newSections);
      });
    },
  }));

  // Initialize button state based on position
  useEffect(() => {
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          const buttonCenterY = pageY + (height / 2);
          const stickyAppearThreshold = buttonCenterY - screenHeight + 50;

          // Only cache the button center Y position if not already cached
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
    }, 50); // Reduced from 100ms to 50ms for faster initialization

    return () => {
      clearTimeout(timer);
      // Clean up debounced section change timeout
      if (debouncedSectionChange.current) {
        clearTimeout(debouncedSectionChange.current);
      }
    };
  }, [screenHeight]);

  // Recalculate footer section positions when button height becomes available
  useEffect(() => {
    if (cachedButtonHeight > 0) {
      setSectionPositions(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].isFooter) {
            updated[key] = {
              ...updated[key],
              y: updated[key].y - cachedButtonHeight
            };
          }
        });
        return calculateSectionHeights(updated);
      });
    }
  }, [cachedButtonHeight, calculateSectionHeights]);


  const measureButtonPosition = useCallback(() => {
    if (!buttonRef.current) return;
    
    buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Cache the button height when first measured
      if (height > 0 && cachedButtonHeight === 0) {
        setCachedButtonHeight(height);
      }
    });
  }, [cachedButtonHeight]);

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const currentScreenHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;

    // Early return if no thresholds calculated yet
    if (cachedButtonCenterY === 0 || cachedButtonHeight === 0) return;

    // Check for section changes and notify parent (only for manual scrolling)
    if (onSectionChange && Object.keys(sectionPositions).length > 0 && !isProgrammaticScroll) {
      let currentSection = getCurrentSection(scrollY);
      
      // Special case: If scrolled to the end, always activate the last section
      if (contentHeight > 0) {
        const availableScrollHeight = currentScreenHeight;
        const distanceFromEnd = contentHeight - (scrollY + availableScrollHeight);
        
        // If we're within 100px of the end, activate the last section
        if (distanceFromEnd < 100) {
          const sortedSections = Object.entries(sectionPositions).sort(([, a], [, b]) => a.y - b.y);
          if (sortedSections.length > 0) {
            currentSection = sortedSections[sortedSections.length - 1][0];
          }
        }
      }
      
      if (currentSection && currentSection !== currentSectionRef.current) {
        currentSectionRef.current = currentSection;
        handleSectionChange(currentSection);
      }
    }

    // Use memoized thresholds when available, otherwise calculate dynamically
    let stickyAppearThreshold, stickyDisappearThreshold;
    
    if (cachedButtonCenterY === 0 || cachedButtonHeight === 0) return;

    stickyAppearThreshold = cachedButtonCenterY - currentScreenHeight + cachedButtonHeight / 2 - externalOffset;
    stickyDisappearThreshold = cachedButtonCenterY - currentScreenHeight + cachedButtonHeight / 2 - externalOffset;

    const currentScrollDirection = scrollY > lastScrollY.current ? 'down' : 'up';

    // Only process sticky logic if scroll direction changed or button state needs to change
    const shouldProcessSticky = currentScrollDirection !== lastScrollDirection.current || 
      (scrollY > stickyDisappearThreshold && isButtonStuck) ||
      (scrollY < stickyAppearThreshold && !isButtonStuck);

    if (shouldProcessSticky) {
      if (scrollY > stickyDisappearThreshold && currentScrollDirection === 'down' && isButtonStuck) {
        setIsButtonStuck(false);
        lastScrollDirection.current = 'down';
      } else if (scrollY < stickyAppearThreshold && currentScrollDirection === 'up' && !isButtonStuck) {
        lastScrollDirection.current = 'up';
        setIsButtonStuck(true);
      }
    }

    lastScrollY.current = scrollY;
  }, [onSectionChange, sectionPositions, isProgrammaticScroll, getCurrentSection, handleSectionChange, isButtonStuck, cachedButtonCenterY, cachedButtonHeight, externalOffset]);

  // Optimize onLayout handlers with useCallback
  const handleTabsLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setTabsHeight(height);
  }, []);

  const handleButtonContentLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && cachedButtonHeight === 0) {
      setCachedButtonHeight(height);
    }
  }, [cachedButtonHeight]);

  // Memoize button content to prevent unnecessary re-renders
  const memoizedButtonContent = useMemo(() => (
    <View
      style={styles.buttonContentWrapper}
      onLayout={handleButtonContentLayout}
    >
      {buttonContent}
    </View>
  ), [buttonContent, handleButtonContentLayout]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={8} // Balance between performance and responsiveness
        showsVerticalScrollIndicator={true}
        stickyHeaderIndices={stickyHeaderIndices}
        removeClippedSubviews={true} // Performance optimization for long lists
        keyboardShouldPersistTaps="handled" // Better keyboard handling
      >
        {/* Header - Index 0 */}
        {header}

        {/* Tabs - Index 1 (Will be sticky) */}
        <View
          style={{ width: '100%', alignSelf: 'stretch' }}
          onLayout={handleTabsLayout}
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
            isButtonStuck ? { display: 'none' } : { display: 'flex' },
          ]}
        >
          {memoizedButtonContent}
        </View>

        {/* Footer */}
        {footer}
      </ScrollView>

      {/* Sticky Button */}
      {isButtonStuck && (
        <View style={styles.stickyButtonContainer}>
          <View style={styles.gradientBackground}>
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />
            <View style={styles.gradientLayer4} />
          </View>
          <View style={styles.buttonContent}>
            {memoizedButtonContent}
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
    width: '100%',
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: '#9B9B9B',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  gradientLayer2: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.875)',
  },
  gradientLayer3: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  gradientLayer4: {
    position: 'absolute',
    top: '75%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: 10,
  },
  buttonContentWrapper: {
    width: '100%',
    alignSelf: 'stretch',
  },
});

export default StickyScrollView; 