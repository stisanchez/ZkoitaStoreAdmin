import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import ProductsPage from '../pages/ProductsPage';
import UsersPage from '../pages/UsersPage';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <Dashboard /> },
            { path: 'products', element: <ProductsPage /> },
            { path: 'users', element: <UsersPage /> }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />
    }

]);

export default router;
