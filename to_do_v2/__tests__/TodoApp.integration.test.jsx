import { render, screen, fireEvent, within } from '@testing-library/react';
import { TodoProvider } from '../app/context/TodoContext';
import AddTodo from '../app/components/AddTodo';
import TodoList from '../app/components/TodoList';

describe('待办事项应用集成测试', () => {
  beforeEach(() => {
    // 清空localStorage
    localStorage.clear();
  });

  test('应该能够添加不同优先级的待办事项并正确显示', async () => {
    // 渲染待办事项应用的主要组件
    render(
      <TodoProvider>
        <div>
          <AddTodo />
          <TodoList />
        </div>
      </TodoProvider>
    );

    // 获取输入框和优先级按钮
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const priorityButton = screen.getByRole('button', { name: /设置优先级/i });
    const submitButton = screen.getByRole('button', { name: /添加/i });

    // 添加高优先级待办事项
    fireEvent.click(priorityButton);
    fireEvent.click(screen.getByText('高优先级', { selector: '.priority-menu-item' }));
    fireEvent.change(input, { target: { value: '高优先级任务' } });
    fireEvent.click(submitButton);

    // 添加中优先级待办事项
    fireEvent.click(priorityButton);
    fireEvent.click(screen.getByText('中优先级', { selector: '.priority-menu-item' }));
    fireEvent.change(input, { target: { value: '中优先级任务' } });
    fireEvent.click(submitButton);

    // 添加低优先级待办事项
    fireEvent.click(priorityButton);
    fireEvent.click(screen.getByText('低优先级', { selector: '.priority-menu-item' }));
    fireEvent.change(input, { target: { value: '低优先级任务' } });
    fireEvent.click(submitButton);

    // 验证待办事项已添加到列表中
    expect(screen.getByText('高优先级任务')).toBeInTheDocument();
    expect(screen.getByText('中优先级任务')).toBeInTheDocument();
    expect(screen.getByText('低优先级任务')).toBeInTheDocument();

    // 获取所有待办事项
    const todoItems = screen.getAllByText(/优先级任务/).map(el => el.closest('.todo-item'));
    expect(todoItems.length).toBe(3);

    // 验证高优先级待办事项的优先级标记颜色
    const highPriorityTodo = screen.getByText('高优先级任务').closest('.todo-item');
    const highPriorityMark = highPriorityTodo.querySelector('.inline-block.w-3.h-3.rounded-full');
    expect(highPriorityMark.style.backgroundColor).toBe('rgb(239, 68, 68)');

    // 验证中优先级待办事项的优先级标记颜色
    const mediumPriorityTodo = screen.getByText('中优先级任务').closest('.todo-item');
    const mediumPriorityMark = mediumPriorityTodo.querySelector('.inline-block.w-3.h-3.rounded-full');
    expect(mediumPriorityMark.style.backgroundColor).toBe('rgb(234, 179, 8)');

    // 验证低优先级待办事项的优先级标记颜色
    const lowPriorityTodo = screen.getByText('低优先级任务').closest('.todo-item');
    const lowPriorityMark = lowPriorityTodo.querySelector('.inline-block.w-3.h-3.rounded-full');
    expect(lowPriorityMark.style.backgroundColor).toBe('rgb(59, 130, 246)');
  });

  test('应该能够更改待办事项的优先级', async () => {
    // 渲染待办事项应用的主要组件
    render(
      <TodoProvider>
        <div>
          <AddTodo />
          <TodoList />
        </div>
      </TodoProvider>
    );

    // 添加中优先级待办事项
    const input = screen.getByPlaceholderText('添加新的待办事项...');
    const submitButton = screen.getByRole('button', { name: /添加/i });
    fireEvent.change(input, { target: { value: '测试任务' } });
    fireEvent.click(submitButton);

    // 获取待办事项 - 使用更可靠的查询方式
    const todoItem = screen.getByText('测试任务').closest('.todo-item');
    
    // 获取优先级按钮并点击 - 使用更可靠的查询方式
    const priorityButton = todoItem.querySelector('.todo-button');
    fireEvent.click(priorityButton);
    
    // 点击高优先级选项 - 使用更可靠的查询方式
    const highPriorityOption = todoItem.querySelector('.priority-menu-item:first-child');
    fireEvent.click(highPriorityOption);
    
    // 验证优先级标记颜色已更新为高优先级（红色）
    const priorityMark = todoItem.querySelector('.inline-block.w-3.h-3.rounded-full');
    expect(priorityMark.style.backgroundColor).toBe('rgb(239, 68, 68)');
    
    // 再次点击优先级按钮
    fireEvent.click(priorityButton);
    
    // 点击低优先级选项
    fireEvent.click(within(todoItem).getByText('低优先级'));
    
    // 验证优先级标记颜色已更新为低优先级（蓝色）
    expect(priorityMark).toHaveStyle('background-color: #3b82f6');
  });

  test('添加无效优先级的待办事项应该默认为中优先级', async () => {
    // 创建一个测试组件，用于直接调用addTodo函数
    const TestComponent = () => {
      const { addTodo, todos } = useTodo();
      
      return (
        <div>
          <button 
            onClick={() => addTodo('无效优先级任务', 'invalid')} 
            data-testid="add-invalid"
          >
            添加无效优先级
          </button>
          <ul>
            {todos.map(todo => (
              <li key={todo.id} data-testid={`todo-${todo.id}`}>
                <span>{todo.text}</span>
                <span data-testid={`priority-${todo.id}`}>{todo.priority}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    };
    
    // 导入useTodo钩子
    const { useTodo } = require('../app/context/TodoContext');
    
    // 渲染测试组件
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );
    
    // 点击添加无效优先级按钮
    fireEvent.click(screen.getByTestId('add-invalid'));
    
    // 获取待办事项
    const todoId = screen.getByText('无效优先级任务').closest('li').dataset.testid.replace('todo-', '');
    
    // 验证优先级已默认设置为medium
    expect(screen.getByTestId(`priority-${todoId}`).textContent).toBe('medium');
  });
});