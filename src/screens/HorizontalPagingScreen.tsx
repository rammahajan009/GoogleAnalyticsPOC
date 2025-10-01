import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { HorizontalPagingFlatList } from '../components/HorizontalPagingFlatList';

interface DataItem {
  id: string;
  title: string;
  content: string;
}

// Sample data with variable content lengths (heights will be auto-calculated)
const sampleData: DataItem[] = [
  {
    id: '1',
    title: 'Short Content',
    content: 'This is a short content item.',
  },
  {
    id: '2',
    title: 'Medium Content',
    content: 'This is a medium content item with more text to demonstrate variable height. It has multiple lines of text to show how the height adapts automatically.',
  },
  {
    id: '3',
    title: 'Long Content',
    content: 'This is a long content item with lots of text to demonstrate how the FlatList adapts to the maximum height. It contains multiple paragraphs and detailed information to showcase the variable height feature. The content continues to provide a realistic example of how this component would work in a real application.',
  },
  {
    id: '4',
    title: 'Very Long Content',
    content: 'This is a very long content item with extensive text to demonstrate the maximum height adaptation. It contains multiple paragraphs, detailed explanations, and comprehensive information to showcase how the horizontal FlatList with paging enabled handles items of different heights. The content is designed to provide a realistic example of how this component would work in a real-world application where content length varies significantly. This particular item demonstrates the automatic height calculation feature.',
  },
  {
    id: '5',
    title: 'Another Medium',
    content: 'Another medium content item to show variety in the list. This helps demonstrate how the component handles different content lengths effectively with automatic height measurement.',
  },
  {
    id: '6',
    title: 'Sixth Item',
    content: 'This is the sixth item to test the new pagination dots behavior with more than 5 items.',
  },
  {
    id: '7',
    title: 'Seventh Item',
    content: 'This is the seventh item to demonstrate the pagination dots with size hierarchy.',
  },
  {
    id: '8',
    title: 'Eighth Item',
    content: 'This is the eighth item to show how the dots adapt when scrolling through many items.',
  },
];

const HorizontalPagingScreen: React.FC = () => {
  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.itemContent}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  const handleItemChange = (item: DataItem, index: number) => {
    console.log(`Changed to: ${item.title} at index: ${index}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Horizontal FlatList with Variable Height</Text>
      <Text style={styles.subHeader}>Using Reusable Component</Text>
      
      <HorizontalPagingFlatList
        data={sampleData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onItemChange={handleItemChange}
        itemSpacing={20}
        testID="horizontal-paging-screen"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  itemContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  content: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  heightInfo: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default HorizontalPagingScreen;
