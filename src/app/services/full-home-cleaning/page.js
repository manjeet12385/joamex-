'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'full-apartment',
    title: 'Full apartment',
    icon: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'furnished-apartment-cleaning',
        name: 'Furnished apartment cleaning',
        rating: '4.81',
        reviews: '840K',
        price: 2999,
        startsAt: true,
        duration: '3 hrs 30 mins',
        bullets: [
          'Includes deep cleaning of all rooms, kitchen, bathroom & balcony',
          'Vacuuming & steam sanitization of all sofa & furniture surfaces'
        ],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'unfurnished-apartment-cleaning',
        name: 'Unfurnished apartment cleaning',
        rating: '4.82',
        reviews: '320K',
        price: 2199,
        startsAt: true,
        duration: '2 hrs 45 mins',
        bullets: [
          'Deep cleaning of empty rooms, kitchen cabinets, windows & floors',
          'Ideal for move-in / move-out preparation'
        ],
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'full-bungalow-duplex',
    title: 'Full bungalow/duplex',
    icon: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'furnished-bungalow-cleaning',
        name: 'Furnished bungalow/duplex cleaning',
        rating: '4.85',
        reviews: '140K',
        price: 4999,
        startsAt: true,
        duration: '5 hrs',
        bullets: [
          'Complete deep cleaning of all floors, staircase, kitchen & bathrooms',
          'Includes window glass wiping & exterior surface polishing'
        ],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'unfurnished-bungalow-cleaning',
        name: 'Unfurnished bungalow/duplex cleaning',
        rating: '4.83',
        reviews: '95K',
        price: 3799,
        startsAt: true,
        duration: '4 hrs',
        bullets: [
          'Floor scrubbing, wall dusting & window cleaning across multi-stories',
          'Thorough sanitization of empty duplex space'
        ],
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'partial-home-cleaning',
    title: 'Partial home cleaning',
    isBadgeIcon: true,
    badgeText: '10%\nOFF',
    items: [
      {
        id: 'partial-home-cleaning-make-package',
        name: 'Partial home cleaning',
        topTag: 'MAKE YOUR PACKAGE',
        rating: '4.82',
        reviews: '243K',
        price: 3236,
        originalPrice: 3596,
        startsAt: true,
        duration: '5 hrs',
        bullets: [
          'Choose from bathroom, bedroom, kitchen, living room & balcony',
          'Pick from upholstery & sofa, appliance cleaning'
        ],
        isDiscountBadgeCard: true,
        discountTitle: '10% OFF',
        discountSubtitle: 'Above ₹3,500'
      },
      {
        id: 'customise-living-bedroom-balcony-combo',
        name: 'Customise: living, bedroom, balcony cleaning combo',
        rating: '4.81',
        reviews: '102K',
        price: 2799,
        startsAt: true,
        duration: '2 hrs 15 mins',
        bullets: [
          "Create a cleaning package tailored to your home's needs.",
          'Suitable for both regular upkeep & deep cleaning.'
        ],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function FullHomeCleaningPage() {
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const cat of servicesData) {
        const element = document.getElementById(cat.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddClick = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: 'Full Home Cleaning'
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      {/* Top Header & Hero Banner Section */}
      <div className="living-top-header-section" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px' }}>
        <div className="living-header-info" style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <h1 className="living-main-title">Full Home/ By Room Cleaning</h1>
          <div className="living-header-meta">
            <div className="living-rating-box">
              <span className="star-icon">★</span>
              <span className="rating-val">4.81</span>
              <span className="bookings-val">(1.7 M bookings)</span>
            </div>
          </div>
        </div>

        {/* Image Banner Showcase (Shifted further to the left) */}
        <div className="full-home-video-card" style={{ flex: 1, width: '100%', maxWidth: 'none', marginLeft: '-95px' }}>
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" 
            alt="No area hard to clean"
            className="video-poster-img"
          />
          <div className="uc-badge-overlay">UC</div>
          <div className="video-title-overlay">
            No area<br />hard to clean
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="bridal-makeup-container">
        {/* Left Sidebar Column (Sticky Wrapper) */}
        <div className="services-sidebar-sticky-col" style={{ marginTop: '0px', height: '100%' }}>
          <div className="services-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <div className="sidebar-heading">Select a service</div>
            <div className="subcategory-grid">
              {servicesData.map((cat) => (
                <div
                  key={cat.id}
                  className={`subcategory-card ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => scrollToCategory(cat.id)}
                >
                  <div className={`subcat-icon-wrapper ${cat.isBadgeIcon ? 'badge-icon-bg' : ''}`}>
                    {cat.isBadgeIcon ? (
                      <div className="badge-text-box">
                        10%<br />OFF
                      </div>
                    ) : (
                      <img src={cat.icon} alt={cat.title} className="subcat-img" />
                    )}
                  </div>
                  <span className="subcat-name">{cat.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Main Content */}
        <div className="services-main-content">
          {servicesData.map((category) => (
            <div key={category.id} id={category.id} className="category-block">
              <h2 className="category-block-title">{category.title}</h2>
              <div className="packages-list">
                {category.items.map((item) => {
                  const qty = getItemQuantity(item.id);
                  return (
                    <div key={item.id} className="package-card">
                      <div className="package-info">
                        {item.topTag && (
                          <div className="make-package-tag">
                            <span className="tag-icon">📊</span>
                            <span>{item.topTag}</span>
                          </div>
                        )}
                        <div className="package-title-row">
                          <h3 className="package-title">{item.name}</h3>
                        </div>
                        <div className="package-rating">
                          <span className="star">★</span>
                          <span>{item.rating} ({item.reviews} reviews)</span>
                        </div>
                        <div className="package-price-row">
                          <span>{item.startsAt ? 'Starts at ' : ''}₹{item.price}</span>
                          {item.originalPrice && (
                            <span className="original-price-strikethrough">₹{item.originalPrice}</span>
                          )}
                          {item.duration && (
                            <>
                              <span>•</span>
                              <span>{item.duration}</span>
                            </>
                          )}
                        </div>
                        <ul className="package-bullets">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))}
                        </ul>
                        <a className="view-details-link" onClick={(e) => { e.preventDefault(); toast.info(`Viewing details for ${item.name}`); }}>
                          View details
                        </a>
                      </div>

                      <div className="package-image-side">
                        {item.isDiscountBadgeCard ? (
                          <div className="discount-card-box">
                            <div className="discount-card-title">{item.discountTitle}</div>
                            <div className="discount-card-subtitle">{item.discountSubtitle}</div>
                          </div>
                        ) : (
                          <div className="package-img-wrapper">
                            <img src={item.image} alt={item.name} className="package-img" />
                          </div>
                        )}
                        {qty > 0 ? (
                          <div className="qty-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}>
                            <span onClick={() => updateQuantity(item.id, qty - 1)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>-</span>
                            <span>{qty}</span>
                            <span onClick={() => updateQuantity(item.id, qty + 1)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>+</span>
                          </div>
                        ) : (
                          <button className="qty-btn" onClick={() => handleAddClick(item)}>
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar - UC Promise */}
        <div className="right-sidebar">
          <div className="uc-promise-card">
            <div className="promise-title">UC Promise</div>
            <ul className="promise-list">
              <li className="promise-item">
                <span className="promise-icon">✓</span>
                <span>Verified Professionals</span>
              </li>
              <li className="promise-item">
                <span className="promise-icon">✓</span>
                <span>Hassle Free Booking</span>
              </li>
              <li className="promise-item">
                <span className="promise-icon">✓</span>
                <span>Transparent Pricing</span>
              </li>
            </ul>
            <svg className="quality-badge" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4"/>
              <text x="50" y="45" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">QUALITY</text>
              <text x="50" y="60" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">ASSURED</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Sticky Cart Bar if items exist */}
      {getCartCount() > 0 && (
        <div className="sticky-cart-bar">
          <div>₹{getCartTotal()}</div>
          <button className="view-cart-btn" onClick={() => router && router.push('/cart')}>
            View Cart &gt;
          </button>
        </div>
      )}
    </div>
  );
}
