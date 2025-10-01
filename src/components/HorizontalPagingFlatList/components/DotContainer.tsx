import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import Dot from './Dot';
import EmptyDot, { defaultEmptyDotSize } from './EmptyDot';

// Custom hook to get previous value
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export interface IDotContainerProps {
  curPage: number;
  maxPage: number;
  sizeRatio?: number;
  activeDotColor: string;
  inactiveDotColor?: string;
  vertical?: boolean;
}

const ONE_EMPTY_DOT_SIZE = defaultEmptyDotSize * 2; // Including margin

const DotContainer: React.FC<IDotContainerProps> = React.memo((props) => {
  const { curPage, maxPage, sizeRatio, activeDotColor, inactiveDotColor, vertical } = props;
  
  const refScrollView = useRef<ScrollView>(null);
  const prevPage = usePrevious(curPage);

  const normalizedSizeRatio = useMemo(() => {
    if (!sizeRatio) return 1.0;
    return Math.max(1.0, sizeRatio);
  }, [sizeRatio]);

  const scrollTo = useCallback<(index: number, animated?: boolean) => void>(
    (index, animated = true) => {
      if (!refScrollView.current) return;

      const FIRST_EMPTY_DOT_SPACE = ONE_EMPTY_DOT_SIZE * 2;
      const MOVE_DISTANCE = ONE_EMPTY_DOT_SIZE * normalizedSizeRatio;

      const moveTo = Math.max(
        0,
        FIRST_EMPTY_DOT_SPACE + (index - 4) * MOVE_DISTANCE
      );

      if (vertical) {
        refScrollView.current.scrollTo({
          x: 0,
          y: moveTo,
          animated,
        });
        return;
      }

      refScrollView.current.scrollTo({
        x: moveTo,
        y: 0,
        animated,
      });
    },
    [normalizedSizeRatio, vertical]
  );

  const containerStyle = useMemo(() => {
    const containerSize = 84 * normalizedSizeRatio;

    return {
      alignItems: 'center' as const,
      flexDirection: vertical ? 'column' as const : 'row' as const,
      maxHeight: vertical ? containerSize : undefined,
      maxWidth: vertical ? undefined : containerSize,
    };
  }, [normalizedSizeRatio, vertical]);

  const normalizedPage = useMemo(() => {
    if (curPage < 0) return 0;
    if (curPage > maxPage - 1) return maxPage - 1;
    return curPage;
  }, [curPage, maxPage]);

  const list = useMemo(() => [...Array(maxPage).keys()], [maxPage]);

  useEffect(() => {
    if (maxPage > 4 && prevPage !== curPage) {
      scrollTo(curPage);
    }
  }, [prevPage, curPage, maxPage, scrollTo]);

  const handleLayout = useCallback(() => {
    scrollTo(curPage, false);
  }, [scrollTo, curPage]);

  const renderDot = useCallback((i: number) => (
    <Dot
      key={i}
      idx={i}
      sizeRatio={normalizedSizeRatio}
      curPage={normalizedPage}
      maxPage={maxPage}
      activeColor={activeDotColor}
      inactiveColor={inactiveDotColor}
    />
  ), [normalizedSizeRatio, normalizedPage, maxPage, activeDotColor, inactiveDotColor]);

  const renderEmptyDot = useCallback(() => (
    <EmptyDot sizeRatio={normalizedSizeRatio} />
  ), [normalizedSizeRatio]);

  if (maxPage < 5) {
    return (
      <View style={containerStyle}>
        {list.map(renderDot)}
      </View>
    );
  }

  return (
    <View
      style={containerStyle}
      onLayout={handleLayout}
    >
      <ScrollView
        ref={refScrollView}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        horizontal={!vertical}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* previous empty dummy dot */}
        {renderEmptyDot()}
        {renderEmptyDot()}

        {list.map(renderDot)}

        {/* previous empty dummy dot */}
        {renderEmptyDot()}
        {renderEmptyDot()}
      </ScrollView>
    </View>
  );
});

DotContainer.displayName = 'DotContainer';

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
  },
});

export default DotContainer;
