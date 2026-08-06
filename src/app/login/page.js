'use client';
import { useState, Suspense } from 'react'; // Suspense add kiya
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Mail, User, Phone, ArrowRight, Home } from 'lucide-react';
import '../auth.css';

// 1. Saara logic is naye component mein move kar diya
function LoginContent() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('user-updated'));
        toast.success('Login successful!');

        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          router.push(callbackUrl);
          return;
        }

        const cartData = localStorage.getItem('cart');
        if (cartData) {
          try {
            const cart = JSON.parse(cartData);
            if (cart && cart.length > 0) {
              router.push('/cart');
              return;
            }
          } catch (e) {
            console.error('Cart parse error:', e);
          }
        }
        router.push('/profile');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-split">
      <div className="login-left">
        <div className="brand-logo" onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-box">
            <Home size={20} color="white" />
          </div>
          <span>HomeServices</span>
        </div>
        <div className="left-content">
          <h1 className="left-title">Find the perfect help for your home.</h1>
          <p className="left-subtitle">Join thousands of homeowners who trust our marketplace for quality repairs.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="auth-form-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Enter your details to continue</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Full Name (Optional)</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="fullName"
                  className="auth-input"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Phone Number (Optional)</label>
              <div className="input-wrapper">
                <Phone className="input-icon" size={20} />
                <input
                  type="tel"
                  name="phone"
                  className="auth-input"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="auth-main-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login / Sign Up'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 2. Main export jo Suspense use karega
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading login form...</div>}>
      <LoginContent />
    </Suspense>
  );
}