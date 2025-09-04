# kRegime Website

A modern Next.js website built with TypeScript, Tailwind CSS, Framer Motion, and Stripe integration.

## 🚀 Features

- **Next.js 15** - Latest version with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Supabase** - Modern PostgreSQL database with real-time capabilities
- **Stripe** - Payment processing integration
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - Enhanced CSS processing

## 📦 Dependencies

### Core Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `typescript` - TypeScript support
- `framer-motion` - Animation library
- `@supabase/supabase-js` - Supabase client for database operations
- `stripe` - Payment processing
- `autoprefixer` - CSS prefixing

### Development Dependencies

- `@types/*` - TypeScript type definitions
- `eslint` & `eslint-config-next` - Code linting
- `tailwindcss` & `@tailwindcss/postcss` - Styling
- `postcss` - CSS processing

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kRegime-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and add your Supabase and Stripe keys:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**

   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL Editor

5. **Seed the database**

   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database

This project uses **Supabase** (PostgreSQL) for data storage:

- **regimes** - Skincare routine packages
- **orders** - Customer orders with detailed form data
- **reviews** - Customer reviews and testimonials

See `SUPABASE_SETUP.md` for detailed setup instructions.

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   └── MotionExample.tsx # Framer Motion demo
└── lib/               # Utility functions
    └── stripe.ts      # Stripe configuration
```

## 🎨 Styling

This project uses **Tailwind CSS v4** with the new inline theme configuration. The global styles are defined in `src/app/globals.css` with support for:

- Custom CSS variables for theming
- Dark mode support
- Responsive design utilities

## 🔄 Animations

Framer Motion is integrated for smooth animations. See `src/components/MotionExample.tsx` for a basic implementation example.

## 💳 Stripe Integration

Stripe is configured for payment processing:

- Server-side Stripe instance in `src/lib/stripe.ts`
- Environment variables for API keys
- TypeScript support with latest API version

## 🔌 Supabase Integration

Supabase provides the backend database with:

- PostgreSQL database with real-time capabilities
- Row Level Security (RLS) for data protection
- Auto-generated API endpoints
- TypeScript support with generated types

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS with Tailwind and Autoprefixer
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `.env.local` - Environment variables

## 🚀 Deployment

This project is ready for deployment on platforms like Vercel, Netlify, or any hosting service that supports Next.js.

For Vercel deployment:

```bash
npm run build
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)
- [Stripe Documentation](https://stripe.com/docs)
- [TypeScript](https://typescriptlang.org)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
