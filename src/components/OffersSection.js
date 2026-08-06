'use client';
import { useState, useEffect, useRef } from 'react';
import './OffersSection.css';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import { ShoppingCart, ArrowLeft, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const initialOffers = [
  {
    id: 'offer-1',
    name: 'Salon for Women',
    title: 'Salon for Women',
    subtitle: 'Save up to 40% OFF',
    buttonText: 'Explore →',
    bgColor: '#FCE4EC',
    textColor: '#C2185B',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    price: 599,
    badge: 'TRENDING',
    route: '/services/bridal-makeup'
  },
  {
    id: 'offer-2',
    name: 'Home Cleaning',
    title: 'Home Cleaning',
    subtitle: 'Up to 40% OFF on Deep Cleaning',
    buttonText: 'Explore →',
    bgColor: '#F3E5F5',
    textColor: '#7B1FA2',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    price: 799,
    badge: 'POPULAR',
    route: '/services/full-home-cleaning'
  },
  {
    id: 'offer-3',
    name: 'Plumbing Service',
    title: 'Plumbing',
    subtitle: 'Expert Plumbing Services',
    buttonText: 'Explore →',
    bgColor: '#E0F2F1',
    textColor: '#00796B',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
    price: 149,
    badge: 'NEW',
    route: '/plumber'
  },
  {
    id: 'offer-4',
    name: 'AC Service & Repair',
    title: 'Up to 30% OFF',
    subtitle: 'AC Service & Repair',
    buttonText: 'Explore →',
    bgColor: '#E8F5E9',
    textColor: '#388E3C',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
    price: 499,
    badge: 'HOT DEAL',
    route: '/ac-repair'
  },
  {
    id: 'offer-5',
    name: 'Electrician Service',
    title: 'Electrician',
    subtitle: 'Top Electrical Experts',
    buttonText: 'Explore →',
    bgColor: '#FFF3E0',
    textColor: '#F57C00',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
    price: 99,
    badge: 'BEST VALUE',
    route: '/electrician'
  }
];

export default function OffersSection() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const carouselRef = useRef(null);
    const [cardsToShow, setCardsToShow] = useState(3);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
        }
    };

    const [isAdmin, setIsAdmin] = useState(false);
    const [adminEditMode, setAdminEditMode] = useState(false);

    const [sectionTitle, setSectionTitle] = useState('Exclusive Offers');
    const [showTitleModal, setShowTitleModal] = useState(false);
    const [titleFormText, setTitleFormText] = useState('Exclusive Offers');

    const [allOffers, setAllOffers] = useState(initialOffers);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [offerForm, setOfferForm] = useState({
      title: '',
      subtitle: '',
      badge: '',
      buttonText: 'Explore →',
      price: '499',
      route: '/services',
      image: '',
      bgColor: '#FCE4EC',
      textColor: '#C2185B'
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

        const loadOffersData = async () => {
          try {
            const res = await fetch('/api/offers');
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                const updatedParsed = data.map(o => ({
                  ...o,
                  buttonText: (!o.buttonText || o.buttonText === 'Book Now →') ? 'Explore →' : o.buttonText
                }));
                setAllOffers(updatedParsed);
              }
            } else {
              setAllOffers(initialOffers);
            }
          } catch (error) {
            console.error('Error fetching offers:', error);
            const storedOffers = localStorage.getItem('admin_exclusive_offers');
            if (storedOffers) {
              try {
                const parsed = JSON.parse(storedOffers);
                if (Array.isArray(parsed) && parsed.length > 0) setAllOffers(parsed);
              } catch (e) {}
            }
          }
          
          const storedTitle = localStorage.getItem('admin_offers_title');
          if (storedTitle) setSectionTitle(storedTitle);
        };

        loadOffersData();

        window.addEventListener('storage', checkAdmin);
        window.addEventListener('focus', checkAdmin);
        window.addEventListener('admin_edit_mode_changed', checkAdmin);
        window.addEventListener('admin_offers_updated', loadOffersData);
        window.addEventListener('site_content_updated', loadOffersData);
        return () => {
          window.removeEventListener('storage', checkAdmin);
          window.removeEventListener('focus', checkAdmin);
          window.removeEventListener('admin_edit_mode_changed', checkAdmin);
          window.removeEventListener('admin_offers_updated', loadOffersData);
          window.removeEventListener('site_content_updated', loadOffersData);
        };
    }, []);

    useEffect(() => {
        const updateCardsToShow = () => {
            if (window.innerWidth <= 640) {
                setCardsToShow(1);
            } else if (window.innerWidth <= 968) {
                setCardsToShow(2);
            } else {
                setCardsToShow(3);
            }
        };
        updateCardsToShow();
        window.addEventListener('resize', updateCardsToShow);
        return () => window.removeEventListener('resize', updateCardsToShow);
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 3500);

        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying, allOffers.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex >= Math.max(0, allOffers.length - cardsToShow) ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, allOffers.length - cardsToShow) : prevIndex - 1
        );
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

    const handleSaveTitle = (e) => {
      e.preventDefault();
      setSectionTitle(titleFormText.trim());
      localStorage.setItem('admin_offers_title', titleFormText.trim());
      setShowTitleModal(false);
      toast.success("Offers section title updated!");
    };

    const handleOpenAddOffer = () => {
      setEditingOffer(null);
      setOfferForm({
        title: '',
        subtitle: '',
        badge: 'NEW',
        buttonText: 'Explore →',
        price: '499',
        route: '/services',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
        bgColor: '#FCE4EC',
        textColor: '#C2185B'
      });
      setShowOfferModal(true);
    };

    const handleOpenEditOffer = (e, offer) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setEditingOffer(offer);
      setOfferForm({
        title: offer.title || '',
        subtitle: offer.subtitle || '',
        badge: offer.badge || '',
        buttonText: offer.buttonText || 'Explore →',
        price: offer.price || 499,
        route: offer.route || '/services',
        image: offer.image || '',
        bgColor: offer.bgColor || '#FCE4EC',
        textColor: offer.textColor || '#C2185B'
      });
      setShowOfferModal(true);
    };

    const handleDeleteOffer = async (e, offerId) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (window.confirm("Delete this offer card?")) {
        try {
          const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' });
          if (res.ok) {
            const updated = allOffers.filter(o => o._id !== offerId && o.id !== offerId);
            setAllOffers(updated);
            toast.success("Offer card deleted!");
          } else {
            toast.error("Failed to delete offer");
          }
        } catch (error) {
          console.error(error);
          toast.error("Network error while deleting");
        }
      }
    };

    const handleSaveOffer = async (e) => {
      e.preventDefault();
      if (!offerForm.title.trim()) return;

      const payload = {
        title: offerForm.title.trim(),
        subtitle: offerForm.subtitle.trim(),
        badge: offerForm.badge.trim(),
        buttonText: offerForm.buttonText.trim() || 'Book Now →',
        price: Number(offerForm.price) || 499,
        route: offerForm.route.trim() || '/services',
        image: offerForm.image.trim() || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
        bgColor: offerForm.bgColor,
        textColor: offerForm.textColor
      };

      try {
        if (editingOffer && editingOffer._id) {
          // Update existing offer
          const res = await fetch(`/api/offers/${editingOffer._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const updatedOffer = await res.json();
            const updated = allOffers.map(o => o._id === editingOffer._id ? updatedOffer : o);
            setAllOffers(updated);
            setShowOfferModal(false);
            toast.success("Offer updated live!");
          } else {
            toast.error("Failed to update offer");
          }
        } else {
          // Create new offer
          const res = await fetch('/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            const newOffer = await res.json();
            setAllOffers([...allOffers, newOffer]);
            setShowOfferModal(false);
            toast.success("New offer published live!");
          } else {
            toast.error("Failed to create offer");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error while saving");
      }
    };

    const handleOfferImageUpload = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setOfferForm(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    };

    const handleAddToCart = (offer) => {
        addToCart({
            id: offer.id,
            name: offer.title || offer.name,
            price: offer.price || 499,
            image: offer.image
        });
        toast.success(`${offer.title || offer.name} added to cart!`);
    };

    return (
        <section className="offers-section" style={{ position: 'relative' }}>
            <div className="offers-container">
                <div className="offers-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 className="offers-title" style={{ margin: 0 }}>{sectionTitle}</h2>
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
                          <button
                            onClick={handleOpenAddOffer}
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
                            + Add Offer Card
                          </button>
                        )}

                    </div>
                </div>

                <div
                    className="carousel-wrapper"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                    style={{ position: 'relative' }}
                >
                    {/* Urban Company Dual Floating Navigation Arrows */}
                    {canScrollLeft && (
                        <button
                            className="uc-arrow-left"
                            onClick={scrollLeft}
                            aria-label="Previous offers"
                        >
                            <ArrowLeft size={20} color="#000000" strokeWidth={1.5} />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            className="uc-arrow-right"
                            onClick={scrollRight}
                            aria-label="Next offers"
                        >
                            <ArrowRight size={20} color="#000000" strokeWidth={1.5} />
                        </button>
                    )}

                    {/* Carousel Track */}
                    <div className="carousel-track" ref={carouselRef} onScroll={checkScroll}>
                        <div className="carousel-inner">
                            {allOffers.map((offer, index) => (
                                <div
                                    key={offer._id || offer.id || index}
                                    className="offer-card"
                                    onClick={(e) => handleSmartCardNavigate(e, offer.route || '/services')}
                                    style={{ backgroundColor: offer.bgColor, position: 'relative', cursor: 'pointer' }}
                                >
                                    {isAdmin && adminEditMode && (
                                      <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 50 }}>
                                        <button
                                          onClick={(e) => handleOpenEditOffer(e, offer)}
                                          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                          title="Edit Offer Card"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={(e) => handleDeleteOffer(e, offer._id || offer.id)}
                                          style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                          title="Delete Offer Card"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    )}

                                    {offer.badge && (
                                        <div className="offer-badge">{offer.badge}</div>
                                    )}
                                    <div className="offer-image">
                                        <img src={offer.image} alt={offer.title} />
                                    </div>
                                    <div className="offer-content">
                                        <h3 style={{ color: offer.textColor }}>{offer.title}</h3>
                                        <p>{offer.subtitle}</p>
                                        <div className="offer-actions">
                                            <button
                                                className="offer-button"
                                                onClick={(e) => handleSmartCardNavigate(e, offer.route || '/services')}
                                                style={{
                                                    backgroundColor: offer.textColor,
                                                    color: '#fff',
                                                    width: '100%'
                                                }}
                                            >
                                                {offer.buttonText}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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

            {/* ADD / EDIT OFFER CARD MODAL */}
            {showOfferModal && (
              <div className="hero-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }} onClick={() => setShowOfferModal(false)}>
                <div className="hero-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', position: 'relative', zIndex: 1000000 }}>
                  <button type="button" onClick={() => setShowOfferModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                    {editingOffer ? "Edit Exclusive Offer Card" : "Add New Offer Card"}
                  </h3>

                  <form onSubmit={handleSaveOffer}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Offer Card Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Salon for Women, Home Cleaning"
                        value={offerForm.title}
                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Subtitle / Discount Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Save up to 40% OFF"
                        value={offerForm.subtitle}
                        onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>
                        Route / Link Page <span style={{ color: '#94a3b8', fontWeight: '400' }}>(e.g. /plumber, /ac-repair, /services)</span>
                      </label>
                      <input
                        type="text"
                        value={offerForm.route}
                        onChange={(e) => setOfferForm({...offerForm, route: e.target.value})}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Badge (Top Left Tag)</label>
                        <input
                          type="text"
                          placeholder="e.g. TRENDING, POPULAR, NEW"
                          value={offerForm.badge}
                          onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Button Text</label>
                        <input
                          type="text"
                          placeholder="e.g. Book Now →"
                          value={offerForm.buttonText}
                          onChange={(e) => setOfferForm({ ...offerForm, buttonText: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Price (₹) for Cart</label>
                        <input
                          type="number"
                          placeholder="e.g. 599"
                          value={offerForm.price}
                          onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                          What are you looking for?
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem('linking_offer_data', JSON.stringify({
                              id: editingOffer ? editingOffer.id : `offer-${Date.now()}`,
                              ...offerForm
                            }));
                            setShowOfferModal(false);
                            window.dispatchEvent(new Event('start-category-linking'));
                            toast.info("🎯 Click any category card in 'What are you looking for?' to link it!");
                            const targetEl = document.getElementById('what-are-you-looking-for');
                            if (targetEl) {
                              targetEl.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '11px 14px',
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
                        {offerForm.route && (
                          <div style={{ marginTop: '6px', fontSize: '11px', color: '#047857', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px', border: '1px solid #6ee7b7' }}>
                            <span>✓ Connected Page: <strong>{offerForm.route}</strong></span>
                            <span style={{ fontSize: '10px', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>Linked</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Background Color</label>
                        <input
                          type="color"
                          value={offerForm.bgColor}
                          onChange={(e) => setOfferForm({ ...offerForm, bgColor: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Title & Button Color</label>
                        <input
                          type="color"
                          value={offerForm.textColor}
                          onChange={(e) => setOfferForm({ ...offerForm, textColor: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Card Photo / Image</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="Paste Image URL or upload →"
                          value={offerForm.image}
                          onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                          style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                        <label style={{ padding: '10px 14px', background: '#3b82f6', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handleOfferImageUpload} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{ width: '100%', padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}
                    >
                      {editingOffer ? "Save Offer Changes" : "Publish Offer Live"}
                    </button>
                  </form>
                </div>
              </div>
            )}
        </section>
    );
}
