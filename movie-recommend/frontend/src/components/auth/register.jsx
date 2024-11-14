import React from 'react';
import { useState } from 'react';
import './register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
        } catch (error) {
            console.error('Registration error :', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="First Name Laude"
                onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Last Name Laude"
                onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
