import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridEventListener,
    gridClasses,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import { listExpenses, deleteExpense, type Expense } from '../services/expenses';
import PageContainer from './PageContainer';

const INITIAL_PAGE_SIZE = 10;

export default function ExpenseList() {
    const navigate = useNavigate();
    const dialogs = useDialogs();
    const notifications = useNotifications();

    const [rows, setRows] = React.useState<Expense[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    const loadData = React.useCallback(async () => {
        setError(null);
        setIsLoading(true);

        try {
            const data = await listExpenses();
            setRows(data);
        } catch (listDataError) {
            setError(listDataError as Error);
        }

        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = React.useCallback(() => {
        if (!isLoading) loadData();
    }, [isLoading, loadData]);

    const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
        ({ row }) => {
            navigate(`/dashboard/spendings/expenses/${row.id}/edit`);
        },
        [navigate],
    );

    const handleCreateClick = React.useCallback(() => {
        navigate('/dashboard/spendings/expenses/new');
    }, [navigate]);

    const handleRowEdit = React.useCallback(
        (expense: Expense) => () => {
            navigate(`/dashboard/spendings/expenses/${expense.id}/edit`);
        },
        [navigate],
    );

    const handleRowDelete = React.useCallback(
        (expense: Expense) => async () => {
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
                    await deleteExpense(Number(expense.id));
                    notifications.show('Expense deleted successfully.', {
                        severity: 'success',
                        autoHideDuration: 3000,
                    });
                    loadData();
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
        },
        [dialogs, notifications, loadData],
    );

    const initialState = React.useMemo(
        () => ({
            pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
        }),
        [],
    );

    const columns = React.useMemo<GridColDef[]>(
        () => [
            { field: 'id', headerName: 'ID', width: 70 },
            {
                field: 'date',
                headerName: 'Date',
                type: 'date',
                valueGetter: (value) => value && new Date(value),
                width: 130,
            },
            {
                field: 'category_name',
                headerName: 'Category',
                width: 150,
            },
            {
                field: 'amount',
                headerName: 'Amount',
                type: 'number',
                width: 120,
                valueFormatter: (value) => `$${Number(value).toFixed(2)}`,
            },
            {
                field: 'description',
                headerName: 'Description',
                flex: 1,
                minWidth: 200,
            },
            {
                field: 'actions',
                type: 'actions',
                width: 100,
                align: 'right',
                getActions: ({ row }) => [
                    <GridActionsCellItem
                        key="edit-item"
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={handleRowEdit(row)}
                    />,
                    <GridActionsCellItem
                        key="delete-item"
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleRowDelete(row)}
                    />,
                ],
            },
        ],
        [handleRowEdit, handleRowDelete],
    );

    return (
        <PageContainer
            title="Expenses"
            breadcrumbs={[{ title: 'Expenses' }]}
            actions={
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title="Reload data" placement="right" enterDelay={1000}>
                        <div>
                            <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Button
                        variant="contained"
                        onClick={handleCreateClick}
                        startIcon={<AddIcon />}
                    >
                        Create
                    </Button>
                </Stack>
            }
        >
            <Box sx={{ flex: 1, width: '100%' }}>
                {error ? (
                    <Box sx={{ flexGrow: 1 }}>
                        <Alert severity="error">{error.message}</Alert>
                    </Box>
                ) : (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pagination
                        disableRowSelectionOnClick
                        onRowClick={handleRowClick}
                        loading={isLoading}
                        initialState={initialState}
                        pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
                        sx={{
                            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                                outline: 'transparent',
                            },
                            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                                outline: 'none',
                            },
                            [`& .${gridClasses.row}:hover`]: {
                                cursor: 'pointer',
                            },
                        }}
                    />
                )}
            </Box>
        </PageContainer>
    );
}
