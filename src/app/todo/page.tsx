'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { createTodo, deleteTodo, getTodos, updateTodo } from '@/lib/todoApi';
import { Todo } from '@/types/todo';
import React from 'react';
import { useEffect, useState } from 'react';

const page = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [newTitle, setNewTitle] = useState('');
	const [editTodo, setEditTodo] = useState<Todo | null>(null);
	const [editTitle, setEditTitle] = useState('');
    const [editCompleted, setEditCompleted] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);


	useEffect(() => {
		getTodos().then(setTodos);
	}, []);

	const handleAdd = async () => {
		if (!newTitle) return;
		const newTodo = await createTodo({ title: newTitle, completed: false });
		setTodos([...todos, newTodo]);
		setNewTitle('');
	};

	const handleToggle = async (todo: Todo) => {
		const updated = await updateTodo({ ...todo, completed: !todo.completed });
		setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
	};

	const handleDelete = async (id: number) => {
		await deleteTodo(id);
		setTodos(todos.filter((t) => t.id !== id));
	};

	const openEditDialog = (todo: Todo) => {
		setEditTodo(todo);
		setEditTitle(todo.title);
		setEditCompleted(todo.completed);
	};

	const handleSaveEdit = async () => {
		if (!editTodo) return;
		const updated = await updateTodo({
			...editTodo,
			title: editTitle,
			completed: editCompleted,
		});
		setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
		setEditTodo(null); // Close modal
	};

	return (
		<main className="p-4 max-w-4xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Todo List</h1>

			<div className="flex items-center gap-2 mb-4">
				<Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
				<span>Show completed</span>
			</div>

			<div className="flex gap-2 mb-4">
				<Input
					value={newTitle}
					onChange={(e) => setNewTitle(e.target.value)}
					className="border p-2 flex-1"
					placeholder="New todo"
				/>
				<Button onClick={handleAdd} className="">
					Add
				</Button>
				<div className="flex gap-2"></div>
			</div>

			<ul className="space-y-2">
				{/* {todos.map((todo) => ( */}
				{[...todos]
					.filter((todo) => showCompleted || !todo.completed)
					.sort((a, b) => Number(a.completed) - Number(b.completed)) // ✅ incomplete first
					.map((todo) => (
						<li
							key={todo.id}
							className="flex justify-between items-center py-1"
						>
							<div>
								<span
									onClick={() => handleToggle(todo)}
									className={`cursor-pointer ${
										todo.completed
											? 'line-through text-gray-500 text-xl'
											: 'text-xl'
									}`}
								>
									{todo.title}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="outline" onClick={() => openEditDialog(todo)}>
									Edit
								</Badge>
								<Badge
									onClick={() => handleDelete(todo.id)}
									variant="destructive"
								>
									Remove
								</Badge>
							</div>
						</li>
					))}
			</ul>

			{/* Edit Dialog */}
			<Dialog
				open={!!editTodo}
				onOpenChange={(open) => !open && setEditTodo(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Todo</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<Input
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							placeholder="Todo title"
						/>
						<div className="flex items-center gap-2">
							<Switch
								checked={editCompleted}
								onCheckedChange={setEditCompleted}
							/>
							<span>Completed</span>
						</div>
					</div>

					<DialogFooter className="mt-4">
						<Button onClick={handleSaveEdit}>Save</Button>
						<Button variant="outline" onClick={() => setEditTodo(null)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default page;
