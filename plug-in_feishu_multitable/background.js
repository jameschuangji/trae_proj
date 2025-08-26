// 飞书应用配置（从PRD获取）
const FEISHU_APP_ID = "cli_a8b2b412a672901c";
const FEISHU_APP_SECRET = "nbPxlnEX4boVSUiSBO8H2e8CViEaX4xC";
const BASE_ID = "Wd19biPajanrnysCp6Qcure2nzf";
const TABLE_ID = "tblFOnxKwSrKWf8I";

// 获取飞书访问令牌
async function getFeishuAccessToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    })
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`获取访问令牌失败: ${data.msg}`);
  }
  return data.tenant_access_token;
}

// 保存链接到飞书多维表格
async function saveToFeishuTable(url, text) {
  const accessToken = await getFeishuAccessToken();
  
  const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_ID}/tables/${TABLE_ID}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      fields: {
        "链接": { text: url, link: url }
      }
    })
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`保存到多维表格失败: ${data.msg}`);
  }
  return true;
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToFeishu') {
    const { url, text } = request.data;
    
    saveToFeishuTable(url, text)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true; // 保持消息通道开放
  }
});