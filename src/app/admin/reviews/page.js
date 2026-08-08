'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews || []);
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleAction = async (reviewId, action) => {
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, action })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                fetchReviews();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <div>
                        <h1 className="page-title">Ratings & Reviews Moderation</h1>
                        <p className="page-subtitle">Monitor customer feedback, service quality, and moderate reviews</p>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="section-card">
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Partner Name</th>
                                    <th>Rating</th>
                                    <th>Feedback Comment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading reviews...</td></tr>
                                ) : reviews.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No reviews submitted yet.</td></tr>
                                ) : (
                                    reviews.map((r) => (
                                        <tr key={r._id}>
                                            <td style={{ fontWeight: '600', color: '#1F2937' }}>{r.userName || 'Customer'}</td>
                                            <td style={{ color: '#2563EB', fontWeight: '500' }}>👤 {r.partnerName || 'Partner'}</td>
                                            <td>
                                                <span style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>{renderStars(r.rating)}</span>
                                            </td>
                                            <td style={{ color: '#4B5563', fontSize: '0.85rem', maxWidth: '300px' }}>
                                                "{r.comment}"
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${r.status?.toLowerCase() === 'approved' ? 'active' : 'rejected'}`}>
                                                    ● {r.status || 'Approved'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {r.status === 'Hidden' ? (
                                                        <button
                                                            onClick={() => handleAction(r._id, 'approve')}
                                                            style={{ padding: '4px 10px', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                        >
                                                            Approve
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction(r._id, 'hide')}
                                                            style={{ padding: '4px 10px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                        >
                                                            Hide
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction(r._id, 'delete')}
                                                        style={{ padding: '4px 10px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
