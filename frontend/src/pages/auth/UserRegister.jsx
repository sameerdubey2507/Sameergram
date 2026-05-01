import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserRegister = () => {

    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const res = await axios.post(`${apiUrl}/api/auth/user/google-login`, {
              token: response.credential
            }, { withCredentials: true });
            
            if (res.data.user) {
              await refreshUser();
              navigate("/");
            }
          } catch (err) {
            alert("Google Registration failed on server");
          }
        }
      });
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Google init failed", error);
    }
  };

    const handleSubmit = async (e) => {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/api/auth/user/register`, {
                fullName: formData.firstName + " " + formData.lastName,
                email: formData.email,
                password: formData.password
            },
            {
                withCredentials: true
            });

            if (response.data.user) {
                await refreshUser();
                navigate("/");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-card" role="region" aria-labelledby="user-register-title">
                <header>
                    <h1 id="user-register-title" className="auth-title">Create your account</h1>
                    <p className="auth-subtitle">Join to explore and enjoy delicious meals.</p>
                </header>
                <nav className="auth-alt-action" style={{ marginTop: '-4px' }}>
                    <strong style={{ fontWeight: 600 }}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
                </nav>
                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className="two-col">
                        <div className="field-group">
                            <label htmlFor="firstName">First Name</label>
                            <input id="firstName" name="firstName" placeholder="Jane" autoComplete="given-name" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="field-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" value={formData.password} onChange={handleChange} />
                    </div>
                    <button className="auth-submit" type="submit">Sign Up</button>
                </form>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <button className="google-btn" onClick={handleGoogleLogin}>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
