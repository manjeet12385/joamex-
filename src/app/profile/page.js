'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import OffersSection from '@/components/OffersSection';
import SolarWaterSection from '@/components/SolarWaterSection';
import HomeRenovationSection from '@/components/HomeRenovationSection';
import EssentialServicesSection from '@/components/EssentialServicesSection';
import MostBookedSection from '@/components/MostBookedSection';
import ServiceBanners from '@/components/ServiceBanners';
import WhyChoose from '@/components/WhyChoose';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Clock, User, LogOut, Package, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import './profile.css';
import '@/components/Hero.css';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cart, updateQuantity } = useCart();

  const recommendedServices = [
    { id: 'p1', title: 'Tap Repair', price: 299, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop', category: 'Plumber' },
    { id: 'p2', title: 'Switch Repair', price: 149, image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop', category: 'Electrician' },
    { id: 'p3', title: 'AC Gas Refill', price: 1499, image: '/service-ac.png', category: 'AC Repair' },
    { id: 'p4', title: 'Home Cleaning', price: 999, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop', category: 'Cleaning' },
  ];

  const handleAddToCart = (service) => {
    addToCart({
      id: service.id,
      name: service.title,
      price: service.price,
      image: service.image,
      category: service.category
    });
    toast.success(`${service.title} added to cart!`);
  };

  useEffect(() => {
    // Unix user state logic (Session vs LocalStorage)
    const initUser = () => {
      // 1. Try Session
      if (session?.user) {
        setUser(session.user);
        fetchBookings(session.user.email);
        return;
      }

      // 2. Try Local Storage (Force check)
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('user');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setUser(parsed);
            fetchBookings(parsed.email);
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Try JWT Cookie (for email verification flow)
      fetchUserFromAPI();
    };

    const fetchUserFromAPI = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('user-updated'));
          fetchBookings(data.user.email);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    const fetchBookings = async (email) => {
      if (!email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/bookings?role=user&email=${encodeURIComponent(email)}&t=${Date.now()}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    initUser();

    // Listen for events to refresh user state
    window.addEventListener('user-login', initUser);
    window.addEventListener('user-updated', initUser);
    return () => {
      window.removeEventListener('user-login', initUser);
      window.removeEventListener('user-updated', initUser);
    };
  }, [session, status]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('user-login')); // Sync header
    signOut({ callbackUrl: '/' });
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  if (!user) {
    return (
      <div className="app">
        <Header />
        <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="login-prompt" style={{ padding: '4rem 0' }}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your profile and bookings.</p>
          <button onClick={() => router.push('/login')} className="primary-btn">Login Now</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Profile Dashboard Section */}
      <section className="profile-dashboard-section" style={{ background: '#f9fafb', padding: '20px 0' }}>
        <div className="profile-container">
          {/* Sidebar / User Card */}
          <div className="profile-sidebar">
            <div className="user-card">
              <div className="profile-avatar">
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  <span>{(user.fullName || user.name || 'U').charAt(0)}</span>
                )}
              </div>
              <h3>{user.fullName || user.name || 'User'}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-phone">{user.phone}</p>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            <div className="profile-tabs">
              <button
                className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <Package size={18} /> My Bookings
              </button>
              <button
                className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                <ShoppingCart size={18} /> Shop Services
              </button>
              <button
                className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <User size={18} /> Account Settings
              </button>
            </div>

            {activeTab === 'bookings' && (
              <div className="bookings-list">
                <h2>My Bookings ({bookings.length})</h2>
                {bookings.length === 0 ? (
                  <div className="empty-state">
                    <p>No bookings found.</p>
                    <button onClick={() => router.push('/')} className="book-btn">Book a Service</button>
                  </div>
                ) : (
                  <div className="booking-cards">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="booking-card">
                        <div className="booking-header">
                          <span className="booking-id">ORDER #{booking._id.slice(-6).toUpperCase()}</span>
                          <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                        </div>
                        <div className="booking-body">
                          <div className="booking-service">
                            <h4>{booking.items[0]?.name || booking.category}</h4>
                            <p>{booking.category}</p>
                          </div>
                          <div className="booking-details">
                            <div className="detail-row">
                              <Calendar size={14} /> <span>{booking.scheduledDate || 'Not scheduled'}</span>
                            </div>
                            <div className="detail-row">
                              <Clock size={14} /> <span>{booking.scheduledTimeSlot || '--:--'}</span>
                            </div>
                            <div className="detail-row">
                              <MapPin size={14} /> <span>{booking.userDetails?.address?.city || 'Home'}</span>
                            </div>
                          </div>
                          <div className="booking-price">
                            ₹{booking.totalAmount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="shop-tab">
                <div className="tab-header-flex">
                  <h2>Recommended Services</h2>
                  <button onClick={() => router.push('/cart')} className="view-cart-link">
                    View My Cart ({cart.length})
                  </button>
                </div>
                <div className="quick-services-grid">
                  {recommendedServices.map((service) => {
                    const inCart = cart.find(item => item.id === service.id);
                    return (
                      <div key={service.id} className="quick-service-card">
                        <img src={service.image} alt={service.title} />
                        <div className="q-info">
                          <h4>{service.title}</h4>
                          <p>₹{service.price}</p>
                          {inCart ? (
                            <div className="in-cart-controls">
                              <button onClick={() => updateQuantity(service.id, inCart.quantity - 1)}><Minus size={14} /></button>
                              <span>{inCart.quantity}</span>
                              <button onClick={() => updateQuantity(service.id, inCart.quantity + 1)}><Plus size={14} /></button>
                            </div>
                          ) : (
                            <button className="q-add-btn" onClick={() => handleAddToCart(service)}>
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-panel">
                <h2>Account Settings</h2>
                <p>Coming Soon...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rest of the Home Page Components */}
      <OffersSection />
      <SolarWaterSection />
      <HomeRenovationSection />
      <EssentialServicesSection />
      <MostBookedSection />
      <ServiceBanners />
      <WhyChoose />
      <Footer />
    </div>
  );
}
