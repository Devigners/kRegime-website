'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Calendar,
  ChevronDown,
  ChevronUp,
  Send,
  Upload,
  X,
  FileText,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Define subscriber types
interface Subscriber {
  id: string;
  email: string;
  source: 'footer' | 'coming_soon' | 'checkout' | 'manual';
  isActive: boolean;
  subscribedAt: Date;
  updatedAt: Date;
}

interface SubscriberResponse {
  subscribers: Subscriber[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ITEMS_PER_PAGE = 10;

export default function SubscribersTab() {
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [sending, setSending] = useState(false);

  // Newsletter form state
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    bySource: {
      footer: 0,
      coming_soon: 0,
      checkout: 0,
      manual: 0,
    },
  });

  // Calculate active subscribers for selected sources
  const getActiveSubscriberCount = () => {
    if (selectedSources.length === 0) return 0;
    return allSubscribers.filter(
      (s) => s.isActive && selectedSources.includes(s.source)
    ).length;
  };

  // Filter subscribers based on search and filters
  useEffect(() => {
    let filtered = allSubscribers;

    if (searchTerm) {
      filtered = filtered.filter((subscriber) =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter) {
      filtered = filtered.filter(
        (subscriber) => subscriber.source === sourceFilter
      );
    }

    if (statusFilter) {
      const isActive = statusFilter === 'true';
      filtered = filtered.filter(
        (subscriber) => subscriber.isActive === isActive
      );
    }

    setFilteredSubscribers(filtered);
    setTotalSubscribers(filtered.length);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [allSubscribers, searchTerm, sourceFilter, statusFilter]);

  const getCurrentPageSubscribers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSubscribers.slice(startIndex, endIndex);
  };

  const fetchSubscribers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscribers?limit=1000`);
      if (response.ok) {
        const data: SubscriberResponse = await response.json();
        setAllSubscribers(data.subscribers);
      } else {
        toast.error('Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        fetchSubscribers();
        toast.success(
          `Subscriber ${!currentStatus ? 'activated' : 'deactivated'} successfully`
        );
      } else {
        toast.error('Failed to update subscriber status');
      }
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      toast.error('Failed to update subscriber status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubscribers();
        setDeleteConfirm(null);
        toast.success('Subscriber deleted successfully');
      } else {
        toast.error('Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Source', 'Status', 'Subscribed At', 'Updated At'],
      ...filteredSubscribers.map((subscriber: Subscriber) => [
        subscriber.email,
        subscriber.source,
        subscriber.isActive ? 'Active' : 'Inactive',
        new Date(subscriber.subscribedAt).toLocaleString(),
        new Date(subscriber.updatedAt).toLocaleString(),
      ]),
    ]
      .map((row: string[]) =>
        row.map((field: string) => `"${field}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `subscribers_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Subscribers exported successfully');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/html') {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setHtmlContent(content);
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a valid HTML file');
    }
  };

  const handleSourceToggle = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  // Available variables for newsletter templates
  const availableVariables = [
    {
      variable: '{{ email }}',
      description: "Recipient's email address",
    },
    {
      variable: '{{ app-url }}',
      description: 'Application URL (e.g., https://kregime.com)',
    },
  ];

  const handleSendNewsletter = async () => {
    if (!newsletterTitle.trim()) {
      toast.error('Please enter a newsletter title');
      return;
    }
    if (!htmlContent.trim()) {
      toast.error('Please provide HTML content');
      return;
    }
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsletterTitle,
          htmlContent,
          sources: selectedSources,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          `Newsletter sent to ${data.newsletter.sent_count} subscribers!`
        );
        setShowNewsletterModal(false);
        setNewsletterTitle('');
        setHtmlContent('');
        setSelectedSources([]);
        setUploadedFile(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast.error('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const active = allSubscribers.filter((s: Subscriber) => s.isActive).length;
    const inactive = allSubscribers.length - active;

    const bySource = allSubscribers.reduce(
      (acc: Record<string, number>, subscriber: Subscriber) => {
        acc[subscriber.source] = (acc[subscriber.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    setStats({
      total: allSubscribers.length,
      active,
      inactive,
      bySource: {
        footer: bySource.footer || 0,
        coming_soon: bySource.coming_soon || 0,
        checkout: bySource.checkout || 0,
        manual: bySource.manual || 0,
      },
    });
  }, [allSubscribers]);

  const getSourceLabel = (source: string) => {
    const labels = {
      footer: 'Footer Newsletter',
      coming_soon: 'Coming Soon',
      checkout: 'Checkout',
      manual: 'Manual',
    };
    return labels[source as keyof typeof labels] || source;
  };

  const getSourceColor = (source: string) => {
    const colors = {
      footer: 'bg-blue-100 text-blue-800',
      coming_soon: 'bg-purple-100 text-purple-800',
      checkout: 'bg-green-100 text-green-800',
      manual: 'bg-gray-100 text-gray-800',
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF7E71]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleExport}
          className="cursor-pointer w-fit group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-semibold">Export CSV</span>
        </motion.button>

        <motion.button
          onClick={() => setShowNewsletterModal(true)}
          className="cursor-pointer w-fit group bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-4 h-4" />
          <span className="text-sm font-semibold">Create Newsletter</span>
        </motion.button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-blue-600/5"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Total Subscribers
                </p>
                <p className="text-2xl font-black text-neutral-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-green-600/5"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">Active</p>
                <p className="text-2xl font-black text-green-600">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-red-600/5"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
                <UserX className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Inactive
                </p>
                <p className="text-2xl font-black text-red-600">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#EF7E71]/5 to-[#D4654F]/5"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg shadow-md">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  This Month
                </p>
                <p className="text-2xl font-black text-[#EF7E71]">
                  {
                    allSubscribers.filter(
                      (s: Subscriber) =>
                        new Date(s.subscribedAt).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent bg-white/50 backdrop-blur-sm font-medium"
            />

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent bg-white/50 backdrop-blur-sm font-medium"
            >
              <option value="">All Sources</option>
              <option value="footer">Footer Newsletter</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="checkout">Checkout</option>
              <option value="manual">Manual</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent bg-white/50 backdrop-blur-sm font-medium"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSourceFilter('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

        <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {getCurrentPageSubscribers().map((subscriber) => (
                  <motion.tr
                    key={subscriber.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-neutral-400 mr-2" />
                        <span className="text-sm font-semibold text-neutral-900">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getSourceColor(subscriber.source)}`}
                      >
                        {getSourceLabel(subscriber.source)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                          subscriber.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              subscriber.id,
                              subscriber.isActive
                            )
                          }
                          className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${
                            subscriber.isActive
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                          title={
                            subscriber.isActive ? 'Deactivate' : 'Activate'
                          }
                        >
                          {subscriber.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(subscriber.id)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-red-600 transition-colors"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {getCurrentPageSubscribers().length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-black text-neutral-900 mb-2">
                No subscribers found
              </h3>
              <p className="text-neutral-600 font-semibold">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-600">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalSubscribers)} of{' '}
                {totalSubscribers} subscribers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-4 h-4 rotate-[-90deg]" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white shadow-md'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/20"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Trash2 className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Are you sure you want to permanently delete this subscriber?
                  This action cannot be undone.
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Modal */}
      <AnimatePresence>
        {showNewsletterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-white/20 my-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                  Create Newsletter
                </h2>
                <button
                  onClick={() => setShowNewsletterModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Newsletter Title */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Newsletter Title
                  </label>
                  <input
                    type="text"
                    value={newsletterTitle}
                    onChange={(e) => setNewsletterTitle(e.target.value)}
                    placeholder="Enter newsletter title..."
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent font-medium"
                  />
                </div>

                {/* HTML Content Input */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    HTML Content
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <textarea
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="Paste your HTML template here..."
                        rows={10}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent font-mono text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-[#EF7E71] transition-colors">
                        <Upload className="w-5 h-5" />
                        <span className="font-semibold">Upload HTML File</span>
                        <input
                          type="file"
                          accept=".html"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {uploadedFile && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 p-2 rounded-lg">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">
                            {uploadedFile.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Available Variables */}
                <div className="">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Available Variables
                  </label>
                  <div className="space-y-2">
                    {availableVariables.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-purple-200/50"
                      >
                        <code className="text-sm font-bold text-white bg-primary px-2 py-1 rounded whitespace-nowrap">
                          {item.variable}
                        </code>
                        <span className="text-sm text-neutral-600 font-medium flex-1">
                          {item.description}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.variable);
                            toast.success('Variable copied to clipboard!');
                          }}
                          className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors text-primary"
                          title="Copy variable"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-3">
                    Use these variables in your HTML template. They will be
                    replaced with actual values for each recipient.
                  </p>
                </div>

                {/* HTML Preview */}
                {htmlContent && (
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-neutral-300 rounded-lg p-4 bg-white max-h-64 overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    </div>
                  </div>
                )}

                {/* Source Selection */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Select Subscriber Sources
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['footer', 'coming_soon', 'checkout', 'manual'].map(
                      (source) => (
                        <label
                          key={source}
                          className={`cursor-pointer flex items-center gap-2 px-4 py-3 border-2 rounded-lg transition-all ${
                            selectedSources.includes(source)
                              ? 'border-[#EF7E71] bg-[#EF7E71]/10'
                              : 'border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedSources.includes(source)}
                            onChange={() => handleSourceToggle(source)}
                            className="w-4 h-4 text-[#EF7E71] rounded focus:ring-[#EF7E71]"
                          />
                          <span className="font-semibold text-sm">
                            {getSourceLabel(source)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Active Subscribers Count */}
                {selectedSources.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-blue-900">
                      <span className="text-2xl">
                        {getActiveSubscriberCount()}
                      </span>{' '}
                      active subscribers will receive this newsletter
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowNewsletterModal(false)}
                    className="flex-1 px-6 py-4 text-neutral-600 border-2 border-neutral-300 rounded-2xl hover:bg-neutral-50 font-bold text-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendNewsletter}
                    disabled={sending || getActiveSubscriberCount() === 0}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-2xl hover:shadow-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Newsletter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
