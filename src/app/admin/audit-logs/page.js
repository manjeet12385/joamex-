'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function AuditLogsViewer() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/audit-logs');
            const data = await res.json();
            if (data.success) {
                setLogs(data.logs);
            } else {
                toast.error(data.message || 'Failed to fetch audit logs');
            }
        } catch (error) {
            toast.error('Network error fetching audit logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.adminUser?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="page-title">Audit Logs</h1>
                        <p className="page-subtitle">Track administrative activities, security logs, and record modifications in real-time.</p>
                    </div>
                </div>

                <div className="section-card" style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>System Event Log Trail</h3>
                        <input 
                            type="text" 
                            placeholder="Search logs by user, action, details..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                padding: '0.6rem 1rem', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '8px', 
                                width: '300px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div className="table-container">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Admin Operator</th>
                                    <th>Action Category</th>
                                    <th>Activity Details</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="table-loader">Loading audit trail...</td></tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr><td colSpan="5" className="table-loader">No matching audit events logged.</td></tr>
                                ) : (
                                    filteredLogs.map(log => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                <strong>{log.adminUser}</strong>
                                            </td>
                                            <td>
                                                <span className="status-badge status-pending" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.85rem', color: '#334155' }}>{log.details}</span>
                                            </td>
                                            <td>
                                                <code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {log.ipAddress || '127.0.0.1'}
                                                </code>
                                            </td>
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
