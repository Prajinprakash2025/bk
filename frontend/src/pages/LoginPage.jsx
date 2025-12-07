import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login(formData));
        if (login.fulfilled.match(result)) {
            navigate('/');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="section-title">Login</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="error-message">{error.detail || "Login failed"}</div>}
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required 
                    />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
