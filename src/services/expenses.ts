import api from './api';

export interface ExpensePayload {
    date: string;
    category: number;
    amount: string;
    description?: string;
}

export interface Expense {
    id: number;
    date: string;
    category: number;
    category_name?: string;
    amount: string;
    description: string;
    created_at: string;
}

export async function listExpenses(): Promise<Expense[]> {
    const { data } = await api.get('/api/expenses/');
    return data;
}

export async function createExpense(payload: ExpensePayload): Promise<Expense> {
    const { data } = await api.post('/api/expenses/', payload);
    return data;
}

export async function getExpense(id: number): Promise<Expense> {
    const { data } = await api.get(`/api/expenses/${id}/`);
    return data;
}

export async function updateExpense(id: number, payload: Partial<ExpensePayload>): Promise<Expense> {
    const { data } = await api.patch(`/api/expenses/${id}/`, payload);
    return data;
}

export async function deleteExpense(id: number): Promise<void> {
    await api.delete(`/api/expenses/${id}/`);
}

export async function listCategories() {
    const { data } = await api.get('/api/categories/');
    return data;
}