import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Is The Stock Market Open? | Real-time Global Market Status",
  description: "Check if stock markets are open worldwide. Real-time status for NYSE, NASDAQ, LSE, TSE, HKEX and 25+ global exchanges with accurate countdowns and holiday tracking.",
  keywords: "stock market, market hours, NYSE, NASDAQ, trading hours, market status, global markets, trading schedule, market holidays, stock exchange hours",
  authors: [{ name: "IsTheStockMarketOpen.io" }],
  creator: "IsTheStockMarketOpen.io",
  publisher: "IsTheStockMarketOpen.io",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://isthestockmarketopen.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Is The Stock Market Open?",
    description: "Real-time global stock market status and trading hours",
    type: "website",
    url: "https://isthestockmarketopen.io",
    siteName: "IsTheStockMarketOpen.io",
    locale: "en_US",
    images: [
      {
        url: "/branding/itsmo logo3.jpeg",
        width: 1200,
        height: 630,
        alt: "IsTheStockMarketOpen.io - Global Market Status",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is The Stock Market Open?",
    description: "Real-time global stock market status and trading hours",
    images: ["/branding/itsmo logo3.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
  icons: {
    icon: [
      {
        url: "/branding/favicon-32x32.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/branding/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/branding/icon.svg",
      sizes: "180x180",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
