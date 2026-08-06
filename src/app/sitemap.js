export default async function sitemap() {
  const baseUrl = 'https://joamex.in';

  // Static & Main Service Pages
  const routes = [
    '',
    '/services',
    '/ac-repair',
    '/electrician',
    '/plumber',
    '/washing-machine',
    '/water-purifier',
    '/television',
    '/tv-repair',
    '/geyser',
    '/microwave',
    '/microwave-repair',
    '/carpenter',
    '/stove',
    '/stove-repair',
    '/furniture-assembly',
    '/ikea-furniture',
    '/fan-installation',
    '/festival-lights',
    '/air-cooler',
    '/air-cooler-repair',
    '/laptop',
    '/laptop-repair',
    '/appliance',
    '/cities',
    '/cities-we-serve',
    '/services/full-home-cleaning',
    '/services/bathroom-cleaning',
    '/services/kitchen-cleaning',
    '/services/cockroach-control',
    '/services/termite-control',
    '/services/bed-bugs',
    '/services/salon-royale',
    '/services/salon-prime',
    '/services/bridal-makeup',
    '/services/hair-styling',
    '/services/men-massage',
    '/services/living-cleaning',
    '/login',
    '/signup',
    '/partner/login',
    '/partner/register',
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/services') || route.includes('-repair') ? 0.8 : 0.6,
  }));
}
