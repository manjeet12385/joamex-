'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, Zap, Shield, ChevronRight } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const stoveServices = [
  {
    id: 'gas-stove-steam-service',
    name: 'Gas stove steam service',
    rating: '4.69',
    reviews: '37K',
    pricePrefix: 'Starts at ',
    price: 399,
    optionsSubtitle: '3 options',
    bullets: [
      'Cleanup of burners, nozzles & internal parts with steam machine'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'hob-steam-service',
    name: 'Hob steam service',
    rating: '4.69',
    reviews: '12K',
    pricePrefix: 'Starts at ',
    price: 549,
    optionsSubtitle: '4 options',
    bullets: [
      'Cleanup of burners, nozzles & internal parts with steam machine'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'gas-stove-repair-checkup',
    name: 'Gas stove check-up & repair',
    rating: '4.72',
    reviews: '85K',
    pricePrefix: 'Starts at ',
    price: 249,
    optionsSubtitle: '4 options',
    bullets: [
      'Diagnosis of burner flame, gas leak, auto-ignition or nozzle clogging',
      'Repair quote provided before work starts'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'hob-repair-checkup',
    name: 'Hob check-up & repair',
    rating: '4.75',
    reviews: '30K',
    pricePrefix: 'Starts at ',
    price: 349,
    optionsSubtitle: '3 options',
    bullets: [
      'Diagnosis of spark plug, generator, glass top or burner gas flow issues',
      'Original spare parts replacement with warranty'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  }
];

export default function StovePage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80',
      category: 'Stove Service & Repair'
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
        
        {/* LEFT COLUMN - Header Title, Badges & CTA matching Image 2 */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.2' }}>
                Stove Service & Repair
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
                <Zap size={14} fill="#047857" /> Instant In 55 mins
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              <Star size={15} fill="#0f172a" color="#0f172a" />
              <strong style={{ color: '#0f172a' }}>4.74</strong>
              <span>(404K bookings)</span>
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
                <span>Up to 30 days warranty</span>
              </div>
              <ChevronRight size={16} color="#64748b" />
            </div>

            {/* View Services Purple Button */}
            <button
              onClick={() => {
                const el = document.getElementById('stove-services-list');
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

        {/* MIDDLE CONTENT AREA - Service */}
        <section id="stove-services-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Service
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {stoveServices.map((item) => (
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
