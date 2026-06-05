export function getHistoricalForecastComparison() {
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

  let legacyErrorSum = 0;
  let optimizedErrorSum = 0;
  data.forEach(d => {
    legacyErrorSum += Math.abs(d.actual - d.legacy) / d.actual;
    optimizedErrorSum += Math.abs(d.actual - d.optimized) / d.actual;
  });

  const legacyMAPE = (legacyErrorSum / data.length) * 100;
  const optimizedMAPE = (optimizedErrorSum / data.length) * 100;

  return {
    chartData: data,
    metrics: {
      legacyMAPE: parseFloat(legacyMAPE.toFixed(2)),
      optimizedMAPE: parseFloat(optimizedMAPE.toFixed(2)),
      accuracyImprovement: parseFloat((((legacyMAPE - optimizedMAPE) / legacyMAPE) * 100).toFixed(2))
    }
  };
}

export function generateSimulationForecast(marketingSpend = 5000, discountLevel = 10, seasonalityFactor = 1.0) {
  const baseSales = [4200, 4500, 4100, 4800, 5200, 5800, 4900, 4600, 5100, 5500, 6000, 6200];
  
  const chartData = baseSales.map((base, index) => {
    const day = `Day ${index + 1}`;
    
    // Simulate actual outcome response based on drivers
    const spendMultiplier = 0.15;
    const discountMultiplier = 35;
    const actualSales = Math.round((base + marketingSpend * spendMultiplier + discountLevel * discountMultiplier) * seasonalityFactor);
    
    // Legacy forecast model: ignores inputs, uses poor static multipliers, high variance noise
    const legacyNoise = (Math.sin(index) * 0.14 + 0.06); 
    const legacySales = Math.round((base + 5000 * 0.10 + 10 * 25) * 1.0 * (1 + legacyNoise));
    
    // Optimized forecast: incorporates actual drivers, filters noise
    const optimizedNoise = (Math.sin(index * 2) * 0.025);
    const optimizedSales = Math.round((base + marketingSpend * 0.146 + discountLevel * 34.2) * seasonalityFactor * (1 + optimizedNoise));
    
    return {
      day,
      actual: actualSales,
      legacy: legacySales,
      optimized: optimizedSales
    };
  });

  let legacyErrorSum = 0;
  let optimizedErrorSum = 0;
  chartData.forEach(d => {
    legacyErrorSum += Math.abs(d.actual - d.legacy) / d.actual;
    optimizedErrorSum += Math.abs(d.actual - d.optimized) / d.actual;
  });

  const legacyMAPE = (legacyErrorSum / chartData.length) * 100;
  const optimizedMAPE = (optimizedErrorSum / chartData.length) * 100;
  const accuracyImprovement = ((legacyMAPE - optimizedMAPE) / legacyMAPE) * 100;

  return {
    chartData,
    metrics: {
      legacyMAPE: parseFloat(legacyMAPE.toFixed(2)),
      optimizedMAPE: parseFloat(optimizedMAPE.toFixed(2)),
      accuracyImprovement: parseFloat(accuracyImprovement.toFixed(2))
    }
  };
}
