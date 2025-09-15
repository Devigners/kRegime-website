import { Regime, Order, Review } from '@/models/database';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Regime API functions
export const regimeApi = {
  getAll: async (): Promise<Regime[]> => {
    const response = await fetch(`${API_BASE_URL}/api/regimes`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch regimes');
    }

    return data.data;
  },

  getById: async (id: string): Promise<Regime> => {
    const response = await fetch(`${API_BASE_URL}/api/regimes/${id}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch regime');
    }

    return data.data;
  },

  create: async (
    regime: Omit<Regime, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<Regime> => {
    const response = await fetch(`${API_BASE_URL}/api/regimes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regime),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create regime');
    }

    return data.data;
  },
};

// Order API functions
export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch orders');
    }

    return data.data;
  },

  getById: async (orderId: string): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch order');
    }

    return data.data;
  },

  create: async (
    order: Omit<Order, '_id' | 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create order');
    }

    return data.data;
  },

  update: async (
    orderId: string,
    updateData: Partial<Order>
  ): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update order');
    }

    return data.data;
  },
};

// Review API functions
export const reviewApi = {
  getAll: async (): Promise<Review[]> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch reviews');
    }

    return data.data;
  },

  create: async (
    review: Omit<
      Review,
      '_id' | 'id' | 'isApproved' | 'createdAt' | 'updatedAt'
    >
  ): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create review');
    }

    return data.data;
  },
};

// Utility function to seed the database
export const seedDatabase = async () => {
  const response = await fetch(`${API_BASE_URL}/api/seed`, {
    method: 'POST',
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Failed to seed database');
  }

  return data;
};
