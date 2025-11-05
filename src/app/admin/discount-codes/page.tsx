'use client';

import { supabaseClient } from '@/lib/supabase';
import { DiscountCode, convertDiscountCodeRowToDiscountCode, DiscountCodeRow } from '@/models/database';
import {
  Eye,
  EyeOff,
  Filter,
  Plus,
  Tag,
  Trash2,
  X,
  Edit
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DiscountCodeFormData {
  code: string;
  percentageOff: number;
  isActive: boolean;
  isRecurring: boolean;
}

export default function DiscountCodesAdmin() {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | 'all'>('all');
  const [selectedDiscountCode, setSelectedDiscountCode] = useState<DiscountCode | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DiscountCodeFormData>({
    code: '',
    percentageOff: 0,
    isActive: true,
    isRecurring: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const fetchDiscountCodes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const convertedDiscountCodes = data?.map((row: DiscountCodeRow) => convertDiscountCodeRowToDiscountCode(row)) || [];
      setDiscountCodes(convertedDiscountCodes);
    } catch (error) {
      console.error('Error fetching discount codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedDiscountCode(null);
    setFormData({
      code: '',
      percentageOff: 0,
      isActive: true,
      isRecurring: true,
    });
    setShowForm(true);
  };

  const handleEdit = (discountCode: DiscountCode) => {
    // Prevent editing of used one-time codes
    if (!discountCode.isRecurring && discountCode.usageCount > 0) {
      alert('Cannot edit a one-time discount code that has already been used');
      return;
    }

    setSelectedDiscountCode(discountCode);
    setFormData({
      code: discountCode.code,
      percentageOff: discountCode.percentageOff,
      isActive: discountCode.isActive,
      isRecurring: discountCode.isRecurring,
    });
    setShowForm(true);
  };

  const handleDelete = async (discountCodeId: string) => {
    const discountCode = discountCodes.find(dc => dc.id === discountCodeId);
    
    if (!discountCode) {
      alert('Discount code not found');
      return;
    }

    // Prevent deletion of used one-time codes
    if (!discountCode.isRecurring && discountCode.usageCount > 0) {
      alert('Cannot delete a one-time discount code that has already been used. It is already inactive.');
      setDeleteConfirm(null);
      return;
    }

    // Prevent deletion of used recurring codes
    if (discountCode.isRecurring && discountCode.usageCount > 0) {
      alert('Cannot delete a recurring discount code that has been used. Please deactivate it instead.');
      setDeleteConfirm(null);
      return;
    }

    try {
      const response = await fetch(`/api/discount-codes/${discountCodeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setDiscountCodes(discountCodes.filter(dc => dc.id !== discountCodeId));
        setDeleteConfirm(null);
      } else {
        alert(result.error || 'Failed to delete discount code');
      }
    } catch (error) {
      console.error('Error deleting discount code:', error);
      alert('Failed to delete discount code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedDiscountCode) {
        // Update existing discount code
        const response = await fetch(`/api/discount-codes/${selectedDiscountCode.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          setDiscountCodes(discountCodes.map(dc => 
            dc.id === selectedDiscountCode.id 
              ? { 
                  ...dc, 
                  code: formData.code,
                  percentageOff: formData.percentageOff,
                  isActive: formData.isActive,
                  isRecurring: formData.isRecurring,
                  updatedAt: new Date() 
                } 
              : dc
          ));
        } else {
          alert(result.error || 'Failed to update discount code');
          setIsSubmitting(false);
          return;
        }
      } else {
        // Create new discount code
        const response = await fetch('/api/discount-codes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (result.success) {
          setDiscountCodes([result.discountCode, ...discountCodes]);
        } else {
          alert(result.error || 'Failed to create discount code');
          setIsSubmitting(false);
          return;
        }
      }

      setShowForm(false);
      setSelectedDiscountCode(null);
    } catch (error) {
      console.error('Error saving discount code:', error);
      alert('Failed to save discount code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (discountCode: DiscountCode) => {
    // Prevent reactivation of one-time codes that have been used
    if (!discountCode.isRecurring && discountCode.usageCount > 0 && !discountCode.isActive) {
      alert('Cannot reactivate a one-time discount code that has already been used');
      return;
    }

    try {
      const response = await fetch(`/api/discount-codes/${discountCode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !discountCode.isActive }),
      });

      const result = await response.json();

      if (result.success) {
        setDiscountCodes(discountCodes.map(dc => 
          dc.id === discountCode.id 
            ? { ...dc, isActive: !dc.isActive, updatedAt: new Date() } 
            : dc
        ));
      } else {
        alert(result.error || 'Failed to update discount code status');
      }
    } catch (error) {
      console.error('Error updating discount code status:', error);
      alert('Failed to update discount code status');
    }
  };

  const filteredDiscountCodes = discountCodes.filter(discountCode => {
    const matchesSearch = discountCode.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || discountCode.isActive === filterActive;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#EF7E71]/10 via-[#D4654F]/8 to-[#FFE066]/10 rounded-xl p-4 border border-white/30 backdrop-blur-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#EF7E71]/20 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#D4654F]/20 to-transparent rounded-full translate-x-16 translate-y-16"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-4 items-center">
          <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#EF7E71] via-[#D4654F] to-[#FFE066] bg-clip-text text-transparent leading-tight">
                Discount Codes
              </h1>
              <p className="text-neutral-600 text-sm">
                Create and manage discount codes for customers
              </p>
              {/* Add Button */}
              <button
                onClick={handleAddNew}
                className="cursor-pointer w-fit group bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
              >
                <Plus className="w-4 h-4 transition-transform duration-300" />
              </button>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-center lg:items-end">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/50 shadow-lg w-full sm:w-auto">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center mx-auto shadow-md">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total Codes</p>
                  <p className="text-lg xl:text-xl font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                    {discountCodes.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
        
        <div className="relative z-10 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search discount codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border-2 border-neutral-300/50 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm transition-all duration-200 text-sm font-medium"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border-2 border-neutral-300/50">
                <Filter className="h-4 w-4 text-[#EF7E71]" />
                <span className="text-sm font-bold text-neutral-700">Status:</span>
              </div>
              <select
                value={filterActive === 'all' ? 'all' : filterActive.toString()}
                onChange={(e) => setFilterActive(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="border-2 border-neutral-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm min-w-[120px] text-sm font-medium"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Discount Codes Grid */}
      <section className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="rounded-full h-8 w-8 border-b-2 border-[#EF7E71]"></div>
            </div>
          </div>
        ) : filteredDiscountCodes.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
            <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
            
            <div className="relative z-10 text-center py-16">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-xl"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <Tag className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-900">No discount codes found</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto">
                  {searchTerm || filterActive !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by creating your first discount code'}
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Discount Code</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDiscountCodes.map((discountCode) => (
              <div
                key={discountCode.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center shadow-md">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-neutral-900 group-hover:text-[#EF7E71] transition-colors leading-tight">
                            {discountCode.code}
                          </h3>
                          <p className="text-neutral-600 text-sm">
                            {discountCode.percentageOff}% off
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <button
                        onClick={() => toggleStatus(discountCode)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-bold backdrop-blur-md border transition-all duration-300 shadow-md hover:shadow-lg text-xs ${
                          discountCode.isActive 
                            ? 'bg-green-100/90 text-green-800 border-green-200 hover:bg-green-200/90' 
                            : 'bg-red-100/90 text-red-800 border-red-200 hover:bg-red-200/90'
                        }`}
                      >
                        {discountCode.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{discountCode.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                          discountCode.isRecurring 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {discountCode.isRecurring ? 'Recurring' : 'One-time'}
                        </span>
                        {discountCode.isRecurring && (
                          <span className="text-xs text-neutral-600 font-semibold">
                            Used {discountCode.usageCount} {discountCode.usageCount === 1 ? 'time' : 'times'}
                          </span>
                        )}
                        {!discountCode.isRecurring && discountCode.usageCount > 0 && (
                          <span className="text-xs text-red-600 font-semibold">
                            Already used
                          </span>
                        )}
                      </div>
                      {discountCode.usageCount > 0 && (
                        <div className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-1 rounded">
                          {discountCode.isRecurring 
                            ? 'Used code - can only deactivate, not delete' 
                            : 'Used one-time code - locked'}
                        </div>
                      )}
                      <div className="text-xs text-neutral-500 font-bold">
                        Created {new Date(discountCode.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50">
                      <div className="text-xs text-neutral-500 font-bold">
                        Last updated {new Date(discountCode.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(discountCode)}
                          disabled={!discountCode.isRecurring && discountCode.usageCount > 0}
                          className={`p-2 rounded-lg border transition-all duration-300 shadow-sm ${
                            !discountCode.isRecurring && discountCode.usageCount > 0
                              ? 'text-neutral-400 bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-50'
                              : 'text-[#EF7E71] hover:bg-[#EF7E71]/10 border-[#EF7E71]/20 hover:border-[#EF7E71]/40 hover:shadow-md'
                          }`}
                          title={!discountCode.isRecurring && discountCode.usageCount > 0 
                            ? 'Cannot edit used one-time code' 
                            : 'Edit Discount Code'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(discountCode.id)}
                          disabled={discountCode.usageCount > 0}
                          className={`p-2 rounded-lg border transition-all duration-300 shadow-sm ${
                            discountCode.usageCount > 0
                              ? 'text-neutral-400 bg-neutral-100 border-neutral-200 cursor-not-allowed opacity-50'
                              : 'text-red-500 hover:bg-red-50 border-red-200 hover:border-red-300 hover:shadow-md'
                          }`}
                          title={discountCode.usageCount > 0 
                            ? discountCode.isRecurring 
                              ? 'Cannot delete used recurring code - deactivate instead' 
                              : 'Cannot delete used one-time code'
                            : 'Delete Discount Code'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20">
            <div className="p-8 border-b border-neutral-200/50 flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {selectedDiscountCode ? 'Edit Discount Code' : 'Add New Discount Code'}
                </h2>
                <p className="text-neutral-600 mt-2 font-semibold">
                  {selectedDiscountCode ? 'Update discount code details' : 'Create a new discount code for customers'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-4 hover:bg-primary/10 rounded-2xl transition-all duration-300 group"
              >
                <X className="h-8 w-8 text-primary group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
            
            <div className="max-h-[calc(90vh-160px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">Discount Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium uppercase"
                    placeholder="e.g., EIDSALE25"
                    required
                  />
                  <p className="text-sm text-neutral-600 mt-2">Enter a unique code (letters and numbers only)</p>
                </div>

                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">Percentage Off (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.percentageOff}
                    onChange={(e) => setFormData({...formData, percentageOff: parseInt(e.target.value) || 0})}
                    className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                    placeholder="25"
                    required
                  />
                  <p className="text-sm text-neutral-600 mt-2">Enter discount percentage (1-100)</p>
                </div>

                <div className="flex items-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                    className="w-6 h-6 text-primary bg-white border-2 border-primary rounded focus:ring-primary focus:ring-2 mr-4"
                  />
                  <div>
                    <label htmlFor="isRecurring" className="text-lg font-black text-neutral-900">
                      Recurring Discount Code
                    </label>
                    <p className="text-sm text-neutral-600 mt-1">
                      {formData.isRecurring 
                        ? 'Can be used multiple times until manually deactivated' 
                        : 'Can only be used once - will automatically deactivate after first use'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/20">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-6 h-6 text-primary bg-white border-2 border-primary rounded focus:ring-primary focus:ring-2 mr-4"
                  />
                  <label htmlFor="isActive" className="text-lg font-black text-neutral-900">
                    Make this discount code active and available to customers
                  </label>
                </div>

                <div className="flex justify-end space-x-6 pt-8 border-t border-neutral-200/50">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 text-neutral-600 border-2 border-neutral-300 rounded-2xl hover:bg-neutral-50 font-bold text-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl hover:shadow-2xl disabled:opacity-50 font-bold text-lg transition-all duration-300 shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      selectedDiscountCode ? 'Update Discount Code' : 'Create Discount Code'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-4">Confirm Delete</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Are you sure you want to delete this discount code? This action cannot be undone.
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-4 text-neutral-600 border-2 border-neutral-300 rounded-2xl hover:bg-neutral-50 font-bold text-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
