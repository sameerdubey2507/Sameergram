import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    password: '',
    address: ''
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
              alert("Partner Google Registration failed on server");
            }
          }
        });
        window.google.accounts.id.renderButton(
          document.getElementById("partner-google-reg-btn"),
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
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/food-partner/register`, {
        name: formData.businessName,
        contactName: formData.contactName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        address: formData.address
      }, { withCredentials: true });

      if (response.data.foodPartner) {
        await refreshUser();
        navigate("/create-food");
      }
    } catch (error) {
      alert("Registration failed: " + (error.response?.data?.message || "Check your internet or server."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-register-title">
        <header>
          <h1 id="partner-register-title" className="auth-title">Partner sign up</h1>
          <p className="auth-subtitle">Grow your business with our platform.</p>
        </header>
        <nav className="auth-alt-action" style={{marginTop: '-4px'}}>
          <strong style={{fontWeight:600}}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
        </nav>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="businessName">Business Name</label>
            <input id="businessName" name="businessName" placeholder="Tasty Bites" autoComplete="organization" value={formData.businessName} onChange={handleChange} />
          </div>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input id="contactName" name="contactName" placeholder="Jane Doe" autoComplete="name" value={formData.contactName} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" placeholder="+1 555 123 4567" autoComplete="tel" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" value={formData.email} onChange={handleChange} />
            </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create password" autoComplete="new-password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" placeholder="123 Market Street" autoComplete="street-address" value={formData.address} onChange={handleChange} />
            <p className="small-note">Full address helps customers find you faster.</p>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Partner Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div id="partner-google-reg-btn" style={{ display: 'flex', justifyContent: 'center' }}></div>

        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
