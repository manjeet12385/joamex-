export const metadata = {
  title: 'Washing Machine Repair & Service Near Me | Doorstep Repair - Joamex',
  description: 'Book verified washing machine repair technicians near you with Joamex. Front load, top load & semi-automatic washing machine repair & servicing.',
  keywords: [
    'Washing Machine Repair Near Me',
    'Front Load Washing Machine Repair',
    'Top Load Washing Machine Service',
    'Washing Machine Repair Service',
    'Joamex Washing Machine Repair'
  ],
  alternates: {
    canonical: 'https://joamex.in/washing-machine',
  },
  openGraph: {
    title: 'Washing Machine Repair & Service Near Me | Doorstep Repair - Joamex',
    description: 'Book verified washing machine repair technicians near you with Joamex. Front load, top load & semi-automatic machine repair.',
    url: 'https://joamex.in/washing-machine',
    siteName: 'Joamex',
    type: 'website',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Washing Machine Repair',
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

export default function WashingMachineLayout({ children }) {
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
