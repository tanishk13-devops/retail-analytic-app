import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : window.location.origin;

// Frontend Failsafe Fallback Mock Data
const fallbackDashboardData = {
  summary: {
    revenue: { value: 658480, change: 14.2, target: 650000 },
    salesVolume: { value: 9640, change: 8.7, target: 10000 },
    averageOrderValue: { value: 68.31, change: 5.1 },
    conversionRate: { value: 3.42, change: 0.8 }
  },
  monthlyPerformance: [
    { month: "Jun 24", actualSales: 120000, legacyForecast: 105000, optimizedForecast: 118000, target: 115000 },
    { month: "Jul 24", actualSales: 135000, legacyForecast: 118000, optimizedForecast: 132000, target: 125000 },
    { month: "Aug 24", actualSales: 142000, legacyForecast: 120000, optimizedForecast: 140000, target: 130000 },
    { month: "Sep 24", actualSales: 158000, legacyForecast: 135000, optimizedForecast: 155000, target: 145000 },
    { month: "Oct 24", actualSales: 165000, legacyForecast: 182000, optimizedForecast: 168000, target: 150000 },
    { month: "Nov 24", actualSales: 195000, legacyForecast: 165000, optimizedForecast: 192000, target: 180000 },
    { month: "Dec 24", actualSales: 240000, legacyForecast: 210000, optimizedForecast: 235000, target: 220000 },
    { month: "Jan 25", actualSales: 150000, legacyForecast: 130000, optimizedForecast: 148000, target: 140000 },
    { month: "Feb 25", actualSales: 145000, legacyForecast: 165000, optimizedForecast: 147000, target: 140000 },
    { month: "Mar 25", actualSales: 170000, legacyForecast: 148000, optimizedForecast: 168000, target: 160000 },
    { month: "Apr 25", actualSales: 185000, legacyForecast: 160000, optimizedForecast: 182000, target: 175000 },
    { month: "May 25", actualSales: 210000, legacyForecast: 185000, optimizedForecast: 208000, target: 200000 }
  ],
  products: [
    { id: "P001", name: "AeroFit Wireless Earbuds", category: "Electronics", price: 89.99, stock: 45, sales: 1420, revenue: 127785.80, rating: 4.6, status: "In Stock" },
    { id: "P002", name: "Veloce Running Shoes", category: "Fashion", price: 120.00, stock: 12, sales: 980, revenue: 117600.00, rating: 4.4, status: "Low Stock" },
    { id: "P003", name: "Ember Ceramic Coffee Mug", category: "Home & Kitchen", price: 24.50, stock: 210, sales: 2450, revenue: 60025.00, rating: 4.8, status: "In Stock" },
    { id: "P004", name: "Peak Ergonomic Chair", category: "Home & Kitchen", price: 349.99, stock: 4, sales: 320, revenue: 111996.80, rating: 4.5, status: "Low Stock" },
    { id: "P005", name: "HydraFlow Stainless Bottle", category: "Sports & Outdoors", price: 32.00, stock: 148, sales: 1820, revenue: 58240.00, rating: 4.7, status: "In Stock" },
    { id: "P006", name: "LumiGlow Facial Serum", category: "Beauty & Health", price: 45.00, stock: 0, sales: 890, revenue: 40050.00, rating: 4.3, status: "Out of Stock" },
    { id: "P007", name: "Quantum Smart Watch", category: "Electronics", price: 199.99, stock: 35, sales: 640, revenue: 127993.60, rating: 4.5, status: "In Stock" },
    { id: "P008", name: "FlexiCore Yoga Mat", category: "Sports & Outdoors", price: 39.99, stock: 90, sales: 1120, revenue: 44788.80, rating: 4.6, status: "In Stock" }
  ],
  recentTransactions: [
    { id: "TX1084", customer: "Sarah Jenkins", items: 3, total: 145.50, time: "10 mins ago", status: "Completed" },
    { id: "TX1083", customer: "David Miller", items: 1, total: 89.99, time: "24 mins ago", status: "Completed" },
    { id: "TX1082", customer: "Emma Watson", items: 5, total: 312.40, time: "45 mins ago", status: "Processing" },
    { id: "TX1081", customer: "James Smith", items: 2, total: 64.00, time: "1 hour ago", status: "Completed" },
    { id: "TX1080", customer: "Sophia Rodriguez", items: 1, total: 120.00, time: "2 hours ago", status: "Completed" }
  ]
};

