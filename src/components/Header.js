'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ShoppingCart, User, LogOut, Settings, ShoppingBag, ChevronDown, X, Navigation } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
// Hardcoded mock data removed in favor of real DB search
import './Header.css';

export default function Header() {
  const { getCartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = getCartCount();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [locationText, setLocationText] = useState('Use Current Location');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualSearch, setManualSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocationSuggestions, setIsFetchingLocationSuggestions] = useState(false);

  const [isAdminEditMode, setIsAdminEditMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const checkAdminMode = () => {
      const adminUser = localStorage.getItem('adminUser');
      const storedMode = localStorage.getItem('admin_edit_mode');
      if (adminUser && storedMode === 'true') {
        setIsAdminEditMode(true);
      } else {
        setIsAdminEditMode(false);
      }
    };
    checkAdminMode();
    window.addEventListener('admin_edit_mode_changed', checkAdminMode);
    window.addEventListener('storage', checkAdminMode);
    window.addEventListener('focus', checkAdminMode);
    
    // Fetch global content for regular users
    const fetchGlobalContent = async () => {
      try {
        const storedMode = localStorage.getItem('admin_edit_mode');
        if (storedMode === 'true') return; // Don't overwrite if admin is actively editing

        const res = await fetch('/api/site-content');
        const json = await res.json();
        
        if (json.data && Object.keys(json.data).length > 0) {
          let updated = false;
          Object.keys(json.data).forEach(key => {
            const val = typeof json.data[key] === 'object' ? JSON.stringify(json.data[key]) : json.data[key];
            if (localStorage.getItem(key) !== val) {
              localStorage.setItem(key, val);
              updated = true;
            }
          });
          if (updated) {
            window.dispatchEvent(new Event('site_content_updated'));
          }
        }
      } catch (e) {
        console.error('Failed to fetch global content', e);
      }
    };
    fetchGlobalContent();
    
    return () => {
      window.removeEventListener('admin_edit_mode_changed', checkAdminMode);
      window.removeEventListener('storage', checkAdminMode);
      window.removeEventListener('focus', checkAdminMode);
    };
  }, []);

  const handlePublishGlobal = async () => {
    setIsPublishing(true);
    try {
      // Publish all Drafts to Live via new API
      const res = await fetch('/api/admin/publish-all', { method: 'POST' });
      
      if (res.ok) {
        toast.success('Website changes published live to all users!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error('Failed to publish changes.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while publishing.');
    } finally {
      setIsPublishing(false);
    }
  };




  // Live Location & Pincode Autocomplete search
  useEffect(() => {
    if (!manualSearch || manualSearch.trim().length < 2) {
      setLocationSuggestions([]);
      setIsFetchingLocationSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsFetchingLocationSuggestions(true);
      try {
        const query = manualSearch.trim();
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=6`,
          { headers: { 'Accept-Language': 'en' } }
        );
        
        if (!res.ok) {
          setLocationSuggestions([]);
          return;
        }

        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            setLocationSuggestions(data);
          } else {
            setLocationSuggestions([]);
          }
        } catch (parseErr) {
          setLocationSuggestions([]);
        }
      } catch (err) {
        // Silently ignore network errors so Next.js overlay doesn't pop up
        setLocationSuggestions([]);
      } finally {
        setIsFetchingLocationSuggestions(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [manualSearch]);

  const handleSelectLocationItem = (item) => {
    if (!item) return;

    let displayText = '';
    let fullAddrObj = {};

    if (typeof item === 'string') {
      displayText = item.trim();
      fullAddrObj = {
        name: displayText,
        city: displayText,
        fullAddress: displayText
      };
    } else if (typeof item === 'object') {
      const addr = item.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
      const name = item.name || addr.road || addr.suburb || addr.neighbourhood || city;
      
      if (name && city && name.toLowerCase() !== city.toLowerCase()) {
        displayText = `${name}, ${city}`;
      } else {
        displayText = item.display_name ? item.display_name.split(',')[0] + (city ? `, ${city}` : '') : (name || city);
      }

      fullAddrObj = {
        name: name || displayText,
        street: addr.road || addr.suburb || '',
        city: city,
        state: addr.state || '',
        postcode: addr.postcode || '',
        country: addr.country || 'India',
        fullAddress: item.display_name || displayText,
        coordinates: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) }
      };
    }

    const shortText = displayText.length > 25 ? displayText.substring(0, 22) + '...' : displayText;

    setLocationText(shortText);
    localStorage.setItem('userLocation', shortText);
    localStorage.setItem('userFullAddress', JSON.stringify(fullAddrObj));
    toast.success(`Location set to: ${shortText}`);
    setIsLocationModalOpen(false);
    setManualSearch('');
    setLocationSuggestions([]);
  };

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const [searchPhrases, setSearchPhrases] = useState(['services...']);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("Search for 'services...'");

  // Fetch live categories for search placeholder
  useEffect(() => {
    fetch('/api/admin/categories?mode=live')
      .then(res => res.json())
      .then(data => {
        if (data?.success && data.categories?.length > 0) {
          const names = data.categories.map(c => c.name);
          setSearchPhrases(names);
          setAnimatedPlaceholder(`Search for '${names[0]}'`);
        }
      })
      .catch(console.error);
  }, []);

  // Dynamic animated search placeholder (Urban Company style)
  useEffect(() => {
    if (!searchPhrases || searchPhrases.length === 0) return;
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId;

    const animatePlaceholder = () => {
      const currentPhrase = searchPhrases[phraseIndex];
      if (!currentPhrase) return;

      if (!isDeleting) {
        charIndex++;
        setAnimatedPlaceholder(`Search for '${currentPhrase.substring(0, charIndex)}'`);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          timerId = setTimeout(animatePlaceholder, 2000);
          return;
        }
      } else {
        charIndex--;
        setAnimatedPlaceholder(`Search for '${currentPhrase.substring(0, charIndex)}'`);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % searchPhrases.length;
        }
      }

      const speed = isDeleting ? 35 : 65;
      timerId = setTimeout(animatePlaceholder, speed);
    };

    timerId = setTimeout(animatePlaceholder, 1000);

    return () => clearTimeout(timerId);
  }, [searchPhrases]);

  // Live Search: Query MongoDB Categories, Offers, Services & Custom items in real-time
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const query = searchTerm.trim().toLowerCase();

    const fetchLiveSearchResults = async () => {
      let liveResults = [];

      // 1. Search ONLY in MongoDB Categories API Concurrently
      try {
        const catRes = await fetch('/api/admin/categories?mode=live');
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData?.success && Array.isArray(catData.categories)) {
            catData.categories.forEach(c => {
              const nameLower = c.name?.toLowerCase() || '';
              const descLower = c.description?.toLowerCase() || '';
              
              // Check if any word in the name or description starts with the query
              const matchWord = (text, q) => text.split(/\s+/).some(word => word.startsWith(q));
              
              if (matchWord(nameLower, query) || matchWord(descLower, query)) {
                liveResults.push({
                  name: c.name,
                  categoryName: 'Category',
                  icon: c.image || c.icon || '📁',
                  route: `/services/${c.slug || c._id}`
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Category search error:', err);
      }

      // Deduplicate results by name
      const uniqueResults = [];
      const seenNames = new Set();
      for (const item of liveResults) {
        const key = `${item.name}-${item.categoryName}`.toLowerCase();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          uniqueResults.push(item);
        }
      }

      setSuggestions(uniqueResults.slice(0, 8));
    };

    const timer = setTimeout(fetchLiveSearchResults, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside listener to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocationText(savedLocation);
    }
  }, []);

  const handleSelectLocation = (locName) => {
    if (!locName || !locName.trim()) return;
    const cleanName = locName.trim();
    const shortText = cleanName.length > 25 ? cleanName.substring(0, 22) + '...' : cleanName;

    setLocationText(shortText);
    localStorage.setItem('userLocation', shortText);
    localStorage.setItem('userFullAddress', JSON.stringify({
      name: cleanName,
      city: cleanName,
      fullAddress: cleanName
    }));
    toast.success(`Location set to: ${shortText}`);
    setIsLocationModalOpen(false);
    setManualSearch('');
  };

  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    setLocationText('Getting Location...');

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLocationText('Use Current Location');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state || 'Unknown Location';
            const area = data.address.road || data.address.suburb || city;
            const displayText = `${area}, ${city}`;
            
            // Limit length
            const shortText = displayText.length > 25 ? displayText.substring(0, 22) + '...' : displayText;

            setLocationText(shortText);
            localStorage.setItem('userLocation', shortText);
            
            // Also store full address
            localStorage.setItem('userFullAddress', JSON.stringify({
              name: 'Current Location',
              street: data.address.road || data.address.suburb || data.address.neighbourhood || '',
              city: data.address.city || data.address.town || data.address.village || '',
              state: data.address.state || '',
              postcode: data.address.postcode || '',
              country: data.address.country || '',
              fullAddress: data.display_name,
              coordinates: { latitude, longitude }
            }));
            toast.success(`Location set to: ${shortText}`);
            setIsLocationModalOpen(false);
          } else {
            setLocationText('Location Unknown');
            toast.error('Could not determine address.');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setLocationText('Use Current Location');
          toast.error('Failed to resolve address details.');
        }
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Use Current Location';
        setIsLoadingLocation(false);
        setLocationText(errorMessage);

        if (error.code === 1) {
          toast.error('Location permission denied. Please allow location access in your browser settings.');
        } else if (error.code === 2) {
          toast.error('Location unavailable.');
        } else if (error.code === 3) {
          toast.error('Location request timed out.');
        } else {
          toast.error('Unable to retrieve your location.');
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    // Immediate check from local storage to avoid "Guest" flash
    const localData = localStorage.getItem('user');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    const fetchUser = async () => {
      // 1. Try NextAuth first
      if (status === 'authenticated' && session) {
        const userData = {
          fullName: session.user.fullName || session.user.name,
          profileImage: session.user.profileImage || session.user.image,
          email: session.user.email,
          phone: session.user.phone
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user-updated')); // Sync components immediately
        return;
      }

      // 2. Try Custom JWT API
      try {
        // Prevent caching to ensure we get real auth status
        const res = await fetch('/api/auth/me', { headers: { 'Cache-Control': 'no-cache' } });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('user-updated')); // Notify components like Cart
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };

    fetchUser();

    // Listen for custom login event to refresh header immediately
    const handleLoginEvent = () => fetchUser();
    window.addEventListener('user-login', handleLoginEvent);
    return () => window.removeEventListener('user-login', handleLoginEvent);
  }, [session, status]);

  // Refresh user data explicitly when opening the dropdown
  useEffect(() => {
    if (isDropdownOpen) {
      const localData = localStorage.getItem('user');
      if (localData) {
        try {
          setUser(JSON.parse(localData));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isDropdownOpen]);

  // Combined best-available user data
  const currentUser = user || (status === 'authenticated' ? session?.user : null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      setUser(null);
      if (status === 'authenticated') {
        signOut({ callbackUrl: '/login' });
      } else {
        window.location.href = '/login';
      }
    } catch (err) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <img src="/images/logo.png" alt="Joamex Logo" />
        </div>

        {/* SEARCH */}
        <div className="header-search" ref={searchRef}>
          <Search size={18} />
          <input
            type="text"
            placeholder={animatedPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {isSearchFocused && suggestions.length > 0 && (
            <div className="search-suggestions-dropdown">
              {suggestions.map((sub, index) => (
                <div
                  key={index}
                  className="search-suggestion-item"
                  onClick={() => {
                    if (sub.route) {
                      router.push(sub.route);
                    }
                    setSearchTerm('');
                    setIsSearchFocused(false);
                  }}
                >
                  <span className="suggestion-icon">
                    {typeof sub.icon === 'string' && (sub.icon.startsWith('/') || sub.icon.startsWith('http')) ? (
                      <img src={sub.icon} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      sub.icon
                    )}
                  </span>
                  <div className="suggestion-details">
                    <span className="suggestion-name">{sub.name}</span>
                    <span className="suggestion-category">in {sub.categoryName}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="header-actions">
          {isAdminEditMode && (
            <div style={{ display: 'flex', gap: '8px' }}>

              <button 
                onClick={handlePublishGlobal} 
                disabled={isPublishing}
                style={{
                  backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px',
                  borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                }}
              >
                {isPublishing ? 'Publishing...' : '🚀 Publish to Live'}
              </button>
            </div>
          )}

          <button className="location-btn" onClick={() => setIsLocationModalOpen(true)} title="Select or search location">
            <MapPin size={16} />
            {locationText}
          </button>

          <button className="partner-btn" onClick={() => router.push('/partner/login')}>
            🤝 Join as Partner
          </button>

          <div className="profile-wrapper">
            <div
              className="user-profile-header"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ border: isDropdownOpen ? '1.5px solid #2563eb' : '1.5px solid #fbbf24' }}
            >
              {currentUser?.profileImage || currentUser?.image ? (
                <img src={currentUser.profileImage || currentUser.image} alt="User" />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser?.fullName || currentUser?.name ? (currentUser.fullName || currentUser.name).charAt(0) : <User size={20} />}
                </div>
              )}
              <div className="dropdown-arrow">
                <ChevronDown size={12} color={isDropdownOpen ? '#2563eb' : '#fbbf24'} />
              </div>
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown-menu">
                {currentUser ? (
                  <>

                    <div className="dropdown-user-info" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <div className="dropdown-avatar" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                        {currentUser.profileImage || currentUser.image ? (
                          <img src={currentUser.profileImage || currentUser.image} alt="User" />
                        ) : (
                          <div className="avatar-placeholder-small" style={{ fontSize: '24px' }}>{(currentUser.fullName || currentUser.name)?.charAt(0)}</div>
                        )}
                      </div>
                      <div className="dropdown-meta" style={{ marginTop: '10px' }}>
                        <h4 style={{ fontSize: '16px' }}>Welcome back,</h4>
                        <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                          {currentUser.fullName || currentUser.name || currentUser.email || 'Member'}
                        </p>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div className="dropdown-item" onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}>
                      <User size={18} /> My Profile
                    </div>
                    <div className="dropdown-item" onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}>
                      <ShoppingBag size={18} /> My Bookings
                    </div>

                    {pathname === '/profile' && (
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </div>
                    )}
                  </>
                ) : (
                  <>

                    <div className="dropdown-user-info">
                      {pathname === '/profile' ? (
                        // Force show cache or Fetch live if missing
                        (() => {
                          let cachedUser = null;
                          if (typeof window !== 'undefined') {
                            const saved = localStorage.getItem('user');
                            if (saved) {
                              cachedUser = JSON.parse(saved);
                            } else {
                              // Emergency Fetch if on profile but no data
                              fetch('/api/auth/me').then(r => r.json()).then(d => {
                                if (d.user) {
                                  localStorage.setItem('user', JSON.stringify(d.user));
                                  setUser(d.user);
                                }
                              });
                            }
                          }
                          return (
                            <>
                              <div className="dropdown-avatar" style={{ width: '50px', height: '50px' }}>
                                {cachedUser?.profileImage || cachedUser?.image ? (
                                  <img src={cachedUser.profileImage || cachedUser.image} alt="User" />
                                ) : (
                                  <div className="avatar-placeholder-small" style={{ fontSize: '20px' }}>
                                    {(cachedUser?.fullName || cachedUser?.name || 'M').charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="dropdown-meta">
                                <h4 style={{ fontSize: '16px' }}>Welcome back,</h4>
                                <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>
                                  {cachedUser?.fullName || cachedUser?.name || cachedUser?.email || 'Loading...'}
                                </p>
                                {/* Only show email line if we didn't use it as the name */}
                                {(cachedUser?.fullName || cachedUser?.name) && (
                                  <p style={{ fontSize: '12px', color: '#64748b' }}>{cachedUser?.email}</p>
                                )}
                              </div>
                            </>
                          );
                        })()
                      ) : (
                        <>
                          <h4>Welcome, Guest</h4>
                          <p>Login to manage your bookings</p>
                        </>
                      )}
                    </div>
                    <div className="dropdown-divider"></div>
                    {pathname !== '/profile' && (
                      <>
                        <button
                          className="dropdown-login-btn"
                          onClick={() => { router.push('/login'); setIsDropdownOpen(false); }}
                        >
                          Login
                        </button>
                        <button
                          className="dropdown-signup-btn"
                          onClick={() => { router.push('/signup'); setIsDropdownOpen(false); }}
                        >
                          Sign Up
                        </button>
                      </>
                    )}

                    {pathname === '/profile' && (
                      <div className="dropdown-item logout-item" onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="cart" onClick={() => router.push('/cart')}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>

      </div>

      {/* LOCATION SELECTOR MODAL (Urban Company Style) */}
      {isLocationModalOpen && (
        <div className="location-modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="location-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="location-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={22} style={{ color: '#2563eb' }} />
                <h3>Select Your Location</h3>
              </div>
              <button className="location-modal-close" onClick={() => setIsLocationModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* GPS DETECT BUTTON */}
            <button 
              className="gps-detect-btn" 
              onClick={handleGetLocation}
              disabled={isLoadingLocation}
            >
              <div className="gps-icon-circle">
                {isLoadingLocation ? <span className="gps-spinner">⏳</span> : <Navigation size={20} />}
              </div>
              <div className="gps-btn-text">
                <span className="gps-title">{isLoadingLocation ? 'Detecting your location...' : 'Use Current Location'}</span>
                <span className="gps-subtext">Using GPS for accurate address</span>
              </div>
            </button>

            <div className="location-divider">
              <span>OR ENTER MANUALLY</span>
            </div>

            {/* MANUAL SEARCH INPUT & LIVE RECOMMENDATIONS */}
            <div className="manual-location-wrapper">
              <div className="manual-location-search">
                <Search size={18} style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Type area, street, city or 6-digit pincode (e.g. 110001, Andheri)..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && locationSuggestions.length > 0) {
                      handleSelectLocationItem(locationSuggestions[0]);
                    } else if (e.key === 'Enter' && manualSearch.trim()) {
                      handleSelectLocationItem(manualSearch.trim());
                    }
                  }}
                />
                {manualSearch.trim() && (
                  <button 
                    className="set-manual-btn"
                    onClick={() => {
                      if (locationSuggestions.length > 0) {
                        handleSelectLocationItem(locationSuggestions[0]);
                      } else {
                        handleSelectLocationItem(manualSearch.trim());
                      }
                    }}
                  >
                    Apply
                  </button>
                )}
              </div>

              {/* LIVE RECOMMENDATIONS DROPDOWN LIST */}
              {isFetchingLocationSuggestions ? (
                <div className="location-suggestions-loading">
                  <span className="gps-spinner">⏳</span> Searching locations & pincodes...
                </div>
              ) : locationSuggestions.length > 0 ? (
                <div className="location-suggestions-list">
                  <div className="suggestions-header-title">Matching Locations</div>
                  {locationSuggestions.map((item, idx) => {
                    const addr = item.address || {};
                    const title = item.name || addr.road || addr.suburb || addr.neighbourhood || addr.city || 'Location';
                    const subtitle = item.display_name;
                    const postcode = addr.postcode;

                    return (
                      <div
                        key={idx}
                        className="location-suggestion-item"
                        onClick={() => handleSelectLocationItem(item)}
                      >
                        <div className="suggestion-loc-icon">📍</div>
                        <div className="suggestion-loc-info">
                          <div className="suggestion-loc-title">
                            {title} {postcode && <span className="pincode-badge">PIN: {postcode}</span>}
                          </div>
                          <div className="suggestion-loc-subtitle">{subtitle}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : manualSearch.trim().length >= 2 ? (
                <div className="location-no-results">
                  No exact matching pincode/location found. Press <strong>Apply</strong> to set "{manualSearch.trim()}".
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

