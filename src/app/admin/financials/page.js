'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function FinancialsPage() {
    const [timeRange, setTimeRange] = useState('Yearly');
    const [stats, setStats] = useState({ totalRevenue: 0, platformCommission: 0, totalPayouts: 0 });
    const [transactions, setTransactions] = useState([]);
    const [partnerPayouts, setPartnerPayouts] = useState([]);
    const [payoutLogs, setPayoutLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for releasing payout
    const [releasingPartner, setReleasingPartner] = useState(null);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [txnId, setTxnId] = useState('');
    const [submittingPayout, setSubmittingPayout] = useState(false);

    const fetchFinancialData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/financials');
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to load financials:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayoutData = async () => {
        try {
            const res = await fetch('/api/admin/payouts');
            const data = await res.json();
            if (data.success) {
                setPartnerPayouts(data.partnerPayouts || []);
                setPayoutLogs(data.payouts || []);
            }
        } catch (error) {
            console.error("Failed to load payouts:", error);
        }
    };

    useEffect(() => {
        fetchFinancialData();
        fetchPayoutData();
    }, []);

    const handleReleasePayout = async () => {
        if (!releasingPartner || !payoutAmount) {
            toast.error('Please enter a valid payout amount');
            return;
        }
        setSubmittingPayout(true);
        try {
            const res = await fetch('/api/admin/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partnerId: releasingPartner._id,
                    amount: payoutAmount,
                    transactionId: txnId
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setReleasingPartner(null);
                setPayoutAmount('');
                setTxnId('');
                fetchPayoutData();
                fetchFinancialData();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to release payout');
        } finally {
            setSubmittingPayout(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="page-title">Financial & Payout Analytics</h1>
                            <p className="page-subtitle">Track revenue, platform commissions, and partner payout settlements</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></span>
                            <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: '600' }}>Live Feed</span>
                        </div>
                    </div>
                </div>

                {/* Financial Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                            <span className="growth-badge positive">+12.4%</span>
                        </div>
                        <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                        <div className="stat-subtext">Total Revenue</div>
                    </div>

                    <div className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💲</div>
                            <span className="growth-badge positive">+8.2%</span>
                        </div>
                        <div className="stat-value" style={{ color: '#10B981' }}>{formatCurrency(stats.platformCommission)}</div>
                        <div className="stat-subtext">Platform Commission (15%)</div>
                    </div>

                    <div className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💳</div>
                            <span className="growth-badge neutral">Weekly</span>
                        </div>
                        <div className="stat-value">{formatCurrency(stats.totalPayouts)}</div>
                        <div className="stat-subtext">Total Released Payouts</div>
                    </div>
                </div>

                {/* Partner Payout Settlements Table */}
                <div className="section-card" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <h3 className="section-title">💳 Partner Weekly Payout Settlements</h3>
                    </div>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Partner Name</th>
                                    <th>Contact Details</th>
                                    <th>Bank Account Info</th>
                                    <th>Completed Jobs</th>
                                    <th>Pending Earnings</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {partnerPayouts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No partner accounts found.</td>
                                    </tr>
                                ) : (
                                    partnerPayouts.map((p) => (
                                        <tr key={p._id}>
                                            <td style={{ fontWeight: '600', color: '#1F2937' }}>{p.fullName}</td>
                                            <td>
                                                <div style={{ fontSize: '0.85rem', color: '#1F2937' }}>📞 {p.phoneNumber}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{p.email}</div>
                                            </td>
                                            <td style={{ fontSize: '0.85rem' }}>
                                                {p.bankName ? (
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#1F2937' }}>{p.bankName}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>A/C: {p.accountNumber || 'N/A'} | IFSC: {p.ifscCode || 'N/A'}</div>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#EF4444', fontStyle: 'italic' }}>No Bank Info</span>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: '600', color: '#1F2937' }}>{p.completedBookings} Jobs</td>
                                            <td style={{ fontWeight: '700', color: '#10B981' }}>{formatCurrency(p.pendingAmount)}</td>
                                            <td>
                                                <button
                                                    onClick={() => { setReleasingPartner(p); setPayoutAmount(p.pendingAmount || ''); }}
                                                    style={{ padding: '6px 14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                                                >
                                                    Release Payout
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Release Payout Modal */}
                {releasingPartner && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginTop: 0, color: '#1F2937' }}>Release Payout to {releasingPartner.fullName}</h3>

                            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#475569' }}>
                                <div><strong>Bank:</strong> {releasingPartner.bankName || 'N/A'}</div>
                                <div><strong>A/C No:</strong> {releasingPartner.accountNumber || 'N/A'}</div>
                                <div><strong>IFSC:</strong> {releasingPartner.ifscCode || 'N/A'}</div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Payout Amount (₹)</label>
                                <input
                                    type="number"
                                    value={payoutAmount}
                                    onChange={(e) => setPayoutAmount(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1rem' }}
                                    placeholder="Enter amount"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>Bank Reference / Transaction ID (Optional)</label>
                                <input
                                    type="text"
                                    value={txnId}
                                    onChange={(e) => setTxnId(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem' }}
                                    placeholder="e.g. UPI/UTR123456789"
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setReleasingPartner(null)}
                                    style={{ padding: '0.6rem 1.2rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReleasePayout}
                                    disabled={submittingPayout}
                                    style={{ padding: '0.6rem 1.2rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {submittingPayout ? 'Processing...' : 'Mark as Paid'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
