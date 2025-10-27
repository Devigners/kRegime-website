'use client';

import { supabaseClient } from '@/lib/supabase';
import { Regime, convertRegimeRowToRegime, convertRegimeToRegimeInsert } from '@/models/database';
import {
  Edit,
  Eye,
  EyeOff,
  Filter,
  Package,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ImageUploader from '@/components/ImageUploader';

interface RegimeFormData {
  name: string;
  description: string;
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
  discountOneTime: number;
  discount3Months: number;
  discount6Months: number;
  discountReasonOneTime: string;
  discountReason3Months: string;
  discountReason6Months: string;
  steps: string[];
  images: string[];
  stepCount: 3 | 5 | 7;
  isActive: boolean;
}

export default function RegimesAdmin() {
  const [regimes, setRegimes] = useState<Regime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | 'all'>('all');
  const [selectedRegime, setSelectedRegime] = useState<Regime | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<RegimeFormData>({
    name: '',
    description: '',
    priceOneTime: 0,
    price3Months: 0,
    price6Months: 0,
    discountOneTime: 0,
    discount3Months: 0,
    discount6Months: 0,
    discountReasonOneTime: '',
    discountReason3Months: '',
    discountReason6Months: '',
    steps: [''],
    images: [''],
    stepCount: 3,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchRegimes();
  }, []);

  const fetchRegimes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('regimes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedRegimes = data?.map((row: any) => convertRegimeRowToRegime(row)) || [];
      
      // Sort regimes in specific order: Tribox, Pentabox, Septabox
      const sortOrder = ['tribox', 'pentabox', 'septabox'];
      convertedRegimes.sort((a, b) => {
        const aIndex = sortOrder.indexOf(a.name.toLowerCase());
        const bIndex = sortOrder.indexOf(b.name.toLowerCase());
        
        // If both are in the sort order, sort by their position
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        // If only a is in the sort order, it comes first
        if (aIndex !== -1) return -1;
        // If only b is in the sort order, it comes first
        if (bIndex !== -1) return 1;
        // If neither are in the sort order, maintain original order
        return 0;
      });
      
      setRegimes(convertedRegimes);
    } catch (error) {
      console.error('Error fetching regimes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedRegime(null);
    setFormData({
      name: '',
      description: '',
      priceOneTime: 0,
      price3Months: 0,
      price6Months: 0,
      discountOneTime: 0,
      discount3Months: 0,
      discount6Months: 0,
      discountReasonOneTime: '',
      discountReason3Months: '',
      discountReason6Months: '',
      steps: [''],
      images: [''],
      stepCount: 3,
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (regime: Regime) => {
    setSelectedRegime(regime);
    setFormData({
      name: regime.name,
      description: regime.description,
      priceOneTime: regime.priceOneTime,
      price3Months: regime.price3Months,
      price6Months: regime.price6Months,
      discountOneTime: regime.discountOneTime || 0,
      discount3Months: regime.discount3Months || 0,
      discount6Months: regime.discount6Months || 0,
      discountReasonOneTime: regime.discountReasonOneTime || '',
      discountReason3Months: regime.discountReason3Months || '',
      discountReason6Months: regime.discountReason6Months || '',
      steps: regime.steps,
      images: regime.images,
      stepCount: regime.stepCount,
      isActive: regime.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (regimeId: string) => {
    try {
      const { error } = await supabaseClient
        .from('regimes')
        .delete()
        .eq('id', regimeId);

      if (error) throw error;
      
      setRegimes(regimes.filter(r => r.id !== regimeId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting regime:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const regimeData: Regime = {
        id: selectedRegime?.id || `regime_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        priceOneTime: formData.priceOneTime,
        price3Months: formData.price3Months,
        price6Months: formData.price6Months,
        discountOneTime: formData.discountOneTime || 0,
        discount3Months: formData.discount3Months || 0,
        discount6Months: formData.discount6Months || 0,
        discountReasonOneTime: formData.discountReasonOneTime || null,
        discountReason3Months: formData.discountReason3Months || null,
        discountReason6Months: formData.discountReason6Months || null,
        createdAt: selectedRegime?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      const regimeInsert = convertRegimeToRegimeInsert(regimeData);

      if (selectedRegime) {
        // Update existing regime
        const { error } = await supabaseClient
          .from('regimes')
          .update(regimeInsert)
          .eq('id', selectedRegime.id);

        if (error) throw error;
        
        setRegimes(regimes.map(r => r.id === selectedRegime.id ? regimeData : r));
      } else {
        // Create new regime
        const { error } = await supabaseClient
          .from('regimes')
          .insert([regimeInsert]);

        if (error) throw error;
        
        setRegimes([regimeData, ...regimes]);
      }

      setShowForm(false);
      setSelectedRegime(null);
    } catch (error) {
      console.error('Error saving regime:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };



  const filteredRegimes = regimes.filter(regime => {
    const matchesSearch = regime.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         regime.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || regime.isActive === filterActive;
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
                Regimes
              </h1>
                <p className="text-neutral-600 text-sm">
                  Create and manage personalized skincare regimes for your customers
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
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total Regimes</p>
                  <p className="text-lg xl:text-xl font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                    {regimes.length}
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
                placeholder="Search regimes by name or description..."
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

      {/* Regimes Grid */}
      <section className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="rounded-full h-8 w-8 border-b-2 border-[#EF7E71]"></div>
            </div>
          </div>
        ) : filteredRegimes.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
            <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
            
            <div className="relative z-10 text-center py-16">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-xl"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <Package className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-900">No regimes found</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto">
                  {searchTerm || filterActive !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Start by creating your first skincare regime'}
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Regime</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRegimes.map((regime) => (
              <div
                key={regime.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-32 bg-gradient-to-br from-[#EF7E71]/10 to-[#D4654F]/10 overflow-hidden">
                  {regime.images && regime.images.length > 0 ? (
                    <Image
                      src={regime.images[0]}
                      alt={regime.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-xl flex items-center justify-center mx-auto shadow-md">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-neutral-500 font-bold text-xs">No Image</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={async () => {
                        try {
                          const updatedRegime = { 
                            ...regime, 
                            isActive: !regime.isActive,
                            updatedAt: new Date()
                          };
                          const regimeInsert = convertRegimeToRegimeInsert(updatedRegime);
                          
                          const { error } = await supabaseClient
                            .from('regimes')
                            .update(regimeInsert)
                            .eq('id', regime.id);

                          if (error) throw error;
                          
                          setRegimes(regimes.map(r => 
                            r.id === regime.id 
                              ? { ...r, isActive: !r.isActive } 
                              : r
                          ));
                        } catch (error) {
                          console.error('Error updating regime status:', error);
                        }
                      }}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-lg font-bold backdrop-blur-md border transition-all duration-300 shadow-md hover:shadow-lg text-xs ${
                        regime.isActive 
                          ? 'bg-green-100/90 text-green-800 border-green-200 hover:bg-green-200/90' 
                          : 'bg-red-100/90 text-red-800 border-red-200 hover:bg-red-200/90'
                      }`}
                    >
                      {regime.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      <span>{regime.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-black text-lg text-neutral-900 mb-1 group-hover:text-[#EF7E71] transition-colors leading-tight">
                        {regime.name}
                      </h3>
                      <p className="text-neutral-600 text-sm leading-relaxed line-clamp-2">
                        {regime.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 bg-gradient-to-r from-[#EF7E71]/10 to-[#D4654F]/10 rounded-lg border border-[#EF7E71]/20">
                          <span className="font-black text-[#EF7E71] text-xs">
                            {regime.stepCount} Steps
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Pricing</p>
                        <div className="space-y-1">
                          <div>
                            <p className="text-sm font-black text-[#EF7E71] flex items-center justify-end gap-1">
                              One-time: AED {regime.priceOneTime}
                              {regime.discountOneTime > 0 && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                  -{regime.discountOneTime}%
                                </span>
                              )}
                            </p>
                            {regime.discountOneTime > 0 && regime.discountReasonOneTime && (
                              <p className="text-xs text-neutral-600 italic">
                                {regime.discountReasonOneTime}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 flex items-center justify-end gap-1">
                              3mo: AED {regime.price3Months}/mo
                              {regime.discount3Months > 0 && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                  -{regime.discount3Months}%
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-600 flex items-center justify-end gap-1">
                              6mo: AED {regime.price6Months}/mo
                              {regime.discount6Months > 0 && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                                  -{regime.discount6Months}%
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50">
                      <div className="text-xs text-neutral-500 font-bold">
                        Created {new Date(regime.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(regime)}
                          className="p-2 text-[#EF7E71] hover:bg-[#EF7E71]/10 rounded-lg border border-[#EF7E71]/20 hover:border-[#EF7E71]/40 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Edit Regime"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(regime.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Delete Regime"
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
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20">
            <div className="p-8 border-b border-neutral-200/50 flex justify-between items-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {selectedRegime ? 'Edit Regime' : 'Add New Regime'}
                </h2>
                <p className="text-neutral-600 mt-2 font-semibold">
                  {selectedRegime ? 'Update your existing skincare regime' : 'Create a new skincare regime for your customers'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-full">
                    <label className="block text-lg font-black text-neutral-900 mb-4">Regime Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                      placeholder="Enter regime name..."
                      required
                    />
                  </div>
                </div>

                {/* Subscription Pricing Section */}
                <div>
                  <h3 className="text-xl font-black text-neutral-900 mb-6">Subscription Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <label className="block text-lg font-black text-neutral-900 mb-4">One-time Purchase (AED)</label>
                      <input
                        type="number"
                        value={formData.priceOneTime}
                        onChange={(e) => setFormData({...formData, priceOneTime: parseFloat(e.target.value) || 0})}
                        className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                        placeholder="0.00"
                        required
                      />
                      <p className="text-sm text-neutral-600">One time payment</p>
                      <div className="pt-2 border-t border-neutral-200">
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={formData.discountOneTime}
                          onChange={(e) => setFormData({...formData, discountOneTime: parseFloat(e.target.value) || 0})}
                          className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                          placeholder="0"
                        />
                      </div>
                      {formData.discountOneTime > 0 && (
                        <div>
                          <label className="block text-sm font-bold text-neutral-700 mb-2">Discount Reason</label>
                          <input
                            type="text"
                            value={formData.discountReasonOneTime}
                            onChange={(e) => setFormData({...formData, discountReasonOneTime: e.target.value})}
                            className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                            placeholder="e.g., Eid Sale"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-lg font-black text-neutral-900 mb-4">3-Month Subscription (AED)</label>
                      <input
                        type="number"
                        value={formData.price3Months}
                        onChange={(e) => setFormData({...formData, price3Months: parseFloat(e.target.value) || 0})}
                        className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                        placeholder="0.00"
                        required
                      />
                      <p className="text-sm text-neutral-600">Monthly payment for 3 months</p>
                      <div className="pt-2 border-t border-neutral-200">
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={formData.discount3Months}
                          onChange={(e) => setFormData({...formData, discount3Months: parseFloat(e.target.value) || 0})}
                          className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                          placeholder="0"
                        />
                      </div>
                      {formData.discount3Months > 0 && (
                        <div>
                          <label className="block text-sm font-bold text-neutral-700 mb-2">Discount Reason</label>
                          <input
                            type="text"
                            value={formData.discountReason3Months}
                            onChange={(e) => setFormData({...formData, discountReason3Months: e.target.value})}
                            className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                            placeholder="e.g., Limited Offer"
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <label className="block text-lg font-black text-neutral-900 mb-4">6-Month Subscription (AED)</label>
                      <input
                        type="number"
                        value={formData.price6Months}
                        onChange={(e) => setFormData({...formData, price6Months: parseFloat(e.target.value) || 0})}
                        className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                        placeholder="0.00"
                        required
                      />
                      <p className="text-sm text-neutral-600">Monthly payment for 6 months</p>
                      <div className="pt-2 border-t border-neutral-200">
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Discount (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={formData.discount6Months}
                          onChange={(e) => setFormData({...formData, discount6Months: parseFloat(e.target.value) || 0})}
                          className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                          placeholder="0"
                        />
                      </div>
                      {formData.discount6Months > 0 && (
                        <div>
                          <label className="block text-sm font-bold text-neutral-700 mb-2">Discount Reason</label>
                          <input
                            type="text"
                            value={formData.discountReason6Months}
                            onChange={(e) => setFormData({...formData, discountReason6Months: e.target.value})}
                            className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-base font-medium"
                            placeholder="e.g., Summer Special"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                    rows={4}
                    placeholder="Describe the regime benefits and target audience..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block tedxt-lg font-black text-neutral-900 mb-4">Step Count</label>
                    <select
                      value={formData.stepCount}
                      onChange={(e) => setFormData({...formData, stepCount: parseInt(e.target.value) as 3 | 5 | 7})}
                      className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                    >
                      <option value={3}>3 Steps (Basic)</option>
                      <option value={5}>5 Steps (Standard)</option>
                      <option value={7}>7 Steps (Premium)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-black text-neutral-900 mb-4">Regime Images</label>
                    <ImageUploader
                      images={formData.images}
                      onImagesChange={(newImages) => setFormData({ ...formData, images: newImages })}
                      maxImages={3}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <label className="block text-lg font-black text-neutral-900">Regime Steps</label>
                    <button
                      type="button"
                      onClick={addStep}
                      className="text-primary hover:bg-primary/10 px-4 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-2 border-2 border-primary/20 hover:border-primary/40"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Add Step</span>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.steps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-12 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => handleStepChange(index, e.target.value)}
                          className="flex-1 border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white/70 backdrop-blur-sm text-lg font-medium"
                          placeholder={`Step ${index + 1} description...`}
                          required
                        />
                        {formData.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="px-4 py-4 text-red-500 hover:bg-red-50 rounded-2xl border-2 border-red-200 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
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
                    Make this regime active and available to customers
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
                      selectedRegime ? 'Update Regime' : 'Create Regime'
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
                Are you sure you want to delete this regime? This action cannot be undone and will permanently remove all associated data.
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