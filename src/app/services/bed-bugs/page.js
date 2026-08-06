'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import './style.css';

const servicesData = [
  {
    id: 'ant-control',
    title: 'Ant control',
    icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'apartment-ant-control-with-utensil-removal',
        name: 'Apartment ant control (with utensil removal)',
        rating: '4.82',
        reviews: '660',
        price: 1849,
        startsAt: true,
        optionsText: '5 options',
        bullets: [
          'Complete ant treatment for confined spaces',
          'Includes thorough inspection, chemical spray & hole sealing'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'apartment-ant-control-without-utensil-removal',
        name: 'Apartment ant control (without utensil removal)',
        rating: '4.83',
        reviews: '696',
        price: 1549,
        startsAt: true,
        optionsText: '5 options',
        bullets: [
          'Complete ant treatment for confined spaces',
          'Includes thorough inspection, chemical spray & hole sealing'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'bungalow-ant-control-with-utensil-removal',
        name: 'Bungalow ant control (with utensil removal)',
        rating: '4.88',
        reviews: '30',
        price: 2398,
        startsAt: true,
        optionsText: '4 options',
        bullets: [
          'Extensive ant protection for larger areas'
        ],
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'bungalow-ant-control-without-utensil-removal',
        name: 'Bungalow ant control (without utensil removal)',
        rating: '4.88',
        reviews: '26',
        price: 2097,
        startsAt: true,
        optionsText: '4 options',
        bullets: [
          'Extensive ant protection for larger areas'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'ant-control-kitchen-bathroom-with-utensil-removal',
        name: 'Ant control - kitchen/bathroom (with utensil removal)',
        rating: '4.93',
        reviews: '361',
        price: 1249,
        startsAt: true,
        optionsText: '6 options',
        bullets: [
          'Complete ant treatment for confined spaces',
          "We'll remove utensils before the service begins"
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      },
      {
        id: 'ant-control-kitchen-bathroom-without-utensil-removal',
        name: 'Ant control - kitchen/bathroom (without utensil removal)',
        rating: '4.84',
        reviews: '458',
        price: 998,
        startsAt: true,
        optionsText: '6 options',
        bullets: [
          'Complete ant treatment for confined spaces',
          'Excludes removal of utensils & objects before the service begins'
        ],
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'bed-bug-control',
    title: 'Bed bug control',
    icon: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80',
    items: [
      {
        id: 'bed-bug-control-treatment-2-visits',
        name: 'Bed Bug Control Treatment (2 Visits included)',
        rating: '4.79',
        reviews: '48K',
        price: 1299,
        startsAt: true,
        duration: '1 hr',
        bullets: [
          '2-stage intensive spray & heat treatment for mattresses, beds & furniture',
          'Second visit included after 15 days to destroy newly hatched eggs'
        ],
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop&q=80'
      }
    ]
  }
];

export default function AntsAndBedBugsPage() {
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

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [servicesList, setServicesList] = useState(servicesData);

  // Top Banner & Page Header State
  const [headerInfo, setHeaderInfo] = useState({
    title: 'Ants & Bed Bugs',
    earliestText: 'Tue, 6:00 PM',
    rating: '4.79',
    bookings: '86K bookings',
    buttonText: 'View Services',
    bannerSubtitle: "Here's how the service is done",
    bannerImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80'
  });
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Left Sidebar Category Add/Edit State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    title: '',
    icon: ''
  });

  // View Details Modal State
  const [viewDetailsItem, setViewDetailsItem] = useState(null);
  const [viewDetailsSectionId, setViewDetailsSectionId] = useState(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState('ant-control');
  const [editingItem, setEditingItem] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    badge: '',
    isBestseller: false,
    rating: '4.8',
    reviews: '500',
    duration: '',
    optionsText: '',
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

    const storedHeader = localStorage.getItem('admin_bed_bugs_header');
    if (storedHeader) {
      try {
        setHeaderInfo(JSON.parse(storedHeader));
      } catch (e) {
        console.error(e);
      }
    }

    const storedData = localStorage.getItem('admin_bed_bugs_data');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServicesList(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

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

  // Save Banner & Header
  const handleSaveBanner = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_bed_bugs_header', JSON.stringify(headerInfo));
    setShowBannerModal(false);
    toast.success("Top banner & header updated live!");
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideoFile = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeaderInfo(prev => ({ ...prev, bannerImage: reader.result, isVideo: isVideoFile }));
    };
    reader.readAsDataURL(file);
  };

  // Add / Edit Sidebar Category
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ title: '', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80' });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (e, cat) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCategoryForm({ title: cat.title || '', icon: cat.icon || '' });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (e, catId) => {
    e.stopPropagation();
    if (confirm("Delete this category section and all its packages?")) {
      const updated = servicesList.filter(c => c.id !== catId);
      setServicesList(updated);
      localStorage.setItem('admin_bed_bugs_data', JSON.stringify(updated));
      toast.success("Category deleted successfully!");
    }
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryForm.title.trim()) return;

    let updated = [];
    if (editingCategory) {
      updated = servicesList.map(c => {
        if (c.id === editingCategory.id) {
          return { ...c, title: categoryForm.title.trim(), icon: categoryForm.icon.trim() || c.icon };
        }
        return c;
      });
    } else {
      const newCatId = categoryForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat = {
        id: newCatId,
        title: categoryForm.title.trim(),
        icon: categoryForm.icon.trim() || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
        items: []
      };
      updated = [...servicesList, newCat];
    }

    setServicesList(updated);
    localStorage.setItem('admin_bed_bugs_data', JSON.stringify(updated));
    setShowCategoryModal(false);
    toast.success(editingCategory ? "Category updated live!" : "New category added live!");
  };

  const handleCategoryIconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryForm(prev => ({ ...prev, icon: reader.result }));
    };
    reader.readAsDataURL(file);
  };

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
      reviews: '500',
      duration: '',
      optionsText: '',
      bullets: '',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
      bannerImage: ''
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
      badge: item.badge || '',
      isBestseller: !!item.bestSeller,
      rating: item.rating || '4.8',
      reviews: item.reviews || '500',
      duration: item.duration || '',
      optionsText: item.optionsText || '',
      bullets: Array.isArray(item.bullets) ? item.bullets.join('\n') : (item.bullets || ''),
      image: item.image || '',
      bannerImage: item.bannerImage || ''
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (e, sectionId, itemId) => {
    e.stopPropagation();
    if (confirm("Delete this package?")) {
      const updated = servicesList.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: sec.items.filter(i => i.id !== itemId)
          };
        }
        return sec;
      });
      setServicesList(updated);
      localStorage.setItem('admin_bed_bugs_data', JSON.stringify(updated));
      toast.success("Package deleted live!");
    }
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!packageForm.name.trim() || !packageForm.price) return;

    const bulletList = packageForm.bullets
      .split('\n')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const updated = servicesList.map(sec => {
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
                bestSeller: packageForm.isBestseller,
                rating: packageForm.rating.trim() || '4.8',
                reviews: packageForm.reviews.trim() || '500',
                duration: packageForm.duration.trim(),
                optionsText: packageForm.optionsText.trim(),
                bullets: bulletList.length > 0 ? bulletList : ['Quality service guarantee'],
                image: packageForm.image.trim() || item.image,
                bannerImage: packageForm.bannerImage?.trim() || ''
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
            bestSeller: packageForm.isBestseller,
            rating: packageForm.rating.trim() || '4.8',
            reviews: packageForm.reviews.trim() || '500',
            duration: packageForm.duration.trim(),
            optionsText: packageForm.optionsText.trim(),
            bullets: bulletList.length > 0 ? bulletList : ['Quality service guarantee'],
            image: packageForm.image.trim() || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
            bannerImage: packageForm.bannerImage?.trim() || ''
          };
          updatedItems = [...sec.items, newItem];
        }
        return { ...sec, items: updatedItems };
      }
      return sec;
    });

    setServicesList(updated);
    localStorage.setItem('admin_bed_bugs_data', JSON.stringify(updated));
    setShowPackageModal(false);
    toast.success(editingItem ? "Package updated live!" : "New package added live!");
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

  const handlePackageBannerUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPackageForm(prev => ({ ...prev, bannerImage: reader.result }));
    };
    reader.readAsDataURL(file);
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
      {/* Main Grid Container (3 Columns) */}
      <div className="bridal-makeup-container" style={{ paddingTop: '24px' }}>

        {/* LEFT COLUMN: Header Info + Sticky "SELECT A SERVICE" Widget */}
        <div className="left-sticky-sidebar-column" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Header Info Block */}
          <div className="living-header-info" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 className="living-main-title" style={{ margin: 0 }}>{headerInfo.title}</h1>
              {isAdmin && adminEditMode && (
                <button
                  onClick={() => setShowBannerModal(true)}
                  style={{
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(59,130,246,0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Edit Title, Earliest Time, Rating & Bookings"
                >
                  ✏️ Edit Title & Info
                </button>
              )}
            </div>
            
            <div className="earliest-badge" style={{ marginBottom: '8px', marginTop: '6px' }}>
              <span className="badge-dot">●</span>
              <span className="badge-label">Earliest</span>
              <span className="badge-time">{headerInfo.earliestText || 'Tue, 6:00 PM'}</span>
            </div>

            <div className="living-rating-box" style={{ marginBottom: '10px' }}>
              <span className="star-icon">★</span>
              <span className="rating-val">{headerInfo.rating}</span>
              <span className="bookings-val">({headerInfo.bookings})</span>
            </div>

            <button className="view-services-purple-btn" onClick={() => scrollToCategory(servicesList[0]?.id || 'ant-control')}>
              {headerInfo.buttonText || 'View Services'}
            </button>
          </div>

          {/* SELECT A SERVICE Grid Box (100% Sticky on Scroll!) */}
          <div className="services-sidebar" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div className="sidebar-heading" style={{ margin: 0 }}>Select a service</div>
              {isAdmin && adminEditMode && (
                <button
                  onClick={handleOpenAddCategory}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  + Add
                </button>
              )}
            </div>

            <div className="subcategory-grid">
              {servicesList.map((cat, idx) => (
                <div
                  key={`${cat.id}-${idx}`}
                  className={`subcategory-card ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => scrollToCategory(cat.id)}
                  style={{ position: 'relative' }}
                >
                  {isAdmin && adminEditMode && (
                    <div style={{ position: 'absolute', top: '2px', right: '2px', display: 'flex', gap: '2px', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEditCategory(e, cat)}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Edit Category Title & Icon"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => handleDeleteCategory(e, cat.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  )}

                  <div className="subcat-icon-wrapper">
                    <img src={cat.icon} alt={cat.title} className="subcat-img" />
                  </div>
                  <span className="subcat-name">{cat.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Hero Banner + Service Package Blocks */}
        <div className="services-main-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Image Banner Showcase */}
          <div className="full-home-video-card" style={{ width: '100%', position: 'relative', margin: 0, maxWidth: '100%' }}>
            {isAdmin && adminEditMode && (
              <button
                onClick={() => setShowBannerModal(true)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 50,
                  background: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ✏️ Edit Banner & Header
              </button>
            )}
            {headerInfo.bannerImage ? (
              headerInfo.isVideo || (headerInfo.bannerImage.startsWith('data:video') || headerInfo.bannerImage.endsWith('.mp4') || headerInfo.bannerImage.endsWith('.webm') || headerInfo.bannerImage.includes('video')) ? (
                <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                  <video 
                    id="bed-bugs-banner-video"
                    src={headerInfo.bannerImage} 
                    controls
                    autoPlay
                    muted={isVideoMuted}
                    loop
                    playsInline
                    className="video-poster-img"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const v = document.getElementById('bed-bugs-banner-video');
                      if (v) {
                        if (v.muted || isVideoMuted) {
                          v.removeAttribute('muted');
                          v.muted = false;
                          v.defaultMuted = false;
                          v.volume = 1.0;
                          setIsVideoMuted(false);
                          v.play().catch(() => {});
                        } else {
                          v.muted = true;
                          setIsVideoMuted(true);
                        }
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      const v = document.getElementById('bed-bugs-banner-video');
                      if (v) {
                        if (v.muted || isVideoMuted) {
                          v.removeAttribute('muted');
                          v.muted = false;
                          v.defaultMuted = false;
                          v.volume = 1.0;
                          setIsVideoMuted(false);
                          v.play().catch(() => {});
                        } else {
                          v.muted = true;
                          setIsVideoMuted(true);
                        }
                      }
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: isVideoMuted ? '#ef4444' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      zIndex: 30,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      touchAction: 'manipulation'
                    }}
                  >
                    {isVideoMuted ? '🔇 Tap for Sound' : '🔊 Sound On'}
                  </button>
                </div>
              ) : (
                <img 
                  src={headerInfo.bannerImage} 
                  alt={headerInfo.bannerSubtitle}
                  className="video-poster-img"
                />
              )
            ) : (
              <div className="video-poster-img" style={{ width: '100%', height: '140px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
                📷 No Banner Media Selected
              </div>
            )}
            <div className="video-text-subtitle">
              {headerInfo.bannerSubtitle}
            </div>
          </div>
          {servicesList.map((category, cIdx) => (
            <div key={`${category.id}-${cIdx}`} id={category.id} className="category-block">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="category-block-title" style={{ margin: 0 }}>{category.title}</h2>
                {isAdmin && adminEditMode && (
                  <button
                    onClick={() => handleOpenAddPackage(category.id)}
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

              <div className="packages-list">
                {category.items.map((item, itemIdx) => {
                  const qty = getItemQuantity(item.id);
                  return (
                    <div key={`${item.id}-${itemIdx}`} className="package-card" style={{ position: 'relative' }}>
                      {isAdmin && adminEditMode && (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                          <button
                            onClick={(e) => handleOpenEditPackage(e, category.id, item)}
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Edit Package & Discounts"
                          >
                            ✏️ Edit Package
                          </button>
                          <button
                            onClick={(e) => handleDeletePackage(e, category.id, item.id)}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Delete Package"
                          >
                            🗑️
                          </button>
                        </div>
                      )}

                      {item.bannerImage && (
                        <div style={{ width: '100%', marginBottom: '14px', borderRadius: '12px', overflow: 'hidden' }}>
                          <img src={item.bannerImage} alt={item.name} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} />
                        </div>
                      )}

                      <div className="package-info">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          {item.bestSeller && (
                            <div className="package-badge-best" style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                              ★ Bestseller
                            </div>
                          )}
                          {item.badge && (
                            <div style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                              🔥 {item.badge}
                            </div>
                          )}
                        </div>

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
                            <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px', fontSize: '13px' }}>
                              ₹{item.originalPrice}
                            </span>
                          )}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span style={{ color: '#16a34a', fontWeight: '800', marginLeft: '6px', fontSize: '12px' }}>
                              ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF)
                            </span>
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
                        <a className="view-details-link">
                          View details
                        </a>
                      </div>

                      <div className="package-image-side" style={{ position: 'relative', width: '120px', height: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="package-img-wrapper" style={{ width: '120px', height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                          <img src={item.image} alt={item.name} className="package-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        {qty > 0 ? (
                          <div className="quantity-adjuster-btn">
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, qty - 1)}>-</button>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{qty}</span>
                            <button className="qty-btn" onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
                          </div>
                        ) : (
                          <button className="add-to-cart-action-btn" onClick={() => handleAddClick(item)}>
                            Add
                          </button>
                        )}
                        {item.optionsText && (
                          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '16px', fontWeight: '500' }}>
                            {item.optionsText}
                          </span>
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
              <text x="50" y="60" textAnchor="middle" fill="#0369a1" fontSize="9">HYGIENIC</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ON-PAGE ADMIN PACKAGE MODAL */}
      {showPackageModal && (
        <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowPackageModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setShowPackageModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
              {editingItem ? "Edit Service Package & Discounts" : "Add New Service Package"}
            </h3>

            <form onSubmit={handleSavePackage}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Package Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apartment ant control, Bed bug 2-visit treatment"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 1849"
                    value={packageForm.price}
                    onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Original MRP (₹) (Strike-through)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2499"
                    value={packageForm.originalPrice}
                    onChange={(e) => setPackageForm({ ...packageForm, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Flash Discount Badge / Special Tag (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Flash Sale 30% OFF, Festive Special, Upto 40% OFF"
                  value={packageForm.badge}
                  onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <input
                  type="checkbox"
                  id="bestseller-chk-bed"
                  checked={packageForm.isBestseller}
                  onChange={(e) => setPackageForm({ ...packageForm, isBestseller: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="bestseller-chk-bed" style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
                  ★ Mark as Bestseller Package
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 hr 30 mins"
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Rating ★</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.8"
                    value={packageForm.rating}
                    onChange={(e) => setPackageForm({ ...packageForm, rating: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Reviews Count</label>
                  <input
                    type="text"
                    placeholder="e.g. 500"
                    value={packageForm.reviews}
                    onChange={(e) => setPackageForm({ ...packageForm, reviews: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Bullet Points / Features (1 point per line)</label>
                <textarea
                  rows={3}
                  placeholder="Complete ant treatment for confined spaces&#10;Includes chemical spray & hole sealing"
                  value={packageForm.bullets}
                  onChange={(e) => setPackageForm({ ...packageForm, bullets: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Package Image / Photo</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Image URL or upload →"
                    value={packageForm.image}
                    onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePackageImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Package Top Offer Banner (Optional Big Banner)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Banner Image URL or upload →"
                    value={packageForm.bannerImage || ''}
                    onChange={(e) => setPackageForm({ ...packageForm, bannerImage: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#6366f1', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    Upload Banner
                    <input type="file" accept="image/*" onChange={handlePackageBannerUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                {editingItem ? "Save Package & Discounts Live" : "Publish Package Live"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TOP BANNER & HEADER MODAL */}
      {showBannerModal && (
        <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowBannerModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setShowBannerModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
              Edit Page Banner & Header Info
            </h3>

            <form onSubmit={handleSaveBanner}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Page Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ants & Bed Bugs"
                  value={headerInfo.title}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Earliest Service Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Tue, 6:00 PM"
                    value={headerInfo.earliestText || ''}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, earliestText: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. View Services"
                    value={headerInfo.buttonText || ''}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, buttonText: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Rating ★</label>
                  <input
                    type="text"
                    value={headerInfo.rating}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, rating: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Bookings Count</label>
                  <input
                    type="text"
                    value={headerInfo.bookings}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, bookings: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Showcase Banner Subtitle / Text</label>
                <input
                  type="text"
                  value={headerInfo.bannerSubtitle}
                  onChange={(e) => setHeaderInfo({ ...headerInfo, bannerSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Showcase Banner Photo / Video</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Paste Photo / Video URL or upload →"
                    value={headerInfo.bannerImage}
                    onChange={(e) => setHeaderInfo({ ...headerInfo, bannerImage: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', minWidth: '180px' }}
                  />
                  <label style={{ padding: '10px 12px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    📷 Upload Photo
                    <input type="file" accept="image/*" onChange={handleBannerImageUpload} style={{ display: 'none' }} />
                  </label>
                  <label style={{ padding: '10px 12px', background: '#8b5cf6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    🎥 Upload Video
                    <input type="file" accept="video/*" onChange={handleBannerImageUpload} style={{ display: 'none' }} />
                  </label>
                  {headerInfo.bannerImage && (
                    <button
                      type="button"
                      onClick={() => setHeaderInfo({ ...headerInfo, bannerImage: '', isVideo: false })}
                      style={{ padding: '10px 12px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      🗑️ Remove Media
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                Save Banner & Header Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SIDEBAR CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setShowCategoryModal(false)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
            <button onClick={() => setShowCategoryModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
              {editingCategory ? "Edit Sidebar Category" : "Add New Sidebar Category"}
            </h3>

            <form onSubmit={handleSaveCategory}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Category Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ant control, Termite treatment"
                  value={categoryForm.title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Category Icon / Photo</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Paste Icon URL or upload →"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                  <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    Upload Icon
                    <input type="file" accept="image/*" onChange={handleCategoryIconUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
              >
                {editingCategory ? "Save Category Changes" : "Publish Category Live"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS POP-UP MODAL */}
      {viewDetailsItem && (
        <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setViewDetailsItem(null)}>
          <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '540px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '0', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Close Button */}
            <button onClick={() => setViewDetailsItem(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'rgba(255,255,255,0.9)', width: '36px', height: '36px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer', zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>×</button>

            {/* Package Banner Image */}
            {viewDetailsItem.image && (
              <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                <img src={viewDetailsItem.image} alt={viewDetailsItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {viewDetailsItem.bestSeller && (
                  <span style={{ position: 'absolute', bottom: '12px', left: '16px', background: '#3b82f6', color: '#ffffff', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                    ★ BESTSELLER
                  </span>
                )}
              </div>
            )}

            <div style={{ padding: '24px' }}>
              {/* Title & Edit Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{viewDetailsItem.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                    <span style={{ color: '#f59e0b', fontWeight: '800' }}>★ {viewDetailsItem.rating || '4.8'}</span>
                    <span>({viewDetailsItem.reviews || '500'} reviews)</span>
                    {viewDetailsItem.duration && (
                      <>
                        <span>•</span>
                        <span>{viewDetailsItem.duration}</span>
                      </>
                    )}
                  </div>
                </div>

                {isAdmin && adminEditMode && (
                  <button
                    onClick={(e) => {
                      const targetSecId = viewDetailsSectionId || (servicesList[0] && servicesList[0].id);
                      setViewDetailsItem(null);
                      handleOpenEditPackage(e, targetSecId, viewDetailsItem);
                    }}
                    style={{ background: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                  >
                    ✏️ Edit Details & Photo
                  </button>
                )}
              </div>

              {/* Price & Discounts */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>₹{viewDetailsItem.price}</span>
                {viewDetailsItem.originalPrice && viewDetailsItem.originalPrice > viewDetailsItem.price && (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '15px' }}>₹{viewDetailsItem.originalPrice}</span>
                    <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '13px' }}>
                      ({Math.round(((viewDetailsItem.originalPrice - viewDetailsItem.price) / viewDetailsItem.originalPrice) * 100)}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Highlights & Inclusions */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  What is Included / Package Highlights
                </h4>
                {Array.isArray(viewDetailsItem.bullets) && viewDetailsItem.bullets.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.7' }}>
                    {viewDetailsItem.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ marginBottom: '6px' }}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                    Professional inspection, high-quality service, and 30-day service warranty included.
                  </p>
                )}
              </div>

              {/* Add to Cart / Quantity Adjuster inside View Details Modal */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Total Price</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>₹{viewDetailsItem.price}</div>
                </div>

                {getItemQuantity(viewDetailsItem.id) > 0 ? (
                  <div className="quantity-adjuster-btn" style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}>
                    <button className="qty-btn" onClick={() => updateQuantity(viewDetailsItem.id, getItemQuantity(viewDetailsItem.id) - 1)}>-</button>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{getItemQuantity(viewDetailsItem.id)}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(viewDetailsItem.id, getItemQuantity(viewDetailsItem.id) + 1)}>+</button>
                  </div>
                ) : (
                  <button
                    className="add-to-cart-action-btn"
                    onClick={() => handleAddToCart(viewDetailsItem)}
                    style={{ position: 'relative', bottom: 0, left: 0, transform: 'none', padding: '10px 28px', fontSize: '14px', fontWeight: '800' }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

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
