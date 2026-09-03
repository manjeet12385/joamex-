'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/app/admin/admin.css'; // Use admin styles

export default function VendorLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mock login
        setTimeout(() => {
            router.push('/vendor/dashboard');
        }, 800);
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc'}}>
            <div className="dashboard-card" style={{width: '100%', maxWidth: '400px', padding: '2rem'}}>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b'}}>Vendor Portal Login</h1>
                    <p style={{color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem'}}>Manage your agency and staff</p>
                </div>

                <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" required className="form-input" style={{width: '100%', padding: '0.75rem'}} placeholder="agency@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" required className="form-input" style={{width: '100%', padding: '0.75rem'}} placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '0.75rem', marginTop: '1rem'}} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
                    <Link href="/vendor/register" style={{color: '#3b82f6', textDecoration: 'none'}}>Don't have an agency account? Register here</Link>
                </div>
            </div>
        </div>
    );
}
