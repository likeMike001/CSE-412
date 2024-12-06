// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './login.css';

// const Login = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         username: '',
//         password: ''
//     });
//     const [error, setError] = useState('');


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:3001/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData)
//             });
    
//             const data = await response.json();
    
//             if (!response.ok) {
//                 if (response.status === 401) {
//                     throw new Error('Invalid username or password');
//                 } else {
//                     throw new Error(data.error || 'Login failed');
//                 }
//             }
    
//             console.log('Login response:', data); // Debugging log
//             localStorage.setItem('user', JSON.stringify(data));
    
//             // Role-based redirection
//             if (data.is_admin) {
//                 navigate('/admin');
//             } else {
//                 navigate('/search');
//             }
//         } catch (error) {
//             setError(error.message);
//         }
//     };
    

//     return (
//         <div className="login-container">
//             <form onSubmit={handleSubmit}>
//                 <h2>Login</h2>
//                 <input
//                     type="text"
//                     name="username"
//                     placeholder="Username"
//                     onChange={(e) => setFormData({...formData, username: e.target.value})}
//                     required
//                 />
//                 <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                     required
//                 />
//                 <button type="submit">Login</button>
//                 {error && <div className="error-message">{error}</div>}
//                 <p>Don't have an account? <Link to="/register">Register</Link></p>
//             </form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setAuthenticatedUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Invalid username or password');
                } else {
                    throw new Error(data.error || 'Login failed');
                }
            }

            console.log('Login response:', data); // Debugging log
            localStorage.setItem('user', JSON.stringify(data)); // Save user data in localStorage
            setAuthenticatedUser(data); // Update global user state

            // Role-based redirection
            if (data.is_admin) {
                navigate('/admin');
            } else {
                navigate('/search');
            }
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
                    name="username"
                    placeholder="Username"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
