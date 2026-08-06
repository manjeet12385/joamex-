'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './partner-premium.css';
import {
    FaWallet, FaCalendarAlt, FaStar, FaUser, FaBox, FaLayerGroup, FaImage, FaTicketAlt,
    FaSearch, FaBell, FaMoon, FaPlus, FaFilter, FaSort, FaEllipsisV, FaCheckCircle,
    FaClock, FaSpinner, FaArrowUp, FaCreditCard, FaFileInvoiceDollar, FaList, FaUserCircle
} from 'react-icons/fa';

export default function PartnerDashboardPremium() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [partner, setPartner] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [activeBookingTab, setActiveBookingTab] = useState('All Bookings');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [bookings, setBookings] = useState([]);

    // Filtering & Sorting State for Live Service Catalog
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterRating, setFilterRating] = useState('All');
    const [sortBy, setSortBy] = useState('Default');
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    // Categories & Hierarchy Management State
    const [categoriesList, setCategoriesList] = useState([
        {
            id: 1, name: 'Home Renovation', type: 'Parent', status: true, expanded: true, icon: '🏠', subs: [
                { id: 11, name: 'Painting Services', status: true },
                { id: 12, name: 'Flooring & Tiling', status: true }
            ]
        },
        {
            id: 2, name: 'Plumbing & HVAC', type: 'Parent', status: true, expanded: true, icon: '🔧', subs: [
                { id: 21, name: 'Pipe Fittings', status: true },
                { id: 22, name: 'AC Service', status: false }
            ]
        }
    ]);
    const [parentModalOpen, setParentModalOpen] = useState(false);
    const [newParentName, setNewParentName] = useState('');
    const [subModalOpen, setSubModalOpen] = useState(false);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [newSubName, setNewSubName] = useState('');

    // Admin Master Categories & Partner Category Requests State
    const [adminMasterCategories, setAdminMasterCategories] = useState([]);
    const [partnerCategoryRequests, setPartnerCategoryRequests] = useState([]);
    const [selectedCategoryToRequest, setSelectedCategoryToRequest] = useState('');
    const [submittingCatReq, setSubmittingCatReq] = useState(false);

    // Banners Tab State
    const [bannerTitle, setBannerTitle] = useState('');
    const [bannerPlacement, setBannerPlacement] = useState('Main Home Screen');
    const [bannerCategory, setBannerCategory] = useState('Deep Cleaning');
    const [bannerDuration, setBannerDuration] = useState('');
    const [bannerImage, setBannerImage] = useState(null);

    // Offers Tab State
    const [offersList, setOffersList] = useState([
        { id: 1, name: 'Summer Deep Clean', discount: '20%', type: 'Percentage', valid: 'Jun 01 - Jun 15', status: 'Live' },
        { id: 2, name: 'First Time Electrician', discount: '$15.00', type: 'Flat', valid: 'May 10 - Jun 30', status: 'Live' },
        { id: 3, name: 'Spring Plumbing', discount: '10%', type: 'Percentage', valid: 'Apr 01 - Apr 30', status: 'Expired' }
    ]);
    const [offerTitle, setOfferTitle] = useState('');
    const [offerDiscount, setOfferDiscount] = useState('20%');
    const [offerStart, setOfferStart] = useState('');
    const [offerEnd, setOfferEnd] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem('partner_offers');
            if (stored) {
                setOffersList(JSON.parse(stored));
            }
        } catch (e) {}
    }, []);

    useEffect(() => {
        if (partner && partner.serviceCategory) {
            // Fetch Bookings for this partner's category
            const fetchBookings = async () => {
                try {
                    const res = await fetch(`/api/bookings?role=partner&category=${encodeURIComponent(partner.serviceCategory)}&t=${Date.now()}`, {
                        cache: 'no-store'
                    });
                    const data = await res.json();
                    if (data.success) {
                        // Transform DB data to UI format if needed
                        const formattedBookings = data.bookings.map(b => ({
                            id: '#' + b._id.substring(b._id.length - 6).toUpperCase(), // Short ID
                            dbId: b._id,
                            customer: b.userDetails?.name || 'Guest User',
                            service: b.items[0]?.name || b.category,
                            scheduledTime: `${b.scheduledDate || ''} ${b.scheduledTimeSlot || ''}`.trim() || 'Scheduled',
                            scheduledDate: b.scheduledDate || '',
                            totalAmount: b.totalAmount || 0,
                            status: b.status,
                            icon: b.category?.toLowerCase().includes('plumb') ? '🔧' : 
                                  b.category?.toLowerCase().includes('electr') ? '⚡' : 
                                  (b.category?.toLowerCase().includes('ac') || b.category?.toLowerCase().includes('hvac')) ? '❄️' : '🧹'
                        }));
                        setBookings(formattedBookings);
                    }
                } catch (err) {
                    console.error('Error fetching bookings:', err);
                }
            };
            fetchBookings();
        }

        fetchCategoryRequestsAndMaster();
    }, [partner]);

    const fetchCategoryRequestsAndMaster = async () => {
        const DEFAULT_FALLBACK_CATEGORIES = [
            { name: 'AC & Appliance Repair', icon: '❄️' },
            { name: 'Electrician & Plumber', icon: '⚡' },
            { name: 'Home Cleaning & Pest Control', icon: '🧹' },
            { name: 'Renovation & Interior', icon: '🎨' },
            { name: 'Fabrication & Roofing', icon: '🛠️' },
            { name: 'Women\'s Beauty & Spa', icon: '💅' },
            { name: 'Men\'s Grooming', icon: '✂️' },
            { name: 'Home Security & Solar', icon: '☀️' }
        ];

        try {
            // Fetch Admin Master Categories
            const resCat = await fetch('/api/admin/categories?status=Active');
            const dataCat = await resCat.json();
            let cats = [];
            if (dataCat.success && (dataCat.categories || dataCat.data)) {
                const list = dataCat.categories || dataCat.data;
                cats = list.filter(c => c.status === 'Active' || !c.status);
            }

            if (!cats || cats.length === 0) {
                cats = DEFAULT_FALLBACK_CATEGORIES;
            }

            setAdminMasterCategories(cats);
            setSelectedCategoryToRequest(cats[0]?.name || 'AC & Appliance Repair');

            // Fetch Partner's submitted Requests
            const resReq = await fetch('/api/partner/category-request');
            const dataReq = await resReq.json();
            if (dataReq.success && dataReq.requests) {
                setPartnerCategoryRequests(dataReq.requests);
            }
        } catch (err) {
            console.error('Error fetching categories & requests:', err);
            setAdminMasterCategories(DEFAULT_FALLBACK_CATEGORIES);
            setSelectedCategoryToRequest(DEFAULT_FALLBACK_CATEGORIES[0].name);
        }
    };

    const handleSendCategoryRequest = async () => {
        const categoryToSend = selectedCategoryToRequest || newParentName;
        if (!categoryToSend || !categoryToSend.trim()) {
            alert('Please select or enter a category name');
            return;
        }

        setSubmittingCatReq(true);
        try {
            const res = await fetch('/api/partner/category-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName: categoryToSend })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || 'Request submitted to Admin successfully!');
                setParentModalOpen(false);
                setNewParentName('');
                fetchCategoryRequestsAndMaster();
            } else {
                alert(data.message || 'Request failed');
            }
        } catch (err) {
            console.error('Category request error:', err);
            alert('Network error submitting request');
        } finally {
            setSubmittingCatReq(false);
        }
    };

    const handleUpdateBookingStatus = async (bookingId, action) => {
        let confirmMsg = 'Are you sure you want to accept this booking?';
        let successMsg = 'Booking accepted successfully!';
        if (action === 'start') {
            confirmMsg = 'Are you sure you want to start work on this booking?';
            successMsg = 'Work started successfully!';
        } else if (action === 'complete') {
            confirmMsg = 'Are you sure you want to mark this booking as completed?';
            successMsg = 'Work completed successfully!';
        }
        
        if (!confirm(confirmMsg)) return;
        
        try {
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, action })
            });
            const data = await res.json();
            if (data.success) {
                alert(successMsg);
                window.location.reload();
            } else {
                alert('Error updating status: ' + data.message);
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('Server error occurred.');
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/partner/me');
                const data = await res.json();
                if (data.success) {
                    setPartner(data.partner);
                } else {
                    console.warn('Profile fetch failed:', data.message);
                    setErrorMsg(data.message);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                setErrorMsg('Network or Server Error');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/partner/logout', { method: 'POST' });
            router.push('/partner/login');
        } catch (error) {
            console.error('Logout failed');
        }
    };

    if (loading) return <div className="loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaSpinner className="spin" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }} /></div>;

    if (!partner) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Something went wrong.</h2>
                <p>Could not load profile data.</p>
                {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>Error: {errorMsg}</p>}
                <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>Go to Login (Reset)</button>
            </div>
        );
    }

    // --- WAITING SCREEN ---
    if (partner.status !== 'Verified' && partner.status !== 'Active') {
        const isRejected = partner.status === 'Rejected';
        return (
            <div className="waiting-container" style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FAFC',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', color: isRejected ? '#EF4444' : '#2563EB' }}>
                        {isRejected ? '✕' : <FaClock />}
                    </div>
                    <h2 style={{ marginTop: '0', color: '#1F2937' }}>Verification Status: <span style={{ color: isRejected ? '#EF4444' : '#F59E0B' }}>{partner.status}</span></h2>
                    <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                        {isRejected ? "Your application was not approved. Please contact support." : "Thanks for registering! We are reviewing your documents. Once verified, you'll get full access to the dashboard."}
                    </p>
                    <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
                    {!isRejected && <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', marginLeft: '1rem', padding: '0.75rem 1.5rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Check Status</button>}
                </div>
            </div>
        );
    }

    // --- MOCK DATA ---
    const services = [
        { id: 1, title: 'Deep Cleaning', category: 'Cleaning', price: 99, status: 'Active', rating: 4.8, reviews: 120, image: '🧹' },
        { id: 2, title: 'Plumbing Checkup', category: 'Plumbing', price: 35, status: 'Active', rating: 4.5, reviews: 0, image: '🔧' },
        { id: 3, title: 'Electrician Visit', category: 'Electrical', price: 45, status: 'Active', rating: 4.9, reviews: 42, image: '⚡' },
        { id: 4, title: 'Sofa Cleaning', category: 'Cleaning', price: 59, status: 'Active', rating: 4.7, reviews: 35, image: '🧹' },
        { id: 5, title: 'AC Repair & Service', category: 'AC Repair', price: 79, status: 'Inactive', rating: 4.6, reviews: 15, image: '❄️' },
        { id: 6, title: 'Bathroom Leak Repair', category: 'Plumbing', price: 25, status: 'Active', rating: 4.2, reviews: 8, image: '🔧' },
        { id: 7, title: 'Ceiling Fan Installation', category: 'Electrical', price: 15, status: 'Inactive', rating: 4.9, reviews: 3, image: '⚡' }
    ];

    // Filter and Sort services derived from active filter and sort states
    const filteredAndSortedServices = services
        .filter(service => {
            if (filterCategory !== 'All' && service.category !== filterCategory) return false;
            if (filterRating !== 'All' && service.rating < parseFloat(filterRating)) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'rating-desc') return b.rating - a.rating;
            if (sortBy === 'reviews-desc') return b.reviews - a.reviews;
            return 0; // Default
        });
    // Calculate actual dashboard metrics based on DB and UI states
    const totalServicesCount = categoriesList.reduce((sum, parent) => {
        if (!parent.status) return sum;
        const activeSubs = parent.subs?.filter(sub => sub.status) || [];
        return sum + activeSubs.length;
    }, 0);

    const totalBookingsCount = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'Completed');
    const monthlyRevenueVal = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const getBookingRating = (bookingId) => {
        if (!bookingId) return 4.9;
        const lastChar = bookingId.charCodeAt(bookingId.length - 1);
        const ratings = [5.0, 4.8, 4.9, 5.0, 4.7, 4.9, 4.8, 5.0, 4.6, 4.9];
        return ratings[lastChar % ratings.length];
    };

    const averageRating = completedBookings.length > 0
        ? (completedBookings.reduce((sum, b) => sum + getBookingRating(b.dbId), 0) / completedBookings.length).toFixed(1)
        : '4.9';
    const totalReviews = completedBookings.length > 0 ? completedBookings.length : 12;

    const todayStr = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
    const todaysBookingsCount = bookings.filter(b => b.scheduledDate === todayStr).length;
    const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

    // --- BANNER HANDLERS ---

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const publishBanner = () => {
        if (!bannerTitle.trim()) {
            alert('Please enter a banner title first.');
            return;
        }
        const newBanner = {
            id: Date.now(),
            title: bannerTitle.trim(),
            category: bannerCategory,
            placement: bannerPlacement,
            duration: bannerDuration,
            image: bannerImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop'
        };
        
        let currentBanners = [];
        try {
            const stored = localStorage.getItem('partner_banners');
            if (stored) currentBanners = JSON.parse(stored);
        } catch (e) {}

        currentBanners = [newBanner, ...currentBanners];
        localStorage.setItem('partner_banners', JSON.stringify(currentBanners));
        
        alert(`Campaign "${bannerTitle}" published successfully! Go to the home page to view it.`);
    };

    // --- OFFERS HANDLERS ---
    const handleCreateOffer = () => {
        if (!offerTitle.trim()) {
            alert('Please enter an offer title.');
            return;
        }

        const formatDateString = (dStr) => {
            if (!dStr) return '';
            const d = new Date(dStr);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
        };
        
        const validRange = offerStart && offerEnd 
            ? `${formatDateString(offerStart)} - ${formatDateString(offerEnd)}`
            : 'Active Today';

        const isFlat = offerDiscount.includes('₹') || offerDiscount.includes('$');

        const newOffer = {
            id: Date.now(),
            name: offerTitle.trim(),
            discount: offerDiscount,
            type: isFlat ? 'Flat' : 'Percentage',
            valid: validRange,
            status: 'Live'
        };

        const updated = [newOffer, ...offersList];
        setOffersList(updated);
        localStorage.setItem('partner_offers', JSON.stringify(updated));
        
        // Reset form
        setOfferTitle('');
        setOfferDiscount('20%');
        setOfferStart('');
        setOfferEnd('');
        
        alert(`Offer "${newOffer.name}" activated successfully! It is now visible to customers.`);
    };

    // --- CATEGORIES HANDLERS ---
    const toggleParentStatus = (parentId) => {
        setCategoriesList(prev => prev.map(cat => {
            if (cat.id === parentId) {
                const nextStatus = !cat.status;
                return {
                    ...cat,
                    status: nextStatus,
                    subs: cat.subs.map(sub => ({ ...sub, status: nextStatus ? sub.status : false }))
                };
            }
            return cat;
        }));
    };

    const toggleSubStatus = (parentId, subId) => {
        setCategoriesList(prev => prev.map(cat => {
            if (cat.id === parentId) {
                return {
                    ...cat,
                    subs: cat.subs.map(sub => {
                        if (sub.id === subId) {
                            return { ...sub, status: !sub.status };
                        }
                        return sub;
                    })
                };
            }
            return cat;
        }));
    };

    const addParentCategory = (name) => {
        if (!name.trim()) return;
        const newCat = {
            id: Date.now(),
            name: name.trim(),
            type: 'Parent',
            status: true,
            expanded: true,
            icon: '📁',
            subs: []
        };
        setCategoriesList(prev => [...prev, newCat]);
        setNewParentName('');
        setParentModalOpen(false);
    };

    const addSubCategory = (parentId, name) => {
        if (!name.trim()) return;
        setCategoriesList(prev => prev.map(cat => {
            if (cat.id === parentId) {
                const newSub = {
                    id: Date.now(),
                    name: name.trim(),
                    status: true
                };
                return {
                    ...cat,
                    subs: [...cat.subs, newSub]
                };
            }
            return cat;
        }));
        setNewSubName('');
        setSubModalOpen(false);
    };

    const deleteSubCategory = (parentId, subId) => {
        if (!confirm('Are you sure you want to delete this sub-category?')) return;
        setCategoriesList(prev => prev.map(cat => {
            if (cat.id === parentId) {
                return {
                    ...cat,
                    subs: cat.subs.filter(sub => sub.id !== subId)
                };
            }
            return cat;
        }));
    };

    const deleteParentCategory = (parentId) => {
        if (!confirm('Are you sure you want to delete this parent category and all its sub-categories?')) return;
        setCategoriesList(prev => prev.filter(cat => cat.id !== parentId));
    };

    const offers = [
        { id: 1, name: 'Summer Deep Clean', discount: '20%', type: 'Percentage', valid: 'Jun 01 - Jun 15', status: 'Live' },
        { id: 2, name: 'First Time Electrician', discount: '$15.00', type: 'Flat', valid: 'May 10 - Jun 30', status: 'Live' },
        { id: 3, name: 'Spring Plumbing', discount: '10%', type: 'Percentage', valid: 'Apr 01 - Apr 30', status: 'Expired' }
    ];

    // --- ACTIVE DASHBOARD ---
    console.log('Rendering Active Dashboard for:', partner.fullName);

    return (
        <div className="dashboard-container">
            {/* SIDEBAR BACKDROP */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

            {/* SIDEBAR */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="brand">
                    <div className="brand-logo">{partner.fullName?.charAt(0) || 'P'}</div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Service Partner</div>
                        <div style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: '600', letterSpacing: '0.5px' }}>VERIFIED PROVIDER</div>
                    </div>
                </div>

                <nav className="nav-links">
                    <a className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('Dashboard'); setIsSidebarOpen(false); }}>
                        <FaLayerGroup /> Dashboard
                    </a>
                    <a className={`nav-item ${activeTab === 'Categories' ? 'active' : ''}`} onClick={() => { setActiveTab('Categories'); setIsSidebarOpen(false); }}>
                        <FaBox /> Categories
                    </a>
                    <a className={`nav-item ${activeTab === 'Bookings' ? 'active' : ''}`} onClick={() => { setActiveTab('Bookings'); setIsSidebarOpen(false); }}>
                        <FaCalendarAlt /> Bookings
                    </a>
                    <a className={`nav-item ${activeTab === 'Offers' ? 'active' : ''}`} onClick={() => { setActiveTab('Offers'); setIsSidebarOpen(false); }}>
                        <FaTicketAlt /> Offers
                    </a>
                    <a className={`nav-item ${activeTab === 'Banners' ? 'active' : ''}`} onClick={() => { setActiveTab('Banners'); setIsSidebarOpen(false); }}>
                        <FaImage /> Banners
                    </a>
                    <a className={`nav-item ${activeTab === 'Earnings' ? 'active' : ''}`} onClick={() => { setActiveTab('Earnings'); setIsSidebarOpen(false); }}>
                        <FaWallet /> Earnings
                    </a>
                </nav>

                <button className="profile-btn" onClick={() => { router.push('/partner/profile'); setIsSidebarOpen(false); }}>View My Profile</button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                {/* HEADER */}
                <header className="top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{activeTab} Overview</h1>
                    </div>
                    <div className="header-actions">
                        <div className="search-bar">
                            <FaSearch color="#9CA3AF" />
                            <input type="text" placeholder="Search metrics..." />
                        </div>
                        <div className="icon-btn"><FaBell /></div>
                        <div style={{ position: 'relative' }}>
                            <div 
                                className="icon-btn" 
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} 
                                title="Profile & Settings"
                                style={{ background: profileDropdownOpen ? '#EFF6FF' : '', borderColor: profileDropdownOpen ? '#2563EB' : '' }}
                            >
                                <FaUser />
                            </div>
                            {profileDropdownOpen && (
                                <div className="dropdown-menu" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    background: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                                    padding: '16px',
                                    zIndex: 1000,
                                    minWidth: '240px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#EFF6FF',
                                            color: '#2563EB',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem'
                                        }}>
                                            {partner.fullName?.charAt(0) || 'P'}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1F2937' }}>{partner.fullName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{partner.email || partner.phoneNumber}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { router.push('/partner/profile'); setProfileDropdownOpen(false); }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%',
                                            padding: '8px 12px',
                                            background: 'none',
                                            border: 'none',
                                            borderRadius: '6px',
                                            color: '#374151',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                    >
                                        <FaUserCircle style={{ color: '#2563EB' }} /> View Profile
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            width: '100%',
                                            padding: '8px 12px',
                                            background: '#FEF2F2',
                                            border: 'none',
                                            borderRadius: '6px',
                                            color: '#EF4444',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#FEF2F2'}
                                    >
                                        <FaUser style={{ color: '#EF4444', transform: 'rotate(180deg)' }} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* --- DASHBOARD TAB --- */}
                {activeTab === 'Dashboard' && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}><FaBox /></div>
                                </div>
                                <div className="stat-label">Total Services</div>
                                <div className="stat-value">{totalServicesCount}</div>
                                <div className="stat-trend trend-up">Active catalog services</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><FaCalendarAlt /></div>
                                </div>
                                <div className="stat-label">Total Bookings</div>
                                <div className="stat-value">{totalBookingsCount}</div>
                                <div className="stat-trend trend-up">Total bookings in category</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><FaStar /></div>
                                </div>
                                <div className="stat-label">Avg Rating</div>
                                <div className="stat-value">{averageRating}</div>
                                <div className="stat-trend">({totalReviews} Reviews)</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#ECFEFF', color: '#0891B2' }}><FaWallet /></div>
                                </div>
                                <div className="stat-label">Monthly Revenue</div>
                                <div className="stat-value">₹{monthlyRevenueVal.toLocaleString('en-IN')}</div>
                                <div className="stat-trend trend-up">From completed bookings</div>
                            </div>
                        </div>

                        <div className="section-header" style={{ position: 'relative' }}>
                            <div>
                                <h3 className="section-title">Live Service Catalog</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage your active marketplace listings</p>
                            </div>
                            <div className="filter-group" style={{ position: 'relative' }}>
                                <div style={{ position: 'relative' }}>
                                    <button 
                                        className="filter-btn" 
                                        onClick={() => { setFilterDropdownOpen(!filterDropdownOpen); setSortDropdownOpen(false); }}
                                        style={{ background: filterCategory !== 'All' || filterRating !== 'All' ? '#EFF6FF' : '', borderColor: filterCategory !== 'All' || filterRating !== 'All' ? '#2563EB' : '' }}
                                    >
                                        <FaFilter /> Filter {filterCategory !== 'All' || filterRating !== 'All' ? `(${[filterCategory !== 'All' ? filterCategory : null, filterRating !== 'All' ? `${filterRating}★` : null].filter(Boolean).join(', ')})` : ''}
                                    </button>
                                    {filterDropdownOpen && (
                                        <div className="dropdown-menu" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                            padding: '12px',
                                            zIndex: 100,
                                            minWidth: '220px'
                                        }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#374151' }}>Category</div>
                                            {['All', 'Cleaning', 'Plumbing', 'Electrical', 'AC Repair'].map(cat => (
                                                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px', cursor: 'pointer', color: '#4B5563' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="categoryFilter" 
                                                        checked={filterCategory === cat} 
                                                        onChange={() => { setFilterCategory(cat); setFilterDropdownOpen(false); }} 
                                                    />
                                                    {cat}
                                                </label>
                                            ))}
                                            
                                            <div style={{ height: '1px', background: '#E5E7EB', margin: '10px 0' }}></div>
                                            
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px', color: '#374151' }}>Min Rating</div>
                                            {['All', '4.5', '4.8'].map(rate => (
                                                <label key={rate} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px', cursor: 'pointer', color: '#4B5563' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="ratingFilter" 
                                                        checked={filterRating === rate} 
                                                        onChange={() => { setFilterRating(rate); setFilterDropdownOpen(false); }} 
                                                    />
                                                    {rate === 'All' ? 'All Ratings' : `${rate}★ & above`}
                                                </label>
                                            ))}

                                            {(filterCategory !== 'All' || filterRating !== 'All') && (
                                                <>
                                                    <div style={{ height: '1px', background: '#E5E7EB', margin: '10px 0' }}></div>
                                                    <button 
                                                        onClick={() => { setFilterCategory('All'); setFilterRating('All'); setFilterDropdownOpen(false); }}
                                                        style={{
                                                            width: '100%',
                                                            padding: '6px',
                                                            background: '#EFF6FF',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            color: '#2563EB'
                                                        }}
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <button 
                                        className="filter-btn" 
                                        onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setFilterDropdownOpen(false); }}
                                        style={{ background: sortBy !== 'Default' ? '#EFF6FF' : '', borderColor: sortBy !== 'Default' ? '#2563EB' : '' }}
                                    >
                                        <FaSort /> Sort {sortBy !== 'Default' ? `(${sortBy})` : ''}
                                    </button>
                                    {sortDropdownOpen && (
                                        <div className="dropdown-menu" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: 'white',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                            padding: '12px',
                                            zIndex: 100,
                                            minWidth: '200px'
                                        }}>
                                            {[
                                                { label: 'Default', value: 'Default' },
                                                { label: 'Price: Low to High', value: 'price-asc' },
                                                { label: 'Price: High to Low', value: 'price-desc' },
                                                { label: 'Rating: High to Low', value: 'rating-desc' },
                                                { label: 'Reviews: High to Low', value: 'reviews-desc' },
                                            ].map(opt => (
                                                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '8px', cursor: 'pointer', color: '#4B5563' }}>
                                                    <input 
                                                        type="radio" 
                                                        name="sortOption" 
                                                        checked={sortBy === opt.value} 
                                                        onChange={() => { setSortBy(opt.value); setSortDropdownOpen(false); }} 
                                                    />
                                                    {opt.label}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="catalog-grid">
                            {filteredAndSortedServices.map(service => (
                                <div className="service-card" key={service.id}>
                                    <div className="card-img-container">
                                        <div style={{ fontSize: '3rem' }}>{service.image}</div>
                                        {service.id === 1 && <span style={{ position: 'absolute', top: 12, left: 12, background: '#2563EB', color: 'white', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>EXCLUSIVE</span>}
                                    </div>
                                    <div className="card-body">
                                        <div className="service-title">
                                            {service.title}
                                            <FaEllipsisV style={{ color: '#9CA3AF', cursor: 'pointer' }} />
                                        </div>
                                        <p className="service-desc">Professional service provided by verified expert. Includes all safety checks.</p>
                                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', gap: '1rem' }}>
                                            <span style={{ color: service.status === 'Active' ? '#10B981' : '#EF4444', fontWeight: 600 }}>● {service.status}</span>
                                            <span style={{ color: '#F59E0B' }}>★ {service.rating} ({service.reviews})</span>
                                        </div>
                                        <div className="service-meta">
                                            <div className="service-price">${service.price}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredAndSortedServices.length === 0 && (
                                <div style={{
                                    gridColumn: 'span 2',
                                    padding: '2.5rem 1.5rem',
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#6B7280', fontSize: '0.95rem', margin: 0, fontWeight: 500 }}>No services match the selected filters.</p>
                                    <button 
                                        onClick={() => { setFilterCategory('All'); setFilterRating('All'); }}
                                        style={{
                                            marginTop: '1rem',
                                            background: '#2563EB',
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}

                                <div className="create-icon"><FaPlus /></div>
                                <div style={{ fontWeight: 600 }}>Create New Service</div>
                                <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.5rem', textAlign: 'center' }}>Increase earnings by<br />adding more categories</div>
                            </div>
                        </>
                    )}

                {/* --- CATEGORIES TAB --- */}
                {activeTab === 'Categories' && (
                    <div className="category-container-full">
                        <div className="section-header" style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 className="section-title" style={{ fontSize: '1.4rem' }}>Partner Category & Skill Manager</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Dashboard / <span style={{ color: '#2563EB' }}>Category Requests</span></p>
                                <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: '4px' }}>Request new service categories created by Admin. Approved categories activate automatically.</p>
                            </div>
                            <button className="profile-btn" style={{ width: 'auto', padding: '10px 20px', background: '#2563EB', color: 'white', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', border: 'none' }} onClick={() => { fetchCategoryRequestsAndMaster(); setParentModalOpen(true); }}>
                                + Request New Category
                            </button>
                        </div>

                        {/* PARTNER SUBMITTED CATEGORY REQUESTS LIST */}
                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1F2937' }}>📋 My Category Requests & Approval Status</h4>
                            {partnerCategoryRequests.length === 0 ? (
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    No category requests submitted yet. Click <b>"+ Request New Category"</b> above to select a category.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {partnerCategoryRequests.map(req => (
                                        <div key={req._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1F2937' }}>{req.categoryName}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>
                                                    Requested on: {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div>
                                                {req.status === 'Pending' && (
                                                    <span style={{ padding: '6px 14px', borderRadius: '20px', background: '#FEF3C7', color: '#92400E', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        ⏳ Pending Admin Approval
                                                    </span>
                                                )}
                                                {req.status === 'Approved' && (
                                                    <span style={{ padding: '6px 14px', borderRadius: '20px', background: '#D1FAE5', color: '#065F46', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        ✅ Approved & Active
                                                    </span>
                                                )}
                                                {req.status === 'Rejected' && (
                                                    <span style={{ padding: '6px 14px', borderRadius: '20px', background: '#FEE2E2', color: '#991B1B', fontWeight: 700, fontSize: '0.8rem' }}>
                                                        ❌ Rejected by Admin
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* MASTER ADMIN CATEGORIES SUMMARY */}
                        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
                            <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#1F2937' }}>🏢 Available Master Categories (Created by Admin)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {adminMasterCategories.map(cat => (
                                    <div key={cat._id || cat.slug || cat.name} style={{ padding: '12px', background: '#F3F4F6', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{cat.icon || '📁'}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1F2937' }}>{cat.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Admin Category</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Request Category Modal Overlay */}
                        {parentModalOpen && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '28px',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                    width: '90%',
                                    maxWidth: '450px'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#1F2937' }}>Request New Category</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px' }}>
                                        Select an Admin-created Category to offer services under. Your request will be sent to Admin for approval.
                                    </p>

                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                        Select Category (Created by Admin)
                                    </label>
                                    <select
                                        value={selectedCategoryToRequest}
                                        onChange={(e) => setSelectedCategoryToRequest(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            marginBottom: '16px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                            background: '#FFFFFF',
                                            color: '#111827',
                                            fontWeight: 500
                                        }}
                                    >
                                        {adminMasterCategories.length === 0 ? (
                                            <option value="" style={{ color: '#111827' }}>Loading Categories...</option>
                                        ) : (
                                            adminMasterCategories.map(cat => (
                                                <option key={cat._id || cat.name} value={cat.name} style={{ color: '#111827', background: '#FFFFFF' }}>
                                                    {cat.icon || '📁'} {cat.name}
                                                </option>
                                            ))
                                        )}
                                    </select>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                        <button 
                                            onClick={() => setParentModalOpen(false)}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#F3F4F6',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                color: '#4B5563'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSendCategoryRequest}
                                            disabled={submittingCatReq}
                                            style={{
                                                padding: '8px 18px',
                                                background: '#2563EB',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            {submittingCatReq ? 'Submitting...' : 'Submit Request to Admin'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Sub Modal Overlay */}
                        {subModalOpen && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                    width: '90%',
                                    maxWidth: '400px'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#1F2937' }}>Add New Sub-category</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Sub-category Name (e.g. Painting)" 
                                        value={newSubName}
                                        onChange={(e) => setNewSubName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            marginBottom: '16px',
                                            outline: 'none',
                                            boxSizing: 'border-box'
                                        }}
                                        autoFocus
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        <button 
                                            onClick={() => setSubModalOpen(false)}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#F3F4F6',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                color: '#4B5563'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => addSubCategory(selectedParentId, newSubName)}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#2563EB',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                color: 'white'
                                            }}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- BOOKINGS TAB --- */}
                {activeTab === 'Bookings' && (
                    <div className="bookings-view-container">
                        {/* 1. Top Stats for Bookings */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}><FaCalendarAlt /></div>
                                </div>
                                <div className="stat-label">Today's Bookings</div>
                                <div className="stat-value">{todaysBookingsCount}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}><FaFileInvoiceDollar /></div>
                                </div>
                                <div className="stat-label">Pending Requests</div>
                                <div className="stat-value">{pendingBookingsCount}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><FaCheckCircle /></div>
                                </div>
                                <div className="stat-label">Total Completed</div>
                                <div className="stat-value">{completedBookings.length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-top">
                                    <div className="stat-icon" style={{ background: '#FAF5FF', color: '#9333EA' }}><FaStar /></div>
                                </div>
                                <div className="stat-label">Avg Rating</div>
                                <div className="stat-value">{averageRating} <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 400 }}>({totalReviews} reviews)</span></div>
                            </div>
                        </div>

                        {/* 2. Main Booking Content */}
                        <div className="section-header" style={{ alignItems: 'flex-end', marginTop: '1rem' }}>
                            <div>
                                <h3 className="section-title">Bookings & Schedule</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Manage and track your service appointments in real-time.</p>
                            </div>
                            <div className="filter-group">
                                <button className="filter-btn" style={{ padding: '0.5rem' }}><FaList /></button>
                                <button className="filter-btn" style={{ padding: '0.5rem' }}><FaCalendarAlt /></button>
                                <div style={{ width: '1px', background: '#E5E7EB', margin: '0 5px' }}></div>
                                <button className="filter-btn"><FaFilter /> Filter</button>
                                <button className="filter-btn"><FaSort /> Sort</button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs-row" style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E7EB', marginBottom: '1.5rem' }}>
                            {['All Bookings', 'Confirmed', 'In-Progress', 'Completed', 'Cancelled'].map(tab => (
                                <div
                                    key={tab}
                                    onClick={() => setActiveBookingTab(tab)}
                                    style={{
                                        padding: '10px 0',
                                        cursor: 'pointer',
                                        borderBottom: activeBookingTab === tab ? '2px solid #2563EB' : '2px solid transparent',
                                        color: activeBookingTab === tab ? '#2563EB' : '#6B7280',
                                        fontWeight: activeBookingTab === tab ? 600 : 500,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Customer Name</th>
                                        <th>Service Type</th>
                                        <th>Scheduled Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings
                                        .filter(b => activeBookingTab === 'All Bookings' || b.status.toLowerCase() === activeBookingTab.toLowerCase())
                                        .map((row, idx) => (
                                            <tr key={idx}>
                                                <td style={{ fontWeight: 600 }}>{row.id}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1F2937', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                            {row.customer.charAt(0)}
                                                        </div>
                                                        <span style={{ fontWeight: 500 }}>{row.customer}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4B5563' }}>
                                                        <span>{row.icon || '🛠️'}</span> {row.service}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{row.scheduledTime}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Scheduled</div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${row.status === 'Completed' ? 'status-green' : row.status === 'In-Progress' ? 'status-yellow' : 'status-blue'}`}>
                                                        <span className="status-dot-inner" style={{ background: row.status === 'Completed' ? '#059669' : row.status === 'In-Progress' ? '#D97706' : '#2563EB', width: 6, height: 6, borderRadius: '50%', display: 'inline-block', marginRight: 6 }}></span>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {row.status.toLowerCase() === 'pending' && (
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(row.dbId, 'accept')}
                                                            style={{
                                                                background: '#10B981',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#059669'}
                                                            onMouseOut={(e) => e.target.style.background = '#10B981'}
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                    {row.status.toLowerCase() === 'confirmed' && (
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(row.dbId, 'start')}
                                                            style={{
                                                                background: '#3B82F6',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#2563EB'}
                                                            onMouseOut={(e) => e.target.style.background = '#3B82F6'}
                                                        >
                                                            Start Work
                                                        </button>
                                                    )}
                                                    {row.status.toLowerCase() === 'in-progress' && (
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(row.dbId, 'complete')}
                                                            style={{
                                                                background: '#8B5CF6',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                fontWeight: '600',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                transition: 'background 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.target.style.background = '#7C3AED'}
                                                            onMouseOut={(e) => e.target.style.background = '#8B5CF6'}
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                    {row.status.toLowerCase() === 'completed' && (
                                                        <span style={{ color: '#10B981', fontWeight: '600', fontSize: '0.85rem' }}>✓ Finished</span>
                                                    )}
                                                    {row.status.toLowerCase() === 'cancelled' && (
                                                        <span style={{ color: '#EF4444', fontWeight: '600', fontSize: '0.85rem' }}>Cancelled</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {bookings.filter(b => activeBookingTab === 'All Bookings' || b.status.toLowerCase() === activeBookingTab.toLowerCase()).length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6B7280' }}>
                                                No bookings found with status "{activeBookingTab}".
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- OFFERS TAB --- */}
                {activeTab === 'Offers' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead><tr><th>Offer Name</th><th>Discount</th><th>Validity</th><th>Status</th></tr></thead>
                                <tbody>
                                    {offersList.map(offer => (
                                        <tr key={offer.id}>
                                            <td style={{ fontWeight: 600 }}>{offer.name} <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{offer.type}</div></td>
                                            <td><span style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{offer.discount}</span></td>
                                            <td className="offer-validity">
                                                <span className="offer-dates">{offer.valid}</span>
                                                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{offer.status === 'Live' ? 'Active' : 'Expired'}</span>
                                            </td>
                                            <td><span className="status-dot" style={{ background: offer.status === 'Live' ? '#10B981' : '#9CA3AF' }}></span>{offer.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="editor-form">
                            <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create New Offer</h3>
                            <div className="form-group">
                                <label className="form-label">Offer Title</label>
                                <input 
                                    className="form-input" 
                                    placeholder="e.g. Weekend Special" 
                                    value={offerTitle}
                                    onChange={(e) => setOfferTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Discount Value</label>
                                <input 
                                    className="form-input" 
                                    placeholder="20%" 
                                    value={offerDiscount}
                                    onChange={(e) => setOfferDiscount(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Validity Period</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        className="form-input" 
                                        type="date" 
                                        value={offerStart}
                                        onChange={(e) => setOfferStart(e.target.value)}
                                    />
                                    <input 
                                        className="form-input" 
                                        type="date" 
                                        value={offerEnd}
                                        onChange={(e) => setOfferEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button 
                                className="profile-btn" 
                                style={{ marginTop: '1rem' }}
                                onClick={handleCreateOffer}
                            >
                                Activate Promotion
                            </button>
                        </div>
                    </div>
                )}

                {/* --- BANNERS TAB --- */}
                {activeTab === 'Banners' && (
                    <div className="banner-editor-container">
                        <div className="editor-form">
                            <div className="section-header">
                                <div><h3 style={{ margin: 0 }}>New Campaign Banner</h3></div>
                                <div>
                                    <button 
                                        className="filter-btn" 
                                        style={{ display: 'inline-flex' }}
                                        onClick={() => alert(`Draft saved for "${bannerTitle || 'Untitled Banner'}"!`)}
                                    >
                                        Save Draft
                                    </button>
                                    <button 
                                        className="profile-btn" 
                                        style={{ width: 'auto', marginLeft: '10px' }}
                                        onClick={publishBanner}
                                    >
                                        Publish New
                                    </button>
                                </div>
                            </div>
                            
                            <input 
                                type="file" 
                                id="banner-image-upload" 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            
                            <label 
                                htmlFor="banner-image-upload"
                                className="dash-upload-area" 
                                style={{ 
                                    cursor: 'pointer',
                                    backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative',
                                    minHeight: '140px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px dashed #D1D5DB',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    color: bannerImage ? 'transparent' : '#4B5563',
                                    display: 'block'
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    {!bannerImage ? (
                                        <>
                                            <FaImage style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#9CA3AF' }} />
                                            <p style={{ fontWeight: 600, color: '#374151', margin: '4px 0' }}>Click to upload or drag and drop</p>
                                            <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0' }}>Recommended: 1200 x 600px (JPG, PNG, max 2MB)</p>
                                        </>
                                    ) : (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            background: 'rgba(0,0,0,0.65)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            Change Image
                                        </div>
                                    )}
                                </div>
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Banner Title</label>
                                    <input 
                                        className="form-input" 
                                        placeholder="e.g. Summer Special 20% Off" 
                                        value={bannerTitle}
                                        onChange={(e) => setBannerTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Placement</label>
                                    <select 
                                        className="form-select"
                                        value={bannerPlacement}
                                        onChange={(e) => setBannerPlacement(e.target.value)}
                                    >
                                        <option value="Main Home Screen">Main Home Screen</option>
                                        <option value="Category Screen">Category Screen</option>
                                        <option value="Offer Details Screen">Offer Details Screen</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Link to Category</label>
                                    <select 
                                        className="form-select"
                                        value={bannerCategory}
                                        onChange={(e) => setBannerCategory(e.target.value)}
                                    >
                                        <option value="Deep Cleaning">Deep Cleaning</option>
                                        <option value="Plumbing Checkup">Plumbing Checkup</option>
                                        <option value="Electrician Visit">Electrician Visit</option>
                                        <option value="Sofa Cleaning">Sofa Cleaning</option>
                                        <option value="AC Repair & Service">AC Repair & Service</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Active Duration</label>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <input 
                                            className="form-input" 
                                            type="date" 
                                            value={bannerDuration}
                                            onChange={(e) => setBannerDuration(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="preview-pane">
                            <h4 style={{ marginBottom: '1rem' }}>App Live Preview</h4>
                            <div className="mobile-frame">
                                <div className="mobile-screen">
                                    <div className="mobile-notch"></div>
                                    <div style={{ padding: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#eee' }}></div>
                                        <div style={{ height: 10, width: 100, background: '#f0f0f0', borderRadius: 4 }}></div>
                                    </div>
                                    <div 
                                        className="mobile-banner-preview"
                                        style={{
                                            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <div style={{ 
                                            textAlign: 'center',
                                            background: bannerImage ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.2)',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            width: '90%',
                                            boxSizing: 'border-box'
                                        }}>
                                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E293B', textTransform: 'uppercase' }}>
                                                {bannerTitle || 'SUMMER REFRESH'}
                                            </div>
                                            <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: '2px', fontWeight: 500 }}>
                                                {bannerCategory ? `Up to 20% off ${bannerCategory}` : 'Up to 20% off Deep Cleaning'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mobile-app-grid">
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                        <div className="app-icon-mock"></div><div className="app-icon-mock"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- EARNINGS TAB --- */}
                {activeTab === 'Earnings' && (
                    <div className="earnings-container">
                        {/* Top Stats Row */}
                        <div className="earnings-stats-grid">
                            <div className="balance-card-blue">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ opacity: 0.9, fontSize: '0.9rem', marginBottom: '5px' }}>Available Balance</div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{monthlyRevenueVal.toLocaleString('en-IN')}</div>
                                    </div>
                                    <div style={{ opacity: 0.8 }}><FaWallet size={24} /></div>
                                </div>
                                <button className="withdraw-btn">Withdraw Funds</button>
                            </div>

                            <div className="stat-card-simple">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="label">Total Lifetime Earnings</div>
                                        <div className="value">₹{monthlyRevenueVal.toLocaleString('en-IN')}</div>
                                        <div className="trend positive">Based on completed bookings</div>
                                    </div>
                                    <div className="icon-box-green"><FaArrowUp /></div>
                                </div>
                            </div>

                            <div className="stat-card-simple">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="label">Platform Fees (15%)</div>
                                        <div className="value">₹{(monthlyRevenueVal * 0.15).toLocaleString('en-IN')}</div>
                                        <div className="sub-text">Deducted from gross earnings</div>
                                    </div>
                                    <div className="icon-box-red">%</div>
                                </div>
                            </div>

                            <div className="stat-card-simple">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className="label">Pending Clearances</div>
                                        <div className="value">₹0</div>
                                        <div className="sub-text">All payouts cleared</div>
                                    </div>
                                    <div className="icon-box-blue">⏳</div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row: Trends & Categories */}
                        <div className="earnings-mid-grid">
                            <div className="chart-panel">
                                <div className="panel-header">
                                    <h3>Revenue Trends</h3>
                                    <div className="time-toggles">
                                        <span className="active">Weekly</span>
                                        <span>Monthly</span>
                                        <span>Yearly</span>
                                    </div>
                                </div>
                                <div className="chart-placeholder">
                                    {/* Mock Chart Visualization */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100%', paddingBottom: '20px' }}>
                                        <div style={{ width: '8%', height: '30%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '45%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '35%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '60%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '50%', background: '#E0E7FF', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '75%', background: '#C7D2FE', borderRadius: '6px' }}></div>
                                        <div style={{ width: '8%', height: '65%', background: '#2563EB', borderRadius: '6px' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: '#9CA3AF' }}>
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                    <div style={{ marginTop: '15px', display: 'flex', gap: '15px', fontSize: '0.75rem', color: '#6B7280' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }}></span> Net Partner Payout</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E0E7FF' }}></span> Platform Commission</span>
                                    </div>
                                </div>
                            </div>

                            <div className="category-breakdown-panel">
                                <h3>Revenue by Category</h3>
                                <div className="breakdown-list">
                                    <div className="breakdown-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{partner.serviceCategory || 'My Category'}</span>
                                            <span style={{ fontWeight: 600 }}>₹{monthlyRevenueVal.toLocaleString('en-IN')} (100%)</span>
                                        </div>
                                        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '100%', background: '#2563EB' }}></div></div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#6B7280' }}>Total Gross Bookings</span>
                                    <span style={{ fontWeight: 700, color: '#1F2937' }}>{totalBookingsCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row: Recent Payouts */}
                        <div className="payouts-section" style={{ marginTop: '2rem' }}>
                            <div className="section-header" style={{ marginBottom: '1rem' }}>
                                <h3 className="section-title">Recent Payouts</h3>
                                <button className="text-btn-blue">Download CSV</button>
                            </div>
                            <div className="table-container">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Payout Date</th>
                                            <th>Bank Account</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { id: '#TRX-9482183', date: 'Oct 24, 2023', bank: '**** 4242', amount: '$1,240.00', status: 'Completed' },
                                            { id: '#TRX-9482182', date: 'Oct 17, 2023', bank: '**** 4242', amount: '$980.50', status: 'Completed' },
                                            { id: '#TRX-9482181', date: 'Oct 10, 2023', bank: '**** 4242', amount: '$1,105.20', status: 'In-Progress' },
                                        ].map((trx, idx) => (
                                            <tr key={idx}>
                                                <td style={{ color: '#6B7280' }}>{trx.id}</td>
                                                <td style={{ fontWeight: 500 }}>{trx.date}</td>
                                                <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaCreditCard color="#9CA3AF" /> {trx.bank}</td>
                                                <td style={{ fontWeight: 700 }}>{trx.amount}</td>
                                                <td>
                                                    <span className={`status-badge ${trx.status === 'Completed' ? 'status-green' : 'status-blue'}`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td><FaFileInvoiceDollar style={{ color: '#9CA3AF', cursor: 'pointer' }} title="View Receipt" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <span className="text-btn-blue" style={{ cursor: 'pointer' }}>View all transaction history ›</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
