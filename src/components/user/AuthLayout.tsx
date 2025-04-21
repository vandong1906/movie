import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'
import logo from '../../assets/logoweb.png'
interface AuthLayoutProps {
  title: string;
  showLoginLink?: boolean;
  showRegisterLink?: boolean;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, showLoginLink, showRegisterLink, children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="left-section">
      <Link to="/">
      <img className="logo-home" src={logo} alt="Film" />
      </Link>
        <div className="welcome-text">
          <h2>Welcome.</h2>
          <h2>Begin your cinematic adventure now with our ticketing platform!</h2>
        </div>
      </div>
      <div className="right-section">
        <h3>{title}</h3>
        {children}
        {showLoginLink && (
          <div className="login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login" onClick={() => console.log('Log in link clicked')}>
                Log in
              </Link>
            </p>
          </div>
        )}
        {showRegisterLink && (
          <div className="login-link">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;