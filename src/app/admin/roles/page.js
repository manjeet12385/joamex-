'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';
import '../locations/locations.css';

export default function RolesManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('support');
    const [selectedScopes, setSelectedScopes] = useState([]);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    // Standard scoping checkboxes
    const availableScopes = [
        { key: 'dashboard', label: 'Dashboard Overview' },
        { key: 'users', label: 'User Management' },
        { key: 'partners', label: 'Partner Onboarding' },
        { key: 'bookings', label: 'Order bookings & assignments' },
        { key: 'services', label: 'Service Catalog & Rates' },
        { key: 'financials', label: 'Finance & Payments' },
        { key: 'locations', label: 'Locations configuration' },
        { key: 'coupons', label: 'Offers & Promo Coupons' },
        { key: 'support', label: 'Customer Help Desk' },
        { key: 'content', label: 'Website static content & FAQs' },
        { key: 'settings', label: 'Global Configurations' }
    ];

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/roles');
            const data = await res.json();
            if (data.success) {
                setAdmins(data.admins);
            } else {
                toast.error(data.message || 'Failed to fetch sub-admins');
            }
        } catch (error) {
            toast.error('Network error fetching roles list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCheckboxChange = (scopeKey) => {
        if (selectedScopes.includes(scopeKey)) {
            setSelectedScopes(selectedScopes.filter(s => s !== scopeKey));
        } else {
            setSelectedScopes([...selectedScopes, scopeKey]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/admin/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    role,
                    scopes: selectedScopes
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setFullName('');
                setEmail('');
                setPhone('');
                setRole('support');
                setSelectedScopes([]);
                fetchAdmins();
            } else {
                toast.error(data.message || 'Failed to create sub-admin');
            }
        } catch (error) {
            toast.error('Network error creating sub-admin');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this admin account?')) return;
        try {
            const res = await fetch(`/api/admin/roles?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Admin account removed successfully');
                fetchAdmins();
            } else {
                toast.error(data.message || 'Failed to delete admin');
            }
        } catch (error) {
            toast.error('Network error deleting admin');
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header">
                    <h1 className="page-title">Roles & Permissions</h1>
                    <p className="page-subtitle">Configure permissions for Super Admins, Operations, Support, Finance, and Content Managers.</p>
                </div>

                <div className="location-grid" style={{ marginTop: '1.5rem' }}>
                    {/* Add Sub-Admin */}
                    <div className="section-card">
                        <h3 className="section-title">Onboard Sub-Admin</h3>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <label>Full Legal Name</label>
                                <input type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" placeholder="agent@joamex.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
                            </div>

                            <div className="form-group">
                                <label>Designation Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                                    <option value="superadmin">Super Admin</option>
                                    <option value="operations">Operations Team</option>
                                    <option value="support">Customer Support Agent</option>
                                    <option value="finance">Finance controller</option>
                                    <option value="content">Content Manager</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Permitted Authorization Scopes</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                    {availableScopes.map(s => (
                                        <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={selectedScopes.includes(s.key)} onChange={() => handleCheckboxChange(s.key)} />
                                            {s.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={isSubmitLoading} className="premium-btn">
                                {isSubmitLoading ? 'Saving Account...' : 'Generate Admin Role'}
                            </button>
                        </form>
                    </div>

                    {/* List Admins */}
                    <div className="section-card">
                        <h3 className="section-title">Active Management Staff</h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Administrative Member</th>
                                        <th>Designated Role</th>
                                        <th>Active Scopes</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="table-loader">Loading administrators...</td></tr>
                                    ) : admins.length === 0 ? (
                                        <tr><td colSpan="4" className="table-loader">No administrators configured in database.</td></tr>
                                    ) : (
                                        admins.map(a => (
                                            <tr key={a._id}>
                                                <td>
                                                    <strong>{a.fullName}</strong>
                                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{a.email}</div>
                                                </td>
                                                <td>
                                                    <span className={`type-badge badge-${a.role === 'superadmin' ? 'city' : a.role === 'operations' ? 'zone' : a.role === 'finance' ? 'pincode' : 'locality'}`}>
                                                        {a.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '300px' }}>
                                                        {a.scopes && a.scopes.length > 0 ? (
                                                            a.scopes.map(s => (
                                                                <span key={s} style={{ fontSize: '0.7rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', textTransform: 'capitalize' }}>
                                                                    {s}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No specific scopes</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDelete(a._id)} className="btn-sm btn-delete">Remove</button>
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
