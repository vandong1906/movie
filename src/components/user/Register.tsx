import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../user/AuthLayout';
import axios from 'axios';

const Register: React.FC = () => {
  const [email, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log(password,"    0",email)
    if (password !== confirmPass) {
      setError("Passwords don't match");
      return;
    }
 

    try {
      const res = await axios.post('https://backendmovie-10gn.onrender.com/api/admins', {
        email: email,
        password,
      });

      console.log('User registered:', res.data);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Create an account" showLoginLink>
      <form onSubmit={handleRegister} className="signup-form space-y-4">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setUserName(e.target.value)}
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
            src={showPassword ? '/images/block.png' : '/images/eye.png'}
            alt="Toggle Password"
            className="eye-icon absolute right-2 top-2 w-5 h-5"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <label htmlFor="confirmPass">Confirm Password</label>
        <div className="password-container relative">
          <input
            id="confirmPass"
            type={showPassword ? 'text' : 'password'}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confirm your password"
            required
            className="w-full p-2 border rounded"
          />
          <img
            src={showPassword ? '/images/block.png' : '/images/eye.png'}
            alt="Toggle Password"
            className="eye-icon absolute right-2 top-2 w-5 h-5"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="create-button bg-blue-500 text-white p-2 rounded w-full">
          Create account
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;