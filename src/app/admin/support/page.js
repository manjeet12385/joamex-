'use client';
import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../admin.css';

export default function SupportManagement() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const fetchTickets = async (selectId = null) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/support');
            const data = await res.json();
            if (data.success) {
                setTickets(data.tickets);
                if (selectId) {
                    const updated = data.tickets.find(t => t._id === selectId);
                    setSelectedTicket(updated || null);
                } else if (data.tickets.length > 0 && !selectedTicket) {
                    setSelectedTicket(data.tickets[0]);
                }
            } else {
                toast.error(data.message || 'Failed to fetch tickets');
            }
        } catch (error) {
            toast.error('Network error fetching support tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!selectedTicket || !replyMessage.trim()) return;

        setIsSubmitLoading(true);
        try {
            const res = await fetch('/api/admin/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: selectedTicket.ticketId,
                    message: replyMessage
                })
            });
            const data = await res.json();
            if (data.success) {
                setReplyMessage('');
                toast.success('Reply submitted successfully');
                fetchTickets(selectedTicket._id);
            } else {
                toast.error(data.message || 'Failed to send reply');
            }
        } catch (error) {
            toast.error('Network error sending reply');
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedTicket) return;
        try {
            const res = await fetch('/api/admin/support', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedTicket._id,
                    status
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Ticket marked as ${status}`);
                fetchTickets(selectedTicket._id);
            } else {
                toast.error(data.message || 'Failed to update status');
            }
        } catch (error) {
            toast.error('Network error updating status');
        }
    };

    return (
        <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <ToastContainer position="bottom-right" theme="dark" />
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <main className="main-content">
                <AdminHeader />
                
                <div className="page-header">
                    <h1 className="page-title">Customer Support</h1>
                    <p className="page-subtitle">Moderate customer complaints, tickets, refunds, and resolution logs.</p>
                </div>

                <div className="support-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', height: 'calc(100vh - 220px)', marginTop: '1.5rem' }}>
                    
                    {/* Tickets Sidebar */}
                    <div className="section-card" style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Tickets</h4>
                        {loading && tickets.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '2rem 0' }}>Loading tickets...</div>
                        ) : tickets.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', padding: '2rem 0' }}>No tickets found</div>
                        ) : (
                            tickets.map(t => (
                                <div 
                                    key={t._id} 
                                    onClick={() => setSelectedTicket(t)}
                                    style={{ 
                                        padding: '0.85rem', 
                                        borderRadius: '8px', 
                                        background: selectedTicket?._id === t._id ? '#eff6ff' : '#f8fafc',
                                        border: selectedTicket?._id === t._id ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>{t.ticketId}</span>
                                        <span style={{ 
                                            fontSize: '0.7rem', 
                                            fontWeight: 700, 
                                            color: t.status === 'Open' ? '#ef4444' : t.status === 'In Progress' ? '#f59e0b' : '#10b981',
                                            textTransform: 'uppercase' 
                                        }}>{t.status}</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>By: {t.userName}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Ticket Chat dialogue */}
                    {selectedTicket ? (
                        <div className="section-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Header details */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{selectedTicket.subject}</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
                                        From: <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail} | {selectedTicket.userPhone})<br/>
                                        Priority: <strong style={{ color: selectedTicket.priority === 'Critical' || selectedTicket.priority === 'High' ? '#ef4444' : '#1e293b' }}>{selectedTicket.priority}</strong>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {selectedTicket.status !== 'Resolved' && (
                                        <button onClick={() => handleUpdateStatus('Resolved')} style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Mark Resolved</button>
                                    )}
                                    {selectedTicket.status !== 'Closed' && (
                                        <button onClick={() => handleUpdateStatus('Closed')} style={{ padding: '0.5rem 1rem', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Close Ticket</button>
                                    )}
                                </div>
                            </div>

                            {/* Chat messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#fff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', alignSelf: 'flex-start', maxWidth: '80%' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>{selectedTicket.userName} (Customer)</div>
                                    <div style={{ fontSize: '0.9rem', color: '#1e293b' }}>{selectedTicket.message}</div>
                                </div>

                                {selectedTicket.messages.map((msg, index) => (
                                    <div 
                                        key={index} 
                                        style={{ 
                                            background: msg.sender === 'Admin' ? '#eff6ff' : '#fff', 
                                            padding: '0.85rem', 
                                            borderRadius: '8px', 
                                            border: msg.sender === 'Admin' ? '1px solid #bfdbfe' : '1px solid #e2e8f0', 
                                            alignSelf: msg.sender === 'Admin' ? 'flex-end' : 'flex-start', 
                                            maxWidth: '80%' 
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', fontSize: '0.75rem', fontWeight: 700, color: msg.sender === 'Admin' ? '#1d4ed8' : '#64748b', marginBottom: '0.25rem' }}>
                                            <span>{msg.sender === 'Admin' ? 'Admin Agent' : selectedTicket.userName}</span>
                                            <span style={{ fontWeight: 400, color: '#94a3b8' }}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#1e293b' }}>{msg.message}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            {selectedTicket.status !== 'Closed' ? (
                                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '1rem' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Type your response here..." 
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        required
                                        style={{ flex: 1, padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                                    />
                                    <button type="submit" disabled={isSubmitLoading} style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                                        {isSubmitLoading ? 'Sending...' : 'Send Reply'}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', background: '#e2e8f0', padding: '0.75rem', borderRadius: '8px' }}>
                                    This ticket is closed. Re-open by updating status to "Open" or "In Progress" to reply.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="section-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                            Select a ticket from the list to view dialogue history.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
