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
              <img src="/images/logo.png" alt="Joamex Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
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

          {/* RIGHT SIDE - SOCIAL MEDIA & QUICK CONTACT */}
          <div className="footer-column footer-apps">
            <h4>Social Media</h4>
            <div className="social-icons" style={{ marginBottom: '20px' }}>
              <a href="#" className="social-icon twitter" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="https://www.facebook.com/vonexperts.in" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/joamex.in/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/in/venkanna-kelothu-5b3629419/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="social-icon youtube" aria-label="YouTube"><Youtube size={20} /></a>
            </div>

            <h4 style={{ marginTop: '10px' }}>Quick Contact</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/919014380344?text=Hi%20Joamex%2C%20I%20want%20to%20book%20a%20home%20service.%20Please%20help%20me%20with%20the%20details."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact us on WhatsApp"
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 0C5.396 0 .013 5.385.013 12.02c0 2.12.553 4.19 1.6 6.014L.044 23.993l6.098-1.599c1.761.94 3.738 1.436 5.889 1.436 6.634 0 12.018-5.384 12.018-12.019C23.993 5.386 18.608 0 12.031 0zm.002 21.84c-1.782 0-3.527-.478-5.055-1.385l-.361-.214-3.76 1.011 1.033-3.666-.235-.373a9.988 9.988 0 0 1-1.528-5.347c0-5.526 4.498-10.024 10.025-10.024 5.527 0 10.025 4.498 10.025 10.024 0 5.526-4.498 10.024-10.025 10.024zm5.503-7.53c-.302-.152-1.785-.883-2.062-.983-.277-.101-.48-.152-.682.152-.202.303-.781.983-.957 1.185-.177.202-.354.227-.656.075-1.72-.885-2.885-1.89-4.004-3.805-.207-.354.204-.33.79-.909.102-.101.152-.202.228-.354.076-.151.038-.278-.012-.429-.051-.152-.682-1.643-.935-2.25-.246-.59-.496-.51-.682-.52-.177-.008-.38-.008-.582-.008s-.532.076-.81.38c-.278.303-1.062 1.036-1.062 2.527 0 1.491 1.087 2.932 1.239 3.134.152.202 2.138 3.262 5.176 4.57.721.31 1.282.496 1.722.635.724.23 1.383.197 1.9.119.58-.088 1.785-.73 2.038-1.437.253-.707.253-1.314.177-1.437-.076-.126-.278-.202-.582-.354z" />
                </svg>
              </a>

              {/* Phone Call Button */}
              <a
                href="tel:+919014380344"
                aria-label="Call us"
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </a>
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
      <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div>© 2026 Joamex | All Rights Reserved</div>
        <div style={{ fontSize: '14px' }}>
          managed by{' '}
          <a 
            href="https://indianexportwebmart.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#000000', 
              fontWeight: 'bold', 
              textDecoration: 'none' 
            }}
          >
            Indian Export Webmart
          </a>
        </div>
      </div>

    </footer>
  );
}
