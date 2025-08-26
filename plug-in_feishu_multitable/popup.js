// 获取按钮和状态显示元素
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// 添加点击事件监听器
saveButton.addEventListener('click', async () => {
  try {
    statusDiv.textContent = '处理中...';
    
    // 获取当前活动标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      throw new Error('无法获取当前页面URL');
    }
    
    // 提取域名作为链接文本
    const url = new URL(tab.url);
    const linkText = url.hostname;
    
    // 发送消息给后台脚本
    const response = await chrome.runtime.sendMessage({ 
      action: 'saveToFeishu', 
      data: { url: tab.url, text: linkText }
    });
    
    if (response.success) {
      statusDiv.textContent = '✓ 链接已保存到飞书多维表格';
      statusDiv.style.color = '#52c41a';
    } else {
      throw new Error(response.error || '保存失败');
    }
  } catch (error) {
    statusDiv.textContent = `✗ 错误: ${error.message}`;
    statusDiv.style.color = '#f5222d';
    console.error('保存链接失败:', error);
  }
});