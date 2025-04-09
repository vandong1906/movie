import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../user/AuthLayout';
import axios from 'axios';

interface User {
  // Define user properties based on your API response
  id?: string;
  User_name?: string;
}

const Login: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post<{ user: User }>('https://backendmovie-10gn.onrender.com/api/admins/login', {
        User_name: userName,
        password,
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Login to your account" showRegisterLink={true}>
      <form onSubmit={handleLogin} className="signup-form space-y-4">
        <div>
          <label htmlFor="email" className="block text-black font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="balamia@gmail.com"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-black font-medium">
            Password
          </label>
          <div className="password-container relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            />
            <img
              src={showPassword ? '/images/block.png' : '/images/eye.png'}
              alt="Toggle Password"
              className="eye-icon absolute right-2 top-2 w-5 h-5"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="create-button bg-green-500 text-white p-3 rounded w-full hover:bg-green-600 transition"
        >
          Login now
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;