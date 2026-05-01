import React, { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
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
                token: response.credential,
                role: 'foodPartner'
              }, { withCredentials: true });
              
              if (res.data.foodPartner) {
                await refreshUser();
                navigate("/create-food");
              }
            } catch (err) {
              alert("Partner Google Login failed on server");
            }
          }
        });
        window.google.accounts.id.renderButton(
          document.getElementById("partner-google-btn"),
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
      const response = await axios.post(`${apiUrl}/api/auth/food-partner/login`, formData, { withCredentials: true });
      if (response.data.foodPartner) {
        await refreshUser();
        navigate("/create-food");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" value={formData.password} onChange={handleChange} />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div id="partner-google-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>

        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
