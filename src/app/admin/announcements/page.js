'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function AnnouncementsPage() {
    const [target, setTarget] = useState('all');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        if (!subject || !message) {
            toast.error('Please fill in both Subject and Message body');
            return;
        }

        setSending(true);
        try {
            const res = await fetch('/api/admin/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, subject, message })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setSubject('');
                setMessage('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send broadcast announcement');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <div>
                        <h1 className="page-title">Broadcast & Announcements</h1>
                        <p className="page-subtitle">Send official email announcements and notifications to users and partners</p>
                    </div>
                </div>

                <div className="section-card" style={{ maxWidth: '750px', padding: '2rem' }}>
                    <form onSubmit={handleSendBroadcast}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>Target Audience</label>
                            <select
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', color: '#0f172a', background: 'white' }}
                            >
                                <option value="all">🌐 All Platform Members (Users & Partners)</option>
                                <option value="users">👥 All Customers / Users</option>
                                <option value="partners">🛠️ All Partners / Service Professionals</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>Announcement Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem', color: '#0f172a' }}
                                placeholder="e.g. Special Festival Offer: 20% Off All Home Repairs!"
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>Message Body</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#0f172a', lineHeight: '1.5' }}
                                placeholder="Type your broadcast message content here..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            style={{ width: '100%', padding: '0.85rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            {sending ? 'Sending Broadcast Email...' : '📢 Send Broadcast Announcement'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
