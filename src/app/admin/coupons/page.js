'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';
import '../locations/locations.css'; // sharing form/input/toggle styles

export default function CouponManagement() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form states
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('Percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [minPurchase, setMinPurchase] = useState('');
    const [maxDiscount, setMaxDiscount] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons);
            } else {
                toast.error(data.message || 'Failed to fetch coupons');
            }
        } catch (error) {
            toast.error('Network error fetching coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    discountType,
                    discountValue,
                    minPurchase,
                    maxDiscount,
                    endDate,
                    usageLimit
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setCode('');
                setDiscountValue('');
                setMinPurchase('');
                setMaxDiscount('');
                setEndDate('');
                setUsageLimit('');
                fetchCoupons();
            } else {
                toast.error(data.message || 'Failed to create coupon');
            }
        } catch (error) {
            toast.error('Network error creating coupon');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Coupon status updated');
                fetchCoupons();
            } else {
                toast.error(data.message || 'Failed to toggle status');
            }
        } catch (error) {
            toast.error('Network error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this promo code?')) return;
        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Coupon deleted successfully');
                fetchCoupons();
            } else {
                toast.error(data.message || 'Failed to delete coupon');
            }
        } catch (error) {
            toast.error('Network error deleting coupon');
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header">
                    <h1 className="page-title">Offers & Coupons</h1>
                    <p className="page-subtitle">Configure discount codes, validity limits, eligibility filters, and track customer usage.</p>
                </div>

                <div className="location-grid">
                    {/* Coupon creation form */}
                    <div className="section-card">
                        <h3 className="section-title">Generate Discount Code</h3>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <label>Promo Code</label>
                                <input type="text" placeholder="e.g. WELCOME50" value={code} onChange={(e) => setCode(e.target.value)} required className="form-input" style={{ textTransform: 'uppercase' }} />
                            </div>

                            <div className="form-group">
                                <label>Discount Type</label>
                                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="form-select">
                                    <option value="Percentage">Percentage (%)</option>
                                    <option value="Flat">Flat Price (₹)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Discount Value ({discountType === 'Percentage' ? '%' : '₹'})</label>
                                <input type="number" placeholder="Value" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required className="form-input" min="1" />
                            </div>

                            <div className="form-group">
                                <label>Minimum Purchase Requirement (₹)</label>
                                <input type="number" placeholder="Min transaction amount" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value)} className="form-input" min="0" />
                            </div>

                            {discountType === 'Percentage' && (
                                <div className="form-group">
                                    <label>Max Allowed Discount Amount (₹)</label>
                                    <input type="number" placeholder="Max discount cap (0 for no limit)" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} className="form-input" min="0" />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Usage Limit (Per Coupon)</label>
                                <input type="number" placeholder="e.g. 100 uses total (empty for unlimited)" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="form-input" min="1" />
                            </div>

                            <div className="form-group">
                                <label>Valid Until Date</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="form-input" />
                            </div>

                            <button type="submit" disabled={isSubmitLoading} className="premium-btn">
                                {isSubmitLoading ? 'Saving...' : 'Generate Coupon'}
                            </button>
                        </form>
                    </div>

                    {/* Coupons list */}
                    <div className="section-card">
                        <h3 className="section-title">Active Campaign Coupons</h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Discount Details</th>
                                        <th>Valid Till</th>
                                        <th>Redemptions</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="table-loader">Loading coupons...</td></tr>
                                    ) : coupons.length === 0 ? (
                                        <tr><td colSpan="6" className="table-loader">No active coupons configured yet.</td></tr>
                                    ) : (
                                        coupons.map(c => (
                                            <tr key={c._id}>
                                                <td><span style={{ fontSize: '1rem', fontFamily: 'monospace', fontWeight: 'bold', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', border: '1px dashed #cbd5e1' }}>{c.code}</span></td>
                                                <td>
                                                    <strong>{c.discountValue}{c.discountType === 'Percentage' ? '%' : ' ₹'} Off</strong>
                                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                                        Min order: ₹{c.minPurchase}
                                                        {c.maxDiscount > 0 && ` | Cap: ₹${c.maxDiscount}`}
                                                    </div>
                                                </td>
                                                <td>{new Date(c.endDate).toLocaleDateString()}</td>
                                                <td>
                                                    {c.usedCount}
                                                    {c.usageLimit ? ` / ${c.usageLimit}` : ' used'}
                                                </td>
                                                <td>
                                                    <label className="toggle-switch">
                                                        <input type="checkbox" checked={c.isActive} onChange={() => handleToggleStatus(c._id, c.isActive)} />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDelete(c._id)} className="btn-sm btn-delete">Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
