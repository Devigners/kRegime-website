'use client';

import DirhamIcon from '@/components/icons/DirhamIcon';
import { supabaseClient } from '@/lib/supabase';
import { Order, convertOrderRowToOrder } from '@/models/database';
import {
  Activity,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Tag,
  Trash2,
  Truck,
  XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Extended Order interface to include regime information
interface OrderWithRegime extends Order {
  regime?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    step_count: number;
  };
  discountCode?: {
    id: string;
    code: string;
    percentageOff: number;
  };
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<OrderWithRegime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGift, setFilterGift] = useState<string>('all'); // all, gift-only, non-gift

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [statusUpdateConfirm, setStatusUpdateConfirm] = useState<{
    orderId: string;
    newStatus: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  } | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      // Fetch orders, regimes, and discount codes separately, then join manually
      const [ordersResult, regimesResult, discountCodesResult] = await Promise.all([
        supabaseClient
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false }),
        supabaseClient
          .from('regimes')
          .select('id, name, description, price, image, step_count'),
        supabaseClient
          .from('discount_codes')
          .select('id, code, percentage_off')
      ]);

      if (ordersResult.error) throw ordersResult.error;
      if (regimesResult.error) throw regimesResult.error;
      if (discountCodesResult.error) throw discountCodesResult.error;

      // Create lookup maps for regimes and discount codes
      const regimesMap = new Map();
      regimesResult.data?.forEach(regime => {
        regimesMap.set(regime.id, regime);
      });

      const discountCodesMap = new Map();
      discountCodesResult.data?.forEach(discountCode => {
        discountCodesMap.set(discountCode.id, {
          id: discountCode.id,
          code: discountCode.code,
          percentageOff: discountCode.percentage_off
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const convertedOrders = ordersResult.data?.map((row: any) => {
        const regime = regimesMap.get(row.regime_id);
        const discountCode = row.discount_code_id ? discountCodesMap.get(row.discount_code_id) : null;
        return {
          ...convertOrderRowToOrder(row),
          regime: regime || null,
          discountCode: discountCode || undefined
        };
      }) || [];
      
      setOrders(convertedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      const { error } = await supabaseClient
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.filter(o => o.id !== orderId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled') => {
    // Show confirmation dialog
    setStatusUpdateConfirm({ orderId, newStatus });
  };

  const confirmStatusUpdate = async () => {
    if (!statusUpdateConfirm) return;

    const { orderId, newStatus } = statusUpdateConfirm;
    
    try {
      // Prepare the update body
      const updateBody: { status: string; trackingNumber?: string } = { 
        status: newStatus,
      };
      
      // Only include tracking number if status is 'shipped' and tracking number is provided
      if (newStatus === 'shipped' && trackingNumber.trim()) {
        updateBody.trackingNumber = trackingNumber.trim();
      }
      
      // Use API route instead of direct Supabase update to trigger emails
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state with the updated order
        setOrders(orders.map(o => 
          o.id === orderId 
            ? { ...o, status: newStatus, trackingNumber: trackingNumber.trim() || o.trackingNumber, updatedAt: new Date() } 
            : o
        ));
        console.log(`Order ${orderId} status updated to ${newStatus}. Email notification sent.`);
      } else {
        throw new Error(result.error || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setStatusUpdateConfirm(null);
      setTrackingNumber(''); // Reset tracking number
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSubscriptionTypeDisplay = (subscriptionType: 'one-time' | '3-months' | '6-months') => {
    switch (subscriptionType) {
      case 'one-time':
        return 'One-time Purchase';
      case '3-months':
        return '3-Month Subscription';
      case '6-months':
        return '6-Month Subscription';
      default:
        return 'One-time Purchase';
    }
  };

  const getSubscriptionTypeBadge = (subscriptionType: 'one-time' | '3-months' | '6-months') => {
    switch (subscriptionType) {
      case 'one-time':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case '3-months':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '6-months':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.giftGiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.giftGiverEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusFilter = filterStatus === 'all' || order.status === filterStatus;
    const matchesGiftFilter = 
      filterGift === 'all' || 
      (filterGift === 'gift-only' && order.isGift) ||
      (filterGift === 'non-gift' && !order.isGift) ||
      (filterGift === 'gift-redeemed' && order.isGift && order.giftClaimed) ||
      (filterGift === 'gift-pending' && order.isGift && !order.giftClaimed);
    return matchesSearch && matchesStatusFilter && matchesGiftFilter;
  });

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

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
                Orders
              </h1>
              <p className="text-neutral-600 text-sm">
                Track and manage customer orders in real-time
              </p>
              <button
                onClick={fetchOrders}
                className="w-fit group bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
              >
                <Activity className="w-4 h-4 transition-transform duration-300" />
              </button>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 items-center lg:items-end">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-white/50 shadow-lg w-full sm:w-auto">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center mx-auto shadow-md">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total</p>
                    <p className="text-lg font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                      {orders.length}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Pending</p>
                    <p className="text-lg font-black text-yellow-600">
                      {pendingOrders}
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
                placeholder="Search orders by ID, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-3 py-2 border border-neutral-300/50 rounded-lg focus:ring-1 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm transition-all duration-200 text-sm font-medium"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-neutral-300/50">
                  <Filter className="h-4 w-4 text-[#EF7E71]" />
                  <span className="text-sm font-bold text-neutral-700">Status:</span>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-neutral-300/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm min-w-[120px] text-sm font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Gift Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={filterGift}
                  onChange={(e) => setFilterGift(e.target.value)}
                  className="border border-neutral-300/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm min-w-[140px] text-sm font-medium"
                >
                  <option value="all">All Orders</option>
                  <option value="gift-only">Gifts Only</option>
                  <option value="gift-redeemed">Gifts Redeemed</option>
                  <option value="gift-pending">Gifts Pending</option>
                  <option value="non-gift">Regular Orders</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
        <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
        
        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="rounded-full h-8 w-8 border-b-2 border-[#EF7E71]"></div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-xl"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-neutral-400" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-black text-neutral-900">No orders found</h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Orders will appear here once customers start purchasing'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200/60">
              {filteredOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="p-4 hover:bg-gradient-to-r hover:from-neutral-50/50 hover:to-white/50 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 w-10 h-10 rounded-xl flex font-semibold items-center justify-center shadow-md ${
                          order.status === 'pending' 
                            ? 'bg-transparent border-2 border-neutral-300 text-neutral-600' 
                            : 'bg-gradient-to-br from-[#EF7E71] to-[#D4654F] text-white'
                        }`}>
                          {filteredOrders.length - index}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-neutral-900 text-lg">#{order.id.slice(-8)}</h3>
                          <p className="text-[#EF7E71] font-bold text-sm">
                            {order.regime?.name || 'Regime Not Found'}
                          </p>
                          <p className="text-neutral-500 font-bold text-xs">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(order.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#EF7E71]/10 to-[#D4654F]/10 rounded-lg border border-[#EF7E71]/20">
                        <DirhamIcon className="h-4 w-4 text-[#EF7E71]" />
                        <span className="font-black text-lg text-[#EF7E71]">{order.finalAmount}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg font-bold border ${getStatusBadge(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize text-sm">{order.status} {order.trackingNumber && `(${order.trackingNumber})`}</span>
                      </span>

                      {/* Subscription Type Badge */}
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-bold border ${getSubscriptionTypeBadge(order.subscriptionType || 'one-time')}`}>
                        <span className="text-sm">{getSubscriptionTypeDisplay(order.subscriptionType || 'one-time')}</span>
                      </span>

                      {/* Gift Badge */}
                      {order.isGift && (
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border ${
                          order.giftClaimed 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}>
                          <span className="text-sm">
                            {order.giftClaimed ? 'Redeemed' : 'Awaiting Redemption'}
                          </span>
                        </span>
                      )}

                      {/* Discount Code Badge */}
                      {order.discountCode && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold border bg-emerald-100 text-emerald-800 border-emerald-200">
                          <Tag className="w-3 h-3" />
                          <span className="text-sm">{order.discountCode.code} ({order.discountCode.percentageOff}% off)</span>
                        </span>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {/* Track Shipment - Only show for shipped orders with tracking number */}
                        {order.status === 'shipped' && order.trackingNumber && (
                          <button
                            onClick={() => window.open(`https://myjeebly.jeebly.com/shipment-tracking/?uae=uae&service_type=Scheduled&awb=${order.trackingNumber}`, '_blank')}
                            className="cursor-pointer p-2 text-purple-500 hover:bg-purple-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md"
                            title={`Track Shipment: ${order.trackingNumber}`}
                          >
                            <Truck className="h-4 w-4" /> 
                          </button>
                        )}
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="cursor-pointer p-2 text-[#EF7E71] hover:bg-[#EF7E71]/10 rounded-lg border border-[#EF7E71]/20 hover:border-[#EF7E71]/40 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="View Details"
                        >
                          {expandedOrders.has(order.id) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                          }
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="cursor-pointer p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Basic Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                    <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-neutral-700 text-sm">{order.contactInfo.email}</span>
                    </div>
                    {order.contactInfo.phoneNumber && (
                      <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-neutral-700 text-sm">{order.contactInfo.phoneNumber}</span>
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="font-bold text-neutral-700 text-sm">
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Update */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                    <span className="font-black text-neutral-700 flex items-center space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-[#EF7E71]" />
                      <span>Update Status:</span>
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled')}
                      className="font-bold border border-[#EF7E71]/20 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#EF7E71] focus:border-[#EF7E71] bg-white/70 backdrop-blur-sm min-w-[120px] text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrders.has(order.id) && (
                    <div className="border-t border-neutral-200/50 pt-4 mt-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          {/* Regime Information */}
                          <div className="mb-4 bg-gradient-to-r from-[#EF7E71]/10 to-[#D4654F]/10 rounded-xl p-4 border border-[#EF7E71]/20">
                            <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                              <Package className="h-4 w-4 text-[#EF7E71]" />
                              <span>Purchased Regime</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Regime Name:</span>
                                <div className="font-black text-sm text-neutral-900">{order.regime?.name || 'Regime Not Found'}</div>
                              </div>
                              <div>
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Subscription Type:</span>
                                <div className="font-black text-sm text-neutral-900">{getSubscriptionTypeDisplay(order.subscriptionType || 'one-time')}</div>
                              </div>
                            </div>
                          </div>
                          {/* Customer Details */}
                          {order.isGift ? (
                            <>
                              {/* Gift Giver Information */}
                              <div className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                                <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                                  <span className="text-lg">🎁</span>
                                  <span>Gift Giver Information</span>
                                </h4>
                                <div className="space-y-2">
                                  {order.giftGiverName && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-neutral-600 font-bold text-sm">Name:</span>
                                      <span className="font-black text-sm">{order.giftGiverName}</span>
                                    </div>
                                  )}
                                  {order.giftGiverEmail && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-neutral-600 font-bold text-sm">Email:</span>
                                      <span className="font-black text-sm">{order.giftGiverEmail}</span>
                                    </div>
                                  )}
                                  {order.giftGiverPhone && (
                                    <div className="flex justify-between items-center">
                                      <span className="text-neutral-600 font-bold text-sm">Phone:</span>
                                      <span className="font-black text-sm">{order.giftGiverPhone}</span>
                                    </div>
                                  )}
                                  {order.giftToken && (
                                    <div className="flex justify-between items-start pt-2 border-t border-purple-200">
                                      <span className="text-neutral-600 font-bold text-sm">Gift Token:</span>
                                      <span className="font-mono font-black text-xs text-purple-700 break-all text-right max-w-[200px]">{order.giftToken}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Gift Recipient Information */}
                              {order.giftClaimed ? (
                                <div className="mb-4 bg-white rounded-xl p-4 border border-gray-200">
                                  <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                                    <Mail className="h-4 w-4 text-green-600" />
                                    <span>Gift Recipient Information</span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Redeemed</span>
                                  </h4>
                                  <div className="space-y-2">
                                    {order.shippingAddress && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-neutral-600 font-bold text-sm">Name:</span>
                                        <span className="font-black text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName || ''}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                      <span className="text-neutral-600 font-bold text-sm">Email:</span>
                                      <span className="font-black text-sm">{order.contactInfo.email}</span>
                                    </div>
                                    {order.contactInfo.phoneNumber && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-neutral-600 font-bold text-sm">Phone:</span>
                                        <span className="font-black text-sm">{order.contactInfo.phoneNumber}</span>
                                      </div>
                                    )}
                                    {order.shippingAddress && (
                                      <div className="flex justify-between text-right pt-2 border-t border-gray-200">
                                        <span className="text-neutral-600 font-bold text-sm">Address:</span>
                                        <div className="mt-1 font-black text-neutral-900 text-sm leading-relaxed">
                                          {order.shippingAddress.address}<br />
                                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </div>
                                      </div>
                                    )}
                                    {order.giftClaimedAt && (
                                      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-neutral-600 font-bold text-sm">Claimed On:</span>
                                        <span className="font-black text-sm">
                                          {new Date(order.giftClaimedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                  <h4 className="font-black text-neutral-900 mb-2 flex items-center space-x-2 text-base">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    <span>Awaiting Recipient</span>
                                  </h4>
                                  <p className="text-neutral-600 text-sm">
                                    Gift has not been redeemed yet. Recipient details will appear once the gift is claimed.
                                  </p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="mb-4 bg-white rounded-xl p-4 border border-gray-200">
                              <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span>Customer Information</span>
                              </h4>
                              <div className="space-y-2">
                                {order.shippingAddress && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-neutral-600 font-bold text-sm">Name:</span>
                                    <span className="font-black text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName || ''}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-neutral-600 font-bold text-sm">Email:</span>
                                  <span className="font-black text-sm">{order.contactInfo.email}</span>
                                </div>
                                {order.contactInfo.phoneNumber && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-neutral-600 font-bold text-sm">Phone:</span>
                                    <span className="font-black text-sm">{order.contactInfo.phoneNumber}</span>
                                  </div>
                                )}
                                {order.shippingAddress && (
                                  <div className="flex justify-between text-right pt-2 border-t border-blue-200/50">
                                    <span className="text-neutral-600 font-bold text-sm">Address:</span>
                                    <div className="mt-1 font-black text-neutral-900 text-sm leading-relaxed">
                                      {order.shippingAddress.address}<br />
                                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Discount Code Info */}
                          {order.discountCode && (
                            <div className="mb-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                              <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                                <Tag className="h-4 w-4 text-emerald-600" />
                                <span>Discount Code Applied</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Code:</span>
                                  <div className="font-black text-sm text-emerald-700">{order.discountCode.code}</div>
                                </div>
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Discount:</span>
                                  <div className="font-black text-sm text-emerald-700">{order.discountCode.percentageOff}% off</div>
                                </div>
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Savings:</span>
                                  <div className="font-black text-sm text-emerald-700">
                                    AED {Math.round(order.totalAmount * (order.discountCode.percentageOff / 100))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <span className="text-neutral-600 font-bold text-sm">Final Amount:</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-black bg-gradient-to-r from-[#EF7E71] to-[#D4654F] bg-clip-text text-transparent">
                                  AED {order.finalAmount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* User Details */}
                        {order.userDetails ? (
                          <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <h4 className="font-black text-neutral-900 mb-3 flex items-center space-x-2 text-base">
                              <Package className="h-4 w-4 text-green-600" />
                              <span>Complete Skincare Profile</span>
                            </h4>
                            <div className="space-y-3">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Age:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.age}</div>
                              </div>
                              <div>
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Gender:</span>
                                <div className="font-black text-sm text-neutral-900 capitalize">{order.userDetails.gender}</div>
                              </div>
                            </div>

                            {/* Skin Details */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Skin Type:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.skinType}</div>
                                </div>
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Complexion:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.complexion}</div>
                                </div>
                              </div>
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Primary Concerns:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.skinConcerns.join(', ')}</div>
                              </div>
                            </div>

                            {/* Skincare Experience */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Korean Skincare Experience:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.koreanSkincareExperience}</div>
                              </div>
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Korean Skincare Attraction:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.koreanSkincareAttraction.join(', ')}</div>
                              </div>
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Skincare Goals:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.skincareGoal.join(', ')}</div>
                              </div>
                            </div>

                            {/* Routine Details */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Daily Products:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.dailyProductCount}</div>
                                </div>
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Routine Regularity:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.routineRegularity}</div>
                                </div>
                              </div>
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Selected Skincare Steps:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.skincareSteps.join(', ')}</div>
                              </div>
                            </div>

                            {/* Purchase & Budget */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="grid grid-cols-2 gap-4 mb-2">
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Purchase Location:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.purchaseLocation}</div>
                                </div>
                                <div>
                                  <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Budget:</span>
                                  <div className="font-black text-sm text-neutral-900">{order.userDetails.budget}</div>
                                </div>
                              </div>
                              <div className="mb-2">
                                <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Wants Customized Recommendations:</span>
                                <div className="font-black text-sm text-neutral-900">{order.userDetails.customizedRecommendations}</div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            {(order.userDetails.allergies || order.userDetails.brandsUsed || order.userDetails.additionalComments) && (
                              <div className="pt-2 border-t border-gray-200">
                                {order.userDetails.allergies && (
                                  <div className="mb-2">
                                    <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Allergies/Sensitivities:</span>
                                    <div className="font-black text-sm text-neutral-900 leading-relaxed">{order.userDetails.allergies}</div>
                                  </div>
                                )}
                                {order.userDetails.brandsUsed && (
                                  <div className="mb-2">
                                    <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Brands Used:</span>
                                    <div className="font-black text-sm text-neutral-900 leading-relaxed">{order.userDetails.brandsUsed}</div>
                                  </div>
                                )}
                                {order.userDetails.additionalComments && (
                                  <div>
                                    <span className="text-neutral-600 font-bold text-xs uppercase tracking-wider">Additional Comments:</span>
                                    <div className="font-black text-sm text-neutral-900 leading-relaxed">{order.userDetails.additionalComments}</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        ) : (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-3xl">🎁</span>
                              </div>
                              <h4 className="font-black text-neutral-900 mb-2 text-lg">Gift Order</h4>
                              <p className="text-neutral-600 font-medium text-sm">
                                This is a gift order. Recipient details and skincare profile will be completed when the gift is redeemed.
                              </p>
                              {order.giftToken && (
                                <div className="mt-4 p-3 bg-white/70 rounded-lg border border-purple-200">
                                  <span className="text-purple-700 font-bold text-xs uppercase tracking-wider">Gift Token:</span>
                                  <div className="font-mono font-black text-sm text-purple-800 mt-1">{order.giftToken}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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
                Are you sure you want to delete this order? This action cannot be undone and will permanently remove all associated data.
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
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Confirmation Modal */}
      {statusUpdateConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Activity className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-4">Confirm Status Update</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Are you sure you want to update this order status to <span className="font-black text-neutral-900 capitalize">{statusUpdateConfirm.newStatus}</span>?
              </p>
              <p className="text-neutral-500 text-sm mt-2">
                The customer will receive an email notification about this status change.
              </p>
              
              {/* Tracking Number Input - Only show when status is 'shipped' */}
              {statusUpdateConfirm.newStatus === 'shipped' && (
                <div className="mt-6 text-left">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    Tracking Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:border-[#EF7E71] focus:outline-none bg-white text-neutral-900 placeholder-neutral-400 font-medium transition-all duration-200"
                    autoFocus
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    This will be used to generate the tracking link for the customer.
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setStatusUpdateConfirm(null);
                  setTrackingNumber('');
                }}
                className="cursor-pointer flex-1 px-6 py-4 text-neutral-600 border-2 border-neutral-300 rounded-2xl hover:bg-neutral-50 font-bold text-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={statusUpdateConfirm.newStatus === 'shipped' && !trackingNumber.trim()}
                className="cursor-pointer flex-1 px-6 py-4 bg-gradient-to-r from-[#EF7E71] to-[#D4654F] text-white rounded-2xl hover:shadow-xl font-bold text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}