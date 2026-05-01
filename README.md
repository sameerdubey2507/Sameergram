frontend-https://sameergram.vercel.app
backend-https://sameergram.onrender.com

# 📸 SameerGram

**SameerGram** is a high-fidelity, premium social media platform designed for seamless food discovery and store interactions. Built with a modern dark aesthetic, glassmorphic UI elements, and a mobile-first philosophy.

---

## ✨ Key Features

- **📱 Immersive Reel Feed**: A full-screen, vertical video experience with smooth transitions and high-performance playback.
- **🛍️ Store Integration**: One-tap "Visit Store" functionality that connects users directly to food partner profiles.
- **❤️ Social Interactions**: Real-time like counts, saved collections, and interactive commenting systems.
- **🔐 Advanced Authentication**:
  - Secure Email/Password registration.
  - **Google One-Tap Login**: Seamless social authentication for both Users and Food Partners.
- **🏬 Partner Dashboard**: Dedicated portal for food partners to manage their digital presence and content.
- **🎨 Premium Dark Aesthetic**: Vibrant gradient accents (`#f09433` to `#bc1888`) paired with a sophisticated pitch-black glassmorphic design.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js**: Component-based UI architecture.
- **Vite**: High-speed build tool and development server.
- **Vanilla CSS**: Custom-crafted design system with modern tokens and animations.
- **Axios**: Secure API communication with cross-origin support.

### **Backend**
- **Node.js & Express**: Scalable server architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for rich social data.
- **JWT & Cookies**: Secure, stateless authentication with HttpOnly persistence.
- **Google Auth Library**: Enterprise-grade social login integration.

---

## 🚀 Getting Started

### **1. Prerequisites**
- Node.js (v18+)
- MongoDB Atlas Account
- Google Cloud Console Project (for OAuth)

### **2. Installation**

```bash
# Clone the repository
git clone https://github.com/yourusername/sameergram.git

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### **3. Environment Setup**

Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your_secret
MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the `frontend` directory:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### **4. Running Locally**

```bash
# Start Backend (Port 3000)
cd backend
npm start

# Start Frontend (Port 5173)
cd frontend
npm run dev
```

---

## 🎨 Design Philosophy

SameerGram is built on the principle of **Visual Excellence**. Every interaction—from the glowing like button to the frosted glass "Visit Store" CTA—is designed to provide a premium, state-of-the-art user experience that feels alive and responsive.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**Built with ❤️ by [Sameer]**
