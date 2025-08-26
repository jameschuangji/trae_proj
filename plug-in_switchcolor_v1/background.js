/**
 * SwitchColor Chrome Extension - Background Script
 * 负责处理插件的后台逻辑和消息传递
 */

// 插件安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
    console.log('SwitchColor extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        // 首次安装时的初始化
        initializeExtension();
    } else if (details.reason === 'update') {
        // 更新时的处理
        handleExtensionUpdate(details.previousVersion);
    }
});

/**
 * 初始化插件
 */
async function initializeExtension() {
    try {
        // 设置默认配置
        await chrome.storage.local.set({
            'switchcolor_selected_color': '#0066cc',
            'switchcolor_extension_version': '1.0',
            'switchcolor_install_time': Date.now()
        });
        
        console.log('SwitchColor extension initialized successfully');
    } catch (error) {
        console.error('Extension initialization error:', error);
    }
}

/**
 * 处理插件更新
 */
async function handleExtensionUpdate(previousVersion) {
    try {
        console.log(`Extension updated from ${previousVersion} to 1.0`);
        
        // 更新版本信息
        await chrome.storage.local.set({
            'switchcolor_extension_version': '1.0',
            'switchcolor_update_time': Date.now()
        });
        
        // 可以在这里添加版本迁移逻辑
        await migrateDataIfNeeded(previousVersion);
        
    } catch (error) {
        console.error('Extension update handling error:', error);
    }
}

/**
 * 数据迁移（如果需要）
 */
async function migrateDataIfNeeded(previousVersion) {
    // 这里可以添加不同版本间的数据迁移逻辑
    console.log('Checking for data migration needs...');
    
    // 示例：如果从1.0版本升级，可能需要迁移某些数据格式
    if (previousVersion === '1.0') {
        // 执行特定的迁移逻辑
        console.log('Migrating data from version 1.0');
    }
}

/**
 * 监听来自content script和popup的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 处理获取当前标签页ID的请求
    if (request.action === 'getCurrentTabId') {
        handleGetCurrentTabId(sender, sendResponse);
        return true; // 保持消息通道开放
    }
    
    // 处理获取插件信息的请求
    if (request.action === 'getExtensionInfo') {
        handleGetExtensionInfo(sendResponse);
        return true;
    }
    
    // 处理清理存储的请求
    if (request.action === 'cleanupStorage') {
        handleCleanupStorage(request.tabId, sendResponse);
        return true;
    }
});

/**
 * 处理获取当前标签页ID的请求
 */
function handleGetCurrentTabId(sender, sendResponse) {
    try {
        const tabId = sender.tab?.id;
        if (tabId) {
            sendResponse({ success: true, tabId: tabId });
        } else {
            sendResponse({ success: false, error: 'Unable to get tab ID' });
        }
    } catch (error) {
        console.error('Get current tab ID error:', error);
        sendResponse({ success: false, error: error.message });
    }
}

/**
 * 处理获取插件信息的请求
 */
async function handleGetExtensionInfo(sendResponse) {
    try {
        const storageData = await chrome.storage.local.get([
            'switchcolor_extension_version',
            'switchcolor_install_time',
            'switchcolor_update_time'
        ]);
        
        const extensionInfo = {
            name: 'SwitchColor',
            version: '1.0',
            description: '一个用于切换网页背景颜色的Chrome浏览器插件',
            installTime: storageData.switchcolor_install_time,
            updateTime: storageData.switchcolor_update_time
        };
        
        sendResponse({ success: true, info: extensionInfo });
    } catch (error) {
        console.error('Get extension info error:', error);
        sendResponse({ success: false, error: error.message });
    }
}

/**
 * 处理清理存储的请求
 */
async function handleCleanupStorage(tabId, sendResponse) {
    try {
        if (tabId) {
            // 清理特定标签页的数据
            await chrome.storage.local.remove([
                `switchcolor_state_${tabId}`,
                `switchcolor_original_bg_${tabId}`
            ]);
            console.log(`Cleaned up storage for tab ${tabId}`);
        } else {
            // 清理所有过期数据
            await cleanupExpiredData();
        }
        
        sendResponse({ success: true });
    } catch (error) {
        console.error('Cleanup storage error:', error);
        sendResponse({ success: false, error: error.message });
    }
}

/**
 * 清理过期数据
 */
async function cleanupExpiredData() {
    try {
        const allData = await chrome.storage.local.get();
        const keysToRemove = [];
        const currentTime = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天
        
        for (const [key, value] of Object.entries(allData)) {
            // 清理过期的原始背景数据
            if (key.startsWith('switchcolor_original_bg_') && value.timestamp) {
                if (currentTime - value.timestamp > maxAge) {
                    keysToRemove.push(key);
                }
            }
        }
        
        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log(`Cleaned up ${keysToRemove.length} expired storage items`);
        }
    } catch (error) {
        console.error('Cleanup expired data error:', error);
    }
}

/**
 * 监听标签页关闭事件
 */
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // 标签页关闭时清理相关数据
    handleTabClosed(tabId);
});

/**
 * 处理标签页关闭事件
 */
async function handleTabClosed(tabId) {
    try {
        // 清理该标签页的相关数据
        await chrome.storage.local.remove([
            `switchcolor_state_${tabId}`,
            `switchcolor_original_bg_${tabId}`
        ]);
        
        console.log(`Cleaned up data for closed tab ${tabId}`);
    } catch (error) {
        console.error('Handle tab closed error:', error);
    }
}

/**
 * 定期清理过期数据
 */
function setupPeriodicCleanup() {
    try {
        // 每小时执行一次清理
        chrome.alarms.create('cleanup', { periodInMinutes: 60 });
    } catch (error) {
        console.error('Setup periodic cleanup error:', error);
    }
}

/**
 * 监听定时器事件
 */
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        cleanupExpiredData();
    }
});

/**
 * 监听插件启动事件
 */
chrome.runtime.onStartup.addListener(() => {
    console.log('SwitchColor extension started');
    setupPeriodicCleanup();
});

// 初始化定期清理
setupPeriodicCleanup();

console.log('SwitchColor background script loaded');