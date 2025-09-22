import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  AccessibilityInfo,
} from 'react-native';
import { ResponsiveStyleSheet } from '../ResponsiveStyle/ResponsiveStyleSheet';
import Typography from '../../components/Typography/Typography';
import Button from '../../components/Button/Button';
import { ModalManager, ModalType } from '../ModalManager';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  id?: string;
}

const Alert: React.FC<AlertProps> = ({
  visible,
  onClose,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  type = 'default',
  id = 'default-alert',
}) => {
  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle button press
  const handleButtonPress = useCallback((button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    // Always close the modal after button press
    onClose();
  }, [onClose]);

  // Get theme colors
  const themeColors = ResponsiveStyleSheet.getThemeColors();

  // Get icon for type
  const getTypeIcon = useCallback(() => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
        return 'i';
      default:
        return null;
    }
  }, [type]);

  // Get type color
  const getTypeColor = useCallback(() => {
    switch (type) {
      case 'success':
        return themeColors.success;
      case 'warning':
        return themeColors.warning;
      case 'error':
        return themeColors.error;
      case 'info':
        return themeColors.info;
      default:
        return themeColors.primary;
    }
  }, [type, themeColors]);

  // Register with ModalManager and get z-index
  const zIndex = useMemo(() => {
    if (visible) {
      return ModalManager.register(id, ModalType.ALERT, visible);
    } else {
      ModalManager.unregister(id);
      return null;
    }
  }, [id, visible]);

  const hasIcon = getTypeIcon() !== null;
  const hasTitle = !!title;
  const showHeader = hasIcon || hasTitle;

  useEffect(() => {
    if (visible) {
      AccessibilityInfo.announceForAccessibility(
        `${title ? title + '. ' : ''}${message || ''}`
      );
    }
  }, [visible, title, message]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View 
          style={[
            styles.backdrop,
            zIndex ? { zIndex: zIndex - 1 } : undefined,
          ]} 
          accessible={true}
          accessibilityLabel="Backdrop"
          accessibilityHint="Tap outside the alert to dismiss it"
          accessibilityRole="button"
        />
      </TouchableWithoutFeedback>

      <View style={[
        styles.container,
        zIndex ? { zIndex } : undefined,
      ]}>
        <View
          style={[
            styles.alert,
            {
              backgroundColor: themeColors.surface,
              borderLeftColor: getTypeColor(),
            },
          ]}
          accessible={true}
          accessibilityLabel={`${type} alert${title ? ': ' + title : ''}`}
          accessibilityHint={`${message ? message + '. ' : ''}Use the buttons below to respond to this alert.`}
          accessibilityRole="alert"
          accessibilityViewIsModal={true}
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
        >
          {/* Header section - only show when there's content */}
          {showHeader && (
            <View style={styles.header}>
              {hasIcon && (
                <View 
                  style={[styles.iconContainer, { backgroundColor: getTypeColor() }]}
                  accessible={true}
                  accessibilityLabel={`${type} icon`}
                  accessibilityRole="image"
                  accessibilityHint={`This is a ${type} alert`}
                >
                  <Typography
                    h4
                    center
                    style={[styles.icon, { color: themeColors.onPrimary }] as any}
                  >
                    {getTypeIcon()}
                  </Typography>
                </View>
              )}
              
              {hasTitle && (
                <Typography
                  h4
                  semibold
                  style={[styles.title, { color: themeColors.text }] as any}
                  accessible={true}
                  accessibilityRole="header"
                >
                  {title}
                </Typography>
              )}
            </View>
          )}

          {/* Message section */}
          <View 
            style={styles.messageContainer}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={message?.trim() || 'No message'}
          >
            <Typography
              body1
              style={[styles.message, { color: themeColors.textSecondary }] as any}
            >
              {message?.trim() || ''}
            </Typography>
          </View>

          {/* Button section - Aligned to the right */}
          <View 
            style={styles.buttonContainer}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Alert actions"
            accessibilityHint="Choose an action to respond to this alert"
          >
            {buttons.map((button, index) => (
              <Button
                key={`${button.text}-${index}`}
                onPress={() => handleButtonPress(button)}
                style={[
                  styles.button, 
                  index > 0 && styles.buttonSpacing,
                  button.style === 'destructive' && styles.destructiveButton
                ] as any}
                primary={button.style === 'default'}
                secondary={button.style === 'cancel'}
                danger={button.style === 'destructive'}
                accessible={true}
                accessibilityLabel={button.text}
                accessibilityHint={`${button.style === 'destructive' ? 'Dangerous action: ' : ''}${button.text} button`}
                accessibilityRole="button"
                accessibilityState={{ disabled: false }}
                accessibilityActions={[
                  { name: 'activate', label: `Press ${button.text} button` }
                ]}
              >
                {button.text}
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ResponsiveStyleSheet.responsiveSpacing(4),
  },
  alert: {
    width: '100%',
    maxWidth: ResponsiveStyleSheet.width(400),
    // Height will now be adaptive to actual content
    borderRadius: ResponsiveStyleSheet.borderRadius('2xl'),
    borderLeftWidth: 4,
    ...ResponsiveStyleSheet.shadow('xl'),
    padding: ResponsiveStyleSheet.responsiveSpacing(6),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: ResponsiveStyleSheet.width(32),
    height: ResponsiveStyleSheet.width(32),
    borderRadius: ResponsiveStyleSheet.borderRadius('full'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ResponsiveStyleSheet.responsiveSpacing(3),
  },
  icon: {
    fontSize: ResponsiveStyleSheet.fontSize(16),
  },
  title: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: ResponsiveStyleSheet.responsiveSpacing(2),
  },
  message: {
    textAlign: 'left',
  },
  buttonContainer: {
    // Always align buttons to the right
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    minWidth: ResponsiveStyleSheet.width(100),
  },
  buttonSpacing: {
    marginLeft: ResponsiveStyleSheet.responsiveSpacing(2),
  },
  destructiveButton: {
    // Add specific styles for destructive button if needed
  },
});

export default Alert;
