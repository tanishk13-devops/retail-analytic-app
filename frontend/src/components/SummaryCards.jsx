import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { IndianRupee, ShoppingBag, CreditCard, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards() {
  const { dashboardData } = useDashboard();
  const { summary } = dashboardData;

  if (!summary) return null;

  const cardDetails = [
    {
      title: "Total Portfolio Value",
      value: `₹${summary.revenue.value.toLocaleString('en-IN')}`,
      change: `+${summary.revenue.change}%`,
      trend: "up",
      icon: IndianRupee,
      className: "revenue-card"
    },
    {
      title: "Sales Volume",
      value: summary.salesVolume.value.toLocaleString('en-IN'),
      change: `+${summary.salesVolume.change}%`,
      trend: "up",
      icon: ShoppingBag,
      className: "sales-card"
    },
    {
      title: "Avg. Stock Value",
      value: `₹${summary.averageOrderValue.value.toLocaleString('en-IN')}`,
      change: `+${summary.averageOrderValue.change}%`,
      trend: "up",
      icon: CreditCard,
      className: "aov-card"
    },
    {
      title: "Conversion Rate",
      value: `${summary.conversionRate.value}%`,
      change: `+${summary.conversionRate.change}%`,
      trend: "up",
      icon: Percent,
      className: "conversion-card"
    }
  ];

  return (
    <div className="summary-grid">
      {cardDetails.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            className={`summary-card glass-panel glowing fade-in ${card.className}`} 
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div className="summary-card-header">
              <span className="summary-card-title">{card.title}</span>
              <div className="summary-card-icon">
                <IconComponent size={16} />
              </div>
            </div>
            <div className="summary-card-value">{card.value}</div>
            <div className="summary-card-footer">
              <span className={`trend-indicator ${card.trend}`}>
                {card.trend === "up" ? (
                  <ArrowUpRight size={14} style={{ marginRight: '2px', strokeWidth: 2.5 }} />
                ) : (
                  <ArrowDownRight size={14} style={{ marginRight: '2px', strokeWidth: 2.5 }} />
                )}
                {card.change}
              </span>
              <span className="trend-text">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
