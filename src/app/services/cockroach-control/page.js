'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'kitchen-bathroom',
    title: 'Kitchen/Bathroom',
    icon: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'cockroach-pest-kitchen-bathroom',
        name: 'Cockroach, ant & general pest control (Kitchen & Bathroom)',
        rating: '4.83',
        reviews: '820K',
        price: 899,
        startsAt: true,
        duration: '45 mins',
        bullets: [
          'Includes spray treatment in kitchen cabinets, drain outlets & bathroom corners',
          'Gel baiting for long-term cockroach elimination'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'partial-home',
    title: 'Partial home',
    icon: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'cockroach-pest-partial-home',
        name: 'Cockroach, ant & general pest control (1 BHK / Selected rooms)',
        rating: '4.82',
        reviews: '450K',
        price: 1199,
        startsAt: true,
        duration: '1 hr',
        bullets: [
          'Comprehensive spray & gel application across selected rooms & kitchen',
          'ODORLESS & safe chemical treatment'
        ],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'full-home',
    title: 'Full home',
    icon: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'cockroach-pest-full-home',
        name: 'Cockroach, ant & general pest control (2 BHK / 3 BHK / Full Home)',
        rating: '4.85',
        reviews: '620K',
        price: 1499,
        startsAt: true,
        duration: '1 hr 30 mins',
        bullets: [
          'Full home spray treatment + gel baiting in all hidden spots & crevices',
          'Free 60-day warranty re-visit if pests reappear'
        ],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'bungalow-cockroach-control',
        name: 'Bungalow cockroach control',
        rating: '4.79',
        reviews: '4K',
        price: 2349,
        startsAt: true,
        duration: '1 hr 55 mins',
        bullets: [
          'Spray treatment followed by gel treatment after 2 weeks'
        ],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function CockroachControlPage() {
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
      category: 'Pest Control'
    });
    toast.success(`Added ${item.name} to cart!`);
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      {/* Top Header Section */}
      <div className="living-top-header-section" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '32px' }}>
        <div className="living-header-info" style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <h1 className="living-main-title">Cockroach Control</h1>
          
          <div className="earliest-badge" style={{ marginBottom: '10px' }}>
            <span className="badge-dot">●</span>
            <span className="badge-label">Earliest</span>
            <span className="badge-time">Tue, 5:30 PM</span>
          </div>

          <div className="living-rating-box">
            <span className="star-icon">★</span>
            <span className="rating-val">4.83</span>
            <span className="bookings-val">(1.5 M bookings)</span>
          </div>

          <div className="warranty-banner-btn" onClick={() => toast.info('60 days warranty included on pest control services')}>
            <div className="warranty-left">
              <svg viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span>60 days warranty</span>
            </div>
            <span className="warranty-arrow">&gt;</span>
          </div>
        </div>

        {/* Video Card Showcase (Shifted further to the left) */}
        <div className="full-home-video-card" style={{ flex: 1, width: '100%', maxWidth: 'none', marginLeft: '-95px' }}>
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" 
            alt="Spray treatment"
            className="video-poster-img"
          />
          <div className="uc-badge-overlay">UC</div>
          <div className="video-text-subtitle">
            1. Spray treatment to kill the fully developed pests
          </div>
          <div className="video-progress-bar">
            <div className="video-progress-fill"></div>
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
                  <div className="subcat-icon-wrapper">
                    <img src={cat.icon} alt={cat.title} className="subcat-img" />
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
                        <div className="package-title-row">
                          <h3 className="package-title">{item.name}</h3>
                        </div>
                        <div className="package-rating">
                          <span className="star">★</span>
                          <span>{item.rating} ({item.reviews} reviews)</span>
                        </div>
                        <div className="package-price-row">
                          <span>{item.startsAt ? 'Starts at ' : ''}₹{item.price}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
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
                        <div className="package-img-wrapper">
                          <img src={item.image} alt={item.name} className="package-img" />
                        </div>
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
                <span>Safe Chemicals</span>
              </li>
              <li className="promise-item">
                <span className="promise-icon">✓</span>
                <span>Superior Stain Removal</span>
              </li>
            </ul>
            <svg className="quality-badge" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4"/>
              <text x="50" y="45" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">SPARKLING</text>
              <text x="50" y="60" textAnchor="middle" fill="#0369a1" fontSize="10" fontWeight="bold">HYGIENIC</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Sticky Cart Bar */}
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
