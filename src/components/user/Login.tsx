import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import axios from 'axios';
import eyeIcon from '../../assets/eye.png';
import blockIcon from '../../assets/block.png';
import googleIcon from '../../assets/google-login.png';

// Define interface for user data
interface User {
  user_id: number | null;
  role: 'admin' | 'user';
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const res = await axios.post<{ role: string; user?: User }>(
        'https://backendmovie-10gn.onrender.com/api/admins/login',
        { email, password }
      );

      const validRole = res.data.role === 'admin' ? 'admin' : 'user';
      localStorage.setItem('isLoggedIn', 'true');
      if (res.data.user) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...res.data.user,
            user_id: res.data.user.user_id || null,
            role: validRole,
          })
        );
      }
      if (validRole === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Login to your account" showRegisterLink={true}>
      <form onSubmit={handleLogin} className="signup-form space-y-4">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="@gmail.com"
          required
          className="w-full p-2 border rounded"
        />

        <label htmlFor="password">Password</label>
        <div className="password-container relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full p-2 border rounded"
          />
          <img
            src={showPassword ? blockIcon : eyeIcon}
            alt="Toggle Password"
            className="eye-icon absolute right-2 top-2 w-5 h-5"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
<button type="submit" className="create-button">
          Login now
        </button>

        <button className="google-login-button">
          <img src={googleIcon} alt="Google" className="google-icon" />
          <span>Log in with Google</span>
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;