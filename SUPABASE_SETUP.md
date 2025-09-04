# Supabase Setup Guide for kRegime Website

This guide will walk you through setting up Supabase for both local development and production deployment on Vercel.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available)
- A Vercel account (for production deployment)

## Part 1: Local Development Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `kregime-local` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to be ready (takes 1-2 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)
   - **service_role secret key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

### Step 3: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase-schema.sql` in your project root
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

### Step 4: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your Supabase credentials:

   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here

   # Stripe Configuration (add your Stripe keys)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 5: Install Dependencies and Seed Data

1. Install the required dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Seed the database with initial data:

   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

4. Visit `http://localhost:3000` to see your website with Supabase data!

## Part 2: Production Setup on Vercel

### Step 1: Create Production Supabase Project (Optional)

You can use the same Supabase project for both development and production, or create a separate one for production:

1. If creating a separate production project, repeat Part 1, Steps 1-3 with a different name like `kregime-production`
2. Use the same SQL schema from `supabase-schema.sql`

### Step 2: Deploy to Vercel

1. Push your code to GitHub (if not already done)

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Import Project" and select your GitHub repository

4. In the deployment settings, add the following environment variables:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-production-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   ```

5. Click "Deploy"

### Step 3: Seed Production Database

After deployment is complete:

1. Get your Vercel app URL (e.g., `https://your-app-name.vercel.app`)
2. Seed the production database:
   ```bash
   curl -X POST https://your-app-name.vercel.app/api/seed
   ```

## Part 3: Verification and Testing

### Verify Local Setup

1. Visit `http://localhost:3000`
2. Check that the homepage loads with regime data
3. Check that reviews are displayed
4. Try the complete user flow:
   - Select a regime
   - Fill out the form
   - Add to cart
   - Complete checkout process

### Verify Production Setup

1. Visit your Vercel app URL
2. Perform the same tests as local setup
3. Check that data persists between visits

## Part 4: Supabase Dashboard Features

### Monitoring Your Data

1. **Table Editor**: View and edit your data directly

   - Go to **Table Editor** in your Supabase dashboard
   - Browse `regimes`, `orders`, and `reviews` tables

2. **SQL Editor**: Run custom queries

   - Useful for data analysis and custom operations

3. **Logs**: Monitor API usage and errors
   - Go to **Logs** to see real-time database activity

### Security Considerations

The current setup uses permissive Row Level Security (RLS) policies for development. In production, consider:

1. **Authentication**: Add user authentication with Supabase Auth
2. **Tighter Policies**: Restrict data access based on user roles
3. **API Security**: Add rate limiting and validation

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Make sure `.env.local` is in your project root
   - Restart your development server after changing env vars
   - Check for typos in variable names

2. **Database Connection Issues**

   - Verify your Supabase credentials
   - Check that your project is active in Supabase dashboard
   - Ensure the SQL schema has been run

3. **Seeding Fails**

   - Check the browser console for errors
   - Verify the API endpoint is accessible
   - Check Supabase logs for database errors

4. **Vercel Deployment Issues**
   - Ensure all environment variables are set in Vercel
   - Check the build logs for errors
   - Verify the app URL is correct

### Getting Help

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## Next Steps

With Supabase set up, you can now:

- Add user authentication
- Implement real-time features
- Add file uploads with Supabase Storage
- Create admin dashboards
- Add advanced querying and filtering
- Implement email notifications

Your kRegime website is now powered by Supabase! 🎉
