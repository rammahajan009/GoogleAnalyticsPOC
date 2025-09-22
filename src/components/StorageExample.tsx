import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { storage } from '../utils/storage';

const StorageExample: React.FC = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleStore = async () => {
    if (!key.trim() || !value.trim()) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }

    try {
      const success = await storage.setItem(key.trim(), value.trim());
      if (success) {
        Alert.alert('Success', 'Item stored securely');
        setKey('');
        setValue('');
      } else {
        Alert.alert('Error', 'Failed to store item - storage operation returned false');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Storage Error', `Failed to store item: ${errorMessage}`);
      console.error('Storage setItem error:', error);
    }
  };

  const handleRetrieve = async () => {
    if (!key.trim()) {
      Alert.alert('Error', 'Please enter a key to retrieve');
      return;
    }

    try {
      const retrievedValue = await storage.getItem(key.trim());
      if (retrievedValue !== null) {
        setValue(retrievedValue);
        Alert.alert('Success', `Retrieved: ${retrievedValue}`);
      } else {
        Alert.alert('Not Found', 'No value found for this key');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Storage Error', `Failed to retrieve item: ${errorMessage}`);
      console.error('Storage getItem error:', error);
    }
  };

  const handleRemove = async () => {
    if (!key.trim()) {
      Alert.alert('Error', 'Please enter a key to remove');
      return;
    }

    try {
      const success = await storage.removeItem(key.trim());
      if (success) {
        Alert.alert('Success', 'Item removed');
        setKey('');
        setValue('');
      } else {
        Alert.alert('Error', 'Failed to remove item - storage operation returned false');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Storage Error', `Failed to remove item: ${errorMessage}`);
      console.error('Storage removeItem error:', error);
    }
  };

  const handleMultiSet = async () => {
    const sampleData: [string, string][] = [
      ['userToken', 'token123'],
      ['userId', 'user456'],
      ['apiKey', 'key789']
    ];

    try {
      const success = await storage.multiSet(sampleData);
      if (success) {
        Alert.alert('Success', 'Multiple items stored');
      } else {
        Alert.alert('Error', 'Failed to store some items - storage operation returned false');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Storage Error', `Failed to store multiple items: ${errorMessage}`);
      console.error('Storage multiSet error:', error);
    }
  };

  const handleMultiGet = async () => {
    const keys = ['userToken', 'userId', 'apiKey'];
    
    try {
      const items = await storage.multiGet(keys);
      const results = items
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
      
      if (results) {
        Alert.alert('Retrieved Items', results);
      } else {
        Alert.alert('Not Found', 'No items found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Storage Error', `Failed to retrieve items: ${errorMessage}`);
      console.error('Storage multiGet error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Secure Storage Example</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          This example demonstrates secure storage using the device's keychain.
          Data is encrypted and stored securely.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter key"
          value={key}
          onChangeText={setKey}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter value"
          value={value}
          onChangeText={setValue}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStore}>
          <Text style={styles.buttonText}>Store</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleRetrieve}>
          <Text style={styles.buttonText}>Retrieve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleRemove}>
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Multiple Operations</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleMultiSet}>
            <Text style={styles.buttonText}>Store Multiple</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleMultiGet}>
            <Text style={styles.buttonText}>Get Multiple</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.featuresBox}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <Text style={styles.featureText}>• Secure keychain storage</Text>
        <Text style={styles.featureText}>• Fast caching system</Text>
        <Text style={styles.featureText}>• Batch operations</Text>
        <Text style={styles.featureText}>• AsyncStorage-like API</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    minWidth: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  featuresBox: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  featureText: {
    fontSize: 14,
    color: '#388e3c',
    marginBottom: 5,
  },
});

export default StorageExample;
