import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { OrderReceivedEmail } from '@/emails/OrderReceivedEmail';

// Mock data for testing
const mockOrder = {
  id: 'test-123',
  regimeId: 'tribox',
  userDetails: {
    age: '25-30',
    gender: 'female',
    skinType: 'combination',
    skinConcerns: ['acne', 'hydration'],
    complexion: 'light',
    allergies: 'none',
    skincareSteps: ['cleanser', 'moisturizer'],
    koreanSkincareExperience: 'beginner',
    koreanSkincareAttraction: ['ingredients'],
    skincareGoal: ['clear-skin'],
    dailyProductCount: '3-5',
    routineRegularity: 'daily',
    purchaseLocation: 'online',
    budget: '200-300',
    customizedRecommendations: 'yes',
    brandsUsed: 'western',
    additionalComments: 'none',
  },
  contactInfo: {
    email: 'test@example.com',
    phoneNumber: '+1234567890',
  },
  shippingAddress: {
    firstName: 'Jane',
    lastName: 'Doe',
    address: '123 Test Street',
    city: 'Test City',
    postalCode: '12345',
  },
  quantity: 1,
  totalAmount: 229,
  finalAmount: 229,
  subscriptionType: 'one-time' as const,
  status: 'shipped' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRegime = {
  id: 'tribox',
  name: 'TRIBOX',
  description: 'Start with the essentials. This 3 steps Korean skincare routine is designed to cleanse, hydrate and protect.',
  priceOneTime: 229,
  price3Months: 199,
  price6Months: 179,
  discountOneTime: 0,
  discount3Months: 0,
  discount6Months: 0,
  discountReasonOneTime: null,
  discountReason3Months: null,
  discountReason6Months: null,
  steps: ['Cleanser', 'Moisturiser', 'Sunscreen'],
  images: ['/static/regime-3.webp'],
  stepCount: 3 as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'status-update';
    const status = url.searchParams.get('status') || 'shipped';

    // Update mock order status
    const testOrder = { ...mockOrder, status: status as 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled' };

    let htmlContent: string;

    if (type === 'status-update') {
      htmlContent = await render(
        OrderStatusUpdateEmail({
          order: testOrder,
          regime: mockRegime,
          customerName: 'Jane Doe',
          trackingNumber: 'TR123456789',
        })
      );
    } else {
      htmlContent = await render(
        OrderReceivedEmail({
          order: testOrder,
          regime: mockRegime,
          customerName: 'Jane Doe',
        })
      );
    }

    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('Error rendering email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to render email', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}