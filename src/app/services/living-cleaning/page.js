'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'super-saver-deals',
    title: 'Super saver deals',
    isCustomSvgIcon: 'discount',
    items: [
      {
        id: '2-visits-fabric-sofa-cleaning',
        name: '2 visits: Fabric sofa cleaning',
        rating: '4.88',
        reviews: '141K',
        price: 638,
        originalPrice: 790,
        startsAt: true,
        greenBadgeText: 'Starts at ₹319/service',
        optionsText: '10 options',
        bullets: [
          'Suitable for houses with toddlers and pets',
          'Avail first visit now and the remaining within 6 months.'
        ],
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80',
        banner: {
          discount: '20% OFF',
          title: '2-visits sofa cleaning pack',
          priceSub: 'Starts at ₹398 ₹319 per visit',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop&q=80'
        }
      },
      {
        id: '3-visits-mattress-cleaning',
        name: '3 visits: Mattress cleaning',
        rating: '4.87',
        reviews: '28K',
        price: 957,
        originalPrice: 1197,
        startsAt: true,
        greenBadgeText: 'Starts at ₹319/service',
        optionsText: '2 options',
        bullets: [
          'Keep the mattress fresh and hygienic with regular cleaning',
          'Avail first visit now and the remaining within 6 months.'
        ],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop&q=80',
        banner: {
          discount: '20% OFF',
          title: '3-visits mattress cleaning pack',
          priceSub: 'Starts at ₹298 ₹239 per visit',
          image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop&q=80'
        }
      }
    ]
  },
  {
    id: 'sofa-carpet',
    title: 'Sofa & carpet',
    isCustomSvgIcon: 'sofa',
    items: [
      {
        id: 'fabric-sofa-cleaning-single',
        name: 'Fabric sofa cleaning',
        rating: '4.88',
        reviews: '174K',
        price: 399,
        startsAt: true,
        duration: '45 mins',
        bullets: [
          'Vacuuming & foam based shampooing for stain removal',
          'Recliner is not included & to be booked separately'
        ],
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'leather-sofa-cleaning-polishing',
        name: 'Leather sofa cleaning & polishing',
        rating: '4.87',
        reviews: '39K',
        price: 399,
        startsAt: true,
        duration: '45 mins',
        bullets: [
          'Recliner is not included & to be booked separately',
          'Leather moisturization to enhance appearance'
        ],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'sofa-cum-bed-cleaning',
        name: 'Sofa cum bed',
        rating: '4.88',
        reviews: '37K',
        price: 399,
        startsAt: true,
        duration: '40 mins',
        bullets: [
          'Vacuuming & foam based shampooing for stain removal',
          'Applying shiner to wooden surface for a fresh look'
        ],
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'carpet-cleaning-single',
        name: 'Carpet cleaning',
        rating: '4.84',
        reviews: '29K',
        price: 399,
        startsAt: true,
        duration: '45 mins',
        bullets: [
          'Vacuuming & foam based shampooing for stain removal',
          '2-3 hrs of dry time under the fan'
        ],
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'living-room-care',
    title: 'Living room care',
    isCustomSvgIcon: 'living',
    items: [
      {
        id: 'living-room-deep-cleaning',
        name: 'Living Room Deep Cleaning',
        rating: '4.82',
        reviews: '42K',
        price: 799,
        startsAt: true,
        duration: '1 hr 30 mins',
        bullets: [
          'Dusting & wiping of TV unit, bookshelves, tables & sofa vacuuming',
          'Floor scrubbing and window glass wiping'
        ],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'bedroom-care',
    title: 'Bedroom care',
    isCustomSvgIcon: 'bedroom',
    items: [
      {
        id: 'bedroom-deep-cleaning',
        name: 'Bedroom Deep Cleaning',
        rating: '4.84',
        reviews: '64K',
        price: 699,
        startsAt: true,
        duration: '1 hr 15 mins',
        bullets: [
          'Cleaning of wardrobes exterior, side tables, bed frame & fan',
          'Floor wet wiping & window glass cleaning'
        ],
        image: 'https://images.unsplash.com/photo-1540518614846-7ede433c5172?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mattress-bed',
    title: 'Mattress & bed',
    isCustomSvgIcon: 'mattress',
    items: [
      {
        id: 'mattress-cleaning-single',
        name: 'Mattress cleaning',
        rating: '4.87',
        reviews: '28K',
        price: 399,
        startsAt: true,
        duration: '25 mins',
        bullets: [
          'Vacuuming & foam based shampooing on both sides',
          'Minimal water usage, mattress ready to use in 1 to 2 hours'
        ],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'bed-cleaning-single',
        name: 'Bed cleaning',
        rating: '4.84',
        reviews: '8K',
        price: 449,
        startsAt: true,
        duration: '40 mins',
        bullets: [
          'Includes mattress, headboard & bedframe cleaning',
          'Vacuuming and foam based shampooing to remove stains'
        ],
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'dining-table-chairs',
    title: 'Dining table & chairs',
    isCustomSvgIcon: 'dining',
    items: [
      {
        id: 'dining-chair-cleaning',
        name: 'Dining Chair Cleaning',
        rating: '4.81',
        reviews: '19K',
        price: 199,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Upholstery shampooing & wood/metal frame polishing'
        ],
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'other-furniture',
    title: 'Other furniture',
    isCustomSvgIcon: 'furniture',
    items: [
      {
        id: 'ottoman-cleaning',
        name: 'Ottoman',
        rating: '4.87',
        reviews: '6K',
        price: 119,
        startsAt: false,
        duration: '15 mins',
        bullets: [
          'Dry & wet vacuuming to remove stains & spillage'
        ],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'showcase-cabinet-cleaning',
        name: 'Showcase/ cabinet',
        rating: '4.79',
        reviews: '4K',
        price: 199,
        startsAt: false,
        duration: '20 mins',
        bullets: [
          'Dry dusting & wet wiping of exterior surface & glass',
          'Includes applying wood shiner to give fresh look'
        ],
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'sofa-center-table-cleaning',
        name: 'Sofa center table',
        rating: '4.81',
        reviews: '5K',
        price: 149,
        startsAt: false,
        duration: '15 mins',
        bullets: [
          'Dusting & wet wiping of glass and wooden surface',
          'Includes applying shiner for a clean look'
        ],
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'study-table-chair-cleaning',
        name: 'Study table & chair',
        rating: '4.87',
        reviews: '3K',
        price: 249,
        startsAt: false,
        duration: '30 mins',
        bullets: [
          'Dry dusting & wet wiping of study table & chairs',
          'Includes applying wood shiner to give fresh look'
        ],
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'recliner-lounge-chair-cleaning',
        name: 'Recliner/ lounge chair',
        rating: '4.87',
        reviews: '5K',
        price: 249,
        startsAt: true,
        optionsText: '3 options',
        bullets: [
          'Dry & wet vacuuming to remove stains & spillage'
        ],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'windows-fan',
    title: 'Windows & fan',
    isCustomSvgIcon: 'window',
    items: [
      {
        id: 'windows-without-grill-cleaning',
        name: 'Windows (without grill) & glass doors cleaning',
        rating: '4.81',
        reviews: '12K',
        price: 449,
        startsAt: true,
        duration: '55 mins',
        bullets: [
          'Removal of smudge, stains and watermarks from glass',
          'Cleaning of window body to eliminate dust & dirt'
        ],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'windows-with-grills-cleaning',
        name: 'Windows (with grills) & glass doors cleaning',
        rating: '4.81',
        reviews: '13K',
        price: 599,
        startsAt: true,
        duration: '1 hr 20 mins',
        bullets: [
          'Deep cleaning of metal grill & window nets for dust & dirt',
          'Removal of smudges, stains & watermarks from glass'
        ],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'mirror-cleaning-single',
        name: 'Mirror cleaning',
        rating: '4.84',
        reviews: '3K',
        price: 49,
        startsAt: false,
        duration: '15 mins',
        bullets: [
          'Cleaning of mirror to remove smudges, stains and watermarks'
        ],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'fan-cleaning-single',
        name: 'Fan cleaning',
        rating: '4.87',
        reviews: '67K',
        price: 89,
        startsAt: false,
        duration: '10 mins',
        bullets: [
          'Cleaning of fan blades to remove surface dust & dirt',
          'Stain removal from fan using professional chemicals'
        ],
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function LivingCleaningPage() {
  const router = RouterHook();
  const { cart = [], addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const [activeCategory, setActiveCategory] = useState(servicesData[0].id);

  function RouterHook() {
    try {
      return useRouter();
    } catch {
      return null;
    }
  }

  // ScrollSpy listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const cat of servicesData) {
        const el = document.getElementById(cat.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getItemQuantity = (itemId) => {
    const found = (cart || []).find((ci) => ci.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleQuantityDecrease = (itemId) => {
    const qty = getItemQuantity(itemId);
    if (qty > 1) {
      updateQuantity(itemId, qty - 1);
    } else {
      removeFromCart(itemId);
    }
  };

  const totalCartCount = (cart || []).reduce((acc, item) => acc + item.quantity, 0);

  const renderSidebarIcon = (cat) => {
    if (cat.isCustomSvgIcon === 'discount') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ecfdf5', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5" fill="#059669"></circle>
            <circle cx="17.5" cy="17.5" r="2.5" fill="#059669"></circle>
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'sofa') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
            <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5" />
            <path d="M4 18v2" />
            <path d="M20 18v2" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'living') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'bedroom') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v3" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'mattress') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M2 12h20" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'dining') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v18" />
            <path d="M5 8h14" />
            <path d="M5 18h14" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'furniture') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="10" rx="2" />
            <path d="M6 18h12" />
            <path d="M8 14v4" />
            <path d="M16 14v4" />
          </svg>
        </div>
      );
    }
    if (cat.isCustomSvgIcon === 'window') {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" />
          </svg>
        </div>
      );
    }
    return <img src={cat.items[0]?.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80'} alt={cat.title} />;
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      {/* Top Header Section */}
      <div className="living-top-header-section">
        <div className="living-header-info">
          <h1 className="living-main-title">Living & Bedroom Cleaning</h1>
          <div className="living-header-meta">
            <div className="living-rating-box">
              <span className="star-icon">★</span>
              <span className="rating-val">4.87</span>
              <span className="bookings-val">(355K bookings)</span>
            </div>
            <div className="earliest-badge">
              <span className="badge-dot">●</span>
              <span className="badge-label">Earliest</span>
              <span className="badge-time">Tue, 4:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bridal-makeup-container">
        {/* Left Sidebar Navigation Column (Sticky Wrapper) */}
        <div className="services-sidebar-sticky-col" style={{ marginTop: '0px', height: '100%' }}>
          <div className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <div className="select-service-card">
              <div className="sidebar-title">Select a service</div>
              <div className="sidebar-grid">
                {servicesData.map((cat) => (
                  <button
                    key={cat.id}
                    className={`sidebar-grid-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(cat.id)}
                  >
                    <div className="grid-icon-wrapper">
                      {renderSidebarIcon(cat)}
                    </div>
                    <span className="sidebar-grid-item-text">{cat.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center Main Content */}
        <div className="makeup-center-content">
          {servicesData.map((cat) => (
            <div key={cat.id} id={cat.id} className="service-section-container">
              <h2 className="section-anchor-title">{cat.title}</h2>

              {cat.items.map((item) => {
                const qty = getItemQuantity(item.id);
                return (
                  <div key={item.id} className="deal-item-wrapper" style={{ marginBottom: '28px' }}>
                    {item.banner && (
                      <div className="super-saver-banner-card">
                        <div className="banner-media-box">
                          <img src={item.banner.image} alt={item.banner.title} className="banner-img" />
                          <div className="banner-discount-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {item.banner.discount}
                          </div>
                          <div className="banner-content-overlay">
                            <h3 className="banner-heading">{item.banner.title}</h3>
                            <div className="banner-price-sub">{item.banner.priceSub}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="package-card">
                    <div className="package-details-left">
                      {item.greenBadgeText && (
                        <div className="package-badge-value">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {item.greenBadgeText}
                        </div>
                      )}
                      <h3 className="package-name">{item.name}</h3>

                      <div className="package-meta">
                        {item.rating && (
                          <div className="package-rating">
                            <span className="star-icon">★</span>
                            <span>{item.rating} ({item.reviews} reviews)</span>
                          </div>
                        )}
                        <div className="package-price-duration">
                          {item.startsAt ? 'Starts at ' : ''}₹{item.price}
                          {item.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: '6px', fontWeight: 500 }}>
                              ₹{item.originalPrice}
                            </span>
                          )}
                          {item.duration ? ` • ${item.duration}` : ''}
                        </div>
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
                        <img src={item.image} alt={item.name} className="package-image" />
                      </div>

                      {qty === 0 ? (
                        <button
                          className="add-to-cart-action-btn"
                          onClick={() => {
                            addToCart(item);
                            toast.success(`${item.name} added to cart!`);
                          }}
                        >
                          Add
                        </button>
                      ) : (
                        <div className="quantity-adjuster-btn">
                          <button
                            className="qty-btn"
                            onClick={() => handleQuantityDecrease(item.id)}
                          >
                            -
                          </button>
                          <span className="qty-display">{qty}</span>
                          <button
                            className="qty-btn"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      )}

                      {item.optionsText && (
                        <div className="options-sub-tag">{item.optionsText}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="makeup-right-sidebar">
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

          {totalCartCount > 0 && (
            <button
              className="checkout-cart-summary-premium"
              onClick={() => router && router.push('/cart')}
            >
              <div className="premium-cart-left">₹{getCartTotal()}</div>
              <div className="premium-cart-right">
                <span>View Cart</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Floating Cart */}
      {totalCartCount > 0 && (
        <div
          className="mobile-floating-cart-bar visible"
          onClick={() => router && router.push('/cart')}
        >
          <div className="mobile-cart-left">
            <span className="mobile-cart-total">₹{getCartTotal()}</span>
            <span className="mobile-cart-count">{totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} added</span>
          </div>
          <div className="mobile-cart-right">
            <span>View Cart</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
