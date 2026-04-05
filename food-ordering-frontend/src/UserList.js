import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserList.css'; // Ensure this CSS is in place

const UserList = () => {
    const [users, setUsers] = useState([]);

    // Fetch users when the component mounts
    const fetchUsers = () => {
        axios.get('http://localhost:8080/admin/users')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Expected an array but got:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    // Fetch users on component mount (and whenever the page reloads)
    useEffect(() => {
        fetchUsers();
    }, []);  // Empty dependency array means this will run once when the component mounts

    // Handle the button click for toggling isActive
    const handleToggleActive = (userId, currentStatus) => {
        const newActiveStatus = !currentStatus;  // Toggle the current status
        console.log('Before Update:', users); // Before toggling

        // Send the updated status to the backend
        axios.put(`http://localhost:8080/admin/users/${userId}/toggle-active`, { isActive: newActiveStatus })
            .then(() => {

                    console.log('Before Update:', users); // Before toggling

                // Optimistically update the user list with the new status
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, isActive: newActiveStatus } : user
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating user status:', error);
            });
    };

    return (
        <div className="user-list-container">
            <h1>User List</h1>

            {users.length > 0 ? (
                <div className="user-grid">
                    {users.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="user-details">
                                <strong>{user.username}</strong>
                                <p>{user.role}</p>
                                <p>{user.isActive ? 'Active' : 'In Active'}</p>
                            </div>
                            <div className="user-swap-button">
                                <button
                                    onClick={() => handleToggleActive(user.id, user.isActive)}
                                    style={{
                                        backgroundColor: user.isActive ? 'green' : 'red',
                                        color: 'white',
                                        padding: '5px 10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '5px'
                                    }}
                                >
                                    {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No users available</p>
            )}
        </div>
    );
};

export default UserList;
