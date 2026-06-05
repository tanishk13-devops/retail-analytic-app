import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function ProductTable() {
  const { dashboardData } = useDashboard();
  const { products } = dashboardData;

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return <span className="badge in-stock">In Stock</span>;
      case 'low stock':
        return <span className="badge low-stock">Low Stock</span>;
      case 'out of stock':
        return <span className="badge out-of-stock">Out of Stock</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="table-card glass-panel fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="table-header">
        <div>
          <h2 className="chart-title">Product Catalog & Inventory</h2>
          <p className="chart-subtitle" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Top selling inventory and stock alerts
          </p>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.id}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>${p.price.toFixed(2)}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{p.sales.toLocaleString()}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>${p.revenue.toLocaleString()}</td>
                <td style={{ whiteSpace: 'nowrap' }}>⭐ {p.rating}</td>
                <td>{getStatusBadge(p.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
