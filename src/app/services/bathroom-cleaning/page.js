'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'weekly-plans',
    title: 'Weekly plans: Best value',
    icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop&q=80',
    isCustomSvgIcon: 'calendar',
    hasBanner: true,
    banner: {
      tag: 'Subscription',
      title: 'Weekly bathroom cleaning',
      oldPrice: '₹550',
      dealPrice: '₹215/service',
      subtitle: 'Flexible weekly cleaning',
      note: 'Skip, reschedule, pause or cancel when needed',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&q=80'
    },
    items: [
      {
        id: 'weekly-bathroom-cleaning-subscription',
        name: 'Weekly bathroom cleaning subscription',
        rating: '4.75',
        reviews: '765K',
        price: 215,
        originalPrice: 550,
        startsAt: true,
        discountBadge: '50% OFF',
        duration: '30 mins',
        bullets: [
          'Best for regular upkeep between deep cleans',
          'Preferred professional hand scrubs the same bathroom every visit'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'value-deals',
    title: 'Value deals',
    icon: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=100&h=100&fit=crop&q=80',
    isCustomSvgIcon: 'combo',
    items: [
      {
        id: 'intense-cleaning-2-bathrooms',
        name: 'Intense cleaning (2 bathrooms)',
        rating: '4.80',
        reviews: '6.4M',
        price: 1018,
        originalPrice: 1098,
        duration: '2 hrs',
        perUnitText: '₹509 per bathroom',
        imageBadge: '2 BATHROOMS',
        bullets: ['Floor & tile cleaning with a scrub machine'],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'intense-cleaning-3-bathrooms',
        name: 'Intense cleaning (3 bathrooms)',
        rating: '4.80',
        reviews: '6.4M',
        price: 1497,
        originalPrice: 1647,
        duration: '3 hrs',
        perUnitText: '₹499 per bathroom',
        imageBadge: '3 BATHROOMS',
        bullets: ['Floor & tile cleaning with a scrub machine'],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'bathroom-ceiling-fan-cleaning-pack-2',
        name: 'Bathroom & ceiling fan cleaning (pack of 2)',
        rating: '4.80',
        reviews: '6.4M',
        price: 1216,
        originalPrice: 1296,
        duration: '2 hrs 20 mins',
        bullets: ['Includes 2 intense bathroom & 2 ceiling fans cleaning'],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'one-time-service',
    title: 'One time service',
    icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop&q=80',
    isCustomSvgIcon: 'toilet',
    items: [
      {
        id: 'intense-bathroom-cleaning',
        name: 'Intense bathroom cleaning',
        bestseller: true,
        rating: '4.80',
        reviews: '6.7M',
        price: 549,
        startsAt: true,
        duration: '60 mins',
        bullets: [
          'Floor & tile cleaning with scrubbing machine',
          'Recommended for deep-cleaning and tough stains'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'move-in-bathroom-cleaning',
        name: 'Move-in bathroom cleaning',
        rating: '4.82',
        reviews: '1.5M',
        price: 629,
        startsAt: true,
        duration: '1 hr 30 mins',
        imageBadge: 'Extra 30 mins',
        bullets: [
          'Extra 30 mins of machine scrubbing of floor and tiles',
          'Recommended before moving into a new or unused bathroom'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mini-services',
    title: 'Mini services',
    icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&h=100&fit=crop&q=80',
    isCustomSvgIcon: 'sink',
    items: [
      {
        id: 'bathroom-exhaust-fan-cleaning-additional',
        name: 'Bathroom exhaust fan cleaning (additional)',
        rating: '4.79',
        reviews: '111K',
        price: 89,
        duration: '15 mins',
        bullets: [
          'Additional, one fan is already covered in bathroom service'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'drain-cleaning',
        name: 'Drain Cleaning',
        price: 59,
        startsAt: true,
        optionsText: '5 options',
        bullets: [
          'Clears buildup inside floor drains for free-flowing water and no odour',
          'Not covered in bathroom service'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'washbasin-cleaning-additional',
        name: 'Washbasin cleaning (additional)',
        rating: '4.83',
        reviews: '323K',
        price: 89,
        duration: '10 mins',
        bullets: [
          'Additional, one washbasin is already covered in bathroom service'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'door-cleaning-additional',
        name: 'Door cleaning (additional)',
        rating: '4.78',
        reviews: '39K',
        price: 89,
        duration: '10 mins',
        bullets: [
          'Additional, bathroom door is covered in bathroom service'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'mirror-cleaning-additional',
        name: 'Mirror cleaning (additional)',
        rating: '4.83',
        reviews: '46K',
        price: 59,
        duration: '10 mins',
        bullets: [
          'Additional, one mirror is already covered in bathroom service'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function BathroomCleaningPage() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeSection, setActiveSection] = useState('weekly-plans');

  useEffect(() => {
    const handleScroll = () => {
      const sections = servicesData.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(servicesData[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "Bathroom Cleaning"
    });
    toast.success(`${item.name} added to cart!`);
  };

  const localCartItems = cart.filter(cartItem => 
    servicesData.some(section => section.items.some(item => item.id === cartItem.id))
  );

  const localCartTotal = localCartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const renderSidebarIcon = (section) => {
    if (section.isCustomSvgIcon === 'calendar') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', padding: '4px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="3" fill="#f8fafc" stroke="#dc2626" strokeWidth="2" />
            <path d="M3 9H21" stroke="#dc2626" strokeWidth="2" />
            <circle cx="16" cy="15" r="4" fill="#16a34a" />
            <path d="M14.5 15L15.5 16L17.5 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'combo') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#ecfdf5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <span style={{ fontSize: '9px', fontWeight: '900', color: '#047857', letterSpacing: '-0.3px', lineHeight: 1.1 }}>COMBO</span>
          <span style={{ fontSize: '9px', fontWeight: '900', color: '#047857', letterSpacing: '-0.3px', lineHeight: 1.1 }}>DEALS</span>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'toilet') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 12h10v3a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5v-3z"/>
            <path d="M6 5h12v7H6z"/>
            <path d="M10 2h4"/>
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'sink') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10c0 4.4 3.6 8 8 8s8-3.6 8-8H4z"/>
            <path d="M12 18v3"/>
            <path d="M8 21h8"/>
            <path d="M12 4v3"/>
          </svg>
        </div>
      );
    }
    return <img src={section.icon} alt={section.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      <div className="bridal-makeup-container">
        
        {/* LEFT SIDEBAR - Select a Service */}
        <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
          <div className="select-service-card">
            <div className="sidebar-title">Select a service</div>
            <div className="sidebar-grid">
              {servicesData.map((section) => (
                <button
                  key={section.id}
                  className={`sidebar-grid-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => scrollToCategory(section.id)}
                >
                  <div className="grid-icon-wrapper">
                    {renderSidebarIcon(section)}
                  </div>
                  <span className="sidebar-grid-item-text">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER CONTENT - Services & Banners */}
        <main className="makeup-center-content">
          {servicesData.map((section) => (
            <section key={section.id} id={section.id} className="service-section-container">
              <h2 className="section-anchor-title">{section.title}</h2>

              {/* Promotional Subscription Banner */}
              {section.hasBanner && section.banner && (
                <div className="subscription-banner-card">
                  <div className="subscription-banner-left">
                    <span className="subscription-tag-badge">{section.banner.tag}</span>
                    <h3 className="subscription-title">{section.banner.title}</h3>
                    <div className="subscription-price-row">
                      <span className="subscription-old-price">{section.banner.oldPrice}</span>
                      <span className="subscription-deal-price">{section.banner.dealPrice}</span>
                    </div>
                    <p className="subscription-meta-text">{section.banner.subtitle}</p>
                    <p className="subscription-note-text">{section.banner.note}</p>
                  </div>
                  <div className="subscription-banner-right">
                    <img src={section.banner.image} alt={section.banner.title} />
                  </div>
                </div>
              )}
              
              {section.items.map((item) => {
                const cartItem = cart.find(c => c.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <div key={item.id} className="package-card">
                    <div className="package-details-left">
                      {item.bestseller && (
                        <div className="package-badge-value" style={{ background: '#ecfdf5', color: '#047857' }}>
                          BESTSELLER
                        </div>
                      )}
                      {item.discountBadge && (
                        <div className="package-badge-value">
                          {item.discountBadge}
                        </div>
                      )}
                      <h3 className="package-name">{item.name}</h3>
                      <div className="package-meta">
                        {item.rating && (
                          <div className="package-rating">
                            <span className="star-icon">★</span> {item.rating} ({item.reviews} reviews)
                          </div>
                        )}
                        <div className="package-price-duration">
                          {item.startsAt ? 'Starts at ' : ''}₹{item.price.toLocaleString('en-IN')} 
                          {item.originalPrice && (
                            <span className="original-price" style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px', fontSize: '13px' }}>
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {item.duration && <span className="package-duration">• {item.duration}</span>}
                        </div>
                        {item.perUnitText && (
                          <div style={{ color: '#047857', fontSize: '12.5px', fontWeight: '700', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            🏷️ {item.perUnitText}
                          </div>
                        )}
                      </div>

                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="package-bullets">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="package-visual-right">
                      <div className="package-image-container">
                        {item.imageBadge && (
                          <div className="package-image-overlay-badge">{item.imageBadge}</div>
                        )}
                        <img src={item.image} alt={item.name} className="package-image" />
                      </div>
                      
                      {quantity > 0 ? (
                        <div className="quantity-adjuster-btn">
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, quantity - 1)}>-</button>
                          <span className="qty-display">{quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, quantity + 1)}>+</button>
                        </div>
                      ) : (
                        <button className="add-to-cart-action-btn" onClick={() => handleAddToCart(item)}>
                          Add
                        </button>
                      )}
                      {item.optionsText && (
                        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '16px', display: 'block', textAlign: 'center' }}>
                          {item.optionsText}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </main>

        {/* RIGHT SIDEBAR - UC Promise & Cart Checkout */}
        <aside className="makeup-right-sidebar">
          <div className="promise-card">
            <div className="promise-card-header-row">
              <h3>UC Promise</h3>
              <div className="quality-assured-badge">
                <span className="quality-badge-text-top">QUALITY</span>
                <span className="quality-badge-text-center">ASSURED</span>
              </div>
            </div>
            <div className="promise-list">
              <div className="promise-item">
                <span className="promise-check-icon">✓</span>
                <span className="promise-item-text">Verified Professionals</span>
              </div>
              <div className="promise-item">
                <span className="promise-check-icon">✓</span>
                <span className="promise-item-text">Hassle Free Booking</span>
              </div>
              <div className="promise-item">
                <span className="promise-check-icon">✓</span>
                <span className="promise-item-text">Transparent Pricing</span>
              </div>
            </div>
          </div>

          {localCartItems.length > 0 && (
            <button className="checkout-cart-summary-premium" onClick={() => router.push('/cart')}>
              <div className="premium-cart-left">
                ₹{localCartTotal.toLocaleString('en-IN')}
              </div>
              <div className="premium-cart-right">
                <span>View Cart</span>
                <span>→</span>
              </div>
            </button>
          )}
        </aside>

      </div>

      {/* MOBILE FLOATING CART BAR */}
      <div 
        className={`mobile-floating-cart-bar ${localCartItems.length > 0 ? 'visible' : ''}`}
        onClick={() => router.push('/cart')}
      >
        <div className="mobile-cart-left">
          <span className="mobile-cart-total">₹{localCartTotal.toLocaleString('en-IN')}</span>
          <span className="mobile-cart-count">{localCartItems.reduce((acc, c) => acc + c.quantity, 0)} items in cart</span>
        </div>
        <div className="mobile-cart-right">
          <span>View Cart</span>
          <span>→</span>
        </div>
      </div>

    </div>
  );
}
