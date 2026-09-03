'use client';
import { useState, useEffect } from 'react';
import '@/app/admin/admin.css';

export default function StaffManagement() {
    const [staff, setStaff] = useState([]);
    
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('/api/vendor/staff');
                const data = await res.json();
                if (data.success) {
                    setStaff(data.staff);
                }
            } catch (err) {
                console.error("Failed to fetch staff:", err);
            }
        };
        fetchStaff();
    }, []);

    return (
        <div className="admin-page">
            <div className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h1>Staff & Fleet Management</h1>
                    <p>Onboard and manage your agency technicians.</p>
                </div>
                <button className="btn btn-primary">+ Add Technician</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Technician Name</th>
                            <th>Category</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Jobs Completed</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(member => (
                            <tr key={member._id}>
                                <td><strong>{member.fullName || member.name}</strong></td>
                                <td><span className="category-badge">{member.serviceCategory || member.category}</span></td>
                                <td>{member.phoneNumber || member.phone}</td>
                                <td>
                                    <span className="status-badge" style={{
                                        background: member.isOnline ? '#dcfce7' : '#f1f5f9',
                                        color: member.isOnline ? '#166534' : '#475569'
                                    }}>
                                        {member.isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </td>
                                <td>{member.jobsCompleted || 0}</td>
                                <td>
                                    <button className="btn btn-outline btn-sm">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
