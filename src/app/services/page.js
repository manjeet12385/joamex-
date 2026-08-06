'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './services.css';
import { Search, Star, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

const ALL_SERVICES_CATALOG = [
    {
        id: 'srv-ac-gas',
        title: 'AC Gas Refilling & Charging',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Complete leak testing & 100% pure refrigerant gas charging for split & window ACs.',
        price: 1299,
        originalPrice: 1699,
        rating: '4.86',
        reviews: '14.2k',
        image: '/service-ac.png',
        route: '/ac-repair',
        bestseller: true
    },
    {
        id: 'srv-ac-foam',
        title: 'AC Foam Jet Deep Service',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Deep cleaning with high-pressure foam jet technology for 2x cooling efficiency.',
        price: 599,
        originalPrice: 799,
        rating: '4.91',
        reviews: '28.5k',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
        route: '/ac-repair',
        bestseller: true
    },
    {
        id: 'srv-bath-clean',
        title: 'Bathroom Deep Cleaning',
        category: 'Home Cleaning & Pest Control',
        categorySlug: 'cleaning',
        description: 'Hard water stain removal, tile scrubbing, mirror polishing & sanitization.',
        price: 499,
        originalPrice: 699,
        rating: '4.82',
        reviews: '9.4k',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
        route: '/services/bathroom-cleaning',
        bestseller: true
    },
    {
        id: 'srv-switch-repair',
        title: 'Switch & Socket Installation / Repair',
        category: 'Electrician & Plumber',
        categorySlug: 'electrician',
        description: 'Replacement and repair of modular switches, sockets, indicator lights & MCBs.',
        price: 99,
        originalPrice: 149,
        rating: '4.84',
        reviews: '18.1k',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
        route: '/electrician'
    },
    {
        id: 'srv-flush-repair',
        title: 'Flush Tank & Toilet Leak Repair',
        category: 'Electrician & Plumber',
        categorySlug: 'electrician',
        description: 'Fixing continuous flush leaks, siphon replacement, valve & handle fitting.',
        price: 149,
        originalPrice: 249,
        rating: '4.79',
        reviews: '7.8k',
        image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?w=400&h=300&fit=crop',
        route: '/plumber'
    },
    {
        id: 'srv-wm-spin',
        title: 'Washing Machine Spin & Motor Repair',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Fixing drum noise, spin tub vibration, belt replacement & PCB diagnostics.',
        price: 599,
        originalPrice: 899,
        rating: '4.80',
        reviews: '11.3k',
        image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
        route: '/washing-machine'
    },
    {
        id: 'srv-fridge-repair',
        title: 'Single & Double Door Refrigerator Repair',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Compressor checkup, cooling coil repair, thermostat & gas charging.',
        price: 399,
        originalPrice: 599,
        rating: '4.85',
        reviews: '8.7k',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop',
        route: '/refrigerator'
    },
    {
        id: 'srv-tv-install',
        title: 'TV Wall Mounting & Uninstallation',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Secure wall mount bracket fitting for LED/LCD TVs up to 75 inches.',
        price: 299,
        originalPrice: 449,
        rating: '4.88',
        reviews: '15.6k',
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop',
        route: '/television'
    },
    {
        id: 'srv-ro-filter',
        title: 'Water Purifier RO Filter Service & Repair',
        category: 'AC & Appliance Repair',
        categorySlug: 'ac',
        description: 'Sediment, carbon filter change, membrane cleaning & TDS calibration.',
        price: 299,
        originalPrice: 499,
        rating: '4.87',
        reviews: '12.4k',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&h=300&fit=crop',
        route: '/water-purifier'
    },
    {
        id: 'srv-full-home-clean',
        title: 'Full Home Deep Cleaning',
        category: 'Home Cleaning & Pest Control',
        categorySlug: 'cleaning',
        description: 'Comprehensive cleaning for bedrooms, living area, kitchen, balcony & washrooms.',
        price: 3499,
        originalPrice: 4499,
        rating: '4.89',
        reviews: '6.1k',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
        route: '/services/full-home-cleaning',
        bestseller: true
    },
    {
        id: 'srv-pest-cockroach',
        title: 'Cockroach & Pest Extermination',
        category: 'Home Cleaning & Pest Control',
        categorySlug: 'cleaning',
        description: 'Odorless gel baiting & spray treatment with 90 days protection guarantee.',
        price: 899,
        originalPrice: 1199,
        rating: '4.83',
        reviews: '10.5k',
        image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=300&fit=crop',
        route: '/services/cockroach-control'
    },
    {
        id: 'srv-furniture-assembly',
        title: 'IKEA & Modular Furniture Assembly',
        category: 'Renovation & Interior',
        categorySlug: 'renovation',
        description: 'Assembly of wardrobes, bed frames, study desks, shoe racks & wall shelves.',
        price: 499,
        originalPrice: 749,
        rating: '4.78',
        reviews: '4.2k',
        image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=300&fit=crop',
        route: '/services/furniture-assembly'
    },
    {
        id: 'srv-wall-paint',
        title: 'Wall Painting & Waterproofing',
        category: 'Renovation & Interior',
        categorySlug: 'renovation',
        description: 'Express home painting, wall texture, damp proofing & color consultation.',
        price: 1999,
        originalPrice: 2999,
        rating: '4.86',
        reviews: '3.8k',
        image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
        route: '/services/furniture-assembly'
    },
    {
        id: 'srv-mens-grooming',
        title: 'Men\'s Haircut & Beard Styling',
        category: 'Men\'s Grooming',
        categorySlug: 'grooming',
        description: 'Hygienic at-home hair trimming, fade haircut, beard shaping & head massage.',
        price: 299,
        originalPrice: 499,
        rating: '4.87',
        reviews: '19.8k',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
        route: '/services/men-massage'
    },
    {
        id: 'srv-women-facial',
        title: 'Glow Facial & At-Home Waxing',
        category: 'Women\'s Beauty & Spa',
        categorySlug: 'beauty',
        description: 'Organic skin glow facial, Rica wax, manicure-pedicure by trained beauticians.',
        price: 799,
        originalPrice: 1199,
        rating: '4.92',
        reviews: '22.3k',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400&h=300&fit=crop',
        route: '/services/bridal-makeup',
        bestseller: true
    },
    {
        id: 'srv-cctv-setup',
        title: 'CCTV Camera Installation & Smart Locks',
        category: 'Home Security & Solar',
        categorySlug: 'security',
        description: 'HD IP camera wiring, DVR setup, mobile app connection & smart door locks.',
        price: 1499,
        originalPrice: 1999,
        rating: '4.84',
        reviews: '5.2k',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop',
        route: '/services/geyser-repair'
    },
    {
        id: 'srv-solar-heater',
        title: 'Solar Water Heater & Panel Maintenance',
        category: 'Home Security & Solar',
        categorySlug: 'security',
        description: 'Rooftop solar panel cleaning, inverter checkup & solar water heater servicing.',
        price: 999,
        originalPrice: 1499,
        rating: '4.81',
        reviews: '2.9k',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&h=300&fit=crop',
        route: '/services/geyser-repair'
    }
];

export default function AllServicesPage() {
    const router = useRouter();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [services, setServices] = useState(ALL_SERVICES_CATALOG);

    // Merge any custom admin categories or services if stored in localStorage
    useEffect(() => {
        try {
            const adminServices = localStorage.getItem('admin_services_list');
            if (adminServices) {
                const parsed = JSON.parse(adminServices);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const formatted = parsed.map(s => ({
                        id: s.id || `admin-${Math.random()}`,
                        title: s.name || s.title,
                        category: s.category || 'General',
                        description: s.description || `${s.category} service by top verified professionals.`,
                        price: Number(s.price) || 499,
                        originalPrice: Math.round((Number(s.price) || 499) * 1.25),
                        rating: s.rating || '4.85',
                        reviews: s.reviews || '100+',
                        image: s.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
                        route: s.route || '/ac-repair'
                    }));
                    setServices([...ALL_SERVICES_CATALOG, ...formatted]);
                }
            }
        } catch (e) {
            console.error('Error loading custom admin services:', e);
        }
    }, []);

    // Unique Categories list for Pills
    const categoriesList = useMemo(() => {
        const set = new Set();
        services.forEach(s => {
            if (s.category) set.add(s.category);
        });
        return ['All', ...Array.from(set)];
    }, [services]);

    // Filtered Services
    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
            const matchesSearch = !searchTerm ||
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [services, selectedCategory, searchTerm]);

    return (
        <div className="all-services-page">
            <Header />

            {/* HERO BANNER & SEARCH */}
            <section className="services-hero">
                <div className="services-hero-content">
                    <div className="services-hero-badge">
                        <Sparkles size={16} /> Verified Home Professionals
                    </div>
                    <h1>
                        Explore All <span>Home Services</span>
                    </h1>
                    <p>
                        Book trusted appliance repair, deep cleaning, electrician, plumbing & grooming experts at your doorstep.
                    </p>

                    {/* Search Input */}
                    <div className="services-search-wrapper">
                        <Search className="services-search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search AC repair, sofa cleaning, plumber, haircut..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="services-search-input"
                        />
                    </div>
                </div>
            </section>

            {/* MAIN CATALOG AREA */}
            <main className="services-main-container">
                {/* Category Pills Filter */}
                <div className="category-filter-scroll">
                    {categoriesList.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat === 'All' && <Filter size={14} />}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Section Title & Stats */}
                <div className="services-results-header">
                    <h2>
                        {selectedCategory === 'All' ? 'All Available Services' : selectedCategory}
                        <span className="services-count-badge">{filteredServices.length} Services</span>
                    </h2>
                </div>

                {/* Services Grid */}
                {filteredServices.length > 0 ? (
                    <div className="services-grid">
                        {filteredServices.map((service, index) => (
                            <div
                                key={service.id || index}
                                className="service-item-card"
                            >
                                <div
                                    className="service-card-image-wrapper"
                                    onClick={() => router.push(service.route || '/ac-repair')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img src={service.image} alt={service.title} />
                                    <span className="category-tag-badge">{service.category}</span>
                                    {service.bestseller && (
                                        <span className="discount-tag-badge">HOT</span>
                                    )}
                                </div>

                                <div className="service-card-body">
                                    <h3
                                        className="service-card-title"
                                        onClick={() => router.push(service.route || '/ac-repair')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p className="service-card-description">
                                        {service.description}
                                    </p>

                                    <div className="service-card-rating">
                                        <Star size={16} fill="#fbbf24" stroke="none" />
                                        {service.rating} <span>({service.reviews} reviews)</span>
                                    </div>
                                </div>

                                <div className="service-card-footer">
                                    <div className="service-price-block">
                                        {service.originalPrice && (
                                            <span className="service-original-price">₹{service.originalPrice}</span>
                                        )}
                                        <span className="service-current-price">₹{service.price}</span>
                                    </div>

                                    <button
                                        className="book-service-btn"
                                        onClick={() => router.push(service.route || '/ac-repair')}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-services-found">
                        <h3>No Services Found</h3>
                        <p>We couldn't find any services matching "{searchTerm}". Try searching for something else or browse all categories.</p>
                        <button
                            className="filter-pill active"
                            style={{ margin: '0 auto', display: 'inline-flex' }}
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
