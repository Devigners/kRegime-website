'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Newsletter {
  id: string;
  title: string;
  html_content: string;
  sources: string[];
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  created_at: string;
  sent_at: string | null;
}

interface NewsletterResponse {
  newsletters: Newsletter[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ITEMS_PER_PAGE = 10;

export default function NewslettersTab() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fetchNewsletters = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/newsletters?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.ok) {
        const data: NewsletterResponse = await response.json();
        setNewsletters(data.newsletters);
        setTotalNewsletters(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error('Failed to fetch newsletters');
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast.error('Failed to fetch newsletters');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'sending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'draft':
        return <Mail className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      footer: 'Footer',
      coming_soon: 'Coming Soon',
      checkout: 'Checkout',
      manual: 'Manual',
    };
    return labels[source] || source;
  };

  const handlePreview = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowPreviewModal(true);
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
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-blue-600/5"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Total Newsletters
                </p>
                <p className="text-2xl font-black text-neutral-900">
                  {totalNewsletters}
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
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Successfully Sent
                </p>
                <p className="text-2xl font-black text-green-600">
                  {newsletters.filter((n) => n.status === 'sent').length}
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
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-600">
                  Total Recipients
                </p>
                <p className="text-2xl font-black text-[#EF7E71]">
                  {newsletters.reduce((sum, n) => sum + n.sent_count, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletters Table */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>

        <div className="relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Sources
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Sent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-neutral-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {newsletters.map((newsletter) => (
                  <motion.tr
                    key={newsletter.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Send className="w-4 h-4 text-neutral-400 mr-2" />
                        <span className="text-sm font-semibold text-neutral-900">
                          {newsletter.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(newsletter.status)}`}
                      >
                        {getStatusIcon(newsletter.status)}
                        {newsletter.status.charAt(0).toUpperCase() +
                          newsletter.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {newsletter.sources.map((source) => (
                          <span
                            key={source}
                            className="inline-flex px-2 py-0.5 text-xs font-semibold bg-neutral-100 text-neutral-700 rounded"
                          >
                            {getSourceLabel(source)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-600">
                      {newsletter.recipient_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="font-bold text-green-600">
                          {newsletter.sent_count}
                        </span>
                        {newsletter.failed_count > 0 && (
                          <>
                            {' / '}
                            <span className="font-bold text-red-600">
                              {newsletter.failed_count} failed
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-600">
                      {newsletter.sent_at
                        ? new Date(newsletter.sent_at).toLocaleDateString()
                        : 'Not sent'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePreview(newsletter)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-blue-600 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {newsletters.length === 0 && (
            <div className="text-center py-12">
              <Send className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-black text-neutral-900 mb-2">
                No newsletters yet
              </h3>
              <p className="text-neutral-600 font-semibold">
                Create your first newsletter to get started!
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
                {Math.min(currentPage * ITEMS_PER_PAGE, totalNewsletters)} of{' '}
                {totalNewsletters} newsletters
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

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedNewsletter && (
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
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                    {selectedNewsletter.title}
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    Sent to {selectedNewsletter.sent_count} of{' '}
                    {selectedNewsletter.recipient_count} recipients
                  </p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Newsletter Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(selectedNewsletter.status)}`}
                    >
                      {getStatusIcon(selectedNewsletter.status)}
                      {selectedNewsletter.status.charAt(0).toUpperCase() +
                        selectedNewsletter.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                      Sent Date
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedNewsletter.sent_at
                        ? new Date(selectedNewsletter.sent_at).toLocaleString()
                        : 'Not sent'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                      Sources
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedNewsletter.sources.map((source) => (
                        <span
                          key={source}
                          className="inline-flex px-2 py-0.5 text-xs font-semibold bg-white text-neutral-700 rounded"
                        >
                          {getSourceLabel(source)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                      Results
                    </p>
                    <p className="text-sm font-semibold">
                      <span className="text-green-600">
                        {selectedNewsletter.sent_count} sent
                      </span>
                      {selectedNewsletter.failed_count > 0 && (
                        <>
                          ,{' '}
                          <span className="text-red-600">
                            {selectedNewsletter.failed_count} failed
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* HTML Preview */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    HTML Content Preview
                  </label>
                  <div className="border border-neutral-300 rounded-lg p-4 bg-white max-h-96 overflow-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedNewsletter.html_content,
                      }}
                    />
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-xl hover:shadow-xl font-bold transition-all duration-300"
                  >
                    Close
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
