'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'value-packs',
    title: 'Value packs',
    isCustomSvgIcon: 'combo',
    items: [
      {
        id: 'regular-chimney-stove-cleaning',
        name: 'Regular chimney & stove cleaning',
        rating: '4.88',
        reviews: '33',
        price: 548,
        startsAt: true,
        duration: '1 hr 25 mins',
        bullets: [
          'Stovetops, burners, mesh & filter cleaning with steam',
          'Excludes motor cleaning, repair & automatic chimney cleaning'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'deep-chimney-stove-service',
        name: 'Deep chimney & stove service',
        price: 1498,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Dismantling for internal servicing of motor, blowers & filters.',
          'Interior & exterior surface degreasing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'fan-window-cleaning',
        name: 'Fan & window cleaning',
        rating: '4.82',
        reviews: '388',
        price: 499,
        originalPrice: 577,
        duration: '60 mins',
        bullets: [
          'Deep cleaning of kitchen ceiling fan, exhaust fan & windows',
          'Stain removal using professional chemicals'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'cabinets-tiles-sink-cleaning',
        name: 'Cabinets, tiles & sink cleaning',
        rating: '4.83',
        reviews: '913K',
        price: 649,
        startsAt: true,
        duration: '1 hr 45 mins',
        bullets: [
          'Deep cleaning of kitchen cabinets/trolleys, tiles, slab & sink',
          'Cleaning of surfaces, remove oil & grease with steam machine'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'chimney-cleaning',
    title: 'Chimney cleaning',
    isCustomSvgIcon: 'chimney',
    items: [
      {
        id: 'regular-chimney-cleaning',
        name: 'Regular chimney cleaning',
        bestseller: true,
        rating: '4.88',
        reviews: '137',
        price: 399,
        startsAt: true,
        duration: '45 mins',
        bullets: [
          'Chimney exterior, mesh & filter cleaning with a steam machine',
          'Excludes motor cleaning, repair & automatic chimney cleaning'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'deep-chimney-service',
        name: 'Deep chimney service',
        rating: '4.98',
        reviews: '68',
        price: 1249,
        startsAt: true,
        duration: '1 hr 45 mins',
        bullets: [
          'Dismantling for internal servicing of motor, blowers & filters',
          'Interior & exterior surface degreasing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'complete-kitchen-cleaning',
    title: 'Complete kitchen cleaning',
    isCustomSvgIcon: 'kitchen',
    items: [
      {
        id: 'complete-kitchen-cleaning-item',
        name: 'Complete kitchen cleaning',
        rating: '4.76',
        reviews: '387K',
        price: 999,
        startsAt: true,
        duration: '2 hrs 30 mins',
        bullets: [
          'Cleaning of objects & surfaces with steam machine'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'appliance-cleaning',
    title: 'Appliance cleaning',
    isCustomSvgIcon: 'appliance',
    items: [
      {
        id: 'fridge-cleaning',
        name: 'Fridge cleaning',
        rating: '4.83',
        reviews: '160K',
        price: 399,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Deep cleaning of fridge exterior with steam machine',
          'Wet wiping of interior to remove food spills, stains & odour'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'microwave-cleaning',
        name: 'Microwave cleaning',
        rating: '4.82',
        reviews: '34K',
        price: 199,
        duration: '15 mins',
        bullets: [
          'Deep cleaning of microwave exterior to remove grease & oil',
          'Wet wiping of interior to remove burnt stains & odour'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'gas-stove-cleaning',
        name: 'Gas stove cleaning',
        rating: '4.80',
        reviews: '58K',
        price: 99,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Stovetops, burners & knobs cleaning with steam machine',
          'Wet wiping of interior to remove burnt stains & odour'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'appliance-cleaning-package',
        name: 'Appliance cleaning package',
        rating: '4.78',
        reviews: '9K',
        price: 1096,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Includes cleaning of chimney, fridge, gas stove & microwave'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'air-fryer-cleaning',
        name: 'Air fryer cleaning',
        rating: '4.81',
        reviews: '7K',
        price: 199,
        duration: '30 mins',
        bullets: [
          'Wet wiping of interior to remove oil stains & odour',
          'Cleaning of tray to remove food spills'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'otg-cleaning',
        name: 'OTG cleaning',
        rating: '4.80',
        reviews: '7K',
        price: 399,
        duration: '50 mins',
        bullets: [
          'Cleaning of interior to remove food crumbs & spills',
          'Exterior & back panel cleaning to remove oil & grease'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'sandwich-maker-griller-cleaning',
        name: 'Sandwich Maker/Griller cleaning',
        rating: '4.82',
        reviews: '5K',
        price: 99,
        duration: '15 mins',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'cabinets-tiles',
    title: 'Cabinets & tiles',
    isCustomSvgIcon: 'cabinets',
    items: [
      {
        id: 'tiles-slabs-cleaning',
        name: 'Tiles & slabs cleaning',
        rating: '4.78',
        reviews: '77K',
        price: 299,
        duration: '45 mins',
        bullets: [
          'Remove grease and oil stains using steam machine',
          'Tile grout cleaning using brush'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'cabinets-trolleys-cleaning',
        name: 'Cabinets/Trolleys cleaning',
        rating: '4.79',
        reviews: '75K',
        price: 299,
        startsAt: true,
        optionsText: '2 options',
        bullets: [
          'Remove, dirt, oil, and grease with steam machine',
          'Wiping on the exterior for a spotless, grease-free finish'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mini-services',
    title: 'Mini services',
    isCustomSvgIcon: 'fan',
    items: [
      {
        id: 'ceiling-fan-cleaning',
        name: 'Ceiling fan cleaning',
        rating: '4.86',
        reviews: '589K',
        price: 89,
        duration: '15 mins',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'exhaust-fan-cleaning',
        name: 'Exhaust fan cleaning',
        rating: '4.81',
        reviews: '106K',
        price: 99,
        duration: '20 mins',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'sink-under-sink-cleaning',
        name: 'Sink & under the sink',
        rating: '4.79',
        reviews: '75K',
        price: 129,
        duration: '20 mins',
        bullets: [
          'Includes cleaning of the sink, taps, and under sink area'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'kitchen-window-cleaning',
        name: 'Kitchen window cleaning',
        rating: '4.78',
        reviews: '68K',
        price: 399,
        duration: '30 mins',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function KitchenCleaningPage() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeSection, setActiveSection] = useState('value-packs');

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
      category: "Kitchen Cleaning"
    });
    toast.success(`${item.name} added to cart!`);
  };

  const localCartItems = cart.filter(cartItem => 
    servicesData.some(section => section.items.some(item => item.id === cartItem.id))
  );

  const localCartTotal = localCartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const renderSidebarIcon = (section) => {
    if (section.isCustomSvgIcon === 'combo') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#ecfdf5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <span style={{ fontSize: '9px', fontWeight: '900', color: '#047857', letterSpacing: '-0.3px', lineHeight: 1.1 }}>COMBO</span>
          <span style={{ fontSize: '9px', fontWeight: '900', color: '#047857', letterSpacing: '-0.3px', lineHeight: 1.1 }}>DEALS</span>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'chimney') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 21V9l6-4 6 4v12H6z"/>
            <path d="M6 13h12"/>
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'kitchen') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 11h18"/>
            <path d="M10 11v10"/>
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'appliance') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="5" y1="10" x2="19" y2="10"/>
            <line x1="9" y1="6" x2="9" y2="8"/>
            <line x1="9" y1="14" x2="9" y2="17"/>
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'cabinets') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M12 4v16"/>
          </svg>
        </div>
      );
    }
    if (section.isCustomSvgIcon === 'fan') {
      return (
        <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path d="M12 12c-3.5 0-6 2.5-6 6h12c0-3.5-2.5-6-6-6z"/>
          </svg>
        </div>
      );
    }
    return null;
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

        {/* CENTER CONTENT - Services */}
        <main className="makeup-center-content">
          {servicesData.map((section) => (
            <section key={section.id} id={section.id} className="service-section-container">
              <h2 className="section-anchor-title">{section.title}</h2>
              
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
