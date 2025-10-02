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
  ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Define subscriber types locally until database types are regenerated
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

export default function SubscribersPage() {
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    bySource: {
      footer: 0,
      coming_soon: 0,
      checkout: 0,
      manual: 0
    }
  });

  // Filter subscribers based on search and filters
  useEffect(() => {
    let filtered = allSubscribers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by source
    if (sourceFilter) {
      filtered = filtered.filter(subscriber => subscriber.source === sourceFilter);
    }

    // Filter by status
    if (statusFilter) {
      const isActive = statusFilter === 'true';
      filtered = filtered.filter(subscriber => subscriber.isActive === isActive);
    }

    setFilteredSubscribers(filtered);
    setTotalSubscribers(filtered.length);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [allSubscribers, searchTerm, sourceFilter, statusFilter]);

  // Get current page subscribers
  const getCurrentPageSubscribers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSubscribers.slice(startIndex, endIndex);
  };

  // Fetch all subscribers (only once)
  const fetchSubscribers = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all subscribers without pagination
      const response = await fetch(`/api/subscribers?limit=1000`);
      if (response.ok) {
        const data: SubscriberResponse = await response.json();
        setAllSubscribers(data.subscribers);
      } else {
        console.error('Failed to fetch subscribers');
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

  // Handle subscriber status toggle
  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        fetchSubscribers(); // Refresh the list
        const action = !currentStatus ? 'activated' : 'deactivated';
        toast.success(`Subscriber ${action} successfully`);
      } else {
        console.error('Failed to update subscriber status');
        toast.error('Failed to update subscriber status');
      }
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      toast.error('Failed to update subscriber status');
    }
  };

  // Handle subscriber deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this subscriber?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subscribers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSubscribers(); // Refresh the list
        toast.success('Subscriber deleted successfully');
      } else {
        console.error('Failed to delete subscriber');
        toast.error('Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  // Export subscribers to CSV
  const handleExport = () => {
    const csvContent = [
      ['Email', 'Source', 'Status', 'Subscribed At', 'Updated At'],
      ...filteredSubscribers.map((subscriber: Subscriber) => [
        subscriber.email,
        subscriber.source,
        subscriber.isActive ? 'Active' : 'Inactive',
        new Date(subscriber.subscribedAt).toLocaleString(),
        new Date(subscriber.updatedAt).toLocaleString()
      ])
    ]
      .map((row: string[]) => row.map((field: string) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Subscribers exported successfully');
  };

  // Calculate statistics
  useEffect(() => {
    const active = allSubscribers.filter((s: Subscriber) => s.isActive).length;
    const inactive = allSubscribers.length - active;
    
    const bySource = allSubscribers.reduce((acc: Record<string, number>, subscriber: Subscriber) => {
      acc[subscriber.source] = (acc[subscriber.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      total: allSubscribers.length,
      active,
      inactive,
      bySource: {
        footer: bySource.footer || 0,
        coming_soon: bySource.coming_soon || 0,
        checkout: bySource.checkout || 0,
        manual: bySource.manual || 0
      }
    });
  }, [allSubscribers]);

  // Reset page when filters change (remove this old effect)
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, sourceFilter, statusFilter]);

  const getSourceLabel = (source: string) => {
    const labels = {
      footer: 'Footer Newsletter',
      coming_soon: 'Coming Soon',
      checkout: 'Checkout',
      manual: 'Manual'
    };
    return labels[source as keyof typeof labels] || source;
  };

  const getSourceColor = (source: string) => {
    const colors = {
      footer: 'bg-blue-100 text-blue-800',
      coming_soon: 'bg-purple-100 text-purple-800',
      checkout: 'bg-green-100 text-green-800',
      manual: 'bg-gray-100 text-gray-800'
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
    <div className="space-y-6 max-w-7xl mx-auto">
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
                Email Subscribers
              </h1>
                <p className="text-neutral-600 text-sm">
                  Manage your newsletter subscribers and track engagement
                </p>
              {/* Export Button */}
              <motion.button
                onClick={handleExport}
                className="cursor-pointer w-fit group bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 transition-transform duration-300" />
                <span className="text-sm font-semibold">Export CSV</span>
              </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-center lg:items-end">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/50 shadow-lg w-full sm:w-auto">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center mx-auto shadow-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                      {stats.total}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Active</p>
                    <p className="text-lg font-black text-green-600">
                      {stats.active}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <p className="text-sm font-semibold text-neutral-600">Total Subscribers</p>
                <p className="text-2xl font-black text-neutral-900">{stats.total}</p>
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
                <p className="text-2xl font-black text-green-600">{stats.active}</p>
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
                <p className="text-sm font-semibold text-neutral-600">Inactive</p>
                <p className="text-2xl font-black text-red-600">{stats.inactive}</p>
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
                <p className="text-sm font-semibold text-neutral-600">This Month</p>
                <p className="text-2xl font-black text-[#EF7E71]">
                  {allSubscribers.filter((s: Subscriber) => 
                    new Date(s.subscribedAt).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-100/20 to-neutral-200/20"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
        
        <div className="relative z-10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#EF7E71] focus:border-transparent bg-white/50 backdrop-blur-sm font-medium"
              />
            </div>

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
                        <span className="text-sm font-semibold text-neutral-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${getSourceColor(subscriber.source)}`}>
                        {getSourceLabel(subscriber.source)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                        subscriber.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusToggle(subscriber.id, subscriber.isActive)}
                          className={`p-1.5 rounded-lg hover:bg-neutral-100 transition-colors ${
                            subscriber.isActive ? 'text-red-600' : 'text-green-600'
                          }`}
                          title={subscriber.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {subscriber.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(subscriber.id)}
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

          {getCurrentPageSubscribers().length === 0 && !loading && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-black text-neutral-900 mb-2">No subscribers found</h3>
              <p className="text-neutral-600 font-semibold">Try adjusting your search criteria or filters.</p>
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
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalSubscribers)} of {totalSubscribers} subscribers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    </div>
  );
}