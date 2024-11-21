
import React , {useState, useRef , useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './usermenu.css'

const UserMenu = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatar, setAvatar] = useState(user.avatar || '/default-avatar.png');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                const response = await fetch(`http://localhost:3001/api/users/${user.user_id}/avatar`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    setAvatar(result.avatar_url);
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    };

    return (
        <div className="user-menu" ref={dropdownRef}>
            <div className="avatar-container" onClick={() => setIsOpen(!isOpen)}>
                <img src={avatar} alt="User avatar" className="avatar" />
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="user-info">
                        <span>{user.first_name} {user.last_name}</span>
                        <span className="username">@{user.username}</span>
                    </div>
                    <div className="menu-items">
                        <label className="menu-item upload-avatar">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                            Change Avatar
                        </label>
                        <button className="menu-item" onClick={() => navigate('/profile')}>
                            Favorites
                        </button>
                        <button className="menu-item" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu

