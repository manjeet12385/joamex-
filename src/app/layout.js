import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from '@/components/Providers';
import StickyWhatsApp from '@/components/StickyWhatsApp';
import WelcomePopup from '@/components/WelcomePopup';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://joamex.in'),
  title: {
    default: 'Joamex | Top Rated Home Services at Your Doorstep',
    template: '%s | Joamex'
  },
  description: 'Book verified home services expert at your doorstep with Joamex. AC service & repair, deep cleaning, electricians, plumbers, salon at home, painting & pest control.',
  keywords: [
    'Joamex',
    'Home Services',
    'AC Repair Service',
    'Electrician Near Me',
    'Plumber Near Me',
    'Home Cleaning Services',
    'Salon at Home',
    'Washing Machine Repair',
    'Pest Control Services',
    'Water Purifier Repair',
    'Painter',
    'SVK Experts'
  ],
  authors: [{ name: 'Joamex India' }],
  creator: 'Joamex',
  publisher: 'Joamex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://joamex.in',
  },
  openGraph: {
    title: 'Joamex | Top Rated Home Services at Your Doorstep',
    description: 'Book trusted home services like AC repair, home deep cleaning, electricians, plumbers, salon for women & men grooming with Joamex.',
    url: 'https://joamex.in',
    siteName: 'Joamex',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'Joamex Home Services',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joamex | Top Rated Home Services at Your Doorstep',
    description: 'Book trusted home services like AC repair, home deep cleaning, electricians, plumbers, salon for women with Joamex.',
    images: ['/images/logo.png'],
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
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Schema.org Structured Data (JSON-LD) for Google Rich Snippets
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Joamex',
  image: 'https://joamex.in/images/logo.png',
  '@id': 'https://joamex.in',
  url: 'https://joamex.in',
  telephone: '+919876543210',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.6139,
    longitude: 77.2090
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '100000'
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    opens: '08:00',
    closes: '21:00'
  },
  sameAs: [
    'https://joamex.in'
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
        <WelcomePopup />
        <StickyWhatsApp />
      </body>
    </html>
  );
}
