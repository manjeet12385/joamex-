'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ChevronRight } from 'lucide-react';
import '../bridal-makeup/style.css';

const primeCategories = [
  {
    id: 'packages',
    title: 'Packages',
    icon: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'haircut-massage-prime',
        name: 'Haircut & massage',
        rating: '4.85',
        reviews: '755K',
        price: 368,
        duration: '40 mins',
        isPackage: true,
        bullets: [
          'Haircut: Haircut for men',
          'Massage: 10 min Relaxing Head massage'
        ]
      },
      {
        id: 'grooming-essentials-prime',
        name: 'Grooming essentials',
        rating: '4.85',
        reviews: '1M',
        price: 567,
        duration: '1 hr 5 mins',
        isPackage: true,
        bullets: [
          'Haircut: Haircut for men',
          'Beard or shaving grooming: Beard trimming & styling',
          'Massage: Head massage (10 mins)'
        ]
      },
      {
        id: 'haircut-color-prime',
        name: 'Haircut & color',
        rating: '4.85',
        reviews: '540K',
        price: 558,
        duration: '60 mins',
        isPackage: true,
        bullets: [
          'Haircut or color: Haircut for men',
          'Hair color (Garnier): Brown black (shade 3)'
        ]
      },
      {
        id: 'hair-care-prime',
        name: 'Hair & care',
        rating: '4.84',
        reviews: '840K',
        price: 808,
        duration: '1 hr 5 mins',
        isPackage: true,
        bullets: [
          'Haircut: Haircut for men',
          'Pedicure: Brightening lemon express pedicure'
        ]
      },
      {
        id: 'face-care-beyond-prime',
        name: 'Face care & beyond',
        rating: '4.84',
        reviews: '1.1M',
        price: 858,
        duration: '1 hr 5 mins',
        isPackage: true,
        bullets: [
          'Haircut: Haircut for men',
          'Facial or cleanup: Charcoal De-toxifying Cleanup'
        ]
      },
      {
        id: 'make-your-own-package-prime',
        name: 'Make your own package',
        rating: '4.84',
        reviews: '1.2M',
        price: 1166,
        duration: '1 hr 40 mins',
        isPackage: true,
        discountBadge: '15%\nOFF',
        bullets: [
          'Haircut: Haircut for men',
          'Shave or beard grooming: Beard trimming & styling',
          'Facial or cleanup: Charcoal de-toxifying cleanup',
          'Massage: Head massage (10 mins)'
        ]
      }
    ]
  },
  {
    id: 'haircut-beard',
    title: 'Haircut & beard styling',
    icon: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'haircut-for-men-prime',
        name: 'Haircut for men',
        bestseller: true,
        rating: '4.86',
        reviews: '478K',
        price: 259,
        duration: '30 mins',
        bullets: [
          'Professional haircut that suits your face shape'
        ],
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'haircut-for-boys-prime',
        name: 'Haircut for boys',
        rating: '4.84',
        reviews: '108K',
        price: 259,
        duration: '30 mins',
        bullets: [
          'Specially trained stylists for boys aged 2 years and above'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'clean-shave-prime',
        name: 'Clean shave',
        rating: '4.85',
        reviews: '75K',
        price: 199,
        duration: '20 mins',
        bullets: [
          'Ustraa shave with a single-use blade for the closest shave'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'beard-grooming',
        name: 'Beard trimming & styling',
        rating: '4.87',
        reviews: '320K',
        price: 199,
        duration: '20 mins',
        bullets: [
          'Precision beard trimming & razor styling',
          'Post-shave soothing lotion application'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'beard-color-with-product',
        name: 'Beard color (with product)',
        rating: '4.73',
        reviews: '7K',
        price: 199,
        duration: '30 mins',
        bullets: [
          'Even & mess-free colour application'
        ],
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'detan',
    title: 'Detan',
    icon: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'face-neck-detan',
        name: 'Face & neck detan',
        rating: '4.79',
        reviews: '25K',
        price: 399,
        duration: '20 mins',
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'hands-detan',
        name: 'Hands detan',
        rating: '4.76',
        reviews: '6K',
        price: 399,
        duration: '30 mins',
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'facial-cleanup',
    title: 'Facial & cleanup',
    icon: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'skin-brightening-facial-prime',
        name: 'Skin brightening facial',
        bestseller: true,
        rating: '4.73',
        reviews: '17K',
        price: 1399,
        duration: '1 hr 5 mins',
        bullets: [
          'Orange peel extracts, vit C, green tea enriched facial to reduce dullness'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'skin-hydrating-facial-prime',
        name: 'Skin hydrating facial',
        rating: '4.73',
        reviews: '5K',
        price: 1399,
        duration: '1 hr 5 mins',
        bullets: [
          'Mulberry,saffron,arbutin enriched facial for deep cleansing & boosted hydration'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'office-ready-cleanup-prime',
        name: 'Office-ready cleanup',
        rating: '4.78',
        reviews: '8K',
        price: 699,
        duration: '35 mins',
        bullets: [
          'Vit-E, charcoal extracts, lemon enriched cleanup to cleanse & soften the skin'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'oil-free-vacation-cleanup-prime',
        name: 'Oil-free vacation cleanup',
        rating: '4.76',
        reviews: '5K',
        price: 699,
        duration: '35 mins',
        bullets: [
          'Vit-C, green tea, grapefruit enriched cleanup to absorb oil & control sebum'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'charcoal-detoxifying-cleanup-prime',
        name: 'Charcoal de-toxifying cleanup',
        rating: '4.73',
        reviews: '10K',
        price: 599,
        duration: '35 mins',
        bullets: [
          'Vit-E, charcoal extracts for deep cleansing, dead skin removal & soft skin',
          'Product used is of Bombay Shaving Company'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'manicure-pedicure',
    title: 'Manicure & pedicure',
    icon: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'chocolate-vanilla-sole-pedicure-prime',
        name: 'Chocolate & vanilla sole rejuvenating pedicure',
        rating: '4.73',
        reviews: '12K',
        price: 899,
        originalPrice: 949,
        duration: '1 hr 20 mins',
        bullets: [
          'Premium nail & foot care to remove dead skin, calluses & odour',
          'Includes relaxing swell gel soak, scrub, cream massage & mask'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'brightening-lemon-deep-cleanse-pedicure-prime',
        name: 'Brightening lemon deep cleanse pedicure',
        bestseller: true,
        rating: '4.79',
        reviews: '29K',
        price: 799,
        duration: '60 mins',
        bullets: [
          'Premium nail & foot care to remove dead skin, calluses & odour',
          'Includes smoothie mask, relaxing warm water soak, scrub, cream massage'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'brightening-lemon-express-pedicure-prime',
        name: 'Brightening lemon express pedicure',
        rating: '4.77',
        reviews: '25K',
        price: 549,
        duration: '35 mins',
        bullets: [
          'Nail & foot care for regular maintenance',
          'Includes warm water soak, cleansing & massage'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'foot-calf-massage-prime',
        name: 'Foot & calf massage',
        rating: '4.77',
        reviews: '19K',
        price: 199,
        duration: '10 mins',
        bullets: [
          'Oil massage to treat chronic foot pain & stiff calf muscles'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'express-manicure-prime',
        name: 'Express manicure',
        rating: '4.74',
        reviews: '10K',
        price: 499,
        duration: '30 mins',
        bullets: [
          'Nail & hand care for regular maintenance',
          'Includes warm water soak, cleansing & massage'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'nail-cut-file-hands-prime',
        name: 'Nail cut & file (hands)',
        rating: '4.82',
        reviews: '5K',
        price: 99,
        duration: '10 mins',
        bullets: [
          'Quick & basic nail grooming of your hands'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'nail-cut-file-feet-prime',
        name: 'Nail cut & file (feet)',
        rating: '4.79',
        reviews: '5K',
        price: 99,
        duration: '10 mins',
        bullets: [
          'Quick & basic nail grooming of your feet'
        ],
        image: 'https://images.unsplash.com/photo-1519824921617-6aa3e3170e5b?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'hair-color',
    title: 'Hair color',
    icon: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'hair-color-only-application-prime',
        name: 'Hair color (only application)',
        rating: '4.81',
        reviews: '33K',
        price: 199,
        duration: '30 mins',
        bullets: [
          "Please provide your own hair colour; we'll bring everything else"
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'garnier-hair-color-prime',
        name: 'Garnier hair color',
        rating: '4.77',
        reviews: '14K',
        pricePrefix: 'Starts at ',
        price: 299,
        optionsSubtitle: '3 options',
        bullets: [
          'Even & mess-free colour application'
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'loreal-matrix-hair-color-prime',
        name: "L'Oreal matrix hair color",
        rating: '4.76',
        reviews: '9K',
        pricePrefix: 'Starts at ',
        price: 449,
        optionsSubtitle: '3 options',
        bullets: [
          'Even & mess-free colour application'
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'massage',
    title: 'Massage',
    icon: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop&q=80',
    items: [
      {
        id: 'head-massage-prime',
        name: 'Head massage',
        rating: '4.85',
        reviews: '89K',
        pricePrefix: 'Starts at ',
        price: 109,
        optionsSubtitle: '4 options',
        bullets: [
          'Choose from different types of head massages'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'head-neck-shoulder-massage-prime-salon',
        name: 'Head, neck & shoulder massage',
        rating: '4.81',
        reviews: '55K',
        price: 299,
        duration: '30 mins',
        bullets: [
          'Relaxing oil massage to promote hair growth, treat stiff muscle & relieve stress'
        ],
        image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'hydrating-face-massage-prime',
        name: 'Hydrating face massage (10 mins)',
        rating: '4.80',
        reviews: '12K',
        price: 149,
        duration: '10 mins',
        bullets: [
          'Refreshing massage with a moisturiser to improve blood flow & enhance glow'
        ],
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc215f?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'neck-shoulder-massage-prime',
        name: 'Neck & shoulder massage',
        rating: '4.82',
        reviews: '13K',
        price: 199,
        duration: '20 mins',
        bullets: [
          'Relaxing oil massage to treat stiff/ tense muscles & relieve stress'
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function SalonPrimePage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [activeCategoryId, setActiveCategoryId] = useState('packages');
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const activeCategory = primeCategories.find(c => c.id === activeCategoryId) || primeCategories[0];
  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&q=80',
      category: 'Salon Prime'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const isItemInCart = (itemId) => {
    return cart.some(c => c.id === itemId);
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="bridal-makeup-page-wrapper">
      <Header />

      <main className="bridal-makeup-container" style={{ paddingTop: '24px' }}>
        
        {/* LEFT SIDEBAR - Select a Service */}
        <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
          <div className="select-service-card">
            <h3 className="sidebar-title" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px' }}>
              Select a service
            </h3>
            <div className="sidebar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px 8px' }}>
              {primeCategories.map((cat) => (
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
                        e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80';
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
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>{activeCategory.title}</h2>
          </div>

          {/* Service Items List */}
          <div className="service-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                className="service-detail-item-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justify: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ flex: 1 }}>
                  {item.isPackage && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#15803d',
                      fontSize: '11px',
                      fontWeight: '800',
                      marginBottom: '8px',
                      letterSpacing: '0.05em'
                    }}>
                      <span style={{ fontSize: '10px' }}>🔰</span> PACKAGE
                    </div>
                  )}

                  {item.bestseller && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
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
                      BESTSELLER
                    </div>
                  )}

                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#4f46e5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={14} fill="#4f46e5" /> {item.rating}
                    </span>
                    <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {item.pricePrefix || ''}₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>₹{item.originalPrice.toLocaleString()}</span>
                    )}
                    {item.duration && (
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>• {item.duration}</span>
                    )}
                  </div>

                  {item.bullets && item.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '18px', margin: '0 0 16px 0', color: '#334155', fontSize: '13px', lineHeight: '1.7' }}>
                      {item.bullets.map((bullet, bIdx) => {
                        if (bullet.includes(':')) {
                          const parts = bullet.split(':');
                          return (
                            <li key={bIdx} style={{ marginBottom: '4px' }}>
                              <strong>{parts[0]}:</strong> {parts.slice(1).join(':')}
                            </li>
                          );
                        }
                        return <li key={bIdx} style={{ marginBottom: '4px' }}>{bullet}</li>;
                      })}
                    </ul>
                  )}

                  {item.isPackage ? (
                    <button
                      onClick={() => setSelectedDetailsItem(item)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#1e293b',
                        cursor: 'pointer'
                      }}
                    >
                      Edit your package
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedDetailsItem(item)}
                      style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                    >
                      View details
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '100px' }}>
                  {item.discountBadge ? (
                    <div style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '12px',
                      width: '120px'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#15803d', lineHeight: '1.1', whiteSpace: 'pre-line' }}>
                        {item.discountBadge}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          width: '100%',
                          padding: '6px 0',
                          borderRadius: '8px',
                          border: '1.5px solid #4f46e5',
                          background: isItemInCart(item.id) ? '#4f46e5' : '#ffffff',
                          color: isItemInCart(item.id) ? '#ffffff' : '#4f46e5',
                          fontWeight: '700',
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        {isItemInCart(item.id) ? 'Added ✓' : 'Add'}
                      </button>
                    </div>
                  ) : (
                    <>
                      {getItemQuantity(item.id) > 0 ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1.5px solid #6366f1',
                          borderRadius: '8px',
                          padding: '4px 12px',
                          width: '90px',
                          color: '#4f46e5',
                          fontWeight: '700',
                          background: '#ffffff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                            style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '14px', color: '#4f46e5', fontWeight: '800' }}>{getItemQuantity(item.id)}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{
                            padding: '8px 24px',
                            borderRadius: '8px',
                            border: '1.5px solid #4f46e5',
                            background: '#ffffff',
                            color: '#4f46e5',
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
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginTop: '-4px', textAlign: 'center' }}>
                          {item.optionsSubtitle}
                        </span>
                      )}

                      {item.image && (
                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
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
                <span>Verified Professionals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#059669" />
                <span>Hassle Free Booking</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#059669" />
                <span>Transparent Pricing</span>
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
