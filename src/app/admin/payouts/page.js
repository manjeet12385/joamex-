'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function PayoutManagement() {
    const [payouts, setPayouts] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Release payout modal/form states
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [payoutAmount, setPayoutAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/payouts');
            const data = await res.json();
            if (data.success) {
                setPayouts(data.payouts);
                setPartners(data.partnerPayouts);
            } else {
                toast.error(data.message || 'Failed to fetch payouts');
            }
        } catch (error) {
            toast.error('Network error fetching payouts data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReleasePayout = async (e) => {
        e.preventDefault();
        if (!selectedPartner || !payoutAmount) return;

        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/admin/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    partnerId: selectedPartner._id,
                    amount: Number(payoutAmount),
                    transactionId
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setSelectedPartner(null);
                setPayoutAmount('');
                setTransactionId('');
                fetchData();
            } else {
                toast.error(data.message || 'Failed to release payout');
            }
        } catch (error) {
            toast.error('Network error releasing payout');
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
                    <h1 className="page-title">Payouts & Settlement</h1>
                    <p className="page-subtitle">Process professional commissions, settlements, and track payouts history.</p>
                </div>

                {selectedPartner && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyOrigin: 'center', justifyContent: 'center' }}>
                        <div className="section-card" style={{ width: '450px', background: '#fff', border: '1px solid #cbd5e1' }}>
                            <h3 className="section-title">Release Payout to {selectedPartner.fullName}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                Bank: <strong>{selectedPartner.bankName || 'N/A'}</strong><br/>
                                A/C No: <strong>{selectedPartner.accountNumber || 'N/A'}</strong><br/>
                                IFSC: <strong>{selectedPartner.ifscCode || 'N/A'}</strong><br/>
                                Acc Name: <strong>{selectedPartner.accountHolderName || 'N/A'}</strong>
                            </p>
                            <form onSubmit={handleReleasePayout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        value={payoutAmount} 
                                        onChange={(e) => setPayoutAmount(e.target.value)} 
                                        placeholder={`Max ₹${selectedPartner.pendingAmount}`}
                                        max={selectedPartner.pendingAmount}
                                        required 
                                        style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Transaction ID (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={transactionId} 
                                        onChange={(e) => setTransactionId(e.target.value)} 
                                        placeholder="e.g. IMPS12345678"
                                        style={{ padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" disabled={isSubmitLoading} style={{ flex: 1, padding: '0.6rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                                        {isSubmitLoading ? 'Processing...' : 'Mark as Paid'}
                                    </button>
                                    <button type="button" onClick={() => setSelectedPartner(null)} style={{ flex: 1, padding: '0.6rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="section-card" style={{ marginBottom: '2rem' }}>
                    <h3 className="section-title">Pending Settlements (By Partner)</h3>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Partner Details</th>
                                    <th>Account Details</th>
                                    <th>Completed Orders</th>
                                    <th>Unpaid Balance</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="table-loader">Loading balances...</td></tr>
                                ) : partners.length === 0 ? (
                                    <tr><td colSpan="5" className="table-loader">No active partners found.</td></tr>
                                ) : (
                                    partners.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <strong>{p.fullName}</strong>
                                                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{p.phoneNumber}</div>
                                            </td>
                                            <td>
                                                {p.bankName ? (
                                                    <div style={{ fontSize: '0.85rem' }}>
                                                        {p.bankName} - {p.accountNumber.slice(-4).padStart(8, '*')}
                                                    </div>
                                                ) : <span style={{ color: '#ef4444', fontSize: '0.85rem' }}>Bank info missing</span>}
                                            </td>
                                            <td>{p.completedBookings} bookings</td>
                                            <td><strong style={{ color: p.pendingAmount > 0 ? '#b45309' : '#1e293b' }}>₹{p.pendingAmount}</strong></td>
                                            <td>
                                                <button 
                                                    disabled={p.pendingAmount <= 0}
                                                    onClick={() => { setSelectedPartner(p); setPayoutAmount(p.pendingAmount); }}
                                                    style={{ 
                                                        background: p.pendingAmount > 0 ? '#3b82f6' : '#cbd5e1', 
                                                        color: '#fff', 
                                                        border: 'none', 
                                                        padding: '0.35rem 0.75rem', 
                                                        borderRadius: '6px', 
                                                        fontWeight: 600, 
                                                        cursor: p.pendingAmount > 0 ? 'pointer' : 'not-allowed'
                                                    }}
                                                >
                                                    Settle Payout
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="section-card">
                    <h3 className="section-title">Settlement History (Past Logs)</h3>
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Partner Name</th>
                                    <th>Amount Paid</th>
                                    <th>Transaction ID</th>
                                    <th>Payment Method</th>
                                    <th>Date Paid</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="table-loader">Loading audit trail...</td></tr>
                                ) : payouts.length === 0 ? (
                                    <tr><td colSpan="6" className="table-loader">No payout transactions recorded yet.</td></tr>
                                ) : (
                                    payouts.map(p => (
                                        <tr key={p._id}>
                                            <td><strong>{p.partnerName}</strong></td>
                                            <td><strong>₹{p.amount}</strong></td>
                                            <td><code>{p.transactionId}</code></td>
                                            <td>{p.paymentMethod}</td>
                                            <td>{new Date(p.paidAt).toLocaleDateString()}</td>
                                            <td><span className="status-badge status-verified">Paid</span></td>
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
