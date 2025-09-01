'use client';

import { TodoProvider } from './context/TodoContext';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';

export default function Home() {
  return (
    <TodoProvider>
      <main className="min-h-screen py-10 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-2">Todo 应用</h1>
            <p className="text-gray-600">简单高效的待办事项管理工具</p>
          </header>
          
          <TodoFilter />
          <AddTodo />
          <TodoList />
          
          <footer className="mt-10 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Todo 应用原型 - 保持专注，提高效率</p>
          </footer>
        </div>
      </main>
    </TodoProvider>
  );
}