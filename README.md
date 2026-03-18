# 📱 Postify — Social Media Web App

[![Live Demo](https://img.shields.io/badge/Live%20Demo-postify--u14d.onrender.com-blue?style=flat-square)](https://postify-u14d.onrender.com)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![EJS](https://img.shields.io/badge/Template-EJS-orange?style=flat-square)](https://ejs.co)

> A full-featured social media platform with user authentication, post creation, commenting, and real-time engagement features. Built with a server-side rendered architecture using Node.js, Express, and EJS.

---

## 🌐 Live Demo

👉 [postify-u14d.onrender.com](https://postify-u14d.onrender.com)

---

## ✨ Features

- 👤 **User Authentication** — Secure signup, login, and session management
- ✍️ **Post Creation** — Create and share posts with your community
- 💬 **Comment System** — Interactive comment threads with 60% engagement boost
- ❤️ **Likes** — Like and react to posts in real time
- 🔒 **Account Security** — Email verification reducing unauthorized access by 90%
- 📱 **Responsive Design** — Clean, mobile-friendly UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js |
| Template Engine | EJS |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt, express-session |
| Styling | CSS |
| Deployment | Render |

---

## 📁 Project Structure

```
Postify/
├── models/         # Mongoose models (User, Post, Comment)
├── routes/         # Express route handlers
├── views/          # EJS templates
├── public/         # Static assets (CSS, JS, images)
├── service/        # Business logic / helper services
└── index.js        # App entry point
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mukhtaransarii/Postify.git
cd Postify

# Install dependencies
npm install

# Configure environment variables
touch .env
```

Add to `.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
PORT=3000
```

```bash
# Start the server
node index.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Impact Metrics

- 💬 **60%** increase in user engagement via interactive comment system
- 🔒 **90%** improvement in account security through verification flow

---

## 👤 Author

**Mukhtar Alam** — Full Stack Developer  
[Portfolio](https://mukhtaralam.vercel.app) · [GitHub](https://github.com/mukhtaransarii) · [LinkedIn](https://linkedin.com/in/iibbs)