const clientGenerateSimulation = (marketingSpend, discountLevel, seasonalityFactor) => {
  const baseSales = [4200, 4500, 4100, 4800, 5200, 5800, 4900, 4600, 5100, 5500, 6000, 6200];
  const chartData = baseSales.map((base, index) => {
    const day = `Day ${index + 1}`;
    const actualSales = Math.round((base + marketingSpend * 0.15 + discountLevel * 35) * seasonalityFactor);
    const legacyNoise = (Math.sin(index) * 0.14 + 0.06); 
    const legacySales = Math.round((base + 5000 * 0.10 + 10 * 25) * (1 + legacyNoise));
    const optimizedNoise = (Math.sin(index * 2) * 0.025);
    const optimizedSales = Math.round((base + marketingSpend * 0.146 + discountLevel * 34.2) * seasonalityFactor * (1 + optimizedNoise));
    return { day, actual: actualSales, legacy: legacySales, optimized: optimizedSales };
  });

  let legacyError = 0;
  let optimizedError = 0;
  chartData.forEach(d => {
    legacyError += Math.abs(d.actual - d.legacy) / d.actual;
    optimizedError += Math.abs(d.actual - d.optimized) / d.actual;
  });

  const legacyMAPE = (legacyError / chartData.length) * 100;
  const optimizedMAPE = (optimizedError / chartData.length) * 100;
  const accuracyImprovement = ((legacyMAPE - optimizedMAPE) / legacyMAPE) * 100;

  return {
    chartData,
    metrics: {
      legacyMAPE: parseFloat(legacyMAPE.toFixed(2)),
      optimizedMAPE: parseFloat(optimizedMAPE.toFixed(2)),
      accuracyImprovement: parseFloat(accuracyImprovement.toFixed(2))
    }
  };
};

export const DashboardProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(fallbackDashboardData);
  const [forecastComparisonData, setForecastComparisonData] = useState({
    chartData: [],
    metrics: { legacyMAPE: 15.15, optimizedMAPE: 11.95, accuracyImprovement: 21.12 }
  });
  
  // Simulator parameters
  const [simulatorParams, setSimulatorParams] = useState({
    marketingSpend: 5000,
    discountLevel: 10,
    seasonalityFactor: 1.0
  });
  const [activePreset, setActivePreset] = useState('default');
  const [simulationData, setSimulationData] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch Dashboard Stats & Product Table Data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setIsBackendConnected(true);
      } else {
        throw new Error('Server error response');
      }
    } catch (error) {
      console.warn('Backend API connection failed, using frontend client mock fallback data:', error);
      setDashboardData(fallbackDashboardData);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Historical Forecasting Comparison
  const fetchForecastComparison = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/forecast/comparison`);
      if (response.ok) {
        const data = await response.json();
        setForecastComparisonData(data);
      } else {
        throw new Error('Server error response');
      }
    } catch (error) {
      // Client-side computation fallback
      const data = [
        { name: "Week 1", actual: 45000, legacy: 39000, optimized: 44200 },
        { name: "Week 2", actual: 48000, legacy: 54000, optimized: 47100 },
        { name: "Week 3", actual: 42000, legacy: 36000, optimized: 42800 },
        { name: "Week 4", actual: 51000, legacy: 44000, optimized: 50200 },
        { name: "Week 5", actual: 49000, legacy: 56000, optimized: 48500 },
        { name: "Week 6", actual: 55000, legacy: 47000, optimized: 54100 },
        { name: "Week 7", actual: 53000, legacy: 61000, optimized: 52400 },
        { name: "Week 8", actual: 58000, legacy: 50000, optimized: 57900 }
      ];
      setForecastComparisonData({
        chartData: data,
        metrics: { legacyMAPE: 15.15, optimizedMAPE: 11.95, accuracyImprovement: 21.12 }
      });
    }
  };

  // Run dynamic Simulation API
  const runSimulation = async (params = simulatorParams) => {
    setIsSimulating(true);
    const { marketingSpend, discountLevel, seasonalityFactor } = params;
    
    // Simulate minor delay for premium UI feel
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const query = `marketingSpend=${marketingSpend}&discountLevel=${discountLevel}&seasonalityFactor=${seasonalityFactor}`;
      const response = await fetch(`${BACKEND_URL}/api/forecast/simulate?${query}`);
      if (response.ok) {
        const data = await response.json();
        setSimulationData(data);
      } else {
        throw new Error('Simulation endpoint failed');
      }
    } catch (error) {
      // Frontend client-side fallback simulation logic
      const result = clientGenerateSimulation(marketingSpend, discountLevel, seasonalityFactor);
      setSimulationData(result);
    } finally {
      setIsSimulating(false);
    }
  };

  // Trigger loading initial dataset
  useEffect(() => {
    fetchDashboardData();
    fetchForecastComparison();
  }, []);

  // Run initial simulation on boot
  useEffect(() => {
    runSimulation();
  }, [isBackendConnected]);

  // Handle Preset Selections
  const applyPreset = (presetName) => {
    setActivePreset(presetName);
    let newParams = { marketingSpend: 5000, discountLevel: 10, seasonalityFactor: 1.0 };
    
    switch (presetName) {
      case 'blackfriday':
        newParams = { marketingSpend: 15000, discountLevel: 30, seasonalityFactor: 1.6 };
        break;
      case 'summersale':
        newParams = { marketingSpend: 8000, discountLevel: 15, seasonalityFactor: 1.25 };
        break;
      case 'recession':
        newParams = { marketingSpend: 1500, discountLevel: 5, seasonalityFactor: 0.75 };
        break;
      default:
        newParams = { marketingSpend: 5000, discountLevel: 10, seasonalityFactor: 1.0 };
    }
    
    setSimulatorParams(newParams);
    runSimulation(newParams);
  };

  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      timeRange,
      setTimeRange,
      loading,
      dashboardData,
      forecastComparisonData,
      simulatorParams,
      setSimulatorParams,
      activePreset,
      applyPreset,
      simulationData,
      isSimulating,
      runSimulation,
      isBackendConnected,
      refreshData: fetchDashboardData
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
