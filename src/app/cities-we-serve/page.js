'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const citiesList = [
  // Column 1
  ['Bengaluru', 'Kolkata', 'Nagpur', 'Kanpur', 'Guntur'],
  // Column 2
  ['Hyderabad', 'Jaipur', 'Vizag', 'Nashik', 'Nellore'],
  // Column 3
  ['Mumbai', 'Surat', 'Bhopal', 'Mysore', 'Warangal'],
  // Column 4
  ['Delhi NCR', 'Lucknow', 'Thiruvananthapuram', 'Vijayawada', 'Khammam'],
  // Column 5
  ['Chennai', 'Indore', 'Chandigarh', 'Ludhiana', 'Karimnagar'],
  // Column 6
  ['Pune', 'Coimbatore', 'Vadodara', 'Madurai', 'Nizamabad'],
  // Column 7
  ['Ahmedabad', 'Kochi', 'Patna', 'Rajkot', 'Mahbubnagar']
];

export default function CitiesWeServePage() {
  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '40px' }}>
          Cities We Serve
        </h1>

        {/* 7-Column City Grid matching Image 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '32px 24px'
        }}>
          {citiesList.map((col, colIdx) => (
            <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {col.map((city, cityIdx) => (
                <a
                  key={cityIdx}
                  href={`/?city=${encodeURIComponent(city)}`}
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#64748b',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#6c5ce7'}
                  onMouseLeave={(e) => e.target.style.color = '#64748b'}
                >
                  {city}
                </a>
              ))}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
