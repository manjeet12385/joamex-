'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { partnersData } from '@/lib/admin-data';
import '../admin.css';

export default function PartnersPage() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Partners');
    const [selectedPartnerDocs, setSelectedPartnerDocs] = useState(null);

    const [categoryRequests, setCategoryRequests] = useState([]);

    useEffect(() => {
        fetchPartners();
        fetchCategoryRequests();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch('/api/admin/partners');
            const data = await res.json();
            if (data.success) {
                setPartners(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryRequests = async () => {
        try {
            const res = await fetch('/api/admin/category-requests');
            const data = await res.json();
            if (data.success) {
                setCategoryRequests(data.requests || []);
            }
        } catch (err) {
            console.error('Failed to fetch category requests:', err);
        }
    };

    const handleCategoryRequestAction = async (requestId, action) => {
        const confirmText = action === 'accept' ? 'Accept and add this category to partner?' : 'Reject this category request?';
        if (!confirm(confirmText)) return;

        try {
            const res = await fetch('/api/admin/category-requests', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, action })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || 'Action completed successfully!');
                fetchCategoryRequests();
                fetchPartners();
            } else {
                alert(data.message || 'Action failed');
            }
        } catch (err) {
            console.error('Action error:', err);
            alert('Network error');
        }
    };

    const handleStatusChange = async (id, action) => {
        // action: 'approve' or 'reject'
        try {
            const res = await fetch('/api/admin/partners/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partnerId: id, action })
            });
            const data = await res.json();

            if (data.success) {
                // Update local state
                const newStatus = action === 'approve' ? 'Verified' : 'Rejected';
                setPartners(partners.map(p => p._id === id ? { ...p, status: newStatus } : p));
                // Show feedback (assuming toast is imported or use alerts for now if toast not present in this file)
                // The user code didn't have toast imported in the snippet I saw, let's assume I need to add it or use console.
                // I will add ToastContainer to the return block.
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filteredPartners = activeTab === 'All Partners'
        ? partners
        : partners.filter(p => {
            if (activeTab === 'Verified') return p.status === 'Verified' || p.status === 'Active'; // Handle both
            return p.status === activeTab;
        });

    return (
        <div className="dashboard-container">
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Partner Management</h1>
                        <p className="page-subtitle">Manage and verify service professionals</p>
                    </div>
                    <button className="btn-add">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Partner
                    </button>
                </div>

                {/* Stats Row */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">Total Partners</div>
                        <div className="stat-value">{partners.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Pending Verification</div>
                        <div className="stat-value" style={{ color: '#F59E0B' }}>
                            {partners.filter(p => p.status === 'Pending').length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Verified Partners</div>
                        <div className="stat-value" style={{ color: '#10B981' }}>
                            {partners.filter(p => p.status === 'Verified').length}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">Rejected</div>
                        <div className="stat-value" style={{ color: '#EF4444' }}>
                            {partners.filter(p => p.status === 'Rejected').length}
                        </div>
                    </div>
                </div>

                {/* Tabs & Table */}
                <div className="section-card">
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div className="tabs-container" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {['All Partners', 'Pending', 'Verified', 'Rejected', 'Category Requests'].map(tab => (
                                <div
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab} {tab === 'Category Requests' && categoryRequests.filter(r => r.status === 'Pending').length > 0 && (
                                        <span style={{ marginLeft: '6px', background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem' }}>
                                            {categoryRequests.filter(r => r.status === 'Pending').length}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'Category Requests' ? (
                        <div className="table-container" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                            <table className="custom-table" style={{ minWidth: '720px' }}>
                                <thead>
                                    <tr>
                                        <th>Partner Name</th>
                                        <th>Requested Category</th>
                                        <th>Contact Details</th>
                                        <th>Requested Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryRequests.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No category requests submitted yet.</td></tr>
                                    ) : (
                                        categoryRequests.map((req) => (
                                            <tr key={req._id}>
                                                <td>
                                                    <div style={{ fontWeight: 600, color: '#1F2937' }}>{req.partnerName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>ID: #{req.partnerId?.substring(req.partnerId.length - 6).toUpperCase()}</div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: '6px' }}>
                                                        {req.categoryName}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.85rem' }}>{req.partnerPhone || 'N/A'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{req.partnerEmail || ''}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                                                        {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td>
                                                    {req.status === 'Pending' && <span className="status-badge pending">⏳ Pending</span>}
                                                    {req.status === 'Approved' && <span className="status-badge active">✅ Approved</span>}
                                                    {req.status === 'Rejected' && <span className="status-badge rejected">❌ Rejected</span>}
                                                </td>
                                                <td>
                                                    {req.status === 'Pending' ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                onClick={() => handleCategoryRequestAction(req._id, 'accept')}
                                                                style={{ padding: '6px 14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleCategoryRequestAction(req._id, 'reject')}
                                                                style={{ padding: '6px 14px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Action Completed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="table-container" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
                        <table className="custom-table" style={{ minWidth: '720px' }}>
                            <thead>
                                <tr>
                                    <th>Profile</th>
                                    <th>Category</th>
                                    <th>Phone / Email</th>
                                    <th>Status</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading partners...</td></tr>
                                ) : filteredPartners.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No partners found.</td></tr>
                                ) : (
                                    filteredPartners.map((partner) => (
                                        <tr key={partner._id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-img">{partner.fullName?.charAt(0) || 'P'}</div>
                                                    <div style={{ fontWeight: '600', color: '#1F2937' }}>{partner.fullName || 'Partner'}</div>
                                                </div>
                                            </td>
                                            <td><span style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>{partner.serviceCategory}</span></td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1F2937' }}>📞 {partner.phoneNumber || 'N/A'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{partner.email}</div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${partner.status?.toLowerCase()}`}>● {partner.status}</span>
                                            </td>
                                            <td style={{ color: '#4B5563', fontSize: '0.85rem' }}>{new Date(partner.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-btns">
                                                    <button
                                                        className="btn-sm"
                                                        onClick={() => setSelectedPartnerDocs(partner)}
                                                        title="View Documents"
                                                        style={{ background: '#374151', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                    >
                                                        Docs
                                                    </button>
                                                    {(partner.status === 'Pending' || partner.status === 'Rejected') && (
                                                        <button
                                                            className="btn-sm btn-approve"
                                                            onClick={() => handleStatusChange(partner._id, 'approve')}
                                                            title="Approve"
                                                        >
                                                            ✓
                                                        </button>
                                                    )}
                                                    {(partner.status === 'Pending' || partner.status === 'Verified' || partner.status === 'Active') && (
                                                        <button
                                                            className="btn-sm btn-reject"
                                                            onClick={() => handleStatusChange(partner._id, 'reject')}
                                                            title="Reject"
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                    )}
                    <div style={{ padding: '1rem', borderTop: '1px solid #1F2937', color: '#9CA3AF', fontSize: '0.85rem' }}>
                        Showing {filteredPartners.length} partners
                    </div>
                </div>

                {/* Helper Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                    <div className="section-card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 className="section-title">Verification Requests</h3>
                            <a href="#" className="view-all">View All</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', background: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📄</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>Background Check</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>14 pending reviews</div>
                                </div>
                                <div style={{ width: '60px', height: '4px', background: '#374151', borderRadius: '2px' }}><div style={{ width: '40%', height: '100%', background: '#2563EB' }}></div></div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', background: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🆔</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500' }}>ID Verification</div>
                                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>8 pending reviews</div>
                                </div>
                                <div style={{ width: '60px', height: '4px', background: '#374151', borderRadius: '2px' }}><div style={{ width: '20%', height: '100%', background: '#2563EB' }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#2563EB', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Partner Onboarding Help</h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: '1.5' }}>Need assistance with verifying a specific partner or understanding compliance rules?</p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button style={{ background: 'white', color: '#2563EB', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Read Guidelines</button>
                            <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Contact Support</button>
                        </div>
                    </div>
                </div>

                {/* Document Viewer Modal */}
                {selectedPartnerDocs && (
                    <div className="modal-overlay" onClick={() => setSelectedPartnerDocs(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#111827', padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #1F2937' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div>
                                    <h2 style={{ color: 'white', margin: 0 }}>Partner Documents</h2>
                                    <p style={{ color: '#9CA3AF', margin: '5px 0 0' }}>Verifying {selectedPartnerDocs.fullName}</p>
                                </div>
                                <button onClick={() => setSelectedPartnerDocs(null)} style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '10px', fontSize: '0.9rem' }}>ID Card (Front)</label>
                                    <div style={{ background: '#1F2937', borderRadius: '12px', overflow: 'hidden', height: '240px' }}>
                                        {selectedPartnerDocs.idCardFront ? <img src={selectedPartnerDocs.idCardFront} alt="ID Front" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4B5563' }}>No image</div>}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '10px', fontSize: '0.9rem' }}>ID Card (Back)</label>
                                    <div style={{ background: '#1F2937', borderRadius: '12px', overflow: 'hidden', height: '240px' }}>
                                        {selectedPartnerDocs.idCardBack ? <img src={selectedPartnerDocs.idCardBack} alt="ID Back" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4B5563' }}>No image</div>}
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', color: '#9CA3AF', marginBottom: '10px', fontSize: '0.9rem' }}>Professional Certification</label>
                                    <div style={{ background: '#1F2937', borderRadius: '12px', overflow: 'hidden', height: '300px' }}>
                                        {selectedPartnerDocs.professionalLicense ? <img src={selectedPartnerDocs.professionalLicense} alt="License" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#4B5563' }}>No image</div>}
                                    </div>
                                </div>

                                {/* Bank Payout Details */}
                                <div style={{ gridColumn: 'span 2', background: '#1F2937', padding: '1.25rem', borderRadius: '12px', marginTop: '10px', border: '1px solid #374151' }}>
                                    <h3 style={{ color: '#F3F4F6', fontSize: '1rem', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        💳 Bank Payout Details
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                                        <div>
                                            <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.75rem' }}>Account Holder Name</span>
                                            <span style={{ color: 'white', fontWeight: '600' }}>{selectedPartnerDocs.accountHolderName || 'Not Provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.75rem' }}>Bank Name</span>
                                            <span style={{ color: 'white', fontWeight: '600' }}>{selectedPartnerDocs.bankName || 'Not Provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.75rem' }}>Account Number</span>
                                            <span style={{ color: 'white', fontWeight: '600' }}>{selectedPartnerDocs.accountNumber || 'Not Provided'}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#9CA3AF', display: 'block', fontSize: '0.75rem' }}>IFSC / SWIFT Code</span>
                                            <span style={{ color: 'white', fontWeight: '600' }}>{selectedPartnerDocs.ifscCode || 'Not Provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                                {(selectedPartnerDocs.status === 'Pending' || selectedPartnerDocs.status === 'Rejected') && (
                                    <button
                                        onClick={() => { handleStatusChange(selectedPartnerDocs._id, 'approve'); setSelectedPartnerDocs(null); }}
                                        style={{ flex: 1, padding: '12px', background: '#10B981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Approve Partner
                                    </button>
                                )}
                                {(selectedPartnerDocs.status === 'Pending' || selectedPartnerDocs.status === 'Verified' || selectedPartnerDocs.status === 'Active') && (
                                    <button
                                        onClick={() => { handleStatusChange(selectedPartnerDocs._id, 'reject'); setSelectedPartnerDocs(null); }}
                                        style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                                    >
                                        Reject Partner
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
