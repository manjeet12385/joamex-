export const metadata = {
  title: 'Top Rated Electrician Services Near Me | Home Electrical Repairs - Joamex',
  description: 'Book verified doorstep electricians near you with Joamex. Wiring repair, fan installation, switchboard repair, MCB replacement & light fittings.',
  keywords: [
    'Electrician Near Me',
    'Doorstep Electrician',
    'Electrical Repair Services',
    'Fan Installation Near Me',
    'Switchboard Repair',
    'MCB Replacement',
    'Joamex Electrician'
  ],
  alternates: {
    canonical: 'https://joamex.in/electrician',
  },
  openGraph: {
    title: 'Top Rated Electrician Services Near Me | Home Electrical Repairs - Joamex',
    description: 'Book verified doorstep electricians near you with Joamex. Wiring, fan installation, switchboard repair & fittings.',
    url: 'https://joamex.in/electrician',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Electrician Services',
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
    price: '149',
    availability: 'https://schema.org/InStock'
  }
};

export default function ElectricianLayout({ children }) {
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
