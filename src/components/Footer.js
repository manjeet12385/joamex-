'use client';
import { useState } from 'react';
import { Home, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

const citiesColumns = [
  ['Bengaluru', 'Kolkata', 'Nagpur', 'Kanpur', 'Guntur'],
  ['Hyderabad', 'Jaipur', 'Vizag', 'Nashik', 'Nellore'],
  ['Mumbai', 'Surat', 'Bhopal', 'Mysore', 'Warangal'],
  ['Delhi NCR', 'Lucknow', 'Thiruvananthapuram', 'Vijayawada', 'Khammam'],
  ['Chennai', 'Indore', 'Chandigarh', 'Ludhiana', 'Karimnagar'],
  ['Pune', 'Coimbatore', 'Vadodara', 'Madurai', 'Nizamabad'],
  ['Ahmedabad', 'Kochi', 'Patna', 'Rajkot', 'Mahbubnagar']
];

export default function Footer() {
  const [showCities, setShowCities] = useState(false);

  const toggleCities = (e) => {
    e.preventDefault();
    setShowCities(prev => !prev);
  };

  return (
    <footer className="footer">

      {/* MAIN FOOTER */}
      <div className="footer-main">
        <div className="footer-container">

          {/* BRAND */}
          <div className="footer-brand">
            <div className="brand-logo">
              <img src="/images/logo.png" alt="Joamex Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
              <h3>Joamex</h3>
            </div>
            <p>
              Your one-stop destination for all home service needs. From cleaning to electrical
              works, we've got you covered with verified professionals.
            </p>
          </div>

          {/* COMPANY */}
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Privacy Policy</a>
            <button
              onClick={toggleCities}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                color: showCities ? '#6c5ce7' : '#475569',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'block',
                marginBottom: '12px',
                fontWeight: showCities ? '700' : '400',
                transition: 'all 0.2s ease'
              }}
            >
              Cities We Serve {showCities ? '▲' : '▼'}
            </button>
          </div>

          {/* CUSTOMERS */}
          <div className="footer-column">
            <h4>For Customers</h4>
            <a href="#">Reviews</a>
            <a href="#">Contact Us</a>
            <a href="#">Services We Offer</a>
          </div>

          {/* PROFESSIONALS */}
          <div className="footer-column">
            <h4>For Professionals</h4>
            <a href="#">Join as a Service Partner</a>
          </div>

          {/* RIGHT SIDE - SOCIAL MEDIA & APP DOWNLOAD */}
          <div className="footer-column footer-apps">
            <h4>Social Media</h4>
            <div className="social-icons" style={{ marginBottom: '20px' }}>
              <a href="#" className="social-icon twitter" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="https://www.facebook.com/vonexperts.in" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/joamex.in/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/in/venkanna-kelothu-5b3629419/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="social-icon youtube" aria-label="YouTube"><Youtube size={20} /></a>
            </div>

          </div>

        </div>
      </div>

      {/* EXPANDABLE CITIES WE SERVE SECTION */}
      {showCities && (
        <div id="cities-we-serve" className="cities-section" style={{ background: '#f8fafc', padding: '40px 40px', borderTop: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
          <div className="cities-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>
              Cities We Serve
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '20px 16px'
            }}>
              {citiesColumns.map((col, colIdx) => (
                <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {col.map((city, cityIdx) => (
                    <a
                      key={cityIdx}
                      href={`/?city=${encodeURIComponent(city)}`}
                      style={{
                        fontSize: '13px',
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
          </div>
        </div>
      )}

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 Joamex | All Rights Reserved
      </div>

    </footer>
  );
}
