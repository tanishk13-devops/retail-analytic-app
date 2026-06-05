import React from 'react';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import AnalyticsCharts from './components/AnalyticsCharts';
import ForecastSimulator from './components/ForecastSimulator';
import ProductTable from './components/ProductTable';
import DocumentationView from './components/DocumentationView';
import { RefreshCw } from 'lucide-react';

function DashboardContent() {
  const { activeTab, timeRange, setTimeRange, loading, refreshData } = useDashboard();

  const renderHeader = (title, subtitle, showTimeRange = false) => (
    <header className="header fade-in">
      <div className="header-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        {showTimeRange && (
          <div className="time-selector">
            <button 
              className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7d
            </button>
            <button 
              className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30d
            </button>
            <button 
              className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
              onClick={() => setTimeRange('90d')}
            >
              90d
            </button>
          </div>
        )}
        <button 
          onClick={refreshData}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-secondary)',
            padding: '0.55rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
          className="time-btn"
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            {renderHeader("Sales Analytics Dashboard", "Real-time revenue metrics, product listings, and model accuracy comparisons.", true)}
            <SummaryCards />
            <AnalyticsCharts />
            <ProductTable />
          </>
        )}

        {activeTab === 'simulator' && (
          <>
            {renderHeader("Forecasting What-If Simulator", "Adjust dynamic drivers to model actual retail demand vs predictions.")}
            <ForecastSimulator />
          </>
        )}

        {activeTab === 'docs' && (
          <>
            {renderHeader("Documentation & Sprint Planning", "API specifications, system architecture designs, and collaborative sprint logs.")}
            <DocumentationView />
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

export default App;
