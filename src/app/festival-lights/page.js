'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ChevronRight } from 'lucide-react';

const festivalCategories = [
  { id: 'light-uninstallations', name: 'Light uninstallations', image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=200&h=200&fit=crop&q=80' },
  { id: 'balcony-lights', name: 'Balcony lights', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=200&h=200&fit=crop&q=80' },
  { id: 'railing-lights', name: 'Railing lights', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=200&h=200&fit=crop&q=80' },
  { id: 'room-lights', name: 'Room lights', image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=200&h=200&fit=crop&q=80' },
  { id: 'mandir-lights', name: 'Mandir lights', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=200&h=200&fit=crop&q=80' },
  { id: 'outdoor-lights', name: 'Outdoor lights', image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=200&h=200&fit=crop&q=80' },
  { id: 'garden-lights', name: 'Garden lights', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=200&h=200&fit=crop&q=80' },
  { id: 'xmas-light-decor', name: 'Xmas light decor', image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=200&h=200&fit=crop&q=80' },
  { id: 'custom-services', name: 'Custom services', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=200&h=200&fit=crop&q=80' }
];

const festivalServices = [
  {
    id: 'balcony-lights-starry',
    category: 'balcony-lights',
    name: 'Balcony lights installation (Starry)',
    rating: '4.66',
    reviews: '2K',
    pricePrefix: 'Starts at ',
    price: 248,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'balcony-lights-string',
    category: 'balcony-lights',
    name: 'Balcony lights installation (String)',
    rating: '4.69',
    reviews: '6K',
    pricePrefix: 'Starts at ',
    price: 495,
    duration: '40 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be upto 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'light-uninstallation-per-light',
    category: 'light-uninstallations',
    name: 'Light uninstallation (per light)',
    rating: '4.78',
    reviews: '4K',
    pricePrefix: '',
    price: 124,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      '1 string length can be upto 12m',
      'Uninstallation charges for 1 light string'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'railing-lights-rope',
    category: 'railing-lights',
    name: 'Railing lights installation (Rope)',
    rating: '4.55',
    reviews: '780 reviews',
    pricePrefix: 'Starts at ',
    price: 248,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'railing-lights-starry',
    category: 'railing-lights',
    name: 'Railing lights installation (Starry)',
    rating: '4.68',
    reviews: '219 reviews',
    pricePrefix: 'Starts at ',
    price: 198,
    duration: '25 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'railing-lights-string',
    category: 'railing-lights',
    name: 'Railing lights installation (String)',
    rating: '4.64',
    reviews: '521 reviews',
    pricePrefix: 'Starts at ',
    price: 495,
    duration: '40 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'room-lights-starry',
    category: 'room-lights',
    name: 'Room lights installation (Starry)',
    rating: '4.87',
    reviews: '323 reviews',
    pricePrefix: 'Starts at ',
    price: 198,
    duration: '25 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'room-lights-string',
    category: 'room-lights',
    name: 'Room lights installation (String)',
    rating: '4.71',
    reviews: '449 reviews',
    pricePrefix: 'Starts at ',
    price: 198,
    duration: '30 mins',
    optionsSubtitle: '3 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'mandir-lights-installation',
    category: 'mandir-lights',
    name: 'Mandir lights installation',
    rating: '4.61',
    reviews: '882 reviews',
    pricePrefix: 'Starts at ',
    price: 124,
    duration: '25 mins',
    optionsSubtitle: '3 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'outdoor-lights-installation',
    category: 'outdoor-lights',
    name: 'Outdoor lights installation',
    rating: '4.56',
    reviews: '490 reviews',
    pricePrefix: 'Starts at ',
    price: 1560,
    duration: '1 hr 15 mins',
    optionsSubtitle: '2 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'garden-lights-installation',
    category: 'garden-lights',
    name: 'Garden lights installation',
    rating: '4.64',
    reviews: '535 reviews',
    pricePrefix: 'Starts at ',
    price: 198,
    duration: '30 mins',
    optionsSubtitle: '3 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'xmas-tree-lights-installation',
    category: 'xmas-light-decor',
    name: 'Xmas tree lights installation',
    rating: '5.00',
    reviews: '34 reviews',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '25 mins',
    optionsSubtitle: '3 options',
    bullets: [
      '1 string length can be up to 12m',
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'xmas-lantern-installation',
    category: 'custom-services',
    name: 'Xmas lantern installation',
    rating: '4.91',
    reviews: '252 reviews',
    pricePrefix: '',
    price: 99,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'lantern-installation-per-lantern',
    category: 'custom-services',
    name: 'Lantern installation (per lantern)',
    rating: '4.78',
    reviews: '1K',
    pricePrefix: '',
    price: 124,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      'Charges cover installation only'
    ],
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'light-installation-per-string',
    category: 'custom-services',
    name: 'Light installation (per string)',
    rating: '4.67',
    reviews: '6K reviews',
    pricePrefix: '',
    price: 124,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      '1 string length can be upto 12m',
      'Installation charges for 1 light string'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'light-uninstallation-per-light-custom',
    category: 'custom-services',
    name: 'Light uninstallation (per light)',
    rating: '4.78',
    reviews: '4K reviews',
    pricePrefix: '',
    price: 124,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      '1 string length can be upto 12m',
      'Uninstallation charges for 1 light string'
    ],
    image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?w=400&h=300&fit=crop&q=80'
  }
];

export default function FestivalLightsPage() {
  const [activeCategory, setActiveCategory] = useState('balcony-lights');
  const [selectedService, setSelectedService] = useState(null);
  const { cart = [], addToCart } = useCart();
  const itemsList = Array.isArray(cart) ? cart : [];
  const router = useRouter();

  const handleScrollTo = (catId) => {
    setActiveCategory(catId);
    const element = document.getElementById(catId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getItemCount = (id) => {
    const item = itemsList.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const handleAdd = (service, e) => {
    if (e) e.stopPropagation();
    addToCart({
      id: service.id,
      name: service.name,
      price: service.price,
      image: service.image
    });
    toast.success(`${service.name} added to cart!`, { autoClose: 1500 });
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header />

      <main style={{ paddingTop: '24px', paddingBottom: '80px', maxWidth: '1240px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* BREADCRUMB */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          Home / Electrician, Plumber & Carpenter / <strong style={{ color: '#0f172a' }}>Festival Lights Installation</strong>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '32px' }}>

          {/* LEFT SIDEBAR - SELECT A SERVICE GRID */}
          <aside style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              Select a service
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {festivalCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleScrollTo(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 4px',
                    background: activeCategory === cat.id ? '#f1f5f9' : '#ffffff',
                    border: activeCategory === cat.id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    minHeight: '94px'
                  }}
                >
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', marginBottom: '6px' }}>
                    <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: activeCategory === cat.id ? '700' : '500', color: '#0f172a', lineHeight: 1.2 }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* MIDDLE COLUMN - SERVICE SECTIONS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {festivalCategories.map((cat) => {
              const catServices = festivalServices.filter((s) => s.category === cat.id);
              if (catServices.length === 0) return null;

              return (
                <div key={cat.id} id={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>
                    {cat.name}
                  </h1>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {catServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '24px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '20px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                            {service.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px' }}>
                            <Star size={14} fill="#6c5ce7" color="#6c5ce7" />
                            <strong style={{ color: '#0f172a' }}>{service.rating}</strong>
                            <span style={{ color: '#64748b' }}>({service.reviews})</span>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                            {service.pricePrefix || ''}
                            <strong style={{ fontSize: '17px', color: '#0f172a' }}>₹{service.price}</strong>
                          </div>

                          <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {service.bullets.map((b, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
                                <span style={{ color: '#64748b', fontSize: '12px' }}>•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>

                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#6c5ce7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            View details <ChevronRight size={14} />
                          </span>
                        </div>

                        {/* RIGHT IMAGE + ADD BUTTON */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: '130px', height: '110px', borderRadius: '12px', overflow: 'hidden' }}>
                            <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)' }}>
                              {getItemCount(service.id) === 0 ? (
                                <button
                                  onClick={(e) => handleAdd(service, e)}
                                  style={{
                                    padding: '6px 22px',
                                    background: '#ffffff',
                                    color: '#6c5ce7',
                                    border: '1px solid #6c5ce7',
                                    borderRadius: '8px',
                                    fontWeight: '800',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                  }}
                                >
                                  Add
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    padding: '6px 14px',
                                    background: '#6c5ce7',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '800',
                                    fontSize: '13px',
                                    cursor: 'default',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                  }}
                                >
                                  Added ({getItemCount(service.id)})
                                </button>
                              )}
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                            {service.optionsSubtitle}
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

          </section>

          {/* RIGHT SIDEBAR - PROMISE & PROMOTIONS */}
          <aside style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* PROMO BADGE */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '18px' }}>
                %
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Get visitation fee off</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>On orders above ₹500</div>
              </div>
            </div>

            {/* JOAMEX PROMISE */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>UC Promise</h3>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#2563eb', background: '#dbeafe', padding: '3px 8px', borderRadius: '4px' }}>
                  QUALITY ASSURED
                </span>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#2563eb" /> Verified Professionals
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#2563eb" /> Hassle Free Booking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#2563eb" /> Transparent Pricing
                </li>
              </ul>
            </div>

          </aside>

        </div>
      </main>

      {/* DETAIL MODAL */}
      {selectedService && (
        <div
          onClick={() => setSelectedService(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              ×
            </button>
            <img src={selectedService.image} alt={selectedService.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>{selectedService.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '13px' }}>
              <Star size={14} fill="#6c5ce7" color="#6c5ce7" />
              <strong style={{ color: '#0f172a' }}>{selectedService.rating}</strong>
              <span style={{ color: '#64748b' }}>({selectedService.reviews})</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
              Starts at ₹{selectedService.price}
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#334155', margin: '0 0 10px 0' }}>What is included:</h4>
            <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedService.bullets.map((b, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={(e) => {
                handleAdd(selectedService, e);
                setSelectedService(null);
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: '#6c5ce7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Add to Cart • ₹{selectedService.price}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
