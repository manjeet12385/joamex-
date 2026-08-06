'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ShieldCheck, Zap } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const acCategories = [
  {
    id: 'annual-plan',
    title: 'Annual plan',
    badge: 'Upto 30% OFF',
    icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'Annual AC Protection Plans',
      subtitle: 'Unlimited service support • Save up to 30% on repair & gas refill',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'saver-ac-service-plan',
        name: 'Saver AC service plan (2 services/year)',
        rating: '4.82',
        reviews: '120K',
        price: 899,
        originalPrice: 1198,
        discountTag: '10% OFF',
        duration: '45 mins per service',
        bullets: [
          'Includes 2 comprehensive foam-jet AC services',
          'Valid for 1 year with priority technician allocation'
        ],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'complete-ac-maintenance-plan',
        name: 'Complete AC maintenance plan (Includes gas refill)',
        bestseller: true,
        rating: '4.88',
        reviews: '95K',
        price: 2499,
        originalPrice: 2999,
        discountTag: '15% OFF',
        duration: '60 mins',
        bullets: [
          '2 Foam-jet services + 1 free gas top-up + 10% off on spare parts'
        ],
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'service',
    title: 'Service',
    icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'Foam-jet AC service',
      subtitle: 'Deep cleans AC coils for better cooling & power saving',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'foam-jet-service-2-acs',
        name: 'Foam-jet service (2 ACs)',
        rating: '4.75',
        reviews: '2.8M',
        price: 1098,
        originalPrice: 1190,
        perUnitText: '₹549 per AC',
        duration: '2 hrs',
        bullets: [
          'Applicable for both window or split ACs',
          'Indoor unit deep cleaning with foam & jet spray'
        ],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'foam-jet-service-3-acs',
        name: 'Foam-jet service (3 ACs)',
        rating: '4.75',
        reviews: '2.8M',
        price: 1497,
        originalPrice: 1797,
        perUnitText: '₹499 per AC',
        duration: '3 hrs',
        imageBadgeTopRight: 'Free gas check',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'foam-jet-service-4-acs',
        name: 'Foam-jet service (4 ACs)',
        rating: '4.75',
        reviews: '2.8M',
        price: 1796,
        originalPrice: 2396,
        perUnitText: '₹449 per AC',
        duration: '4 hrs',
        imageBadgeTopRight: 'Free gas check',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'foam-jet-service-5-acs',
        name: 'Foam-jet service (5 ACs)',
        rating: '4.75',
        reviews: '2.8M',
        price: 2245,
        originalPrice: 2995,
        perUnitText: '₹449 per AC',
        duration: '5 hrs',
        imageBadgeTopRight: 'Free gas check',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'foam-jet-ac-service-single',
        name: 'Foam-jet AC service',
        rating: '4.75',
        reviews: '2.8M',
        pricePrefix: 'Starts at ',
        price: 599,
        perUnitText: 'Add more & save up to 25%',
        optionsSubtitle: '9 options',
        bullets: [
          'Applicable for both window & split ACs',
          'Indoor unit deep cleaning with foam & jet spray'
        ],
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'repair-gas',
    title: 'Repair & gas refill',
    icon: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'AC Repair & Gas Refill Expert',
      subtitle: 'Genuine spare parts • 60-day repair warranty',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'ac-repair-general-checkup',
        name: 'AC repair',
        rating: '4.73',
        reviews: '847K',
        pricePrefix: 'Starts at ',
        price: 299,
        optionsSubtitle: '4 options',
        bullets: [
          'Complete check-up to identify issues before repair'
        ],
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'gas-refill-checkup-full',
        name: 'Gas refill & check-up',
        rating: '4.77',
        reviews: '113K',
        price: 3000,
        duration: '2 hrs 30 mins',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'installation',
    title: 'Installation/uninstallation',
    icon: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop&q=80',
    banner: {
      title: 'Precision AC Installation',
      subtitle: 'Leak-proof copper piping • Safe mounting • Free testing',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80'
    },
    items: [
      {
        id: 'ac-installation-general',
        name: 'AC installation',
        rating: '4.69',
        reviews: '149K',
        pricePrefix: 'Starts at ',
        price: 1299,
        optionsSubtitle: '2 options',
        bullets: [
          'Installation of indoor & outdoor units with free gas check'
        ],
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'ac-uninstallation-general',
        name: 'AC uninstallation',
        rating: '4.79',
        reviews: '139K',
        pricePrefix: 'Starts at ',
        price: 699,
        optionsSubtitle: '2 options',
        bullets: [
          'Uninstallation of both indoor & outdoor units'
        ],
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];
export default function AcRepairPage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [activeCategoryId, setActiveCategoryId] = useState('service');
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [servicesList, setServicesList] = useState(acCategories);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState('service');
  const [editingItem, setEditingItem] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    badge: '',
    isBestseller: false,
    rating: '4.8',
    reviews: '100K',
    duration: '45 mins',
    bullets: '',
    image: ''
  });

  useEffect(() => {
    const checkAdmin = () => {
      const adminUser = localStorage.getItem('adminUser');
      const storedMode = localStorage.getItem('admin_edit_mode');
      const hasAdminLogin = !!adminUser;
      const isEditOn = storedMode === 'true';
      setIsAdmin(hasAdminLogin);
      setAdminEditMode(hasAdminLogin && isEditOn);
    };

    checkAdmin();
    const interval = setInterval(checkAdmin, 500);

    const loadAcRepairData = async () => {
      try {
        const res = await fetch('/api/category-data?categoryId=ac-repair');
        if (res.ok) {
          const result = await res.json();
          if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            setServicesList(result.data);
          } else {
            setServicesList(acCategories); // fallback to default
          }
        }
      } catch (e) {
        console.error('Failed to fetch AC repair services from API:', e);
        const storedData = localStorage.getItem('admin_ac_repair_data');
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setServicesList(parsed);
            }
          } catch (e) {}
        }
      }
    };
    
    loadAcRepairData();
    window.addEventListener('storage', checkAdmin);
    window.addEventListener('focus', checkAdmin);
    window.addEventListener('admin_edit_mode_changed', checkAdmin);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAdmin);
      window.removeEventListener('focus', checkAdmin);
      window.removeEventListener('admin_edit_mode_changed', checkAdmin);
    };
  }, []);

  const activeCategory = servicesList.find(c => c.id === activeCategoryId) || servicesList[1] || servicesList[0];
  const cartTotal = getCartTotal();

  const handleOpenAddPackage = (sectionId) => {
    setTargetSectionId(sectionId);
    setEditingItem(null);
    setPackageForm({
      name: '',
      price: '',
      originalPrice: '',
      badge: '',
      isBestseller: false,
      rating: '4.8',
      reviews: '100K',
      duration: '45 mins',
      bullets: '',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
    });
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (e, sectionId, item) => {
    e.stopPropagation();
    setTargetSectionId(sectionId);
    setEditingItem(item);
    setPackageForm({
      name: item.name || '',
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      badge: item.badge || item.discountTag || '',
      isBestseller: !!item.bestseller,
      rating: item.rating || '4.8',
      reviews: item.reviews || '100K',
      duration: item.duration || '',
      bullets: Array.isArray(item.bullets) ? item.bullets.join('\n') : (item.bullets || ''),
      image: item.image || ''
    });
    setShowPackageModal(true);
  };

  const saveAcCategoriesData = async (updatedData) => {
    setServicesList(updatedData);
    try {
      await fetch('/api/category-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: 'ac-repair', data: updatedData })
      });
    } catch (e) {
      console.error('Failed to save to MongoDB:', e);
      localStorage.setItem('admin_ac_repair_data', JSON.stringify(updatedData));
    }
  };

  const handleDeletePackage = (e, sectionId, itemId) => {
    e.stopPropagation();
    if (confirm("Delete this service package?")) {
      const updated = servicesList.map(cat => {
        if (cat.id === sectionId) {
          return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
        }
        return cat;
      });
      saveAcCategoriesData(updated);
      toast.success("Package deleted!");
    }
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!packageForm.name.trim() || !packageForm.price) return;

    const bulletList = packageForm.bullets
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const updatedCats = servicesList.map(sec => {
      if (sec.id === targetSectionId) {
        let updatedItems = [];
        if (editingItem) {
          updatedItems = sec.items.map(item => {
            if (item.id === editingItem.id) {
              return {
                ...item,
                name: packageForm.name.trim(),
                price: Number(packageForm.price),
                originalPrice: packageForm.originalPrice ? Number(packageForm.originalPrice) : undefined,
                badge: packageForm.badge.trim(),
                discountTag: packageForm.badge.trim(),
                bestseller: packageForm.isBestseller,
                rating: packageForm.rating.trim() || '4.8',
                reviews: packageForm.reviews.trim() || '100K',
                duration: packageForm.duration.trim(),
                bullets: bulletList.length > 0 ? bulletList : ['Quality AC service guarantee'],
                image: packageForm.image.trim() || item.image
              };
            }
            return item;
          });
        } else {
          const newItem = {
            id: `pkg-${Date.now()}`,
            name: packageForm.name.trim(),
            price: Number(packageForm.price),
            originalPrice: packageForm.originalPrice ? Number(packageForm.originalPrice) : undefined,
            badge: packageForm.badge.trim(),
            discountTag: packageForm.badge.trim(),
            bestseller: packageForm.isBestseller,
            rating: packageForm.rating.trim() || '4.8',
            reviews: packageForm.reviews.trim() || '100K',
            duration: packageForm.duration.trim(),
            bullets: bulletList.length > 0 ? bulletList : ['Quality AC service guarantee'],
            image: packageForm.image.trim() || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
          };
          updatedItems = [...sec.items, newItem];
        }
        return { ...sec, items: updatedItems };
      }
      return sec;
    });

    saveAcCategoriesData(updatedCats);
    setShowPackageModal(false);
    toast.success(editingItem ? "Package updated live!" : "Package added live!");
  };

  const handlePackageImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPackageForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80',
      category: 'AC Service & Repair'
    });
    toast.success(`${item.name} added to cart!`);
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
            <div className="sidebar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 12px' }}>
              {acCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`sidebar-grid-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: activeCategoryId === cat.id ? '2px solid #10b981' : '1px solid #e2e8f0',
                    background: activeCategoryId === cat.id ? '#ecfdf5' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {cat.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      background: '#10b981',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {cat.badge}
                    </span>
                  )}
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', marginBottom: '6px' }}>
                    <img src={cat.icon} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: activeCategoryId === cat.id ? '#047857' : '#334155', textAlign: 'center', lineHeight: '1.2' }}>
                    {cat.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MIDDLE CONTENT AREA */}
        <section className="makeup-main-content">
          {/* Header Title with Instant Delivery Badge */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                AC Service & Repair
              </h1>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '4px 10px',
                color: '#047857',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                <Zap size={14} fill="#047857" /> Instant In 48 mins
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
              <Star size={14} fill="#10b981" color="#10b981" />
              <strong style={{ color: '#0f172a' }}>4.77</strong>
              <span>(13.7 M bookings)</span>
            </div>
          </div>
          {/* Banner Hero Card matching Screenshot 2 */}
          <div className="ac-hero-banner">
            {/* Left text content */}
            <div className="ac-hero-banner-content">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#047857',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: '900',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em',
                marginBottom: '14px',
                textTransform: 'uppercase'
              }}>
                ⚡ INSTANT
              </div>
              <h2 className="ac-banner-title">
                AC service & repair in 60 mins
              </h2>
              <p className="ac-banner-price">
                Starts at ₹449
              </p>

              {/* Carousel Indicator Dots & Navigation Arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ width: '24px', height: '4px', background: '#047857', borderRadius: '2px' }} />
                  <span style={{ width: '12px', height: '4px', background: '#cbd5e1', borderRadius: '2px' }} />
                  <span style={{ width: '12px', height: '4px', background: '#cbd5e1', borderRadius: '2px' }} />
                </div>
              </div>
            </div>

            {/* Carousel Arrow Buttons */}
            <button className="ac-banner-arrow left">
              ‹
            </button>
            <button className="ac-banner-arrow right">
              ›
            </button>

            {/* Right side technician image with purple background polygon shape */}
            <div className="ac-hero-banner-image">
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '-10px',
                width: '100%',
                height: '100%',
                background: '#a78bfa',
                borderRadius: '24px',
                transform: 'rotate(6deg)',
                zIndex: 1
              }} />
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
                alt="AC Repair Technician"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  zIndex: 2,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>

          {/* Section Category Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {activeCategory.title}
            </h2>
            {isAdmin && adminEditMode && (
              <button
                onClick={() => handleOpenAddPackage(activeCategory.id)}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                }}
              >
                + Add Package
              </button>
            )}
          </div>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeCategory.items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                {isAdmin && adminEditMode && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                    <button
                      onClick={(e) => handleOpenEditPackage(e, activeCategory.id, item)}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Edit Package & Discounts"
                    >
                      ✏️ Edit Package
                    </button>
                    <button
                      onClick={(e) => handleDeletePackage(e, activeCategory.id, item.id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Delete Package"
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div style={{ flex: 1 }}>
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
                    <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={14} fill="#10b981" color="#10b981" /> {item.rating}
                    </span>
                    <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
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
                    {item.perUnitText && (
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🏷️ {item.perUnitText}
                      </div>
                    )}
                  </div>

                  {item.bullets && item.bullets.length > 0 && (
                    <ul style={{ paddingLeft: '18px', margin: '0 0 16px 0', color: '#334155', fontSize: '13px', lineHeight: '1.7' }}>
                      {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} style={{ marginBottom: '4px' }}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                  <button
                    onClick={() => setSelectedDetailsItem(item)}
                    style={{ background: 'none', border: 'none', color: '#10b981', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    View details
                  </button>
                </div>

                <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
                  {item.imageBadgeTopRight && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-4px',
                      background: '#047857',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '3px 7px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      zIndex: 12,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}>
                      {item.imageBadgeTopRight}
                    </span>
                  )}
                  {item.discountTag && (
                    <span style={{
                      position: 'absolute',
                      top: '0px',
                      left: '0px',
                      background: '#047857',
                      color: '#ffffff',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '8px 0 8px 0',
                      zIndex: 12,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}>
                      {item.discountTag}
                    </span>
                  )}

                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                  />

                  {getItemQuantity(item.id) > 0 ? (
                    <div style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1.5px solid #10b981',
                      borderRadius: '8px',
                      padding: '0 6px',
                      width: '82px',
                      height: '30px',
                      color: '#047857',
                      fontWeight: '800',
                      background: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      zIndex: 10
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                        style={{ background: 'none', border: 'none', color: '#047857', fontSize: '15px', fontWeight: '800', cursor: 'pointer', padding: '0 4px' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '13px', color: '#047857', fontWeight: '800' }}>{getItemQuantity(item.id)}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{ background: 'none', border: 'none', color: '#047857', fontSize: '15px', fontWeight: '800', cursor: 'pointer', padding: '0 4px' }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        position: 'absolute',
                        bottom: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '6px 22px',
                        borderRadius: '8px',
                        border: '1.5px solid #e2e8f0',
                        background: '#ffffff',
                        color: '#047857',
                        fontWeight: '700',
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        zIndex: 10,
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT SIDEBAR - UC Promise & Cart Bar */}
        <aside className="makeup-right-sidebar">
          <div className="select-service-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>UC Promise</h3>
              <ShieldCheck size={28} color="#10b981" />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#10b981" /> Verified Professionals
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#10b981" /> Hassle Free Booking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#10b981" /> Transparent Pricing
              </li>
            </ul>
          </div>

          {cartTotal > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              padding: '16px 20px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
              position: 'sticky',
              top: '100px'
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '800' }}>₹{cartTotal.toLocaleString()}</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>Items in cart</div>
              </div>
              <button
                onClick={() => router.push('/cart')}
                style={{
                  background: '#ffffff',
                  color: '#047857',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                View Cart
              </button>
            </div>
          )}
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
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10b981', marginBottom: '16px' }}>₹{selectedDetailsItem.price}</div>
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
              style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Package Edit/Add Modal */}
      {showPackageModal && (
        <div className="service-overlay" onClick={() => setShowPackageModal(false)}>
           <div className="service-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', borderRadius: '20px', padding: '24px' }}>
             <button className="close-btn" onClick={() => setShowPackageModal(false)}>✕</button>
             <h3 style={{ marginBottom: '20px' }}>{editingItem ? 'Edit Package' : 'Add Package'}</h3>
             <form onSubmit={handleSavePackage}>
               <input placeholder="Name" value={packageForm.name} onChange={(e) => setPackageForm({...packageForm, name: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
               <input type="number" placeholder="Price" value={packageForm.price} onChange={(e) => setPackageForm({...packageForm, price: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
               <button type="submit" style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px' }}>Save</button>
             </form>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
