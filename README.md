# 🍽️ Smart Canteen System

A web-based smart ordering system for college canteen that reduces wait time and congestion using AI-powered features.

## 🎯 Problem Statement
- Long waiting time in college canteen
- Rush-hour congestion
- No real-time stock updates
- No demand prediction
- No personalization

## ✨ Features
- 🔐 Student & Admin login with JWT authentication
- 🍛 Dynamic menu with real-time stock updates
- 🛒 Cart & order placement with pickup time
- ⭐ AI-powered personalized recommendations
- ⚠️ Rush hour detection
- 📈 Demand prediction dashboard
- 📋 Order history for students
- 👨‍💼 Admin dashboard with order management
- 📦 Stock management & restocking

## 🤖 AI Features
1. **Demand Prediction** — Tracks order frequency, predicts high-demand items
2. **Smart Recommendations** — Shows top 3 most ordered items to each user
3. **Rush Hour Detection** — Counts orders in last 15 mins, alerts if > 10
4. **Auto Stock Update** — Marks items unavailable when stock hits 0

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** MongoDB (local)
- **Authentication:** JWT (JSON Web Tokens)
- **Version Control:** Git + GitHub

## 📁 Project Structure
```
smart-canteen/
├── frontend/
│   ├── pages/
│   │   ├── index.html    # Login & Register
│   │   ├── menu.html     # Menu & Cart
│   │   ├── orders.html   # Order History
│   │   └── admin.html    # Admin Dashboard
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── api.js
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   └── Order.js
│   └── middleware/
│       └── auth.js
├── .env
└── package.json
```

## 🚀 Setup Instructions
1. Clone the repo: `git clone https://github.com/ShruthiSubbu/smart-canteen.git`
2. Install dependencies: `npm install`
3. Create `.env` file:
```
DB_URL=mongodb://localhost:27017/smartcanteen
JWT_SECRET=smartcanteen_secret_key_2024
PORT=3000
```
4. Start MongoDB locally
5. Run server: `node backend/server.js`
6. Open `frontend/pages/index.html` in browser

## 👩‍💻 Developer
Shruthi Subramanian | VIT Chennai | 24BCE1813