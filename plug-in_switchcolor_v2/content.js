/**
 * SwitchColor Chrome Extension - Content Script
 * 负责在网页中执行背景颜色切换功能
 */

// 扩展状态管理
const SwitchColorState = {
    isModified: false,
    originalBackground: null,
    currentColor: null,
    targetElement: null,
    
    // 重置状态
    reset() {
        this.isModified = false;
        this.originalBackground = null;
        this.currentColor = null;
        this.targetElement = null;
    }
};

/**
 * 主要功能类 - 背景颜色切换器
 */
class BackgroundSwitcher {
    constructor() {
        this.init();
    }
    
    /**
     * 初始化内容脚本
     */
    init() {
        // 监听来自popup的消息
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // 保持消息通道开放以支持异步响应
        });
        
        // 页面加载完成后的初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onPageReady());
        } else {
            this.onPageReady();
        }
        
        console.log('SwitchColor: 内容脚本已加载');
    }
    
    /**
     * 页面准备就绪时的处理
     */
    onPageReady() {
        // 检测页面是否支持背景修改
        this.detectPageSupport();
        
        // 监听页面变化（SPA应用支持）
        this.observePageChanges();
    }
    
    /**
     * 处理来自popup的消息
     */
    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.action) {
                case 'getState':
                    sendResponse({
                        success: true,
                        state: {
                            isModified: SwitchColorState.isModified
                        }
                    });
                    break;
                    
                case 'toggleBackground':
                    const result = await this.toggleBackground(message.color);
                    sendResponse(result);
                    break;
                    
                default:
                    sendResponse({
                        success: false,
                        error: '未知的操作类型'
                    });
            }
        } catch (error) {
            console.error('SwitchColor: 消息处理失败:', error);
            sendResponse({
                success: false,
                error: error.message || '操作失败'
            });
        }
    }
    
    /**
     * 切换背景颜色
     */
    async toggleBackground(color) {
        try {
            if (SwitchColorState.isModified) {
                // 恢复原始背景
                return this.restoreOriginalBackground();
            } else {
                // 应用新背景
                return this.applyNewBackground(color);
            }
        } catch (error) {
            console.error('SwitchColor: 背景切换失败:', error);
            return {
                success: false,
                error: '背景切换失败: ' + error.message
            };
        }
    }
    
    /**
     * 应用新的背景颜色
     */
    applyNewBackground(color) {
        // 验证颜色格式
        if (!this.isValidColor(color)) {
            throw new Error('无效的颜色格式');
        }
        
        // 找到最适合的目标元素
        const targetElement = this.findBestTargetElement();
        if (!targetElement) {
            throw new Error('无法找到合适的目标元素');
        }
        
        // 保存原始背景信息
        this.saveOriginalBackground(targetElement);
        
        // 应用新背景
        this.setElementBackground(targetElement, color);
        
        // 更新状态
        SwitchColorState.isModified = true;
        SwitchColorState.currentColor = color;
        SwitchColorState.targetElement = targetElement;
        
        // 添加标识类名
        targetElement.classList.add('switchcolor-modified');
        
        console.log('SwitchColor: 背景已切换为', color);
        
        return {
            success: true,
            state: {
                isModified: true
            }
        };
    }
    
    /**
     * 恢复原始背景
     */
    restoreOriginalBackground() {
        if (!SwitchColorState.targetElement || !SwitchColorState.originalBackground) {
            throw new Error('没有可恢复的背景信息');
        }
        
        // 恢复原始背景样式
        this.restoreElementBackground(SwitchColorState.targetElement, SwitchColorState.originalBackground);
        
        // 移除标识类名
        SwitchColorState.targetElement.classList.remove('switchcolor-modified');
        
        console.log('SwitchColor: 背景已恢复');
        
        // 重置状态
        SwitchColorState.reset();
        
        return {
            success: true,
            state: {
                isModified: false
            }
        };
    }
    
    /**
     * 寻找最佳的目标元素
     */
    findBestTargetElement() {
        // 优先级顺序：body > html > 主要内容区域
        const candidates = [
            document.body,
            document.documentElement,
            document.querySelector('main'),
            document.querySelector('#main'),
            document.querySelector('.main'),
            document.querySelector('#content'),
            document.querySelector('.content'),
            document.querySelector('#app'),
            document.querySelector('.app')
        ].filter(el => el !== null);
        
        // 选择第一个有效的候选元素
        for (const element of candidates) {
            if (this.isValidTargetElement(element)) {
                return element;
            }
        }
        
        return document.body || document.documentElement;
    }
    
    /**
     * 验证目标元素是否有效
     */
    isValidTargetElement(element) {
        if (!element) return false;
        
        // 检查元素是否可见
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
    }
    
    /**
     * 保存原始背景信息
     */
    saveOriginalBackground(element) {
        const computedStyle = window.getComputedStyle(element);
        
        SwitchColorState.originalBackground = {
            backgroundColor: element.style.backgroundColor || '',
            backgroundImage: element.style.backgroundImage || '',
            background: element.style.background || '',
            computedBackgroundColor: computedStyle.backgroundColor,
            computedBackgroundImage: computedStyle.backgroundImage,
            computedBackground: computedStyle.background
        };
    }
    
    /**
     * 设置元素背景
     */
    setElementBackground(element, color) {
        // 使用重要性声明确保样式生效
        element.style.setProperty('background-color', color, 'important');
        element.style.setProperty('background-image', 'none', 'important');
    }
    
    /**
     * 恢复元素背景
     */
    restoreElementBackground(element, originalBackground) {
        // 移除我们设置的样式
        element.style.removeProperty('background-color');
        element.style.removeProperty('background-image');
        
        // 恢复原始样式
        if (originalBackground.backgroundColor) {
            element.style.backgroundColor = originalBackground.backgroundColor;
        }
        if (originalBackground.backgroundImage) {
            element.style.backgroundImage = originalBackground.backgroundImage;
        }
        if (originalBackground.background) {
            element.style.background = originalBackground.background;
        }
    }
    
    /**
     * 验证颜色格式
     */
    isValidColor(color) {
        // 支持十六进制颜色格式
        return /^#[0-9A-Fa-f]{6}$/.test(color);
    }
    
    /**
     * 检测页面是否支持背景修改
     */
    detectPageSupport() {
        // 检查是否为特殊页面（如chrome://、about:等）
        const url = window.location.href;
        const unsupportedProtocols = ['chrome:', 'chrome-extension:', 'moz-extension:', 'about:', 'file:'];
        
        for (const protocol of unsupportedProtocols) {
            if (url.startsWith(protocol)) {
                console.warn('SwitchColor: 当前页面可能不支持背景修改');
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 监听页面变化（支持SPA应用）
     */
    observePageChanges() {
        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            // 如果页面结构发生重大变化，可能需要重新应用背景
            let significantChange = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有重要元素被添加
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const tagName = node.tagName?.toLowerCase();
                            if (['body', 'main', 'div'].includes(tagName) && 
                                (node.id === 'app' || node.id === 'root' || node.className.includes('app'))) {
                                significantChange = true;
                                break;
                            }
                        }
                    }
                }
            });
            
            // 如果检测到重大变化且当前处于修改状态，重新应用背景
            if (significantChange && SwitchColorState.isModified) {
                console.log('SwitchColor: 检测到页面变化，重新应用背景');
                setTimeout(() => {
                    this.reapplyBackground();
                }, 100);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * 重新应用背景（用于SPA页面变化后）
     */
    reapplyBackground() {
        if (!SwitchColorState.isModified || !SwitchColorState.currentColor) {
            return;
        }
        
        try {
            // 寻找新的目标元素
            const newTarget = this.findBestTargetElement();
            if (newTarget && newTarget !== SwitchColorState.targetElement) {
                // 清理旧元素
                if (SwitchColorState.targetElement) {
                    SwitchColorState.targetElement.classList.remove('switchcolor-modified');
                }
                
                // 应用到新元素
                this.saveOriginalBackground(newTarget);
                this.setElementBackground(newTarget, SwitchColorState.currentColor);
                newTarget.classList.add('switchcolor-modified');
                
                SwitchColorState.targetElement = newTarget;
                
                console.log('SwitchColor: 背景已重新应用到新元素');
            }
        } catch (error) {
            console.error('SwitchColor: 重新应用背景失败:', error);
        }
    }
}

// 创建背景切换器实例
const backgroundSwitcher = new BackgroundSwitcher();

// 页面卸载时的清理
window.addEventListener('beforeunload', () => {
    // 如果页面即将卸载且背景已修改，记录状态
    if (SwitchColorState.isModified) {
        console.log('SwitchColor: 页面卸载，背景修改状态将丢失');
    }
});

// 导出给调试使用
if (typeof window !== 'undefined') {
    window.SwitchColorDebug = {
        state: SwitchColorState,
        switcher: backgroundSwitcher
    };
}
