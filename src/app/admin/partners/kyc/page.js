'use client';
import { useState, useEffect } from 'react';
import '@/app/admin/admin.css';

export default function KYCApprovals() {
    const [pendingPartners, setPendingPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingPartners();
    }, []);

    const fetchPendingPartners = async () => {
        try {
            const res = await fetch('/api/admin/partners/pending');
            const data = await res.json();
            if (data.success) {
                setPendingPartners(data.partners);
            } else {
                setError(data.message);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        if (!confirm(`Are you sure you want to ${status} this partner?`)) return;
        
        try {
            const res = await fetch(`/api/admin/partners/${id}`, { 
                method: 'PUT', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }) 
            });
            const data = await res.json();
            
            if (data.success) {
                alert(`Partner ${status} successfully!`);
                setPendingPartners(prev => prev.filter(p => p._id !== id));
            } else {
                alert("Error updating status: " + data.message);
            }
        } catch (err) {
            alert("Error updating status: " + err.message);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>KYC Verification Pipeline</h1>
                <p>Review and verify government IDs and trade certificates of new partners.</p>
            </div>

            {loading ? (
                <div className="loading-state">Loading pending verifications...</div>
            ) : error ? (
                <div className="error-state">{error}</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Partner Details</th>
                                <th>Category</th>
                                <th>Documents</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPartners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No pending KYC approvals</td>
                                </tr>
                            ) : (
                                pendingPartners.map(partner => (
                                    <tr key={partner._id}>
                                        <td>
                                            <div className="user-details">
                                                <strong>{partner.fullName}</strong>
                                                <span>{partner.email}</span>
                                                <span>{partner.phoneNumber}</span>
                                            </div>
                                        </td>
                                        <td><span className="category-badge">{partner.serviceCategory}</span></td>
                                        <td>
                                            <button className="btn btn-outline btn-sm">View Aadhar Card</button>
                                            <br/><br/>
                                            <button className="btn btn-outline btn-sm">View Trade License</button>
                                        </td>
                                        <td><span className="status-badge status-pending">Pending Review</span></td>
                                        <td>
                                            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                                                <button onClick={() => handleApproval(partner._id, 'Verified')} className="btn btn-primary btn-sm" style={{background: '#10b981', borderColor: '#10b981'}}>Approve KYC</button>
                                                <button onClick={() => handleApproval(partner._id, 'Rejected')} className="btn btn-danger btn-sm">Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
