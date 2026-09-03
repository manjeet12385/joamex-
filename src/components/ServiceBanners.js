'use client';
import './ServiceBanners.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'react-toastify';



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

export default function ServiceBanners() {
    const router = useRouter();

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);

    const [bannersList, setBannersList] = useState([]);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [bannerForm, setBannerForm] = useState({
        title: '',
        description: '',
        tags: '',
        buttonText: 'Book Now',
        route: '/services',
        image: '',
        textColor: '#ffffff',
        buttonBgColor: '#2563eb',
        imageOnly: false
    });

    const loadBanners = async () => {
        try {
            const isAdm = !!localStorage.getItem('adminUser');
            const isEd = localStorage.getItem('admin_edit_mode') === 'true';
            const mode = (isAdm && isEd) ? '?mode=draft' : '?mode=live';
            
            const res = await fetch('/api/admin/feature-banners' + mode);
            const data = await res.json();
            if (data.success && Array.isArray(data.banners)) {
                setBannersList(data.banners);
            }
        } catch (e) {
            setBannersList([]);
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
        loadBanners();

        window.addEventListener('storage', checkAdmin);
        window.addEventListener('focus', checkAdmin);
        window.addEventListener('admin_edit_mode_changed', checkAdmin);
        window.addEventListener('admin_feature_banners_updated', loadBanners);
        window.addEventListener('site_content_updated', loadBanners);
        return () => {
          window.removeEventListener('storage', checkAdmin);
          window.removeEventListener('focus', checkAdmin);
          window.removeEventListener('admin_edit_mode_changed', checkAdmin);
          window.removeEventListener('admin_feature_banners_updated', loadBanners);
          window.removeEventListener('site_content_updated', loadBanners);
        };
    }, []);

    const handleOpenAddBanner = () => {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        description: '',
        tags: 'Service 1, Service 2, Service 3',
        buttonText: 'Book Now',
        route: '/services',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        textColor: '#ffffff',
        buttonBgColor: '#2563eb',
        imageOnly: false
      });
      setShowBannerModal(true);
    };

    const handleOpenEditBanner = (e, banner) => {
      e.stopPropagation();
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title || '',
        description: banner.description || '',
        tags: Array.isArray(banner.tags) ? banner.tags.join(', ') : (banner.tags || ''),
        buttonText: banner.buttonText || 'Book Now',
        route: banner.route || '/services',
        image: banner.image || '',
        textColor: banner.textColor || '#ffffff',
        buttonBgColor: banner.buttonBgColor || '#2563eb',
        imageOnly: banner.imageOnly || false
      });
      setShowBannerModal(true);
    };

    const handleDeleteBanner = async (e, bannerId) => {
      e.stopPropagation();
      if (confirm("Delete this feature banner?")) {
        try {
          const updated = bannersList.filter(b => (b._id || b.id) !== bannerId);
          const res = await fetch('/api/admin/feature-banners', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ banners: updated, sectionTitle: 'Feature Banners' })
          });
          if (res.ok) {
            setBannersList(updated);
            toast.success("Banner deleted (saved as draft)!");
          } else {
            toast.error("Failed to delete banner");
          }
        } catch (err) {
          toast.error('Failed to delete banner');
        }
      }
    };

    const handleSmartCardNavigate = (e, route) => {
      if (adminEditMode) {
        e.preventDefault();
        return;
      }
      
      const cleanRoute = route?.trim() || '';
      
      if (!cleanRoute) {
        router.push('/services');
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

    const handleStartCategoryLinking = () => {
      const bannerId = editingBanner ? (editingBanner._id || editingBanner.id) : (bannersList[0]?.id || 'banner-cleaning');
      sessionStorage.setItem('linking_card_data', JSON.stringify({
        sectionType: 'banner',
        cardId: bannerId,
        id: bannerId,
        title: bannerForm.title || editingBanner?.title || 'Feature Banner'
      }));
      setShowBannerModal(false);
      window.dispatchEvent(new Event('start-category-linking'));
      toast.info("Scroll to 'What are you looking for?' and select Page 2 service to link!");
      const elem = document.getElementById('what-are-you-looking-for');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const handleSaveBanner = async (e) => {
      e.preventDefault();
      if (!bannerForm.imageOnly && !bannerForm.title.trim()) {
        toast.error('Title is required for normal banners!');
        return;
      }

      let finalTitle = bannerForm.title.trim();
      let finalDesc = bannerForm.description.trim();
      let finalTags = bannerForm.tags;
      
      if (bannerForm.imageOnly) {
         finalTitle = "";
         finalDesc = "";
         finalTags = "";
      }

      const tagArray = finalTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        id: (editingBanner && (editingBanner._id || editingBanner.id)) ? (editingBanner._id || editingBanner.id) : Date.now().toString(),
        title: finalTitle,
        subtitle: finalDesc,
        tag: tagArray[0] || '',
        route: bannerForm.route.trim(),
        image: bannerForm.image.trim() || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop',
        textColor: bannerForm.textColor,
        buttonBgColor: bannerForm.buttonBgColor,
        buttonText: bannerForm.buttonText,
        isActive: true,
        imageOnly: !!bannerForm.imageOnly
      };

      try {
        let updated = [];
        if (editingBanner && (editingBanner._id || editingBanner.id)) {
          updated = bannersList.map(b => (b._id === editingBanner._id || b.id === editingBanner.id) ? { ...b, ...payload } : b);
        } else {
          payload.order = bannersList.length;
          updated = [...bannersList, payload];
        }

        const res = await fetch('/api/admin/feature-banners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ banners: updated, sectionTitle: 'Feature Banners' })
        });
        if (res.ok) {
          setBannersList(updated);
          toast.success("Feature banner saved as draft!");
        } else {
          toast.error('Failed to save banner');
        }
      } catch (err) {
        toast.error('Network error saving banner');
      }

      setShowBannerModal(false);
    };

    const handleImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setBannerForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    };

    if (!adminEditMode && bannersList.length === 0) {
        return null;
    }

    return (
        <section className="service-banners" style={{ position: 'relative' }}>
            {isAdmin && adminEditMode && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                  onClick={handleOpenAddBanner}
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  + Add Feature Banner Card
                </button>
              </div>
            )}

            {bannersList.map((banner) => (
              <div key={banner.id} className={`banner ${banner.bannerClass || 'custom-feature-banner'}`} style={{ position: 'relative' }}>
                {isAdmin && adminEditMode && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 50 }}>
                    <button
                      onClick={(e) => handleOpenEditBanner(e, banner)}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Edit Banner"
                    >
                      ✏️ Edit Banner
                    </button>
                    <button
                      onClick={(e) => handleDeleteBanner(e, banner.id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Delete Banner"
                    >
                      🗑️
                    </button>
                  </div>
                )}

                <div className="banner-content">
                  {(() => {
                    const isLightBanner = banner.bannerClass === 'cleaning-banner' || banner.id === 'banner-cleaning';
                    const hasCustomColor = banner.textColor && banner.textColor !== '#ffffff' && banner.textColor !== '#fff';
                    const headingColor = hasCustomColor ? banner.textColor : (isLightBanner ? '#0f172a' : '#ffffff');
                    const descColor = hasCustomColor ? `${banner.textColor}e6` : (isLightBanner ? '#475569' : '#cbd5e1');
                    const tagTextColor = hasCustomColor ? banner.textColor : (isLightBanner ? '#334155' : '#ffffff');
                    const tagBg = isLightBanner ? '#f1f5f9' : 'rgba(255,255,255,0.15)';
                    const tagBorder = isLightBanner ? '#cbd5e1' : 'rgba(255,255,255,0.25)';
                    const btnBg = banner.buttonBgColor || (isLightBanner ? '#0f172a' : '#2563eb');

                    return (
                      <>
                        <h2 style={{ color: headingColor }}>{banner.title}</h2>
                        <p style={{ color: descColor }}>{banner.description}</p>
                        <div className="banner-tags">
                          {banner.tags && banner.tags.map((tag, idx) => (
                            <span key={idx} style={{ color: tagTextColor, background: tagBg, borderColor: tagBorder }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          className="banner-button"
                          onClick={(e) => handleSmartCardNavigate(e, banner.route || '/services')}
                          style={{ background: btnBg, color: '#ffffff' }}
                        >
                          {banner.buttonText || 'Book Now'}
                        </button>
                      </>
                    );
                  })()}
                </div>
                <div className="banner-image">
                  <img src={banner.image} alt={banner.title} />
                </div>
              </div>
            ))}

            {/* ADD / EDIT BANNER MODAL */}
            {showBannerModal && (
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }} onClick={() => setShowBannerModal(false)}>
                <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative', zIndex: 1000000 }}>
                  <button type="button" onClick={() => setShowBannerModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                    {editingBanner ? "Edit Feature Banner Card" : "Add New Feature Banner Card"}
                  </h3>

                  <form onSubmit={handleSaveBanner}>
                    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <input 
                        type="checkbox" 
                        id="imageOnly" 
                        checked={bannerForm.imageOnly || false} 
                        onChange={(e) => setBannerForm({ ...bannerForm, imageOnly: e.target.checked })} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="imageOnly" style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', cursor: 'pointer' }}>Image Only Banner (Hide Title & Description)</label>
                    </div>

                    {!bannerForm.imageOnly && (
                      <>
                        <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Banner Heading / Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Professional Cleaning, Men's Grooming"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Description Subtext</label>
                      <textarea
                        rows={3}
                        placeholder="Get your home serviced and spotless with our expert deep cleaning services..."
                        value={bannerForm.description}
                        onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Tags / Sub-Services (Comma Separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Cockroach Control, Bed Bug Treatment, Mosquito Mesh"
                        value={bannerForm.tags}
                        onChange={(e) => setBannerForm({ ...bannerForm, tags: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                      </>
                    )}

                    <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                        🔗 Link Page / Category to this Banner
                      </label>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <select
                          value={PRESET_PAGES.some(p => p.route === bannerForm.route) ? bannerForm.route : ''}
                          onChange={(e) => {
                            if (e.target.value) setBannerForm({ ...bannerForm, route: e.target.value });
                          }}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff', fontWeight: '600' }}
                        >
                          {PRESET_PAGES.map((page, idx) => (
                            <option key={idx} value={page.route}>{page.name}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          placeholder="Or type custom route (e.g. /services/ac-repair)"
                          value={bannerForm.route}
                          onChange={(e) => setBannerForm({ ...bannerForm, route: e.target.value })}
                          style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleStartCategoryLinking}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
                        }}
                      >
                        🔗 Select from "What are you looking for?" Section
                      </button>

                      {bannerForm.route && (
                        <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '4px 8px', borderRadius: '4px' }}>
                          ✓ Connected Page: {bannerForm.route}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Book Now"
                          value={bannerForm.buttonText}
                          onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Banner Photo / Image</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Image URL →"
                            value={bannerForm.image}
                            onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                            style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          />
                          <label style={{ padding: '8px 10px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '11px', whiteSpace: 'nowrap' }}>
                            Upload
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>🎨 Text Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={bannerForm.textColor || '#ffffff'}
                            onChange={(e) => setBannerForm({ ...bannerForm, textColor: e.target.value })}
                            style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                          />
                          <input
                            type="text"
                            value={bannerForm.textColor || '#ffffff'}
                            onChange={(e) => setBannerForm({ ...bannerForm, textColor: e.target.value })}
                            style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>🔘 Button Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="color"
                            value={bannerForm.buttonBgColor || '#2563eb'}
                            onChange={(e) => setBannerForm({ ...bannerForm, buttonBgColor: e.target.value })}
                            style={{ width: '38px', height: '38px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }}
                          />
                          <input
                            type="text"
                            value={bannerForm.buttonBgColor || '#2563eb'}
                            onChange={(e) => setBannerForm({ ...bannerForm, buttonBgColor: e.target.value })}
                            style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                    >
                      {editingBanner ? "Save Banner Changes" : "Publish Banner Live"}
                    </button>
                  </form>
                </div>
              </div>
            )}
        </section>
    );
}
