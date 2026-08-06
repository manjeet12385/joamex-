'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import '../bridal-makeup/style.css';

const massageCategories = [
  {
    id: 'pain-relief',
    title: 'Pain relief',
    icon: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'Instant comfort for tired muscles',
      subtitle: 'Medium pressure • 45 mins • Key body areas',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'quick-comfort-therapy',
        name: 'Quick comfort therapy',
        rating: '4.81',
        reviews: '21K',
        price: 999,
        originalPrice: 1199,
        duration: '45 mins',
        bullets: [
          'Revitalising oil massage focused on key stress areas',
          'Eases tension & restores energy for a relaxed, refreshed feel'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'deep-tissue-pain-relief-massage',
        name: 'Deep tissue pain relief massage',
        bestseller: true,
        rating: '4.83',
        reviews: '177K',
        pricePrefix: 'Starts at ',
        price: 1429,
        duration: '60 mins',
        bullets: [
          'Firm palm movements to ease muscle tightness & soreness',
          'Save more: Add a pack to unlock extra savings'
        ],
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'deep-tissue-head-neck-shoulder',
        name: 'Deep tissue with head/neck/shoulder',
        rating: '4.84',
        reviews: '11K',
        price: 1999,
        originalPrice: 2099,
        duration: '1 hr 40 mins',
        bullets: [
          '60 mins deep tissue massage & 40 mins head/neck/shoulder massage'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'back-relief-massage',
        name: 'Back relief massage',
        rating: '4.86',
        reviews: '13K',
        price: 919,
        duration: '40 mins',
        bullets: [
          'Customised massage with natural oils to ease back tightness'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'leg-relief-massage',
        name: 'Leg relief massage',
        rating: '4.85',
        reviews: '14K',
        price: 919,
        duration: '40 mins',
        bullets: [
          'Customised massage with natural oils to ease leg tightness'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'stress-relief',
    title: 'Stress relief',
    icon: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'Let go of that built-up stress',
      subtitle: 'Medium pressure • 60 / 90 mins • Full body',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'swedish-stress-relief-massage',
        name: 'Swedish stress relief massage',
        bestseller: true,
        rating: '4.82',
        reviews: '119K',
        pricePrefix: 'Starts at ',
        price: 1298,
        duration: '60 mins',
        bullets: [
          'A soothing full-body experience for total relaxation',
          'Save more: Add a pack to unlock extra savings'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-shoulder-massage',
        name: 'Head & shoulder stress relief',
        rating: '4.88',
        reviews: '34K',
        price: 699,
        originalPrice: 899,
        duration: '30 mins',
        bullets: [
          'Soothing head, neck & shoulder massage with warm herbal oils',
          'Calms mind, reduces headache tension & promotes deep sleep'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'holistic-de-stress-massage',
        name: 'Holistic de-stress massage',
        rating: '4.83',
        reviews: '13K',
        price: 1559,
        duration: '1 hr 20 mins',
        bullets: [
          'Medium-pressure massage with focus on head, neck & shoulder'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'top-to-toe-stress-relief-massage',
        name: 'Top-to-toe stress relief massage',
        rating: '4.84',
        reviews: '34K',
        price: 1979,
        duration: '1 hr 40 mins',
        bullets: [
          'Full-body massage with scalp care & 20 mins foot reflexology'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'post-workout',
    title: 'Post workout',
    icon: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'sports-recovery-massage',
        name: 'Sports recovery massage',
        rating: '4.85',
        reviews: '12K',
        pricePrefix: 'Starts at ',
        price: 1369,
        duration: '60 mins',
        bullets: [
          'High-pressure full-body massage to ease muscle tightness',
          'Save more: Add a pack to unlock extra savings'
        ],
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'post-workout-deep-tissue-pain-relief',
        name: 'Deep tissue pain relief massage',
        bestseller: true,
        rating: '4.83',
        reviews: '177K',
        pricePrefix: 'Starts at ',
        price: 1429,
        duration: '60 mins',
        bullets: [
          'Firm palm movements to ease muscle tightness & soreness',
          'Save more: Add a pack to unlock extra savings'
        ],
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'post-workout-deep-tissue-head-neck-shoulder',
        name: 'Deep tissue with head/neck/shoulder',
        rating: '4.84',
        reviews: '11K',
        price: 1999,
        originalPrice: 2099,
        duration: '1 hr 40 mins',
        bullets: [
          '60 mins deep tissue massage & 40 mins head/neck/shoulder massage'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      }
    ],
    videoBanner: {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'add-ons',
    title: 'Add-ons',
    icon: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'foot-massage',
        name: 'Foot massage',
        rating: '4.86',
        reviews: '42K',
        price: 569,
        duration: '25 mins',
        bullets: [
          'Foot massage using micro-movements to target every pressure point',
          'Targets stiffness & discomfort in your feet'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-neck-shoulder-massage',
        name: 'Head, neck & shoulder massage',
        rating: '4.86',
        reviews: '43K',
        price: 669,
        duration: '40 mins',
        bullets: [
          'Focused medium-pressure relief for head, neck & shoulders',
          'Releases muscle tension & nourishes scalp'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-massage',
        name: 'Head massage',
        rating: '4.85',
        reviews: '10K',
        price: 359,
        duration: '20 mins',
        bullets: [
          'Relaxing head massage to revitalise the scalp & help you unwind'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'stretch-therapy',
        name: 'Stretch therapy',
        rating: '4.85',
        reviews: '7K',
        price: 349,
        duration: '15 mins',
        bullets: [
          'Full-body low-pressure stretch eases tension, boosts mobility.',
          'Eases muscle tightness & boosts overall mobility'
        ],
        image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'massage-top-up-15min',
        name: 'Massage top-up (15 mins)',
        rating: '4.85',
        reviews: '14K',
        price: 199,
        duration: '15 mins',
        bullets: [
          'Extend your relaxation with 15 extra minutes of massage therapy'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'hot-bed',
        name: 'Hot bed',
        rating: '4.83',
        reviews: '6K',
        price: 49,
        bullets: [
          'Advanced technology for ambient massage temperature',
          'Enhances relaxation & removes stiffness'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function MenMassagePage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal } = useCart();
  const [activeCategoryId, setActiveCategoryId] = useState('pain-relief');
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const activeCategory = massageCategories.find(c => c.id === activeCategoryId) || massageCategories[0];
  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: 'Massage for Men'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const isItemInCart = (itemId) => {
    return cart.some(c => c.id === itemId);
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      <Header />

      <main className="bridal-makeup-container">
        
        {/* LEFT SIDEBAR - Select a Service */}
        <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
          <div className="select-service-card">
            <h3 className="sidebar-title" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px' }}>
              Select a service
            </h3>
            <div className="sidebar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 8px' }}>
              {massageCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`sidebar-grid-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '6px',
                    border: activeCategoryId === cat.id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    boxShadow: activeCategoryId === cat.id ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                    background: '#f8fafc'
                  }}>
                    <img
                      src={cat.icon}
                      alt={cat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: activeCategoryId === cat.id ? '700' : '500',
                    color: activeCategoryId === cat.id ? '#0f172a' : '#475569',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    {cat.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE SECTION - Main Details & Service Cards */}
        <section className="makeup-middle-content">
          <div className="makeup-details-header">
            <h1>{activeCategory.title}</h1>
          </div>

          {/* Hero Banner Card */}
          {activeCategory.banner && (
            <div className="makeup-hero-banner-card" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <img src={activeCategory.banner.image} alt={activeCategory.banner.title} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                padding: '24px 20px 16px 20px',
                color: '#ffffff'
              }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800' }}>{activeCategory.banner.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>{activeCategory.banner.subtitle}</p>
              </div>
            </div>
          )}

          {/* Service Items List */}
          <div className="service-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className="service-detail-item-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1 }}>
                  {item.bestseller && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      letterSpacing: '0.05em'
                    }}>
                      🔰 BESTSELLER
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '700', color: '#0f172a' }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#4f46e5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={14} fill="#4f46e5" /> {item.rating}
                    </span>
                    <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {item.pricePrefix || '₹'}{item.pricePrefix ? `₹${item.price.toLocaleString()}` : item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{item.originalPrice.toLocaleString()}</span>
                    )}
                    {item.duration && (
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>• {item.duration}</span>
                    )}
                  </div>

                  {item.bullets && item.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '18px', margin: '0 0 12px 0', color: '#475569', fontSize: '13px', lineHeight: '1.6' }}>
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => setSelectedDetailsItem(item)}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    View details
                  </button>
                </div>

                {/* Right side of service item card: Image & Add Button */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '110px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '110px', height: '90px', borderRadius: '12px', objectFit: 'cover' }} />
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      width: '100%',
                      padding: '8px 0',
                      borderRadius: '8px',
                      border: '1.5px solid #4f46e5',
                      background: isItemInCart(item.id) ? '#4f46e5' : '#ffffff',
                      color: isItemInCart(item.id) ? '#ffffff' : '#4f46e5',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isItemInCart(item.id) ? 'Added ✓' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Video Banner Card (e.g. for Post Workout) */}
          {activeCategory.videoBanner && (
            <div className="post-workout-video-card" style={{ marginTop: '24px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <video
                controls
                poster={activeCategory.videoBanner.poster}
                style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block', borderRadius: '16px' }}
              >
                <source src={activeCategory.videoBanner.videoUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR - UC Promise & Cart Bar */}
        <aside className="makeup-right-sidebar">
          {/* UC Promise Card */}
          <div className="uc-promise-card" style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>UC Promise</h3>
              <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                Quality Assured
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#059669" />
                <span>4.5+ Rated Therapists</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#059669" />
                <span>Relaxation Assured</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#059669" />
                <span>Specialized Premium Oils</span>
              </div>
            </div>
          </div>

          {/* Cart View Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#ffffff',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)'
          }}
          onClick={() => router.push('/cart')}
          >
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', display: 'block' }}>₹{cartTotal}</span>
              <span style={{ fontSize: '11px', opacity: 0.85 }}>Total Cart Value</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '15px' }}>
              View Cart <ChevronRight size={18} />
            </div>
          </div>
        </aside>

      </main>

      {/* Details Modal Popup if clicked */}
      {selectedDetailsItem && (
        <div className="service-overlay" onClick={() => setSelectedDetailsItem(null)}>
          <div className="service-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '20px', padding: '24px' }}>
            <button className="close-btn" onClick={() => setSelectedDetailsItem(null)}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <img src={selectedDetailsItem.image} alt={selectedDetailsItem.name} style={{ width: '100%', height: '180px', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0' }}>{selectedDetailsItem.name}</h2>
              <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 12px 0' }}>⭐ {selectedDetailsItem.rating}{selectedDetailsItem.duration ? ` • ${selectedDetailsItem.duration}` : ''}</p>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#4f46e5', marginBottom: '16px' }}>₹{selectedDetailsItem.price}</div>
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
              style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
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
