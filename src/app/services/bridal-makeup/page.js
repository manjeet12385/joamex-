'use client';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, ChevronRight } from 'lucide-react';
import './style.css';

// Custom data matching the Urban Company styling and user interface screenshot
const servicesData = [
  {
    id: 'packages',
    title: 'Packages',
    items: [
      {
        id: 'basic-makeup-package',
        name: 'Basic makeup package',
        rating: '4.71',
        reviews: '12K',
        price: 2099,
        duration: '1 hr 30 mins',
        bullets: [
          'Ideal for daytime events, office occasions & brunches',
          'Includes basic makeup & basic hairstyling'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        bestSeller: true
      },
      {
        id: 'luxe-makeup-package',
        name: 'Luxe makeup package',
        rating: '4.67',
        reviews: '2K',
        price: 3799,
        duration: '2 hrs',
        bullets: [
          'Ideal for festive gatherings, parties & wedding celebrations',
          'Includes Luxe makeup & advance hairstyling'
        ],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'hd-makeup-package',
        name: 'HD makeup package',
        rating: '4.74',
        reviews: '1K',
        price: 3299,
        duration: '1 hr 45 mins',
        bullets: [
          'Ideal for formal events, evening functions & photoshoots',
          'Includes HD makeup & advance hairstyling'
        ],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'group-deals',
    title: 'Group deals',
    items: [
      {
        id: 'makeup-pack-trio',
        name: 'Makeup pack trio',
        rating: '4.90',
        reviews: '78',
        price: 4317,
        startsAt: true,
        bullets: [
          'Makeup for 3 at a special price — ideal for parties & celebrations.'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'advanced-hair-styling-trio',
        name: 'Advanced hair styling trio',
        rating: '4.74',
        reviews: '127',
        price: 2797,
        originalPrice: 2997,
        duration: '2 hrs 40 mins',
        bullets: [
          'Advanced hairstyles for 3 - perfect for parties & events.',
          'Get a flat ₹200 off with this exclusive deal.'
        ],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'saree-draping',
    title: 'Saree draping',
    icon: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'basic-saree-draping',
        name: 'Basic saree draping',
        rating: '4.73',
        reviews: '38K',
        price: 499,
        duration: '20 mins',
        bullets: [
          'Choose any saree/sari or lehenga draping style'
        ],
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'advanced-saree-draping',
        name: 'Advanced saree draping',
        rating: '4.77',
        reviews: '2K',
        price: 699,
        duration: '30 mins',
        bullets: [
          'Choose from double-pallu, heavy dupatta, or a lehenga style draping'
        ],
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'wedding-combos',
    title: 'Wedding combos',
    icon: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'premium-wedding-combo',
        name: 'Premium wedding combo',
        rating: '4.73',
        reviews: '62K',
        price: 4249,
        originalPrice: 4497,
        duration: '2 hrs 40 mins',
        bullets: [
          'Luxe full-glam glow with high-end products for radiant, long-lasting perfection'
        ],
        image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'complete-event-combo',
        name: 'Complete event combo',
        rating: '4.73',
        reviews: '64K',
        price: 3749,
        originalPrice: 3997,
        duration: '2 hrs 20 mins',
        bullets: [
          "A flawless, high-definition finish that's picture-perfect for every camera angle"
        ],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'glow-smart-combo',
        name: 'Glow smart combo',
        rating: '4.73',
        reviews: '67K',
        price: 2599,
        originalPrice: 2697,
        duration: '1 hr 50 mins',
        bullets: [
          'Soft, fresh glam for day events and celebrations - subtle, polished & wearable.'
        ],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'party-makeup',
    title: 'Party makeup',
    icon: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'basic-makeup',
        name: 'Basic makeup',
        rating: '4.73',
        reviews: '12K',
        price: 1599,
        duration: '45 mins',
        bullets: [
          'Get a natural, everyday glow with lightweight formula',
          'Ideal for daytime events, office occasions & brunches'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'hd-finish-makeup',
        name: 'HD finish makeup',
        rating: '4.71',
        reviews: '4K',
        price: 2499,
        duration: '60 mins',
        bullets: [
          'Get a perfect photo-ready glow with HD products',
          'Ideal for formal events, evening functions & photoshoots'
        ],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'luxe-glam-up-makeup',
        name: 'Luxe glam-up makeup',
        rating: '4.68',
        reviews: '2K',
        price: 2999,
        duration: '1 hr 20 mins',
        bullets: [
          'Get a full-glam, luminous finish with premium products',
          'Ideal for festive gatherings, parties & wedding celebrations'
        ],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'hair-styling',
    title: 'Hair styling',
    icon: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'basic-hairstyling',
        name: 'Basic hairstyling',
        rating: '4.72',
        reviews: '17K',
        price: 599,
        duration: '45 mins',
        bullets: [
          'Choose any basic style from open, soft buns, pony & braid'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'advance-hairstyling',
        name: 'Advance hairstyling',
        rating: '4.73',
        reviews: '22K',
        price: 999,
        duration: '60 mins',
        bullets: [
          'Choose from braids, curls, waves, low buns, up-dos & party hairstyles'
        ],
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  },
  {
    id: 'add-ons',
    title: 'Add-ons',
    icon: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=100&h=100&fit=crop&q=80',
    items: [
      {
        id: 'basic-eye-makeup',
        name: 'Basic eye makeup',
        rating: '4.70',
        reviews: '5K',
        price: 599,
        duration: '20 mins',
        bullets: [
          'Pick your style from 1-shade wash, soft smokey, classic blend'
        ],
        image: 'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'advanced-eye-makeup',
        name: 'Advanced Eye Makeup',
        rating: '4.75',
        reviews: '978',
        price: 799,
        duration: '30 mins',
        bullets: [
          'Pick your look from cut crease, smokey, spotlight or glitter'
        ],
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      },
      {
        id: 'blast-dry',
        name: 'Blast dry',
        rating: '4.85',
        reviews: '1K',
        price: 159,
        duration: '15 mins',
        bullets: [
          'Fast blow-dry to remove excess moisture after your hair wash'
        ],
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80',
        bestSeller: false
      }
    ]
  }
];

export default function BridalMakeupPage() {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, getCartCount, getCartTotal } = useCart();
  const [activeSection, setActiveSection] = useState('packages');

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [servicesList, setServicesList] = useState(servicesData);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState('packages');
  const [editingItem, setEditingItem] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    badge: '',
    isBestseller: false,
    rating: '4.8',
    reviews: '10K',
    duration: '1 hr 30 mins',
    bullets: '',
    image: ''
  });

  // Sidebar Category Edit state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', icon: '' });

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

    const storedData = localStorage.getItem('admin_bridal_makeup_data');
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

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ title: '', icon: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=100&h=100&fit=crop&q=80' });
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
      localStorage.setItem('admin_bridal_makeup_data', JSON.stringify(updated));
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
        icon: categoryForm.icon.trim() || 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=100&h=100&fit=crop&q=80',
        items: []
      };
      updated = [...servicesList, newCat];
    }

    setServicesList(updated);
    localStorage.setItem('admin_bridal_makeup_data', JSON.stringify(updated));
    setShowCategoryModal(false);
    toast.success(editingCategory ? "Category updated!" : "New category added!");
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
      reviews: '10K',
      duration: '1 hr 30 mins',
      bullets: '',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80'
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
      reviews: item.reviews || '10K',
      duration: item.duration || '',
      bullets: Array.isArray(item.bullets) ? item.bullets.join('\n') : (item.bullets || ''),
      image: item.image || ''
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (e, sectionId, itemId) => {
    e.stopPropagation();
    if (confirm("Delete this service package from page?")) {
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
      localStorage.setItem('admin_bridal_makeup_data', JSON.stringify(updated));
      toast.success("Package deleted successfully!");
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
                reviews: packageForm.reviews.trim() || '1K',
                duration: packageForm.duration.trim(),
                bullets: bulletList.length > 0 ? bulletList : ['Quality service guarantee'],
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
            bestSeller: packageForm.isBestseller,
            rating: packageForm.rating.trim() || '4.8',
            reviews: packageForm.reviews.trim() || '1K',
            duration: packageForm.duration.trim(),
            bullets: bulletList.length > 0 ? bulletList : ['Quality service guarantee'],
            image: packageForm.image.trim() || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop&q=80'
          };
          updatedItems = [...sec.items, newItem];
        }
        return { ...sec, items: updatedItems };
      }
      return sec;
    });

    setServicesList(updated);
    localStorage.setItem('admin_bridal_makeup_data', JSON.stringify(updated));
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

  // Handle smooth scroll to specific section
  const handleScrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Setup dynamic scroll listener using IntersectionObserver
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

    servicesList.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [servicesList]);

  const handleAdd = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: "Women's Beauty & Spa"
    });
    toast.success(`${item.name} added to cart!`);
  };

  // Filter items in cart that belong to this page
  const localCartItems = cart.filter(cartItem => 
    servicesList.some(section => section.items.some(item => item.id === cartItem.id))
  );

  const localCartTotal = localCartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // Helper function to render correct sidebar icons matching the UC layout
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
    if (section.id === 'group-deals') {
      return (
        <div className="group-deals-custom-icon">
          <span className="group-deals-text-top">Upto</span>
          <span className="group-deals-text-bottom">10% OFF</span>
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
          <h1>Makeup, Saree & Styling</h1>
          <div className="makeup-header-rating">
            <span className="rating-star">★</span> 4.74 <span className="rating-count">(317K bookings)</span>
          </div>
        </div>

        {/* LEFT COLUMN: Sidebar Navigation Column (Sticky Wrapper) */}
        <div className="services-sidebar-sticky-col" style={{ marginTop: '0px', height: '100%' }}>
          <aside className="makeup-left-sidebar" style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <div className="select-service-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div className="sidebar-title" style={{ margin: 0 }}>Select a service</div>
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

              <div className="sidebar-grid">
                {servicesList.map((section) => (
                  <button
                    key={section.id}
                    className={`sidebar-grid-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => handleScrollToSection(section.id)}
                    style={{ position: 'relative' }}
                  >
                    {isAdmin && adminEditMode && (
                      <div style={{ position: 'absolute', top: '2px', right: '2px', display: 'flex', gap: '2px', zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleOpenEditCategory(e, section)}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit Category"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleDeleteCategory(e, section.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '18px', height: '18px', fontSize: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Delete Category"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    <div className="grid-icon-wrapper">
                      {renderSidebarIcon(section)}
                    </div>
                    <span className="sidebar-grid-item-text">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* CENTER COLUMN: Service Sections */}
        <div className="makeup-center-content">
          {servicesList.map((section) => (
            <section key={section.id} id={section.id} className="service-section-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="section-anchor-title" style={{ margin: 0 }}>{section.title}</h2>
                {isAdmin && adminEditMode && (
                  <button
                    onClick={() => handleOpenAddPackage(section.id)}
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
              
              {section.items.map((item) => {
                const cartItem = cart.find(c => c.id === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <div key={item.id} className="package-card" style={{ position: 'relative' }}>
                    {isAdmin && adminEditMode && (
                      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                        <button
                          onClick={(e) => handleOpenEditPackage(e, section.id, item)}
                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Edit Package & Discounts"
                        >
                          ✏️ Edit Package
                        </button>
                        <button
                          onClick={(e) => handleDeletePackage(e, section.id, item.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          title="Delete Package"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    <div className="package-details-left">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {item.bestSeller && (
                          <div className="package-badge-best">
                            <span>★</span> Bestseller
                          </div>
                        )}
                        {item.badge && (
                          <div style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                            🔥 {item.badge}
                          </div>
                        )}
                      </div>
                      <h3 className="package-name">{item.name}</h3>
                      <div className="package-meta">
                        <div className="package-rating">
                          <span className="star-icon">★</span> {item.rating} ({item.reviews} reviews)
                        </div>
                        <div className="package-price-duration">
                          {item.startsAt && <span className="starts-at" style={{ fontSize: '14px', color: '#555', marginRight: '4px' }}>Starts at </span>}
                          ₹{item.price.toLocaleString('en-IN')} 
                          {item.originalPrice && (
                            <span className="original-price" style={{ textDecoration: 'line-through', color: '#888', marginLeft: '6px', fontSize: '13px' }}>
                              ₹{item.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span style={{ color: '#16a34a', fontWeight: '800', marginLeft: '6px', fontSize: '12px' }}>
                              ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF)
                            </span>
                          )}
                          {item.duration && <span className="package-duration"> • {item.duration}</span>}
                        </div>
                      </div>
                      
                      <ul className="package-bullets">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>

                      <button className="view-details-link">View details</button>
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
                  placeholder="e.g. Basic makeup package, Party Glam Trio"
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
                    placeholder="e.g. 1799"
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
                  id="bestseller-chk"
                  checked={packageForm.isBestseller}
                  onChange={(e) => setPackageForm({ ...packageForm, isBestseller: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="bestseller-chk" style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
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
                    placeholder="e.g. 15K"
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
                  placeholder="Ideal for daytime events & brunches&#10;Includes basic makeup & hairstyling"
                  value={packageForm.bullets}
                  onChange={(e) => setPackageForm({ ...packageForm, bullets: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
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
                  placeholder="e.g. Packages, Group deals, Saree draping"
                  value={categoryForm.title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Category Icon / Photo</label>
                <input
                  type="text"
                  placeholder="Paste Icon URL →"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
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

      <Footer />
    </div>
  );
}
