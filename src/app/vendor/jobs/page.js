'use client';
import { useState, useEffect } from 'react';
import '@/app/admin/admin.css';

export default function JobReassignment() {
    const [jobs, setJobs] = useState([]);
    
    useEffect(() => {
        // Mock data
        setJobs([
            { id: 'BK-10049', category: 'AC Repair', customer: 'Rahul Sharma', currentAssignee: 'Suresh Singh', status: 'Dispatched', timeSlot: 'Today 2:00 PM' },
            { id: 'BK-10051', category: 'Plumber', customer: 'Priya Patel', currentAssignee: 'Ramesh Kumar', status: 'Confirmed', timeSlot: 'Tomorrow 10:00 AM' }
        ]);
    }, []);

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Job Re-assignment Dashboard</h1>
                <p>Manually re-route active jobs if an assigned technician becomes unavailable.</p>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Category</th>
                            <th>Customer</th>
                            <th>Current Assignee</th>
                            <th>Time Slot</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td><strong>{job.id}</strong></td>
                                <td><span className="category-badge">{job.category}</span></td>
                                <td>{job.customer}</td>
                                <td>{job.currentAssignee}</td>
                                <td>{job.timeSlot}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm" style={{background: '#f59e0b', borderColor: '#f59e0b', color: 'white'}}>
                                        Re-assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
