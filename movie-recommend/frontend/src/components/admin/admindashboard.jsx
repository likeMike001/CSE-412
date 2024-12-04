import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import './admindasboard.css';

const AdminDashBoard = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/api/admin/analytics');
            const data = await response.json();
            setAnalyticsData(data);
        };

        fetchData();
    }, []);

    const deleteUser = async (username) => {
        try {
            const response = await fetch(`http://localhost:3001/api/admin/users/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setAnalyticsData((prev) => ({
                ...prev,
                userData: prev.userData.filter((user) => user.username !== username),
            }));
            alert('User deleted successfully!');
            setUserToDelete(null); 
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const confirmDelete = (username) => {
        setUserToDelete(username);
    };

    const handleCancel = () => {
        setUserToDelete(null);
    };

    if (!analyticsData) return <div>Loading...</div>;

    const { totalUsers, userData } = analyticsData;

    const signupsByMonthYear = userData.reduce((acc, user) => {
        const key = `${user.signupYear}-${user.signupMonth}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.entries(signupsByMonthYear).map(([key, value]) => ({
        date: key,
        users: value,
    }));

    const favoritesBreakdown = userData.reduce(
        (acc, user) => {
            const count = user.favoritesCount;
            if (count === 0) acc[0]++;
            else if (count <= 5) acc['1-5']++;
            else acc['6+']++;
            return acc;
        },
        { 0: 0, '1-5': 0, '6+': 0 }
    );

    const pieChartData = Object.entries(favoritesBreakdown).map(([range, count]) => ({
        range,
        count,
    }));

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-metrics">
                <div className="metric-card">
                    <h2>Total Users</h2>
                    <p>{totalUsers}</p>
                </div>
                <div className="metric-card">
                    <h2>Average Favorites</h2>
                    <p>
                        {(
                            userData.reduce((acc, user) => acc + user.favoritesCount, 0) /
                            userData.length
                        ).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="chart-section">
                <div className="chart-container">
                    <h3>User Signups by Month</h3>
                    <BarChart width={500} height={300} data={barChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                </div>

                <div className="chart-container">
                    <h3>Favorites Breakdown</h3>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieChartData}
                            dataKey="count"
                            nameKey="range"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            <div className="recent-signups">
                <h3>Recent Signups</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Signup Date</th>
                            <th>Favorites Count</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.slice(0, 5).map((user) => (
                            <tr key={user.userId}>
                                <td>{user.username}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{new Date(user.signupDate).toLocaleDateString()}</td>
                                <td>{user.favoritesCount}</td>
                                <td>
                                    <button
                                        onClick={() => confirmDelete(user.username)}
                                        className="delete-button" 
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {userToDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete user "{userToDelete}"?</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => deleteUser(userToDelete)}
                                className="modal-delete-button"
                            >
                                Yes, Delete
                            </button>
                            <button onClick={handleCancel} className="modal-cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashBoard;
