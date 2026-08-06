'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, Zap, ChevronRight } from 'lucide-react';

const carpenterCategories = [
  { id: 'wooden-door', name: 'Wooden door', icon: '🚪' },
  { id: 'cupboard-drawer', name: 'Cupboard & drawer', icon: '🗄️' },
  { id: 'decor-mirror', name: 'Décor & mirror', icon: '🖼️' },
  { id: 'shelf-cabinet', name: 'Shelf & cabinet', icon: '🪜' },
  { id: 'lock-hinge', name: 'Lock & Hinge', icon: '🔒' },
  { id: 'curtain-window', name: 'Curtain & window', icon: '🪟' },
  { id: 'furniture-repair', name: 'Furniture repair', icon: '🛋️' },
  { id: 'furniture-assembly', name: 'Furniture assembly', icon: '🪑' },
  { id: 'kitchen-fittings', name: 'Kitchen fittings', icon: '🍽️' },
  { id: 'bath-fittings-mirrors', name: 'Bath fittings & mirrors', icon: '🛁' },
  { id: 'balcony-fittings', name: 'Balcony fittings', icon: '🎋' },
  { id: 'at-home-consultation', name: 'At home consultation', icon: '👨‍🔧' }
];

const carpenterServices = [
  {
    id: 'combo-wooden-door',
    category: 'wooden-door',
    name: 'Combo for wooden door',
    isPackage: true,
    discountBadge: '10% OFF',
    rating: '4.77',
    reviews: '138K',
    pricePrefix: 'Starts at ',
    price: 999,
    duration: '2 hrs 30 mins',
    optionsSubtitle: 'Package',
    bullets: [
      'Repair or replacement of door locks, hinges, handles & latches',
      'Door alignment, resizing & smooth movement adjustment'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'new-door-installation',
    category: 'wooden-door',
    name: 'New door installation',
    rating: '4.70',
    reviews: '6K',
    pricePrefix: 'Starts at ',
    price: 999,
    duration: '1 hr 30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Fitting & mounting of new wooden door with frame alignment',
      'Lock, hinges & handle installation included'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'door-repair',
    category: 'wooden-door',
    name: 'Door repair',
    rating: '4.78',
    reviews: '145K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '30 mins',
    optionsSubtitle: '7 options',
    bullets: [
      'Scraping, planing, gap filling or hinge/latch alignment',
      'Fixing door scraping against floor or frame'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'door-locks-latches-repair',
    category: 'wooden-door',
    name: 'Door locks & latches repair',
    rating: '4.80',
    reviews: '7K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '25 mins',
    optionsSubtitle: '5 options',
    bullets: [
      'Repair or adjustment of malfunctioning door lock & latches',
      'Key movement smooth mechanism alignment'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'door-lock-replace-install',
    category: 'wooden-door',
    name: 'Door lock replace/install',
    rating: '4.81',
    reviews: '4K',
    pricePrefix: 'Starts at ',
    price: 129,
    duration: '30 mins',
    optionsSubtitle: '6 options',
    bullets: [
      'Installation or replacement of new mortise lock, rim lock or handle set',
      'Chisel fitting, strike plate alignment & key testing'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'door-hinges-repair-replacement',
    category: 'wooden-door',
    name: 'Door hinges repair/replacement',
    rating: '4.83',
    reviews: '895 reviews',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '35 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Heavy-duty stainless steel hinge replacement & alignment',
      'Screws tightening & anti-squeak lubrication'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'door-accessories-mesh-install',
    category: 'wooden-door',
    name: 'Door accessories & mesh installation',
    rating: '4.78',
    reviews: '71K',
    pricePrefix: 'Starts at ',
    price: 129,
    duration: '25 mins',
    optionsSubtitle: '8 options',
    bullets: [
      'Installation of door stoppers, magnetic catches, peep holes & door chains',
      'Mosquito mesh / wire net frame mounting & fitting'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'combo-cupboard-drawer',
    category: 'cupboard-drawer',
    name: 'Combo for cupboard & drawer',
    isPackage: true,
    discountBadge: '10% OFF',
    rating: '4.78',
    reviews: '154K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '40 mins',
    optionsSubtitle: 'Package',
    bullets: [
      'Complete inspection & repair of hinges, channels, handles & locks',
      'Door alignment & smooth sliding channel adjustment'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'cupboard-repair-installation',
    category: 'cupboard-drawer',
    name: 'Cupboard repair & installation',
    rating: '4.79',
    reviews: '105K',
    pricePrefix: 'Starts at ',
    price: 89,
    duration: '30 mins',
    optionsSubtitle: '6 options',
    bullets: [
      'Hinge repair, door alignment, magnet fitting & handle replacement',
      'Overhead shelf adjustment & wood gap filling'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'cupboard-drawer-locks',
    category: 'cupboard-drawer',
    name: 'Cupboard & drawer locks',
    rating: '4.75',
    reviews: '39K',
    pricePrefix: 'Starts at ',
    price: 79,
    duration: '20 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Installation or repair of key locks, cam locks or push-to-open latches',
      'Key alignment & latch hole drilling'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'cupboard-hinge-repair',
    category: 'cupboard-drawer',
    name: 'Cupboard hinge repair & channel fix',
    rating: '4.82',
    reviews: '64K',
    pricePrefix: 'Starts at ',
    price: 119,
    duration: '30 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Hydraulic or normal auto-hinge replacement',
      'Cabinet door alignment & soft-close check'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'drawer-channel-repair',
    category: 'cupboard-drawer',
    name: 'Drawer channel repair & replacement',
    rating: '4.80',
    reviews: '28K',
    pricePrefix: 'Starts at ',
    price: 129,
    duration: '35 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Telescopic channel installation for smooth sliding',
      'Drawer lock & handle replacement'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'drill-hang-service',
    category: 'decor-mirror',
    name: 'Drill & hang (Mirror / Wall decor)',
    rating: '4.86',
    reviews: '110K',
    pricePrefix: 'Starts at ',
    price: 79,
    duration: '20 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Hanging photo frames, heavy mirrors, artwork & clocks',
      'Precision laser level check & heavy wall anchors included'
    ],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'wall-shelf-installation',
    category: 'shelf-cabinet',
    name: 'Wall shelf & cabinet installation',
    rating: '4.78',
    reviews: '33K',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '40 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Floating wall shelf or overhead cabinet mounting',
      'Weight capacity load test & level alignment'
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'main-door-lock-install',
    category: 'lock-hinge',
    name: 'Main door lock & latch installation',
    rating: '4.83',
    reviews: '78K',
    pricePrefix: 'Starts at ',
    price: 299,
    duration: '45 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Heavy-duty main door lock, tower bolt & aldrop fitting',
      'Door eye/peep hole installation included'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'curtain-rod-installation',
    category: 'curtain-window',
    name: 'Curtain rod & track installation',
    rating: '4.85',
    reviews: '89K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '25 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Single/Double curtain rod bracket drilling & installation',
      'Roller blind or zebra blind wall fitting'
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bed-sofa-repair',
    category: 'furniture-repair',
    name: 'Bed / Sofa wooden repair',
    rating: '4.75',
    reviews: '21K',
    pricePrefix: 'Starts at ',
    price: 249,
    duration: '45 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Sofa leg fix, hydraulic bed lift repair or wooden slatted base repair',
      'Glueing, reinforcement & stability check'
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bed-wardrobe-assembly',
    category: 'furniture-assembly',
    name: 'Bed & Wardrobe assembly',
    rating: '4.84',
    reviews: '52K',
    pricePrefix: 'Starts at ',
    price: 399,
    duration: '1 hr 15 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Assembly of flat-pack bed, wardrobe, study table or TV unit',
      'Structural rigidity verification & alignment'
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'kitchen-accessories-install',
    category: 'kitchen-fittings',
    name: 'Kitchen accessories & modular fittings',
    rating: '4.81',
    reviews: '45K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Dish rack, cutlery tray, pull-out basket or corner carousel fitting',
      'Cabinet hole drilling & alignment check'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'combo-bath-fittings',
    category: 'bath-fittings-mirrors',
    name: 'Combo for bath fittings',
    isPackage: true,
    discountBadge: '10% OFF',
    rating: '4.79',
    reviews: '94K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '15 mins',
    optionsSubtitle: 'Package',
    bullets: [
      'Installation of mirror, towel rod, soap holder & shelf fittings',
      'Diamond-head bit tile drilling & wall anchor installation'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'mirror-installation',
    category: 'bath-fittings-mirrors',
    name: 'Mirror installation',
    rating: '4.80',
    reviews: '42K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '25 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Porcelain Tiles may require additional material cost (i.e. drilling)',
      'Precision laser levelling & heavy-duty mirror clip mounting'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bathroom-mirror-cabinet-install',
    category: 'bath-fittings-mirrors',
    name: 'Bathroom mirror cabinet installation',
    rating: '4.85',
    reviews: '3K',
    pricePrefix: 'Starts at ',
    price: 499,
    duration: '40 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Wall-mounted bathroom mirror cabinet / vanity box installation',
      'Level alignment, tile drilling & heavy wall anchor securing'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'clothes-hanger-installation',
    category: 'balcony-fittings',
    name: 'Clothes hanger installation',
    rating: '4.80',
    reviews: '31K',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '35 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Ceiling-mounted pulley cloth drying hanger fitting',
      'Rope threading, wall cleat mounting & weight test'
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'cloth-drying-rope-installation',
    category: 'balcony-fittings',
    name: 'Cloth drying rope installation',
    rating: '4.66',
    reviews: '8K',
    pricePrefix: '',
    price: 159,
    duration: '15 mins',
    optionsSubtitle: '',
    bullets: [
      'Wall-to-wall nylon/steel drying line installation with tensioners',
      'Hook drilling & secure wall anchor fitting'
    ],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'ceiling-hook-fastener-installation',
    category: 'balcony-fittings',
    name: 'Ceiling Hook/Fastener Installation',
    rating: '4.72',
    reviews: '1K',
    pricePrefix: '',
    price: 99,
    duration: '20 mins',
    optionsSubtitle: '',
    bullets: [
      'For hanging lights, ceiling hangers, planters, swings, etc.',
      'Heavy-duty expansion fastener / anchor bolt drilling'
    ],
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'book-a-carpenter',
    category: 'at-home-consultation',
    name: 'Book a carpenter',
    rating: '4.66',
    reviews: '164K',
    pricePrefix: '',
    price: 99,
    duration: '20 mins',
    optionsSubtitle: '',
    bullets: [
      'Expert evaluates your requirements and shares quote',
      'Service begins immediately after acceptance'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  }
];

export default function CarpenterPage() {
  const [activeCategory, setActiveCategory] = useState('wooden-door');
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
          Home / Electrician, Plumber & Carpenter / <strong style={{ color: '#0f172a' }}>Carpenter</strong>
        </div>

        {/* TITLE HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Carpenter</h1>
          <span style={{
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ⚡ Instant in 25 mins
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569', marginBottom: '28px' }}>
          <Star size={15} fill="#f59e0b" color="#f59e0b" />
          <strong style={{ color: '#0f172a' }}>4.77</strong>
          <span>(2.7 M bookings)</span>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '32px' }}>

          {/* LEFT SIDEBAR - SELECT A SERVICE GRID */}
          <aside style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              Select a service
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {carpenterCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleScrollTo(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px 6px',
                    background: activeCategory === cat.id ? '#f1f5f9' : '#ffffff',
                    border: activeCategory === cat.id ? '2px solid #0f172a' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '84px',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ fontSize: '24px', marginBottom: '6px', lineHeight: 1 }}>{cat.icon}</span>
                  <span style={{ fontSize: '11.5px', fontWeight: activeCategory === cat.id ? '700' : '500', color: '#0f172a', lineHeight: 1.2 }}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* MIDDLE COLUMN - HERO BANNER & SERVICES */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* HERO BANNER - SUPER SAVER */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '28px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div>
                <span style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}>
                  SUPER SAVER
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                  Affordable repairs
                </h2>
                <p style={{ fontSize: '16px', color: '#475569', margin: 0, fontWeight: '600' }}>
                  Starting at ₹49
                </p>
              </div>

              <div style={{ width: '180px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop&q=80"
                  alt="Carpenter repair"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* SERVICE SECTIONS */}
            {carpenterCategories.map((cat) => {
              const catServices = carpenterServices.filter((s) => s.category === cat.id);
              if (catServices.length === 0) return null;

              return (
                <div key={cat.id} id={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '10px 0 0 0' }}>
                    {cat.name}
                  </h2>

                  {cat.id === 'at-home-consultation' && (
                    <div style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '24px 28px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>
                          Know what you need?
                        </h3>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: '0 0 12px 0' }}>
                          Choose services directly & save 10%
                        </p>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Valid on booking above ₹300
                        </span>
                      </div>
                      <div style={{ width: '130px', height: '110px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80"
                          alt="Consultation expert"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  )}

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
                          
                          {/* PACKAGE BADGE */}
                          {service.isPackage && (
                            <span style={{ fontSize: '10px', fontWeight: '800', color: '#059669', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' }}>
                              M PACKAGE
                            </span>
                          )}

                          <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                            {service.name}
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '13px' }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <strong style={{ color: '#0f172a' }}>{service.rating}</strong>
                            <span style={{ color: '#64748b' }}>({service.reviews})</span>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                            {service.pricePrefix || ''}
                            <strong style={{ fontSize: '17px', color: '#0f172a' }}>₹{service.price}</strong>
                            <span style={{ color: '#64748b', fontWeight: '400' }}> • {service.duration}</span>
                          </div>

                          <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {service.bullets.map((b, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
                                <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
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
                            
                            {service.discountBadge && (
                              <div style={{
                                position: 'absolute',
                                top: '6px',
                                right: '6px',
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                {service.discountBadge}
                              </div>
                            )}

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
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>Get 10% off</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>On orders above ₹300</div>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>1/2</span>
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
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                  <Check size={16} color="#2563eb" /> 30-Day Post Service Warranty
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
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
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
                  <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
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
