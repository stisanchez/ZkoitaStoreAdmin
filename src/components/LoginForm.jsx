import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

export default function LoginForm() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/users');
      const users = await res.json();

      // Busca usuario por username y password
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        toast.current.show({
          severity: 'success',
          summary: '¡Bienvenido!',
          detail: `Hola ${user.firstName}`,
          life: 3000,
        });

        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrectos',
          life: 3000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error en la conexión',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="p-fluid">
        <div className="field mb-3">
          <label htmlFor="username">Usuario</label>
          <InputText
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="password">Contraseña</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            disabled={loading}
          />
        </div>

        <Button
          label={loading ? 'Validando...' : 'Ingresar'}
          icon="pi pi-sign-in"
          onClick={handleLogin}
          disabled={loading || !username || !password}
        />
      </div>
    </>
  );
}
