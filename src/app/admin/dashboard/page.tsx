'use client';

import { supabaseClient } from '@/lib/supabase';
import {
  Clock,
  DollarSign,
  MessageSquare,
  Package,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RecentOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface DashboardStats {
  totalRegimes: number;
  activeRegimes: number;
  totalReviews: number;
  approvedReviews: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRegimes: 0,
    activeRegimes: 0,
    totalReviews: 0,
    approvedReviews: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch regimes stats
      const { data: regimes } = await supabaseClient
        .from('regimes')
        .select('id, is_active');
      
      // Fetch reviews stats
      const { data: reviews } = await supabaseClient
        .from('reviews')
        .select('id, is_approved');
      
      // Fetch orders stats
      const { data: orders } = await supabaseClient
        .from('orders')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false });

      // Calculate stats
      const totalRegimes = regimes?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const activeRegimes = regimes?.filter((r: any) => r.is_active).length || 0;
      
      const totalReviews = reviews?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const approvedReviews = reviews?.filter((r: any) => r.is_approved).length || 0;
      
      const totalOrders = orders?.length || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pendingOrders = orders?.filter((o: any) => o.status === 'pending').length || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completedOrders = orders?.filter((o: any) => o.status === 'completed').length || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalRevenue = orders?.filter((o: any) => o.status === 'completed').reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0;
      const recentOrders = (orders?.slice(0, 5) || []) as RecentOrder[];

      setStats({
        totalRegimes,
        activeRegimes,
        totalReviews,
        approvedReviews,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        recentOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Regimes',
      value: stats.totalRegimes,
      subtitle: `${stats.activeRegimes} active`,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      href: '/admin/regimes',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Reviews',
      value: stats.totalReviews,
      subtitle: `${stats.approvedReviews} approved`,
      icon: MessageSquare,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      href: '/admin/reviews',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      gradient: 'from-primary to-secondary',
      bgGradient: 'from-primary/10 to-secondary/10',
      href: '/admin/orders',
      change: '+24%',
      changeType: 'positive'
    },
    {
      title: 'Revenue',
      value: `AED ${stats.totalRevenue.toLocaleString()}`,
      subtitle: `${stats.completedOrders} completed`,
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-100',
      href: '/admin/orders',
      change: '+18%',
      changeType: 'positive'
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusMap[status as keyof typeof statusMap] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div key={stat.title} className="group">
            <Link href={stat.href} className="block relative">
              {/* Background layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-md hover:shadow-lg transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-neutral-500 uppercase tracking-wide">
                      {stat.title}
                    </p>
                  </div>
                  
                  <div className={`bg-gradient-to-br ${stat.gradient} p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                {/* Value */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-xl font-black text-neutral-800 leading-none group-hover:text-neutral-900 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </section>

      {/* Activity & Actions Section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="xl:col-span-2 relative overflow-hidden rounded-xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200/30 bg-gradient-to-r from-transparent to-neutral-50/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-neutral-900 leading-tight">Recent Orders</h2>
                  <p className="text-neutral-600 font-semibold text-sm">Order tracking & management</p>
                </div>
                
                <Link 
                  href="/admin/orders"
                  className="!text-white inline-flex items-center px-3 py-1.5 bg-primary rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <span>View All Orders</span>
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="relative mx-auto w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EF7E71]/20 to-[#D4654F]/20 rounded-xl"></div>
                    <div className="absolute inset-1 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-neutral-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-neutral-900">No Orders Yet</h3>
                    <p className="text-neutral-600 max-w-md mx-auto text-sm">
                      Your first orders will appear here with real-time updates and management tools
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-[#EF7E71]/30 transition-all duration-300 p-3 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Status Icon */}
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#EF7E71] to-[#D4654F] rounded-lg flex items-center justify-center shadow-md">
                              <ShoppingCart className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          
                          {/* Order Details */}
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-black text-neutral-900 group-hover:text-[#EF7E71] transition-colors">
                                #{order.id.slice(-8)}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-black rounded-full ${getStatusBadge(order.status)}`}>
                                {order.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-neutral-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-semibold">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Amount Display */}
                        <div className="text-right space-y-1">
                          <div className="space-y-0.5">
                            <p className="text-lg font-black text-neutral-900 group-hover:text-[#D4654F] transition-colors">
                              AED {order.total_amount}
                            </p>
                            <p className="text-xs font-bold text-neutral-500">Total Amount</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-neutral-50/90 to-white/95 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#EF7E71]/3 to-[#D4654F]/3"></div>
          <div className="absolute inset-0 rounded-xl border border-white/60 shadow-lg"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="p-3 border-b border-neutral-200/30 bg-gradient-to-r from-transparent to-neutral-50/50">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-neutral-900">Quick Actions</h2>
                <p className="text-neutral-600 font-semibold text-sm">Power tools for management</p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-3">
              <div className="space-y-2">
                {[
                  {
                    href: '/admin/regimes',
                    icon: Package,
                    title: 'Manage Regimes',
                    description: 'Advanced regime configuration',
                    gradient: 'from-blue-500 to-blue-600',
                    bgGradient: 'from-blue-50 to-blue-100'
                  },
                  {
                    href: '/admin/reviews',
                    icon: MessageSquare,
                    title: 'Review Center',
                    description: 'Smart moderation tools',
                    gradient: 'from-green-500 to-green-600',
                    bgGradient: 'from-green-50 to-green-100'
                  },
                  {
                    href: '/admin/orders',
                    icon: ShoppingCart,
                    title: 'Order Hub',
                    description: 'Real-time processing',
                    gradient: 'from-[#EF7E71] to-[#D4654F]',
                    bgGradient: 'from-orange-50 to-red-50'
                  }
                ].map((action) => (
                  <div key={action.href} className="group">
                    <Link href={action.href} className="block relative overflow-hidden rounded-xl">
                      {/* Background layers */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.bgGradient} opacity-50`}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-xl"></div>
                      <div className="absolute inset-0 rounded-xl border border-white/50 group-hover:border-white/80 transition-all duration-300"></div>
                      
                      <div className="relative z-10 flex items-center p-3">
                        {/* Icon */}
                        <div className={`bg-gradient-to-br ${action.gradient} p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="ml-3 flex-1">
                          <p className="font-black text-neutral-900 text-sm group-hover:text-[#EF7E71] transition-colors">
                            {action.title}
                          </p>
                          <p className="text-xs text-neutral-600 font-semibold mt-0.5 group-hover:text-neutral-700 transition-colors">
                            {action.description}
                          </p>
                        </div>
                        
                        {/* Arrow */}
                        <div className="w-6 h-6 bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:from-[#EF7E71] group-hover:to-[#D4654F] rounded-lg flex items-center justify-center transition-all duration-300">
                          <svg className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}