'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ShieldCheck, Zap, Shield, ChevronRight } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const refrigeratorServices = [
  {
    id: 'fridge-general-checkup',
    name: 'Refrigerator check-up',
    rating: '4.72',
    reviews: '156K',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '60 mins',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&h=300&fit=crop&q=80'
  },
  {
    id: 'fridge-single-door-checkup',
    name: 'Single door refrigerator check-up & repair',
    rating: '4.74',
    reviews: '800K',
    pricePrefix: 'Starts at ',
    price: 299,
    duration: '30 mins',
    bullets: [
      'Complete diagnosis of cooling, noise, gas leak or compressor issues'
    ],
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&h=300&fit=crop&q=80'
  },
  {
    id: 'fridge-double-door-checkup',
    name: 'Double door / Side-by-side refrigerator repair',
    rating: '4.78',
    reviews: '650K',
    pricePrefix: 'Starts at ',
    price: 399,
    duration: '45 mins',
    bullets: [
      'Diagnosis of inverter compressor, defrost heater, fan or PCB issues'
    ],
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&h=300&fit=crop&q=80'
  },
  {
    id: 'fridge-gas-refill',
    name: 'Refrigerator gas refill',
    rating: '4.76',
    reviews: '350K',
    pricePrefix: 'Starts at ',
    price: 1499,
    duration: '1 hr',
    bullets: [
      'Complete gas leak identification & eco-friendly gas refilling'
    ],
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&h=300&fit=crop&q=80'
  }
];

export default function RefrigeratorPage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=300&h=300&fit=crop&q=80',
      category: 'Refrigerator Repair'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="bridal-makeup-page-wrapper" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />

      <main className="bridal-makeup-container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Hero Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '32px', marginBottom: '40px', alignItems: 'center' }}>
          {/* Left Title & CTA */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.1' }}>
                Refrigerator Repair
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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
              <Star size={15} fill="#10b981" color="#10b981" />
              <strong style={{ color: '#0f172a' }}>4.74</strong>
              <span>(1.8 M bookings)</span>
            </div>

            {/* Warranty Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '24px',
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
                const el = document.getElementById('fridge-services-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              View Services
            </button>
          </div>

          {/* Right Hero Image Card */}
          <div style={{
            width: '100%',
            height: '320px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1000&auto=format&fit=crop&q=80"
              alt="Refrigerator Repair Expert inspecting circuit"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div id="fridge-services-list" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          
          {/* Middle Services Content */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Refrigerator check-up
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {refrigeratorServices.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                      <span style={{ color: '#7c3aed', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={14} fill="#7c3aed" color="#7c3aed" /> {item.rating}
                      </span>
                      <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                        {item.pricePrefix || ''}₹{item.price.toLocaleString()}
                      </span>
                      {item.duration && (
                        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>• {item.duration}</span>
                      )}
                    </div>

                    {item.bullets && item.bullets.length > 0 && (
                      <ul style={{ paddingLeft: '18px', margin: '0 0 16px 0', color: '#334155', fontSize: '13px', lineHeight: '1.7' }}>
                        {item.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} style={{ marginBottom: '4px' }}>{bullet}</li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => setSelectedDetailsItem(item)}
                      style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                    >
                      View details
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
                    {getItemQuantity(item.id) > 0 ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1.5px solid #7c3aed',
                        borderRadius: '8px',
                        padding: '4px 12px',
                        width: '90px',
                        color: '#7c3aed',
                        fontWeight: '700',
                        background: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                          style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '14px', color: '#7c3aed', fontWeight: '800' }}>{getItemQuantity(item.id)}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          padding: '8px 26px',
                          borderRadius: '8px',
                          border: '1.5px solid #7c3aed',
                          background: '#ffffff',
                          color: '#7c3aed',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Sidebar - UC Promise & Cart Bar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>UC Promise</h3>
                <ShieldCheck size={28} color="#7c3aed" />
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#7c3aed" /> Verified Professionals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#7c3aed" /> Hassle Free Booking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#7c3aed" /> Transparent Pricing
                </li>
              </ul>
            </div>

            {cartTotal > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                borderRadius: '16px',
                padding: '16px 20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                position: 'sticky',
                top: '100px'
              }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '800' }}>₹{cartTotal.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Items in cart</div>
                </div>
                <button
                  onClick={() => router.push('/cart')}
                  style={{
                    background: '#ffffff',
                    color: '#7c3aed',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  View Cart
                </button>
              </div>
            )}
          </aside>
        </div>

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
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' }}>⭐ {selectedDetailsItem.rating}{selectedDetailsItem.duration ? ` • ${selectedDetailsItem.duration}` : ''}</p>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed', marginBottom: '16px' }}>₹{selectedDetailsItem.price}</div>
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
              style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
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
