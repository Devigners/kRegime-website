import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'KREGIME Terms of Service - Read our terms and conditions for using our Korean skincare regime service.',
  openGraph: {
    type: 'website',
    url: 'https://kregime.com/terms',
    images: [
      {
        url: '/meta-image.png',
        width: 1200,
        height: 628,
        alt: 'KREGIME - Korean Skincare Made Simple',
      },
    ],
  },
  twitter: {
    images: ['/meta-image.png'],
  },
  alternates: {
    canonical: 'https://kregime.com/terms',
  },
};

const TermsPage: React.FC = () => {
  return (
    <main className="pt-20 pb-0 md:py-32">
      <article className="max-w-3xl mx-auto text-neutral-900 bg-white p-8 rounded-lg">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">KREGIME – Terms of Service</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Effective Date: November 2025
          </p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to KREGIME.com. By accessing or purchasing from our website,
            you agree to these Terms and Conditions. Please read them carefully
            before using our services.
          </p>

          <h2 className="text-lg font-semibold mt-10">1. About KREGIME</h2>
          <p>
            KREGIME offers curated Korean skincare regimes based on individual
            skin needs. Customers can select 3-step, 5-step, or 7-step sets, or
            subscribe monthly for ongoing skincare deliveries. Orders are
            delivered across the UAE within two (2) business days after payment
            confirmation.
          </p>

          <h2 className="text-lg font-semibold mt-10">
            2. Orders &amp; Payments
          </h2>
          <ul className="list-disc pl-5">
            <li>All orders must be paid in full before processing.</li>
            <li>Orders are confirmed once payment is received and verified.</li>
            <li>Once processed, orders cannot be canceled.</li>
            <li>Prices are listed in AED and include applicable UAE taxes.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-10">
            3. Skin Quiz &amp; Personalization
          </h2>
          <ul className="list-disc pl-5">
            <li>
              The skincare quiz is used to help our experts personalize your
              box.
            </li>
            <li>
              The recommendations provided are based on your inputs and are for
              general skincare guidance only.
            </li>
            <li>
              KREGIME does not provide medical advice. Customers with specific
              skin conditions should consult a dermatologist before use.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-10">4. Subscriptions</h2>
          <ul className="list-disc pl-5">
            <li>Subscription plans renew automatically on the renewal date.</li>
            <li>
              You can modify or cancel your subscription before the next billing
              date.
            </li>
            <li>Cancellations after billing will apply to the next cycle.</li>
            <li>
              KREGIME reserves the right to adjust subscription pricing with
              prior notice.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-10">
            5. Shipping &amp; Delivery
          </h2>
          <ul className="list-disc pl-5">
            <li>
              Delivery across the UAE is made within 2–3 working days after
              payment confirmation.
            </li>
            <li>
              Delays may occur due to incorrect addresses, courier issues, or
              public holidays.
            </li>
            <li>
              You are responsible for ensuring the accuracy of your shipping
              details.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-10">
            6. Returns &amp; Refunds
          </h2>
          <ul className="list-disc pl-5">
            <li>
              Due to hygiene and product safety, skincare products are
              non-returnable and non-refundable once delivered.
            </li>
            <li>
              Damaged or incorrect items must be reported within 48 hours of
              delivery for review and possible replacement.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-10">
            7. Product Use Disclaimer
          </h2>
          <p>
            All KREGIME products and recommendations are for external use only.
            Individual results may vary depending on skin type and usage. We
            recommend patch testing before full application.
          </p>

          <h2 className="text-lg font-semibold mt-10">
            8. Intellectual Property
          </h2>
          <p>
            All website content — including text, graphics, photos, videos, and
            logos — is the property of KREGIME.com and protected by copyright
            laws. Reproduction or use without permission is strictly prohibited.
          </p>

          <h2 className="text-lg font-semibold mt-10">
            9. Limitation of Liability
          </h2>
          <p>
            KREGIME shall not be liable for: skin reactions or allergic
            responses due to product use; delays or service interruptions beyond
            our control; or any indirect, incidental, or consequential damages.
          </p>

          <h2 className="text-lg font-semibold mt-10">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United Arab Emirates.
            Any disputes will be subject to the exclusive jurisdiction of the
            courts of the UAE.
          </p>

          <h2 className="text-lg font-semibold mt-10">11. Contact Us</h2>
          <p>
            For any questions or support, reach out to:{' '}
            <a
              className="!text-primary font-medium"
              href="mailto:care@kregime.com"
            >
              care@kregime.com
            </a>
          </p>

          <p className="text-sm text-neutral-500 mt-12">
            Last Updated: November 2025
          </p>

          <p className="text-sm text-neutral-500">
            KREGIME.com reserves the right to modify these terms at any time.
            Updated versions will be posted on this page with a revised
            effective date.
          </p>
        </section>
      </article>
    </main>
  );
};

export default TermsPage;
