import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/search';
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                />
                <button type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );
};

export default Login;