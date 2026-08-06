'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Check, Star, ChevronRight, ShieldCheck } from 'lucide-react';

const furnitureCategories = [
  { id: 'wardrobes', name: 'Wardrobes', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop&q=80' },
  { id: 'tables-drawers', name: 'Tables & drawers', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&h=200&fit=crop&q=80' },
  { id: 'children', name: 'Children', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&h=200&fit=crop&q=80' },
  { id: 'beds-dining', name: 'Beds & dining', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&h=200&fit=crop&q=80' },
  { id: 'seating', name: 'Seating', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop&q=80' },
  { id: 'outdoor', name: 'Outdoor', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&h=200&fit=crop&q=80' },
  { id: 'storage', name: 'Storage', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200&h=200&fit=crop&q=80' },
  { id: 'furnishing', name: 'Furnishing', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&h=200&fit=crop&q=80' },
  { id: 'bathroom', name: 'Bathroom', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&q=80' },
  { id: 'washbasin-cabinets', name: 'Washbasin cabinets', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop&q=80' },
  { id: 'tv-furniture', name: 'TV furniture', image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=200&h=200&fit=crop&q=80' },
  { id: 'kitchen', name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop&q=80' }
];

const furnitureServices = [
  {
    id: 'sliding-door-wardrobe-with-drawers',
    category: 'wardrobes',
    name: 'Sliding door wardrobe with drawers',
    rating: '4.72',
    reviews: '441 reviews',
    pricePrefix: '',
    price: 799,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      'Sliding door track alignment, inner compartment partition & drawer slide channel installation',
      'Handle fitting & leveling check'
    ],
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'single-hinge-door-per-frame',
    category: 'wardrobes',
    name: 'Single hinge door (per frame)',
    rating: '4.78',
    reviews: '216 reviews',
    pricePrefix: '',
    price: 849,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Hinge mounting on door leaf & frame alignment',
      'Soft-close damper & handle attachment'
    ],
    image: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'double-hinge-door-per-frame',
    category: 'wardrobes',
    name: 'Double hinge door (per frame)',
    rating: '4.80',
    reviews: '523 reviews',
    pricePrefix: '',
    price: 1299,
    duration: '1 hr 30 mins',
    optionsSubtitle: '',
    bullets: [
      'Dual door leaf hinge fitting, gap alignment & magnet/latch setup',
      'Handle installation & leveling'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'single-wardrobe',
    category: 'wardrobes',
    name: 'Single wardrobe',
    rating: '4.84',
    reviews: '1K',
    pricePrefix: '',
    price: 599,
    duration: '1 hr 30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Unboxing, hardware assembly, door hinge alignment & shelf fitting',
      'Wall anchoring for anti-tip safety included'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'double-door-wardrobe',
    category: 'wardrobes',
    name: 'Double door wardrobe',
    rating: '4.83',
    reviews: '4K',
    pricePrefix: '',
    price: 849,
    duration: '3 hrs',
    optionsSubtitle: '2 options',
    bullets: [
      'Complete frame, panel & dual-door hinge assembly',
      'Drawer slide channel fitting & soft-close adjustment'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'three-door-wardrobe',
    category: 'wardrobes',
    name: 'Three door wardrobe',
    rating: '4.84',
    reviews: '4K',
    pricePrefix: '',
    price: 999,
    duration: '2 hrs',
    optionsSubtitle: '2 options',
    bullets: [
      '3-door wardrobe structure assembly, mirror alignment & internal drawer fitting',
      'Stability check & leveling'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'sliding-door-wardrobe',
    category: 'wardrobes',
    name: 'Sliding door wardrobe',
    rating: '4.83',
    reviews: '802 reviews',
    pricePrefix: '',
    price: 749,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      'Assembly of outer frame, top/bottom sliding rail track fitting & door roller adjustment',
      'Soft-closing dampener setup & anti-jump pin installation'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'double-sliding-door-per-frame',
    category: 'wardrobes',
    name: 'Double sliding door (per frame)',
    rating: '4.77',
    reviews: '835 reviews',
    pricePrefix: '',
    price: 1569,
    duration: '3 hrs',
    optionsSubtitle: '',
    bullets: [
      'Top & bottom guide track mounting, roller carriage fitting & door panel alignment',
      'Anti-jump safety pin & soft-close damper adjustment'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'frame-without-door-per-frame',
    category: 'wardrobes',
    name: 'Frame without door (per frame)',
    rating: '4.88',
    reviews: '147 reviews',
    pricePrefix: '',
    price: 749,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Inclusive of all interiors',
      'Frame structure assembly, clothes rod & shelf placement'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'standard-wardrobe-upto-3-frames',
    category: 'wardrobes',
    name: 'Standard wardrobe (Upto 3 frames)',
    rating: '4.72',
    reviews: '333 reviews',
    pricePrefix: '',
    price: 499,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      '90 minutes',
      'Inclusive of all interiors'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'additional-frame-wardrobe',
    category: 'wardrobes',
    name: 'Additional frame',
    rating: '4.97',
    reviews: '2K reviews',
    pricePrefix: '',
    price: 199,
    duration: '1 hr 30 mins',
    optionsSubtitle: '',
    bullets: [
      'Inclusive of all interiors'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'workspace-table-with-drawers',
    category: 'tables-drawers',
    name: 'Workspace table with drawers',
    rating: '4.88',
    reviews: '2K',
    pricePrefix: '',
    price: 679,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      'Table frame leg mounting, desk surface levelling & drawer track assembly',
      'Cable passage hole setup & anti-wobble glide adjustment'
    ],
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'office-chair-with-arm-support',
    category: 'tables-drawers',
    name: 'Office chair (with arm support)',
    rating: '4.86',
    reviews: '2K',
    pricePrefix: '',
    price: 419,
    duration: '60 mins',
    optionsSubtitle: '',
    bullets: [
      'Base caster wheel installation, hydraulic gas lift fitting & armrest mounting',
      'Seat backrest tilt mechanism check & ergonomic testing'
    ],
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1279?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'office-chair-without-arm-support',
    category: 'tables-drawers',
    name: 'Office chair (without arm support)',
    rating: '4.77',
    reviews: '587 reviews',
    pricePrefix: '',
    price: 299,
    duration: '5 mins',
    optionsSubtitle: '',
    bullets: [
      'Wheel base assembly, pneumatic cylinder setup & cushion mounting',
      'Height adjustment lever operation check'
    ],
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '5-drawer-chest',
    category: 'tables-drawers',
    name: '5 drawer chest',
    rating: '4.85',
    reviews: '2K',
    pricePrefix: '',
    price: 499,
    duration: '1 hr 10 mins',
    optionsSubtitle: '',
    bullets: [
      'Carcass frame assembly, 5-tier slide rail channel fitting & drawer front alignment',
      'Anti-tip wall bracket safety fixing included'
    ],
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '6-drawer-chest',
    category: 'tables-drawers',
    name: '6 drawer chest',
    rating: '4.89',
    reviews: '3K',
    pricePrefix: '',
    price: 599,
    duration: '2 hrs 30 mins',
    optionsSubtitle: '',
    bullets: [
      'Wide double-column 6-drawer cabinet framing & smooth slide adjustment',
      'Handle attachment, drawer divider & stability levelling'
    ],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '8-drawer-chest',
    category: 'tables-drawers',
    name: '8 drawer chest',
    rating: '4.89',
    reviews: '212 reviews',
    pricePrefix: '',
    price: 699,
    duration: '1 hr 35 mins',
    optionsSubtitle: '',
    bullets: [
      'Tall 8-tier vertical drawer box assembly & slide rail channel installation',
      'Anti-topple wall safety anchor installation'
    ],
    image: 'https://images.unsplash.com/photo-1558882224-dda166733046?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bedside-table-assembly',
    category: 'tables-drawers',
    name: 'Bedside table',
    rating: '4.89',
    reviews: '2K reviews',
    pricePrefix: '',
    price: 249,
    duration: '30 mins',
    optionsSubtitle: '',
    bullets: [
      'Assembly of bedside nightstand frame, drawer channel & shelf alignment',
      'Leg pad attachment & stability check'
    ],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'side-table-assembly',
    category: 'tables-drawers',
    name: 'Side table',
    rating: '4.87',
    reviews: '2K reviews',
    pricePrefix: '',
    price: 199,
    duration: '15 mins',
    optionsSubtitle: '',
    bullets: [
      'Unboxing & leg assembly for end/side table',
      'Leveling & scratch protection pad placement'
    ],
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'study-table-assembly',
    category: 'tables-drawers',
    name: 'Study table & desk assembly',
    rating: '4.82',
    reviews: '8K',
    pricePrefix: '',
    price: 399,
    duration: '1 hr',
    optionsSubtitle: '2 options',
    bullets: [
      'Leg mounting, tabletop alignment & drawer channel fitting',
      'Cable port grommet installation & rigidity check'
    ],
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'coffee-table-foldable',
    category: 'tables-drawers',
    name: 'Coffee table (foldable)',
    rating: '4.93',
    reviews: '423 reviews',
    pricePrefix: '',
    price: 399,
    duration: '35 mins',
    optionsSubtitle: '',
    bullets: [
      'Folding mechanism hinge alignment & leg latch safety check',
      'Tabletop levelling & smooth fold-test'
    ],
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'coffee-table-nest-of-tables',
    category: 'tables-drawers',
    name: 'Coffee table (nest of tables)',
    rating: '4.87',
    reviews: '532 reviews',
    pricePrefix: '',
    price: 499,
    duration: '1 hr 15 mins',
    optionsSubtitle: '',
    bullets: [
      'Assembly of 2 or 3 nesting tables, leg bolt tightening & size stacking check',
      'Floor protection rubber glide installation'
    ],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '2-drawer-chest',
    category: 'tables-drawers',
    name: '2 drawer chest',
    rating: '4.88',
    reviews: '2K reviews',
    pricePrefix: '',
    price: 329,
    duration: '1 hr 50 mins',
    optionsSubtitle: '',
    bullets: [
      'Assembly of 2-drawer chest carcass frame, ball-bearing slide channels & drawer box alignment',
      'Soft-close damper & anti-topple wall anchor installation'
    ],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '3-drawer-chest',
    category: 'tables-drawers',
    name: '3 drawer chest',
    rating: '4.91',
    reviews: '3K reviews',
    pricePrefix: '',
    price: 339,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      '3-tier chest carcass frame assembly, runner channel fitting & drawer front levelling',
      'Safety wall bracket fixing included'
    ],
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&h=300&fit=crop&q=80'
  },
  {
    id: '4-drawer-chest',
    category: 'tables-drawers',
    name: '4 drawer chest',
    rating: '4.89',
    reviews: '2K reviews',
    pricePrefix: '',
    price: 429,
    duration: '1 hr 15 mins',
    optionsSubtitle: '',
    bullets: [
      'Tall 4-drawer chest cabinet assembly, telescopic channel mounting & handle attachment',
      'Anti-tip safety wall anchoring'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'kids-high-chair-assembly',
    category: 'children',
    name: 'Kids high chair & crib assembly',
    rating: '4.86',
    reviews: '2K',
    pricePrefix: '',
    price: 299,
    duration: '45 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Child-safe screw tightening, harness check & stability test',
      'Smooth edge check & safety inspection'
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bed-frame-assembly',
    category: 'beds-dining',
    name: 'Bed frame & headboard assembly',
    rating: '4.85',
    reviews: '15K',
    pricePrefix: '',
    price: 699,
    duration: '2 hrs',
    optionsSubtitle: '3 options',
    bullets: [
      'King/Queen bed frame, slatted base & headboard mounting',
      'Hydraulic lift storage mechanism alignment'
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'sofa-recliner-assembly',
    category: 'seating',
    name: 'Sofa & recliner assembly',
    rating: '4.80',
    reviews: '6K',
    pricePrefix: '',
    price: 349,
    duration: '45 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Sectional sofa joining, wooden leg fitting & recliner cord setup',
      'Cushion alignment & levelling'
    ],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'patio-bench-assembly',
    category: 'outdoor',
    name: 'Outdoor patio bench & table assembly',
    rating: '4.78',
    reviews: '1K',
    pricePrefix: '',
    price: 399,
    duration: '1 hr',
    optionsSubtitle: '2 options',
    bullets: [
      'Weatherproof hardware tightening & ground level alignment',
      'Rust-proof bolt check'
    ],
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'cube-storage-bookshelf',
    category: 'storage',
    name: 'Cube storage & bookshelf assembly',
    rating: '4.81',
    reviews: '5K',
    pricePrefix: '',
    price: 299,
    duration: '45 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Panel joint assembly, backboard nailing & shelf pin insertion',
      'Wall anti-tip safety bracket mounting'
    ],
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'floating-wall-shelf',
    category: 'furnishing',
    name: 'Floating wall shelf assembly & mounting',
    rating: '4.83',
    reviews: '7K',
    pricePrefix: '',
    price: 199,
    duration: '30 mins',
    optionsSubtitle: '2 options',
    bullets: [
      'Concealed bracket drilling, level alignment & weight test',
      'Precision laser levelling included'
    ],
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'bathroom-cabinet-assembly',
    category: 'bathroom',
    name: 'Bathroom cabinet & mirror unit assembly',
    rating: '4.82',
    reviews: '1K',
    pricePrefix: '',
    price: 499,
    duration: '45 mins',
    optionsSubtitle: '',
    bullets: [
      'Moisture-resistant cabinet frame mounting, hinge setup & mirror attachment',
      'Wall drilling & anchor safety levelling'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'washbasin-under-sink-cabinet',
    category: 'washbasin-cabinets',
    name: 'Washbasin under-sink cabinet assembly',
    rating: '4.85',
    reviews: '890 reviews',
    pricePrefix: '',
    price: 699,
    duration: '1 hr',
    optionsSubtitle: '',
    bullets: [
      'Under-sink cabinet panel assembly, cutout alignment for plumbing & door hinge adjustment',
      'Waterproof seal check & anti-wobble levelling'
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'tv-wall-unit-assembly',
    category: 'tv-furniture',
    name: 'TV wall unit & console table assembly',
    rating: '4.79',
    reviews: '3K',
    pricePrefix: '',
    price: 799,
    duration: '1 hr 30 mins',
    optionsSubtitle: '',
    bullets: [
      'Console table structure fitting, drawer channel mounting & cable pass-through setup',
      'Laser levelling & anti-topple check'
    ],
    image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=400&h=300&fit=crop&q=80'
  },
  {
    id: 'kitchen-wall-cabinet-assembly',
    category: 'kitchen',
    name: 'Kitchen wall cabinet & trolley assembly',
    rating: '4.81',
    reviews: '2K',
    pricePrefix: '',
    price: 899,
    duration: '2 hrs',
    optionsSubtitle: '',
    bullets: [
      'Modular wall cabinet framing, soft-close hinge alignment & wire trolley rack fitting',
      'Heavy duty wall bracket fixing included'
    ],
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80'
  }
];

export default function FurnitureAssemblyPage() {
  const [activeCategory, setActiveCategory] = useState('wardrobes');
  const [selectedService, setSelectedService] = useState(null);
  const { cart = [], addToCart } = useCart();
  const itemsList = Array.isArray(cart) ? cart : [];
  const router = useRouter();
  const cartTotal = itemsList.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

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
        
        {/* TOP TITLE & RATING */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>
            Furniture Assembly
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#475569' }}>
            <Star size={16} fill="#6c5ce7" color="#6c5ce7" />
            <strong style={{ color: '#0f172a' }}>4.86</strong>
            <span>(391K bookings)</span>
          </div>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '32px' }}>

          {/* LEFT SIDEBAR */}
          <aside style={{ position: 'sticky', top: '85px', zIndex: 30, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* UC COVER BANNER */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#059669', marginBottom: '2px' }}>
                  <ShieldCheck size={16} /> UC COVER
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontWeight: '600' }}>60 days warranty on all services</div>
              </div>
              <ChevronRight size={18} color="#64748b" />
            </div>

            {/* SELECT A SERVICE GRID */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
                Select a service
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {furnitureCategories.map((cat) => (
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
            </div>

          </aside>

          {/* MIDDLE COLUMN - SERVICE SECTIONS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {furnitureCategories.map((cat) => {
              const catServices = furnitureServices.filter((s) => s.category === cat.id);
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
                            <span style={{ color: '#64748b' }}>({service.reviews.includes('reviews') ? service.reviews : `${service.reviews} reviews`})</span>
                          </div>

                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                            <strong style={{ fontSize: '17px', color: '#0f172a' }}>₹{service.price}</strong>
                            <span style={{ margin: '0 6px', color: '#cbd5e1' }}>•</span>
                            <span style={{ color: '#64748b' }}>{service.duration}</span>
                          </div>

                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#6c5ce7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            View details <ChevronRight size={14} />
                          </span>
                        </div>

                        {/* RIGHT IMAGE + ADD BUTTON */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '130px', flexShrink: 0 }}>
                          <div style={{ position: 'relative', width: '130px', height: '110px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc' }}>
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

          {/* RIGHT SIDEBAR - PROMISE & CART */}
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
              <span>₹{cartTotal > 0 ? cartTotal : 598}</span>
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
            <img src={selectedService.image} alt={selectedService.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>{selectedService.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '13px' }}>
              <Star size={14} fill="#6c5ce7" color="#6c5ce7" />
              <strong style={{ color: '#0f172a' }}>{selectedService.rating}</strong>
              <span style={{ color: '#64748b' }}>({selectedService.reviews.includes('reviews') ? selectedService.reviews : `${selectedService.reviews} reviews`})</span>
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
