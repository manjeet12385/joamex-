'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';
import './locations.css'; // Let's write this CSS file next for premium layout

export default function LocationManagement() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form states
    const [name, setName] = useState('');
    const [type, setType] = useState('City');
    const [parent, setParent] = useState('');
    const [pincode, setPincode] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/locations');
            const data = await res.json();
            if (data.success) {
                setLocations(data.locations);
            } else {
                toast.error(data.message || 'Failed to fetch locations');
            }
        } catch (error) {
            toast.error('Network error fetching locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/admin/locations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type, parent: parent || null, pincode })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                setName('');
                setParent('');
                setPincode('');
                fetchLocations();
            } else {
                toast.error(data.message || 'Failed to create location');
            }
        } catch (error) {
            toast.error('Network error creating location');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch('/api/admin/locations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Availability toggled successfully');
                fetchLocations();
            } else {
                toast.error(data.message || 'Failed to update location');
            }
        } catch (error) {
            toast.error('Network error updating location');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this location?')) return;
        try {
            const res = await fetch(`/api/admin/locations?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Location deleted successfully');
                fetchLocations();
            } else {
                toast.error(data.message || 'Failed to delete location');
            }
        } catch (error) {
            toast.error('Network error deleting location');
        }
    };

    const parentOptions = locations.filter(loc => 
        (type === 'Zone' && loc.type === 'City') ||
        (type === 'Locality' && loc.type === 'Zone') ||
        (type === 'Pincode' && loc.type === 'Locality')
    );

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Location Management</h1>
                        <p className="page-subtitle">Configure Cities, Zones, Localities, PIN codes, and service availability.</p>
                    </div>
                </div>

                <div className="location-grid">
                    {/* Location Form */}
                    <div className="section-card location-form-card">
                        <h3 className="section-title">Add Service Area</h3>
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <label>Area Type</label>
                                <select value={type} onChange={(e) => { setType(e.target.value); setParent(''); }} className="form-select">
                                    <option value="City">City</option>
                                    <option value="Zone">Zone</option>
                                    <option value="Locality">Locality</option>
                                    <option value="Pincode">Pincode</option>
                                </select>
                            </div>

                            {type !== 'City' && (
                                <div className="form-group">
                                    <label>Parent Location (Select {type === 'Zone' ? 'City' : type === 'Locality' ? 'Zone' : 'Locality'})</label>
                                    <select value={parent} onChange={(e) => setParent(e.target.value)} required className="form-select">
                                        <option value="">-- Select Parent Area --</option>
                                        {parentOptions.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Area Name</label>
                                <input type="text" placeholder="e.g. South Delhi, Indiranagar, etc." value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
                            </div>

                            {type === 'Pincode' && (
                                <div className="form-group">
                                    <label>PIN Code</label>
                                    <input type="text" placeholder="e.g. 110001" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="form-input" />
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitLoading} className="premium-btn">
                                {isSubmitLoading ? 'Saving...' : 'Add Location Area'}
                            </button>
                        </form>
                    </div>

                    {/* Locations List */}
                    <div className="section-card location-list-card">
                        <h3 className="section-title">Active Jurisdictions & Coverage</h3>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Parent Location</th>
                                        <th>Pincode</th>
                                        <th>Availability</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="table-loader">Loading coverage map...</td></tr>
                                    ) : locations.length === 0 ? (
                                        <tr><td colSpan="6" className="table-loader">No service locations configured yet.</td></tr>
                                    ) : (
                                        locations.map(loc => (
                                            <tr key={loc._id}>
                                                <td><strong>{loc.name}</strong></td>
                                                <td><span className={`type-badge badge-${loc.type.toLowerCase()}`}>{loc.type}</span></td>
                                                <td>{loc.parent ? `${loc.parent.name} (${loc.parent.type})` : '—'}</td>
                                                <td>{loc.pincode || '—'}</td>
                                                <td>
                                                    <label className="toggle-switch">
                                                        <input type="checkbox" checked={loc.isActive} onChange={() => handleToggleStatus(loc._id, loc.isActive)} />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDelete(loc._id)} className="btn-sm btn-delete">Remove</button>
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
