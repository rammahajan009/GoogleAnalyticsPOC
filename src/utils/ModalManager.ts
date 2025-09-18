/**
 * ModalManager - Manages z-index layering for different modal types
 * Ensures proper layering when multiple modals are shown simultaneously
 */

export enum ModalType {
  ALERT = 'alert',
  LOADER = 'loader',
  CONFIRMATION = 'confirmation',
  CUSTOM = 'custom',
}

export interface ModalInstance {
  id: string;
  type: ModalType;
  zIndex: number;
  visible: boolean;
}

class ModalManagerClass {
  private modals: Map<string, ModalInstance> = new Map();
  private baseZIndex = 10000; // Base z-index for modals
  private typeZIndexMap: Map<ModalType, number> = new Map([
    [ModalType.ALERT, 0],           // Lowest priority
    [ModalType.CONFIRMATION, 100],  // Medium priority
    [ModalType.CUSTOM, 200],        // Higher priority
    [ModalType.LOADER, 300],        // Highest priority (always on top)
  ]);

  /**
   * Register a modal instance
   */
  register(id: string, type: ModalType, visible: boolean = false): number {
    const typeZIndex = this.typeZIndexMap.get(type) || 0;
    const zIndex = this.baseZIndex + typeZIndex + this.getNextOffset(type);
    
    const modal: ModalInstance = {
      id,
      type,
      zIndex,
      visible,
    };
    
    this.modals.set(id, modal);
    return zIndex;
  }

  /**
   * Update modal visibility
   */
  updateVisibility(id: string, visible: boolean): number | null {
    const modal = this.modals.get(id);
    if (!modal) return null;
    
    modal.visible = visible;
    this.modals.set(id, modal);
    return modal.zIndex;
  }

  /**
   * Unregister a modal instance
   */
  unregister(id: string): void {
    this.modals.delete(id);
  }

  /**
   * Get z-index for a modal
   */
  getZIndex(id: string): number | null {
    const modal = this.modals.get(id);
    return modal ? modal.zIndex : null;
  }

  /**
   * Get all visible modals sorted by z-index
   */
  getVisibleModals(): ModalInstance[] {
    return Array.from(this.modals.values())
      .filter(modal => modal.visible)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  /**
   * Get the topmost visible modal
   */
  getTopModal(): ModalInstance | null {
    const visibleModals = this.getVisibleModals();
    return visibleModals.length > 0 ? visibleModals[visibleModals.length - 1] : null;
  }

  /**
   * Check if a modal type should be shown (based on priority)
   */
  shouldShowModal(type: ModalType): boolean {
    const visibleModals = this.getVisibleModals();
    const typeZIndex = this.typeZIndexMap.get(type) || 0;
    
    // Loader should always be shown (highest priority)
    if (type === ModalType.LOADER) return true;
    
    // For other types, check if there's a higher priority modal visible
    const hasHigherPriorityModal = visibleModals.some(modal => {
      const modalTypeZIndex = this.typeZIndexMap.get(modal.type) || 0;
      return modalTypeZIndex > typeZIndex;
    });
    
    return !hasHigherPriorityModal;
  }

  /**
   * Get next offset for a modal type to ensure unique z-index
   */
  private getNextOffset(type: ModalType): number {
    const typeZIndex = this.typeZIndexMap.get(type) || 0;
    const modalsOfSameType = Array.from(this.modals.values())
      .filter(modal => modal.type === type);
    
    return modalsOfSameType.length;
  }

  /**
   * Clear all modals
   */
  clear(): void {
    this.modals.clear();
  }

  /**
   * Get debug information
   */
  getDebugInfo(): object {
    return {
      modals: Array.from(this.modals.values()),
      visibleModals: this.getVisibleModals(),
      topModal: this.getTopModal(),
    };
  }
}

export const ModalManager = new ModalManagerClass();
export default ModalManager;
