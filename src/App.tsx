import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './signin/SignIn';
import PrivateRoute from './routes/PrivateRoute';

// Usa tu dashboard existente
import Dashboard from './dashboard/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pública */}
        <Route path="/signin" element={<SignIn />} />

        {/* protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Aquí luego agregamos /reports y demás */}
        </Route>

        {/* redirecciones por defecto */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
