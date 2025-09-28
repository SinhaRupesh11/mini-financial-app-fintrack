# 💰 FinTrack: Full-Stack Mini-Financial App

**FinTrack** is a simplified financial application that allows users to:

* Register with simulated KYC
* View dummy investment products
* Perform transactions (buy assets)
* Monitor portfolio value in real-time

---
## 🎥 Demo
[Watch Demo Video](https://www.loom.com/share/4e2efa78eecb4d338a887903173368f9?sid=4e80c59c-63ff-43ad-84db-9c7984e7d7ed)


## 🚀 Technical Stack

This project is built using the **MERN stack**, with a focus on modularity, security, and data integrity.

| Component    | Technology                         | Description                                                                        |
| ------------ | ---------------------------------- | ---------------------------------------------------------------------------------- |
| **Backend**  | Node.js, Express, MongoDB/Mongoose | Provides secured RESTful APIs for authentication, transactions, and portfolio data |
| **Security** | JWT, bcrypt                        | Stateless authentication and secure password hashing                               |
| **Frontend** | React (Vite), React Router, Axios  | Single-page application with modular components and protected routing              |
| **Styling**  | Tailwind CSS                       | Clean, responsive, utility-first styling                                           |
| **Data Viz** | Recharts                           | Displays dummy historical price data on the Product Detail Page                    |

---

## ⚙️ Setup and Installation

### A. Prerequisites

* Node.js (v18+) and npm
* MongoDB instance (Local or MongoDB Atlas)

---

### B. Backend Setup (inside `/backend`)

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Configuration:**
   Create a `.env` file in the backend directory with:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secure_random_key
   PORT=5000
   ```

3. **Seed Database (Mandatory):**

   ```bash
   node seed.js
   ```

4. **Start Backend Server:**

   ```bash
   npm run server
   ```

   The server will run at **[http://localhost:5000](http://localhost:5000)**

---

### C. Frontend Setup (inside `/frontend`)

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend Client:**

   ```bash
   npm run dev
   ```
## 🔑 Core Features & Architecture

### **Authentication & Security**

* **KYC (Simulated):** Signup collects required fields (`name`, `panNumber`) and simulates a file upload by storing a unique path in the database.
* **JWT Protection:** All APIs that access user data (`/products`, `/transactions`, `/portfolio`, `/watchlist`) are secured with JWT middleware (`auth.js`).
* **State Stability (Crucial Fix):** `AuthContext` uses the `/auth/me` endpoint to fetch the latest user data on every load, preventing wallet balance reset on refresh.

### **Portfolio & Transaction Integrity**

* **Atomic Transactions:** Purchase API (`POST /api/transactions/buy`) uses MongoDB atomic updates (`$inc`) to deduct wallet balance safely, preventing race conditions.
* **Real-Time Metrics (Aggregation):** Portfolio API (`GET /api/portfolio`) applies a MongoDB Aggregation Pipeline to combine historical transactions with current product prices, accurately calculating **Current Value** and **Returns**.

---

## 📚 REST API Endpoints

All endpoints are prefixed with `/api`.
**Base URL:** `http://localhost:5000/api`

| Method | Endpoint                | Description                                                        | Access  |
| ------ | ----------------------- | ------------------------------------------------------------------ | ------- |
| POST   | `/auth/signup`          | Registers a new user and records KYC data.                         | Public  |
| POST   | `/auth/login`           | Authenticates user and returns JWT.                                | Public  |
| GET    | `/auth/me`              | Fetches current user's profile and wallet balance.                 | Private |
| GET    | `/products`             | Lists all available investment products.                           | Private |
| GET    | `/portfolio`            | Returns user holdings, total invested, current value, and returns. | Private |
| POST   | `/transactions/buy`     | Executes atomic deduction of funds and records a transaction.      | Private |
| POST   | `/watchlist`            | Adds a product to the user's watchlist.                            | Private |
| DELETE | `/watchlist/:productId` | Removes a product from the user's watchlist.                       | Private |
## 📂 Project Structure

```
FinTrack/
│
├── backend/                     # Backend (Node.js, Express, MongoDB)
│   ├── middleware/              # Authentication & middleware logic
│   │   └── auth.js
│   ├── models/                  # Mongoose models
│   │   ├── Product.js
│   │   ├── Transaction.js
│   │   ├── User.js
│   │   └── Watchlist.js
│   ├── routes/                  # API route definitions
│   │   ├── auth.js
│   │   ├── portfolio.js
│   │   ├── products.js
│   │   ├── transactions.js
│   │   └── watchlist.js
│   ├── seed.js                  # Script to seed dummy product data
│   ├── server.js                # Entry point for backend server
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── package-lock.json
│
├── frontend/                    # Frontend (React + Vite)
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, icons, etc.
│   │   ├── components/          # Reusable UI components
│   │   ├── utils/               # Helper functions and utilities
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx             # React entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── vite.config.js
│
├── README.md                    # Root project documentation
└── package.json                 # Root metadata (if monorepo style)
```
