/**
 * SwitchColor Chrome Extension - Content Script
 * 负责在网页中执行背景颜色切换操作
 */

// 全局变量
let originalBackgroundColor = null;
let originalBackgroundImage = null;
let originalBackgroundAttachment = null;
let originalBackgroundRepeat = null;
let originalBackgroundPosition = null;
let originalBackgroundSize = null;
let isBackgroundChanged = false;
let currentCustomColor = '#0066cc';

// 存储键名常量
const STORAGE_KEY_PREFIX = 'switchcolor_';
const ORIGINAL_BG_KEY = STORAGE_KEY_PREFIX + 'original_bg_';
const STATE_KEY = STORAGE_KEY_PREFIX + 'state_';

/**
 * 初始化content script
 */
function initializeContentScript() {
    try {
        console.log('Initializing SwitchColor content script...');
        
        // 检查基本环境
        if (!window.location || !document.documentElement) {
            console.warn('Page environment not ready, skipping initialization');
            return;
        }
        
        // 保存原始背景
        saveOriginalBackground();
        
        // 从storage恢复状态
        restoreStateFromStorage();
        
        // 开始监听页面变化
        observePageChanges();
        
        console.log('SwitchColor content script initialized successfully');
    } catch (error) {
        console.error('Content script initialization error:', error);
    }
}

/**
 * 保存原始背景样式
 */
function saveOriginalBackground() {
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    
    // 优先获取body的背景，如果body没有背景则获取html的背景
    originalBackgroundColor = bodyStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && bodyStyle.backgroundColor !== 'transparent'
        ? bodyStyle.backgroundColor
        : htmlStyle.backgroundColor;
    
    originalBackgroundImage = bodyStyle.backgroundImage !== 'none'
        ? bodyStyle.backgroundImage
        : htmlStyle.backgroundImage;
    
    originalBackgroundAttachment = bodyStyle.backgroundAttachment !== 'scroll'
        ? bodyStyle.backgroundAttachment
        : htmlStyle.backgroundAttachment;
    
    originalBackgroundRepeat = bodyStyle.backgroundRepeat !== 'repeat'
        ? bodyStyle.backgroundRepeat
        : htmlStyle.backgroundRepeat;
    
    originalBackgroundPosition = bodyStyle.backgroundPosition !== '0% 0%'
        ? bodyStyle.backgroundPosition
        : htmlStyle.backgroundPosition;
    
    originalBackgroundSize = bodyStyle.backgroundSize !== 'auto'
        ? bodyStyle.backgroundSize
        : htmlStyle.backgroundSize;
    
    // 保存到storage
    saveOriginalBackgroundToStorage();
}

/**
 * 保存原始背景到storage
 */
async function saveOriginalBackgroundToStorage() {
    try {
        const pageId = getCurrentPageId();
        const originalBgData = {
            color: originalBackgroundColor,
            image: originalBackgroundImage,
            attachment: originalBackgroundAttachment,
            repeat: originalBackgroundRepeat,
            position: originalBackgroundPosition,
            size: originalBackgroundSize,
            timestamp: Date.now()
        };
        
        await chrome.storage.local.set({
            [ORIGINAL_BG_KEY + pageId]: originalBgData
        });
    } catch (error) {
        console.error('Save original background error:', error);
    }
}

/**
 * 从storage恢复状态
 */
async function restoreStateFromStorage() {
    try {
        const pageId = getCurrentPageId();
        const result = await chrome.storage.local.get([
            STATE_KEY + pageId,
            ORIGINAL_BG_KEY + pageId,
            'switchcolor_selected_color'
        ]);
        
        // 恢复背景状态
        const savedState = result[STATE_KEY + pageId];
        if (savedState !== undefined) {
            isBackgroundChanged = savedState;
        }
        
        // 恢复原始背景数据
        const savedOriginalBg = result[ORIGINAL_BG_KEY + pageId];
        if (savedOriginalBg) {
            originalBackgroundColor = savedOriginalBg.color;
            originalBackgroundImage = savedOriginalBg.image;
            originalBackgroundAttachment = savedOriginalBg.attachment;
            originalBackgroundRepeat = savedOriginalBg.repeat;
            originalBackgroundPosition = savedOriginalBg.position;
            originalBackgroundSize = savedOriginalBg.size;
        }
        
        // 恢复选择的颜色
        const savedColor = result.switchcolor_selected_color;
        if (savedColor) {
            currentCustomColor = savedColor;
        }
        
        // 如果状态显示背景已更换，则应用自定义背景
        if (isBackgroundChanged) {
            applyCustomBackground(currentCustomColor);
        }
    } catch (error) {
        console.error('Restore state error:', error);
    }
}

/**
 * 获取当前页面的唯一标识
 */
