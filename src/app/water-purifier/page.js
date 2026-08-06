'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, Zap, Shield, ChevronRight } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const waterPurifierQuickCheckups = [
  {
    id: 'repair-checkup',
    name: 'Repair check-up',
    rating: '4.78',
    reviews: '53K reviews',
    price: 249,
  },
  {
    id: 'filter-checkup',
    name: 'Filter check-up',
    rating: '4.80',
    reviews: '134K reviews',
    price: 249,
  },
  {
    id: 'complete-filter-replacement',
    name: 'Complete filter replacement',
    rating: '4.83',
    reviews: '80K reviews',
    price: 4199,
  }
];

const waterPurifierServices = [
  {
    id: 'ro-water-purifier-checkup',
    name: 'Water Purifier / RO check-up & repair',
    rating: '4.79',
    reviews: '199K',
    pricePrefix: 'Starts at ',
    price: 249,
    optionsSubtitle: '4 options',
    bullets: [
      'Detailed check of TDS, filters, membrane, pump & electrical circuits',
      'Repair quote provided after full diagnosis'
    ],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'ro-servicing-filter-replacement',
    name: 'RO Servicing & Filter Replacement',
    rating: '4.84',
    reviews: '150K',
    pricePrefix: 'Starts at ',
    price: 499,
    optionsSubtitle: '5 options',
    bullets: [
      'Complete servicing including sediment filter, carbon filter & TDS adjustment',
      'Ensures 100% pure & safe drinking water'
    ],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'ro-uninstallation-installation',
    name: 'RO Uninstallation & Installation',
    rating: '4.81',
    reviews: '45K',
    pricePrefix: 'Starts at ',
    price: 399,
    optionsSubtitle: '3 options',
    bullets: [
      'Dismounting, plumbing inlet connection & operational testing'
    ],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&h=300&fit=crop&q=80'
  }
];

