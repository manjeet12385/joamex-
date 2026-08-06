"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import "../admin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    activeUsers: 0,
    partners: 0,
    activePartners: 0,
    bookings: 0,
  });

  const [approvalQueue, setApprovalQueue] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Sidebar State
  const router = useRouter();

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      router.push("/admin/login");
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([
        fetchPendingPartners(),
        fetchStats(),
        fetchActivity(),
      ]);
      setLoading(false);
    };
    loadDashboard();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats({
          revenue: data.stats.revenue,
          activeUsers: data.stats.totalUsers,
          partners: data.stats.totalPartners,
          activePartners: data.stats.verifiedPartners,
          bookings: data.stats.bookings,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();
      if (data.success) {
        setActivityFeed(data.activities);
      }
    } catch (error) {
      console.error("Failed to fetch activity");
    }
  };

  const fetchPendingPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners/pending");
      const data = await res.json();
      if (data.success) {
        setApprovalQueue(data.partners);
      }
    } catch (error) {
      console.error("Failed to fetch partners");
    }
  };

  const handleAction = async (partnerId, action) => {
    try {
      const res = await fetch("/api/admin/partners/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, action }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setApprovalQueue((prev) => prev.filter((p) => p._id !== partnerId));
        setStats((prev) => ({
          ...prev,
          partners: action === "approve" ? prev.partners + 1 : prev.partners,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  return (
    <div
      className={`dashboard-container ${isSidebarOpen ? "sidebar-open" : ""}`}
    >
      <ToastContainer position="bottom-right" theme="dark" />

      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar with Overlay for Mobile */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <AdminSidebar isOpen={isSidebarOpen} />

      <main className="main-content">
        <AdminHeader />

        <div className="page-header">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">
            Welcome back, here's what's happening in your business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">Total Revenue</div>
            <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
            <div className="stat-subtext">
              <span className="growth-badge positive">↑ 12.5%</span> vs last
              month
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Active Users</div>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-subtext">
              <span className="growth-badge positive">↑ 8.2%</span> vs last
              month
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Onboarded Partners</div>
            <div className="stat-value">{stats.partners}</div>
            <div className="stat-subtext">
              <span className="growth-badge neutral">→ 0.5%</span> vs last month
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-header">Total Bookings</div>
            <div className="stat-value">{stats.bookings}</div>
            <div className="stat-subtext">
              <span className="growth-badge positive">↑ 15.3%</span> vs last
              month
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Partner Approval */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Partner Approval Queue</h3>
              <a href="/admin/partners" className="view-all">
                View All
              </a>
            </div>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Partner Name</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="hide-mobile">Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="table-loader">
                        Loading pending partners...
                      </td>
                    </tr>
                  ) : approvalQueue.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="table-loader">
                        No pending approvals
                      </td>
                    </tr>
                  ) : (
                    approvalQueue.map((partner) => (
                      <tr key={partner._id}>
                        <td>
                          <div className="user-info">
                            <div className="user-img">
                              {partner.fullName?.charAt(0) || "P"}
                            </div>
                            <div>
                              <div className="user-name">
                                {partner.fullName}
                              </div>
                              <div className="user-phone">
                                {partner.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{partner.serviceCategory}</td>
                        <td>
                          <span className="status-badge status-pending">
                            {partner.status}
                          </span>
                        </td>
                        <td className="hide-mobile">
                          {new Date(partner.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button
                              onClick={() =>
                                handleAction(partner._id, "approve")
                              }
                              className="btn-sm btn-approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAction(partner._id, "reject")
                              }
                              className="btn-sm btn-reject"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Live Feed */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">Live Activity</h3>
            </div>
            <div className="activity-list">
              {loading ? (
                <div className="loader-text">Loading activity...</div>
              ) : activityFeed.length === 0 ? (
                <div className="loader-text">No recent activity</div>
              ) : (
                activityFeed.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-icon-box ${activity.type}`}>
                      {activity.type === "partner" ? "👤" : "📦"}
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-desc">
                        {activity.description}
                      </div>
                      <div className="activity-time">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
