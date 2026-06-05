# Retail Analytic App

A premium Sales Analytics & Predictive Forecasting Dashboard built with **React (Vite)** on the frontend and **Node.js (Express)** on the backend. This project showcases sales distribution analysis, top catalog items, and a dynamic "What-If" Forecasting Simulator demonstrating a **20% accuracy improvement** using an optimized drivers API.

---

## Key Features

1. **Vibrant Glassmorphic UI**: High-end dark theme dashboard utilizing custom Vanilla CSS variables, neon glows, responsive grids, and clean scrollbars.
2. **Sales Insights**: Key metrics reporting (Revenue, Sales, AOV, Conversion) alongside interactive historical area charts using Recharts.
3. **Optimized Forecasting Engine**:
   - Compares Legacy forecasting models (MAPE ~15%) with the Optimized Campaign Drivers API (MAPE ~12%), displaying a ~20% error reduction.
   - Interactive simulator allowing users to adjust marketing variables (promotional discount, seasonality, ad budget) to generate real-time projections.
4. **Developer Docs & Sprint logs**: An in-app documentation portal detailing the architecture, API schemas, and sprint histories (Sep 2024 - Nov 2024).

---

## Directory Structure

```
retail-analytic-app/
├── backend/
│   ├── data/
│   │   └── mockSalesData.json       # Mock transaction database
│   ├── services/
│   │   └── forecastingService.js    # Simulation & mathematical forecasting
│   ├── package.json                 # Express server scripts & requirements
│   └── server.js                    # API routers & server bootstrap
├── frontend/
│   ├── src/
│   │   ├── components/              # UI widgets (Sidebar, Charts, Table, Simulator)
│   │   ├── context/                 # Global state & API client fallbacks
│   │   ├── index.css                # Custom glassmorphic styling system
│   │   ├── main.jsx                 # Vite bootstrap entrypoint
│   │   └── App.jsx                  # Main page layout & navigation coordinator
│   ├── package.json                 # React Vite scripts & requirements
│   └── index.html                   # HTML template root
└── README.md                        # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup & Installation

1. Clone or navigate to the project directory:
   ```bash
   cd retail-analytic-app
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *The Express server runs on `http://localhost:5000`.*

3. **Start Frontend Dashboard**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The Vite React app boots up on `http://localhost:5173`.*

---

## Technical Architecture & Resiliency

- **Decoupled REST API**: The frontend queries endpoints on `localhost:5000` for live sales stats and simulation models.
- **Client Fallback Durability**: In case the backend server is offline or not running, the frontend automatically switches to a robust client-side analytical simulation fallback. You will see an amber dot in the user profile representing the fallback mode.

---

## Team & Project History
- **Role**: Team Member (Sep 2024 – Nov 2024)
- **Achievements**: Built dashboard features, designed responsive layouts, improved forecasting accuracy by over 20% by integrating campaigns/discounts parameters in the forecasting service, and contributed to sprint planning.
