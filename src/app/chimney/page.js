'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ShieldCheck, Zap } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const chimneyCategories = [
  {
    id: 'combos',
    title: 'Combos',
    badge: 'COMBO DEALS',
    icon: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'deep-chimney-stove-service',
        name: 'Deep chimney & stove service',
        rating: '4.92',
        reviews: '120',
        pricePrefix: 'Starts at ',
        price: 1249,
        duration: '1 hr 45 mins',
        optionsSubtitle: '3 options',
        bullets: [
          'Dismantling for internal servicing of motor, blowers & filters.',
          'Interior & exterior surface degreasing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
      },
      {
        id: 'regular-chimney-stove-cleaning',
        name: 'Regular chimney & stove cleaning',
        rating: '4.88',
        reviews: '33',
        pricePrefix: 'Starts at ',
        price: 548,
        duration: '1 hr 25 mins',
        bullets: [
          'Stovetops, burners, mesh & filter cleaning with steam',
          'Excludes motor cleaning, repair & automatic chimney cleaning'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'service',
    title: 'Service',
    icon: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'deep-chimney-service-standalone',
        name: 'Deep chimney service',
        rating: '4.98',
        reviews: '68',
        pricePrefix: 'Starts at ',
        price: 1249,
        duration: '1 hr 45 mins',
        bullets: [
          'Dismantling for internal servicing of motor, blowers & filters',
          'Interior & exterior surface degreasing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
      },
      {
        id: 'regular-chimney-cleaning',
        name: 'Regular chimney cleaning',
        rating: '4.88',
        reviews: '137',
        pricePrefix: 'Starts at ',
        price: 399,
        duration: '45 mins',
        bullets: [
          'Chimney exterior, mesh & filter cleaning with a steam machine',
          'Excludes motor cleaning, repair & automatic chimney cleaning'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'repairs',
    title: 'Repairs',
    icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'chimney-repair-checkup',
        name: 'Chimney repair & check-up',
        rating: '4.82',
        reviews: '215',
        pricePrefix: 'Starts at ',
        price: 249,
        duration: '30 mins',
        optionsSubtitle: '4 options',
        bullets: [
          'Diagnosis of motor, noise, PCB or suction power issues',
          'Repair quote provided before work begins'
        ],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'installation',
    title: 'Installation/uninstallation',
    icon: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'beyond-chimney-installation',
        name: 'Beyond chimney installation',
        rating: '4.79',
        reviews: '218',
        pricePrefix: 'Starts at ',
        price: 699,
        optionsSubtitle: '2 options',
        bullets: [
          'Installation of smart & premium wall-mounted chimneys',
          'Includes duct pipe connection, mounting bracket fix & testing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
      },
      {
        id: 'chimney-installation',
        name: 'Chimney installation',
        rating: '4.86',
        reviews: '95',
        pricePrefix: 'Starts at ',
        price: 599,
        duration: '1 hr',
        optionsSubtitle: '2 options',
        bullets: [
          'Safe wall mounting, duct pipe connection & testing'
        ],
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&q=80'
      },
      {
        id: 'chimney-uninstallation',
        name: 'Chimney uninstallation',
        rating: '4.84',
        reviews: '40',
        pricePrefix: 'Starts at ',
        price: 299,
        duration: '30 mins',
        bullets: [
          'Safe dismounting and duct pipe detachment'
        ],
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function ChimneyPage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [activeCategoryId, setActiveCategoryId] = useState('combos');
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80',
      category: 'Chimney Service & Repair'
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

      <main className="bridal-makeup-container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '32px' }}>
        
        {/* LEFT SIDEBAR - Select a service (Category selector like Image 2) */}
        <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
          <div className="select-service-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <h3 className="sidebar-title" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px' }}>
              Select a service
            </h3>
            <div className="sidebar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 12px' }}>
              {chimneyCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`sidebar-grid-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    const el = document.getElementById(`cat-section-${cat.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 6px',
                    borderRadius: '12px',
                    border: activeCategoryId === cat.id ? '2px solid #6c5ce7' : '1px solid #e2e8f0',
                    background: activeCategoryId === cat.id ? '#f5f3ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {cat.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      background: '#22c55e',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: '800',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      textTransform: 'uppercase'
                    }}>
                      {cat.badge}
                    </span>
                  )}
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', marginBottom: '6px' }}>
                    <img src={cat.icon} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: activeCategoryId === cat.id ? '#6c5ce7' : '#334155', textAlign: 'center', lineHeight: '1.2' }}>
                    {cat.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE CONTENT AREA */}
        <section className="makeup-main-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {chimneyCategories.map((catSection) => (
            <div key={catSection.id} id={`cat-section-${catSection.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {catSection.title}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {catSection.items.map((item) => (
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
                        {item.duration && (
                          <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '4px' }}>• {item.duration}</span>
                        )}
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
            </div>
          ))}

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
