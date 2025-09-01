import { render, screen, fireEvent, act } from '@testing-library/react';
import { TodoProvider, useTodo } from '../app/context/TodoContext';

// 创建一个测试组件，用于测试TodoContext的功能
const TestComponent = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodoPriority } = useTodo();

  return (
    <div>
      <div data-testid="todos-count">{todos.length}</div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} data-testid={`todo-${todo.id}`}>
            <span data-testid={`todo-text-${todo.id}`}>{todo.text}</span>
            <span data-testid={`todo-priority-${todo.id}`}>{todo.priority}</span>
            <span data-testid={`todo-completed-${todo.id}`}>{todo.completed ? 'true' : 'false'}</span>
            <button onClick={() => toggleTodo(todo.id)} data-testid={`toggle-${todo.id}`}>Toggle</button>
            <button onClick={() => deleteTodo(todo.id)} data-testid={`delete-${todo.id}`}>Delete</button>
            <button onClick={() => updateTodoPriority(todo.id, 'high')} data-testid={`set-high-${todo.id}`}>High</button>
            <button onClick={() => updateTodoPriority(todo.id, 'medium')} data-testid={`set-medium-${todo.id}`}>Medium</button>
            <button onClick={() => updateTodoPriority(todo.id, 'low')} data-testid={`set-low-${todo.id}`}>Low</button>
          </li>
        ))}
      </ul>
      <button 
        onClick={() => addTodo('High Priority Task', 'high')} 
        data-testid="add-high"
      >
        Add High
      </button>
      <button 
        onClick={() => addTodo('Medium Priority Task', 'medium')} 
        data-testid="add-medium"
      >
        Add Medium
      </button>
      <button 
        onClick={() => addTodo('Low Priority Task', 'low')} 
        data-testid="add-low"
      >
        Add Low
      </button>
      <button 
        onClick={() => addTodo('Invalid Priority Task', 'invalid')} 
        data-testid="add-invalid"
      >
        Add Invalid
      </button>
    </div>
  );
};

describe('TodoContext', () => {
  beforeEach(() => {
    // 清空localStorage
    localStorage.clear();
    // 重置jest模拟函数
    jest.clearAllMocks();
  });

  test('应该能够添加高优先级待办事项', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 初始状态应该没有待办事项
    expect(screen.getByTestId('todos-count').textContent).toBe('0');

    // 添加高优先级待办事项
    fireEvent.click(screen.getByTestId('add-high'));

    // 应该有一个待办事项
    expect(screen.getByTestId('todos-count').textContent).toBe('1');

    // 获取新添加的待办事项
    const todoId = screen.getByTestId('todos-count').textContent === '1' ? 
      screen.getByText('High Priority Task').closest('li').dataset.testid.replace('todo-', '') : '';

    // 验证待办事项的文本和优先级
    expect(screen.getByTestId(`todo-text-${todoId}`).textContent).toBe('High Priority Task');
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('high');
    expect(screen.getByTestId(`todo-completed-${todoId}`).textContent).toBe('false');
  });

  test('应该能够添加中优先级待办事项', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 添加中优先级待办事项
    fireEvent.click(screen.getByTestId('add-medium'));

    // 应该有一个待办事项
    expect(screen.getByTestId('todos-count').textContent).toBe('1');

    // 获取新添加的待办事项
    const todoId = screen.getByTestId('todos-count').textContent === '1' ? 
      screen.getByText('Medium Priority Task').closest('li').dataset.testid.replace('todo-', '') : '';

    // 验证待办事项的文本和优先级
    expect(screen.getByTestId(`todo-text-${todoId}`).textContent).toBe('Medium Priority Task');
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('medium');
  });

  test('应该能够添加低优先级待办事项', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 添加低优先级待办事项
    fireEvent.click(screen.getByTestId('add-low'));

    // 应该有一个待办事项
    expect(screen.getByTestId('todos-count').textContent).toBe('1');

    // 获取新添加的待办事项
    const todoId = screen.getByTestId('todos-count').textContent === '1' ? 
      screen.getByText('Low Priority Task').closest('li').dataset.testid.replace('todo-', '') : '';

    // 验证待办事项的文本和优先级
    expect(screen.getByTestId(`todo-text-${todoId}`).textContent).toBe('Low Priority Task');
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('low');
  });

  test('当提供无效优先级时，应该默认为中优先级', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 添加无效优先级待办事项
    fireEvent.click(screen.getByTestId('add-invalid'));

    // 应该有一个待办事项
    expect(screen.getByTestId('todos-count').textContent).toBe('1');

    // 获取新添加的待办事项
    const todoId = screen.getByTestId('todos-count').textContent === '1' ? 
      screen.getByText('Invalid Priority Task').closest('li').dataset.testid.replace('todo-', '') : '';

    // 验证待办事项的文本和优先级（应该是medium）
    expect(screen.getByTestId(`todo-text-${todoId}`).textContent).toBe('Invalid Priority Task');
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('medium');
  });

  test('应该能够更新待办事项的优先级', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 添加中优先级待办事项
    fireEvent.click(screen.getByTestId('add-medium'));

    // 获取新添加的待办事项
    const todoId = screen.getByTestId('todos-count').textContent === '1' ? 
      screen.getByText('Medium Priority Task').closest('li').dataset.testid.replace('todo-', '') : '';

    // 验证初始优先级是medium
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('medium');

    // 更新为高优先级
    fireEvent.click(screen.getByTestId(`set-high-${todoId}`));

    // 验证优先级已更新为high
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('high');

    // 更新为低优先级
    fireEvent.click(screen.getByTestId(`set-low-${todoId}`));

    // 验证优先级已更新为low
    expect(screen.getByTestId(`todo-priority-${todoId}`).textContent).toBe('low');
  });
});