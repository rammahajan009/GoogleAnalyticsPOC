import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Typography, loader } from '../components';

interface LoaderExampleProps {
  onNavigateBack?: () => void;
}

const LoaderExample: React.FC<LoaderExampleProps> = ({ onNavigateBack }) => {
  const handleShowBasicLoader = () => {
    loader.show();
    
    // Hide after 3 seconds
    setTimeout(() => {
      loader.hide();
    }, 3000);
  };

  const handleShowSmallLoader = () => {
    loader.show({ size: 'small' });
    
    // Hide after 4 seconds
    setTimeout(() => {
      loader.hide();
    }, 4000);
  };

  const handleShowLargeLoader = () => {
    loader.show({ size: 'large' });
    
    // Hide after 3 seconds
    setTimeout(() => {
      loader.hide();
    }, 3000);
  };


  const handleShowCustomLoader = () => {
    loader.show({
      size: 'small'
    });
    
    // Hide after 3 seconds
    setTimeout(() => {
      loader.hide();
    }, 3000);
  };

  const handleHideLoader = () => {
    loader.hide();
  };

  return (
    <View style={styles.container}>
      <Typography h3 center style={styles.title}>
        Loader Examples
      </Typography>
      
      {onNavigateBack && (
        <Button onPress={onNavigateBack} style={styles.backButton} secondary>
          ← Back to Analytics
        </Button>
      )}
      
      <View style={styles.buttonContainer}>
        <Button onPress={handleShowBasicLoader} style={styles.button}>
          Show Basic Loader
        </Button>
        
        <Button onPress={handleShowSmallLoader} style={styles.button}>
          Show Small Loader
        </Button>
        
        <Button onPress={handleShowLargeLoader} style={styles.button}>
          Show Large Loader
        </Button>
        
        
        <Button onPress={handleShowCustomLoader} style={styles.button}>
          Show Custom Loader
        </Button>
        
        <Button onPress={handleHideLoader} style={styles.button} secondary>
          Hide Loader
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    marginVertical: 5,
  },
});

export default LoaderExample;
