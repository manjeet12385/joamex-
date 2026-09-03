'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function ReportsDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState('Sales'); // Sales, Bookings, GST, Cancellations

    // Mock Sales Data
    const salesData = [
        { month: 'Jan', revenue: 45000, bookings: 38 },
        { month: 'Feb', revenue: 52000, bookings: 44 },
        { month: 'Mar', revenue: 68000, bookings: 59 },
        { month: 'Apr', revenue: 61000, bookings: 52 },
        { month: 'May', revenue: 84000, bookings: 73 },
        { month: 'Jun', revenue: 95000, bookings: 82 }
    ];

    // Mock GST Data
    const gstData = [
        { quarter: 'Q1 (Jan-Mar)', taxableAmount: 165000, cgst: 14850, sgst: 14850, totalGst: 29700 },
        { quarter: 'Q2 (Apr-Jun)', taxableAmount: 240000, cgst: 21600, sgst: 21600, totalGst: 43200 }
    ];

    const handleExport = () => {
        toast.success(`Exporting ${reportType} Report as CSV... (Simulated Download)`);
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Reports & Analytics</h1>
                        <p className="page-subtitle">Export sales records, bookings distribution, cancellation reviews, and GST filing summaries.</p>
                    </div>
                    <button onClick={handleExport} style={{ padding: '0.6rem 1.2rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📥 Export CSV
                    </button>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
                    {['Sales', 'Bookings', 'GST', 'Cancellations'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setReportType(tab)}
                            style={{ 
                                padding: '0.5rem 1.25rem', 
                                border: 'none', 
                                background: reportType === tab ? '#2563eb' : 'transparent',
                                color: reportType === tab ? '#fff' : '#64748b',
                                borderRadius: '6px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab} Reports
                        </button>
                    ))}
                </div>

                {reportType === 'Sales' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Analytical Chart Component (Pure CSS Grid Bar Visualizer) */}
                        <div className="section-card">
                            <h3 className="section-title">Revenue Trajectory (H1 2026)</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '220px', padding: '1rem 2rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '1rem' }}>
                                {salesData.map((d, index) => {
                                    const heightPercentage = (d.revenue / 100000) * 100;
                                    return (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>₹{d.revenue / 1000}k</span>
                                            <div style={{ width: '32px', height: `${heightPercentage * 1.5}px`, background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', borderRadius: '6px 6px 0 0', transition: 'all 0.5s ease-out' }}></div>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{d.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Grid list details */}
                        <div className="section-card">
                            <h3 className="section-title">Monthly Detailed Sales Sheet</h3>
                            <div className="table-container">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Gross Revenue</th>
                                            <th>Total Bookings Done</th>
                                            <th>Average Ticket Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesData.map((d, index) => (
                                            <tr key={index}>
                                                <td><strong>{d.month} 2026</strong></td>
                                                <td><strong style={{ color: '#10b981' }}>₹{d.revenue.toLocaleString()}</strong></td>
                                                <td>{d.bookings} orders completed</td>
                                                <td>₹{Math.round(d.revenue / d.bookings)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {reportType === 'GST' && (
                    <div className="section-card">
                        <h3 className="section-title">GST Taxation Filing Summary (18% Slab Rate)</h3>
                        <div className="table-container" style={{ marginTop: '1rem' }}>
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Quarter</th>
                                        <th>Taxable Base Amount</th>
                                        <th>CGST (9%)</th>
                                        <th>SGST (9%)</th>
                                        <th>Total GST Liabilities</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gstData.map((g, index) => (
                                        <tr key={index}>
                                            <td><strong>{g.quarter}</strong></td>
                                            <td>₹{g.taxableAmount.toLocaleString()}</td>
                                            <td>₹{g.cgst.toLocaleString()}</td>
                                            <td>₹{g.sgst.toLocaleString()}</td>
                                            <td><strong style={{ color: '#ef4444' }}>₹{g.totalGst.toLocaleString()}</strong></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {reportType === 'Bookings' && (
                    <div className="section-card">
                        <h3 className="section-title">Category Wise Distribution</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                            {[
                                { name: 'Home Cleaning Services', count: 124, pct: 45, color: '#3b82f6' },
                                { name: 'Pest Control Services', count: 82, pct: 30, color: '#10b981' },
                                { name: 'Electrical & Plumbing Care', count: 41, pct: 15, color: '#f59e0b' },
                                { name: 'Appliance Repair Services', count: 28, pct: 10, color: '#8b5cf6' }
                            ].map((c, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <span>{c.name} ({c.count} bookings)</span>
                                        <span>{c.pct}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${c.pct}%`, height: '100%', background: c.color, borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {reportType === 'Cancellations' && (
                    <div className="section-card">
                        <h3 className="section-title">Cancellation Rate Log (Total vs Abandoned)</h3>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, padding: '1.5rem', background: '#fff4f4', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
                                <h2 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>4.8%</h2>
                                <span style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>Average Cancellation Rate</span>
                            </div>
                            <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
                                <h2 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Customer Request</h2>
                                <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Primary Reason (70% bookings)</span>
                            </div>
                            <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', textAlign: 'center' }}>
                                <h2 style={{ color: '#1e293b', margin: '0 0 0.5rem 0' }}>Partner Unavailability</h2>
                                <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>Secondary Reason (30% bookings)</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