export default function WaterPurifierPage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&h=300&fit=crop&q=80',
      category: 'Water Purifier Service & Repair'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="bridal-makeup-page-wrapper" style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Header />

      <main className="bridal-makeup-container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr 300px', gap: '32px' }}>
        
        {/* LEFT COLUMN - Title, Badges & CTA matching standard layout */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px', height: 'fit-content' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.2' }}>
                Water Purifier / RO Repair
              </h1>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#047857',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                <Zap size={14} fill="#047857" /> Instant In 44 mins
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              <Star size={15} fill="#0f172a" color="#0f172a" />
              <strong style={{ color: '#0f172a' }}>4.79</strong>
              <span>(2.3 M bookings)</span>
            </div>

            {/* Warranty Badge Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '20px',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="#475569" />
                <span>Up to 180 days warranty</span>
              </div>
              <ChevronRight size={16} color="#64748b" />
            </div>

            {/* View Services Purple Button */}
            <button
              onClick={() => {
                const el = document.getElementById('water-services-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: '#6c5ce7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108, 92, 231, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              View Services
            </button>
          </div>
        </aside>

        {/* MIDDLE CONTENT COLUMN */}
        <section id="water-services-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Hero Banner Card */}
          <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '180px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <div style={{ maxWidth: '320px', zIndex: 2 }}>
              <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                1-year warranty on filters & spares
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontWeight: '600' }}>
                100% genuine RO filters & parts replacement
              </p>
            </div>
            <div style={{ position: 'relative', width: '140px', height: '120px', flexShrink: 0, zIndex: 1 }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                opacity: 0.85
              }} />
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              Select a service
            </h2>

            {/* Quick Checkups / Filter Replacement Horizontal Carousel */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div
                id="water-checkup-scroll-container"
                style={{
                  display: 'flex',
                  gap: '14px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  paddingBottom: '12px',
                  paddingRight: '40px',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {waterPurifierQuickCheckups.map((checkup) => (
                  <div
                    key={checkup.id}
                    style={{
                      minWidth: '170px',
                      width: '170px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      flexShrink: 0
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0', lineHeight: '1.2' }}>
                        {checkup.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                        <Star size={12} fill="#0f172a" color="#0f172a" />
                        <span>{checkup.rating} ({checkup.reviews})</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
                        ₹{checkup.price.toLocaleString()}
                      </div>
                    </div>

                    {getItemQuantity(checkup.id) > 0 ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1.5px solid #6c5ce7',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        color: '#6c5ce7',
                        fontWeight: '700',
                        background: '#ffffff'
                      }}>
                        <button
                          onClick={() => updateQuantity(checkup.id, getItemQuantity(checkup.id) - 1)}
                          style={{ background: 'none', border: 'none', color: '#6c5ce7', fontSize: '15px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '13px', color: '#6c5ce7', fontWeight: '800' }}>{getItemQuantity(checkup.id)}</span>
                        <button
                          onClick={() => handleAddToCart(checkup)}
                          style={{ background: 'none', border: 'none', color: '#6c5ce7', fontSize: '15px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(checkup)}
                        style={{
                          width: '100%',
                          padding: '6px 0',
                          borderRadius: '8px',
                          border: '1.5px solid #6c5ce7',
                          background: '#ffffff',
                          color: '#6c5ce7',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Scroll Right Arrow Button */}
              <button
                onClick={() => {
                  const container = document.getElementById('water-checkup-scroll-container');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '40%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 3,
                  color: '#0f172a'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {waterPurifierServices.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#6c5ce7', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={14} fill="#6c5ce7" color="#6c5ce7" /> {item.rating}
                    </span>
                    <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                      {item.pricePrefix || ''}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  {item.bullets && item.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '14px', margin: '0 0 16px 0', color: '#475569', fontSize: '13px', lineHeight: '1.7', listStyleType: 'disc' }}>
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: '4px' }}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => setSelectedDetailsItem(item)}
                    style={{ background: 'none', border: 'none', color: '#6c5ce7', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    View details
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                  {item.image && (
                    <div style={{ width: '120px', height: '90px', borderRadius: '12px', overflow: 'hidden', marginBottom: '4px', border: '1px solid #f1f5f9' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  {getItemQuantity(item.id) > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1.5px solid #6c5ce7',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      width: '90px',
                      color: '#6c5ce7',
                      fontWeight: '700',
                      background: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                        style={{ background: 'none', border: 'none', color: '#6c5ce7', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '14px', color: '#6c5ce7', fontWeight: '800' }}>{getItemQuantity(item.id)}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{ background: 'none', border: 'none', color: '#6c5ce7', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        padding: '6px 28px',
                        borderRadius: '8px',
                        border: '1.5px solid #6c5ce7',
                        background: '#ffffff',
                        color: '#6c5ce7',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Add
                    </button>
                  )}

                  {item.optionsSubtitle && (
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                      {item.optionsSubtitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT SIDEBAR - UC Promise & Cart Bar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>UC Promise</h3>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a78bfa 0%, #6c5ce7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '800',
                textAlign: 'center',
                lineHeight: '1.1'
              }}>
                QUALITY
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#6c5ce7" /> Verified Professionals
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#6c5ce7" /> Hassle Free Booking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#6c5ce7" /> Transparent Pricing
              </li>
            </ul>
          </div>

          {cartTotal > 0 && (
            <div style={{
              background: '#6c5ce7',
              borderRadius: '14px',
              padding: '14px 20px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 20px rgba(108, 92, 231, 0.3)',
              position: 'sticky',
              top: '100px'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800' }}>₹{cartTotal.toLocaleString()}</div>
              <button
                onClick={() => router.push('/cart')}
                style={{
                  background: 'none',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View Cart
              </button>
            </div>
          )}
        </aside>

      </main>

      {/* Details Modal Popup */}
      {selectedDetailsItem && (
        <div className="service-overlay" onClick={() => setSelectedDetailsItem(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '20px', padding: '24px' }}>
            <button className="close-btn" onClick={() => setSelectedDetailsItem(null)}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {selectedDetailsItem.image && (
                <img src={selectedDetailsItem.image} alt={selectedDetailsItem.name} style={{ width: '100%', height: '180px', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px' }} />
              )}
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0' }}>{selectedDetailsItem.name}</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' }}>⭐ {selectedDetailsItem.rating}</p>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#6c5ce7', marginBottom: '16px' }}>₹{selectedDetailsItem.price}</div>
            </div>
            {selectedDetailsItem.bullets && selectedDetailsItem.bullets.length > 0 && (
              <ul style={{ paddingLeft: '20px', color: '#334155', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                {selectedDetailsItem.bullets.map((b, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{b}</li>
                ))}
              </ul>
            )}
            <button
              onClick={() => {
                handleAddToCart(selectedDetailsItem);
                setSelectedDetailsItem(null);
              }}
              style={{ width: '100%', padding: '12px', background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
