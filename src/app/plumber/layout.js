export const metadata = {
  title: 'Verified Plumber Near Me | Emergency Plumbing Services - Joamex',
  description: 'Hire expert plumbers near you with Joamex. Tap repair, pipe leakage fix, bathroom fittings, blockages clearing, water tank cleaning at best rates.',
  keywords: [
    'Plumber Near Me',
    'Emergency Plumber Service',
    'Tap Leak Repair',
    'Bathroom Plumbing Fittings',
    'Water Tank Cleaning',
    'Drainage Blockage Repair',
    'Joamex Plumber'
  ],
  alternates: {
    canonical: 'https://joamex.in/plumber',
  },
  openGraph: {
    title: 'Verified Plumber Near Me | Emergency Plumbing Services - Joamex',
    description: 'Hire expert plumbers near you with Joamex. Tap repair, pipe leakage fix, bathroom fittings & blockages clearing.',
    url: 'https://joamex.in/plumber',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Plumbing Services',
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    name: 'Joamex',
    url: 'https://joamex.in'
  },
  areaServed: {
    '@type': 'Country',
    name: 'India'
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '199',
    availability: 'https://schema.org/InStock'
  }
};

export default function PlumberLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  );
}
