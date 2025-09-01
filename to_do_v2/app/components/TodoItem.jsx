'use client';

import { useState, useRef, useEffect } from 'react';
import { FiTrash2, FiEdit2, FiCheck, FiFlag } from 'react-icons/fi';
import { useTodo } from '../context/TodoContext';

const TodoItem = ({ todo }) => {
  const { toggleTodo, deleteTodo, editTodo, updateTodoPriority } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const inputRef = useRef(null);
  
  // 优先级对应的颜色和标签
  const priorityConfig = {
    high: { color: 'bg-red-500', label: '高' },
    medium: { color: 'bg-yellow-500', label: '中' },
    low: { color: 'bg-blue-500', label: '低' }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editTodo(todo.id, editText, todo.priority);
    setIsEditing(false);
  };
  
  const handlePriorityChange = (priority) => {
    updateTodoPriority(todo.id, priority);
    setShowPriorityMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <div className="todo-item group hover:bg-gray-50">
      <div 
        className={`todo-checkbox ${todo.completed ? 'todo-checkbox-checked' : ''}`}
        onClick={handleToggle}
        tabIndex="0"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`标记${todo.completed ? '未完成' : '已完成'}`}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      >
        {todo.completed && <FiCheck className="text-white" size={12} />}
      </div>
      
      {/* 优先级标记 */}
      <div className="relative mr-2">
        <button
          className="todo-button relative"
          onClick={() => setShowPriorityMenu(!showPriorityMenu)}
          aria-label="更改优先级"
          aria-haspopup="true"
          aria-expanded={showPriorityMenu}
        >
          <span 
            className="inline-block w-3 h-3 rounded-full"
            style={{
              backgroundColor: todo.priority === 'high' ? '#ef4444' : 
                             todo.priority === 'medium' ? '#eab308' : 
                             '#3b82f6'
            }}
          ></span>
        </button>
        
        {showPriorityMenu && (
          <div className="priority-menu">
            <button 
              className="priority-menu-item"
              onClick={() => handlePriorityChange('high')}
            >
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ef4444'}}></span>
              高优先级
            </button>
            <button 
              className="priority-menu-item"
              onClick={() => handlePriorityChange('medium')}
            >
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#eab308'}}></span>
              中优先级
            </button>
            <button 
              className="priority-menu-item"
              onClick={() => handlePriorityChange('low')}
            >
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#3b82f6'}}></span>
              低优先级
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          className="ml-3 flex-1 p-1 border-b border-primary outline-none"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          aria-label="编辑待办事项"
        />
      ) : (
        <div 
          className={`todo-text ${todo.completed ? 'todo-text-completed' : ''}`}
          onClick={handleEdit}
          tabIndex="0"
          role="button"
          aria-label="编辑待办事项"
          onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
        >
          {todo.text}
        </div>
      )}

      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          className="todo-button"
          onClick={handleEdit}
          aria-label="编辑"
        >
          <FiEdit2 size={18} />
        </button>
        <button 
          className="todo-button text-danger"
          onClick={handleDelete}
          aria-label="删除"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;