export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Is The Stock Market Open?",
    "description": "Real-time global stock market status and trading hours",
    "url": "https://isthestockmarketopen.io",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://isthestockmarketopen.io/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IsTheStockMarketOpen.io",
      "url": "https://isthestockmarketopen.io"
    },
    "sameAs": [
      "https://github.com/BuzzHeatDev/itsmo"
    ]
  };

  const financialServiceData = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Global Market Status Service",
    "description": "Real-time information about global stock market trading hours and status",
    "url": "https://isthestockmarketopen.io",
    "serviceType": "Market Information Service",
    "areaServed": {
      "@type": "Continent",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Market Information",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "NYSE Market Status",
            "description": "Real-time New York Stock Exchange trading status"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "LSE Market Status",
            "description": "Real-time London Stock Exchange trading status"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "TSE Market Status",
            "description": "Real-time Tokyo Stock Exchange trading status"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(financialServiceData),
        }}
      />
    </>
  );
}
