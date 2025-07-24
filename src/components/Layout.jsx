// src/components/Layout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../style/Layout.css';

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="logo">ZkotiaStore</div>
                <div className="menu">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                        Dashboards
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Productos
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Usuarios
                    </NavLink>
                    <button className="logout-btn" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
