export const metadata = {
  title: 'Best AC Repair & Service Near Me | Doorstep AC Repair - Joamex',
  description: 'Book certified AC repair & service experts with Joamex. Split & Window AC installation, gas charging, deep cleaning, leak repair at guaranteed lowest prices.',
  keywords: [
    'AC Repair Near Me',
    'AC Service Near Me',
    'Split AC Repair',
    'Window AC Service',
    'AC Gas Charging',
    'AC Installation Service',
    'Joamex AC Repair'
  ],
  alternates: {
    canonical: 'https://joamex.in/ac-repair',
  },
  openGraph: {
    title: 'Best AC Repair & Service Near Me | Doorstep AC Repair - Joamex',
    description: 'Book certified AC repair & service experts with Joamex. Split & Window AC installation, gas charging, deep cleaning at best prices.',
    url: 'https://joamex.in/ac-repair',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AC Repair and Servicing',
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

export default function AcRepairLayout({ children }) {
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
