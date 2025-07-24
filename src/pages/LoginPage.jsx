// src/pages/LoginPage.jsx
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">ZkotiaStore Admin</h2>
        <LoginForm />
      </div>
    </div>
  );
}
