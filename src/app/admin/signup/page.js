'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../admin-login.css';

export default function AdminSignup() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/login');
    }, [router]);

    return (
        <div className="admin-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
            <div className="login-form-container" style={{ textAlign: 'center', maxWidth: '450px' }}>
                <h1 className="form-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>🔒 Admin Portal Restricted</h1>
                <p className="form-subtitle" style={{ marginBottom: '2rem' }}>
                    Public admin registration is disabled for system security. Please log in with authorized super admin credentials.
                </p>
                <button 
                    onClick={() => router.push('/admin/login')} 
                    className="get-otp-btn"
                >
                    Go to Admin Login →
                </button>
            </div>
        </div>
    );
}
