'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import './HomeRenovationSection.css';

const defaultServices = [
    {
        id: 'renov-1',
        icon: '🚿',
        title: 'Bathroom Renovation',
        iconBg: '#E3F2FD',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
        route: '/services/bathroom-renovation',
        subcategories: [
            { name: 'Complete Bathroom Renovation', icon: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&auto=format&fit=crop&q=80', route: '/services/bathroom-renovation' },
            { name: 'Bathroom Tiling', icon: 'https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?w=500&auto=format&fit=crop&q=80', route: '/services/bathroom-tiling' },
            { name: 'Bathroom Plumbing', icon: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=80', route: '/plumber' },
            { name: 'Bathroom Fixtures', icon: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80', route: '/services/bathroom-fixtures' },
            { name: 'Shower Installation', icon: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=80', route: '/services/shower-installation' }
        ]
    },
    {
        id: 'renov-2',
        icon: '🎨',
        title: 'Painter',
        iconBg: '#FCE4EC',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
        route: '/services/painter',
        subcategories: [
            { name: 'Interior Painting', icon: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80', route: '/services/interior-painting' },
            { name: 'Exterior Painting', icon: 'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=500&auto=format&fit=crop&q=80', route: '/services/exterior-painting' },
            { name: 'Wall Texture', icon: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&auto=format&fit=crop&q=80', route: '/services/wall-texture' },
            { name: 'Wallpaper Installation', icon: 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=500&auto=format&fit=crop&q=80', route: '/services/wallpaper' },
            { name: 'Wood Polishing', icon: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&auto=format&fit=crop&q=80', route: '/services/wood-polishing' }
        ]
    },
    {
        id: 'renov-3',
        icon: '💧',
        title: 'Waterproofing',
        iconBg: '#E8F5E9',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
        route: '/services/waterproofing',
        subcategories: [
            { name: 'Roof Waterproofing', icon: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=500&auto=format&fit=crop&q=80', route: '/services/roof-waterproofing' },
            { name: 'Bathroom Waterproofing', icon: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&auto=format&fit=crop&q=80', route: '/services/bathroom-waterproofing' },
            { name: 'Terrace Waterproofing', icon: 'https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=500&auto=format&fit=crop&q=80', route: '/services/terrace-waterproofing' },
            { name: 'Wall Waterproofing', icon: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=500&auto=format&fit=crop&q=80', route: '/services/wall-waterproofing' },
            { name: 'Basement Waterproofing', icon: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=500&auto=format&fit=crop&q=80', route: '/services/basement-waterproofing' }
        ]
    },
    {
        id: 'renov-4',
        icon: '🏗️',
        title: 'Civil Works',
        iconBg: '#FFF3E0',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        route: '/services/civil-works',
        subcategories: [
            { name: 'Masonry Work', icon: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80', route: '/services/masonry' },
            { name: 'Plastering', icon: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=500&auto=format&fit=crop&q=80', route: '/services/plastering' },
            { name: 'Concrete Work', icon: 'https://images.unsplash.com/photo-1590725140246-20acddc1ec6d?w=500&auto=format&fit=crop&q=80', route: '/services/concrete-work' },
            { name: 'Demolition', icon: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=500&auto=format&fit=crop&q=80', route: '/services/demolition' },
            { name: 'Foundation Work', icon: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80', route: '/services/foundation' }
        ]
    },
    {
        id: 'renov-5',
        icon: '🔲',
        title: 'Flooring / Tiling',
        iconBg: '#F3E5F5',
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop',
        route: '/services/flooring-tiling',
        subcategories: [
            { name: 'Marble Flooring', icon: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500&auto=format&fit=crop&q=80', route: '/services/marble-flooring' },
            { name: 'Tile Installation', icon: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500&auto=format&fit=crop&q=80', route: '/services/tile-installation' },
            { name: 'Wooden Flooring', icon: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80', route: '/services/wooden-flooring' },
            { name: 'Vinyl Flooring', icon: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&auto=format&fit=crop&q=80', route: '/services/vinyl-flooring' },
            { name: 'Granite Flooring', icon: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=80', route: '/services/granite-flooring' }
        ]
    }
];

const PRESET_PAGES = [
    { name: '-- Select Existing Page / Category --', route: '' },
    { name: 'AC Repair & Service', route: '/ac-repair' },
    { name: 'Refrigerator Repair', route: '/refrigerator' },
    { name: 'Geyser Service & Repair', route: '/geyser' },
    { name: 'RO Water Purifier', route: '/water-purifier' },
    { name: 'Gas Stove Repair', route: '/stove' },
    { name: 'Electrician Services', route: '/electrician' },
    { name: 'Plumbing Services', route: '/plumber' },
    { name: 'Carpentry Services', route: '/carpenter' },
    { name: 'Washing Machine Repair', route: '/washing-machine' },
    { name: 'Microwave Repair', route: '/microwave' },
    { name: 'TV Repair', route: '/television' },
    { name: 'Air Cooler Repair', route: '/air-cooler' },
    { name: 'Laptop Repair', route: '/laptop' },
    { name: 'Fan Installation', route: '/fan-installation' },
    { name: 'Furniture Assembly', route: '/furniture-assembly' },
    { name: 'IKEA Furniture', route: '/ikea-furniture' },
    { name: 'Festival Lights', route: '/festival-lights' },
    { name: 'Home Renovation', route: '/services/home-renovation' },
    { name: 'All Services Page', route: '/services' }
];

export default function HomeRenovationSection() {
    const router = useRouter();
    const [selectedService, setSelectedService] = useState(null);
    const [servicesList, setServicesList] = useState(defaultServices);
    const scrollRef = useRef(null);

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);

    const [sectionTitle, setSectionTitle] = useState('Home Renovation');
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [titleFormText, setTitleFormText] = useState('Home Renovation');

    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [cardForm, setCardForm] = useState({
      title: '',
      route: '/services',
      image: ''
    });

    const loadServices = () => {
        try {
            const savedTitle = localStorage.getItem('admin_renovation_title');
            if (savedTitle) setSectionTitle(savedTitle);

            const stored = localStorage.getItem('admin_renovation_services');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length >= 2) {
                    setServicesList(parsed);
                    return;
                }
            }
            setServicesList(defaultServices);
        } catch (e) {
            console.error('Failed loading renovation services:', e);
            setServicesList(defaultServices);
        }
    };

    const handleResetDefaults = () => {
        if (confirm("Restore all 5 default Home Renovation services (Bathroom Renovation, Painter, Waterproofing, Civil Works, Flooring/Tiling)?")) {
            localStorage.removeItem('admin_renovation_services');
            setServicesList(defaultServices);
            toast.success("Restored all 5 default Home Renovation services!");
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
        loadServices();

        window.addEventListener('storage', checkAdmin);
        window.addEventListener('focus', checkAdmin);
        window.addEventListener('admin_edit_mode_changed', checkAdmin);
        window.addEventListener('admin_renovation_updated', loadServices);
        window.addEventListener('site_content_updated', loadServices);
        return () => {
          window.removeEventListener('storage', checkAdmin);
          window.removeEventListener('focus', checkAdmin);
          window.removeEventListener('admin_edit_mode_changed', checkAdmin);
          window.removeEventListener('admin_renovation_updated', loadServices);
          window.removeEventListener('site_content_updated', loadServices);
        };
    }, []);

    const handleSmartCardNavigate = (e, route) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!route) {
        router.push('/services');
        return;
      }
      let cleanRoute = route.trim();
      if (cleanRoute === '/ac' || cleanRoute === 'ac' || cleanRoute === '/services/ac') {
        cleanRoute = '/ac-repair';
      }
      const catMapping = {
        'electrician-plumber': 'electrician-plumber',
        'ac-appliance': 'ac-appliance',
        'cleaning-pest': 'cleaning-pest',
        'renovation-interior': 'renovation-interior',
        'fabrication-roofing': 'fabrication-roofing',
        'beauty-spa': 'beauty-spa',
        'grooming': 'grooming',
        'home-care': 'home-care',
        'security-solar': 'security-solar',
        '/services/electrician-plumber': 'electrician-plumber',
        '/services/ac-appliance': 'ac-appliance',
        '/services/cleaning-pest': 'cleaning-pest',
        '/services/renovation-interior': 'renovation-interior',
        '/services/fabrication-roofing': 'fabrication-roofing',
        '/services/beauty-spa': 'beauty-spa',
        '/services/grooming': 'grooming',
        '/services/electrician': 'electrician-plumber',
        '/services/plumber': 'electrician-plumber',
        '/services/carpenter': 'electrician-plumber',
        '/plumber': 'electrician-plumber',
        '/electrician': 'electrician-plumber',
        '/carpenter': 'electrician-plumber'
      };

      let targetCatKey = null;
      if (cleanRoute.startsWith('category:')) {
        targetCatKey = cleanRoute.replace('category:', '');
      } else if (catMapping[cleanRoute]) {
        targetCatKey = catMapping[cleanRoute];
      }

      if (targetCatKey) {
        window.dispatchEvent(new CustomEvent('open-category-modal', { detail: { categoryKey: targetCatKey } }));
        const element = document.querySelector('.hero-service-grid') || document.querySelector('#what-are-you-looking-for');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        router.push(cleanRoute);
      }
    };

    const handleServiceClick = (service) => {
        if (service.subcategories && service.subcategories.length > 0) {
          setSelectedService(service);
        } else {
          handleSmartCardNavigate(null, service.route || `/services/${service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            if (direction === 'left') {
                current.scrollBy({ left: -300, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }
    };

    const handleSaveTitle = (e) => {
      e.preventDefault();
      setSectionTitle(titleFormText.trim());
      localStorage.setItem('admin_renovation_title', titleFormText.trim());
      setShowTitleModal(false);
      toast.success("Section title updated!");
    };

    const handleOpenAddCard = () => {
      setEditingCard(null);
      setCardForm({
        title: '',
        route: '/services',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop'
      });
      setShowCardModal(true);
    };

    const handleOpenEditCard = (e, card) => {
      e.stopPropagation();
      setEditingCard(card);
      setCardForm({
        title: card.title || '',
        route: card.route || '/services',
        image: card.image || ''
      });
      setShowCardModal(true);
    };

    const handleDeleteCard = (e, cardId) => {
      e.stopPropagation();
      if (confirm("Delete this renovation card?")) {
        const updated = servicesList.filter(c => (c.id || c.title) !== cardId);
        setServicesList(updated);
        localStorage.setItem('admin_renovation_services', JSON.stringify(updated));
        toast.success("Card deleted!");
      }
    };

    const handleSaveCard = (e) => {
      e.preventDefault();
      if (!cardForm.title.trim()) return;

      let updated = [];
      if (editingCard) {
        updated = servicesList.map(c => {
          if ((c.id && c.id === editingCard.id) || c.title === editingCard.title) {
            return {
              ...c,
              title: cardForm.title.trim(),
              route: cardForm.route.trim(),
              image: cardForm.image.trim() || c.image
            };
          }
          return c;
        });
      } else {
        const newCard = {
          id: `renov-${Date.now()}`,
          title: cardForm.title.trim(),
          route: cardForm.route.trim() || `/services/${cardForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          image: cardForm.image.trim() || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
          subcategories: [
            { name: `${cardForm.title.trim()} Service`, icon: cardForm.image.trim(), route: `/services/${cardForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
          ]
        };
        updated = [...servicesList, newCard];
      }

      setServicesList(updated);
      localStorage.setItem('admin_renovation_services', JSON.stringify(updated));
      setShowCardModal(false);
      toast.success(editingCard ? "Card updated live!" : "New renovation card published!");
    };

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [servicesList]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
    };

    const handleImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setCardForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    };

    return (
        <section className="home-renovation-section" style={{ position: 'relative' }}>
            <div className="home-renovation-container">
                <div className="section-header-scrollable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>{sectionTitle}</h2>
                        {isAdmin && adminEditMode && (
                          <button
                            onClick={() => {
                              setTitleFormText(sectionTitle);
                              setShowTitleModal(true);
                            }}
                            style={{
                              background: '#3b82f6',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer'
                            }}
                          >
                            ✏️ Edit Title
                          </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isAdmin && adminEditMode && (
                          <>
                            <button
                              onClick={handleResetDefaults}
                              style={{
                                background: '#64748b',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title="Reset to 5 default Home Renovation services"
                            >
                              ↺ Reset Defaults
                            </button>
                            <button
                              onClick={handleOpenAddCard}
                              style={{
                                background: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                              }}
                            >
                              + Add Card
                            </button>
                          </>
                        )}

                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    {/* Urban Company Dual Floating Navigation Arrows */}
                    {canScrollLeft && (
                        <button
                            className="uc-arrow-left"
                            onClick={scrollLeft}
                            aria-label="Previous services"
                        >
                            <ArrowLeft size={20} color="#000000" strokeWidth={1.5} />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            className="uc-arrow-right"
                            onClick={scrollRight}
                            aria-label="Next services"
                        >
                            <ArrowRight size={20} color="#000000" strokeWidth={1.5} />
                        </button>
                    )}

                    <div className="home-renovation-grid" ref={scrollRef} onScroll={checkScroll}>
                    {servicesList.map((service, index) => (
                        <div
                            key={service.id || index}
                            className="renovation-card"
                            onClick={() => handleServiceClick(service)}
                            style={{ position: 'relative' }}
                        >
                            {isAdmin && adminEditMode && (
                              <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 50 }}>
                                <button
                                  onClick={(e) => handleOpenEditCard(e, service)}
                                  style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Edit Card"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => handleDeleteCard(e, service.id || service.title)}
                                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Delete Card"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}

                            <div className="renovation-image">
                                <img src={service.image} alt={service.title} />
                            </div>
                            <p>{service.title}</p>
                        </div>
                    ))}
                </div>
                </div>
            </div>

            {/* EDIT TITLE MODAL */}
            {showTitleModal && (
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }} onClick={() => setShowTitleModal(false)}>
                <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '400px', width: '90%', padding: '24px', position: 'relative', zIndex: 1000000 }}>
                  <button type="button" onClick={() => setShowTitleModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Edit Section Title</h3>
                  <form onSubmit={handleSaveTitle}>
                    <input
                      type="text"
                      required
                      value={titleFormText}
                      onChange={(e) => setTitleFormText(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                      Save Title Live
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ADD / EDIT CARD MODAL */}
            {showCardModal && (
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }} onClick={() => setShowCardModal(false)}>
                <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '460px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative', zIndex: 1000000 }}>
                  <button type="button" onClick={() => setShowCardModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                    {editingCard ? "Edit Renovation Card" : "Add New Renovation Card"}
                  </h3>

                  <form onSubmit={handleSaveCard}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bathroom Renovation, Painter, Waterproofing"
                        value={cardForm.title}
                        onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Connect to Page / Category</label>
                      <select
                        value={PRESET_PAGES.some(p => p.route === cardForm.route) ? cardForm.route : ''}
                        onChange={(e) => {
                          if (e.target.value) setCardForm({ ...cardForm, route: e.target.value });
                        }}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#ffffff', color: '#0f172a', marginBottom: '8px' }}
                      >
                        {PRESET_PAGES.map((p, idx) => (
                          <option key={idx} value={p.route}>{p.name} {p.route ? `(${p.route})` : ''}</option>
                        ))}
                      </select>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Or type custom route e.g. /ac-repair"
                          value={cardForm.route}
                          onChange={(e) => setCardForm({ ...cardForm, route: e.target.value })}
                          style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sessionStorage.setItem('linking_card_data', JSON.stringify({
                            sectionType: 'renovation',
                            id: editingCard ? (editingCard.id || editingCard.title) : `renovation-${Date.now()}`,
                            title: cardForm.title,
                            image: cardForm.image,
                            route: cardForm.route
                          }));
                          setShowCardModal(false);
                          window.dispatchEvent(new Event('start-category-linking'));
                          toast.info("🎯 Click any category card in 'What are you looking for?' to link it!");
                          const targetEl = document.getElementById('what-are-you-looking-for');
                          if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        style={{
                          width: '100%',
                          marginTop: '8px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '2px dashed #2563eb',
                          background: '#eff6ff',
                          color: '#1e40af',
                          fontWeight: '800',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        🔗 Select from "What are you looking for?" Section
                      </button>

                      {cardForm.route && (
                        <div style={{ marginTop: '6px', fontSize: '11px', color: '#047857', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px', border: '1px solid #6ee7b7' }}>
                          <span>✓ Connected Page: <strong>{cardForm.route}</strong></span>
                          <span style={{ fontSize: '10px', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Linked</span>
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Photo / Image</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Paste Image URL or upload →"
                          value={cardForm.image}
                          onChange={(e) => setCardForm({ ...cardForm, image: e.target.value })}
                          style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                    >
                      {editingCard ? "Save Card Changes" : "Publish Card Live"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SUBCATEGORY MODAL */}
            {selectedService && (
                <div className="hero-modal-overlay" onClick={() => setSelectedService(null)}>
                    <div className="hero-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="hero-modal-back" onClick={() => setSelectedService(null)}>
                            ← Back
                        </button>
                        <button className="hero-modal-close" onClick={() => setSelectedService(null)}>×</button>
                        <h3>{selectedService.title}</h3>
                        <div className="hero-subcategory-grid">
                            {selectedService.subcategories && selectedService.subcategories.map((sub, idx) => (
                                <div
                                    key={idx}
                                    className="hero-subcategory-card"
                                    onClick={() => {
                                        if (sub.route) {
                                            router.push(sub.route);
                                        }
                                    }}
                                >
                                    <div className="hero-subcategory-icon">
                                        {sub.icon ? (
                                            <img src={sub.icon} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : selectedService.icon && (selectedService.icon.startsWith('/') || selectedService.icon.startsWith('http')) ? (
                                            <img src={selectedService.icon} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            selectedService.icon || '🏠'
                                        )}
                                    </div>
                                    <p>{sub.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
