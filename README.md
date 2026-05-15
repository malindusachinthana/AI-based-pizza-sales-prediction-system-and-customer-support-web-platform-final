# 🍕 OvenZa Crust — AI-Based Pizza Sales Prediction System & Customer Support Web Platform

<div align="center">

![OvenZa Crust](https://img.shields.io/badge/OvenZa-Crust-d4a017?style=for-the-badge&logo=firefox&logoColor=white)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-4DB33D?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**Final Year Project — BSc (Hons) Software Engineering**  
**University of Plymouth (PUSL3190 Computing Project)**  
**Student:** Muhandiram M Muhandiram | **Plymouth Index:** 10953031  
**Supervisor:** Ms. Thisarani Wickramasinghe

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [AI Forecasting Model](#-ai-forecasting-model)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Running the System](#-running-the-system)
- [Access Credentials](#-access-credentials)
- [Project Structure](#-project-structure)
- [Test Results](#-test-results)
- [Screenshots](#-screenshots)
- [Future Implementations](#-future-implementations)

---

## 🧾 Project Overview

**OvenZa Crust** is a full-stack, AI-powered web application developed for a wood-fired pizza restaurant based in Maharagama, Colombo, Sri Lanka. Built using the **MERN stack** integrated with a **Python/Flask AI microservice**, the platform addresses three core operational challenges:

| Problem | Solution |
|---|---|
| Inaccurate manual sales forecasting → food waste & stockouts | Facebook Prophet AI model with 14-day category-specific demand predictions |
| No automated customer support — only phone/walk-in | Admin-configurable rule-based chatbot with live MongoDB data integration |
| No digital ordering platform | Full online ordering system with PayPal Sandbox payment integration |

> **Academic Result:** 31 functional test cases executed across 10 system modules — **100% pass rate**.

---

## ✨ Key Features

### 👨‍💼 Admin Side
- **AI Sales Forecast Dashboard** — 14-day Prophet predictions across 4 pizza categories (Chicken, Classic, Supreme, Veggie), with a stacked area chart, daily breakdown table with 95% confidence intervals, and per-model accuracy metrics (MAE, RMSE, MAPE)
- **Pizza Menu CRUD** — Add/edit/delete pizzas with image upload (Multer), category-based pricing in Sri Lankan Rupees (Small / Medium / Large)
- **Special Offers Management** — Create, edit, hide/show, and delete promotions with up to 4 images per offer
- **Chatbot Management** — Edit Q&A pairs, add custom questions, and view live usage statistics (most-asked questions)
- **Live Analytics Dashboard** — Total pizzas, customers, orders, and revenue with a UTC+5:30-corrected weekly sales bar chart and top-3 selling pizzas

### 🛒 Customer Side
- **Browse Menu** — Category-filtered pizza catalogue with real-time pricing from MongoDB
- **Cart & Checkout** — localStorage-persisted cart, size selector (S/M/L), PayPal Sandbox payment integration, order confirmation with PayPal Order ID
- **Customer Profile** — Order history, email/password update with bcryptjs re-hashing
- **Special Offers Page** — Dynamically driven by admin — no rebuild needed
- **Intelligent Chatbot** — Rule-based floating bubble with live DB queries (best seller, cheapest, most expensive pizza)
- **Gallery & About Us Pages**

---

## 🤖 AI Forecasting Model

Five independent **Facebook Prophet** models were trained on a historical pizza sales dataset of **48,620 records** from 2015 (Kaggle).

| Model | Accuracy | MAPE | MAE | RMSE | Status |
|---|---|---|---|---|---|
| **Veggie** | 81.2% | 18.8% | 5.2 | 6.8 | ✅ Excellent |
| **Chicken** | 79.9% | 20.1% | 5.3 | 6.6 | ✅ Good |
| **Classic** | 77.4% | 22.6% | 7.9 | 9.3 | ✅ Good |
| **Supreme** | 72.8% | 27.2% | 6.3 | 8.0 | ✅ Good |
| **Global (Baseline)** | 84.6% | 15.4% | — | — | 📊 Baseline |
| **Average Category** | **77.8%** | — | — | — | — |

**Model Configuration:**
- `weekly_seasonality = True` — captures Friday peak / Sunday trough
- `yearly_seasonality = False` — single year of data only
- `changepoint_prior_scale = 0.05` — prevents overfitting
- `seasonality_mode = 'additive'`
- Custom monthly seasonality: `add_seasonality(name='monthly', period=30.5, fourier_order=3)`
- Evaluation: **28-day hold-out test split** (4 full weekly cycles), zero-sales days excluded from MAPE

**14-Day Forecast Output (from 31 Dec 2015):**
- Total predicted: **1,858 pizzas** across all categories
- Daily average: **133 pizzas/day**
- Busiest day: **Friday — 148 pizzas**

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React.js, React Router, Axios, Recharts | Customer & Admin UI |
| **Backend** | Node.js, Express.js, Mongoose, Multer | API routing, business logic, image uploads |
| **Database** | MongoDB Atlas (Cloud) | All system collections |
| **AI / ML Service** | Python, Facebook Prophet, Pandas, Flask | Sales forecasting model & REST API |
| **Authentication** | JWT (jsonwebtoken), bcryptjs | Secure role-based access control |
| **Payment** | PayPal Sandbox SDK | Online payment processing |
| **Model Training** | Google Colab | Cloud-based Prophet model training |
| **Version Control** | GitHub | Source code management |
| **IDE** | Visual Studio Code | Primary development environment |

---

## 🏗 System Architecture

The system uses a **three-tier decoupled microservice architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Presentation Layer (React.js)                │
│    Admin Side: Dashboard · Menu Mgmt · AI Forecast View        │
│    Client Side: Home · Menu · Cart · Chatbot · Profile         │
└────────────────────────┬────────────────────────────────────────┘
                         │ Axios (REST API calls)
                         │ Port 3000 → 5000 / 5001
┌────────────────────────▼────────────────────────────────────────┐
│              Application Layer (Node.js + Express.js)           │
│         Business Logic Controller · JWT Auth Service           │
└────────────┬───────────────────────────────┬───────────────────┘
             │ Mongoose ODM                  │ HTTP (Axios)
┌────────────▼───────────────┐  ┌────────────▼──────────────────┐
│  Data Layer (MongoDB Atlas) │  │  Intelligence Layer (Flask)   │
│  admins · customers · pizza │  │  Prophet Models (pkl)         │
│  offers · orders · chatbot  │  │  GET /forecast · /accuracy    │
│  chatbotlogs                │  │  GET /predict?day=N · /health │
└─────────────────────────────┘  └───────────────────────────────┘
```

**Ports:**
- `3000` — React.js Frontend
- `5000` — Node.js / Express.js Backend
- `5001` — Python / Flask AI Microservice

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js v18+](https://nodejs.org)
- [Python v3.10+](https://python.org)
- [npm v9+](https://www.npmjs.com) (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge)
- A stable internet connection (MongoDB Atlas + PayPal Sandbox)

### Minimum Hardware Specs

| Component | Minimum |
|---|---|
| Processor | Intel Core i5 or equivalent |
| RAM | 8 GB (16 GB recommended) |
| Storage | 10 GB free disk space |
| OS | Windows 10/11 or macOS |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/malindusachinthana/AI-based-pizza-sales-prediction-system-and-customer-support-web-platform-final.git
cd AI-based-pizza-sales-prediction-system-and-customer-support-web-platform-final
```

### Step 2 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3 — Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4 — Set Up Python Virtual Environment (Flask AI Service)

```bash
cd ../ml-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install flask flask-cors prophet pandas numpy scikit-learn
```

---

## ▶️ Running the System

Open **three separate terminal windows** simultaneously — one per service:

| Terminal | Service | Directory | Command | Port |
|---|---|---|---|---|
| Terminal 1 | Backend (Node.js) | `backend/` | `node server.js` | 5000 |
| Terminal 2 | Frontend (React.js) | `frontend/` | `npm start` | 3000 |
| Terminal 3 | Flask AI Service | `ml-service/` | `python api.py` | 5001 |

Once all three are running, open your browser and navigate to:

```
http://localhost:3000
```

---

## 🔐 Access Credentials

| Role | Username | Password |
|---|---|---|
| **Admin** | `OvZa_Admin@2025` | `Ov3nZ@Cru$t!2025#` |
| **Customer** | Register a new account via `/register` | Set during registration |

---

## 📁 Project Structure

```
ovenza-crust/
├── frontend/                  # React.js application (port 3000)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── client/        # CustomerHome, Menu, Cart, Profile, Offers, Gallery, AboutUs
│   │   │   ├── admin/         # AdminDashboard, SalesForecast
│   │   │   ├── login.jsx
│   │   │   └── register.jsx
│   │   ├── components/        # Navbar, Footer, Chatbot
│   │   ├── style/             # CSS files per page
│   │   ├── assets/            # Images, icons, logos
│   │   └── context/           # CartContext
│
├── backend/                   # Node.js / Express.js API (port 5000)
│   ├── controllers/           # Auth, Pizza, Offers, Orders, Chatbot, Admin
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express route handlers
│   ├── middleware/            # JWT auth middleware
│   ├── uploads/               # Multer-stored pizza/offer images
│   └── server.js
│
├── ml-service/                # Python / Flask AI microservice (port 5001)
│   ├── models/
│   │   └── category_daily_models_v2.pkl   # Serialized Prophet models
│   ├── api.py                 # Flask REST API (4 endpoints)
│   └── requirements.txt
│
└── README.md
```

---

## 🧪 Test Results

**31 functional test cases executed — 100% pass rate**

| Module | Test Cases | Result |
|---|---|---|
| User Authentication (TC-AUTH) | 5 | ✅ All Passed |
| Customer Menu (TC-MENU) | 4 | ✅ All Passed |
| Cart & Payment (TC-CART) | 5 | ✅ All Passed |
| Customer Profile (TC-PROF) | 3 | ✅ All Passed |
| Customer Chatbot (TC-CHAT) | 3 | ✅ All Passed |
| AI Sales Forecast (TC-AI) | 4 | ✅ All Passed |
| Pizza Menu Management (TC-PIZZA) | 2 | ✅ All Passed |
| Special Offers Management (TC-OFFER) | 1 | ✅ All Passed |
| Chatbot Management (TC-CBMGMT) | 2 | ✅ All Passed |
| Admin Dashboard (TC-DASH) | 2 | ✅ All Passed |

---

## 🔌 Flask API Endpoints

Base URL: `http://localhost:5001`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/forecast` | Returns 14-day predictions for all 4 categories |
| `GET` | `/predict?day=N` | Returns prediction for a specific day (1–14) |
| `GET` | `/accuracy` | Returns pre-calculated MAE, RMSE, MAPE, Accuracy per model |
| `GET` | `/health` | Returns API status, last training date, categories |

---

## 📸 Screenshots

> Full-resolution screenshots of all modules are available in the project report (Appendix I) and the project video.

| Module | Description |
|---|---|
| Customer Home | Full-viewport hero, floating pizza section, about, menu, offers, gallery |
| Login Page | Full-viewport wood-fired oven background with centered login form |
| Admin Dashboard | Live stats cards, weekly sales chart (UTC+5:30), AI forecast preview, top-3 pizzas |
| AI Sales Forecast | 14-Day stacked area chart, daily breakdown table, model accuracy bar chart |
| Customer Chatbot | Floating bubble with live DB queries for cheapest/most expensive/best-selling pizza |
| Cart & Payment | localStorage-persisted cart, PayPal Sandbox integration |

---

## 🔮 Future Implementations

- Incorporate external regressors into Prophet (public holidays, weather, promotional campaigns) to improve forecast accuracy
- Add a lightweight NLP layer to the chatbot for free-text customer input with rule-based fallback
- Extend payment to support Sri Lankan local banking integrations (beyond PayPal)
- Develop a mobile application version for the customer-facing platform (given high mobile internet penetration in Sri Lanka)

---

## 📜 License

This project was developed as a final year academic submission for the **BSc (Hons) Software Engineering** degree at the **University of Plymouth**, affiliated with **NSBM Green University, Sri Lanka**.

> Dataset sourced from [Kaggle — Open Source Pizza Sales Dataset](https://www.kaggle.com)  
> PayPal integration uses Sandbox (test) credentials only.

---

<div align="center">

Made with 🍕 by **Malindu Sachinthana** — OvenZa Crust © 2026

</div>
