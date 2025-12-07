import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://localhost:8000/api/admin/users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const toggleStaff = async (user) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`http://localhost:8000/api/admin/users/${user.id}/`, 
                { is_staff: !user.is_staff },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    const toggleActive = async (user) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`http://localhost:8000/api/admin/users/${user.id}/`, 
                { is_active: !user.is_active },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="user-management">
            <h1 className="page-title">User Management</h1>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Staff</th>
                            <th>Active</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>#{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>
                                    <span className={`status-badge ${user.is_staff ? 'staff' : ''}`}>
                                        {user.is_staff ? '✓ Staff' : 'User'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        onClick={() => toggleStaff(user)}
                                        className="btn-small"
                                    >
                                        {user.is_staff ? 'Remove Staff' : 'Make Staff'}
                                    </button>
                                    <button 
                                        onClick={() => toggleActive(user)}
                                        className="btn-small"
                                        style={{ marginLeft: '0.5rem' }}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
