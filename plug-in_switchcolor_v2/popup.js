/**
 * SwitchColor Chrome Extension - Popup Script
 * 负责处理弹出窗口的用户交互和与内容脚本的通信
 */

// DOM 元素引用
let colorPicker;
let colorValue;
let toggleButton;
let statusMessage;
let statusDot;
let statusText;

// 应用状态
let currentState = {
    isModified: false,
    selectedColor: '#0000FF',
    tabId: null
};

/**
 * 初始化函数 - 页面加载完成后执行
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    initializeState();
});

/**
 * 初始化DOM元素引用
 */
function initializeElements() {
    colorPicker = document.getElementById('colorPicker');
    colorValue = document.getElementById('colorValue');
    toggleButton = document.getElementById('toggleButton');
    statusMessage = document.getElementById('statusMessage');
    statusDot = document.getElementById('statusDot');
    statusText = document.getElementById('statusText');
    
    // 验证所有必需元素是否存在
    if (!colorPicker || !colorValue || !toggleButton || !statusMessage || !statusDot || !statusText) {
        console.error('SwitchColor: 无法找到必需的DOM元素');
        return;
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 颜色选择器变化事件
    colorPicker.addEventListener('input', handleColorChange);
    colorPicker.addEventListener('change', handleColorChange);
    
    // 切换按钮点击事件
    toggleButton.addEventListener('click', handleToggleClick);
    
    // 键盘快捷键支持
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * 初始化应用状态
 */
async function initializeState() {
    try {
        // 获取当前活动标签页
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            showError('无法获取当前标签页信息');
            return;
        }
        
        currentState.tabId = tab.id;
        
        // 从内容脚本获取当前状态
        const response = await sendMessageToContentScript({ action: 'getState' });
        if (response && response.success) {
            updateUIState(response.state);
        } else {
            // 如果无法获取状态，使用默认状态
            updateUIState({ isModified: false });
        }
        
        // 加载保存的颜色偏好
        loadColorPreference();
        
    } catch (error) {
        console.error('SwitchColor: 初始化失败:', error);
        showError('插件初始化失败，请刷新页面后重试');
    }
}

/**
 * 处理颜色选择器变化
 */
function handleColorChange(event) {
    const newColor = event.target.value;
    currentState.selectedColor = newColor;
    
    // 更新颜色值显示
    colorValue.textContent = newColor.toUpperCase();
    
    // 保存颜色偏好
    saveColorPreference(newColor);
    
    // 添加视觉反馈
    colorValue.style.color = newColor;
    setTimeout(() => {
        colorValue.style.color = '#6c757d';
    }, 1000);
}

/**
 * 处理切换按钮点击
 */
async function handleToggleClick() {
    if (!currentState.tabId) {
        showError('无法获取标签页信息');
        return;
    }
    
    try {
        // 禁用按钮防止重复点击
        toggleButton.disabled = true;
        toggleButton.textContent = '处理中...';
        
        // 发送切换命令到内容脚本
        const message = {
            action: 'toggleBackground',
            color: currentState.selectedColor
        };
        
        const response = await sendMessageToContentScript(message);
        
        if (response && response.success) {
            // 更新UI状态
            updateUIState(response.state);
            showSuccess(response.state.isModified ? '背景已切换' : '已恢复原始背景');
        } else {
            showError(response?.error || '操作失败，请重试');
        }
        
    } catch (error) {
        console.error('SwitchColor: 切换失败:', error);
        showError('操作失败，请检查页面是否支持');
    } finally {
        // 恢复按钮状态
        toggleButton.disabled = false;
        toggleButton.textContent = '切换背景颜色';
    }
}

/**
 * 处理键盘快捷键
 */
function handleKeyDown(event) {
    // Enter键或空格键触发切换
    if (event.key === 'Enter' || event.key === ' ') {
        if (event.target === toggleButton) {
            return; // 让按钮自己处理
        }
        event.preventDefault();
        handleToggleClick();
    }
    
    // Escape键关闭弹窗
    if (event.key === 'Escape') {
        window.close();
    }
}

/**
 * 向内容脚本发送消息
 */
async function sendMessageToContentScript(message) {
    try {
        const response = await chrome.tabs.sendMessage(currentState.tabId, message);
        return response;
    } catch (error) {
        console.error('SwitchColor: 消息发送失败:', error);
        throw new Error('无法与页面通信，请刷新页面后重试');
    }
}

/**
 * 更新UI状态
 */
function updateUIState(state) {
    currentState.isModified = state.isModified;
    
    // 更新状态指示器
    if (state.isModified) {
        statusDot.className = 'status-dot modified';
        statusText.textContent = '已修改背景';
        statusMessage.textContent = '点击按钮恢复原始背景';
    } else {
        statusDot.className = 'status-dot original';
        statusText.textContent = '原始背景';
        statusMessage.textContent = '点击下方按钮更换背景';
    }
    
    // 更新按钮文本
    toggleButton.textContent = state.isModified ? '恢复原始背景' : '切换背景颜色';
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
    statusMessage.textContent = message;
    statusMessage.style.color = '#28a745';
    
    // 3秒后恢复默认样式
    setTimeout(() => {
        statusMessage.style.color = '#666';
    }, 3000);
}

/**
 * 显示错误消息
 */
function showError(message) {
    statusMessage.textContent = message;
    statusMessage.style.color = '#dc3545';
    
    // 5秒后恢复默认样式
    setTimeout(() => {
        statusMessage.textContent = currentState.isModified ? '点击按钮恢复原始背景' : '点击下方按钮更换背景';
        statusMessage.style.color = '#666';
    }, 5000);
}

/**
 * 保存颜色偏好到本地存储
 */
function saveColorPreference(color) {
    try {
        localStorage.setItem('switchcolor_preferred_color', color);
    } catch (error) {
        console.warn('SwitchColor: 无法保存颜色偏好:', error);
    }
}

/**
 * 加载保存的颜色偏好
 */
function loadColorPreference() {
    try {
        const savedColor = localStorage.getItem('switchcolor_preferred_color');
        if (savedColor && /^#[0-9A-Fa-f]{6}$/.test(savedColor)) {
            colorPicker.value = savedColor;
            colorValue.textContent = savedColor.toUpperCase();
            currentState.selectedColor = savedColor;
        }
    } catch (error) {
        console.warn('SwitchColor: 无法加载颜色偏好:', error);
    }
}

/**
 * 工具函数：验证颜色格式
 */
function isValidColor(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * 工具函数：获取颜色的对比色（用于文本显示）
 */
function getContrastColor(hexColor) {
    // 移除#号
    const hex = hexColor.replace('#', '');
    
    // 转换为RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 返回对比色
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

// 错误处理：全局错误捕获
window.addEventListener('error', function(event) {
    console.error('SwitchColor: 全局错误:', event.error);
    showError('发生未知错误，请重新打开插件');
});

// 页面卸载时的清理工作
window.addEventListener('beforeunload', function() {
    // 清理定时器等资源
    // 这里可以添加需要清理的资源
});
