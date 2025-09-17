// Simple state management without EventEmitter

export interface LoaderOptions {
  size?: 'small' | 'large';
}

export interface LoaderInstance {
  id: string;
  options: LoaderOptions;
  visible: boolean;
}

class LoaderService {
  private static instance: LoaderService;
  private currentLoader: LoaderInstance | null = null;
  private nextId = 1;
  private listeners: Set<(loader: LoaderInstance | null) => void> = new Set();
  private hideTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): LoaderService {
    if (!LoaderService.instance) {
      LoaderService.instance = new LoaderService();
    }
    return LoaderService.instance;
  }

  // Subscribe to loader changes
  public subscribe(listener: (loader: LoaderInstance | null) => void): () => void {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.currentLoader);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners - optimized to avoid unnecessary iterations
  private notifyListeners(): void {
    if (this.listeners.size === 0) return;
    this.listeners.forEach(listener => listener(this.currentLoader));
  }

  /**
   * Show a loader with the given options
   * If a loader is already showing, it will be replaced
   */
  public show(options: LoaderOptions = {}): string {
    // Clear any pending hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    const id = `loader_${this.nextId++}`;
    
    const loader: LoaderInstance = {
      id,
      options: {
        size: 'large',
        ...options,
      },
      visible: true,
    };

    // Hide current loader if exists
    if (this.currentLoader) {
      this.currentLoader.visible = false;
    }

    this.currentLoader = loader;
    this.notifyListeners();
    
    return id;
  }

  /**
   * Hide the current loader
   */
  public hide(): void {
    if (this.currentLoader) {
      // Clear any existing timeout
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }

      this.currentLoader.visible = false;
      this.notifyListeners();
      
      // Remove loader after animation delay
      this.hideTimeout = setTimeout(() => {
        this.currentLoader = null;
        this.hideTimeout = null;
        this.notifyListeners();
      }, 300);
    }
  }
}

// Export singleton instance
export const loader = LoaderService.getInstance();

// Export the class for testing purposes
export { LoaderService };
