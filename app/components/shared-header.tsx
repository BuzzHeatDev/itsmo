import Link from 'next/link';
import Image from 'next/image';

export default function SharedHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/branding/itsmo logo3.jpeg" 
              alt="IsTheStockMarketOpen Logo" 
              width={80}
              height={80}
              className="w-20 h-20"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-gray-900">IsTheStockMarket</span>
              <span className="text-green-600">Open</span>
              <span className="text-orange-500">?</span>
            </h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}






