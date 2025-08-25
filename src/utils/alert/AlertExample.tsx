import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ResponsiveStyleSheet } from '../ResponsiveStyle/ResponsiveStyleSheet';
import Typography from '../../components/Typography/Typography';
import Button from '../../components/Button/Button';
import { alert } from './AlertService';

const AlertExample: React.FC = () => {
  const showBasicAlert = () => {
    alert.show('This is a basic alert message');
  };

  const showAlertWithTitle = () => {
    alert.show({
      title: 'Custom Title',
      message: 'This alert has a custom title',
    });
  };

  const showSuccessAlert = () => {
    alert.success('Operation completed successfully!');
  };

  const showErrorAlert = () => {
    alert.error('Something went wrong! Please try again.');
  };

  const showWarningAlert = () => {
    alert.warning('Please review your input before proceeding.');
  };

  const showInfoAlert = () => {
    alert.info('Here is some helpful information for you.');
  };

  const showAlertWithCallback = () => {
    alert.show({
      title: 'Action Required',
      message: 'Please confirm your action to continue.',
      buttons: [
        {
          text: 'Continue',
          style: 'default',
          onPress: () => {
            console.log('Alert button pressed!');
            // You can perform any action here
            alert.success('Action confirmed!');
          },
        }
      ],
    });
  };

  const showCustomButtonText = () => {
    alert.show({
      title: 'Custom Button',
      message: 'This alert has a custom button text.',
      buttons: [
        {
          text: 'Got it!',
          style: 'default',
        }
      ],
    });
  };

  const showMultipleAlerts = () => {
    // Show multiple alerts to demonstrate queuing
    alert.info('First alert message');
    alert.warning('Second alert message');
    alert.error('Third alert message');
  };

  const showCustomTypeAlert = () => {
    alert.show({
      title: 'Custom Type',
      message: 'This alert uses a custom type configuration.',
      type: 'warning',
      buttons: [
        {
          text: 'Acknowledge',
          style: 'default',
        }
      ],
    });
  };

  const showConfirmDialog = () => {
    alert.confirm(
      'Are you sure you want to delete this item? This action cannot be undone.',
      'Confirm Deletion',
      () => {
        console.log('User confirmed deletion');
        alert.success('Item deleted successfully!');
      },
      () => {
        console.log('User cancelled deletion');
        alert.info('Deletion cancelled');
      },
      'Delete',
      'Cancel'
    );
  };

  const showAlertWithCancel = () => {
    alert.showWithCancel(
      'Do you want to save your changes before leaving?',
      'Save Changes',
      () => {
        console.log('User chose to save');
        alert.success('Changes saved!');
      },
      () => {
        console.log('User chose not to save');
        alert.info('Changes not saved');
      },
      'Save',
      'Don\'t Save'
    );
  };

  const showSuccessWithCancel = () => {
    alert.success(
      'Your profile has been updated successfully. Would you like to view the changes?',
      'Profile Updated',
      () => {
        console.log('User wants to view changes');
        alert.info('Redirecting to profile...');
      }
    );
  };

  const testQueueFunctionality = () => {
    // Test the queue functionality
    console.log('Queue status before:', alert.getQueueStatus());

    // Show multiple alerts quickly
    alert.show('First alert');
    alert.show('Second alert');
    alert.show('Third alert');

    // Check queue status
    setTimeout(() => {
      console.log('Queue status after:', alert.getQueueStatus());
    }, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Typography h2 center style={styles.title}>
        Alert Service Examples
      </Typography>

      <Typography body1 center style={styles.description}>
        Call alert methods from anywhere in your app without managing state
      </Typography>

      <View style={styles.buttonGrid}>
        {/* Basic Alert */}
        <Button
          primary
          onPress={showBasicAlert}
          style={styles.exampleButton}
        >
          Basic Alert
        </Button>

        {/* Alert with Title */}
        <Button
          secondary
          onPress={showAlertWithTitle}
          style={styles.exampleButton}
        >
          With Title
        </Button>

        {/* Success Alert */}
        <Button
          success
          onPress={showSuccessAlert}
          style={styles.exampleButton}
        >
          Success Alert
        </Button>

        {/* Error Alert */}
        <Button
          danger
          onPress={showErrorAlert}
          style={styles.exampleButton}
        >
          Error Alert
        </Button>

        {/* Warning Alert */}
        <Button
          outline
          onPress={showWarningAlert}
          style={styles.exampleButton}
        >
          Warning Alert
        </Button>

        {/* Info Alert */}
        <Button
          ghost
          onPress={showInfoAlert}
          style={styles.exampleButton}
        >
          Info Alert
        </Button>

        {/* Alert with Callback */}
        <Button
          primary
          onPress={showAlertWithCallback}
          style={styles.exampleButton}
        >
          With Callback
        </Button>

        {/* Custom Button Text */}
        <Button
          secondary
          onPress={showCustomButtonText}
          style={styles.exampleButton}
        >
          Custom Button
        </Button>

        {/* Multiple Alerts */}
        <Button
          outline
          onPress={showMultipleAlerts}
          style={styles.exampleButton}
        >
          Multiple Alerts
        </Button>

        {/* Custom Type */}
        <Button
          outline
          onPress={showCustomTypeAlert}
          style={styles.exampleButton}
        >
          Custom Type
        </Button>

        {/* Confirm Dialog */}
        <Button
          primary
          onPress={showConfirmDialog}
          style={styles.exampleButton}
        >
          Confirm Dialog
        </Button>

        {/* Alert with Cancel */}
        <Button
          secondary
          onPress={showAlertWithCancel}
          style={styles.exampleButton}
        >
          Alert with Cancel
        </Button>

        {/* Success with Cancel */}
        <Button
          success
          onPress={showSuccessWithCancel}
          style={styles.exampleButton}
        >
          Success with Cancel
        </Button>

        {/* Test Queue Functionality */}
        <Button
          outline
          onPress={testQueueFunctionality}
          style={styles.exampleButton}
        >
          Test Queue
        </Button>
      </View>

      <Typography h4 center style={styles.usageTitle}>
        Usage Examples
      </Typography>

      <View style={styles.codeExamples}>
        <Typography body2 style={styles.codeTitle}>
          Simple Alert:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.show('Your message here');`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Alert with Title:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.show({ title: 'Title', message: 'Message' });`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Success Alert:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.success('Operation completed!');`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Error Alert:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.error('Something went wrong!');`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Alert with Callback:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.show({ 
  message: 'Message', 
  buttons: [{ text: 'OK', onPress: () => console.log('Pressed') }] 
});`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Confirm Dialog with Cancel:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.confirm('Message', 'Title', onConfirm, onCancel, 'OK', 'Cancel');`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Alert with Multiple Buttons:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.show({
  message: 'Message',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', style: 'default' }
  ]
});`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Destructive Action:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.show({
  message: 'Delete item?',
  buttons: [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: deleteItem }
  ]
});`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Alert with Cancel Button:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.showWithCancel('Message', 'Title', onConfirm, onCancel);`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Success Alert with Cancel:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.success('Message', 'Title', onConfirm, onCancel);`}
          </Typography>
        </View>

        <Typography body2 style={styles.codeTitle}>
          Hide All Alerts:
        </Typography>
        <View style={styles.codeBlock}>
          <Typography caption>
            {`alert.hideAll();`}
          </Typography>
        </View>
      </View>

      <Typography h4 center style={styles.featuresTitle}>
        Features
      </Typography>

      <View style={styles.featuresList}>
        <Typography body2 style={styles.featureItem}>
          • Simple API similar to native alert()
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Multiple alert types: success, error, warning, info
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Custom button text and callbacks
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Multiple buttons with different styles (default, cancel, destructive)
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Native Alert-like API with button arrays
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Beautiful animations and design system integration
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • Global access from anywhere in your app
        </Typography>
        <Typography body2 style={styles.featureItem}>
          • No state management required
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ResponsiveStyleSheet.responsiveSpacing(4),
    backgroundColor: ResponsiveStyleSheet.getThemeColors().background,
  },
  title: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  description: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(8),
    color: ResponsiveStyleSheet.getThemeColors().textSecondary,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: ResponsiveStyleSheet.responsiveSpacing(3),
  },
  exampleButton: {
    flex: 1,
    minWidth: ResponsiveStyleSheet.width(150),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(3),
  },
  usageTitle: {
    marginTop: ResponsiveStyleSheet.responsiveSpacing(8),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  codeExamples: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(6),
  },
  codeTitle: {
    marginTop: ResponsiveStyleSheet.responsiveSpacing(4),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(2),
    color: ResponsiveStyleSheet.getThemeColors().text,
    fontWeight: '600',
  },
  codeBlock: {
    backgroundColor: ResponsiveStyleSheet.getThemeColors().surface,
    padding: ResponsiveStyleSheet.responsiveSpacing(3),
    borderRadius: ResponsiveStyleSheet.borderRadius('base'),
    borderWidth: 1,
    borderColor: ResponsiveStyleSheet.getThemeColors().placeholder,
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(3),
  },
  featuresTitle: {
    marginTop: ResponsiveStyleSheet.responsiveSpacing(6),
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(4),
    color: ResponsiveStyleSheet.getThemeColors().text,
  },
  featuresList: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(6),
  },
  featureItem: {
    marginBottom: ResponsiveStyleSheet.responsiveSpacing(2),
    color: ResponsiveStyleSheet.getThemeColors().textSecondary,
  },
});

export default AlertExample;
