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
  {/* spendings moved under protected /dashboard/spendings/* */}
       

        {/* protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/spendings/*" element={<CrudDashboard />} />
          {/* Aquí luego agregamos /reports y demás */}
        </Route>

        {/* redirecciones por defecto */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} /> 
      </Routes>
    </BrowserRouter>
  );
}
