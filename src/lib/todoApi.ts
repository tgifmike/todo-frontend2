import { Todo } from '@/types/todo';
import api from '../lib/axios';


export const getTodos = async (): Promise<Todo[]> => {
	const res = await api.get('/todos');
	return res.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
	const res = await api.post('/todos', todo);
	return res.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
	const res = await api.put(`/todos/${todo.id}`, todo);
	return res.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
	await api.delete(`/todos/${id}`);
};
