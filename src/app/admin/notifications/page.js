'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';
import '../locations/locations.css';

export default function NotificationsSetup() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    // Notification channel toggles
    const [enableSms, setEnableSms] = useState(true);
    const [enableEmail, setEnableEmail] = useState(true);
    const [enableWhatsapp, setEnableWhatsapp] = useState(false);

    // Template messages
    const [otpTemplate, setOtpTemplate] = useState('Your Joamex OTP verification code is {otp}. Valid for 5 minutes.');
    const [bookingBookedTemplate, setBookingBookedTemplate] = useState('Hello {name}, your booking for {service} has been successfully registered. Booking ID: {id}.');
    const [bookingAssignedTemplate, setBookingAssignedTemplate] = useState('Hi {name}, service professional {partner} has been assigned to your booking {id}. Contact: {phone}.');

    // Gateway configs
    const [smsApiKey, setSmsApiKey] = useState('sms-key-dummy-xxxxxxxx');
    const [whatsappSender, setWhatsappSender] = useState('+919876543210');

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            // Mock API request to settings update (can reuse/extend settings)
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enableSms,
                    enableEmail,
                    enableWhatsapp,
                    otpTemplate,
                    bookingBookedTemplate,
                    bookingAssignedTemplate
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Notification preferences saved successfully');
            } else {
                toast.error(data.message || 'Failed to save settings');
            }
        } catch (error) {
            toast.error('Network error saving preferences');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header">
                    <h1 className="page-title">Notification Channels & Templates</h1>
                    <p className="page-subtitle">Configure alerts via SMS, WhatsApp, Email, and edit alert body templates.</p>
                </div>

                <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', marginTop: '1.5rem' }}>
                    
                    {/* Left: Templates */}
                    <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 className="section-title">Message Templates (Body Text)</h3>
                        
                        <div className="form-group">
                            <label>OTP Verification Message</label>
                            <textarea 
                                value={otpTemplate} 
                                onChange={(e) => setOtpTemplate(e.target.value)} 
                                required 
                                className="form-input" 
                                style={{ height: '70px', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Placeholder: <code>{`{otp}`}</code></span>
                        </div>

                        <div className="form-group">
                            <label>Booking Success Message (Customer)</label>
                            <textarea 
                                value={bookingBookedTemplate} 
                                onChange={(e) => setBookingBookedTemplate(e.target.value)} 
                                required 
                                className="form-input" 
                                style={{ height: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Placeholders: <code>{`{name}`}</code>, <code>{`{service}`}</code>, <code>{`{id}`}</code></span>
                        </div>

                        <div className="form-group">
                            <label>Professional Assignment Message (Customer)</label>
                            <textarea 
                                value={bookingAssignedTemplate} 
                                onChange={(e) => setBookingAssignedTemplate(e.target.value)} 
                                required 
                                className="form-input" 
                                style={{ height: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Placeholders: <code>{`{name}`}</code>, <code>{`{partner}`}</code>, <code>{`{id}`}</code>, <code>{`{phone}`}</code></span>
                        </div>

                        <button type="submit" disabled={isSubmitLoading} className="premium-btn" style={{ width: 'fit-content' }}>
                            {isSubmitLoading ? 'Saving Settings...' : 'Save Templates & Channels'}
                        </button>
                    </div>

                    {/* Right: Gateways & Channel Toggle */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Channel Selection */}
                        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 className="section-title">Active Outlets</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>SMS Alerts</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Send transaction texts</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={enableSms} onChange={(e) => setEnableSms(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                <div>
                                    <strong>Email Alerts</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Send receipt HTML emails</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={enableEmail} onChange={(e) => setEnableEmail(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                                <div>
                                    <strong>WhatsApp Alerts</strong>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Send text via WhatsApp Business</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked={enableWhatsapp} onChange={(e) => setEnableWhatsapp(e.target.checked)} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        {/* Gateway Configurations */}
                        <div className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h3 className="section-title">Gateway Settings</h3>
                            
                            <div className="form-group">
                                <label>SMS Service API Key</label>
                                <input 
                                    type="password" 
                                    value={smsApiKey} 
                                    onChange={(e) => setSmsApiKey(e.target.value)} 
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>WhatsApp Sender ID</label>
                                <input 
                                    type="text" 
                                    value={whatsappSender} 
                                    onChange={(e) => setWhatsappSender(e.target.value)} 
                                    className="form-input"
                                />
                            </div>
                        </div>

                    </div>
                </form>
            </main>
        </div>
    );
}
