import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import axios from 'axios';
import eyeIcon from '../../assets/eye.png';
import blockIcon from '../../assets/block.png';

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      setError('Mật khẩu không khớp');
      return;
    }
    try {
      const res = await axios.post('https://backendmovie-10gn.onrender.com/api/admins', {
        email,
        password,
      });

      console.log('User registered:', res.data);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <AuthLayout title="Đăng ký tài khoản" showLoginLink>
      <form onSubmit={handleRegister} className="signup-form space-y-4">
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
        <label htmlFor="password">Mật khẩu</label>
        <div className="password-container relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu của bạn"
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

        <label htmlFor="confirmPass">Xác nhận mật khẩu</label>
        <div className="password-container relative">
          <input
            id="confirmPass"
            type={showPassword ? 'text' : 'password'}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Xác nhận mật khẩu của bạn"
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

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="create-button bg-blue-500 text-white p-2 rounded w-full">
          Đăng ký
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;