import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setErrorMessage('Username and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });

      const { token, role } = response.data;  // Assuming the role is part of the response
      localStorage.setItem('user', JSON.stringify({ username, token, role }));  // Store complete user data in localStorage
      console.log('Logged in successfully!');

      // Optionally, set user data to parent state if necessary
      if (setUser) {
        setUser({ username, token, role });  // Include role here
      }

      // Redirect user to a protected route based on role
      navigate(role === 'ADMIN' ? '/items' : '/pending-orders');  // Admin goes to /items, regular user to /pending-orders
    } catch (error) {
      if (error.response) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {loading && <div className="spinner">Loading...</div>}
    </div>
  );
};

export default LoginForm;
