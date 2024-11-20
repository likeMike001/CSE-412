import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/search');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
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
                <button type="submit">Register</button>
                {error && <div className="error-message">{error}</div>}
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Register;