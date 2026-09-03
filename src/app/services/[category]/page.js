'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import '../bridal-makeup/style.css';
import '../services.css';

export default function ServicePage() {
    const params = useParams();
    const router = useRouter();
    const categoryKey = params.category;
    const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
    


    // Generate formatted title from slug
    const formattedTitle = categoryKey
      ? categoryKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      : 'Service Details';

    // State for dynamic content
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);
    const [dbCategoryId, setDbCategoryId] = useState(null);

    const [headerInfo, setHeaderInfo] = useState({
      title: formattedTitle,
      earliestText: 'Today, In 45 mins',
      rating: '4.8',
      bookings: '50K bookings',
      buttonText: 'View Services',
      bannerSubtitle: `Professional ${formattedTitle} Services at Home`,
      bannerImage: ''
    });
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(true);

    // Initial default categories for fallback
    const defaultData = [
      {
        id: 'packages',
        title: 'Packages & Services',
        icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&q=80',
        items: [
          {
            id: `${categoryKey}-basic-package`,
            name: `Basic ${formattedTitle} Package`,
            rating: '4.8',
            reviews: '12K',
            price: 499,
            originalPrice: 699,
            duration: '45 mins',
            bullets: ['Professional service technician', 'Includes standard inspection & service'],
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80',
            bestSeller: true
          },
          {
            id: `${categoryKey}-premium-package`,
            name: `Premium ${formattedTitle} Package`,
            rating: '4.9',
            reviews: '8K',
            price: 899,
            originalPrice: 1199,
            badge: 'Upto 25% OFF',
            duration: '90 mins',
            bullets: ['Comprehensive deep service & cleaning', '30 days service warranty included'],
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop&q=80',
            bestSeller: false
          }
        ]
      }
    ];

    const [servicesList, setServicesList] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [activeSection, setActiveSection] = useState('packages');

    // View Details Modal State
    const [viewDetailsItem, setViewDetailsItem] = useState(null);
    const [viewDetailsSectionId, setViewDetailsSectionId] = useState(null);

    // Sidebar Cat Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ title: '', icon: '' });

    // Package Modal State
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [packageEditMode, setPackageEditMode] = useState('full');
    const [targetSectionId, setTargetSectionId] = useState('packages');
    const [editingItem, setEditingItem] = useState(null);
    const [packageForm, setPackageForm] = useState({
      name: '',
      price: '',
      originalPrice: '',
      badge: '',
      isBestseller: false,
      rating: '4.8',
      reviews: '5K',
      duration: '45 mins',
      bullets: '',
      details: '',
      image: ''
    });

    const saveCategoryToDB = async (updatedHeader, updatedList) => {
      // Sync to localStorage
      if (updatedHeader) {
        localStorage.setItem(`admin_service_${categoryKey}_header`, JSON.stringify(updatedHeader));
      }
      if (updatedList) {
        localStorage.setItem(`admin_service_${categoryKey}_data`, JSON.stringify(updatedList));
      }

      // Sync to MongoDB Category document
      const targetId = categoryKey;
      if (targetId) {
        try {
          const payload = {};
          if (updatedHeader) payload.headerInfo = updatedHeader;
          if (updatedList) payload.servicesList = updatedList;

          await fetch(`/api/admin/categories/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.error('Failed to save category details to MongoDB:', err);
        }
      }
    };

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

      // Fetch category from MongoDB API by slug/id
      const fetchCategory = async () => {
        try {
          const res = await fetch(`/api/admin/categories/${categoryKey}`);
          const json = await res.json();
          if (json.success && json.category) {
            setDbCategoryId(json.category._id);
            
            let finalHeader = json.category.headerInfo;
            let finalServices = json.category.servicesList;
            let needsSync = false;

            // Priority: MongoDB Database -> LocalStorage -> Fallback Defaults
            if (json.category.headerInfo) {
              setHeaderInfo(json.category.headerInfo);
            } else {
              const storedHeader = localStorage.getItem(`admin_service_${categoryKey}_header`);
              if (storedHeader) {
                try {
                  const parsed = JSON.parse(storedHeader);
                  if (parsed && (parsed.bannerImage === '/baglamukhi-banner.jpg' || !parsed.bannerImage)) {
                    parsed.bannerImage = '/home-cleaning-banner.png';
                  }
                  setHeaderInfo(parsed);
                  finalHeader = parsed;
                  needsSync = true;
                } catch(e) {}
              }
            }
            
            if (Array.isArray(json.category.servicesList) && json.category.servicesList.length > 0) {
              setServicesList(json.category.servicesList);
            } else {
              const storedData = localStorage.getItem(`admin_service_${categoryKey}_data`);
              if (storedData) {
                try {
                  const parsed = JSON.parse(storedData);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setServicesList(parsed);
                    finalServices = parsed;
                    needsSync = true;
                  }
                } catch(e) {}
              }
            }
            // Only display from DB — no auto-write to MongoDB from localStorage
          } else {
            // Category missing in DB — only show from localStorage if available, do NOT write to MongoDB
            const storedHeader = localStorage.getItem(`admin_service_${categoryKey}_header`);
            const storedData = localStorage.getItem(`admin_service_${categoryKey}_data`);
            if (storedHeader) {
              try {
                const parsed = JSON.parse(storedHeader);
                if (parsed) setHeaderInfo(parsed);
              } catch(e) {}
            }
            if (storedData) {
              try {
                const parsed = JSON.parse(storedData);
                if (Array.isArray(parsed) && parsed.length > 0) setServicesList(parsed);
              } catch(e) {}
            }
          }
        } catch (e) {
          console.error("Failed to fetch category from DB API:", e);
          const storedHeader = localStorage.getItem(`admin_service_${categoryKey}_header`);
          if (storedHeader) {
            try {
              const parsed = JSON.parse(storedHeader);
              if (parsed && (parsed.bannerImage === '/baglamukhi-banner.jpg' || !parsed.bannerImage)) {
                parsed.bannerImage = '/home-cleaning-banner.png';
              }
              setHeaderInfo(parsed);
            } catch (err) {}
          }
          const storedData = localStorage.getItem(`admin_service_${categoryKey}_data`);
          if (storedData) {
            try {
              const parsed = JSON.parse(storedData);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setServicesList(parsed);
              }
            } catch (err) {}
          }
        } finally {
          setIsDataLoaded(true);
        }
      };

      fetchCategory();

      window.addEventListener('storage', checkAdmin);
      window.addEventListener('focus', checkAdmin);
      window.addEventListener('admin_edit_mode_changed', checkAdmin);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', checkAdmin);
        window.removeEventListener('focus', checkAdmin);
        window.removeEventListener('admin_edit_mode_changed', checkAdmin);
      };
    }, [categoryKey, dbCategoryId]);

    const handleSaveBanner = (e) => {
      e.preventDefault();
      saveCategoryToDB(headerInfo, servicesList);
      setShowBannerModal(false);
      toast.success("Banner updated live!");
    };

    const handleBannerImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const isVideoFile = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => setHeaderInfo(prev => ({ ...prev, bannerImage: reader.result, isVideo: isVideoFile }));
      reader.readAsDataURL(file);
    };

    // Sidebar Category Handlers
    const handleOpenAddCategory = () => {
      setEditingCategory(null);
      setCategoryForm({ title: '', icon: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&q=80' });
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
        saveCategoryToDB(headerInfo, updated);
        toast.success("Category deleted!");
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
          icon: categoryForm.icon.trim() || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=100&h=100&fit=crop&q=80',
          items: []
        };
        updated = [...servicesList, newCat];
      }

      setServicesList(updated);
      saveCategoryToDB(headerInfo, updated);
      setShowCategoryModal(false);
      toast.success(editingCategory ? "Category updated!" : "New category added!");
    };

    const handleCategoryIconUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setCategoryForm(prev => ({ ...prev, icon: reader.result }));
      reader.readAsDataURL(file);
    };

    // Package Handlers
    const handleOpenAddPackage = (sectionId) => {
      setTargetSectionId(sectionId);
      setEditingItem(null);
      setPackageEditMode('full');
      setPackageForm({
        displayType: 'standard',
        name: '',
        price: '',
        originalPrice: '',
        badge: '',
        isBestseller: false,
        rating: '4.8',
        reviews: '5K',
        duration: '45 mins',
        bullets: '',
        details: '',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop&q=80'
      });
      setShowPackageModal(true);
    };

    const handleOpenEditPackage = (e, sectionId, item, mode = 'full') => {
      e.stopPropagation();
      setTargetSectionId(sectionId);
      setEditingItem(item);
      setPackageEditMode(mode);
      setPackageForm({
        displayType: item.displayType || 'standard',
        name: item.name || '',
        price: item.price || '',
        originalPrice: item.originalPrice || '',
        badge: item.badge || item.discountTag || '',
        isBestseller: !!item.bestSeller,
        rating: item.rating || '4.8',
        reviews: item.reviews || '5K',
        duration: item.duration || '',
        bullets: Array.isArray(item.bullets) ? item.bullets.join('\n') : (item.bullets || ''),
        details: item.details || '',
        image: item.image || ''
      });
      setShowPackageModal(true);
    };

    const handleDeletePackage = (e, sectionId, itemId) => {
      e.stopPropagation();
      if (confirm("Delete this item?")) {
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
        saveCategoryToDB(headerInfo, updated);
        toast.success("Item deleted!");
      }
    };

    const handleSavePackage = (e) => {
      e.preventDefault();
      const isBanner = packageForm.displayType === 'banner';

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
                  displayType: packageForm.displayType || 'standard',
                  name: packageForm.name.trim(),
                  price: Number(packageForm.price) || 0,
                  originalPrice: packageForm.originalPrice ? Number(packageForm.originalPrice) : undefined,
                  badge: packageForm.badge.trim(),
                  bestSeller: packageForm.isBestseller,
                  rating: packageForm.rating.trim(),
                  reviews: packageForm.reviews.trim(),
                  duration: packageForm.duration.trim(),
                  bullets: bulletList,
                  details: packageForm.details || '',
                  image: packageForm.image.trim()
                };
              }
              return item;
            });
          } else {
            const newItem = {
              id: `pkg-${Date.now()}`,
              displayType: packageForm.displayType || 'standard',
              name: packageForm.name.trim(),
              price: Number(packageForm.price) || 0,
              originalPrice: packageForm.originalPrice ? Number(packageForm.originalPrice) : undefined,
              badge: packageForm.badge.trim(),
              bestSeller: packageForm.isBestseller,
              rating: packageForm.rating.trim(),
              reviews: packageForm.reviews.trim(),
              duration: packageForm.duration.trim(),
              bullets: bulletList,
              details: packageForm.details || '',
              image: packageForm.image.trim()
            };
            updatedItems = [...sec.items, newItem];
          }
          return { ...sec, items: updatedItems };
        }
        return sec;
      });

      setServicesList(updated);
      saveCategoryToDB(headerInfo, updated);
      setShowPackageModal(false);
      toast.success(editingItem ? "Package updated!" : "Package added!");
    };

    const handlePackageImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setPackageForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    };

    const handlePackageBannerUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setPackageForm(prev => ({ ...prev, bannerImage: reader.result }));
      reader.readAsDataURL(file);
    };

    const handleAddToCart = (item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: headerInfo.title
      });
      toast.success(`${item.name} added to cart!`);
    };

    const getItemQuantity = (itemId) => {
      const found = cart.find(c => c.id === itemId);
      return found ? found.quantity : 0;
    };

    const activeCatObj = servicesList.find(c => c.id === activeSection) || servicesList[0];

    if (!isDataLoaded) {
      return (
        <div className="bridal-makeup-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '16px', fontWeight: '600' }}>
            Loading Details...
          </div>
        </div>
      );
    }

    return (
      <div className="bridal-makeup-page-wrapper">
        <Header />

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
              
              <div className="earliest-badge" style={{ marginBottom: '10px', marginTop: '6px' }}>
                <span className="badge-dot">●</span>
                <span className="badge-label">Earliest</span>
                <span className="badge-time">{headerInfo.earliestText || 'Today, In 45 mins'}</span>
              </div>

              <div className="living-rating-box">
                <span className="star-icon">★</span>
                <span className="rating-val">{headerInfo.rating}</span>
                <span className="bookings-val">({headerInfo.bookings})</span>
              </div>

              <button className="view-services-purple-btn" onClick={() => {
                const el = document.getElementById(servicesList[0]?.id || 'packages');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>
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
                    className={`subcategory-card ${activeSection === cat.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(cat.id);
                      const el = document.getElementById(cat.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
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

          {/* CENTER COLUMN: Top Hero Banner + Service Package Blocks */}
          <div className="services-main-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="category-hero-video-card" style={{ width: '100%', position: 'relative', margin: 0, maxWidth: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden' }}>
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
                      id="category-banner-video"
                      src={headerInfo.bannerImage} 
                      controls
                      autoPlay
                      muted={isVideoMuted}
                      loop
                      playsInline
                      className="category-hero-banner-img"
                      style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const v = document.getElementById('category-banner-video');
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
                        const v = document.getElementById('category-banner-video');
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
                    className="category-hero-banner-img"
                    style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', display: 'block' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/home-cleaning-banner.png';
                    }}
                  />
                )
              ) : (
                <div className="category-hero-banner-img" style={{ width: '100%', height: '140px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
                  📷 No Banner Media Selected
                </div>
              )}
              <div className="video-text-subtitle">
                {headerInfo.bannerSubtitle}
              </div>
            </div>
            {servicesList.map((category, cIdx) => (
              <div key={`${category.id}-${cIdx}`} id={category.id} className="category-block" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 className="category-block-title" style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{category.title}</h2>
                  {isAdmin && adminEditMode && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => handleOpenEditCategory(e, category)}
                        style={{
                          background: '#3b82f6',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        ✏️ Edit Section Banner
                      </button>
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
                    </div>
                  )}
                </div>

                {/* CATEGORY SECTION TOP HERO BANNER (100% Full-width at TOP of Section) */}
                {(category.banner || category.bannerImage) && (
                  <div style={{ width: '100%', marginBottom: '20px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    <img
                      src={category.banner || category.bannerImage}
                      alt={category.title}
                      style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block', borderRadius: '16px' }}
                    />
                  </div>
                )}

                <div className="packages-list">
                  {category.items && category.items.length > 0 ? (
                    category.items.map((item, itemIdx) => {
                      const qty = getItemQuantity(item.id);

                      if (item.displayType === 'banner') {
                        return (
                          <div key={`${item.id}-${itemIdx}`} style={{ width: '100%', marginBottom: '24px', position: 'relative', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                            {isAdmin && adminEditMode && (
                              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                                <button
                                  onClick={(e) => handleOpenEditPackage(e, category.id, item)}
                                  style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  title="Edit Offer Banner Package"
                                >
                                  ✏️ Edit Banner
                                </button>
                                <button
                                  onClick={(e) => handleDeletePackage(e, category.id, item.id)}
                                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  title="Delete Banner Package"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}

                            {/* Top Big Offer Banner Image */}
                            {item.image && (
                              <div style={{ width: '100%', height: '220px', overflow: 'hidden', background: '#f8fafc' }}>
                                <img
                                  src={item.image}
                                  alt={item.name || 'Special Offer Banner'}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                              </div>
                            )}

                            {/* Package Info Content Below Banner */}
                            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                              <div className="package-info" style={{ flex: 1 }}>
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
                                  <h3 className="package-title" style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                                </div>
                                <div className="package-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                                  <span className="star" style={{ color: '#10b981' }}>★</span>
                                  <span style={{ fontWeight: '700', color: '#0f172a' }}>{item.rating}</span>
                                  <span>({item.reviews} reviews)</span>
                                </div>
                                <div className="package-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                                  <span>₹{item.price}</span>
                                  {item.originalPrice && (
                                    <span style={{ textDecoration: 'line-through', color: '#888', marginLeft: '4px', fontSize: '13px', fontWeight: '500' }}>
                                      ₹{item.originalPrice}
                                    </span>
                                  )}
                                  {item.originalPrice && item.originalPrice > item.price && (
                                    <span style={{ color: '#16a34a', fontWeight: '800', marginLeft: '4px', fontSize: '12px' }}>
                                      ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF)
                                    </span>
                                  )}
                                  {item.duration && (
                                    <>
                                      <span style={{ color: '#94a3b8' }}>•</span>
                                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>{item.duration}</span>
                                    </>
                                  )}
                                </div>
                                <ul className="package-bullets" style={{ paddingLeft: '18px', margin: '0 0 12px 0', color: '#334155', fontSize: '13px', lineHeight: '1.6' }}>
                                  {item.bullets && item.bullets.map((bullet, idx) => (
                                    <li key={idx}>{bullet}</li>
                                  ))}
                                </ul>
                                <a className="view-details-link" onClick={(e) => { e.preventDefault(); setViewDetailsItem(item); setViewDetailsSectionId(category.id); }} style={{ color: '#6366f1', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                                  View details
                                </a>
                              </div>

                              {/* Add Button Action on Right */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
                                {qty > 0 ? (
                                  <div className="quantity-adjuster-btn" style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}>
                                    <button className="qty-btn" onClick={() => updateQuantity(item.id, qty - 1)}>-</button>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{qty}</span>
                                    <button className="qty-btn" onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
                                  </div>
                                ) : (
                                  <button className="add-to-cart-action-btn" onClick={() => handleAddToCart(item)} style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}>
                                    Add
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }

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
                              <span>₹{item.price}</span>
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
                              {item.bullets && item.bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                            </ul>
                            <a className="view-details-link" onClick={(e) => { e.preventDefault(); setViewDetailsItem(item); setViewDetailsSectionId(category.id); }}>
                              View details
                            </a>
                          </div>

                          <div className="package-image-side" style={{ position: 'relative', width: '120px', height: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {item.image && (
                              <div className="package-img-wrapper" style={{ width: '120px', height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                                <img src={item.image} alt={item.name} className="package-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                            {qty > 0 ? (
                              <div className="quantity-adjuster-btn">
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, qty - 1)}>-</button>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{qty}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
                              </div>
                            ) : (
                              <button className="add-to-cart-action-btn" onClick={() => handleAddToCart(item)}>
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                      No packages added to this category section yet.
                      {isAdmin && adminEditMode && (
                        <div style={{ marginTop: '12px' }}>
                          <button onClick={() => handleOpenAddPackage(category.id)} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                            + Add First Package Now
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - UC Promise */}
          <div className="makeup-right-sidebar">
            <div className="uc-promise-card">
              <div className="promise-title">UC Promise</div>
              <ul className="promise-list">
                <li className="promise-item">
                  <span className="promise-icon">✓</span>
                  <span>Verified Professionals</span>
                </li>
                <li className="promise-item">
                  <span className="promise-icon">✓</span>
                  <span>Transparent Pricing</span>
                </li>
                <li className="promise-item">
                  <span className="promise-icon">✓</span>
                  <span>Satisfaction Guaranteed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* EDIT TOP BANNER & HEADER MODAL */}
        {showBannerModal && (
          <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
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
                      placeholder="e.g. Today, In 45 mins"
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Showcase Banner Photo</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Paste Photo URL or upload →"
                      value={headerInfo.bannerImage}
                      onChange={(e) => setHeaderInfo({ ...headerInfo, bannerImage: e.target.value })}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', minWidth: '180px' }}
                    />
                    <label style={{ padding: '10px 12px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      📷 Upload Photo
                      <input type="file" accept="image/*" onChange={handleBannerImageUpload} style={{ display: 'none' }} />
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
          <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
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
                    placeholder="e.g. Service Packages, Add-ons"
                    value={categoryForm.title}
                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
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

        {/* ON-PAGE ADMIN PACKAGE MODAL */}
        {showPackageModal && (
          <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
            <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative' }}>
              <button onClick={() => setShowPackageModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                {packageEditMode === 'details' ? "Edit Service Details" : (editingItem ? "Edit Service Package & Discounts" : "Add New Service Package")}
              </h3>

              <form onSubmit={handleSavePackage}>
                {packageEditMode === 'full' && (
                  <>
                <div style={{ marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                    Choose Display Type / Mode *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPackageForm({ ...packageForm, displayType: 'standard' })}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: packageForm.displayType === 'standard' ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        background: packageForm.displayType === 'standard' ? '#eff6ff' : '#ffffff',
                        color: packageForm.displayType === 'standard' ? '#1d4ed8' : '#64748b',
                        fontWeight: '800',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: packageForm.displayType === 'standard' ? '0 2px 8px rgba(59,130,246,0.2)' : 'none'
                      }}
                    >
                      📦 Package Card<br/><span style={{ fontSize: '10px', fontWeight: '500' }}>(Thumbnail + Floating Add)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageForm({ ...packageForm, displayType: 'banner' })}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: packageForm.displayType === 'banner' ? '2px solid #6366f1' : '1px solid #cbd5e1',
                        background: packageForm.displayType === 'banner' ? '#eef2ff' : '#ffffff',
                        color: packageForm.displayType === 'banner' ? '#4338ca' : '#64748b',
                        fontWeight: '800',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        boxShadow: packageForm.displayType === 'banner' ? '0 2px 8px rgba(99,102,241,0.2)' : 'none'
                      }}
                    >
                      🖼️ Big Offer Banner<br/><span style={{ fontSize: '10px', fontWeight: '500' }}>(Urban Company Style)</span>
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Package Title / Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Deep Cleaning Service, Standard Repair"
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Selling Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 499"
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Original MRP (₹) (Strike-through)</label>
                    <input
                      type="number"
                      placeholder="e.g. 699"
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
                    placeholder="e.g. Flash Sale 30% OFF, Festive Special"
                    value={packageForm.badge}
                    onChange={(e) => setPackageForm({ ...packageForm, badge: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="checkbox"
                    id="bestseller-chk-gen"
                    checked={packageForm.isBestseller}
                    onChange={(e) => setPackageForm({ ...packageForm, isBestseller: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="bestseller-chk-gen" style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
                    ★ Mark as Bestseller Package
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 45 mins"
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
                      placeholder="e.g. 5K"
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
                    placeholder="Professional service technician&#10;Includes 30 days warranty"
                    value={packageForm.bullets}
                    onChange={(e) => setPackageForm({ ...packageForm, bullets: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                </>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Service Details / Highlights (MS Word Editor)</label>
                  <div style={{ background: '#fff' }}>
                    <ReactQuill
                      theme="snow"
                      value={packageForm.details}
                      onChange={(val) => setPackageForm({ ...packageForm, details: val })}
                      placeholder="Describe your package here... You can add images, bold text, lists, etc."
                      style={{ height: '150px', marginBottom: '40px' }}
                    />
                  </div>
                </div>

                {packageEditMode === 'full' && (
                  <>
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
                </>
                )}

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

        {/* VIEW DETAILS POP-UP MODAL */}
        {viewDetailsItem && (
          <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setViewDetailsItem(null)}>
            <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '20px', maxWidth: '540px', width: '92%', maxHeight: '90vh', overflowY: 'auto', padding: '0', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              
              {/* Modal Close Button */}
              <button onClick={() => setViewDetailsItem(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'rgba(255,255,255,0.9)', width: '36px', height: '36px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer', zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>×</button>



              <div style={{ padding: '24px' }}>
                {/* Edit Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>

                  {isAdmin && adminEditMode && (
                    <button
                      onClick={(e) => {
                        const targetSecId = viewDetailsSectionId || (servicesList[0] && servicesList[0].id);
                        setViewDetailsItem(null);
                        handleOpenEditPackage(e, targetSecId, viewDetailsItem, 'details');
                      }}
                      style={{ background: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}
                    >
                      ✏️ Edit Details & Photo
                    </button>
                  )}
                </div>



                {/* Highlights & Inclusions */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    What is Included / Package Highlights
                  </h4>
                  {viewDetailsItem.details ? (
                    <div className="rich-text-content" style={{ color: '#334155', fontSize: '14px', lineHeight: '1.7' }} dangerouslySetInnerHTML={{ __html: viewDetailsItem.details }} />
                  ) : Array.isArray(viewDetailsItem.bullets) && viewDetailsItem.bullets.length > 0 ? (
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

        <Footer />
      </div>
    );
}
