'use client';
import { useState, useEffect } from 'react';
import '@/app/admin/admin.css';

export default function EmergencyDesk() {
    const [alerts, setAlerts] = useState([]);
    const [activeBookings, setActiveBookings] = useState([]);

    useEffect(() => {
        // Mock data for MVP
        setAlerts([
            { id: '1', bookingId: 'BK-10045', type: 'Customer SOS', status: 'Unresolved', time: '2 mins ago', location: 'Andheri West' },
            { id: '2', bookingId: 'BK-10042', type: 'Partner SOS', status: 'Resolved', time: '1 hour ago', location: 'Bandra' }
        ]);

        setActiveBookings([
            { id: 'BK-10048', partner: 'Ramesh Plumber', customer: 'Rahul Sharma', status: 'In-Progress', timeElapsed: '45 mins' },
            { id: 'BK-10049', partner: 'Suresh AC', customer: 'Priya Singh', status: 'Dispatched', timeElapsed: '15 mins' }
        ]);
    }, []);

    const resolveAlert = (id) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Safety & Emergency Desk</h1>
                <p>Real-time monitoring hub for active bookings and SOS alerts.</p>
            </div>

            <div className="dashboard-grid">
                {/* SOS ALERTS */}
                <div className="dashboard-card" style={{gridColumn: '1 / -1', borderLeft: '4px solid #ef4444'}}>
                    <h3 style={{color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Active SOS Alerts
                    </h3>
                    
                    <div className="table-container" style={{marginTop: '1rem'}}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Alert Type</th>
                                    <th>Location</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(alert => (
                                    <tr key={alert.id} style={{background: alert.status === 'Unresolved' ? '#fef2f2' : 'transparent'}}>
                                        <td><strong>{alert.bookingId}</strong></td>
                                        <td>{alert.type}</td>
                                        <td>{alert.location}</td>
                                        <td>{alert.time}</td>
                                        <td>
                                            <span className={`status-badge ${alert.status === 'Resolved' ? 'status-active' : 'status-pending'}`} style={{background: alert.status === 'Unresolved' ? '#fecaca' : '', color: alert.status === 'Unresolved' ? '#991b1b' : ''}}>
                                                {alert.status}
                                            </span>
                                        </td>
                                        <td>
                                            {alert.status === 'Unresolved' && (
                                                <button onClick={() => resolveAlert(alert.id)} className="btn btn-primary btn-sm" style={{background: '#ef4444', borderColor: '#ef4444'}}>
                                                    Mark Resolved
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ACTIVE BOOKINGS */}
                <div className="dashboard-card" style={{gridColumn: '1 / -1'}}>
                    <h3>Live Active Bookings</h3>
                    <p style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem'}}>Bookings currently in progress or dispatched.</p>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Partner</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Time Elapsed</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeBookings.map(bk => (
                                    <tr key={bk.id}>
                                        <td><strong>{bk.id}</strong></td>
                                        <td>{bk.partner}</td>
                                        <td>{bk.customer}</td>
                                        <td><span className="status-badge">{bk.status}</span></td>
                                        <td>{bk.timeElapsed}</td>
                                        <td>
                                            <button className="btn btn-outline btn-sm">Track Map</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
