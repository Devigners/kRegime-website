import { FormData } from '@/types';

const FORM_DATA_KEY = 'kregime_form_data';
const CART_KEY = 'kregime_cart';
const SELECTED_REGIME_KEY = 'kregime_selected_regime';

export const localStorage = {
  // Form data management
  saveFormData: (data: Partial<FormData>, regimeId: string) => {
    if (typeof window !== 'undefined') {
      const key = `${FORM_DATA_KEY}_${regimeId}`;
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  },

  getFormData: (regimeId: string): Partial<FormData> | null => {
    if (typeof window !== 'undefined') {
      const key = `${FORM_DATA_KEY}_${regimeId}`;
      const data = window.localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clearFormData: (regimeId: string) => {
    if (typeof window !== 'undefined') {
      const key = `${FORM_DATA_KEY}_${regimeId}`;
      window.localStorage.removeItem(key);
    }
  },

  // Cart management
  saveCartData: (cartData: object) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cartData));
      // Dispatch custom event to notify other components of cart changes
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  },

  getCartData: () => {
    if (typeof window !== 'undefined') {
      const data = window.localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clearCartData: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CART_KEY);
      // Dispatch custom event to notify other components of cart changes
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  },

  // Selected regime management
  saveSelectedRegime: (regimeId: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SELECTED_REGIME_KEY, regimeId);
    }
  },

  getSelectedRegime: (): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(SELECTED_REGIME_KEY);
    }
    return null;
  },

  clearSelectedRegime: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SELECTED_REGIME_KEY);
    }
  },

  // Clear all kregime data
  clearAllData: () => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(window.localStorage);
      keys.forEach((key) => {
        if (key.startsWith('kregime_')) {
          window.localStorage.removeItem(key);
        }
      });
    }
  },

  // Form progress management
  getIncompleteFormProgress: (): {
    regimeId: string;
    currentStep: number;
  } | null => {
    if (typeof window !== 'undefined') {
      const keys = Object.keys(window.localStorage);

      // Find all currentStep entries
      const stepKeys = keys.filter((key) => key.startsWith('currentStep_'));

      for (const stepKey of stepKeys) {
        const regimeId = stepKey.replace('currentStep_', '');
        const currentStep = parseInt(
          window.localStorage.getItem(stepKey) || '1',
          10
        );

        // Check if there's corresponding form data
        const formDataKey = `${FORM_DATA_KEY}_${regimeId}`;
        const formData = window.localStorage.getItem(formDataKey);

        // If we have a saved step > 1 and form data, consider it incomplete
        if (currentStep > 1 && formData) {
          return { regimeId, currentStep };
        }
      }
    }
    return null;
  },

  clearIncompleteForm: (regimeId: string) => {
    if (typeof window !== 'undefined') {
      // Clear form data
      const formDataKey = `${FORM_DATA_KEY}_${regimeId}`;
      window.localStorage.removeItem(formDataKey);

      // Clear current step
      window.localStorage.removeItem(`currentStep_${regimeId}`);

      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('formCleared'));
    }
  },

  hasIncompleteForm: (): boolean => {
    return localStorage.getIncompleteFormProgress() !== null;
  },
};
