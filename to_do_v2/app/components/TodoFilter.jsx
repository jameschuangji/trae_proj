'use client';

import { useTodo } from '../context/TodoContext';

const TodoFilter = () => {
  const { 
    filter, 
    setFilter, 
    totalTodos, 
    completedTodos, 
    activeTodos,
    highPriorityTodos,
    mediumPriorityTodos,
    lowPriorityTodos
  } = useTodo();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">我的待办事项</h2>
        <div className="text-sm text-gray-500">
          {completedTodos}/{totalTodos} 已完成
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`filter-button ${filter === 'all' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          aria-label="显示所有待办事项"
        >
          全部 ({totalTodos})
        </button>
        <button
          className={`filter-button ${filter === 'active' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('active')}
          aria-pressed={filter === 'active'}
          aria-label="显示未完成待办事项"
        >
          未完成 ({activeTodos})
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('completed')}
          aria-pressed={filter === 'completed'}
          aria-label="显示已完成待办事项"
        >
          已完成 ({completedTodos})
        </button>
      </div>
      
      <h3 className="text-md font-medium text-gray-700 mb-2">按优先级筛选</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`filter-button ${filter === 'high' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('high')}
          aria-pressed={filter === 'high'}
          aria-label="显示高优先级待办事项"
        >
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          高优先级 ({highPriorityTodos})
        </button>
        <button
          className={`filter-button ${filter === 'medium' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('medium')}
          aria-pressed={filter === 'medium'}
          aria-label="显示中优先级待办事项"
        >
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          中优先级 ({mediumPriorityTodos})
        </button>
        <button
          className={`filter-button ${filter === 'low' ? 'filter-button-active' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setFilter('low')}
          aria-pressed={filter === 'low'}
          aria-label="显示低优先级待办事项"
        >
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          低优先级 ({lowPriorityTodos})
        </button>
      </div>
    </div>
  );
};

export default TodoFilter;