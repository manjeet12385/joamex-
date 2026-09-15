'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import './HomeRenovationSection.css';

const defaultServices = [];

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
    const [servicesList, setServicesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
      route: '',
      image: ''
    });

    const loadServices = async () => {
        try {
            const isAdm = !!localStorage.getItem('adminUser');
            const isEd = localStorage.getItem('admin_edit_mode') === 'true';
            const mode = (isAdm && isEd) ? '?mode=draft' : '?mode=live';

            const res = await fetch('/api/admin/home-renovation' + mode);
            const data = await res.json();
            if (data.success && Array.isArray(data.services)) {
                setServicesList(data.services);
                if (data.sectionTitle) setSectionTitle(data.sectionTitle);
            }
        } catch (e) {
            console.error('Failed loading renovation services:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetDefaults = async () => {
        if (confirm("Restore all 5 default Home Renovation services?")) {
            try {
                const res = await fetch('/api/admin/home-renovation');
                const data = await res.json();
                if (data.success && Array.isArray(data.services)) {
                    for (const item of data.services) {
                        await fetch(`/api/admin/home-renovation?id=${item._id}`, { method: 'DELETE' });
                    }
                }
                const res2 = await fetch('/api/admin/home-renovation');
                const data2 = await res2.json();
                if (data2.success) setServicesList(data2.services || []);
                toast.success("Restored default Home Renovation services!");
            } catch (e) {
                toast.error('Failed to reset');
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

      
      const cleanRoute = route?.trim() || '';
      
      if (!cleanRoute) {
        return;
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
        if (isAdmin && adminEditMode) {
            toast.info("Navigation is disabled in Edit Mode. Use the Edit (✏️) button to change the link.");
            return;
        }

        if (service.subcategories && service.subcategories.length > 0) {
          setSelectedService(service);
        } else if (service.route && service.route.trim() !== '') {
          handleSmartCardNavigate(null, service.route);
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

    const handleSaveTitle = async (e) => {
      e.preventDefault();
      setSectionTitle(titleFormText.trim());
      try {
        const res = await fetch('/api/admin/home-renovation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: servicesList, sectionTitle: titleFormText.trim() })
        });
        if (res.ok) {
          toast.success("Title saved as draft!");
        } else {
          toast.error('Failed to save title');
        }
      } catch (e) {
        toast.error('Failed to save title');
      }
      setShowTitleModal(false);
    };
    const handleOpenAddCard = () => {
      setEditingCard(null);
      setCardForm({
        title: '',
        route: '',
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop'
      });
      setShowCardModal(true);
    };

    const handleOpenEditCard = (e, card) => {
      e.stopPropagation();
      setEditingCard(card);
      setCardForm({
        title: card.title || '',
        route: card.route || '',
        image: card.image || ''
      });
      setShowCardModal(true);
    };

    const handleDeleteCard = async (e, cardId) => {
      e.stopPropagation();
      if (confirm("Delete this renovation card?")) {
        try {
          const updated = servicesList.filter(c => (c._id || c.id || c.title) !== cardId);
          const res = await fetch('/api/admin/home-renovation', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updated, sectionTitle })
          });
          if (res.ok) {
            setServicesList(updated);
            toast.success("Card deleted (saved as draft)!");
          } else {
            toast.error("Failed to delete card");
          }
        } catch (err) {
          toast.error('Failed to delete card');
        }
      }
    };

    const handleSaveCard = async (e) => {
      e.preventDefault();
      if (!cardForm.title.trim()) return;

      const payload = {
        id: (editingCard && (editingCard._id || editingCard.id)) ? (editingCard._id || editingCard.id) : Date.now().toString(),
        title: cardForm.title.trim(),
        route: cardForm.route.trim(),
        image: cardForm.image.trim(),
        isActive: true
      };

      try {
        let updated = [];
        if (editingCard && (editingCard._id || editingCard.id)) {
          updated = servicesList.map(c => (c._id === editingCard._id || c.id === editingCard.id) ? { ...c, ...payload } : c);
        } else {
          payload.order = servicesList.length;
          updated = [...servicesList, payload];
        }

        const res = await fetch('/api/admin/home-renovation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: updated, sectionTitle })
        });
        
        if (res.ok) {
          setServicesList(updated);
          toast.success("Card saved as draft!");
        } else {
          toast.error('Failed to save card');
        }
      } catch (err) {
        toast.error('Network error saving card');
      }

      setShowCardModal(false);
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

    if (!isLoading && servicesList.length === 0 && !adminEditMode) {
        return null;
    }

    return (
        <section className="home-renovation-section" style={{ position: 'relative' }}>
            <div className="home-renovation-container">
                <div className="section-header-scrollable" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>
                          {isLoading ? (
                            <span style={{display: 'inline-block', width: '200px', height: '28px', background: '#e2e8f0', borderRadius: '6px', animation: 'pulse 1.5s infinite'}}></span>
                          ) : (
                            sectionTitle
                          )}
                        </h2>
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
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div key={`skeleton-${idx}`} className="renovation-card" style={{ minHeight: '140px', background: '#e2e8f0', borderRadius: '12px', animation: 'pulse 1.5s infinite' }}></div>
                        ))
                    ) : (
                        servicesList.map((service, index) => (
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
                                  onClick={(e) => handleDeleteCard(e, service._id || service.id || service.title)}
                                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  title="Delete Card"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}

                            {service.image && (
                                <div className="renovation-image">
                                    <img src={service.image} alt={service.title} />
                                </div>
                            )}
                            <p>{service.title}</p>
                        </div>
                    )))}
                </div>
                </div>
            </div>

            {/* EDIT TITLE MODAL */}
            {showTitleModal && (
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}>
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
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}>
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
