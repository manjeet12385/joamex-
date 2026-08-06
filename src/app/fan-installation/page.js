'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ChevronRight } from 'lucide-react';

const fanCategories = [
  { id: 'installation-replacement', name: 'Installation/replacement' },
  { id: 'uninstallation', name: 'Uninstallation' }
];

const fanServices = [
  {
    id: 'ceiling-fan-installation',
    category: 'installation-replacement',
    name: 'Ceiling fan installation/replacement',
    rating: '4.89',
    reviews: '25K',
    pricePrefix: 'Starts at ',
    price: 248,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Standard 3-blade ceiling fan mounting, blade assembly & hook connection',
      'Regulator wiring & direction check'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'exhaust-fan-installation',
    category: 'installation-replacement',
    name: 'Exhaust fan installation/replacement',
    rating: '4.83',
    reviews: '7K',
    pricePrefix: 'Starts at ',
    price: 248,
    duration: '35 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Wall or window glass exhaust fan mounting & wiring',
      'Louver shutter check & seal installation'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'wall-fan-installation',
    category: 'installation-replacement',
    name: 'Wall fan installation/replacement',
    rating: '4.87',
    reviews: '4K',
    pricePrefix: '',
    price: 199,
    duration: '45 mins',
    optionsSubtitle: '',
    bullets: [
      'Wall bracket drilling, anchor mounting & oscillating fan setup',
      'Cord extension & speed test'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'decorative-ceiling-fan-installation',
    category: 'installation-replacement',
    name: 'Decorative ceiling fan installation/replacement',
    rating: '4.84',
    reviews: '406',
    pricePrefix: 'Starts at ',
    price: 469,
    duration: '45 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Installation or replacement of chandelier/decorative ceiling fan',
      'Assembly of fan blades, light kit, downrod & canopy alignment'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'smart-fan-installation',
    category: 'installation-replacement',
    name: 'Smart fan installation/replacement',
    rating: '4.85',
    reviews: '9K',
    pricePrefix: 'Starts at ',
    price: 298,
    duration: '35 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'BLDC or Wi-Fi/Remote controlled smart fan mounting & pairing',
      'Regulator bypass & receiver module wiring'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'pedestal-fan-installation',
    category: 'installation-replacement',
    name: 'Pedestal fan installation',
    rating: '4.85',
    reviews: '1K reviews',
    pricePrefix: '',
    price: 199,
    duration: '15 mins',
    optionsSubtitle: '',
    bullets: [
      'Pedestal stand assembly, blade cage fitting & balance check',
      'Power cord connection & oscillation test'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'tower-fan-installation',
    category: 'installation-replacement',
    name: 'Tower fan installation',
    rating: '4.96',
    reviews: '39 reviews',
    pricePrefix: '',
    price: 199,
    duration: '15 mins',
    optionsSubtitle: '',
    bullets: [
      'Base stand assembly, tower unit mounting & filter check',
      'Remote control pairing & airflow speed setting'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'fan-repair',
    category: 'installation-replacement',
    name: 'Fan repair',
    rating: '4.79',
    reviews: '25K reviews',
    pricePrefix: '',
    price: 199,
    duration: '20 mins',
    optionsSubtitle: '',
    bullets: [
      'Capacitor, bearing replacement, noise fix or speed regulation repair',
      'Stator/winding inspection & lubrication'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'fan-uninstallation',
    category: 'uninstallation',
    name: 'Fan uninstallation',
    rating: '4.88',
    reviews: '4K reviews',
    pricePrefix: '',
    price: 179,
    duration: '10 mins',
    optionsSubtitle: '',
    bullets: [
      'Safe unmounting of ceiling fan from hook, disconnect wiring & blade removal',
      'Packaging check & hook safety inspection'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  }
];

export default function FanInstallationPage() {
  const [selectedService, setSelectedService] = useState(null);
  const { cart = [], addToCart } = useCart();
  const itemsList = Array.isArray(cart) ? cart : [];
  const router = useRouter();

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

      <main style={{ paddingTop: '32px', paddingBottom: '80px', maxWidth: '1240px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* 3-COLUMN / FLEX LAYOUT MATCHING SCREENSHOT */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '36px', alignItems: 'start' }}>

          {/* LEFT COLUMN - TITLE, RATING & VIEW SERVICES BUTTON */}
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.1 }}>
              Fan Installation
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569', marginBottom: '24px' }}>
              <Star size={16} fill="#6c5ce7" color="#6c5ce7" />
              <strong style={{ color: '#0f172a' }}>4.83</strong>
              <span>(139K bookings)</span>
            </div>

            <button style={{
              padding: '10px 24px',
              background: '#6c5ce7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              View Services
            </button>
          </div>

          {/* MIDDLE COLUMN - DYNAMIC CATEGORIES */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {fanCategories.map((cat) => {
              const catServices = fanServices.filter((s) => s.category === cat.id);
              if (catServices.length === 0) return null;

              return (
                <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    {cat.name}
                  </h2>

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
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                            {service.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px' }}>
                            <Star size={14} fill="#6c5ce7" color="#6c5ce7" />
                            <strong style={{ color: '#0f172a' }}>{service.rating}</strong>
                            <span style={{ color: '#64748b' }}>({service.reviews} reviews)</span>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                            {service.pricePrefix || ''}
                            <strong style={{ fontSize: '17px', color: '#0f172a' }}>₹{service.price}</strong>
                          </div>

                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#6c5ce7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            View details <ChevronRight size={14} />
                          </span>
                        </div>

                        {/* RIGHT IMAGE + ADD BUTTON */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: '130px', height: '110px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', padding: '10px' }}>
                            <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            
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
                          {service.optionsSubtitle && (
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                              {service.optionsSubtitle}
                            </span>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          {/* RIGHT SIDEBAR - JOAMEX PROMISE */}
          <aside style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
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

            {/* VIEW CART BUTTON */}
            <button
              onClick={() => router.push('/cart')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#6c5ce7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>₹598</span>
              <span>View Cart</span>
            </button>

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
            <img src={selectedService.image} alt={selectedService.name} style={{ width: '100%', height: '180px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px', background: '#f8fafc' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>{selectedService.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '13px' }}>
              <Star size={14} fill="#6c5ce7" color="#6c5ce7" />
              <strong style={{ color: '#0f172a' }}>{selectedService.rating}</strong>
              <span style={{ color: '#64748b' }}>({selectedService.reviews} reviews)</span>
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
