# Supabase Integration Documentation

## Overview

The kRegime website has been successfully integrated with Supabase to handle dynamic data storage and retrieval. The system now uses a PostgreSQL database backend for regimes, orders, and reviews instead of static data files.

## Database Structure

### Database: PostgreSQL on Supabase

### Tables:

1. **regimes** - Stores available skincare regimes
2. **orders** - Stores customer orders with form data  
3. **reviews** - Stores customer reviews

## API Endpoints

### Regimes

- `GET /api/regimes` - Get all active regimes
- `GET /api/regimes/[id]` - Get specific regime by ID
- `POST /api/regimes` - Create new regime (admin)

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/[orderId]` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/[orderId]` - Update order status

### Reviews

- `GET /api/reviews` - Get all approved reviews
- `POST /api/reviews` - Create new review (pending approval)

### Utilities

- `POST /api/seed` - Seed database with initial data

## Local Storage Integration

The application uses local storage for:

1. **Form Data Caching**: Saves form progress to prevent data loss on page refresh
2. **Cart Management**: Stores cart items before order creation
3. **Selected Regime**: Tracks the current regime being customized

### Local Storage Keys:

- `kregime_form_data_{regimeId}` - Form data for specific regime
- `kregime_cart` - Current cart data
- `kregime_selected_regime` - Currently selected regime ID

## User Flow

### 1. Homepage

- Regimes are loaded dynamically from Supabase
- Reviews are loaded dynamically from Supabase
- User selects a regime and proceeds to form

### 2. Regime Form

- Form data is auto-saved to localStorage on every change
- If user refreshes page, form data is restored
- On completion, data is stored in cart via localStorage

### 3. Cart Page

- Loads cart data from localStorage
- Shows selected regime and form responses
- Allows quantity modification
- Proceeds to payment

### 4. Payment Page

- Loads cart data from localStorage
- Creates order in Supabase with all form data
- Redirects to confirmation page
- Clears local storage after successful order

### 5. Confirmation Page

- Shows order confirmation
- Can display order details if order ID is provided

## Environment Variables

Required environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Models

### Regime Model

```typescript
interface Regime {
  id: string;
  name: string;
  description: string;
  price: number;
  steps: string[];
  image: string;
  stepCount: 3 | 5 | 7;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model

```typescript
interface Order {
  id: string; // 8-digit unique random number (e.g., "12345678")
  regimeId: string;
  userDetails: {
    age: string;
    gender: string;
    skinType: string;
    skinConcerns: string[];
    // ... all form fields
  };
  quantity: number;
  totalAmount: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Review Model

```typescript
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Setup Instructions

### Local Development

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and API keys

2. **Set up the database:**
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL schema from `supabase-schema.sql`

3. **Install dependencies:**
   ```bash
   npm install @supabase/supabase-js
   ```

4. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials

5. **Seed the database:**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

### Production Deployment (Vercel)

1. **Environment Variables:**
   Add these to your Vercel project settings:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
   ```

2. **Database Setup:**
   - Use the same Supabase project for production or create a separate one
   - Run the same SQL schema in production database

## Features Implemented

✅ **Dynamic Regime Loading**: Regimes are now loaded from Supabase instead of static files
✅ **Dynamic Reviews Loading**: Reviews are now loaded from Supabase
✅ **Form Data Persistence**: Form data is saved to localStorage and restored on page refresh
✅ **Cart Management**: Cart data persists in localStorage
✅ **Order Creation**: Orders are saved to Supabase with all user form data
✅ **Unique Order IDs**: 8-digit unique random numbers generated for each order
✅ **API Integration**: Full CRUD operations for regimes, orders, and reviews
✅ **Error Handling**: Proper error handling and loading states
✅ **Type Safety**: Full TypeScript support with proper type definitions
✅ **PostgreSQL Benefits**: ACID compliance, relations, and powerful querying
✅ **Real-time Capabilities**: Supabase provides real-time subscriptions if needed
✅ **Built-in Auth**: Supabase includes authentication if you need it later

## Next Steps (Optional Enhancements)

- Add user authentication with Supabase Auth
- Implement order status tracking with real-time updates
- Add review moderation interface
- Implement search and filtering for regimes
- Add inventory management
- Implement email notifications for orders
- Add admin dashboard for managing regimes and orders
- Use Supabase storage for image uploads

## Testing

You can test the complete flow:

1. Visit http://localhost:3000
2. Select a regime (data loaded from Supabase)
3. Fill out the form (auto-saved to localStorage)
4. Refresh the page (form data should be restored)
5. Complete the form and add to cart
6. Go to cart page (data loaded from localStorage)
7. Proceed to payment
8. Complete order (saved to Supabase)
9. View confirmation page

The system is now fully integrated with Supabase and provides a seamless user experience with data persistence and the benefits of a modern PostgreSQL database.
