import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { LayoutDashboard, TrendingUp, BookOpen } from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, isBackendConnected } = useDashboard();

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <TrendingUp size={22} style={{ strokeWidth: 2.5 }} />
        </div>
        <span className="sidebar-logo-text">RetailAnalytica</span>
      </div>

      <nav className="sidebar-nav">
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="nav-item-icon" />
          <span>Dashboard</span>
        </div>
        
        <div 
          className={`nav-item ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          <TrendingUp className="nav-item-icon" />
          <span>Forecast Simulator</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <BookOpen className="nav-item-icon" />
          <span>Docs & Sprint Logs</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">TJ</div>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <span className="user-info-name">Tanishk Jaiswal</span>
          <span className="user-info-role">Lead Analyst</span>
        </div>
        <div 
          className="api-status" 
          title={isBackendConnected ? "Connected to Express Backend API" : "Backend offline, running on client mock fallback"}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isBackendConnected ? 'var(--accent-green)' : 'var(--accent-amber)',
            boxShadow: isBackendConnected ? '0 0 10px var(--accent-green)' : '0 0 10px var(--accent-amber)',
            animation: 'pulse 1.8s infinite ease-in-out'
          }}></span>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.25); opacity: 1; box-shadow: 0 0 14px var(--accent-green); }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </aside>
  );
}
