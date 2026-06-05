import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { AlertCircle, Target, Sparkles } from 'lucide-react';

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
              {typeof item.value === 'number' && (item.name.toLowerCase().includes('sales') || item.name.toLowerCase().includes('target') || item.name.toLowerCase().includes('forecast') || item.name.toLowerCase().includes('revenue'))
                ? `₹${item.value.toLocaleString('en-IN')}`
                : item.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts() {
  const { dashboardData, forecastComparisonData } = useDashboard();
  const { monthlyPerformance, products } = dashboardData;

  // Process data for category sales
  const categoryDataMap = {};
  products.forEach(p => {
    if (categoryDataMap[p.category]) {
      categoryDataMap[p.category] += p.revenue;
    } else {
      categoryDataMap[p.category] = p.revenue;
    }
  });

  const categoryChartData = Object.keys(categoryDataMap).map(cat => ({
    category: cat,
    revenue: Math.round(categoryDataMap[cat])
  }));

  const { metrics } = forecastComparisonData;

  return (
    <div className="charts-grid fade-in" style={{ animationDelay: '0.15s' }}>
      {/* Sales Trend Chart */}
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Revenue & Target Trends</h2>
            <p className="chart-subtitle">Monthly sales performance against targets</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }}></span>
              Actual Sales
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-purple)' }}></span>
              Target
            </span>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
              <XAxis 
                dataKey="month" 
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
                tickFormatter={(value) => `₹${value / 100000}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="actualSales" 
                name="Actual Sales" 
                stroke="var(--accent-cyan)" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
              <Area 
                type="monotone" 
                dataKey="target" 
                name="Monthly Target" 
                stroke="var(--accent-purple)" 
                strokeDasharray="4 4"
                strokeWidth={1.5} 
                fillOpacity={1} 
                fill="url(#colorTarget)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Sales Distribution */}
      <div className="chart-card glass-panel">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Revenue by Category</h2>
            <p className="chart-subtitle">Sales distribution across categories</p>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
              <XAxis 
                dataKey="category" 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value / 100000}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                name="Revenue" 
                radius={[4, 4, 0, 0]}
                fill="var(--accent-purple)"
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecasting Accuracy Comparison Chart */}
      <div className="chart-card glass-panel" style={{ gridColumn: '1 / -1', minHeight: '400px' }}>
        <div className="chart-header">
          <div>
            <h2 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} className="text-cyan" style={{ color: 'var(--accent-cyan)' }} />
              Forecasting Model Optimization
            </h2>
            <p className="chart-subtitle">Comparing legacy forecasting against the optimized API forecasting engine</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Legacy Error Rate</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-pink)', fontFamily: 'var(--font-mono)' }}>
                {metrics?.legacyMAPE}% MAPE
              </div>
            </div>
            <div style={{ borderRight: '1px solid var(--glass-border)' }}></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Optimized Error Rate</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {metrics?.optimizedMAPE}% MAPE
              </div>
            </div>
            <div style={{ borderRight: '1px solid var(--glass-border)' }}></div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600 }}>Accuracy Boost</div>
              <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                +{metrics?.accuracyImprovement}%
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Alert Callout */}
        <div className="accuracy-callout">
          <div className="accuracy-label">
            <AlertCircle size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>
              <strong>Forecast Accuracy Improvement:</strong> By integrating real-time campaign modifiers (promotions, seasonality, spend) into our optimized model API, we cut predictive error by over 20%.
            </span>
          </div>
        </div>

        <div className="chart-container-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" vertical={false} />
              <XAxis 
                dataKey="month" 
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
                tickFormatter={(value) => `₹${value / 100000}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="actualSales" 
                name="Actual Sales" 
                stroke="var(--text-primary)" 
                strokeWidth={2.5}
                dot={{ r: 4, stroke: 'var(--bg-primary)', strokeWidth: 2, fill: 'var(--text-primary)' }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="legacyForecast" 
                name="Legacy Forecast (No Driver API)" 
                stroke="var(--accent-pink)" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: 'var(--accent-pink)' }}
              />
              <Line 
                type="monotone" 
                dataKey="optimizedForecast" 
                name="Optimized Forecast (API Integrated)" 
                stroke="var(--accent-cyan)" 
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--accent-cyan)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
