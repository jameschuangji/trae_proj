// 飞书应用配置
const FEISHU_APP_ID = "cli_a8c8272140da900d";
const FEISHU_APP_SECRET = "5usHFrz2zbzAie1OpvXdSgobGbYeBEpV";
// 飞书云文档配置
const FOLDER_TOKEN = "G26gflw7flcLGjdXCZlcuZV2nfh"; // 需要替换为实际的文件夹Token（需有drive:file权限）
const DOC_NAME = "网页收藏"; // 文档名称

// 获取飞书访问令牌
async function getFeishuAccessToken() {
  console.log('开始获取飞书访问令牌，使用APP_ID:', FEISHU_APP_ID);
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      })
    });
    
    console.log('获取令牌API响应状态:', response.status, response.statusText);
    
    // 检查HTTP响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('获取令牌原始响应文本:', responseText);
    
    // 检查响应文本是否为空
    if (!responseText || responseText.trim() === '') {
      throw new Error('获取令牌API返回了空响应');
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('获取令牌JSON解析错误:', error);
      throw new Error(`获取访问令牌失败: 无法解析响应数据 - ${error.message}`);
    }
    
    console.log('获取令牌解析后的响应数据:', data);
    
    if (data.code !== 0) {
      throw new Error(`获取访问令牌失败: ${data.msg || '未知错误'}`);
    }
    
    if (!data.tenant_access_token) {
      throw new Error('获取访问令牌成功但返回的数据格式不正确');
    }
    
    console.log('成功获取访问令牌');
    return data.tenant_access_token;
  } catch (error) {
    console.error('获取访问令牌过程中发生错误:', error);
    throw error;
  }
}

// 创建空白文档
async function createEmptyDoc(accessToken) {
  // 生成带时间戳的文档名称
  const timestamp = new Date().toLocaleString().replace(/[/:]/g, '-');
  const docTitle = `${DOC_NAME}-${timestamp}`;
  
  console.log('开始创建文档，使用的token:', accessToken);
  
  try {
    // 创建新文档 - 使用正确的API端点
    const createResponse = await fetch('https://open.feishu.cn/open-apis/docx/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        folder_token: FOLDER_TOKEN,
        title: docTitle
      })
    });
    
    console.log('API响应状态:', createResponse.status, createResponse.statusText);
    
    // 检查HTTP响应状态
    if (!createResponse.ok) {
      throw new Error(`HTTP错误: ${createResponse.status} ${createResponse.statusText}`);
    }
    
    const responseText = await createResponse.text();
    console.log('原始响应文本:', responseText);
    
    // 检查响应文本是否为空
    if (!responseText || responseText.trim() === '') {
      throw new Error('API返回了空响应');
    }
    
    let createData;
    try {
      createData = JSON.parse(responseText);
    } catch (error) {
      console.error('JSON解析错误:', error);
      throw new Error(`创建文档失败: 无法解析响应数据 - ${error.message}`);
    }
    
    console.log('解析后的响应数据:', createData);
    
    if (createData.code !== 0) {
      throw new Error(`创建文档失败: ${createData.msg || '未知错误'}`);
    }
    
    if (!createData.data || !createData.data.document || !createData.data.document.document_id) {
      throw new Error('创建文档成功但返回的数据格式不正确');
    }
    
    return {
      documentId: createData.data.document.document_id,
      title: docTitle
    };
  } catch (error) {
    console.error('创建文档过程中发生错误:', error);
    throw error;
  }
}

// 创建飞书空白文档
async function createFeishuDoc() {
  console.log('开始创建飞书文档流程');
  
  try {
    // 获取访问令牌
    console.log('正在获取飞书访问令牌...');
    const accessToken = await getFeishuAccessToken();
    console.log('成功获取访问令牌，长度:', accessToken.length);
    
    // 创建空白文档
    console.log('正在创建空白文档...');
    const docInfo = await createEmptyDoc(accessToken);
    console.log('成功创建文档，ID:', docInfo.documentId);
    
    return {
      documentId: docInfo.documentId,
      title: docInfo.title,
      accessToken: accessToken
    };
  } catch (error) {
    console.error('创建飞书文档流程失败:', error);
    throw error;
  }
}

// 添加内容到飞书文档
async function addContentToDoc(documentId, accessToken, url, text) {
  console.log('开始添加内容到文档，文档ID:', documentId);
  
  try {
    // 构建要添加的内容 - Markdown格式的链接
    const currentTime = new Date().toLocaleString();
    
    const requestBody = {
      blocks: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: '- '
            },
            {
              type: 'text',
              text: text,
              attributes: {
                link: {
                  url: url
                }
              }
            },
            {
              type: 'text',
              text: ` - ${currentTime}`
            }
          ]
        }
      ]
    };
    
    console.log('添加内容请求体:', JSON.stringify(requestBody));
    
    // 在文档末尾追加内容 - 使用正确的API端点和格式
    const response = await fetch(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks/append`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('添加内容API响应状态:', response.status, response.statusText);
    
    // 检查HTTP响应状态
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const responseText = await response.text();
    console.log('添加内容原始响应文本:', responseText);
    
    // 检查响应文本是否为空
    if (!responseText || responseText.trim() === '') {
      throw new Error('添加内容API返回了空响应');
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('添加内容JSON解析错误:', error);
      throw new Error(`添加内容到飞书文档失败: 无法解析响应数据 - ${error.message}`);
    }
    
    console.log('添加内容解析后的响应数据:', data);
    
    if (data.code !== 0) {
      throw new Error(`添加内容到飞书文档失败: ${data.msg || '未知错误'}`);
    }
    
    console.log('成功添加内容到文档');
    return true;
  } catch (error) {
    console.error('添加内容到文档过程中发生错误:', error);
    throw error;
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request.action, request);
  
  if (request.action === 'createEmptyDoc') {
    console.log('处理创建空白文档请求');
    
    // 创建空白文档
    createFeishuDoc()
      .then(docInfo => {
        console.log('文档创建成功，返回信息:', docInfo);
        sendResponse({ success: true, docInfo: docInfo });
      })
      .catch(error => {
        console.error('文档创建失败，错误:', error);
        // 确保错误消息被正确传递
        let errorMessage = error.message || '未知错误';
        console.log('发送错误响应:', errorMessage);
        sendResponse({ success: false, error: errorMessage });
      });
    
    return true; // 保持消息通道开放
  } else if (request.action === 'addContent') {
    console.log('处理添加内容请求');
    
    // 添加内容到文档
    const { documentId, accessToken, url, text } = request.data;
    console.log('添加内容参数:', { documentId, url, text });
    
    addContentToDoc(documentId, accessToken, url, text)
      .then(() => {
        console.log('内容添加成功');
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('内容添加失败，错误:', error);
        let errorMessage = error.message || '未知错误';
        console.log('发送错误响应:', errorMessage);
        sendResponse({ success: false, error: errorMessage });
      });
    
    return true; // 保持消息通道开放
  } else {
    console.warn('收到未知操作类型:', request.action);
    sendResponse({ success: false, error: '未知操作类型' });
    return false;
  }
});