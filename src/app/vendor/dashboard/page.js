'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/app/admin/admin.css';

export default function VendorDashboard() {
    const [stats, setStats] = useState({
        totalEarnings: '₹45,200',
        activeTechnicians: 12,
        ongoingJobs: 4,
        completedJobs: 156
    });

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Agency Dashboard</h1>
                <p>Welcome back! Here's an overview of your agency's performance.</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card stat-card">
                    <h3>Total Earnings</h3>
                    <div className="stat-value" style={{color: '#10b981'}}>{stats.totalEarnings}</div>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Active Technicians</h3>
                    <div className="stat-value">{stats.activeTechnicians}</div>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Ongoing Jobs</h3>
                    <div className="stat-value" style={{color: '#f59e0b'}}>{stats.ongoingJobs}</div>
                </div>
                <div className="dashboard-card stat-card">
                    <h3>Completed Jobs</h3>
                    <div className="stat-value">{stats.completedJobs}</div>
                </div>
            </div>

            <div className="dashboard-grid" style={{marginTop: '2rem'}}>
                <div className="dashboard-card" style={{gridColumn: '1 / -1'}}>
                    <h3>Quick Actions</h3>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                        <Link href="/vendor/staff" className="btn btn-outline">Manage Staff</Link>
                        <Link href="/vendor/jobs" className="btn btn-primary">Re-assign Jobs</Link>
                        <Link href="/vendor/earnings" className="btn btn-outline" style={{borderColor: '#10b981', color: '#10b981'}}>Withdraw Funds</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
