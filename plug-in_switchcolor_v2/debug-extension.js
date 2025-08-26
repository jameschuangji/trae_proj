/**
 * SwitchColor Extension Debug Script
 * 用于在浏览器控制台中调试扩展功能
 */

// 调试工具对象
const SwitchColorDebugger = {
    
    /**
     * 检查扩展是否正确加载
     */
    checkExtensionLoaded() {
        console.log('=== SwitchColor Extension Debug ===');
        
        if (window.SwitchColorDebug) {
            console.log('✅ 扩展已加载');
            console.log('状态:', window.SwitchColorDebug.state);
            return true;
        } else {
            console.log('❌ 扩展未加载');
            console.log('请检查:');
            console.log('1. 扩展是否已安装');
            console.log('2. 扩展是否已启用');
            console.log('3. 页面是否已刷新');
            return false;
        }
    },
    
    /**
     * 检查页面背景信息
     */
    checkBackgroundInfo() {
        console.log('=== 背景信息检查 ===');
        
        const body = document.body;
        const html = document.documentElement;
        const computedBodyStyle = window.getComputedStyle(body);
        const computedHtmlStyle = window.getComputedStyle(html);
        
        console.log('Body元素:');
        console.log('  背景颜色:', computedBodyStyle.backgroundColor);
        console.log('  背景图片:', computedBodyStyle.backgroundImage);
        console.log('  内联样式:', body.style.cssText);
        
        console.log('HTML元素:');
        console.log('  背景颜色:', computedHtmlStyle.backgroundColor);
        console.log('  背景图片:', computedHtmlStyle.backgroundImage);
        console.log('  内联样式:', html.style.cssText);
        
        // 检查修改标记
        if (body.classList.contains('switchcolor-modified')) {
            console.log('✅ Body元素有SwitchColor修改标记');
        }
        if (html.classList.contains('switchcolor-modified')) {
            console.log('✅ HTML元素有SwitchColor修改标记');
        }
    },
    
    /**
     * 模拟扩展消息发送
     */
    simulateMessage(action, data = {}) {
        console.log(`=== 模拟消息: ${action} ===`);
        
        if (!window.SwitchColorDebug) {
            console.log('❌ 扩展未加载，无法发送消息');
            return;
        }
        
        const message = { action, ...data };
        console.log('发送消息:', message);
        
        // 模拟消息处理
        try {
            const switcher = window.SwitchColorDebug.switcher;
            switcher.handleMessage(message, null, (response) => {
                console.log('收到响应:', response);
            });
        } catch (error) {
            console.error('消息处理失败:', error);
        }
    },
    
    /**
     * 测试颜色切换
     */
    testColorSwitch(color = '#FF0000') {
        console.log(`=== 测试颜色切换: ${color} ===`);
        this.simulateMessage('toggleBackground', { color });
    },
    
    /**
     * 获取状态
     */
    getState() {
        console.log('=== 获取扩展状态 ===');
        this.simulateMessage('getState');
    },
    
    /**
     * 检查页面兼容性
     */
    checkCompatibility() {
        console.log('=== 页面兼容性检查 ===');
        
        const url = window.location.href;
        console.log('当前URL:', url);
        
        // 检查协议
        const unsupportedProtocols = ['chrome:', 'chrome-extension:', 'moz-extension:', 'about:', 'file:'];
        const isUnsupported = unsupportedProtocols.some(protocol => url.startsWith(protocol));
        
        if (isUnsupported) {
            console.log('⚠️ 当前页面可能不支持扩展功能');
        } else {
            console.log('✅ 页面协议兼容');
        }
        
        // 检查CSP
        const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        if (metaTags.length > 0) {
            console.log('⚠️ 检测到CSP策略，可能影响扩展功能');
            metaTags.forEach((tag, index) => {
                console.log(`CSP ${index + 1}:`, tag.content);
            });
        } else {
            console.log('✅ 未检测到限制性CSP策略');
        }
        
        // 检查iframe
        if (window !== window.top) {
            console.log('⚠️ 当前页面在iframe中，可能影响扩展功能');
        } else {
            console.log('✅ 页面不在iframe中');
        }
    },
    
    /**
     * 运行完整诊断
     */
    runFullDiagnostic() {
        console.clear();
        console.log('🔍 开始SwitchColor扩展完整诊断...\n');
        
        this.checkExtensionLoaded();
        console.log('');
        
        this.checkCompatibility();
        console.log('');
        
        this.checkBackgroundInfo();
        console.log('');
        
        if (window.SwitchColorDebug) {
            this.getState();
            console.log('');
            
            console.log('💡 可用的调试命令:');
            console.log('- SwitchColorDebugger.testColorSwitch("#FF0000") // 测试红色');
            console.log('- SwitchColorDebugger.getState() // 获取状态');
            console.log('- SwitchColorDebugger.checkBackgroundInfo() // 检查背景');
        }
        
        console.log('\n✅ 诊断完成');
    },
    
    /**
     * 监听DOM变化
     */
    startDOMMonitoring() {
        console.log('=== 开始DOM监听 ===');
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'style') {
                        console.log('🎨 样式变化:', mutation.target.tagName, mutation.target.style.cssText);
                    }
                    if (mutation.attributeName === 'class') {
                        console.log('📝 类名变化:', mutation.target.tagName, mutation.target.className);
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
        
        console.log('✅ DOM监听已启动');
        
        // 返回停止函数
        return () => {
            observer.disconnect();
            console.log('⏹️ DOM监听已停止');
        };
    }
};

// 将调试器添加到全局作用域
window.SwitchColorDebugger = SwitchColorDebugger;

// 页面加载完成后自动运行诊断
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => SwitchColorDebugger.runFullDiagnostic(), 1000);
    });
} else {
    setTimeout(() => SwitchColorDebugger.runFullDiagnostic(), 1000);
}

console.log('🔧 SwitchColor调试工具已加载');
console.log('使用 SwitchColorDebugger.runFullDiagnostic() 开始诊断');
