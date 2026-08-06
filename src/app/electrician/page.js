'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, Zap, ShieldCheck, ChevronRight } from 'lucide-react';

const electricianCategories = [
  { id: 'switch-socket', name: 'Switch & socket', icon: '🔌' },
  { id: 'fan', name: 'Fan', icon: '🌀' },
  { id: 'light', name: 'Light', icon: '💡' },
  { id: 'wiring', name: 'Wiring', icon: '⚡' },
  { id: 'doorbell-security', name: 'Doorbell & security', icon: '🔔' },
  { id: 'mcb-fuse', name: 'MCB/fuse', icon: '📟' },
  { id: 'appliances', name: 'Appliances', icon: '📺' },
  { id: 'consultation', name: 'Book a consultation', icon: '👨‍🔧' }
];

const electricianServices = [
  {
    id: 'switch-socket-repair',
    category: 'switch-socket',
    name: 'Switch/socket repair & replacement',
    rating: '4.83',
    reviews: '182K',
    pricePrefix: 'Starts at ',
    price: 69,
    duration: '20 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Repair or replacement of broken/sparking switch or socket',
      'Spare parts rate card shown before service',
      '30-day warranty on all electrical repairs'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'switchboard-replacement',
    category: 'switch-socket',
    name: 'Switchboard repair & replacement',
    rating: '4.85',
    reviews: '94K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Modular or non-modular switchboard installation & repair',
      'Complete safety grounding & short-circuit inspection'
    ],
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'plug-replacement',
    category: 'switch-socket',
    name: 'Plug replacement',
    rating: '4.82',
    reviews: '13K',
    pricePrefix: 'Starts at ',
    price: 69,
    duration: '15 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Replacement of 6A/16A plug top for heavy appliances',
      'Spare parts rate card shown before service'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'new-switchbox-installation',
    category: 'switch-socket',
    name: 'New switchbox installation',
    rating: '4.79',
    reviews: '85K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '35 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Installed in specified area for new power outlet',
      'Concealed or surface wiring fitting included'
    ],
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'fan-repair',
    category: 'fan',
    name: 'Fan repair (Ceiling/Exhaust/Wall)',
    rating: '4.84',
    reviews: '110K',
    pricePrefix: 'Starts at ',
    price: 119,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Capacitor replacement, regulator fix or noise issue resolution',
      'Tested with high voltage insulation tools'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'ceiling-fan-install',
    category: 'fan',
    name: 'Ceiling fan installation',
    rating: '4.86',
    reviews: '145K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '40 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Assembly, mounting & safety hook testing',
      'Wiring hookup with regulator'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'decorative-fan-install',
    category: 'fan',
    name: 'Decorative fan installation',
    rating: '4.75',
    reviews: '1K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '35 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Installation of chandelier/decorative ceiling fan',
      'Hook & wiring assembly included'
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ventilatore_a_soffitto_%283%29.png/330px-Ventilatore_a_soffitto_%283%29.png'
  },
  {
    id: 'smart-bldc-fan-install',
    category: 'fan',
    name: 'Smart/BLDC fan installation',
    rating: '4.82',
    reviews: '21K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '30 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Installation of energy-saving BLDC/smart remote fan',
      'Remote pairing & regulator bypass testing'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'exhaust-pedestal-fan-install',
    category: 'fan',
    name: 'Exhaust/pedestal/tower fan installation',
    rating: '4.81',
    reviews: '33K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '25 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Exhaust fan wall mounting or pedestal fan assembly',
      'Testing & power socket wiring check'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'fan-regulator-replacement',
    category: 'fan',
    name: 'Fan regulator replacement',
    rating: '4.82',
    reviews: '55K',
    pricePrefix: 'Starts at ',
    price: 79,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Replacement or installation of rotary/step fan regulator',
      'Spare parts rate card shown before service'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'fancy-light-install',
    category: 'light',
    name: 'Fancy light installation/replacement',
    rating: '4.82',
    reviews: '53K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Wall sconce, decorative light or chandelier fitting',
      'Assembly, mounting & concealed wiring test included'
    ],
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'tubelight-repair-install',
    category: 'light',
    name: 'Tubelight repair & installation',
    rating: '4.85',
    reviews: '113K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'LED tube light mounting, batten replacement or choke fix',
      'Wiring connection & power line check included'
    ],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bulb-install-replacement',
    category: 'light',
    name: 'Bulb installation/replacement',
    rating: '4.84',
    reviews: '44K',
    pricePrefix: 'Starts at ',
    price: 49,
    duration: '15 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Holder replacement, LED bulb installation or ceiling socket fix',
      'Safety testing & voltage check'
    ],
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'ceiling-light-install',
    category: 'light',
    name: 'Ceiling light installation',
    rating: '4.82',
    reviews: '69K',
    pricePrefix: 'Starts at ',
    price: 89,
    duration: '25 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Surface panel light or false ceiling LED light installation',
      'Concealed wiring setup & safety test'
    ],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'hanging-light-install',
    category: 'light',
    name: 'Hanging light installation',
    rating: '4.79',
    reviews: '14K',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '35 mins',
    optionsSubtitle: '3 options',
    bullets: [
      'Pendant light assembly & ceiling hook installation',
      'Height adjustment & wiring connection check'
    ],
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'chandelier-installation',
    category: 'light',
    name: 'Chandelier installation',
    rating: '4.69',
    reviews: '2K',
    pricePrefix: 'Starts at ',
    price: 499,
    duration: '60 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Heavy-duty ceiling hook installation & load safety test',
      'Complex crystal/glass piece assembly & wiring'
    ],
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'new-internal-wiring',
    category: 'wiring',
    name: 'New internal wiring (per 5m)',
    rating: '4.73',
    reviews: '17K',
    pricePrefix: 'Starts at ',
    price: 199,
    duration: '15 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Concealed PVC pipe wiring laying (per 5 meter segment)',
      'High-quality copper wire connection & safety grounding'
    ],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'new-external-wiring',
    category: 'wiring',
    name: 'New external wiring (per 5m)',
    rating: '4.75',
    reviews: '29K',
    pricePrefix: 'Starts at ',
    price: 119,
    duration: '20 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Open casing & capping trunking wiring (per 5 meter segment)',
      'Secure wall clipping & short-circuit inspection'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'regular-doorbell-install',
    category: 'doorbell-security',
    name: 'Regular doorbell installation',
    rating: '4.84',
    reviews: '17K',
    pricePrefix: 'Starts at ',
    price: 99,
    duration: '20 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Installation of electric or wireless doorbell unit',
      'Wiring hookup to switchboard & sound check'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'video-doorbell-install',
    category: 'doorbell-security',
    name: 'Video doorbell installation',
    rating: '4.71',
    reviews: '1K',
    pricePrefix: 'Starts at ',
    price: 600,
    duration: '45 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Smart video doorbell camera wall mounting & power connection',
      'Wi-Fi setup & mobile app pairing'
    ],
    image: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'wireless-cctv-install',
    category: 'doorbell-security',
    name: 'Wireless CCTV installation',
    rating: '4.71',
    reviews: '23K',
    pricePrefix: 'Starts at ',
    price: 299,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Wireless security camera wall/ceiling mounting',
      'Power cable connection, angle alignment & mobile app setup'
    ],
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'mcb-fuse-repair',
    category: 'mcb-fuse',
    name: 'MCB/fuse repair',
    rating: '4.77',
    reviews: '17K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Single/Double pole MCB, main switch or main fuse repair',
      'Tripping issue diagnosis & load balance troubleshooting'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'mcb-fuse-replacement',
    category: 'mcb-fuse',
    name: 'MCB/fuse replacement',
    rating: '4.76',
    reviews: '11K',
    pricePrefix: 'Starts at ',
    price: 149,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Replacement of burnt or faulty single pole / double pole MCB',
      'Distribution board safety check & wire connection'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'submeter-installation',
    category: 'mcb-fuse',
    name: 'Submeter installation',
    rating: '4.78',
    reviews: '2K',
    pricePrefix: '',
    price: 249,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Analog or digital single-phase submeter wall installation',
      'Main load wire connection & initial reading verification'
    ],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'home-theatre-installation',
    category: 'appliances',
    name: 'Home theatre installation',
    rating: '4.76',
    reviews: '6K',
    pricePrefix: '',
    price: 399,
    duration: '1 hr 20 mins',
    optionsSubtitle: '',
    bullets: [
      'Installation of 2 speakers, 1 sound bar & 1 subwoofer',
      'Concealed wiring connectivity & sound calibration'
    ],
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'tv-installation',
    category: 'appliances',
    name: 'TV installation',
    rating: '4.85',
    reviews: '36K',
    pricePrefix: 'Starts at ',
    price: 399,
    duration: '45 mins',
    optionsSubtitle: '5 options',
    bullets: [
      'Wall mount bracket drilling & secure TV mounting (up to 65 inch)',
      'Ports connection & display functionality check'
    ],
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'tv-uninstallation',
    category: 'appliances',
    name: 'TV uninstallation',
    rating: '4.86',
    reviews: '5K',
    pricePrefix: 'Starts at ',
    price: 249,
    duration: '30 mins',
    optionsSubtitle: '4 options',
    bullets: [
      'Safe unmounting of TV from wall bracket',
      'Cable disconnection & packing prep'
    ],
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'soundbar-installation',
    category: 'appliances',
    name: 'Sound bar installation',
    rating: '4.88',
    reviews: '5K',
    pricePrefix: '',
    price: 99,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Wall mounting or TV stand alignment of sound bar',
      'Audio cable wiring & remote testing included'
    ],
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'karban-airzone-installation',
    category: 'appliances',
    name: 'Karban Airzone installation',
    rating: '4.66',
    reviews: '45',
    pricePrefix: 'Starts at ',
    price: 399,
    duration: '45 mins',
    optionsSubtitle: '1 option',
    bullets: [
      'Includes electrical connection and remote testing',
      'Wall mounting & safety power line check'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'inverter-installation',
    category: 'appliances',
    name: 'Inverter installation',
    rating: '4.74',
    reviews: '8K',
    pricePrefix: 'Starts at ',
    price: 485,
    duration: '60 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Inverter & battery wiring connection to main distribution box',
      'Distilled water check, polarity test & load backup check'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'stabiliser-installation',
    category: 'appliances',
    name: 'Stabiliser installation',
    rating: '4.84',
    reviews: '6K',
    pricePrefix: '',
    price: 149,
    duration: '45 mins',
    optionsSubtitle: '',
    bullets: [
      'Wall mounting of AC/Mainline voltage stabilizer',
      'Wiring connection to appliance socket & high/low voltage test'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'inverter-fuse-replacement',
    category: 'appliances',
    name: 'Inverter fuse replacement',
    rating: '4.67',
    reviews: '2K',
    pricePrefix: '',
    price: 99,
    duration: '15 mins',
    optionsSubtitle: '',
    bullets: [
      'Replacement of blown or damaged glass/blade inverter fuse',
      'Voltage continuity test & load test'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'inverter-servicing',
    category: 'appliances',
    name: 'Inverter servicing',
    rating: '4.76',
    reviews: '13K',
    pricePrefix: '',
    price: 249,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Terminal dust removal & distilled water top-up',
      'Acid level check, terminal grease coating & backup test'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'inverter-checkup',
    category: 'appliances',
    name: 'Inverter check-up',
    rating: '4.71',
    reviews: '16K',
    pricePrefix: '',
    price: 159,
    duration: '40 mins',
    optionsSubtitle: '',
    bullets: [
      'Complete check-up to identify issues before repair',
      'Detailed diagnosis of charging, battery & circuit board'
    ],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'inverter-uninstallation',
    category: 'appliances',
    name: 'Inverter uninstallation',
    rating: '4.92',
    reviews: '2K',
    pricePrefix: '',
    price: 499,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      'Disconnecting inverter & battery setup safely from mains',
      'Terminal isolation & safety capping'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'electrician-consultation',
    category: 'consultation',
    name: 'Electrician consultation',
    rating: '4.74',
    reviews: '153K',
    pricePrefix: '',
    price: 49,
    duration: '35 mins',
    optionsSubtitle: '',
    bullets: [
      'An electrician will assess your needs upon arrival at your home',
      'A quote will be provided before the service begins'
    ],
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80'
  },
];

export default function ElectricianPage() {
  const [activeCategory, setActiveCategory] = useState('switch-socket');
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

  const totalCartCount = itemsList.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalCartAmount = itemsList.reduce((acc, curr) => acc + (curr.price || 0) * (curr.quantity || 1), 0);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header />

      <main style={{ paddingTop: '24px', paddingBottom: '80px', maxWidth: '1240px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
        
        {/* BREADCRUMB */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          Home / Electrician, Plumber & Carpenter / <strong style={{ color: '#0f172a' }}>Electrician</strong>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '32px' }}>

          {/* LEFT SIDEBAR - SELECT A SERVICE GRID */}
          <aside style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              Select a service
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {electricianCategories.map((cat) => (
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
            
            {/* HERO BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderRadius: '16px',
              padding: '28px 32px',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(15,23,42,0.1)'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
                <Zap size={14} color="#facc15" fill="#facc15" /> Certified Electrician Experts
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                Electrician Services
              </h1>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Starting at just ₹69 • 30-Min Doorstep Service • 30-Day Warranty
              </p>
            </div>

            {/* SERVICE SECTIONS */}
            {electricianCategories.map((cat) => {
              const catServices = electricianServices.filter((s) => s.category === cat.id);
              if (catServices.length === 0) return null;

              return (
                <div key={cat.id} id={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '10px 0 0 0' }}>
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
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        <div style={{ flex: 1 }}>
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
                <div style={{ fontSize: '12px', color: '#64748b' }}>On orders above ₹499</div>
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
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Joamex Promise</h3>
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

      {/* FLOATING CART BAR */}
      <Footer />
    </div>
  );
}
