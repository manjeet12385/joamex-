'use client';
import { useState, useEffect } from 'react';

export default function AdminHeader() {
    const [user, setUser] = useState({ fullName: 'Venkanna Kelothu', email: 'vonexperts@gmail.com' });
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [adminEditMode, setAdminEditMode] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('admin_edit_mode');
        if (stored === null) {
            localStorage.setItem('admin_edit_mode', 'false');
            setAdminEditMode(false);
        } else {
            setAdminEditMode(stored === 'true');
        }
    }, []);

    const toggleAdminEditMode = () => {
        const currentStored = localStorage.getItem('admin_edit_mode') === 'true';
        const nextMode = !currentStored;
        setAdminEditMode(nextMode);
        localStorage.setItem('admin_edit_mode', nextMode ? 'true' : 'false');
        if (!nextMode) {
            try {
                sessionStorage.removeItem('linking_card_data');
                sessionStorage.removeItem('linking_offer_data');
            } catch (e) {}
        }
        window.dispatchEvent(new Event('admin_edit_mode_changed'));
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.action-icon') && !e.target.closest('.user-profile-wrapper') && !e.target.closest('.header-dropdown')) {
                setShowNotifications(false);
                setShowMessages(false);
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('adminUser');
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    // Purge stale or legacy names and update localStorage
                    const updatedUser = {
                        ...parsed,
                        fullName: 'Venkanna Kelothu',
                        email: 'vonexperts@gmail.com'
                    };
                    localStorage.setItem('adminUser', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                } catch (e) {
                    setUser({ fullName: 'Venkanna Kelothu', email: 'vonexperts@gmail.com' });
                }
            } else {
                setUser({ fullName: 'Venkanna Kelothu', email: 'vonexperts@gmail.com' });
            }
        };

        loadUser();

        // Listen for internal state changes
        window.addEventListener('adminUserUpdated', loadUser);
        window.addEventListener('storage', loadUser);

        return () => {
            window.removeEventListener('adminUserUpdated', loadUser);
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
    };

    return (
        <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', maxWidth: '500px' }}>
                <button 
                    className="hamburger-btn" 
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
                    title="Toggle Menu"
                >
                    ☰
                </button>
                <div className="search-bar" style={{ flex: '1' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Search across partners, users, and transactions..." />
                </div>
            </div>

            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={toggleAdminEditMode}
                    title="Toggle Admin Live Edit Mode on website"
                    style={{
                        background: adminEditMode ? '#10b981' : '#ef4444',
                        color: '#ffffff',
                        border: adminEditMode ? '2px solid #34d399' : '2px solid #f87171',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontWeight: '800',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: adminEditMode ? '0 0 12px rgba(16, 185, 129, 0.5)' : '0 0 12px rgba(239, 68, 68, 0.5)',
                        transition: 'all 0.2s ease',
                        marginRight: '4px'
                    }}
                >
                    ⚡ Admin Edit Mode: {adminEditMode ? "ON 🟢" : "OFF 🔴"}
                </button>
                <div className="action-icon" style={{ position: 'relative' }} onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    <span className="notification-dot"></span>
                    
                    {showNotifications && (
                        <div className="header-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', width: '300px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 50, cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>Notifications</h3>
                                <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Mark all as read</span>
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>👤</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#0f172a' }}>New partner registration: <strong>Aman Sharma</strong></p>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>2 minutes ago</span>
                                    </div>
                                </div>
                                <div style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>📅</div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#0f172a' }}>New booking for <strong>AC Repair</strong></p>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>1 hour ago</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>View all notifications</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="action-icon" style={{ position: 'relative' }} onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    
                    {showMessages && (
                        <div className="header-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', width: '300px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 50, cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>Messages</h3>
                            </div>
                            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No new messages right now.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* USER PROFILE & LOGOUT DROPDOWN */}
                <div className="user-profile-wrapper" style={{ position: 'relative' }}>
                    <div 
                        className="user-profile" 
                        onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }}
                        style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', border: showProfileMenu ? '1px solid #2563EB' : '1px solid transparent' }}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{user.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>Super Admin</div>
                        </div>
                        <div className="avatar">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                user.fullName?.charAt(0) || 'V'
                            )}
                        </div>
                    </div>

                    {showProfileMenu && (
                        <div className="header-dropdown" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '12px', width: '240px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 50, cursor: 'default', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ padding: '14px 16px', background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>{user.fullName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>{user.email || 'vonexperts@gmail.com'}</div>
                                <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.65rem', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>SUPER ADMIN</span>
                            </div>
                            
                            <div style={{ padding: '8px' }}>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 12px',
                                        background: '#FEE2E2',
                                        color: '#DC2626',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Sign Out / Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
