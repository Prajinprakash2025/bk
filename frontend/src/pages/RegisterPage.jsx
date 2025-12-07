import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        username: '', email: '', password: '', first_name: '', last_name: '' 
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(register(formData));
        if (register.fulfilled.match(result)) {
            navigate('/login');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="section-title">Join BK</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="error-message">{JSON.stringify(error)}</div>}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
                 <div className="form-group">
                    <label>First Name</label>
                    <input type="text" onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                </div>
                 <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
