import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import Helper from './helper.component';
import './admindasboard.css';

const AdminDashBoard = () => {
    const [analyticsData, setAnalyticsData] = useState({ totalUsers: 0, userData: [] });
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        favorites: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/admin/analytics');
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const data = await response.json();
                setAnalyticsData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setAnalyticsData({ totalUsers: 0, userData: [] }); // Fallback to empty data
            }
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

    const editData = (username) => {
        const user = analyticsData.userData.find((u) => u.username === username);
        if (user) {
            setUserToEdit(username);
            setEditForm({
                fullName: user.fullName || '',
                email: user.email || '',
                favorites: user.favorites ? user.favorites.join(', ') : '',
            });
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitEdit = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/admin/users/${userToEdit}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: editForm.fullName,
                    email: editForm.email,
                    favorites: editForm.favorites.split(',').map((fav) => fav.trim()),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const updatedUser = await response.json();

            setAnalyticsData((prev) => ({
                ...prev,
                userData: prev.userData.map((user) =>
                    user.username === userToEdit ? updatedUser.updatedUser : user
                ),
            }));

            alert('User updated successfully!');
            setUserToEdit(null);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const confirmDelete = (username) => {
        setUserToDelete(username);
    };

    const handleCancel = () => {
        setUserToDelete(null);
        setUserToEdit(null);
    };

    const { totalUsers, userData = [] } = analyticsData;

    const signupsByMonthYear = (userData || []).reduce((acc, user) => {
        const key = `${user.signupYear}-${user.signupMonth}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.entries(signupsByMonthYear).map(([key, value]) => ({
        date: key,
        users: value,
    }));

    const favoritesBreakdown = (userData || []).reduce(
        (acc, user) => {
            const count = user.favoritesCount || 0;
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
                        {userData.length > 0
                            ? (
                                  userData.reduce((acc, user) => acc + (user.favoritesCount || 0), 0) /
                                  userData.length
                              ).toFixed(2)
                            : 0}
                    </p>
                </div>
            </div>

            <div className="chart-section">
                <div className="chart-container">
                    <h3>User Signups by Month</h3>
                    {barChartData.length > 0 ? (
                        <BarChart width={500} height={300} data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="#8884d8" />
                        </BarChart>
                    ) : (
                        <p>No signup data available.</p>
                    )}
                </div>

                <div className="chart-container">
                    <h3>Favorites Breakdown</h3>
                    {pieChartData.length > 0 ? (
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
                    ) : (
                        <p>No favorites breakdown data available.</p>
                    )}
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
                            <th>Favorite Movies</th>
                            <th>Actions</th>
                            <th>Edit Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.length > 0 ? (
                            userData.slice(0, 5).map((user) => (
                                <tr key={user.userId}>
                                    <td>{user.username}</td>
                                    <td>{user.fullName || 'N/A'}</td>
                                    <td>{user.email || 'N/A'}</td>
                                    <td>{new Date(user.signupDate).toLocaleDateString()}</td>
                                    <td>
                                        {user.favorites && user.favorites.length > 0
                                            ? user.favorites.join(', ')
                                            : <span>No Favorites</span>}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => confirmDelete(user.username)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => editData(user.username)}
                                            className="update-button"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No users found.</td>
                            </tr>
                        )}
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

            {userToEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit User Details</h3>
                        <form>
                            <div>
                                <label>Full Name:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={editForm.fullName}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editForm.email}
                                    onChange={handleEditChange}
                                />
                            </div>
                            <div>
                                <label>Favorite Movies:</label>
                                <input
                                    type="text"
                                    name="favorites"
                                    value={editForm.favorites}
                                    onChange={handleEditChange}
                                />
                                <small>Comma-separated list (e.g., Movie1, Movie2)</small>
                            </div>
                        </form>
                        <div className="modal-actions">
                            <button onClick={submitEdit} className="modal-save-button">
                                Save Changes
                            </button>
                            <button onClick={handleCancel} className="modal-cancel-button">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Helper />
        </div>
    );
};

export default AdminDashBoard;
