import Link from 'next/link';
import SharedHeader from '../components/shared-header';
import SharedFooter from '../components/shared-footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Effective Date:</strong> 09.08.2025
            </p>

            <p className="text-gray-700 mb-6">
              Welcome to IsTheStockMarketOpen.io (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By using our website, you agree to the following terms and conditions. Please read them carefully.
            </p>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                1. Use of the Website
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You may use our site for personal or non-commercial purposes only.</li>
                <li>You agree not to misuse our site or interfere with its operation.</li>
                <li>We may update, change, or remove content at any time without notice.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                2. Accuracy of Information
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We aim to provide accurate and up-to-date market status information.</li>
                <li>However, we cannot guarantee that all information is free from errors or delays.</li>
                <li>You should always confirm market hours and details with official exchange sources before making financial decisions.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                3. No Financial Advice
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The content on this site is for informational purposes only.</li>
                <li>We do not provide financial, investment, or trading advice.</li>
                <li>You are solely responsible for any decisions you make based on the information provided.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                4. Third-Party Links & Ads
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Our site may contain links to third-party websites or display advertising via services such as Google AdSense.</li>
                <li>We are not responsible for the content, policies, or actions of third parties.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                5. Intellectual Property
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>All content, design, and code on this website are protected by copyright and intellectual property laws.</li>
                <li>You may not reproduce, distribute, or modify any part of this site without our written permission.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                6. Limitation of Liability
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We are not liable for any losses or damages arising from your use of this website.</li>
                <li>This includes, without limitation, loss of profits, data, or other commercial damages.</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                7. Changes to These Terms
              </h2>
              <p className="text-gray-700 mb-3">
                We may update these Terms from time to time. Any changes will be posted on this page with the updated &quot;Effective Date.&quot;
              </p>
            </section>

            <div className="border-t border-gray-200 my-6"></div>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                8. Contact Us
              </h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about these Terms, please contact us at:
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
