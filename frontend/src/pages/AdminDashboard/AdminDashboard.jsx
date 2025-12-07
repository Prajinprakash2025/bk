import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import CategoryManagement from './CategoryManagement';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/admin/stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            if (error.response?.status === 403) {
                alert('You do not have permission to access the admin dashboard');
                navigate('/');
            }
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading admin dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <h2 className="admin-logo">BK Admin</h2>
                <nav className="admin-nav">
                    <Link to="/admin-dashboard" className="admin-nav-item">
                        📊 Dashboard
                    </Link>
                    <Link to="/admin-dashboard/products" className="admin-nav-item">
                        📦 Products
                    </Link>
                    <Link to="/admin-dashboard/categories" className="admin-nav-item">
                        📑 Categories
                    </Link>
                    <Link to="/admin-dashboard/users" className="admin-nav-item">
                        👥 Users
                    </Link>
                    <Link to="/" className="admin-nav-item">
                        ← Back to Store
                    </Link>
                </nav>
            </aside>

            <main className="admin-main">
                <Routes>
                    <Route index element={<DashboardHome stats={stats} />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="users" element={<UserManagement />} />
                </Routes>
            </main>
        </div>
    );
};

const DashboardHome = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-home">
            <h1 className="page-title">Dashboard Overview</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-details">
                        <h3>{stats.total_products}</h3>
                        <p>Total Products</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-details">
                        <h3>{stats.total_users}</h3>
                        <p>Total Users</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-details">
                        <h3>{stats.total_orders}</h3>
                        <p>Cart Items</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-details">
                        <h3>${stats.total_revenue.toFixed(2)}</h3>
                        <p>Potential Revenue</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/admin-dashboard/products" className="btn-primary">
                        Add New Product
                    </Link>
                    <Link to="/admin-dashboard/users" className="btn-primary">
                        Manage Users
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
