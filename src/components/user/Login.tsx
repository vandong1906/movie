import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import axios from "axios";
import eyeIcon from "../../assets/eye.png";
import blockIcon from "../../assets/block.png";
import googleIcon from "../../assets/google-login.png";
import { useAuth } from "../hook/AuthenContext";
import { loginGoogle } from "../../logingoogle";

interface User {
  user_id: number | null;
  role: "admin" | "user";
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginMessage, setLoginMessage] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const message = localStorage.getItem('loginMessage');
    if (message) {
      setLoginMessage(message);
      localStorage.removeItem('loginMessage');
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email và mật khẩu là bắt buộc.");
      return;
    }
    try {
      const res = await axios.post<{ role: string; id?: User }>(
        "https://backendmovie-10gn.onrender.com/api/admins/login",
        { email, password },
        { withCredentials: true }
      );

      const validRole = res.data.role === "admin" ? "admin" : "user";
      if (res.data.id) {
        login({
          user_id: res.data.id ? String(res.data.id) : null,
          role: validRole,
        });
        localStorage.setItem('isLoggedIn', 'true');
      }
      if (validRole === "admin") {
        navigate("/admin");
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <AuthLayout title="Đăng nhập" showRegisterLink={true}>
      <form onSubmit={handleLogin} className="signup-form space-y-4">
        {loginMessage && (
          <p className="text-yellow-500 text-sm bg-yellow-100 p-2 rounded text-center">
            {loginMessage}
          </p>
        )}
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
            style={{ cursor: "pointer" }}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="create-button bg-blue-500 text-white p-2 rounded w-full">
          Đăng nhập
        </button>
        <button
          className="google-login-button flex items-center justify-center space-x-2 border p-2 rounded w-full"
          onClick={async () => {
            const data = await loginGoogle();
            login({
              user_id: data.id,
              role: data.role,
            });
            localStorage.setItem('isLoggedIn', 'true');
            if (data.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }}
        >
          <img src={googleIcon} alt="Google" className="google-icon w-5 h-5" />
          <span>Đăng nhập bằng Google</span>
        </button>
      </form>
    </AuthLayout>
  );
};

export default Login;