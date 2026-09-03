'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ShieldCheck, Zap, Shield, Play, Volume2, ChevronRight } from 'lucide-react';
import '../services/bridal-makeup/style.css';

const washingMachineServices = [
  {
    id: 'wm-jet-service',
    name: 'Washing machine jet service',
    rating: '4.81',
    reviews: '1K',
    pricePrefix: 'Starts at ',
    price: 1099,
    duration: '1 hr 30 mins',
    isVideoHero: true,
    videoThumbnail: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80',
    videoSubtext: 'Skin-safe chemicals',
    bullets: [
      'Enhances wash quality and fabric care',
      'Boosts machine efficiency and prolongs lifespan'
    ],
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop&q=80'
  },
  {
    id: 'wm-checkup-repair',
    name: 'Washing machine checkup & repair',
    rating: '4.78',
    reviews: '850K',
    pricePrefix: 'Starts at ',
    price: 299,
    duration: '30 mins',
    bullets: [
      'Complete diagnosis of drum, motor, spin or water leakage issues',
      'Repair with genuine spare parts and 30-day warranty'
    ],
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop&q=80'
  },
  {
    id: 'wm-install-uninstall',
    name: 'Washing machine installation & uninstallation',
    rating: '4.82',
    reviews: '120K',
    pricePrefix: 'Starts at ',
    price: 499,
    duration: '45 mins',
    bullets: [
      'Safe mounting, inlet/outlet pipe connection & operational testing'
    ],
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=300&h=300&fit=crop&q=80'
  }
];

