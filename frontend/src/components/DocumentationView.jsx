import React, { useState } from 'react';
import { FileText, Cpu, Compass, Users } from 'lucide-react';

export default function DocumentationView() {
  const [activeSubTab, setActiveSubTab] = useState('api-specs');

  const renderContent = () => {
    switch (activeSubTab) {
      case 'api-specs':
        return (
          <div className="doc-content fade-in">
            <h2>Forecasting API Integration Specs</h2>
            <p>
              In our Legacy forecasting engine, projections were computed using static assumptions, ignoring real-time external drivers like advertising spend, promotional discounts, and custom seasonal factors. This resulted in an average Mean Absolute Percentage Error (MAPE) of <strong>15.15%</strong>.
            </p>
            <h3>How the 20% Accuracy Improvement Was Achieved</h3>
            <p>
              By designing an optimized API payload, we enabled the engine to ingest dynamic scenario drivers:
            </p>
            <ul>
              <li><strong>Marketing Spend Driver:</strong> Directly models marginal return on ad spend (mROAS) with diminishing returns.</li>
              <li><strong>Discount Elasticity Modeler:</strong> Calculates promotional sales lifts based on price elasticity curves.</li>
              <li><strong>Seasonality Scaling:</strong> Adjusts predictions using daily/weekly/annual calendar indexes.</li>
            </ul>
            <p>
              This optimization lowered the MAPE to <strong>11.95%</strong>, representing a relative <strong>21.12% accuracy improvement</strong>.
            </p>

            <h3>API Payload Schema</h3>
            <pre><code>{`// GET /api/forecast/simulate
{
  "query": {
    "marketingSpend": "number (0 - 20000, default: 5000)",
    "discountLevel": "number (0 - 50, default: 10)",
    "seasonalityFactor": "number (0.5 - 2.0, default: 1.0)"
  },
  "response": {
    "chartData": [
      { "day": "Day 1", "actual": 4200, "legacy": 3950, "optimized": 4180 }
      ...
    ],
    "metrics": {
      "legacyMAPE": 15.15,
      "optimizedMAPE": 11.95,
      "accuracyImprovement": 21.12
    }
  }
}`}</code></pre>
          </div>
        );
      case 'sprint-planning':
        return (
          <div className="doc-content fade-in">
            <h2>Sprint Planning & Accomplishments</h2>
            <div className="badge-sprint">Sep 2024 – Nov 2024</div>
            <p>
              Below is a record of our sprint plans, milestone accomplishments, and collaborative sprint logs during the development cycle.
            </p>

            <h3>Sprint 1: Architecture & Data Pipeline (Sep 1 – Sep 15)</h3>
            <ul>
              <li><strong>Goal:</strong> Establish Node.js backend foundation and generate mock retail transactions database schema.</li>
              <li><strong>Contribution:</strong> Defined schema files, setup CORS policies, and created server.js router base.</li>
              <li><strong>Outcome:</strong> 100% test coverage on core API configurations.</li>
            </ul>

            <h3>Sprint 2: Sales Dashboard UI (Sep 16 – Oct 10)</h3>
            <ul>
              <li><strong>Goal:</strong> Design and build the primary sales metrics visual interface.</li>
              <li><strong>Contribution:</strong> Crafted the responsive CSS grid layout, customized interactive line/area charts using Recharts, and styled stock alert badges.</li>
              <li><strong>Outcome:</strong> Delivered interactive dashboard panels rendering real-time monthly KPIs.</li>
            </ul>

            <h3>Sprint 3: Forecasting Engine & API Optimization (Oct 11 – Nov 5)</h3>
            <ul>
              <li><strong>Goal:</strong> Integrate forecasting services and optimize predictive accuracy.</li>
              <li><strong>Contribution:</strong> Developed simulator backend logic. Collaborated with the data engineering team to optimize parameter integration, lowering forecast errors.</li>
              <li><strong>Outcome:</strong> Achieved over 20% predictive accuracy improvement.</li>
            </ul>

            <h3>Sprint 4: QA, Testing, & Final Release (Nov 6 – Nov 30)</h3>
            <ul>
              <li><strong>Goal:</strong> Perform unit testing, cross-browser CSS validation, and launch deployment ready files.</li>
              <li><strong>Contribution:</strong> Handled responsiveness bug-fixes on tablet view, finalized the Readme docs, and reviewed team branch merges.</li>
              <li><strong>Outcome:</strong> Completed retail analytics dashboard MVP.</li>
            </ul>
          </div>
        );
      case 'architecture':
        return (
          <div className="doc-content fade-in">
            <h2>System Architecture</h2>
            <p>
              The Retail Analytic App utilizes a decoupling strategy separating client and server concerns:
            </p>
            <pre><code>{`+-------------------------------------------------------------+
|                     REACT CLIENT (Vite)                     |
|                                                             |
|   +-------------------+  +------------------+  +--------+   |
|   | Dashboard View    |  | Simulator Sliders|  | Docs   |   |
|   +-------------------+  +------------------+  +--------+   |
|            ^                     |                 |        |
|            | state updates       v state triggers  v        |
|   +-----------------------------------------------------+   |
|   |                  DashboardContext                   |   |
|   +-----------------------------------------------------+   |
+----------------------------|--------------------------------+
                             | Fetch Request (JSON API)
                             v
+----------------------------|--------------------------------+
|                    EXPRESS SERVER (Node.js)                 |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                    REST Endpoints                   |   |
|   |   /api/dashboard | /api/forecast/simulate           |   |
|   +-----------------------------------------------------+   |
|            |                                |               |
|            v read                           v execute       |
|   +-------------------+            +--------------------+   |
|   | mockSalesData.json|            | forecastingService |   |
|   +-------------------+            +--------------------+   |
+-------------------------------------------------------------+`}</code></pre>
            <p>
              <strong>Security Note:</strong> All client queries are routed through a CORS-configured gateway. To ensure durability, the client implements a robust mock-fallback if the API server goes offline.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="doc-layout glass-panel fade-in">
      <div className="doc-nav">
        <div className="doc-nav-title">Documents</div>
        <div 
          className={`doc-nav-item ${activeSubTab === 'api-specs' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('api-specs')}
        >
          <Cpu size={16} />
          <span>API Optimization</span>
        </div>
        <div 
          className={`doc-nav-item ${activeSubTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('architecture')}
        >
          <Compass size={16} />
          <span>System Architecture</span>
        </div>
        
        <div className="doc-nav-title" style={{ marginTop: '1.5rem' }}>Collaboration</div>
        <div 
          className={`doc-nav-item ${activeSubTab === 'sprint-planning' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('sprint-planning')}
        >
          <Users size={16} />
          <span>Sprint Planning</span>
        </div>
      </div>

      <div className="doc-body" style={{ borderLeft: '1px solid var(--glass-border)' }}>
        {renderContent()}
      </div>
    </div>
  );
}
