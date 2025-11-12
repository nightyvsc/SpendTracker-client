import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid'; // 👈 asegúrate de usar @mui/material/Grid2
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import dayjs, { Dayjs } from 'dayjs';
import type { ExpensePayload } from '../services/expenses';
import type { Category } from '../services/categories';

export interface ExpenseFormProps {
    formValues: Partial<ExpensePayload>;
    categories: Category[];
    onFieldChange: (name: keyof ExpensePayload, value: string | number) => void;
    onSubmit: () => Promise<void>;
    onReset?: () => void;
    submitButtonLabel: string;
    backButtonPath?: string;
}

export default function ExpenseForm(props: ExpenseFormProps) {
    const {
        formValues,
        categories,
        onFieldChange,
        onSubmit,
        onReset,
        submitButtonLabel,
        backButtonPath,
    } = props;

    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setIsSubmitting(true);
            try {
                await onSubmit();
            } finally {
                setIsSubmitting(false);
            }
        },
        [onSubmit],
    );

    const handleTextFieldChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            // convierte a número si es el campo "amount"
            onFieldChange(name as keyof ExpensePayload, name === 'amount' ? Number(value) : value);
        },
        [onFieldChange],
    );

    const handleDateFieldChange = React.useCallback(
        (value: Dayjs | null) => {
            if (value?.isValid()) {
                onFieldChange('date', value.format('YYYY-MM-DD'));
            }
        },
        [onFieldChange],
    );

    const handleSelectFieldChange = React.useCallback(
        (event: SelectChangeEvent) => {
            onFieldChange('category', Number(event.target.value));
        },
        [onFieldChange],
    );

    const handleReset = React.useCallback(() => {
        if (onReset) onReset();
    }, [onReset]);

    const handleBack = React.useCallback(() => {
        navigate(backButtonPath ?? '/spendings');
    }, [navigate, backButtonPath]);

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            onReset={handleReset}
            sx={{ width: '100%' }}
        >
            <FormGroup>
                <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={formValues.date ? dayjs(formValues.date) : null}
                                onChange={handleDateFieldChange}
                                label="Date"
                                slotProps={{
                                    textField: { fullWidth: true },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <FormControl fullWidth>
                            <InputLabel id="expense-category-label">Category</InputLabel>
                            <Select
                                value={formValues.category ? String(formValues.category) : ''}
                                onChange={handleSelectFieldChange}
                                labelId="expense-category-label"
                                name="category"
                                label="Category"
                                fullWidth
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
                        <TextField
                            type="number"
                            value={formValues.amount ?? ''}
                            onChange={handleTextFieldChange}
                            name="amount"
                            label="Amount"
                            fullWidth
                            inputProps={{ step: '0.01', min: '0' }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12}} sx={{ display: 'flex' }}>
                        <TextField
                            value={formValues.description ?? ''}
                            onChange={handleTextFieldChange}
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            InputProps={{
                                sx: {
                                    alignItems: 'flex-start',
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </FormGroup>

            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                >
                    Back
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                >
                    {submitButtonLabel}
                </Button>
            </Stack>
        </Box>
    );
}
