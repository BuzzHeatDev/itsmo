import Link from 'next/link';
import SharedHeader from '../components/shared-header';
import SharedFooter from '../components/shared-footer';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader />

      {/* Breadcrumbs */}
      <div className="pt-32 pb-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">About Us</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 mb-6">
                Welcome to IsTheStockMarketOpen.io
              </p>
              
              <p className="text-lg text-gray-600 mb-6">
                The no-nonsense way to check global stock market trading hours in real time.
              </p>
              
              <p className="text-gray-700 mb-6">
                This site exists for one simple reason: Finding out whether a market is open shouldn&apos;t mean digging through endless financial pages.
              </p>
              
              <p className="text-gray-700 mb-6">
                Whether you&apos;re a trader, investor, or just curious, our clean interface tells you at a glance:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Which markets are open or closed</li>
              </ul>
              
              <p className="text-gray-700 mb-6">
                Our goal is to keep things fast, clear, and accurate.
              </p>
              
              <p className="text-gray-700 mb-6">
                No fluff and no guesswork.
              </p>
              
              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-700 mb-4">
                  We believe in accuracy, transparency, and keeping our visitors informed. If you ever have feedback or ideas to improve the site, we&apos;d love to hear from you.
                </p>
                <p className="text-gray-700">
                  <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium underline">
                    Contact us here
                  </Link> to share your thoughts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
