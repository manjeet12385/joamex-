'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for Add/Edit
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [icon, setIcon] = useState('🛠️');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [submitting, setSubmitting] = useState(false);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/services');
            const data = await res.json();
            if (data.success) {
                setServices(data.categories || []);
            }
        } catch (err) {
            console.error('Failed to load services:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setName(service.name || '');
            setPrice(service.price || '');
            setIcon(service.icon || '🛠️');
            setDescription(service.description || '');
            setStatus(service.status || 'Active');
        } else {
            setEditingService(null);
            setName('');
            setPrice('');
            setIcon('🛠️');
            setDescription('');
            setStatus('Active');
        }
        setShowModal(true);
    };

    const handleSaveService = async () => {
        if (!name || !price) {
            toast.error('Service Name and Base Price are required');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingService?._id,
                    name,
                    price,
                    icon,
                    description,
                    status
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                fetchServices();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to save service');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dashboard-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <AdminSidebar />
            <main className="main-content">
                <AdminHeader />

                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Services & Rate Cards</h1>
                        <p className="page-subtitle">Manage service categories, base pricing, and rate cards</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{ padding: '0.6rem 1.2rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        + Add New Service
                    </button>
                </div>

                {/* Services Grid */}
                <div className="section-card">
                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Icon & Service</th>
                                    <th>Base Rate (₹)</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>Loading services...</td></tr>
                                ) : services.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>No service categories created yet.</td></tr>
                                ) : (
                                    services.map((s) => (
                                        <tr key={s._id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ fontSize: '1.5rem' }}>{s.icon || '🛠️'}</span>
                                                    <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '1rem' }}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '700', color: '#10B981', fontSize: '1.05rem' }}>₹{s.price}</td>
                                            <td style={{ color: '#6B7280', fontSize: '0.85rem' }}>{s.description || 'Standard service rate'}</td>
                                            <td>
                                                <span className={`status-badge status-${s.status?.toLowerCase() === 'active' ? 'active' : 'rejected'}`}>
                                                    ● {s.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleOpenModal(s)}
                                                    style={{ padding: '4px 12px', background: '#374151', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    Edit Rate
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add / Edit Modal */}
                {showModal && (
                    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '450px' }}>
                            <h3 style={{ marginTop: 0, color: '#1F2937' }}>{editingService ? 'Edit Service & Rate' : 'Add New Service'}</h3>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Service Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem' }}
                                    placeholder="e.g. Plumbing Service"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '1.2rem', textAlign: 'center' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Base Rate (₹)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem' }}
                                        placeholder="299"
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                                    placeholder="Short summary of what this service covers..."
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.4rem' }}>Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{ padding: '0.6rem 1.2rem', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveService}
                                    disabled={submitting}
                                    style={{ padding: '0.6rem 1.2rem', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    {submitting ? 'Saving...' : 'Save Service'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
