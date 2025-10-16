import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege rutas: si no hay usuario, redirige a /signin.
 * Usa <Outlet /> para renderizar la ruta hija protegida.
 */
export default function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
}
