'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            router.push('/admin/login');
        }
    }, [router]);

    useEffect(() => {
        const handleToggle = () => setIsOpen(prev => !prev);
        const handleClose = () => setIsOpen(false);

        window.addEventListener('toggle-admin-sidebar', handleToggle);
        window.addEventListener('close-admin-sidebar', handleClose);
        return () => {
            window.removeEventListener('toggle-admin-sidebar', handleToggle);
            window.removeEventListener('close-admin-sidebar', handleClose);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            localStorage.removeItem('adminUser');
            window.location.href = '/admin';
        } catch (error) {
            console.error('Logout failed', error);
            localStorage.removeItem('adminUser');
            window.location.href = '/admin';
        }
    };

    const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <>
            {/* MOBILE BACKDROP */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="logo-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        </div>
                        <span className="brand-name">SYSTEM ADMIN</span>
                    </div>
                    {/* CLOSE BTN ON MOBILE */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="close-drawer-btn"
                        style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
                    >
                        ✕
                    </button>
                </div>

                <nav className="nav-section" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto', paddingBottom: '2rem' }}>
                    <Link href="/admin/dashboard" className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Dashboard
                    </Link>
                    <Link href="/admin/users" className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Users
                    </Link>
                    <Link href="/admin/partners" className={`nav-item ${isActive('/admin/partners') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        Partners
                    </Link>
                    <Link href="/admin/partners/kyc" className={`nav-item ${isActive('/admin/partners/kyc') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 15L11 17L15 13"></path></svg>
                        KYC Approvals
                    </Link>
                    <Link href="/admin/financials" className={`nav-item ${isActive('/admin/financials') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        Financials
                    </Link>
                    <Link href="/admin/payouts" className={`nav-item ${isActive('/admin/payouts') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        Payouts
                    </Link>
                    <Link href="/admin/bookings" className={`nav-item ${isActive('/admin/bookings') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        Bookings
                    </Link>
                    <Link href="/admin/services" className={`nav-item ${isActive('/admin/services') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        Services & Rates
                    </Link>
                    <Link href="/admin/pricing" className={`nav-item ${isActive('/admin/pricing') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        Dynamic Pricing
                    </Link>
                    <Link href="/admin/locations" className={`nav-item ${isActive('/admin/locations') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        Location Management
                    </Link>
                    <Link href="/admin/coupons" className={`nav-item ${isActive('/admin/coupons') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7" y2="7"></line></svg>
                        Offers & Coupons
                    </Link>
                    <Link href="/admin/reviews" className={`nav-item ${isActive('/admin/reviews') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        Reviews Moderation
                    </Link>
                    <Link href="/admin/support" className={`nav-item ${isActive('/admin/support') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        Support
                    </Link>
                    <Link href="/admin/emergency" className={`nav-item ${isActive('/admin/emergency') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color: '#ef4444'}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        Emergency Desk
                    </Link>
                    <Link href="/admin/announcements" className={`nav-item ${isActive('/admin/announcements') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17H2l8-10 2 2.5L18 3l4 14z"></path><path d="M6 17v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"></path></svg>
                        Announcements
                    </Link>

                    <div className="nav-label">System</div>

                    <Link href="/admin/notifications" className={`nav-item ${isActive('/admin/notifications') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        Notifications
                    </Link>
                    <Link href="/admin/content" className={`nav-item ${isActive('/admin/content') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        Website Content
                    </Link>
                    <Link href="/admin/reports" className={`nav-item ${isActive('/admin/reports') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Reports
                    </Link>
                    <Link href="/admin/roles" className={`nav-item ${isActive('/admin/roles') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Roles & Permissions
                    </Link>
                    <Link href="/admin/settings" className={`nav-item ${isActive('/admin/settings') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Settings
                    </Link>
                    <Link href="/admin/audit-logs" className={`nav-item ${isActive('/admin/audit-logs') ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Audit Logs
                    </Link>

                    <div className="nav-item logout-btn" onClick={handleLogout}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Logout
                    </div>
                </nav>
            </aside>
        </>
    );
}
