import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import EmployeeList from '../components/EmployeeList';
import EmployeeShow from '../components/EmployeeShow';
import EmployeeCreate from '../components/EmployeeCreate';
import EmployeeEdit from '../components/EmployeeEdit';
import CategoryList from '../components/CategoryList';
import CategoryCreate from '../components/CategoryCreate';
import CategoryDetails from '../components/CategoryDetails';
import NotificationsProvider from '../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';
import {
  dataGridCustomizations,
  datePickersCustomizations
} from '../theme/crud-customizations';
import {sidebarCustomizations} from '../theme/crud-customizations/sidebar'
import { formInputCustomizations } from '../theme/crud-customizations/formInput'

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function CrudDashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<EmployeeList />} />
              <Route path="category" element={<CategoryList />} />
              <Route path="category/details" element={<CategoryDetails />} />
              <Route path="category/new" element={<CategoryCreate />} />
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:employeeId" element={<EmployeeShow />} />
              <Route path="employees/new" element={<EmployeeCreate />} />
              <Route path="employees/:employeeId/edit" element={<EmployeeEdit />} />
              <Route path="*" element={<EmployeeList />} />
            </Route>
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}