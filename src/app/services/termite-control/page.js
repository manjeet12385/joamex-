'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'apartment',
    title: 'Apartment',
    icon: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'termite-control-apartment-1bhk-2bhk-3bhk',
        name: '1 BHK / 2 BHK / 3 BHK Termite Control',
        rating: '4.84',
        reviews: '42K',
        price: 2499,
        startsAt: true,
        duration: '2 hrs',
        bullets: [
          'Drill-Fill-Seal technique to destroy termite colonies at source',
          'Includes 1-year warranty with free re-treatment if termites reappear'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'bungalow',
    title: 'Bungalow',
    icon: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'termite-control-bungalow-full-structure',
        name: 'Bungalow Termite Control (Full Structure)',
        rating: '4.86',
        reviews: '28K',
        price: 4999,
        startsAt: true,
        duration: '3 hrs 30 mins',
        bullets: [
          'Comprehensive perimeter drilling, soil treatment & interior wood protection',
          'Includes 2-year warranty with semi-annual inspections'
        ],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function TermiteControlPage() {
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
          <h1 className="living-main-title">Termite Control</h1>
          
          <div className="earliest-badge" style={{ marginBottom: '10px' }}>
            <span className="badge-dot">●</span>
            <span className="badge-label">Earliest</span>
            <span className="badge-time">Tue, 6:00 PM</span>
          </div>

          <div className="living-rating-box">
            <span className="star-icon">★</span>
            <span className="rating-val">4.84</span>
            <span className="bookings-val">(70K bookings)</span>
          </div>

          <button className="view-services-purple-btn" onClick={() => scrollToCategory('apartment')}>
            View Services
          </button>
        </div>

        {/* Image Banner Showcase (Shifted further to the left) */}
        <div className="full-home-video-card" style={{ flex: 1, width: '100%', maxWidth: 'none', marginLeft: '-95px' }}>
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80" 
            alt="Termite control living room"
            className="video-poster-img"
          />
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