export default function WashingMachinePage() {
  const router = useRouter();
  const { addToCart, cart, getCartTotal, updateQuantity } = useCart();
  const [selectedDetailsItem, setSelectedDetailsItem] = useState(null);

  // --- Admin State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
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
      setIsAdmin(!!adminUser);
      setAdminEditMode(!!adminUser && storedMode === 'true');
    };
    checkAdmin();
    const interval = setInterval(checkAdmin, 500);

    const loadWashingMachineData = async () => {
      try {
        const res = await fetch('/api/services?category=washing-machine');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setServicesList(data);
          } else {
            setServicesList(washingMachineServices); // fallback to default
          }
        }
      } catch (e) {
        console.error('Failed to fetch washing machine services from API:', e);
        // Fallback to local storage if API is completely unavailable
        const storedData = localStorage.getItem('admin_washing_machine_data');
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
    
    loadWashingMachineData();
    return () => clearInterval(interval);
  }, []);

  const handleOpenAddPackage = () => {
    setEditingItem(null);
    setPackageForm({
      name: '', price: '', originalPrice: '', badge: '', isBestseller: false,
      rating: '4.8', reviews: '100K', duration: '45 mins', bullets: '', image: ''
    });
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (e, item) => {
    e.stopPropagation();
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

  const handleDeletePackage = async (e, itemId) => {
    e.stopPropagation();
    if (confirm("Delete this service package?")) {
      try {
        const res = await fetch(`/api/services/${itemId}`, { method: 'DELETE' });
        if (res.ok) {
          const updated = servicesList.filter(i => i._id !== itemId && i.id !== itemId);
          setServicesList(updated);
          toast.success("Package deleted successfully!");
        } else {
          toast.error("Failed to delete package");
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error while deleting");
      }
    }
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    if (!packageForm.name.trim() || !packageForm.price) return;

    const bulletList = packageForm.bullets.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    
    const payload = {
      name: packageForm.name.trim(),
      category: 'washing-machine',
      price: Number(packageForm.price),
      originalPrice: packageForm.originalPrice ? Number(packageForm.originalPrice) : undefined,
      badge: packageForm.badge.trim(),
      bestseller: packageForm.isBestseller,
      rating: packageForm.rating.trim() || '4.8',
      reviews: packageForm.reviews.trim() || '100K',
      duration: packageForm.duration.trim(),
      bullets: bulletList.length > 0 ? bulletList : ['Quality service guarantee'],
      image: packageForm.image.trim() || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop&q=80'
    };

    try {
      if (editingItem && editingItem._id) {
        const res = await fetch(`/api/services/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updatedService = await res.json();
          const updatedItems = servicesList.map(item => item._id === editingItem._id ? updatedService : item);
          setServicesList(updatedItems);
          setShowPackageModal(false);
          toast.success("Package updated live!");
        } else {
          toast.error("Failed to update package");
        }
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const newService = await res.json();
          setServicesList([...servicesList, newService]);
          setShowPackageModal(false);
          toast.success("Package added live!");
        } else {
          toast.error("Failed to add package");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while saving");
    }
  };

  // --- End Admin State ---

  const cartTotal = getCartTotal();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop&q=80',
      category: 'Washing Machine Repair'
    });
    toast.success(`${item.name} added to cart!`);
  };

  const getItemQuantity = (itemId) => {
    const found = cart.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="bridal-makeup-page-wrapper" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Header />

      <main className="bridal-makeup-container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr 300px', gap: '32px' }}>
        
        {/* LEFT COLUMN - Header Title, Badges & CTA */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.2' }}>
                Washing Machine Repair
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
                <Zap size={14} fill="#047857" /> Instant In 29 mins
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              <Star size={15} fill="#10b981" color="#10b981" />
              <strong style={{ color: '#0f172a' }}>4.76</strong>
              <span>(3.5 M bookings)</span>
            </div>

            {/* Warranty Badge Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '20px',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="#475569" />
                <span>Up to 180 days warranty</span>
              </div>
              <ChevronRight size={16} color="#64748b" />
            </div>

            {/* View Services Purple Button */}
            <button
              onClick={() => {
                const el = document.getElementById('services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              View Services
            </button>
          </div>
        </aside>

        {/* MIDDLE CONTENT AREA - Select your service & Video Hero */}
        <section id="services-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Select your service
            </h2>
            {isAdmin && adminEditMode && (
              <button
                onClick={handleOpenAddPackage}
                style={{
                  background: '#10b981', color: '#ffffff', border: 'none', padding: '6px 14px',
                  borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                }}
              >
                + Add Package
              </button>
            )}
          </div>

          {/* Video Hero Banner Card */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: '#0f172a'
          }}>
            <img
              src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&auto=format&fit=crop&q=80"
              alt="Washing machine jet service video preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            />
            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px'
            }}>
              {/* Top right mute icon */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px', color: '#fff', cursor: 'pointer' }}>
                  <Volume2 size={18} />
                </div>
              </div>

              {/* Play Button & Overlay text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                  <Play size={20} fill="#0f172a" color="#0f172a" style={{ marginLeft: '3px' }} />
                </div>
                <div style={{ color: '#ffffff' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800' }}>Skin-safe chemicals</div>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>Deep clean drum & removing detergent build-up</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {servicesList.map((item) => (
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
                  gap: '20px',
                  position: 'relative'
                }}
              >
                {isAdmin && adminEditMode && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                    <button
                      onClick={(e) => handleOpenEditPackage(e, item)}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => handleDeletePackage(e, item.id)}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      🗑️
                    </button>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{item.name}</h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#7c3aed', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={14} fill="#7c3aed" color="#7c3aed" /> {item.rating}
                    </span>
                    <span style={{ color: '#64748b' }}>({item.reviews} reviews)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                      {item.pricePrefix || ''}₹{item.price.toLocaleString()}
                    </span>
                    {item.duration && (
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '6px' }}>• {item.duration}</span>
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
                    style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: '700', fontSize: '13px', cursor: 'pointer', padding: 0 }}
                  >
                    View details
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
                  {getItemQuantity(item.id) > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1.5px solid #7c3aed',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      width: '90px',
                      color: '#7c3aed',
                      fontWeight: '700',
                      background: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, getItemQuantity(item.id) - 1)}
                        style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '14px', color: '#7c3aed', fontWeight: '800' }}>{getItemQuantity(item.id)}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '16px', fontWeight: '800', cursor: 'pointer', padding: 0 }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      style={{
                        padding: '8px 26px',
                        borderRadius: '8px',
                        border: '1.5px solid #7c3aed',
                        background: '#ffffff',
                        color: '#7c3aed',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
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
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>UC Promise</h3>
              <ShieldCheck size={28} color="#7c3aed" />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#7c3aed" /> Verified Professionals
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#7c3aed" /> Hassle Free Booking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                <Check size={16} color="#7c3aed" /> Transparent Pricing
              </li>
            </ul>
          </div>

          {cartTotal > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              borderRadius: '16px',
              padding: '16px 20px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
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
                  color: '#7c3aed',
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
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#7c3aed', marginBottom: '16px' }}>₹{selectedDetailsItem.price}</div>
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
              style={{ width: '100%', padding: '12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}
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
               <input placeholder="Name" value={packageForm.name} onChange={(e) => setPackageForm({...packageForm, name: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
               <input type="number" placeholder="Price" value={packageForm.price} onChange={(e) => setPackageForm({...packageForm, price: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} required />
               <input placeholder="Duration (e.g. 45 mins)" value={packageForm.duration} onChange={(e) => setPackageForm({...packageForm, duration: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
               <textarea placeholder="Bullet points (one per line)" value={packageForm.bullets} onChange={(e) => setPackageForm({...packageForm, bullets: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px', minHeight: '80px' }} />
               <button type="submit" style={{ width: '100%', padding: '10px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>Save</button>
             </form>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
