import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { alert, AlertInstance } from './AlertService';
import Alert from './Alert';

interface AlertProviderProps {
  children: React.ReactNode;
}

const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<AlertInstance | null>(null);

  useEffect(() => {
    // Listen to alert service events
    const handleShow = (alertInstance: AlertInstance) => {
      // Only show one alert at a time
      setCurrentAlert(alertInstance);
    };

    const handleHide = (alertInstance: AlertInstance) => {
      // Alert is hidden, no need to track in state
    };

    const handleRemoved = (id: string) => {
      // Clear current alert if it's the one being removed
      setCurrentAlert(prev => prev?.id === id ? null : prev);
    };

    // Add event listeners
    alert.on('alert:show', handleShow);
    alert.on('alert:hide', handleHide);
    alert.on('alert:removed', handleRemoved);

    // Cleanup event listeners
    return () => {
      alert.off('alert:show', handleShow);
      alert.off('alert:hide', handleHide);
      alert.off('alert:removed', handleRemoved);
    };
  }, []);

  const handleClose = (id: string) => {
    alert.hide(id);
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {/* Render only the current alert to prevent multiple modals */}
      {currentAlert && (
        <Alert
          key={currentAlert.id}
          visible={currentAlert.visible}
          onClose={() => handleClose(currentAlert.id)}
          title={currentAlert.options.title}
          message={currentAlert.options.message}
          buttons={currentAlert.options.buttons}
          type={currentAlert.options.type}
          id={currentAlert.id}
        />
      )}
    </View>
  );
};

export default AlertProvider;
