// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import VentasxUsuario from "../components/dashboards/VentasxUsuario.jsx";
import ArticulosMasVendidos from "../components/dashboards/ArticulosMasVendidos.jsx";
import ArticulosMasEconomicos from "../components/dashboards/ArticulosMasEconomicos.jsx";
import ArticulosMasCostosos from "../components/dashboards/ArticulosMasCostosos.jsx";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos:", err))
      .finally(() => setLoadingProductos(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error cargando las ordenes:", err))
      .finally(() => setLoadingOrdenes(false));
  }, []);

  return (
    <div className="dashboards-container">
      <VentasxUsuario orders={orders} loading={loadingOrdenes} />
      <ArticulosMasVendidos orders={orders} loading={loadingOrdenes} />
      <ArticulosMasEconomicos products={products} loading={loadingProductos} />
      <ArticulosMasCostosos products={products} loading={loadingProductos} />
    </div>
  );
}
