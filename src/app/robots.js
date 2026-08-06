export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/partner/dashboard/',
          '/profile/',
          '/cart/',
        ],
      },
    ],
    sitemap: 'https://joamex.in/sitemap.xml',
  };
}
