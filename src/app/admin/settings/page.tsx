'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Building2, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface BankAccountData {
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  iban: string;
}

interface PasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function SettingsPage() {
  const [bankAccount, setBankAccount] = useState<BankAccountData>({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    iban: ''
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch existing settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setBankAccount({
          account_holder_name: data.account_holder_name || '',
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          iban: data.iban || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleBankAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccount({
      ...bankAccount,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // Prepare data to submit
      const submitData: Record<string, string> = {
        ...bankAccount
      };

      // Only include password fields if user is trying to change password
      if (passwords.new_password || passwords.current_password || passwords.confirm_password) {
        submitData.current_password = passwords.current_password;
        submitData.new_password = passwords.new_password;
        submitData.confirm_password = passwords.confirm_password;
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        // Clear password fields after successful save
        setPasswords({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        // Refresh settings
        await fetchSettings();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'An error occurred while saving settings' });
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your admin account settings and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Bank Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Business Bank Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Name of the Account Holder
              </label>
              <input
                type="text"
                name="account_holder_name"
                value={bankAccount.account_holder_name}
                onChange={handleBankAccountChange}
                placeholder="Enter account holder name"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={bankAccount.bank_name}
                onChange={handleBankAccountChange}
                placeholder="Enter bank name"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                name="account_number"
                value={bankAccount.account_number}
                onChange={handleBankAccountChange}
                placeholder="Enter account number"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                IBAN
              </label>
              <input
                type="text"
                name="iban"
                value={bankAccount.iban}
                onChange={handleBankAccountChange}
                placeholder="Enter IBAN"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="current_password"
                value={passwords.current_password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="focus:outline-none w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
