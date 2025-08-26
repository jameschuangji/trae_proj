// 获取DOM元素
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');
const docLinkDiv = document.getElementById('docLink');
const feishuDocLink = document.getElementById('feishuDocLink');

// 添加点击事件监听器
saveButton.addEventListener('click', async () => {
  try {
    console.log('开始保存链接到飞书文档流程');
    
    // 重置UI状态
    statusDiv.textContent = '处理中...';
    statusDiv.style.color = '';
    docLinkDiv.style.display = 'none';
    
    // 获取当前活动标签页
    console.log('正在获取当前标签页信息...');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) {
      throw new Error('无法获取当前页面URL');
    }
    console.log('成功获取当前页面URL:', tab.url);
    
    // 提取域名作为链接文本
    const url = new URL(tab.url);
    const linkText = url.hostname;
    console.log('提取的链接文本:', linkText);
    
    // 第一步：创建空白文档
    statusDiv.textContent = '创建飞书文档中...';
    console.log('正在发送创建文档请求...');
    const createResponse = await chrome.runtime.sendMessage({ 
      action: 'createEmptyDoc'
    });
    console.log('收到创建文档响应:', createResponse);
    
    if (!createResponse) {
      throw new Error('未收到后台响应');
    }
    
    if (!createResponse.success) {
      console.error('创建文档失败，错误信息:', createResponse.error);
      throw new Error(createResponse.error || '创建文档失败');
    }
    
    // 获取文档信息
    const { documentId, title, accessToken } = createResponse.docInfo;
    console.log('成功创建文档，ID:', documentId, '标题:', title);
    
    // 构建飞书文档链接 - 使用docx而不是docs
    const feishuDocUrl = `https://www.feishu.cn/docx/${documentId}`;
    console.log('生成的飞书文档链接:', feishuDocUrl);
    
    // 显示文档链接
    feishuDocLink.href = feishuDocUrl;
    feishuDocLink.textContent = title;
    docLinkDiv.style.display = 'block';
    
    // 显示成功消息
    statusDiv.textContent = `✓ 已创建空白文档`;
    statusDiv.style.color = '#52c41a';
    console.log('流程完成，文档创建成功');
    
  } catch (error) {
    console.error('创建飞书文档失败，详细错误:', error);
    statusDiv.textContent = `✗ 错误: ${error.message}`;
    statusDiv.style.color = '#f5222d';
    
    // 添加更多错误信息到控制台以便调试
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }
});