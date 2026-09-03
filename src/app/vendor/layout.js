'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import '@/app/admin/admin.css'; // Reusing admin styles for vendor panel for consistency

export default function VendorLayout({ children }) {
    const pathname = usePathname();

    // Don't show sidebar on login/register pages
    if (pathname.includes('/vendor/login') || pathname.includes('/vendor/register')) {
        return <>{children}</>;
    }

    const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <div className="admin-layout" style={{display: 'flex', minHeight: '100vh', background: '#f8fafc'}}>
            <aside className="sidebar open" style={{width: '260px', background: '#1e293b', color: 'white'}}>
                <div className="logo-section" style={{ padding: '1.5rem', borderBottom: '1px solid #334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="brand-name" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>VENDOR PANEL</span>
                    </div>
                </div>

                <nav className="nav-section" style={{ padding: '1rem 0' }}>
                    <Link href="/vendor/dashboard" className={`nav-item ${isActive('/vendor/dashboard') ? 'active' : ''}`} style={{display: 'flex', padding: '0.75rem 1.5rem', color: '#cbd5e1', textDecoration: 'none'}}>
                        Dashboard
                    </Link>
                    <Link href="/vendor/staff" className={`nav-item ${isActive('/vendor/staff') ? 'active' : ''}`} style={{display: 'flex', padding: '0.75rem 1.5rem', color: '#cbd5e1', textDecoration: 'none'}}>
                        Staff & Fleet
                    </Link>
                    <Link href="/vendor/jobs" className={`nav-item ${isActive('/vendor/jobs') ? 'active' : ''}`} style={{display: 'flex', padding: '0.75rem 1.5rem', color: '#cbd5e1', textDecoration: 'none'}}>
                        Jobs & Re-assignment
                    </Link>
                    <Link href="/vendor/earnings" className={`nav-item ${isActive('/vendor/earnings') ? 'active' : ''}`} style={{display: 'flex', padding: '0.75rem 1.5rem', color: '#cbd5e1', textDecoration: 'none'}}>
                        Bulk Earnings
                    </Link>
                    
                    <div className="nav-item logout-btn" style={{display: 'flex', padding: '0.75rem 1.5rem', color: '#ef4444', textDecoration: 'none', cursor: 'pointer', marginTop: 'auto'}} onClick={() => window.location.href='/vendor/login'}>
                        Logout
                    </div>
                </nav>
            </aside>

            <main className="main-content" style={{flex: 1, padding: '2rem', overflowY: 'auto'}}>
                {children}
            </main>
        </div>
    );
}
