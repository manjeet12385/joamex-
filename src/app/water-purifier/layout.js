export const metadata = {
  title: 'RO Water Purifier Service & Repair Near Me | Filter Change - Joamex',
  description: 'Book expert RO water purifier servicing & repair near you with Joamex. RO filter replacement, membrane cleaning & installation at best prices.',
  keywords: [
    'RO Service Near Me',
    'Water Purifier Repair',
    'RO Filter Replacement',
    'Kent RO Service',
    'Aquaguard Service Near Me',
    'Joamex Water Purifier Repair'
  ],
  alternates: {
    canonical: 'https://joamex.in/water-purifier',
  },
  openGraph: {
    title: 'RO Water Purifier Service & Repair Near Me | Filter Change - Joamex',
    description: 'Book expert RO water purifier servicing & repair near you with Joamex. RO filter replacement & membrane cleaning.',
    url: 'https://joamex.in/water-purifier',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Water Purifier Service and Repair',
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
    price: '299',
    availability: 'https://schema.org/InStock'
  }
};

export default function WaterPurifierLayout({ children }) {
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
