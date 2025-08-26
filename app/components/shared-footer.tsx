import Link from 'next/link';

export default function SharedFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">
            © 2024 IsTheStockMarketOpen.io - Real-time global market status
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/about" className="hover:text-gray-700">About</Link>
            <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
            <Link href="/contact" className="hover:text-gray-700">Contact</Link>
            <Link href="/terms" className="hover:text-gray-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
