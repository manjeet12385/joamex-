'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState('All Bookings');
    const [bookings, setBookings] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningBooking, setAssigningBooking] = useState(null);
    const [selectedPartnerId, setSelectedPartnerId] = useState('');
    const [submittingAssign, setSubmittingAssign] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/bookings?role=admin');
            const data = await res.json();
            if (data.success) {
                setBookings(data.bookings || []);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPartners = async () => {
        try {
            const res = await fetch('/api/admin/partners?status=Verified');
            const data = await res.json();
            if (data.success) {
                setPartners(data.partners || []);
            }
        } catch (err) {
            console.error('Failed to fetch partners:', err);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchPartners();
    }, []);

    const handleAssignSubmit = async () => {
        if (!selectedPartnerId || !assigningBooking) {
            toast.error('Please select a partner');
            return;
        }
        setSubmittingAssign(true);
        try {
            const res = await fetch('/api/admin/bookings/assign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: assigningBooking._id, partnerId: selectedPartnerId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Partner assigned successfully!');
                setAssigningBooking(null);
                setSelectedPartnerId('');
                fetchBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to assign partner');
        } finally {
            setSubmittingAssign(false);
        }
    };

    const filteredBookings = activeTab === 'All Bookings'
        ? bookings
        : bookings.filter(b => b.status?.toLowerCase() === activeTab.toLowerCase());

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Bookings Dispatch</h1>
                        <p className="page-subtitle">Manage and assign service requests to verified partners</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="tabs-container" style={{ padding: 0, margin: 0, border: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['All Bookings', 'Pending', 'Assigned', 'Completed'].map(tab => (
                            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="section-card">
                    <div className="table-container" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                        <table className="custom-table" style={{ minWidth: '850px' }}>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer</th>
                                    <th>Service Category</th>
                                    <th>Partner Assigned</th>
                                    <th>Scheduled Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading bookings...</td></tr>
                                ) : filteredBookings.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No bookings found.</td></tr>
                                ) : (
                                    filteredBookings.map((b) => (
                                        <tr key={b._id}>
                                            <td style={{ color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>
                                                #{b._id.substring(b._id.length - 6).toUpperCase()}
                                            </td>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-img" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: '#e2e8f0', color: '#0f172a' }}>
                                                        {(b.userDetails?.name || 'G').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1F2937' }}>{b.userDetails?.name || 'Guest User'}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{b.userDetails?.email || ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ color: '#1F2937', fontWeight: '500' }}>{b.category}</td>
                                            <td>
                                                {b.partner?.name ? (
                                                    <span style={{ color: '#10B981', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        👤 {b.partner.name}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: '#EF4444', fontStyle: 'italic', fontWeight: '500' }}>Unassigned</span>
                                                )}
                                            </td>
                                            <td style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                                                <div>{b.scheduledDate || 'Flexible'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{b.scheduledTimeSlot || ''}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${b.status?.toLowerCase()}`}>● {b.status}</span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => { setAssigningBooking(b); setSelectedPartnerId(b.partnerId || ''); }}
                                                    style={{ padding: '6px 12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                                >
                                                    {b.partner?.name ? 'Re-assign' : 'Assign Partner'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Assign Partner Modal */}
                {assigningBooking && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginTop: 0, color: '#1F2937' }}>Assign Partner to Booking</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Service: <strong>{assigningBooking.category}</strong> | Booking #{assigningBooking._id.substring(assigningBooking._id.length - 6).toUpperCase()}
                            </p>

                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Select Verified Partner</label>
                            <select
                                value={selectedPartnerId}
                                onChange={(e) => setSelectedPartnerId(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#0f172a', marginBottom: '1.5rem' }}
                            >
                                <option value="">-- Choose Partner --</option>
                                {partners.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.fullName} ({p.serviceCategory}) - 📞 {p.phoneNumber}
                                    </option>
                                ))}
                            </select>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setAssigningBooking(null)}
                                    style={{ padding: '0.6rem 1.2rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAssignSubmit}
                                    disabled={submittingAssign}
                                    style={{ padding: '0.6rem 1.2rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
