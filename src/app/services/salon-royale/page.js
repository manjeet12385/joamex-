'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, ChevronRight } from 'lucide-react';
import '../bridal-makeup/style.css'; // Reusing layout styles

const servicesData = [
  {
    id: 'packages',
    title: 'Packages',
    items: [
      {
        id: 'grooming-essentials',
        name: 'Grooming essentials',
        rating: '4.89',
        reviews: '248K',
        price: 758,
        duration: '1 hr 15 mins',
        bullets: [
          'Haircut: Haircut for men',
          'Shave/beard grooming: Beard trimming & styling'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80',
        editable: true,
        isPackage: true
      },
      {
        id: 'complete-care',
        name: 'Complete care',
        rating: '4.90',
        reviews: '207K',
        price: 1158,
        duration: '1 hr 15 mins',
        bullets: [
          'Haircut: Haircut for men',
          'Face care: Face scrub & massage'
        ],
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80',
        editable: true,
        isPackage: true
      },
      {
        id: 'glow-getter',
        name: 'Glow getter',
        rating: '4.89',
        reviews: '209K',
        price: 2798,
        originalPrice: 3050,
        duration: '2 hrs 15 mins',
        bullets: [
          'Face care: Repechage skin brightening facial',
          'Shave/beard grooming: Beard trimming & styling',
          'Haircut: Haircut for men'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80',
        editable: true,
        isPackage: true
      },
      {
        id: 'haircut-and-color',
        name: 'Haircut & color',
        rating: '4.89',
        reviews: '149K',
        price: 1108,
        originalPrice: 1200,
        duration: '1 hr 15 mins',
        bullets: [
          'Haircut: Haircut for men',
          "Inoa colors (L'Oreal): Dark brown (shade 3)"
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80',
        editable: true,
        isPackage: true
      },
      {
        id: 'hair-and-care',
        name: 'Hair & care',
        rating: '4.89',
        reviews: '189K',
        price: 1977,
        originalPrice: 2027,
        duration: '2 hrs 15 mins',
        bullets: [
          'Haircut: Haircut for men',
          'Massage: 15 mins head massage',
          'Pedicure: Aroma bomb pedicure'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80',
        editable: true,
        isPackage: true
      }
    ]
  },
  {
    id: 'pedicure',
    title: 'Pedicure',
    icon: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'aroma-bomb-pedicure',
        name: 'Aroma bomb pedicure',
        rating: '4.82',
        reviews: '13K',
        price: 1299,
        originalPrice: 1349,
        duration: '1 hr 15 mins',
        bullets: [
          'Revitalise your feet with a soothing aroma bomb pedicure for fresh, soft soles'
        ],
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'express-pedicure',
        name: 'Express pedicure',
        rating: '4.85',
        reviews: '248',
        price: 900,
        duration: '40 mins',
        bullets: [
          'Foot care using natural ingredients to leave your feet soft, smooth & refreshed',
          'Gentle exfoliation & a relaxing massage for deep hydration'
        ],
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'nail-cut-and-file-feet',
        name: 'Nail cut & file (feet)',
        rating: '4.85',
        reviews: '2K',
        price: 120,
        duration: '10 mins',
        bullets: [
          'Quick & basic nail grooming of your feet'
        ],
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'nail-cut-and-file-hands',
        name: 'Nail cut & file (hands)',
        rating: '4.84',
        reviews: '2K',
        price: 100,
        duration: '10 mins',
        bullets: [
          'Quick & basic nail grooming of your hands'
        ],
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hair-care',
    title: 'Hair care',
    icon: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'haircut-for-men',
        name: 'Haircut for men',
        rating: '4.90',
        reviews: '131K',
        price: 459,
        duration: '45 mins',
        bullets: [
          'Bespoke haircut with hairspray, blow dry & a dry head massage'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'haircut-for-boys',
        name: 'Haircut for boys',
        rating: '4.89',
        reviews: '20K',
        price: 459,
        duration: '45 mins',
        bullets: [
          'Specially trained stylists for boys aged 2 years & above'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'face-care',
    title: 'Face care',
    icon: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'beardo-golden-glow-facial',
        name: 'Beardo golden glow facial',
        rating: '4.81',
        reviews: '3K',
        price: 1599,
        duration: '1 hr 5 mins',
        bullets: [
          'Instant glow & boosted collagen, leaving skin bright, supple & hydrated'
        ],
        image: ''
      },
      {
        id: 'o3-skin-brightening-facial',
        name: 'O3+ skin brightening facial',
        rating: '4.79',
        reviews: '9K',
        price: 2000,
        originalPrice: 2100,
        duration: '1 hr 5 mins',
        bullets: [
          'Enhances the skin texture & boosting the glow of the skin for a longer period'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'repechage-skin-brightening-facial',
        name: 'Repechage skin brightening facial',
        rating: '4.81',
        reviews: '6K',
        price: 2000,
        originalPrice: 2100,
        duration: '60 mins',
        bullets: [
          'Power-packed seaweed to improve skin texture & fight ageing'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'o3-face-and-neck-detan',
        name: 'O3+ face & neck detan',
        rating: '4.83',
        reviews: '10K',
        price: 699,
        duration: '30 mins',
        bullets: [
          'Tan removal with reduction of dark spots, blemishes & pigmentation'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'o3-cleanup',
        name: 'O3+ cleanup',
        rating: '4.84',
        reviews: '6K',
        price: 1299,
        duration: '40 mins',
        bullets: [
          'A routine deep cleansing ritual to remove dirt, oil & toxins'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'shave-beard',
    title: 'Shave/beard grooming',
    icon: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'clean-shave',
        name: 'Clean shave',
        rating: '4.88',
        reviews: '14K',
        price: 299,
        duration: '30 mins',
        bullets: [
          'Effortless shave with pre shave oil, face cleansing & a relaxing face massage'
        ],
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'beard-trimming-and-styling',
        name: 'Beard trimming & styling',
        rating: '4.90',
        reviews: '57K',
        price: 299,
        duration: '30 mins',
        bullets: [
          'Bespoke beard styling, pre & post shave conditioning with relaxing face massage'
        ],
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'beard-colour-application',
        name: 'Beard colour (only application)',
        rating: '4.88',
        reviews: '4K',
        price: 199,
        duration: '25 mins',
        bullets: [
          "Please provide your own hair colour, we'll bring everything else."
        ],
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hair-color',
    title: 'Hair color',
    icon: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'hair-colour-application-only',
        name: 'Hair colour (only application)',
        rating: '4.88',
        reviews: '8K',
        price: 349,
        duration: '30 mins',
        bullets: [
          "Please provide your own hair colour, we'll bring everything else."
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'loreal-inoa-hair-colour',
        name: "L'Oreal Inoa hair colour",
        rating: '4.74',
        reviews: '8K',
        price: 749,
        startsAt: true,
        bullets: [],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'massage',
    title: 'Massage',
    icon: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'head-massage',
        name: 'Head massage',
        rating: '4.90',
        reviews: '26K',
        price: 219,
        startsAt: true,
        bullets: [
          'Revitalising ritual to stimulate the scalp & nourish the hair with premium oil'
        ],
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-neck-shoulder-massage',
        name: 'Head, neck & shoulder massage',
        rating: '4.86',
        reviews: '19K',
        price: 449,
        duration: '40 mins',
        bullets: [
          'Head oil massage along with neck and shoulder dry massage',
          'Perfect to maintain upper body health for people who sit & work for longer hours'
        ],
        image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function SalonRoyalePage() {
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
      category: "Salon Royale"
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
    return <img src={section.icon} alt={section.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      <Header />

      <main className="bridal-makeup-container">
        {/* Title / Hero Info */}
        <div className="makeup-details-header">
          <h1>Salon Royale</h1>
          <div className="makeup-header-rating">
            <span className="rating-star">★</span> 4.86 <span className="rating-count">(1.2 M bookings)</span>
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
                      {item.isPackage && (
                        <div className="package-badge-value" style={{ background: '#ecfdf5', color: '#047857', display: 'inline-block', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', borderRadius: '4px', marginBottom: '8px' }}>
                          PACKAGE
                        </div>
                      )}
                      {item.bestSeller && (
                        <div className="package-badge-best">
                          <span>★</span> Bestseller
                        </div>
                      )}
                      <h3 className="package-name">{item.name}</h3>
                      <div className="package-meta">
                        <div className="package-rating">
                          <span className="star-icon">★</span> {item.rating} ({item.reviews} reviews)
                        </div>
                        <div className="package-price-duration">
                          {item.startsAt && <span className="starts-at" style={{ fontSize: '14px', color: '#555', marginRight: '4px' }}>Starts at </span>}
                          ₹{item.price.toLocaleString('en-IN')} 
                          {item.duration && <span className="package-duration"> • {item.duration}</span>}
                        </div>
                      </div>
                      
                      <ul className="package-bullets">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>{bullet}</li>
                        ))}
                      </ul>

                      {item.editable && (
                        <button className="view-details-link" style={{ border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', color: '#475569', marginTop: '8px' }}>
                          Edit your package
                        </button>
                      )}
                    </div>

                    <div className="package-visual-right">
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
                        <button className="add-to-cart-action-btn" onClick={() => handleAdd(item)}>
                          Add
                        </button>
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

          {/* Cart Status Box */}
          {localCartItems.length === 0 ? (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <div style={{ marginBottom: '12px', color: '#94a3b8' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>No items in your cart</span>
            </div>
          ) : (
            <div style={{ marginTop: '16px' }}>
              <button className="checkout-cart-summary-premium" onClick={() => router.push('/cart')}>
                <span className="premium-cart-left">₹{localCartTotal.toLocaleString('en-IN')}</span>
                <span className="premium-cart-right">
                  View Cart <ChevronRight size={16} />
                </span>
              </button>
            </div>
          )}
        </aside>
      </main>

      {/* Floating Bottom Cart Bar for Mobile/Tablet Viewports */}
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
