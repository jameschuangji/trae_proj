'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const TodoContext = createContext();

export const useTodo = () => {
  return useContext(TodoContext);
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // 从本地存储加载待办事项
  useEffect(() => {
    // 确保代码只在客户端执行
    if (typeof window !== 'undefined') {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        try {
          setTodos(JSON.parse(storedTodos));
        } catch (error) {
          console.error('解析待办事项数据失败:', error);
          // 如果解析失败，设置为空数组
          setTodos([]);
        }
      }
    }
  }, []);

  // 保存待办事项到本地存储
  useEffect(() => {
    // 确保代码只在客户端执行
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error('保存待办事项数据失败:', error);
      }
    }
  }, [todos]);

  // 添加待办事项
  const addTodo = (text, priority) => {
    if (text.trim()) {
      // 修复：直接使用传入的优先级，不进行验证
      // 如果priority未定义或不在有效值列表中，则默认为'medium'
      let validPriority = priority;
      if (!validPriority || !['high', 'medium', 'low'].includes(validPriority)) {
        validPriority = 'medium';
      }
      
      console.log('添加待办事项，原始优先级:', priority, '使用优先级:', validPriority);
      
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date(),
        priority: validPriority, // 使用验证后的优先级
      };
      
      setTodos([...todos, newTodo]);
    }
  };

  // 删除待办事项
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 切换待办事项完成状态
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 编辑待办事项
  const editTodo = (id, newText, newPriority) => {
    if (newText.trim()) {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { 
            ...todo, 
            text: newText,
            ...(newPriority && { priority: newPriority })
          } : todo
        )
      );
    }
  };

  // 更新待办事项优先级
  const updateTodoPriority = (id, priority) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  // 根据筛选条件获取待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    if (filter === 'high') return todo.priority === 'high';
    if (filter === 'medium') return todo.priority === 'medium';
    if (filter === 'low') return todo.priority === 'low';
    return true; // 'all'
  });
  
  // 按优先级排序待办事项
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const value = {
    todos: sortedTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    updateTodoPriority,
    filter,
    setFilter,
    totalTodos: todos.length,
    completedTodos: todos.filter(todo => todo.completed).length,
    activeTodos: todos.filter(todo => !todo.completed).length,
    highPriorityTodos: todos.filter(todo => todo.priority === 'high').length,
    mediumPriorityTodos: todos.filter(todo => todo.priority === 'medium').length,
    lowPriorityTodos: todos.filter(todo => todo.priority === 'low').length,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};