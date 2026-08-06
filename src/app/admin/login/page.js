'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import '../admin-login.css';

export default function AdminLogin() {
    const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
    const [email, setEmail] = useState('vonexperts@gmail.com');
    const [fullName, setFullName] = useState('Venkanna Kelothu');
    const [phone, setPhone] = useState('9014380344');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1); // 1: Form, 2: OTP Entry
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('adminUser')) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    // Password Login Handler
    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, phone, fullName }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                toast.success('Admin Authentication Successful!');
                router.push('/admin/dashboard');
            } else {
                const errorMsg = data.error || 'Invalid Admin Credentials';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            toast.error('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // OTP Request Handler
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, fullName }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep(2);
                startResendTimer();
                toast.success('Security verification code sent');
            } else {
                const errorMsg = data.error || 'Failed to send OTP';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPChange = (index, value) => {
        if (value.length > 1) value = value[0];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                toast.success('Access Granted');
                router.push('/admin/dashboard');
            } else {
                const errorMsg = data.error || 'Invalid OTP';
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
            toast.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="admin-container">
            <div className="admin-left">
                <div className="lock-visual-container">
                    <div className="lock-glow"></div>
                    <div className="lock-illustration">
                        <svg className="lock-body-svg" viewBox="0 0 24 24">
                            <path d="M12 1a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zM9 6a3 3 0 0 1 6 0v2H9V6z" />
                        </svg>
                        <div className="lock-core">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#2563EB">
                                <path d="M12 1l-10 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-10-4zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <h2 className="left-title">Secure Admin Portal</h2>
                <p className="left-subtitle">Restricted to authorized system administrators only.</p>
            </div>

            <div className="admin-right">
                {step === 1 ? (
                    <div className="login-form-container">
                        <h1 className="form-title">Super Admin Authentication</h1>
                        <p className="form-subtitle">Enter your authorized credentials to access portal.</p>

                        {/* Login Mode Toggle Tabs */}
                        <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '4px', marginBottom: '1.5rem' }}>
                            <button
                                type="button"
                                onClick={() => { setLoginMode('password'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: loginMode === 'password' ? '#2563eb' : 'transparent',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Password Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginMode('otp'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: loginMode === 'otp' ? '#2563eb' : 'transparent',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                OTP Login
                            </button>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        {loginMode === 'password' ? (
                            <form onSubmit={handlePasswordLogin}>
                                <div className="input-group">
                                    <label>Admin Email</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="email"
                                            placeholder="vonexperts@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Admin Password</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="get-otp-btn" disabled={loading}>
                                    {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard →'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSendOTP}>
                                <div className="input-group">
                                    <label>Authorized Admin Email</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="email"
                                            placeholder="vonexperts@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '12px' }}>
                                    <label>Admin Name</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Venkanna Kelothu"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '12px' }}>
                                    <label>Authorized Mobile Phone</label>
                                    <div className="input-field-wrapper">
                                        <input
                                            type="text"
                                            placeholder="9014380344"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="get-otp-btn" disabled={loading} style={{ marginTop: '16px' }}>
                                    {loading ? 'Sending Code...' : 'Get OTP Code →'}
                                </button>
                            </form>
                        )}

                        <div className="verify-info-box" style={{ marginTop: '1.5rem' }}>
                            <div className="info-icon">🔒</div>
                            <div className="info-content">
                                <h4>Restricted System Access</h4>
                                <p>Only registered Admin accounts can log into this portal.</p>
                            </div>
                        </div>

                        <div className="encrypted-footer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
                            </svg>
                            256-BIT ENCRYPTED ADMIN ACCESS
                        </div>
                    </div>
                ) : (
                    <div className="login-form-container otp-form-container">
                        <button className="back-btn" onClick={() => setStep(1)} type="button" style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            ← Back to Login
                        </button>

                        <h1 className="form-title" style={{ fontSize: '1.75rem' }}>Admin OTP Verification</h1>
                        <p className="form-subtitle">Security code sent to <strong>{email}</strong></p>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleVerifyOTP}>
                            <div className="otp-box-grid">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                        disabled={loading}
                                        className="digit-input"
                                    />
                                ))}
                            </div>

                            <button type="submit" className="get-otp-btn" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Access Dashboard'}
                            </button>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                {resendTimer > 0 ? (
                                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Resend code in <span style={{ color: '#fff' }}>{resendTimer}s</span></p>
                                ) : (
                                    <button type="button" onClick={handleSendOTP} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '600', cursor: 'pointer' }}>
                                        Resend Code
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
