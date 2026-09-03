'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './services.css';
import { Search, Star, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AllServicesPage() {
    const router = useRouter();

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [services, setServices] = useState([]);

    // Fetch services dynamically from all sections
    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                // Fetch from all relevant APIs
                const [essentialRes, bookedRes, renoRes, solarRes] = await Promise.all([
                    fetch('/api/admin/essential-services?mode=live').catch(() => null),
                    fetch('/api/admin/most-booked-services?mode=live').catch(() => null),
                    fetch('/api/admin/home-renovation?mode=live').catch(() => null),
                    fetch('/api/admin/solar-water?mode=live').catch(() => null)
                ]);

                let allItems = [];

                const processRes = async (res, defaultCat) => {
                    if (res && res.ok) {
                        const data = await res.json();
                        if (data.success && Array.isArray(data.items)) {
                            return data.items.map(item => ({
                                id: item._id || item.id || `srv-${Math.random()}`,
                                title: item.title,
                                category: defaultCat,
                                description: item.subtitle || `${item.title} service.`,
                                price: item.price || 499,
                                image: item.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
                                route: item.route || '',
                                rating: '4.85',
                                reviews: '100+',
                            }));
                        }
                    }
                    return [];
                };

                const [essential, booked, reno, solar] = await Promise.all([
                    processRes(essentialRes, 'Essential Services'),
                    processRes(bookedRes, 'Most Booked'),
                    processRes(renoRes, 'Home Renovation'),
                    processRes(solarRes, 'Solar & Water')
                ]);

                allItems = [...essential, ...booked, ...reno, ...solar];

                // Append any custom admin categories or services if stored in localStorage (optional legacy support)
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
                                rating: s.rating || '4.85',
                                reviews: s.reviews || '100+',
                                image: s.image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
                                route: s.route || ''
                            }));
                            allItems = [...allItems, ...formatted];
                        }
                    }
                } catch (e) {
                    console.error('Error loading custom admin services:', e);
                }

                // Remove duplicates by title
                const uniqueServices = [];
                const seenTitles = new Set();
                for (const item of allItems) {
                    if (!seenTitles.has(item.title)) {
                        seenTitles.add(item.title);
                        uniqueServices.push(item);
                    }
                }

                setServices(uniqueServices);

            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchAllServices();
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
                                    onClick={() => { if (service.route && service.route !== '#') router.push(service.route); }}
                                    style={{ cursor: service.route && service.route !== '#' ? 'pointer' : 'default' }}
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
                                        onClick={() => { if (service.route && service.route !== '#') router.push(service.route); }}
                                        style={{ cursor: service.route && service.route !== '#' ? 'pointer' : 'default' }}
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
                                        onClick={() => { if (service.route && service.route !== '#') router.push(service.route); }}
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
