import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Sliders, Sparkles, RefreshCw } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {payload.map((item, idx) => (
          <div key={idx} className="custom-tooltip-item">
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              backgroundColor: item.color 
            }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>{item.name}:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              ₹{item.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastSimulator() {
  const {
    simulatorParams,
    setSimulatorParams,
    activePreset,
    applyPreset,
    simulationData,
    isSimulating,
    runSimulation
  } = useDashboard();

  const handleSliderChange = (key, value) => {
    const newParams = { ...simulatorParams, [key]: value };
    setSimulatorParams(newParams);
  };

  const triggerSimulation = () => {
    runSimulation(simulatorParams);
  };

  return (
    <div className="simulator-layout fade-in">
      {/* Control Panel */}
      <div className="simulator-controls glass-panel">
        <div className="simulator-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--accent-cyan)' }} />
            Simulation Inputs
          </h2>
          <p>Adjust market variables to run forecasts</p>
        </div>

        <div className="control-group">
          <div className="control-label-wrapper">
            <span className="control-label">Marketing Spend</span>
            <span className="control-value">₹{simulatorParams.marketingSpend.toLocaleString('en-IN')}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="500"
            value={simulatorParams.marketingSpend} 
            onChange={(e) => handleSliderChange('marketingSpend', parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-label-wrapper">
            <span className="control-label">Promotional Discount</span>
            <span className="control-value">{simulatorParams.discountLevel}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="50" 
            step="1"
            value={simulatorParams.discountLevel} 
            onChange={(e) => handleSliderChange('discountLevel', parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-label-wrapper">
            <span className="control-label">Seasonal Multiplier</span>
            <span className="control-value">{simulatorParams.seasonalityFactor.toFixed(2)}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.05"
            value={simulatorParams.seasonalityFactor} 
            onChange={(e) => handleSliderChange('seasonalityFactor', parseFloat(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="presets-container">
          <span className="doc-nav-title" style={{ paddingLeft: 0, marginTop: '0.5rem' }}>Quick Presets</span>
          <button 
            className={`preset-btn ${activePreset === 'default' ? 'active' : ''}`}
            onClick={() => applyPreset('default')}
          >
            Baseline Scenario (Default)
          </button>
          <button 
            className={`preset-btn ${activePreset === 'blackfriday' ? 'active' : ''}`}
            onClick={() => applyPreset('blackfriday')}
          >
            Black Friday (High Demand)
          </button>
          <button 
            className={`preset-btn ${activePreset === 'summersale' ? 'active' : ''}`}
            onClick={() => applyPreset('summersale')}
          >
            Summer Clearance
          </button>
          <button 
            className={`preset-btn ${activePreset === 'recession' ? 'active' : ''}`}
            onClick={() => applyPreset('recession')}
          >
            Market Slowdown (Recession)
          </button>
        </div>

        <button className="run-sim-btn" onClick={triggerSimulation}>
          Run Forecast Projection
        </button>
      </div>

      {/* Output Panel */}
      <div className="simulator-output">
        <div className="simulator-stats">
          <div className="stat-item legacy">
            <div className="stat-item-label">Legacy Error Rate</div>
            <div className="stat-item-value">
              {isSimulating ? '...' : `${simulationData?.metrics?.legacyMAPE || 0}%`}
            </div>
            <div className="stat-item-sub">MAPE without drivers API</div>
          </div>
          <div className="stat-item optimized">
            <div className="stat-item-label">Optimized Error Rate</div>
            <div className="stat-item-value" style={{ color: 'var(--accent-cyan)' }}>
              {isSimulating ? '...' : `${simulationData?.metrics?.optimizedMAPE || 0}%`}
            </div>
            <div className="stat-item-sub">MAPE with optimized drivers</div>
          </div>
          <div className="stat-item comparison">
            <div className="stat-item-label">Accuracy Improvement</div>
            <div className="stat-item-value" style={{ color: 'var(--accent-green)' }}>
              {isSimulating ? '...' : `+${simulationData?.metrics?.accuracyImprovement || 0}%`}
            </div>
            <div className="stat-item-sub">Relative error reduction</div>
          </div>
        </div>

        <div className="visual-chart-card glass-panel" style={{ flexGrow: 1 }}>
          <div className="chart-header">
            <div>
              <h2 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} />
                12-Day Simulated Outlook
              </h2>
              <p className="chart-subtitle">Comparing model reaction to inputs</p>
            </div>
            {isSimulating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                <RefreshCw size={14} className="loader" style={{ animation: 'rotation 1s linear infinite' }} />
                Simulating...
              </div>
            )}
          </div>

          <div className="chart-container-wrapper" style={{ minHeight: '300px' }}>
            {!isSimulating && simulationData?.chartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulationData.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={11}
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Simulated Actual Sales" 
                    stroke="var(--text-primary)" 
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: 'var(--bg-primary)', strokeWidth: 2, fill: 'var(--text-primary)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="legacy" 
                    name="Legacy Forecast (Constant Drivers)" 
                    stroke="var(--accent-pink)" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: 'var(--accent-pink)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimized" 
                    name="Optimized Forecast (Live Drivers API)" 
                    stroke="var(--accent-cyan)" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: 'var(--accent-cyan)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="loader-container">
                <span className="loader"></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
