/**
 * SwitchColor Chrome Extension - Popup Script
 * 负责处理弹出窗口的用户交互逻辑
 */

// DOM元素引用
let colorPicker;
let colorValue;
let toggleButton;
let buttonText;
let statusMessage;
let statusDot;
let statusText;
let container;

// 状态变量
let isBackgroundChanged = false;
let currentTabId = null;
let currentPageId = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    // 初始化DOM元素引用
    initDOMElements();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 调用初始化函数
    await init();
});

/**
 * 初始化函数
 */
async function init() {
    try {
        console.log('Initializing popup...');
        
        // 获取当前标签页
        await getCurrentTab();
        console.log('Current tab ID:', currentTabId, 'Page ID:', currentPageId);
        
        if (!currentTabId || !currentPageId) {
            throw new Error('无法获取标签页信息');
        }
        
        // 加载保存的状态
        await loadSavedState();
        
        // 更新UI
        updateUI();
        
        console.log('Popup initialized successfully');
    } catch (error) {
        console.error('Init error:', error);
        showError('初始化失败，请刷新页面后重试');
    }
}

/**
 * 初始化DOM元素引用
 */
function initDOMElements() {
    colorPicker = document.getElementById('colorPicker');
    colorValue = document.getElementById('colorValue');
    toggleButton = document.getElementById('toggleButton');
    buttonText = document.getElementById('buttonText');
    statusMessage = document.getElementById('statusMessage');
    statusDot = document.getElementById('statusDot');
    statusText = document.getElementById('statusText');
    container = document.querySelector('.container');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 颜色选择器变化事件
    colorPicker.addEventListener('input', handleColorChange);
    
    // 切换按钮点击事件
    toggleButton.addEventListener('click', handleToggleClick);
    
    // 键盘事件支持
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * 处理颜色选择器变化
 */
function handleColorChange(event) {
    const selectedColor = event.target.value;
    colorValue.textContent = selectedColor;
    
    // 保存选择的颜色
    saveColorToStorage(selectedColor);
    
    // 添加视觉反馈
    colorValue.style.backgroundColor = selectedColor + '20'; // 20% 透明度
    colorValue.style.borderColor = selectedColor;
}

/**
 * 处理切换按钮点击
 */
async function handleToggleClick() {
    if (!currentTabId || !currentPageId) {
        showError('无法获取当前标签页信息，请刷新页面后重试');
        return;
    }
    
    // 显示加载状态
    setLoadingState(true);
    
    try {
        const selectedColor = colorPicker.value;
        console.log('Sending message to tab:', currentTabId, 'with color:', selectedColor);
        
        // 先尝试注入content script（如果还未注入的话）
        await ensureContentScriptInjected();
        
        // 向content script发送消息
        let response;
        try {
            response = await chrome.tabs.sendMessage(currentTabId, {
                action: 'toggleBackground',
                color: selectedColor,
                isChanged: isBackgroundChanged
            });
        } catch (messageError) {
            console.error('Message sending error:', messageError);
            // 检查是否是因为content script未加载
            if (messageError.message && messageError.message.includes('Could not establish connection')) {
                // 尝试手动注入content script
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: currentTabId },
                        files: ['content.js']
                    });
                    console.log('Content script manually injected');
                    // 等待一下让content script初始化
                    await new Promise(resolve => setTimeout(resolve, 500));
                    // 重新尝试发送消息
                    response = await chrome.tabs.sendMessage(currentTabId, {
                        action: 'toggleBackground',
                        color: selectedColor,
                        isChanged: isBackgroundChanged
                    });
                } catch (injectError) {
                    console.error('Content script injection failed:', injectError);
                    throw new Error('页面脚本注入失败，请刷新页面后重试');
                }
            } else {
                throw new Error('无法与页面通信，请刷新页面后重试');
            }
        }
        
        console.log('Received response:', response);
        
        if (response && response.success) {
            // 更新状态
            const previousState = isBackgroundChanged;
            isBackgroundChanged = !isBackgroundChanged;
            console.log('State updated from', previousState, 'to', isBackgroundChanged);
            
            // 保存状态到storage
            await saveStateToStorage();
            
            // 更新UI
            updateUI();
            
            // 显示成功消息
            showSuccess(isBackgroundChanged ? '背景颜色已更换' : '背景颜色已恢复');
        } else {
            console.error('Toggle failed, response:', response);
            throw new Error(response?.error || '操作失败');
        }
    } catch (error) {
        console.error('Toggle background error:', error);
        showError('操作失败，请刷新页面后重试');
    } finally {
        // 隐藏加载状态
        setLoadingState(false);
    }
}

/**
 * 处理键盘事件
 */
