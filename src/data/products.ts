import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'tribox',
    name: 'TRIBOX',
    description:
      "Start with the essentials. This 3 steps Korean skincare routine is designed to cleanse, hydrate and protect, or switch it up based on your needs. Just tell us your skin type and we'll curate the perfect set.",
    price: 229,
    steps: ['Cleanser', 'Moisturiser', 'Sunscreen'],
    image: '/static/1.jpg',
    stepCount: 3,
  },
  {
    id: 'pentabox',
    name: 'PENTABOX',
    description:
      "Go deeper with a well-rounded 5 steps routine tailored just for you. Whether you're focused on glow, hydration, or texture, we'll customize every product in your box.",
    price: 379,
    steps: ['Cleanser', 'Toner', 'Serum', 'Moisturiser', 'Sunscreen'],
    image: '/static/2.jpg',
    stepCount: 5,
  },
  {
    id: 'septabox',
    name: 'SEPTABOX',
    description:
      'Our full skincare journey in one luxurious box. The 7 steps Korean skincare ritual is designed to deep-cleanse, treat, and protect, giving you radiant, long-term results. Perfect for skincare lovers and advanced users.',
    price: 529,
    steps: [
      'Cleansing oil',
      'Cleanser',
      'Mask',
      'Toner',
      'Serum',
      'Moisturiser',
      'Sunscreen',
    ],
    image: '/static/3.jpg',
    stepCount: 7,
  },
];
