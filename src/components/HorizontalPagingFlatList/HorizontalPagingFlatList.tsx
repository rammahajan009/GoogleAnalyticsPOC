import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ViewToken,
  ViewStyle,
} from 'react-native';
import { DotContainer } from './components';

export interface HorizontalPagingFlatListProps<T> {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;

  // Essential configuration
  itemSpacing?: number;
  showPaginationDots?: boolean;

  // Custom styling
  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;

  // Callbacks
  onItemChange?: (item: T, index: number) => void;

  // Accessibility
  testID?: string;
}

const HorizontalPagingFlatList = <T,>({
  data,
  renderItem,
  keyExtractor,
  itemSpacing = 20,
  showPaginationDots = true,
  containerStyle,
  itemContainerStyle,
  onItemChange,
  testID,
}: HorizontalPagingFlatListProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Handle container layout
  const handleContainerLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Calculate item width based on container width
  const itemWidth = useMemo(() => 
    containerWidth - itemSpacing, 
    [containerWidth, itemSpacing]
  );

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index || 0;
        setCurrentIndex(newIndex);
        const currentItem = data[newIndex];
        if (currentItem && onItemChange) {
          onItemChange(currentItem, newIndex);
        }
      }
    },
    [data, onItemChange]
  );


  const paginationDots = useMemo(() => {
    if (!showPaginationDots || data.length <= 1) return null;
    
    return (
      <View style={styles.paginationContainer}>
        <DotContainer
          curPage={currentIndex}
          maxPage={data.length}
          activeDotColor="blue"
          inactiveDotColor="red"
          sizeRatio={1}
        />
      </View>
    );
  }, [showPaginationDots, data.length, currentIndex]);

  const flatListContentStyle = useMemo(() => ({
    paddingBottom: 16,
  }), []);

  const itemContainerStyleMemo = useMemo(() => [
    styles.itemContainer,
    { width: itemWidth, marginHorizontal: itemSpacing / 2 },
    itemContainerStyle
  ], [itemWidth, itemSpacing, itemContainerStyle]);


  if (data.length === 0) {
    return null;
  }

  return (
    <View
      style={[styles.container, containerStyle]}
      testID={testID}
      onLayout={handleContainerLayout}
    >
      {/* FlatList Container */}
      <View style={styles.flatListContainer}>
        {containerWidth > 0 && (
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={({ item, index }) => (
              <View style={itemContainerStyleMemo}>
                {renderItem({ item, index })}
              </View>
            )}
            keyExtractor={keyExtractor}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            contentContainerStyle={flatListContentStyle}
            snapToInterval={itemWidth + itemSpacing}
            decelerationRate="fast"
            snapToAlignment="center"
          />
        )}

        {/* Pagination dots */}
        {paginationDots}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    alignSelf: 'stretch',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HorizontalPagingFlatList;