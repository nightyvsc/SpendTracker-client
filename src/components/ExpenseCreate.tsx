import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { createExpense, listCategories, type ExpensePayload } from '../services/expenses';
import type { Category } from '../services/categories';
import ExpenseForm from './ExpenseForm';
import PageContainer from './PageContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const INITIAL_FORM_VALUES: Partial<ExpensePayload> = {
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: '',
};

export default function ExpenseCreate() {
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [formValues, setFormValues] = React.useState<Partial<ExpensePayload>>(INITIAL_FORM_VALUES);

    React.useEffect(() => {
        (async () => {
            try {
                const cats = await listCategories();
                setCategories(cats);
            } catch (error) {
                notifications.show(
                    `Failed to load categories. Reason: ${(error as Error).message}`,
                    { severity: 'error', autoHideDuration: 3000 },
                );
            } finally {
                setIsLoading(false);
            }
        })();
    }, [notifications]);

    const handleChange = React.useCallback(
        (name: keyof ExpensePayload, value: string | number) => {
            setFormValues(prev => ({ ...prev, [name]: value }));
        },
        [],
    );

    const handleReset = React.useCallback(() => {
        setFormValues(INITIAL_FORM_VALUES);
    }, []);

    const handleSubmit = React.useCallback(async () => {
        try {
            await createExpense(formValues as ExpensePayload);
            notifications.show('Expense created successfully.', {
                severity: 'success',
                autoHideDuration: 3000,
            });
            navigate('/dashboard/spendings/expenses');
        } catch (error) {
            notifications.show(
                `Failed to create expense. Reason: ${(error as Error).message}`,
                { severity: 'error', autoHideDuration: 3000 },
            );
            throw error;
        }
    }, [formValues, navigate, notifications]);

    if (isLoading) {
        return (
            <PageContainer title="New Expense">
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="New Expense"
            breadcrumbs={[
                { title: 'Expenses', path: '/dashboard/spendings/expenses' },
                { title: 'New' },
            ]}
        >
            <ExpenseForm
                formValues={formValues}
                categories={categories}
                onFieldChange={handleChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                submitButtonLabel="Create"
            />
        </PageContainer>
    );
}
