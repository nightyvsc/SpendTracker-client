import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { user, ready } = useAuth();

  // Mientras hidratamos, no redirigimos: mostramos un placeholder
  if (!ready) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Cargando sesión…
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}
