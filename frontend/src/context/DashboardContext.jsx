import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : window.location.origin;

// Frontend Failsafe Fallback Mock Data
const fallbackDashboardData = {
  summary: {
    revenue: { value: 178491180, change: 14.2, target: 200000000 },
    salesVolume: { value: 366980, change: 8.7, target: 400000 },
    averageOrderValue: { value: 486.38, change: 5.1 },
    conversionRate: { value: 3.42, change: 0.8 }
  },
  monthlyPerformance: [
    { month: "Jun 24", actualSales: 12000000, legacyForecast: 10500000, optimizedForecast: 11800000, target: 11500000 },
    { month: "Jul 24", actualSales: 13500000, legacyForecast: 11800000, optimizedForecast: 13200000, target: 12500000 },
    { month: "Aug 24", actualSales: 14200000, legacyForecast: 12000000, optimizedForecast: 14000000, target: 13000000 },
    { month: "Sep 24", actualSales: 15800000, legacyForecast: 13500000, optimizedForecast: 15500000, target: 14500000 },
    { month: "Oct 24", actualSales: 16500000, legacyForecast: 18200000, optimizedForecast: 16800000, target: 15000000 },
    { month: "Nov 24", actualSales: 19500000, legacyForecast: 16500000, optimizedForecast: 19200000, target: 18000000 },
    { month: "Dec 24", actualSales: 24000000, legacyForecast: 21000000, optimizedForecast: 23500000, target: 22000000 },
    { month: "Jan 25", actualSales: 15000000, legacyForecast: 13000000, optimizedForecast: 14800000, target: 14000000 },
    { month: "Feb 25", actualSales: 14500000, legacyForecast: 16500000, optimizedForecast: 14700000, target: 14000000 },
    { month: "Mar 25", actualSales: 17000000, legacyForecast: 14800000, optimizedForecast: 16800000, target: 16000000 },
    { month: "Apr 25", actualSales: 18500000, legacyForecast: 16000000, optimizedForecast: 18200000, target: 17500000 },
    { month: "May 25", actualSales: 21000000, legacyForecast: 18500000, optimizedForecast: 20800000, target: 20000000 }
  ],
  products: [
    { id: "AP001", name: "Amul Butter (500g)", category: "Dairy & FMCG", price: 275.00, stock: 4500, sales: 14200, revenue: 3905000, rating: 4.8, status: "In Stock" },
    { id: "AP002", name: "Tata Salt (1kg)", category: "Food & FMCG", price: 28.00, stock: 12000, sales: 98000, revenue: 2744000, rating: 4.6, status: "In Stock" },
    { id: "AP003", name: "Royal Enfield Classic 350", category: "Automotive", price: 220000.00, stock: 12, sales: 320, revenue: 70400000, rating: 4.7, status: "Low Stock" },
    { id: "AP004", name: "Britannia Good Day Biscuits", category: "Food & FMCG", price: 50.00, stock: 21000, sales: 145000, revenue: 7250000, rating: 4.5, status: "In Stock" },
    { id: "AP005", name: "Fabindia Cotton Kurta", category: "Apparel & Fashion", price: 1899.00, stock: 140, sales: 1820, revenue: 3456180, rating: 4.4, status: "In Stock" },
    { id: "AP006", name: "Maggi 2-Min Noodles (12-Pack)", category: "Food & FMCG", price: 168.00, stock: 0, sales: 89000, revenue: 14952000, rating: 4.8, status: "Out of Stock" },
    { id: "AP007", name: "Bajaj Pulsar 150", category: "Automotive", price: 115000.00, stock: 35, sales: 640, revenue: 73600000, rating: 4.5, status: "In Stock" },
    { id: "AP008", name: "Himalaya Neem Face Wash (150ml)", category: "Beauty & Health", price: 195.00, stock: 9000, sales: 11200, revenue: 2184000, rating: 4.6, status: "In Stock" }
  ],
  recentTransactions: [
    { id: "TX9824", customer: "Rohan Sharma", items: 3, total: 14550.00, time: "10 mins ago", status: "Completed" },
    { id: "TX9823", customer: "Deepak Verma", items: 1, total: 8999.00, time: "24 mins ago", status: "Completed" },
    { id: "TX9822", customer: "Anjali Gupta", items: 5, total: 31240.00, time: "45 mins ago", status: "Processing" },
    { id: "TX9821", customer: "Sanjay Mehta", items: 2, total: 6400.00, time: "1 hour ago", status: "Completed" },
    { id: "TX9820", customer: "Priya Iyer", items: 1, total: 12000.00, time: "2 hours ago", status: "Completed" }
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
