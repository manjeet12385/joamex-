'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Tag, ArrowRight, Home } from 'lucide-react';
import '../auth.css';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        referralCode: ''
    });
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!agree) {
            toast.warning('Please agree to the Terms and Conditions');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Account created! Please check your email to verify.');

                // Smart redirect based on cart
                const cartData = localStorage.getItem('cart');
                let redirectUrl = '/profile';
                if (cartData) {
                    try {
                        const cart = JSON.parse(cartData);
                        if (cart && cart.length > 0) {
                            redirectUrl = '/cart';
                        }
                    } catch (e) {
                        console.error('Cart parse error:', e);
                    }
                }
                router.push(redirectUrl);
            } else {
                toast.error(data.message || 'Signup failed');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page signup-page">
            <div className="brand-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer', position: 'absolute', top: '30px', left: '30px' }}>
                <div className="logo-box">
                    <Home size={20} color="white" />
                </div>
                <span style={{ color: '#000' }}>HomeServices</span>
            </div>

            <div className="signup-card">
                <div className="signup-header">
                    <h1>Create Your Account</h1>
                    <p>Start booking reliable home services today</p>
                </div>

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                name="fullName"
                                className="auth-input"
                                placeholder="Enter your full name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                name="email"
                                className="auth-input"
                                placeholder="name@example.com"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone className="input-icon" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                className="auth-input"
                                placeholder="+1 (555) 000-0000"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label className="input-label">Referral Code</label>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>Optional</span>
                        </div>
                        <div className="input-wrapper">
                            <Tag className="input-icon" size={20} />
                            <input
                                type="text"
                                name="referralCode"
                                className="auth-input"
                                placeholder="Enter code"
                                style={{ borderStyle: 'dotted' }}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
                        <label>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                    </div>

                    <button type="submit" className="auth-main-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Create Account'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="signup-footer-info">
                    <span>🛡️ SECURE & ENCRYPTED</span>
                    <span>✅ VERIFIED PROS</span>
                </div>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}
