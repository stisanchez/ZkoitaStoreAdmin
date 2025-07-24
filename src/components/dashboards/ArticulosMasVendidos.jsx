// src/components/dashboards/ArticulosMasVendidos.jsx
import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Para área rellena
} from "chart.js";
import { Line } from "react-chartjs-2";

// Registramos los módulos necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ArticulosMasVendidos({ orders = [], loading = false }) {
  const toast = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (orders.length > 0) {
      processChartData(orders);
    }
  }, [orders]);

  const processChartData = (orders) => {
    const salesByProduct = {};

    orders.forEach((order) => {
      if (!order.detail) return;
      order.detail.forEach((item) => {
        const descripcion = item.descripcion;
        const cantidad = item.cantidad || 0;
        if (!descripcion) return;
        salesByProduct[descripcion] =
          (salesByProduct[descripcion] || 0) + cantidad;
      });
    });

    const sorted = Object.entries(salesByProduct).sort((a, b) => b[1] - a[1]);
    const topProducts = sorted.slice(0, 10);

    const labels = topProducts.map(([desc]) => desc);
    const data = topProducts.map(([, qty]) => qty);

    setChartData({
      labels,
      datasets: [
        {
          label: "Cantidad Vendida",
          data,
          fill: true,
          backgroundColor: "rgba(0, 123, 255, 0.2)", // área rellena
          borderColor: "#007bff", // línea
          tension: 0.4,
          pointBackgroundColor: "#007bff",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Top 10 Artículos Más Vendidos",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        title: {
          display: true,
          text: "Cantidad",
        },
      },
      x: {
        title: {
          display: true,
          text: "Producto",
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="card-dashboard">
      <h1>Artículos Más Vendidos</h1>
      <Toast ref={toast} />
      <div className="dashboard">
        {loading ? (
          <p>Cargando datos...</p>
        ) : chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
}
