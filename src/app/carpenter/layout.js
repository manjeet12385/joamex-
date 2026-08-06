export const metadata = {
  title: 'Professional Carpenter Near Me | Furniture Repair & Assembly - Joamex',
  description: 'Book skilled carpenters near you with Joamex. Door lock repair, furniture assembly, bed repair, cabinet fixing & custom carpentry work.',
  keywords: [
    'Carpenter Near Me',
    'Furniture Assembly Service',
    'Door Lock Repair',
    'Bed Repair Carpenter',
    'Modular Kitchen Carpentry',
    'Joamex Carpenter'
  ],
  alternates: {
    canonical: 'https://joamex.in/carpenter',
  },
  openGraph: {
    title: 'Professional Carpenter Near Me | Furniture Repair & Assembly - Joamex',
    description: 'Book skilled carpenters near you with Joamex. Door lock repair, furniture assembly, bed repair & cabinet fixing.',
    url: 'https://joamex.in/carpenter',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Carpentry Services',
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
    price: '249',
    availability: 'https://schema.org/InStock'
  }
};

export default function CarpenterLayout({ children }) {
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
