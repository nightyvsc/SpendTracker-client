import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Components: Expenses
import ExpenseList from '../components/ExpenseList';
import ExpenseCreate from '../components/ExpenseCreate';
import ExpenseEdit from '../components/ExpenseEdit';

// Components: Categories
import CategoryList from '../components/CategoryList';
import CategoryCreate from '../components/CategoryCreate';
import CategoryDetails from '../components/CategoryDetails';

// Contexts and theme providers
import NotificationsProvider from '../hooks/useNotifications/NotificationsProvider';
import DialogsProvider from '../hooks/useDialogs/DialogsProvider';
import AppTheme from '../shared-theme/AppTheme';

import {
  dataGridCustomizations,
  datePickersCustomizations,
} from '../theme/crud-customizations';
import { sidebarCustomizations } from '../theme/crud-customizations/sidebar';
import { formInputCustomizations } from '../theme/crud-customizations/formInput';

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

              {/* ======================= */}
              {/*       EXPENSES          */}
              {/* ======================= */}
              <Route index element={<ExpenseList />} />
              <Route path="expenses" element={<ExpenseList />} />
              <Route path="expenses/new" element={<ExpenseCreate />} />
              <Route path="expenses/:expenseId/edit" element={<ExpenseEdit />} />

              {/* ======================= */}
              {/*       CATEGORIES        */}
              {/* ======================= */}
              <Route path="category" element={<CategoryList />} />
              <Route path="category/details" element={<CategoryDetails />} />
              <Route path="category/new" element={<CategoryCreate />} />

              {/* Fallback */}
              <Route path="*" element={<ExpenseList />} />
            </Route>
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
