import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function VentasxUsuario({ orders, loading }) {
  const toast = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      processChartData(orders);
    }
  }, [orders]);

  const processChartData = (orders) => {
    const totalsByUser = {};

    orders.forEach((order) => {
      const totalOrder = order.detail.reduce(
        (sum, item) => sum + (item.precioFinalArticulo || 0) * (item.cantidad || 1),
        0
      );
      totalsByUser[order.user] = (totalsByUser[order.user] || 0) + totalOrder;
    });

    const labels = Object.keys(totalsByUser);
    const dataValues = labels.map((user) => Number(totalsByUser[user].toFixed(2)));

    // Colores pastel para dona (puedes ajustar)
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#E7E9ED",
      "#76B041",
      "#C94C4C",
      "#5A9BD5",
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: "Dinero pagado (USD)",
          data: dataValues,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Dinero pagado por usuario" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.parsed || 0;
            return `${label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="card-dashboard" >
      <Toast ref={toast} />
      <h1>Ventas por Usuario</h1>
      <div >
        {loading ? (
          <p>Cargando datos del gráfico...</p>
        ) : chartData.labels.length > 0 ? (
          <Doughnut data={chartData} options={options} />
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
}
