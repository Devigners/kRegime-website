'use client';

import { useState, useEffect } from 'react';
import { localStorage as localStorageUtils } from '@/lib/localStorage';
import { regimeApi } from '@/lib/api';

interface IncompleteFormData {
  regimeId: string;
  regimeName: string;
  currentStep: number;
  totalSteps: number;
}

export function useIncompleteForm() {
  const [incompleteForm, setIncompleteForm] =
    useState<IncompleteFormData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkForIncompleteForm = async () => {
    try {
      setLoading(true);

      const progress = localStorageUtils.getIncompleteFormProgress();

      if (progress) {
        // Fetch regime details
        const regime = await regimeApi.getById(progress.regimeId);

        if (regime) {
          setIncompleteForm({
            regimeId: progress.regimeId,
            regimeName: regime.name,
            currentStep: progress.currentStep,
            totalSteps: 17, // Total steps in the form
          });
        } else {
          // If regime not found, clear the incomplete form data
          localStorageUtils.clearIncompleteForm(progress.regimeId);
          setIncompleteForm(null);
        }
      } else {
        setIncompleteForm(null);
      }
    } catch (error) {
      console.error('Error checking incomplete form:', error);
      setIncompleteForm(null);
    } finally {
      setLoading(false);
    }
  };

  const dismissIncompleteForm = () => {
    if (incompleteForm) {
      localStorageUtils.clearIncompleteForm(incompleteForm.regimeId);
      setIncompleteForm(null);
    }
  };

  // Check on mount
  useEffect(() => {
    checkForIncompleteForm();
  }, []);

  // Listen for storage changes (when user navigates between tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      checkForIncompleteForm();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Listen for custom events (when form is completed or cleared)
  useEffect(() => {
    const handleFormUpdate = () => {
      checkForIncompleteForm();
    };

    window.addEventListener('formCompleted', handleFormUpdate);
    window.addEventListener('formCleared', handleFormUpdate);

    return () => {
      window.removeEventListener('formCompleted', handleFormUpdate);
      window.removeEventListener('formCleared', handleFormUpdate);
    };
  }, []);

  return {
    incompleteForm,
    loading,
    dismissIncompleteForm,
    refreshIncompleteForm: checkForIncompleteForm,
  };
}
