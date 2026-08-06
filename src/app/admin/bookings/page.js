'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { bookingsData } from '@/lib/admin-data';
import '../admin.css';

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState('All Bookings');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings?role=admin');
                const data = await res.json();
                if (data.success) {
                    if (data.bookings.length > 0) {
                        const formattedBookings = data.bookings.map(b => ({
                            id: '#' + b._id.substring(b._id.length - 6).toUpperCase(),
                            customer: b.userDetails?.name || 'Guest',
                            service: b.category,
                            partner: b.partner?.name || 'Unassigned',
                            schedule: `${b.scheduledDate || ''} ${b.scheduledTimeSlot || ''}`,
                            status: b.status
                        }));
                        setBookings(formattedBookings);
                    } else {
                        // Fallback to mock data if no real bookings found
                        console.log('No real bookings, using mock data');
                        setBookings(bookingsData);
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setBookings(bookingsData); // Fallback on error
            }
        };
        fetchBookings();
    }, []);

    const filteredBookings = activeTab === 'All Bookings'
        ? bookings
        : bookings.filter(b => b.status === activeTab);

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Bookings</h1>
                        <p className="page-subtitle">Manage and monitor all service requests</p>
                    </div>
                    <button className="btn-add">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New Booking
                    </button>
                </div>

                {/* Search & Date Filter Bar */}
                <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div className="tabs-container" style={{ padding: 0, margin: 0, border: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['All Bookings', 'Pending', 'Assigned', 'Completed'].map(tab => (
                            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem' }}>
                                {tab}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>📅 10/24/2023 — 11/24/2023</div>
                        <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>More Filters</button>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="section-card">
                    <div className="table-container" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                        <table className="custom-table" style={{ minWidth: '760px' }}>
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer</th>
                                    <th>Service Type</th>
                                    <th>Partner Assigned</th>
                                    <th>Schedule</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td style={{ color: '#2563eb', fontFamily: 'monospace', fontWeight: '700' }}>{booking.id}</td>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-img" style={{ width: '32px', height: '32px', fontSize: '0.8rem', background: '#e2e8f0', color: '#0f172a' }}>{booking.customer.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>{booking.customer}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>jane.doe@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{booking.service}</td>
                                        <td>
                                            {booking.partner === 'Unassigned' ? (
                                                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '24px', height: '24px', background: 'white', borderRadius: '4px' }}></div>
                                                    {booking.partner}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                            <div style={{ fontWeight: '600' }}>{booking.schedule.split(' ')[0]} {booking.schedule.split(' ')[1]} {booking.schedule.split(' ')[2]}</div>
                                            <div style={{ color: '#9CA3AF' }}>{booking.schedule.split(' ').slice(3).join(' ')}</div>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>● {booking.status}</span>
                                        </td>
                                        <td>
                                            <svg style={{ cursor: 'pointer', color: '#9CA3AF' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ padding: '1rem', borderTop: '1px solid #1F2937', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        Showing 1 to {filteredBookings.length} results
                    </div>
                </div>

            </main>
        </div>
    );
}
