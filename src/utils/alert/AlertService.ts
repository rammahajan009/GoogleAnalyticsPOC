// Custom EventEmitter implementation for React Native
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export interface AlertInstance {
  id: string;
  options: AlertOptions;
  visible: boolean;
}

class AlertService extends EventEmitter {
  private static instance: AlertService;
  private readonly alerts: Map<string, AlertInstance> = new Map();
  private nextId = 1;
  private isShowingModal = false;
  private alertQueue: AlertInstance[] = [];

  private constructor() {
    super();
  }

  public static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  /**
   * Show an alert with the given options
   */
  public show(options: AlertOptions | string): string {
    const alertOptions: AlertOptions = typeof options === 'string' 
      ? { message: options }
      : options;

    const id = `alert_${this.nextId++}`;
    
    // Default buttons if none provided
    const defaultButtons: AlertButton[] = alertOptions.buttons || [
      { text: 'OK', style: 'default' }
    ];
    
    const alert: AlertInstance = {
      id,
      options: {
        title: 'Alert',
        type: 'default',
        ...alertOptions,
        buttons: defaultButtons,
      },
      visible: true,
    };

    this.alerts.set(id, alert);
    
    // Add to queue and process
    this.addToQueue(alert);
    
    return id;
  }

  /**
   * Add alert to queue and process if possible
   */
  private addToQueue(alert: AlertInstance): void {
    // Check if this alert is already in the queue
    const isAlreadyQueued = this.alertQueue.some(a => a.id === alert.id);
    if (isAlreadyQueued) {
      return;
    }
    
    this.alertQueue.push(alert);
    this.processQueue();
  }

  /**
   * Process the alert queue
   */
  private processQueue(): void {
    if (this.isShowingModal || this.alertQueue.length === 0) {
      return;
    }

    const nextAlert = this.alertQueue.shift();
    if (nextAlert) {
      this.isShowingModal = true;
      this.emit('alert:show', nextAlert);
    }
  }

  /**
   * Mark modal as dismissed and process next in queue
   */
  public onModalDismissed(): void {
    this.isShowingModal = false;
    this.processQueue();
  }

  /**
   * Check if there are pending alerts in the queue
   */
  public hasPendingAlerts(): boolean {
    return this.alertQueue.length > 0;
  }

  /**
   * Clear all pending alerts in the queue
   */
  public clearQueue(): void {
    this.alertQueue = [];
    this.isShowingModal = false;
  }

  /**
   * Get queue status for debugging
   */
  public getQueueStatus(): { isShowingModal: boolean; queueLength: number; totalAlerts: number } {
    return {
      isShowingModal: this.isShowingModal,
      queueLength: this.alertQueue.length,
      totalAlerts: this.alerts.size,
    };
  }

  /**
   * Hide a specific alert by ID
   */
  public hide(id: string): void {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.visible = false;
      this.emit('alert:hide', alert);
      
      // Remove alert after animation delay
      setTimeout(() => {
        this.alerts.delete(id);
        this.emit('alert:removed', id);
        // Notify that modal is dismissed to process queue
        this.onModalDismissed();
      }, 300);
    }
  }

  /**
   * Hide all alerts
   */
  public hideAll(): void {
    this.alerts.forEach((alert) => {
      this.hide(alert.id);
    });
    // Clear the queue as well
    this.clearQueue();
  }

  /**
   * Get all visible alerts
   */
  public getAlerts(): AlertInstance[] {
    return Array.from(this.alerts.values());
  }

  /**
   * Check if any alert is visible
   */
  public hasVisibleAlerts(): boolean {
    return this.alerts.size > 0;
  }

  /**
   * Convenience methods for common alert types
   */
  public success(message: string, title?: string, onPress?: () => void): string {
    return this.show({
      title: title || 'Success',
      message,
      type: 'success',
      buttons: [
        { text: 'OK', style: 'default', onPress }
      ],
    });
  }

  public error(message: string, title?: string, onPress?: () => void): string {
    return this.show({
      title: title || 'Error',
      message,
      type: 'error',
      buttons: [
        { text: 'OK', style: 'default', onPress }
      ],
    });
  }

  public warning(message: string, title?: string, onPress?: () => void): string {
    return this.show({
      title: title || 'Warning',
      message,
      type: 'warning',
      buttons: [
        { text: 'OK', style: 'default', onPress }
      ],
    });
  }

  public info(message: string, title?: string, onPress?: () => void): string {
    return this.show({
      title: title || 'Information',
      message,
      type: 'info',
      buttons: [
        { text: 'OK', style: 'default', onPress }
      ],
    });
  }

  /**
   * Show confirmation dialog with cancel button
   */
  public confirm(
    message: string, 
    title?: string, 
    onPress?: () => void, 
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ): string {
    return this.show({
      title: title || 'Confirm',
      message,
      buttons: [
        { text: cancelText || 'Cancel', style: 'cancel', onPress: onCancel },
        { text: confirmText || 'OK', style: 'default', onPress }
      ],
      type: 'info',
    });
  }

  /**
   * Show alert with cancel button
   */
  public showWithCancel(
    message: string,
    title?: string,
    onPress?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ): string {
    return this.show({
      title: title || 'Alert',
      message,
      buttons: [
        { text: cancelText || 'Cancel', style: 'cancel', onPress: onCancel },
        { text: confirmText || 'OK', style: 'default', onPress }
      ],
    });
  }
}

// Export singleton instance
export const alert = AlertService.getInstance();

// Export the class for testing purposes
export { AlertService };
