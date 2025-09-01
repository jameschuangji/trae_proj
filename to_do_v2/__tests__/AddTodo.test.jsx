import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from '../app/components/AddTodo';
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

describe('AddTodo组件', () => {
  const mockAddTodo = jest.fn();
  
  beforeEach(() => {
    // 重置模拟函数
    jest.clearAllMocks();
    
    // 模拟useTodo钩子返回值
    useTodo.mockReturnValue({
      addTodo: mockAddTodo,
    });
  });

  test('应该渲染AddTodo组件', () => {
    render(<AddTodo />);
    
    // 验证输入框和添加按钮存在
    expect(screen.getByPlaceholderText('添加新的待办事项...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /添加/i })).toBeInTheDocument();
  });

  test('应该能够输入文本并提交表单', () => {
    render(<AddTodo />);
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入文本
    fireEvent.change(input, { target: { value: '测试待办事项' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且默认优先级为medium
    expect(mockAddTodo).toHaveBeenCalledWith('测试待办事项', 'medium');
    
    // 验证输入框被清空
    expect(input.value).toBe('');
  });

  test('当输入为空时不应该调用addTodo', () => {
    render(<AddTodo />);
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入空文本
    fireEvent.change(input, { target: { value: '' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数未被调用
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('应该能够打开优先级菜单并选择高优先级', () => {
    render(<AddTodo />);
    
    // 获取优先级按钮
    const priorityButton = screen.getByRole('button', { name: /设置优先级/i });
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 验证优先级菜单已打开
    const highPriorityButton = screen.getByText('高优先级', { selector: '.priority-menu-item' });
    expect(highPriorityButton).toBeInTheDocument();
    
    // 点击高优先级选项
    fireEvent.click(highPriorityButton);
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入文本
    fireEvent.change(input, { target: { value: '高优先级待办事项' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且优先级为high
    expect(mockAddTodo).toHaveBeenCalledWith('高优先级待办事项', 'high');
  });

  test('应该能够打开优先级菜单并选择中优先级', () => {
    render(<AddTodo />);
    
    // 获取优先级按钮
    const priorityButton = screen.getByRole('button', { name: /设置优先级/i });
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 验证优先级菜单已打开
    const mediumPriorityButton = screen.getByText('中优先级', { selector: '.priority-menu-item' });
    expect(mediumPriorityButton).toBeInTheDocument();
    
    // 点击中优先级选项
    fireEvent.click(mediumPriorityButton);
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入文本
    fireEvent.change(input, { target: { value: '中优先级待办事项' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且优先级为medium
    expect(mockAddTodo).toHaveBeenCalledWith('中优先级待办事项', 'medium');
  });

  test('应该能够打开优先级菜单并选择低优先级', () => {
    render(<AddTodo />);
    
    // 获取优先级按钮
    const priorityButton = screen.getByRole('button', { name: /设置优先级/i });
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 验证优先级菜单已打开
    const lowPriorityButton = screen.getByText('低优先级', { selector: '.priority-menu-item' });
    expect(lowPriorityButton).toBeInTheDocument();
    
    // 点击低优先级选项
    fireEvent.click(lowPriorityButton);
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入文本
    fireEvent.change(input, { target: { value: '低优先级待办事项' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且优先级为low
    expect(mockAddTodo).toHaveBeenCalledWith('低优先级待办事项', 'low');
  });

  test('提交表单后应该保持当前选择的优先级', () => {
    render(<AddTodo />);
    
    // 获取优先级按钮
    const priorityButton = screen.getByRole('button', { name: /设置优先级/i });
    
    // 点击优先级按钮打开菜单
    fireEvent.click(priorityButton);
    
    // 点击高优先级选项
    fireEvent.click(screen.getByText('高优先级', { selector: '.priority-menu-item' }));
    
    // 获取输入框和提交按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    
    // 输入文本
    fireEvent.change(input, { target: { value: '高优先级待办事项' } });
    
    // 提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且优先级为high
    expect(mockAddTodo).toHaveBeenCalledWith('高优先级待办事项', 'high');
    
    // 再次输入文本
    fireEvent.change(input, { target: { value: '第二个待办事项' } });
    
    // 再次提交表单
    fireEvent.click(submitButton);
    
    // 验证addTodo函数被调用，且优先级保持为high
    expect(mockAddTodo).toHaveBeenCalledWith('第二个待办事项', 'high');
  });
});