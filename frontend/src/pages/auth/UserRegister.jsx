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

  const initGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      if (window.google) {
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
        window.google.accounts.id.renderButton(
          document.getElementById("google-login-btn"),
          { theme: "outline", size: "large", width: "100%" }
        );
      }
    } catch (error) {
      console.error("Google init failed", error);
    }
  };

  useState(() => {
    setTimeout(initGoogle, 1000);
  });

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

                <div id="google-login-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>

                <div className="auth-alt-action">
                    Already have an account? <Link to="/user/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
