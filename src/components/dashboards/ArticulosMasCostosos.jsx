// src/components/dashboards/ArticulosMasCostosos.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar módulos necesarios para el gráfico de barras
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ArticulosMasCostosos({ products = [], loading = false }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (products.length > 0) {
      processChartData(products);
    }
  }, [products]);

  const processChartData = (products) => {
    const sorted = [...products]
      .filter((p) => typeof p.price === "number")
      .sort((a, b) => b.price - a.price)
      .slice(0, 10);

    const labels = sorted.map((p) => p.title || p.nombre || `Producto ${p.id}`);
    const data = sorted.map((p) => p.price);

    setChartData({
      labels,
      datasets: [
        {
          label: "Precio ($)",
          data,
          backgroundColor: "#ff6384",
          borderRadius: 6,
          barThickness: 50,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 10 Artículos Más Costosos",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` Precio: $${context.parsed.y.toLocaleString("es-CR")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Precio ($)",
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString("es-CR")}`,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 20,
        },
      },
    },
  };

  return (
    <div className="card-dashboard">
      <h1>Artículos Más Costosos</h1>
      <div className="dashboard">
        {loading ? (
          <p>Cargando datos...</p>
        ) : chartData.labels.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
}
