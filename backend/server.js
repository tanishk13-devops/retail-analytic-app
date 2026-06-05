import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getHistoricalForecastComparison, generateSimulationForecast } from './services/forecastingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Mock Sales Data Helper
const getMockData = () => {
  const filePath = path.join(__dirname, 'data', 'mockSalesData.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading mock data file:', error);
    return { monthlyPerformance: [], products: [], recentTransactions: [] };
  }
};

// Main Dashboard API
app.get('/api/dashboard', (req, res) => {
  const mockData = getMockData();
  
  const totalRevenue = mockData.products.reduce((acc, p) => acc + p.revenue, 0);
  const totalSales = mockData.products.reduce((acc, p) => acc + p.sales, 0);
  const avgOrderValue = totalRevenue / totalSales;
  
  const summary = {
    revenue: {
      value: Math.round(totalRevenue),
      change: 14.2,
      target: 650000
    },
    salesVolume: {
      value: totalSales,
      change: 8.7,
      target: 10000
    },
    averageOrderValue: {
      value: parseFloat(avgOrderValue.toFixed(2)),
      change: 5.1
    },
    conversionRate: {
      value: 3.42,
      change: 0.8
    }
  };

  res.json({
    summary,
    monthlyPerformance: mockData.monthlyPerformance,
    products: mockData.products,
    recentTransactions: mockData.recentTransactions
  });
});

// Forecasting Comparison API
app.get('/api/forecast/comparison', (req, res) => {
  const comparison = getHistoricalForecastComparison();
  res.json(comparison);
});

// Dynamic What-If Forecast Simulator API
app.get('/api/forecast/simulate', (req, res) => {
  const marketingSpend = parseFloat(req.query.marketingSpend) || 5000;
  const discountLevel = parseFloat(req.query.discountLevel) || 10;
  const seasonalityFactor = parseFloat(req.query.seasonalityFactor) || 1.0;

  const simulation = generateSimulationForecast(marketingSpend, discountLevel, seasonalityFactor);
  res.json(simulation);
});

// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve React index.html for client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
