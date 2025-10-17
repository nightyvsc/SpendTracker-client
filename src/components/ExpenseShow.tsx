import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { deleteExpense, getExpense, type Expense } from '../services/expenses';
import PageContainer from './PageContainer';

export default function ExpenseShow() {
    const { expenseId } = useParams();
    const navigate = useNavigate();

    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [expense, setExpense] = React.useState<Expense | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const loadData = React.useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const showData = await getExpense(Number(expenseId));

            setExpense(showData);
        } catch (showDataError) {
            setError(showDataError as Error);
        }
        setIsLoading(false);
    }, [expenseId]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleExpenseEdit = React.useCallback(() => {
        navigate(`/spendings/expenses/${expenseId}/edit`);
    }, [navigate, expenseId]);

    const handleExpenseDelete = React.useCallback(async () => {
        if (!expense) {
            return;
        }

        const confirmed = await dialogs.confirm(
            `Do you wish to delete this expense of $${expense.amount}?`,
            {
                title: `Delete expense?`,
                severity: 'error',
                okText: 'Delete',
                cancelText: 'Cancel',
            },
        );

        if (confirmed) {
            setIsLoading(true);
            try {
                await deleteExpense(Number(expenseId));

                navigate('/spendings');

                notifications.show('Expense deleted successfully.', {
                    severity: 'success',
                    autoHideDuration: 3000,
                });
            } catch (deleteError) {
                notifications.show(
                    `Failed to delete expense. Reason: ${(deleteError as Error).message}`,
                    {
                        severity: 'error',
                        autoHideDuration: 3000,
                    },
                );
            }
            setIsLoading(false);
        }
    }, [expense, dialogs, expenseId, navigate, notifications]);

    const handleBack = React.useCallback(() => {
        navigate('/spendings');
    }, [navigate]);

    const renderShow = React.useMemo(() => {
        if (isLoading) {
            return (
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        m: 1,
                    }}
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return (
                <Box sx={{ flexGrow: 1 }}>
                    <Alert severity="error">{error.message}</Alert>
                </Box>
            );
        }

        return expense ? (
            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Grid container spacing={2} sx={{ width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Date</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {dayjs(expense.date).format('MMMM D, YYYY')}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Category</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {expense.category_name || 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Amount</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                ${Number(expense.amount).toFixed(2)}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ px: 2, py: 1 }}>
                            <Typography variant="overline">Description</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                {expense.description || 'No description'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Stack direction="row" spacing={2} justifyContent="space-between">
                    <Button
                        variant="contained"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleExpenseEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleExpenseDelete}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        ) : null;
    }, [
        isLoading,
        error,
        expense,
        handleBack,
        handleExpenseEdit,
        handleExpenseDelete,
    ]);

    const pageTitle = `Expense ${expenseId}`;

    return (
        <PageContainer
            title={pageTitle}
            breadcrumbs={[
                { title: 'Expenses', path: '/spendings' },
                { title: pageTitle },
            ]}
        >
            <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
        </PageContainer>
    );
}