// src/components/dashboards/ArticulosMasEconomicos.jsx
import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ArticulosMasEconomicos({ products, loading }) {
  const toast = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [cheapestProduct, setCheapestProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      processChartData(products);
    }
  }, [products]);

  const processChartData = (products) => {
    const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
    const topCheapest = sortedByPrice.slice(0, 10);

    const labels = topCheapest.map((p) => p.title);
    const dataValues = topCheapest.map((p) => p.price);

    setCheapestProduct(topCheapest[0]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Precio ($)",
          data: dataValues,
          backgroundColor: "#a0d911",
          borderColor: "#ffffff",
          borderRadius: 6,
          barThickness: 30,
          maxBarThickness: 50,
          categoryPercentage: 0.5,
          barPercentage: 0.6,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Productos Más Económicos" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const product = products.find((p) => p.title === tooltipItem.label);
            return `💰 $${product?.price.toFixed(2)} | 🏷️ ${product?.brand} | SKU: ${product?.sku}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="card-dashboard">
      <Toast ref={toast} />
      <h1>Top 10 Productos Más Económicos</h1>

      {cheapestProduct && (
        <div className="divImg">
          <img
            src={cheapestProduct.thumbnail}
            alt={cheapestProduct.title}
          />
          <p>
            <strong>{cheapestProduct.title}</strong> — ${cheapestProduct.price.toFixed(2)}
          </p>
        </div>
      )}

      <div className="dashboard" >
        {loading ? (
          <p>Cargando datos del gráfico...</p>
        ) : chartData.labels.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
}