function handleKeyDown(event) {
    // 按Enter键触发切换
    if (event.key === 'Enter') {
        event.preventDefault();
        handleToggleClick();
    }
    
    // 按Escape键关闭弹窗
    if (event.key === 'Escape') {
        window.close();
    }
}

/**
 * 获取当前活动标签页
 */
async function getCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTabId = tab?.id;
        
        if (!currentTabId) {
            throw new Error('无法获取当前标签页');
        }
        
        // 获取当前页面的URL用于生成页面ID
        currentPageId = await getCurrentPageId(tab);
    } catch (error) {
        console.error('Get current tab error:', error);
        showError('无法获取当前标签页信息');
    }
}

/**
 * 获取当前页面的唯一标识
 */
function getCurrentPageId(tab) {
    try {
        // 使用传入的tab对象的URL或默认值
        const pageUrl = (tab && tab.url) ? tab.url : 'unknown';
        // 使用简单的字符串哈希算法
        let hash = 0;
        for (let i = 0; i < pageUrl.length; i++) {
            const char = pageUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString();
    } catch (error) {
        console.error('Get page ID error:', error);
        // 如果出错，返回一个基于时间戳的ID
        return 'fallback_' + Date.now().toString();
    }
}

/**
 * 从storage加载保存的状态
 */
async function loadSavedState() {
    try {
        const result = await chrome.storage.local.get([
            `switchcolor_state_${currentPageId}`,
            'switchcolor_selected_color'
        ]);
        
        // 加载背景状态
        const savedState = result[`switchcolor_state_${currentPageId}`];
        if (savedState !== undefined) {
            isBackgroundChanged = savedState;
        }
        
        // 加载选择的颜色
        const savedColor = result.switchcolor_selected_color;
        if (savedColor) {
            colorPicker.value = savedColor;
            colorValue.textContent = savedColor;
            handleColorChange({ target: { value: savedColor } });
        }
    } catch (error) {
        console.error('Load saved state error:', error);
    }
}

/**
 * 保存状态到storage
 */
async function saveStateToStorage() {
    try {
        await chrome.storage.local.set({
            [`switchcolor_state_${currentPageId}`]: isBackgroundChanged
        });
    } catch (error) {
        console.error('Save state error:', error);
    }
}

/**
 * 保存颜色到storage
 */
async function saveColorToStorage(color) {
    try {
        await chrome.storage.local.set({
            'switchcolor_selected_color': color
        });
    } catch (error) {
        console.error('Save color error:', error);
    }
}

/**
 * 更新UI状态
 */
function updateUI() {
    if (isBackgroundChanged) {
        // 背景已更换状态
        buttonText.textContent = '恢复原始背景';
        statusText.textContent = '自定义背景';
        statusDot.classList.add('changed');
        statusMessage.innerHTML = '<p>背景颜色已更换为自定义颜色</p>';
    } else {
        // 原始背景状态
        buttonText.textContent = '切换背景颜色';
        statusText.textContent = '原始背景';
        statusDot.classList.remove('changed');
        statusMessage.innerHTML = '<p>点击下方按钮更换背景</p>';
    }
}

/**
 * 设置加载状态
 */
function setLoadingState(loading) {
    if (loading) {
        container.classList.add('loading');
        toggleButton.disabled = true;
        buttonText.textContent = '处理中...';
    } else {
        container.classList.remove('loading');
        toggleButton.disabled = false;
        updateUI(); // 恢复按钮文本
    }
}

/**
 * 显示成功消息
 */
function showSuccess(message) {
    statusMessage.innerHTML = `<p style="color: #28a745; font-weight: 500;">${message}</p>`;
    
    // 3秒后恢复默认消息
    setTimeout(() => {
        updateUI();
    }, 3000);
}

/**
 * 显示错误消息
 */
function showError(message) {
    statusMessage.innerHTML = `<p style="color: #dc3545; font-weight: 500;">${message}</p>`;
    
    // 5秒后恢复默认消息
    setTimeout(() => {
        updateUI();
    }, 5000);
}

/**
 * 确保content script已经注入到页面中
 */
async function ensureContentScriptInjected() {
    try {
        // 尝试发送状态检查消息
        await chrome.tabs.sendMessage(currentTabId, { action: 'getBackgroundState' });
        console.log('Content script already injected');
    } catch (error) {
        console.log('Content script not found, attempting injection...');
        try {
            await chrome.scripting.executeScript({
                target: { tabId: currentTabId },
                files: ['content.js']
            });
            console.log('Content script injected successfully');
            // 等待content script初始化
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (injectError) {
            console.error('Failed to inject content script:', injectError);
            throw new Error('无法注入页面脚本');
        }
    }
}

/**
 * 页面卸载时的清理工作
 */
window.addEventListener('beforeunload', function() {
    // 清理事件监听器
    document.removeEventListener('keydown', handleKeyDown);
});