import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn.tsx';
import PrivateRoute from './routes/PrivateRoute';

import Dashboard from './pages/Dashboard.tsx';
import SignUp from './pages/SignUp.tsx';
import CrudDashboard from './pages/CrudDashboard.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* pública */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/spendings/*" element={<CrudDashboard />} />

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