function getCurrentPageId() {
    try {
        const url = window.location.href || 'unknown';
        // 使用简单的字符串哈希算法
        let hash = 0;
        for (let i = 0; i < url.length; i++) {
            const char = url.charCodeAt(i);
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
 * 应用自定义背景颜色
 */
function applyCustomBackground(color) {
    try {
        // 应用到body元素，使用!important确保优先级
        document.body.style.setProperty('background-color', color, 'important');
        document.body.style.setProperty('background-image', 'none', 'important');
        document.body.style.setProperty('background-attachment', 'scroll', 'important');
        document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
        
        // 也应用到html元素，确保完全覆盖
        document.documentElement.style.setProperty('background-color', color, 'important');
        document.documentElement.style.setProperty('background-image', 'none', 'important');
        
        // 添加过渡效果
        document.body.style.setProperty('transition', 'background-color 0.3s ease', 'important');
        document.documentElement.style.setProperty('transition', 'background-color 0.3s ease', 'important');
        
        console.log(`Applied custom background color: ${color}`);
    } catch (error) {
        console.error('Apply custom background error:', error);
        throw error;
    }
}

/**
 * 恢复原始背景
 */
function restoreOriginalBackground() {
    try {
        // 恢复body的原始样式
        document.body.style.backgroundColor = originalBackgroundColor || '';
        document.body.style.backgroundImage = originalBackgroundImage || '';
        document.body.style.backgroundAttachment = originalBackgroundAttachment || '';
        document.body.style.backgroundRepeat = originalBackgroundRepeat || '';
        document.body.style.backgroundPosition = originalBackgroundPosition || '';
        document.body.style.backgroundSize = originalBackgroundSize || '';
        
        // 恢复html的原始样式
        document.documentElement.style.backgroundColor = '';
        document.documentElement.style.backgroundImage = '';
        
        // 移除过渡效果
        setTimeout(() => {
            document.body.style.transition = '';
            document.documentElement.style.transition = '';
        }, 300);
        
        console.log('Restored original background');
    } catch (error) {
        console.error('Restore original background error:', error);
        throw error;
    }
}

/**
 * 切换背景颜色
 */
async function toggleBackground(color, currentState) {
    try {
        console.log('Toggling background, current state:', currentState, 'color:', color);
        currentCustomColor = color;
        
        if (currentState) {
            // 当前是自定义背景，切换回原始背景
            console.log('Restoring original background');
            restoreOriginalBackground();
            isBackgroundChanged = false;
        } else {
            // 当前是原始背景，切换到自定义背景
            console.log('Applying custom background:', color);
            applyCustomBackground(color);
            isBackgroundChanged = true;
        }
        
        // 保存状态到storage
        await saveStateToStorage();
        
        console.log('Background toggle completed, new state:', isBackgroundChanged);
        return { success: true, newState: isBackgroundChanged };
    } catch (error) {
        console.error('Toggle background error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * 保存状态到storage
 */
async function saveStateToStorage() {
    try {
        const pageId = getCurrentPageId();
        await chrome.storage.local.set({
            [STATE_KEY + pageId]: isBackgroundChanged
        });
    } catch (error) {
        console.error('Save state to storage error:', error);
    }
}

/**
 * 监听页面变化
 */
function observePageChanges() {
    // 监听DOM变化，防止其他脚本覆盖我们的样式
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && 
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                // 如果当前是自定义背景状态，重新应用样式
                if (isBackgroundChanged && mutation.target === document.body) {
                    setTimeout(() => {
                        if (document.body.style.backgroundColor !== currentCustomColor) {
                            applyCustomBackground(currentCustomColor);
                        }
                    }, 100);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isBackgroundChanged) {
            // 页面重新可见时，确保自定义背景仍然生效
            setTimeout(() => {
                applyCustomBackground(currentCustomColor);
            }, 100);
        }
    });
}

/**
 * 监听来自popup的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === 'toggleBackground') {
        toggleBackground(request.color, request.isChanged)
            .then(result => {
                console.log('Sending response back to popup:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('Error in toggleBackground:', error);
                sendResponse({ success: false, error: error.message });
            });
        return true; // 保持消息通道开放
    }
    
    if (request.action === 'getBackgroundState') {
        const state = {
            success: true,
            isChanged: isBackgroundChanged,
            currentColor: currentCustomColor
        };
        console.log('Sending background state:', state);
        sendResponse(state);
        return true;
    }
    
    // 未知的action
    console.warn('Unknown action received:', request.action);
    sendResponse({ success: false, error: 'Unknown action' });
    return true;
});

// 确保内容脚本只初始化一次
if (!window.switchColorInitialized) {
    console.log('SwitchColor content script loading...');
    window.switchColorInitialized = true;
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeContentScript);
    } else {
        // 页面已经加载完成，立即初始化
        initializeContentScript();
    }
    
    // 确保在页面完全加载后也进行初始化（防止某些情况下DOMContentLoaded事件丢失）
    if (document.readyState === 'complete') {
        setTimeout(initializeContentScript, 100);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initializeContentScript, 100);
        });
    }
    
    console.log('SwitchColor content script loaded, document state:', document.readyState);
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', () => {
        // 清理工作
        console.log('SwitchColor content script unloading');
        window.switchColorInitialized = false;
    });
} else {
    console.log('SwitchColor content script already initialized');
}