'use client';

import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiFlag } from 'react-icons/fi';
import { useTodo } from '../context/TodoContext';

const AddTodo = () => {
  const { addTodo } = useTodo();
  const [text, setText] = useState('');
  // 修改默认优先级为medium
  const [priority, setPriority] = useState('medium');
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPriorityMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 优先级对应的颜色和标签
  const priorityConfig = {
    high: { color: 'bg-red-500', label: '高' },
    medium: { color: 'bg-yellow-500', label: '中' },
    low: { color: 'bg-blue-500', label: '低' }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      // 添加待办事项
      console.log('提交表单时的优先级:', priority);
      // 确保传递正确的优先级值
      addTodo(text, priority);
      
      // 重置表单但保留当前选择的优先级
      setText('');
    }
  };
  
  // 优先级变更函数
  const handlePriorityChange = (newPriority) => {
    console.log('优先级变更为:', newPriority);
    // 确保优先级值正确设置
    if (newPriority && ['high', 'medium', 'low'].includes(newPriority)) {
      setPriority(newPriority);
      // 确保优先级菜单关闭
      setShowPriorityMenu(false);
    } else {
      console.error('无效的优先级值:', newPriority);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            className="p-3 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
            onClick={() => {
              setShowPriorityMenu(!showPriorityMenu);
            }}
            aria-label="设置优先级"
            aria-haspopup="true"
            aria-expanded={showPriorityMenu}
          >
            <span 
                className={`inline-block w-3 h-3 rounded-full mr-2`}
                style={{
                  backgroundColor: priority === 'high' ? '#ef4444' : 
                                 priority === 'medium' ? '#eab308' : 
                                 '#3b82f6'
                }}
                data-priority={priority}
              ></span>
              
              <span className="text-sm">{priorityConfig[priority].label}优先级</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
          </button>
          
          {showPriorityMenu && (
            <div ref={menuRef} className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 min-w-[120px] w-32 border border-gray-200">
              <button 
                type="button"
                className="priority-menu-item w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('点击了高优先级按钮');
                  handlePriorityChange('high');
                }}
              >
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#ef4444'}}></span>
                高优先级
                {priority === 'high' && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
              <button 
                type="button"
                className="priority-menu-item w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('点击了中优先级按钮');
                  handlePriorityChange('medium');
                }}
              >
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#eab308'}}></span>
                中优先级
                {priority === 'medium' && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
              <button 
                type="button"
                className="priority-menu-item w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('点击了低优先级按钮');
                  handlePriorityChange('low');
                }}
              >
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{backgroundColor: '#3b82f6'}}></span>
                低优先级
                {priority === 'low' && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
        
        <input
          type="text"
          className="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="添加新的待办事项..."
          aria-label="添加新的待办事项"
        />
        <button
          type="submit"
          className="p-3 bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
          aria-label="添加"
          disabled={!text.trim()}
        >
          <FiPlus size={24} />
        </button>
      </div>
    </form>
  );
};

export default AddTodo;