import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Typography, loader } from '../components';
import { alert } from '../utils/alert';

interface LoaderExampleProps {
  onNavigateBack?: () => void;
}

const LoaderExample: React.FC<LoaderExampleProps> = ({ onNavigateBack }) => {
  // Helper functions to reduce nesting
  const showLoaderWithTimeout = (size: 'small' | 'large' = 'large', timeout: number = 3000) => {
    loader.show({ size });
    setTimeout(() => loader.hide(), timeout);
  };

  const showLoaderWithSetVisible = (size: 'small' | 'large' = 'large', timeout: number = 3000) => {
    loader.setVisible(true, { size });
    setTimeout(() => loader.setVisible(false), timeout);
  };

  const showLoaderAfterDelay = (delay: number, size: 'small' | 'large' = 'large', timeout: number = 3000) => {
    setTimeout(() => {
      loader.show({ size });
      setTimeout(() => loader.hide(), timeout);
    }, delay);
  };

  const showAlertAfterDelay = (message: string, delay: number = 0) => {
    setTimeout(() => alert.show(message), delay);
  };

  const showComplexAlertAfterDelay = (alertConfig: any, delay: number = 0) => {
    setTimeout(() => alert.show(alertConfig), delay);
  };

  // Handler functions
  const handleShowBasicLoader = () => {
    showLoaderWithTimeout('large', 3000);
  };

  const handleShowSmallLoader = () => {
    showLoaderWithTimeout('small', 4000);
  };

  const handleShowLargeLoader = () => {
    showLoaderWithTimeout('large', 3000);
  };

  const handleSetVisibleLoader = () => {
    showLoaderWithSetVisible('large', 3000);
  };

  const handleShowCustomLoader = () => {
    showLoaderWithTimeout('small', 3000);
  };

  const handleHideLoader = () => {
    loader.hide();
  };

  const handleShowAlert = () => {
    alert.show('This is a test alert message');
  };

  const handleShowSuccessAlert = () => {
    alert.success('Operation completed successfully!');
  };

  const handleShowErrorAlert = () => {
    alert.error('Something went wrong!');
  };

  const handleShowBothSimultaneously = () => {
    loader.show({ size: 'large' });
    showAlertAfterDelay('Alert shown while loader is active!', 500);
    setTimeout(() => loader.hide(), 5000);
  };

  const handleShowLoaderWithAlert = () => {
    loader.show({ size: 'small' });
    showComplexAlertAfterDelay({
      title: 'Processing',
      message: 'This alert appears while the loader is running. The loader should be on top.',
      buttons: [
        { text: 'OK', onPress: () => loader.hide() }
      ]
    }, 1000);
  };

  const handleStartLoading = () => {
    showLoaderAfterDelay(100, 'large', 3000);
  };

  const handleShowAlertThenLoader = () => {
    alert.show({
      title: 'Confirmation',
      message: 'Do you want to start the loading process?',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Loading', onPress: handleStartLoading }
      ]
    });
  };

  const handleStep2Alert = () => {
    showComplexAlertAfterDelay({
      title: 'Step 2',
      message: 'Validating information...',
      buttons: [
        { text: 'Complete', onPress: () => loader.hide() }
      ]
    }, 500);
  };

  const handleStep1Continue = () => {
    handleStep2Alert();
  };

  const handleShowMultipleAlertsWithLoader = () => {
    loader.show({ size: 'large' });
    showComplexAlertAfterDelay({
      title: 'Step 1',
      message: 'Processing data...',
      buttons: [
        { text: 'Continue', onPress: handleStep1Continue }
      ]
    }, 1000);
  };

  const handleShowLoaderOverAlert = () => {
    alert.show({
      title: 'Background Alert',
      message: 'This alert will be covered by the loader when it appears.',
      buttons: [{ text: 'OK' }]
    });
    showLoaderAfterDelay(2000, 'large', 4000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Typography h3 center style={styles.title}>
        Loader & Alert Examples
      </Typography>
      
      {onNavigateBack && (
        <Button onPress={onNavigateBack} style={styles.backButton} secondary>
          ← Back to Analytics
        </Button>
      )}
      
      <View style={styles.section}>
        <Typography h4 style={styles.sectionTitle}>Loader Examples</Typography>
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
          
          <Button onPress={handleSetVisibleLoader} style={styles.button}>
            Set Visible Loader (Generic Method)
          </Button>
          
          <Button onPress={handleShowCustomLoader} style={styles.button}>
            Show Custom Loader
          </Button>
          
          <Button onPress={handleHideLoader} style={styles.button} secondary>
            Hide Loader
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Typography h4 style={styles.sectionTitle}>Alert Examples</Typography>
        <View style={styles.buttonContainer}>
          <Button onPress={handleShowAlert} style={styles.button}>
            Show Basic Alert
          </Button>
          
          <Button onPress={handleShowSuccessAlert} style={styles.button}>
            Show Success Alert
          </Button>
          
          <Button onPress={handleShowErrorAlert} style={styles.button}>
            Show Error Alert
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Typography h4 style={styles.sectionTitle}>Simultaneous Modal Tests</Typography>
        <Typography body2 style={styles.description}>
          Test that both loader and alert can show at the same time with proper layering.
          The loader should always appear on top of alerts.
        </Typography>
        <View style={styles.buttonContainer}>
          <Button onPress={handleShowBothSimultaneously} style={styles.button} primary>
            Show Both Simultaneously
          </Button>
          
          <Button onPress={handleShowLoaderWithAlert} style={styles.button} primary>
            Loader + Alert (Loader on Top)
          </Button>
          
          <Button onPress={handleShowAlertThenLoader} style={styles.button} primary>
            Alert → Loader Sequence
          </Button>
          
          <Button onPress={handleShowMultipleAlertsWithLoader} style={styles.button} primary>
            Multiple Alerts + Loader
          </Button>
          
          <Button onPress={handleShowLoaderOverAlert} style={styles.button} primary>
            Loader Over Existing Alert
          </Button>
        </View>
      </View>

      <View style={styles.section}>
        <Typography h4 style={styles.sectionTitle}>Modal Layering Info</Typography>
        <Typography body2 style={styles.infoText}>
          • Loader has highest priority (z-index: 10300+)
        </Typography>
        <Typography body2 style={styles.infoText}>
          • Alert has lower priority (z-index: 10000+)
        </Typography>
        <Typography body2 style={styles.infoText}>
          • Loader will always appear on top when both are visible
        </Typography>
        <Typography body2 style={styles.infoText}>
          • Multiple alerts are queued and shown one at a time
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 15,
    fontStyle: 'italic',
    color: '#666',
  },
  infoText: {
    marginBottom: 8,
    color: '#555',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    marginVertical: 5,
  },
});

export default LoaderExample;
