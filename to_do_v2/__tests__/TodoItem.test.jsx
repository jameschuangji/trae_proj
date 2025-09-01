import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../app/components/TodoItem';
import { TodoProvider } from '../app/context/TodoContext';

// 模拟useTodo钩子
jest.mock('../app/context/TodoContext', () => {
  const originalModule = jest.requireActual('../app/context/TodoContext');
  return {
    ...originalModule,
    useTodo: jest.fn(),
  };
});

import { useTodo } from '../app/context/TodoContext';

describe('TodoItem组件', () => {
  // 模拟待办事项
  const mockHighPriorityTodo = {
    id: 1,
    text: '高优先级待办事项',
    completed: false,
    createdAt: new Date(),
    priority: 'high',
  };

  const mockMediumPriorityTodo = {
    id: 2,
    text: '中优先级待办事项',
    completed: false,
    createdAt: new Date(),
    priority: 'medium',
  };

  const mockLowPriorityTodo = {
    id: 3,
    text: '低优先级待办事项',
    completed: false,
    createdAt: new Date(),
    priority: 'low',
  };

  // 模拟TodoContext中的函数
  const mockToggleTodo = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockEditTodo = jest.fn();
  const mockUpdateTodoPriority = jest.fn();

  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();

    // 模拟useTodo钩子返回值
    useTodo.mockReturnValue({
      toggleTodo: mockToggleTodo,
      deleteTodo: mockDeleteTodo,
      editTodo: mockEditTodo,
      updateTodoPriority: mockUpdateTodoPriority,
    });
  });

  test('应该正确渲染高优先级待办事项', () => {
    render(<TodoItem todo={mockHighPriorityTodo} />);

    // 验证待办事项文本
    expect(screen.getByText('高优先级待办事项')).toBeInTheDocument();

    // 获取优先级标记元素
    const priorityMark = document.querySelector('.inline-block.w-3.h-3.rounded-full');
    
    // 验证优先级标记的背景颜色是红色（高优先级）
    expect(priorityMark).toHaveStyle('background-color: #ef4444');
  });

  test('应该正确渲染中优先级待办事项', () => {
    render(<TodoItem todo={mockMediumPriorityTodo} />);

    // 验证待办事项文本
    expect(screen.getByText('中优先级待办事项')).toBeInTheDocument();

    // 获取优先级标记元素
    const priorityMark = document.querySelector('.inline-block.w-3.h-3.rounded-full');
    
    // 验证优先级标记的背景颜色是黄色（中优先级）
    expect(priorityMark).toHaveStyle('background-color: #eab308');
  });

  test('应该正确渲染低优先级待办事项', () => {
    render(<TodoItem todo={mockLowPriorityTodo} />);

    // 验证待办事项文本
    expect(screen.getByText('低优先级待办事项')).toBeInTheDocument();

    // 获取优先级标记元素
    const priorityMark = document.querySelector('.inline-block.w-3.h-3.rounded-full');
    
    // 验证优先级标记的背景颜色是蓝色（低优先级）
    expect(priorityMark).toHaveStyle('background-color: #3b82f6');
  });

  test('点击优先级按钮应该打开优先级菜单', () => {
    render(<TodoItem todo={mockMediumPriorityTodo} />);

    // 获取优先级按钮
    const priorityButton = document.querySelector('.todo-button');
    
    // 点击优先级按钮
    fireEvent.click(priorityButton);
    
    // 验证优先级菜单已打开
    expect(screen.getByText('高优先级')).toBeInTheDocument();
    expect(screen.getByText('中优先级')).toBeInTheDocument();
    expect(screen.getByText('低优先级')).toBeInTheDocument();
  });

  test('点击高优先级选项应该调用updateTodoPriority函数', () => {
    render(<TodoItem todo={mockMediumPriorityTodo} />);

    // 获取优先级按钮
    const priorityButton = document.querySelector('.todo-button');
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 点击高优先级选项
    fireEvent.click(screen.getByText('高优先级'));
    
    // 验证updateTodoPriority函数被调用，且参数正确
    expect(mockUpdateTodoPriority).toHaveBeenCalledWith(2, 'high');
  });

  test('点击中优先级选项应该调用updateTodoPriority函数', () => {
    render(<TodoItem todo={mockHighPriorityTodo} />);

    // 获取优先级按钮
    const priorityButton = document.querySelector('.todo-button');
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 点击中优先级选项
    fireEvent.click(screen.getByText('中优先级'));
    
    // 验证updateTodoPriority函数被调用，且参数正确
    expect(mockUpdateTodoPriority).toHaveBeenCalledWith(1, 'medium');
  });

  test('点击低优先级选项应该调用updateTodoPriority函数', () => {
    render(<TodoItem todo={mockHighPriorityTodo} />);

    // 获取优先级按钮
    const priorityButton = document.querySelector('.todo-button');
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 点击低优先级选项
    fireEvent.click(screen.getByText('低优先级'));
    
    // 验证updateTodoPriority函数被调用，且参数正确
    expect(mockUpdateTodoPriority).toHaveBeenCalledWith(1, 'low');
  });
});