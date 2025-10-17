import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { getExpense, updateExpense, listCategories, type Expense, type ExpensePayload } from '../services/expenses';
import type { Category } from '../services/categories';
import ExpenseForm from './ExpenseForm';
import PageContainer from './PageContainer';

function ExpenseEditForm({
    initialValues,
    categories,
    onSubmit,
}: {
    initialValues: Partial<ExpensePayload>;
    categories: Category[];
    onSubmit: (formValues: Partial<ExpensePayload>) => Promise<void>;
}) {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const notifications = useNotifications();
    const [formValues, setFormValues] = React.useState(initialValues);

    const handleChange = (name: keyof ExpensePayload, value: string | number) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => setFormValues(initialValues);

    const handleSubmit = async () => {
        try {
            await onSubmit(formValues);
            notifications.show('Expense updated successfully.', { severity: 'success', autoHideDuration: 3000 });
            navigate('/dashboard/spendings/expenses');
        } catch (error) {
            notifications.show(`Failed to update expense. Reason: ${(error as Error).message}`, {
                severity: 'error',
                autoHideDuration: 3000,
            });
        }
    };

    return (
        <ExpenseForm
            formValues={formValues}
            categories={categories}
            onFieldChange={handleChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            submitButtonLabel="Save"
            backButtonPath="/dashboard/spendings/expenses"
        />
    );
}

export default function ExpenseEdit() {
    const { expenseId } = useParams();
    const [expense, setExpense] = React.useState<Expense | null>(null);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
        (async () => {
            try {
                const [exp, cats] = await Promise.all([
                    getExpense(Number(expenseId)),
                    listCategories(),
                ]);
                setExpense(exp);
                setCategories(cats);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [expenseId]);

    const handleSubmit = async (formValues: Partial<ExpensePayload>) => {
        const updated = await updateExpense(Number(expenseId), formValues);
        setExpense(updated);
    };

    return (
        <PageContainer
            title={`Edit Expense ${expenseId}`}
            breadcrumbs={[
                { title: 'Expenses', path: '/dashboard/spendings/expenses' },
                { title: `Expense ${expenseId}`, path: `/dashboard/spendings/expenses/${expenseId}` },
                { title: 'Edit' },
            ]}
        >
            <Box sx={{ display: 'flex', flex: 1 }}>
                {isLoading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error.message}</Alert>
                ) : (
                    expense && (
                        <ExpenseEditForm
                            initialValues={expense}
                            categories={categories}
                            onSubmit={handleSubmit}
                        />
                    )
                )}
            </Box>
        </PageContainer>
    );
}
