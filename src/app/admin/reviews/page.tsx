'use client';

import { supabaseClient } from '@/lib/supabase';
import { Review, convertReviewRowToReview, convertReviewToReviewInsert } from '@/models/database';
import {
  Check,
  Clock,
  Edit,
  Eye,
  EyeOff,
  Filter,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  Upload,
  User,
  X
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface ReviewFormData {
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  isApproved: boolean;
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterApproved, setFilterApproved] = useState<boolean | 'all'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    rating: 5,
    comment: '',
    avatar: '',
    isApproved: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedReviews = data?.map((row: any) => convertReviewRowToReview(row)) || [];
      setReviews(convertedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      // Convert to base64
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, avatar: base64 });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: '' });
  };

  const handleAddNew = () => {
    setSelectedReview(null);
    setFormData({
      name: '',
      rating: 5,
      comment: '',
      avatar: '',
      isApproved: false,
    });
    setShowForm(true);
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      avatar: review.avatar || '',
      isApproved: review.isApproved,
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const { error } = await supabaseClient
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      setReviews(reviews.filter(r => r.id !== reviewId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reviewData: Review = {
        id: selectedReview?.id || `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        createdAt: selectedReview?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      const reviewInsert = convertReviewToReviewInsert(reviewData);

      if (selectedReview) {
        // Update existing review
        const { error } = await supabaseClient
          .from('reviews')
          .update(reviewInsert)
          .eq('id', selectedReview.id);

        if (error) throw error;
        
        setReviews(reviews.map(r => r.id === selectedReview.id ? reviewData : r));
      } else {
        // Create new review
        const { error } = await supabaseClient
          .from('reviews')
          .insert([reviewInsert]);

        if (error) throw error;
        
        setReviews([reviewData, ...reviews]);
      }

      setShowForm(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprovalToggle = async (review: Review) => {
    try {
      const updatedReview = { 
        ...review, 
        isApproved: !review.isApproved,
        updatedAt: new Date()
      };
      const reviewInsert = convertReviewToReviewInsert(updatedReview);
      
      const { error } = await supabaseClient
        .from('reviews')
        .update(reviewInsert)
        .eq('id', review.id);

      if (error) throw error;
      
      setReviews(reviews.map(r => 
        r.id === review.id 
          ? { ...r, isApproved: !r.isApproved } 
          : r
      ));
    } catch (error) {
      console.error('Error updating review approval:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star 
              className={`h-5 w-5 ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterApproved === 'all' || review.isApproved === filterApproved;
    return matchesSearch && matchesFilter;
  });

  const getApprovalBadge = (isApproved: boolean) => {
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg font-bold border text-xs ${
        isApproved 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }`}>
        {isApproved ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
        <span>{isApproved ? 'Approved' : 'Pending'}</span>
      </span>
    );
  };

  const approvedReviews = reviews.filter(r => r.isApproved).length;

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
                Reviews
              </h1>
              <p className="text-neutral-600 text-sm">
                Manage and moderate customer reviews and testimonials
              </p>
              {/* Add Button */}
              <button
                onClick={handleAddNew}
                className="w-fit group bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
              >
                <Plus className="w-4 h-4 transition-transform duration-300" />
              </button>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-center lg:items-end">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/50 shadow-lg w-full sm:w-auto">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center mx-auto shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                      {reviews.length}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Approved</p>
                    <p className="text-lg font-black text-green-600">
                      {approvedReviews}
                    </p>
                  </div>
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
                placeholder="Search reviews by name or comment..."
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
                value={filterApproved === 'all' ? 'all' : filterApproved.toString()}
                onChange={(e) => setFilterApproved(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="border-2 border-neutral-300/50 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm min-w-[120px] text-sm font-medium"
              >
                <option value="all">All Reviews</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="relative">
              <div className="rounded-full h-8 w-8 border-b-2 border-[#EF7E71]"></div>
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
            <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
            
            <div className="relative z-10 text-center py-16">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-xl"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-900">No reviews found</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-bold text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add First Review</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {review.avatar ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#EF7E71]/30 shadow-md">
                          <Image
                            src={review.avatar}
                            alt={`${review.name}'s avatar`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback to default avatar on error
                              const target = e.target as HTMLElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 flex items-center justify-center border-2 border-[#EF7E71]/30">
                          <User className="h-8 w-8 text-[#EF7E71]/60" />
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-neutral-800 group-hover:text-[#EF7E71] transition-colors">
                            {review.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="font-bold text-neutral-600 text-sm">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                        {getApprovalBadge(review.isApproved)}
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-[#EF7E71]/20">
                        <p className="text-neutral-700 text-sm leading-relaxed italic font-medium">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                      </div>
                      
                      <div className="text-neutral-500 font-semibold text-xs">
                        <p>
                          Created: {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                    <button
                      onClick={() => handleApprovalToggle(review)}
                      className={`p-2 rounded-lg transition-all duration-300 font-bold border shadow-md hover:shadow-lg ${
                        review.isApproved
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 border-yellow-300'
                          : 'bg-green-100 text-green-600 hover:bg-green-200 border-green-300'
                      }`}
                      title={review.isApproved ? 'Unapprove' : 'Approve'}
                    >
                      {review.isApproved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg border border-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(review.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg border border-red-300 transition-all duration-300 shadow-md hover:shadow-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                  {selectedReview ? 'Edit Review' : 'Add New Review'}
                </h2>
                <p className="text-neutral-600 mt-2 font-semibold">
                  {selectedReview ? 'Update customer review details' : 'Create a new customer review'}
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
                  <label className="block text-lg font-black text-neutral-900 mb-4">Customer Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm transition-all text-lg font-medium"
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">Rating</label>
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border-2 border-primary/20">
                    {renderStars(formData.rating, true, (rating) => setFormData({...formData, rating}))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">Review Comment</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full border-2 border-neutral-300 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary bg-white/70 backdrop-blur-sm transition-all resize-none text-lg font-medium"
                    rows={4}
                    placeholder="Write the review comment..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-black text-neutral-900 mb-4">
                    Profile Image (Optional)
                  </label>
                  
                  {/* Avatar Preview and Upload */}
                  <div className="space-y-4">
                    {/* Current Avatar Display */}
                    {formData.avatar ? (
                      <div className="relative inline-block">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                          <Image
                            src={formData.avatar}
                            alt="Reviewer avatar"
                            fill
                            className="object-cover"
                            onError={() => {
                              console.error('Failed to load avatar image');
                              removeAvatar();
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all duration-300"
                          title="Remove avatar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center border-4 border-neutral-200">
                        <User className="h-16 w-16 text-neutral-400" />
                      </div>
                    )}

                    {/* Upload Button */}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 text-primary rounded-xl hover:shadow-lg disabled:opacity-50 transition-all duration-300 font-bold"
                      >
                        {uploadingAvatar ? (
                          <>
                            <div className="rounded-full h-5 w-5 border-b-2 border-primary"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5" />
                            <span>{formData.avatar ? 'Change Image' : 'Upload Image'}</span>
                          </>
                        )}
                      </button>
                      <p className="text-neutral-500 text-sm mt-2">
                        Supports: JPEG, PNG, WebP (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border-2 border-primary/20">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="isApproved"
                      checked={formData.isApproved}
                      onChange={(e) => setFormData({...formData, isApproved: e.target.checked})}
                      className="w-6 h-6 text-primary rounded focus:ring-2 focus:ring-primary border-2 border-primary"
                    />
                    <label htmlFor="isApproved" className="text-lg font-black text-neutral-800">
                      Approve this review for public display
                    </label>
                  </div>
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
                      selectedReview ? 'Update Review' : 'Create Review'
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
                Are you sure you want to delete this review? This action cannot be undone and will permanently remove the review from your system.
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
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}