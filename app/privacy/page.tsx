import Link from 'next/link';
import SharedHeader from '../components/shared-header';
import SharedFooter from '../components/shared-footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> 09.08.2025
            </p>

            <p className="text-gray-700 mb-6">
              Welcome to IsTheStockMarketOpen.io (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your information when you visit our website.
            </p>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">
                We may collect the following types of information when you use our site:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Personal Information</strong> – If you contact us via our contact form or email, we may collect your name, email address, and any other details you choose to share.</li>
                <li><strong>Non-Personal Information</strong> – Such as your browser type, device, IP address, pages visited, and time spent on the site.</li>
                <li><strong>Cookies & Similar Technologies</strong> – We use cookies to improve site performance, analyse traffic, and personalise content and ads.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">
                We may use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide and improve our services.</li>
                <li>Analyse site usage and trends.</li>
                <li>Personalise content and advertising.</li>
                <li>Respond to inquiries and provide customer support.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. Google AdSense & Cookies
              </h2>
              <p className="text-gray-700 mb-3">
                This website uses Google AdSense, a service for including advertisements from Google Inc. Google AdSense uses cookies to serve ads based on your prior visits to this website and other sites on the internet.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Third-Party Cookies</strong> – Google and its partners may use advertising cookies to serve ads based on your interests.</li>
                <li><strong>Opting Out</strong> – Users may opt out of personalised advertising by visiting Google&apos;s Ads Settings: <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a></li>
                <li><strong>More Info</strong> – For more details about how Google uses data, visit: <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a></li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-3">
                We may use third-party analytics tools (such as Google Analytics) to understand how visitors interact with our site. These services may collect data such as your IP address, browser, and interaction details, which may be used to provide aggregated insights.
              </p>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-3">
                We take reasonable measures to protect your information from unauthorised access, alteration, or destruction. However, no method of transmission over the internet is completely secure.
              </p>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Access, correct, or delete your personal data.</li>
                <li>Withdraw consent for data collection.</li>
                <li>Request a copy of the data we hold about you.</li>
              </ul>
              <p className="text-gray-700 mt-3">
                To exercise these rights, please contact us at: hello@isthestockmarketopen.io
              </p>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Changes to This Policy
              </h2>
              <p className="text-gray-700 mb-3">
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with the updated &quot;Effective Date.&quot;
              </p>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Contact Us
              </h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none pl-0 text-gray-700 space-y-1">
                <li>📧 Email: hello@isthestockmarketopen.io</li>
                <li>🌐 Website: <a href="https://isthestockmarketopen.io" className="text-blue-600 hover:underline">https://isthestockmarketopen.io</a></li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
