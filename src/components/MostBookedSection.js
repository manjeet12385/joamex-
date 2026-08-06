'use client';
import './MostBookedSection.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const defaultServices = [
    {
        id: 'booked-1',
        image: '/service-ac.png',
        title: 'AC Gas Refilling',
        priceRange: 'Starts at ₹1,299',
        price: 1299,
        route: '/ac-repair'
    },
    {
        id: 'booked-2',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
        title: 'Bathroom Deep Cleaning',
        priceRange: 'Starts at ₹499',
        price: 499,
        route: '/services/bathroom-cleaning'
    },
    {
        id: 'booked-3',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        title: 'Switch Repair',
        priceRange: 'Starts at ₹99',
        price: 99,
        route: '/electrician'
    },
    {
        id: 'booked-4',
        image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=300&fit=crop',
        title: 'Flush Repair',
        priceRange: 'Starts at ₹149',
        price: 149,
        route: '/plumber'
    },
    {
        id: 'booked-5',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
        title: 'Spin Issue Fix',
        priceRange: 'Starts at ₹599',
        price: 599,
        route: '/washing-machine'
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

export default function MostBookedSection() {
    const router = useRouter();
    const [servicesList, setServicesList] = useState(defaultServices);

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);

    const [sectionTitle, setSectionTitle] = useState('Most Booked Services');
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [titleFormText, setTitleFormText] = useState('Most Booked Services');

    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [cardForm, setCardForm] = useState({
      title: '',
      price: '',
      route: '/services',
      image: ''
    });

    const loadServices = () => {
        try {
            const savedTitle = localStorage.getItem('admin_most_booked_title');
            if (savedTitle) setSectionTitle(savedTitle);

            const stored = localStorage.getItem('admin_most_booked_services');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setServicesList(parsed);
                }
            }
        } catch (e) {
            console.error('Failed loading most booked services:', e);
        }
    };

    const handleResetDefaults = () => {
        if (confirm("Reset to 5 default Most Booked services?")) {
            localStorage.removeItem('admin_most_booked_services');
            setServicesList(defaultServices);
            toast.success("Restored 5 default Most Booked services!");
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
        window.addEventListener('admin_most_booked_updated', loadServices);
        window.addEventListener('site_content_updated', loadServices);
        return () => {
          window.removeEventListener('storage', checkAdmin);
          window.removeEventListener('focus', checkAdmin);
          window.removeEventListener('admin_edit_mode_changed', checkAdmin);
          window.removeEventListener('admin_most_booked_updated', loadServices);
          window.removeEventListener('site_content_updated', loadServices);
        };
    }, []);

    const handleSaveTitle = (e) => {
      e.preventDefault();
      setSectionTitle(titleFormText.trim());
      localStorage.setItem('admin_most_booked_title', titleFormText.trim());
      setShowTitleModal(false);
      toast.success("Section title updated!");
    };

    const handleOpenAddCard = () => {
      setEditingCard(null);
      setCardForm({
        title: '',
        price: '499',
        route: '/services',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'
      });
      setShowCardModal(true);
    };

    const handleOpenEditCard = (e, card) => {
      e.stopPropagation();
      setEditingCard(card);
      setCardForm({
        title: card.title || '',
        price: card.price || '',
        route: card.route || '/services',
        image: card.image || ''
      });
      setShowCardModal(true);
    };

    const handleDeleteCard = (e, cardId) => {
      e.stopPropagation();
      if (confirm("Delete this Most Booked service card?")) {
        const updated = servicesList.filter(c => (c.id || c.title) !== cardId);
        setServicesList(updated);
        localStorage.setItem('admin_most_booked_services', JSON.stringify(updated));
        toast.success("Card deleted!");
      }
    };

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
              price: cardForm.price ? Number(cardForm.price) : undefined,
              priceRange: cardForm.price ? `Starts at ₹${Number(cardForm.price).toLocaleString()}` : c.priceRange,
              route: cardForm.route.trim(),
              image: cardForm.image.trim() || c.image
            };
          }
          return c;
        });
      } else {
        const newCard = {
          id: `booked-${Date.now()}`,
          title: cardForm.title.trim(),
          price: cardForm.price ? Number(cardForm.price) : undefined,
          priceRange: cardForm.price ? `Starts at ₹${Number(cardForm.price).toLocaleString()}` : 'Starts at ₹499',
          route: cardForm.route.trim() || '/services',
          image: cardForm.image.trim() || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'
        };
        updated = [...servicesList, newCard];
      }

      setServicesList(updated);
      localStorage.setItem('admin_most_booked_services', JSON.stringify(updated));
      setShowCardModal(false);
      toast.success(editingCard ? "Card updated live!" : "New most booked service card added!");
    };

    const scrollRef = useRef(null);
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
        <section className="most-booked-section" style={{ position: 'relative' }}>
            <div className="most-booked-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                              title="Reset to 5 default Most Booked services"
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
                              + Add Service Card
                            </button>
                          </>
                        )}
                        <Link href="/services" className="view-all-link">View All</Link>
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

                    <div className="most-booked-grid" ref={scrollRef} onScroll={checkScroll}>
                    {servicesList.map((service, index) => (
                        <div
                            key={service.id || index}
                            className="most-booked-card"
                            onClick={(e) => handleSmartCardNavigate(e, service.route || '/services')}
                            style={{ cursor: 'pointer', position: 'relative' }}
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

                            <div className="card-image">
                                <img src={service.image} alt={service.title} />
                            </div>
                            <div className="card-info">
                                <h3>{service.title}</h3>
                                <p className="price">{service.priceRange || (service.price ? `Starts at ₹${service.price}` : '')}</p>
                            </div>
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
                    {editingCard ? "Edit Most Booked Card" : "Add New Most Booked Card"}
                  </h3>

                  <form onSubmit={handleSaveCard}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AC Gas Refilling, Bathroom Deep Cleaning"
                        value={cardForm.title}
                        onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Starting Price (₹) (Optional)</label>
                      <input
                        type="number"
                        placeholder="e.g. 499"
                        value={cardForm.price}
                        onChange={(e) => setCardForm({ ...cardForm, price: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
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
                            sectionType: 'mostbooked',
                            id: editingCard ? (editingCard.id || editingCard.title) : `booked-${Date.now()}`,
                            title: cardForm.title,
                            price: cardForm.price,
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
        </section>
    );
}
