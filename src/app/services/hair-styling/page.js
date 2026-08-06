'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, ChevronRight } from 'lucide-react';
import './style.css';

// Custom data matching Urban Company Hair Studio for Women screenshot
const servicesData = [
  {
    id: 'packages',
    title: 'Packages',
    items: [
      {
        id: 'cut-trim-spa-style',
        name: 'Cut, trim, spa & style',
        rating: '4.81',
        reviews: '359K',
        price: 1698,
        originalPrice: 1848,
        duration: '1 hr 45 mins',
        discount: '10% OFF',
        valueSaver: true,
        bulletsKV: [
          { label: 'Haircut or trim:', value: 'Haircut' },
          { label: 'Hair spa:', value: 'Ayurvedic strengthening spa' }
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80',
        editable: true
      },
      {
        id: 'cut-trim-style',
        name: 'Cut, trim & style',
        rating: '4.82',
        reviews: '298K',
        price: 998,
        originalPrice: 1090,
        duration: '1 hr 30 mins',
        discount: '10% OFF',
        valueSaver: true,
        bulletsKV: [
          { label: 'Haircut or trim:', value: 'Haircut' },
          { label: 'Hair styling:', value: 'Straightening' }
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        editable: true
      },
      {
        id: 'cut-trim-spa-style-colour',
        name: 'Cut, trim, spa, style, colour (roots touch up)',
        rating: '4.81',
        reviews: '387K',
        price: 2172,
        originalPrice: 2397,
        duration: '2 hrs 30 mins',
        discount: '15% OFF',
        valueSaver: true,
        bulletsKV: [
          { label: 'Haircut or trim:', value: 'Haircut' },
          { label: 'Hair spa:', value: "L'Oreal hair spa" },
          { label: 'Hair styling:', value: 'Straightening / Curling' }
        ],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80',
        editable: true
      },
      {
        id: 'haircut-botox-keratin',
        name: 'Haircut & botox/keratin',
        rating: '4.81',
        reviews: '174K',
        price: 5248,
        originalPrice: 6548,
        duration: '3 hrs 45 mins',
        valueSaver: true,
        bulletsKV: [
          { label: 'Keratin:', value: 'Long-length' },
          { label: 'Haircut or trim:', value: 'Haircut' }
        ],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        editable: true
      },
      {
        id: 'haircut-color',
        name: 'Haircut & color',
        rating: '4.80',
        reviews: '162K',
        price: 2697,
        originalPrice: 2867,
        duration: '1 hr 45 mins',
        discount: '15% OFF',
        valueSaver: true,
        bulletsKV: [
          { label: 'Roots:', value: "Color (L'Oréal Inoa): Shade 2: Darkest Brown" },
          { label: 'Roots:', value: "Color (L'Oréal Majirel): Shade 3: Dark Brown" },
          { label: 'Haircut or trim:', value: 'Haircut' }
        ],
        image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&h=300&fit=crop&q=80',
        editable: true
      }
    ]
  },
  {
    id: 'blow-dry-style',
    title: 'Blow-dry & style',
    icon: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'blow-dry-classic',
        name: 'Blow Dry',
        rating: '4.82',
        reviews: '126K',
        price: 449,
        startsAt: true,
        bullets: [
          'Beautiful curls, styled in or out, with a perfect blow-dry finish',
          'Sleek, smooth & straight hair with a professional blow-dry'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        optionsText: '2 options'
      },
      {
        id: 'advanced-styling',
        name: 'Advanced Styling',
        rating: '4.66',
        reviews: '1K',
        price: 1000,
        startsAt: true,
        duration: '60 mins',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'hair-straightening',
        name: 'Hair straightening',
        rating: '4.86',
        reviews: '18K',
        price: 549,
        duration: '45 mins',
        bullets: [
          'Transform your hair into a sleek, straight look with long-lasting finish'
        ],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'curls-and-waves',
        name: 'Curls & waves',
        rating: '4.74',
        reviews: '15K',
        price: 549,
        duration: '60 mins',
        bullets: [
          'Soft curls or waves for a natural, voluminous hairstyle'
        ],
        image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'cut-trim',
    title: 'Cut & trim',
    icon: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'haircut-expert',
        name: 'Haircut',
        bestseller: true,
        rating: '4.81',
        reviews: '246K',
        price: 649,
        startsAt: true,
        duration: '45 mins',
        bullets: ['Expert haircut tailored to your style. Blow-dry not included'],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'hair-trim',
        name: 'Hair trim',
        rating: '4.81',
        reviews: '141K',
        price: 449,
        startsAt: true,
        duration: '20 mins',
        bullets: ['Split-end removal with minimal length reduction. Blow-dry not included'],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hair-care',
    title: 'Hair care',
    icon: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'hair-spa-steam',
        name: 'Hair Spa',
        bestseller: true,
        rating: '4.79',
        reviews: '31K',
        price: 1299,
        startsAt: true,
        bullets: ['Steam therapy to deeply nourish hair from scalp to ends, restoring shine & softness'],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80',
        optionsText: '4 options'
      },
      {
        id: 'loreal-hair-repair-mask',
        name: "L'Oréal hair repair mask",
        rating: '4.77',
        reviews: '3K',
        price: 649,
        duration: '40 mins',
        bullets: ["Intensive repair mask therapy to strengthen & restore hair"],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-massage',
        name: 'Head massage',
        rating: '4.79',
        reviews: '5K',
        price: 349,
        duration: '20 mins',
        bullets: [
          'Gentle massage to help promote blood flow, reduce stress & tension',
          'Hair wash & blow dry not included'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'keratin-botox',
    title: 'Keratin & botox',
    icon: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'hair-keratin-smoothing',
        name: 'Hair keratin',
        rating: '4.60',
        reviews: '2K',
        price: 3999,
        startsAt: true,
        bullets: ['Keratin treatment smoothens hair for a shiny, frizz-free look'],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        optionsText: '2 options'
      },
      {
        id: 'hair-botox-treatment',
        name: 'Hair botox',
        bestseller: true,
        rating: '4.56',
        reviews: '3K',
        price: 5499,
        duration: '3 hrs',
        bullets: ['Single-session treatment to repair damaged, frizzy hair & promote hair health'],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hair-colour',
    title: 'Hair colour',
    icon: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'hair-colour-application-only',
        name: 'Hair colour (application only)',
        rating: '4.80',
        reviews: '50K',
        price: 399,
        startsAt: true,
        bullets: ['Even application of the chosen shade from root to tip'],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80',
        optionsText: '2 options'
      },
      {
        id: 'loreal-root-touch-up',
        name: "L'Oréal root touch up",
        rating: '4.72',
        reviews: '29K',
        price: 999,
        startsAt: true,
        duration: '30 mins',
        bullets: ["Gentle, long-lasting root touch-up with L'Oréal Inoa and Majirel"],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'loreal-global-color',
        name: "L'Oréal Global color",
        rating: '4.65',
        reviews: '6K',
        price: 2399,
        startsAt: true,
        duration: '60 mins',
        bullets: ['Even application of the chosen shade from root to tip'],
        image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'loreal-global-fashion-hair-colour',
        name: "L'Oréal Global fashion hair colour",
        rating: '4.57',
        reviews: '1K',
        price: 2599,
        startsAt: true,
        duration: '2 hrs',
        bullets: ['Vibrant fashion shade global colour with L\'Oréal professional range'],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'fashion-color',
    title: 'Fashion color',
    icon: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'loreal-hair-highlights',
        name: 'Loreal Hair Highlights',
        rating: '4.60',
        reviews: '932',
        price: 3499,
        startsAt: true,
        bullets: [
          'Precise application of chosen shade on closely spaced sections',
          'Blow-dry & hair wash is not included'
        ],
        image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&h=300&fit=crop&q=80',
        optionsText: '4 options'
      },
      {
        id: 'loreal-balayage-ombre-color',
        name: "L'Oréal balayage/ombre color",
        rating: '4.55',
        reviews: '1K',
        price: 3899,
        startsAt: true,
        bullets: [
          'Seamless application of the chosen shade with a soft color gradient',
          'Blow-dry & hair wash is not included'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        optionsText: '4 options'
      }
    ]
  },
  {
    id: 'hair-extensions',
    title: 'Hair extensions',
    icon: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'scalp-toppers-extensions',
        name: 'Scalp toppers',
        price: 6499,
        startsAt: true,
        duration: '60 mins',
        bullets: [
          'Conceals thinning & bald patches on your scalp',
          '100% human hair & silk base toppers by Hair Originals'
        ],
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function HairStylingPage() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const [activeSection, setActiveSection] = useState('packages');

  const handleScrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    servicesData.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleAdd = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "Hair Studio for Women"
    });
    toast.success(`${item.name} added to cart!`);
  };

  const localCartItems = cart.filter(cartItem => 
    servicesData.some(section => section.items.some(item => item.id === cartItem.id))
  );

  const localCartTotal = localCartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const renderSidebarIcon = (section) => {
    if (section.id === 'packages') {
      return (
        <div className="packages-custom-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="3" fill="#ffffff" />
            <path d="M14 4V12L11.5 10.5L9 12V4" fill="#0ea5e9" />
          </svg>
        </div>
      );
    }
    return <img src={section.icon} alt={section.title} />;
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      <Header />

      <main className="bridal-makeup-container">
        {/* Title / Hero Info */}
        <div className="makeup-details-header">
          <h1>Hair Studio for Women</h1>
          <div className="makeup-header-rating">
            <span className="rating-star">★</span> 4.81 <span className="rating-count">(359K bookings)</span>
          </div>
        </div>

        {/* LEFT COLUMN: Sidebar Navigation in Grid Box */}
        <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
          <div className="select-service-card">
            <div className="sidebar-title">Select a service</div>
            <div className="sidebar-grid">
              {servicesData.map((section) => (
                <button
                  key={section.id}
                  className={`sidebar-grid-item ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => handleScrollToSection(section.id)}
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

        {/* CENTER COLUMN: Service Sections */}
        <div className="makeup-center-content">
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
                      {item.valueSaver && (
                        <div className="package-badge-value">
                          VALUE-SAVER
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
                      </div>
                      
                      {item.bulletsKV ? (
                        <div className="package-bullets-kv">
                          {item.bulletsKV.map((kv, idx) => (
                            <div key={idx} className="bullet-kv-row">
                              <span className="bullet-kv-dot"></span>
                              <span className="bullet-kv-label">{kv.label}</span>
                              <span className="bullet-kv-val">{kv.value}</span>
                            </div>
                          ))}
                        </div>
                      ) : item.bullets && item.bullets.length > 0 ? (
                        <ul className="package-bullets">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}

                      {item.editable && (
                        <button className="edit-package-btn">Edit your package</button>
                      )}
                    </div>

                    <div className="package-visual-right">
                      {item.discount && (
                        <div className="package-discount-badge">{item.discount}</div>
                      )}
                      <div className="package-image-container">
                        <img src={item.image} alt={item.name} className="package-image" />
                      </div>
                      
                      {quantity > 0 ? (
                        <div className="quantity-adjuster-btn">
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, quantity - 1)}>-</button>
                          <span className="qty-display">{quantity}</span>
                          <button className="qty-btn" onClick={() => updateQuantity(item.id, quantity + 1)}>+</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', bottom: '-28px' }}>
                          <button className="add-to-cart-action-btn" style={{ position: 'relative', bottom: '0' }} onClick={() => handleAdd(item)}>
                            Add
                          </button>
                          {item.optionsText && (
                            <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                              {item.optionsText}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>

        {/* RIGHT COLUMN: Promise & Checkout Preview Info */}
        <aside className="makeup-right-sidebar">
          <div className="promise-card">
            <div className="promise-card-header-row">
              <h3>UC Promise</h3>
              <div className="quality-assured-badge">
                <span className="quality-badge-text-top">Quality</span>
                <span className="quality-badge-text-center">ASSURED</span>
              </div>
            </div>
            
            <div className="promise-list">
              <div className="promise-item">
                <Check size={14} className="promise-check-icon" />
                <span className="promise-item-text">Verified Professionals</span>
              </div>
              
              <div className="promise-item">
                <Check size={14} className="promise-check-icon" />
                <span className="promise-item-text">Hassle Free Booking</span>
              </div>

              <div className="promise-item">
                <Check size={14} className="promise-check-icon" />
                <span className="promise-item-text">Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* Checkout Preview Card Box */}
          {localCartItems.length > 0 && (
            <button className="checkout-cart-summary-premium" onClick={() => router.push('/cart')}>
              <span className="premium-cart-left">₹{localCartTotal.toLocaleString('en-IN')}</span>
              <span className="premium-cart-right">
                View Cart <ChevronRight size={16} />
              </span>
            </button>
          )}
        </aside>
      </main>

      {/* Floating Bottom Cart Bar for Mobile Viewports */}
      <div 
        className={`mobile-floating-cart-bar ${localCartItems.length > 0 ? 'visible' : ''}`}
        onClick={() => router.push('/cart')}
      >
        <div className="mobile-cart-left">
          <div className="mobile-cart-total">
            ₹{localCartTotal.toLocaleString('en-IN')}
          </div>
          <div className="mobile-cart-count">{localCartItems.length} item{localCartItems.length > 1 ? 's' : ''} added</div>
        </div>
        <div className="mobile-cart-right">
          <span>View Cart</span>
          <ChevronRight size={16} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
