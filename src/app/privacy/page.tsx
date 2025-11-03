import React from 'react';

export const metadata = {
  title: 'Privacy Policy - KREGIME',
  description: 'KREGIME Privacy Policy - effective November 2025',
};

const PrivacyPage: React.FC = () => {
  return (
    <main className="pt-20 pb-0 md:py-20 md:py-32">
      <article className="max-w-3xl mx-auto text-neutral-900 bg-white p-8 rounded-lg shadow-sm">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">KREGIME – Privacy Policy</h1>
          <p className="text-sm text-neutral-500 mt-1">Effective Date: November 2025</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to KREGIME.com (“we,” “our,” or “us”). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website or purchase from us.
          </p>

          <h2 className="text-lg font-semibold mt-4">1. Information We Collect</h2>
          <p>When you interact with KREGIME.com, we may collect the following information:</p>
          <h3 className="font-semibold">a. Personal Details</h3>
          <ul className="list-disc pl-5">
            <li>Name, phone number, email address, and delivery address.</li>
            <li>Payment details (processed securely by our third-party payment providers).</li>
          </ul>

          <h3 className="font-semibold mt-2">b. Skin Profile &amp; Quiz Information</h3>
          <p>
            When you complete our Skincare Quiz, we collect information about your skin type and concerns (e.g., dryness, acne, sensitivity, etc.), product preferences and lifestyle choices. This information helps our experts personalize your skincare regime (3-step, 5-step, or 7-step sets).
          </p>

          <h3 className="font-semibold mt-2">c. Account &amp; Order Information</h3>
          <ul className="list-disc pl-5">
            <li>Your account credentials, subscription details, and purchase history.</li>
          </ul>

          <h3 className="font-semibold mt-2">d. Technical Information</h3>
          <ul className="list-disc pl-5">
            <li>Device type, browser data, IP address, and cookies to improve your website experience.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5">
            <li>Create your personalized skincare regime.</li>
            <li>Process and deliver orders.</li>
            <li>Manage your monthly subscription.</li>
            <li>Communicate order updates, promotions, and product recommendations.</li>
            <li>Improve our website, customer experience, and service quality.</li>
            <li>Comply with UAE legal and accounting requirements.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4">3. Data Protection &amp; Security</h2>
          <ul className="list-disc pl-5">
            <li>All payments are processed securely through trusted gateways; we do not store your card details.</li>
            <li>Your quiz and personal data are stored securely and accessible only to authorized KREGIME staff.</li>
            <li>We use industry-standard encryption and security measures to prevent unauthorized access.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4">4. Sharing of Information</h2>
          <p>
            We only share information as necessary to operate our business, including: delivery partners (to fulfill your orders); payment processors (to handle transactions); IT and marketing service providers (under strict confidentiality agreements). We do not sell, rent, or trade your personal or quiz information with any third party.
          </p>

          <h2 className="text-lg font-semibold mt-4">5. Cookies</h2>
          <p>
            We use cookies and analytics tools to personalize your experience, track performance, and improve website usability. You can disable cookies in your browser settings, but some features may not function properly.
          </p>

          <h2 className="text-lg font-semibold mt-4">6. Your Rights</h2>
          <ul className="list-disc pl-5">
            <li>Access, correct, or request deletion of your personal data.</li>
            <li>Withdraw consent to marketing communications.</li>
            <li>Request a copy of the data we hold about you.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-4">7. Retention of Data</h2>
          <p>
            We retain your data only as long as necessary for order fulfillment, customer support, and legal compliance.
          </p>

          <h2 className="text-lg font-semibold mt-4">8. Contact Us</h2>
          <p>
            If you have any questions about your privacy or wish to exercise your data rights, contact us at: <a className="!text-primary font-medium" href="mailto:care@kregime.com">care@kregime.com</a>
          </p>

          <p className="text-sm text-neutral-500 mt-16">Last Updated: November 2025</p>

          <p className="text-sm text-neutral-500">
            KREGIME.com reserves the right to modify these terms at any time. Updated versions will be posted on this page with a revised effective date.
          </p>
        </section>
      </article>
    </main>
  );
};

export default PrivacyPage;
