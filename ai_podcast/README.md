# 降噪 - AI广播编辑器

## 项目概述
这是一个AI驱动的广播内容编辑工具，可将专业AI文章转化为通俗易懂的广播稿件，并提供语音合成功能。

## 功能特点
- 专业文章智能转换广播稿
- 自定义系统提示词模板
- MiniMax文本生成API集成
- 高品质语音合成
- 语音参数调节（语速/音量/音调/情绪）
- 响应式玻璃态UI设计

## 文件结构
```
project/
├── static/
│   ├── css/
│   │   ├── style.css    # 主样式
│   │   └── theme.css    # 主题样式
│   └── js/
│       └── main.js      # 主逻辑
├── index.html           # 主页面
└── README.md            # 项目文档
```

## 快速开始
1. 在`static/js/main.js`中配置您的API密钥：
```javascript
const API_KEY = 'YOUR_API_KEY';
const GROUP_ID = 'YOUR_GROUP_ID';
```
2. 直接打开`index.html`文件使用

## 使用说明
1. **系统提示词**：编辑并保存您的广播风格模板
2. **原始文案输入**：粘贴专业AI文章内容
3. **生成广播稿**：点击按钮生成通俗易懂的广播稿
4. **语音合成**：将生成的广播稿转为语音
5. **语音控制**：播放/暂停/下载语音，调整语音参数

## 注意事项
1. 请将网页部署到本地服务器环境中运行，避免CORS限制
2. 实际使用时请替换为有效的MiniMax API密钥
3. 语音参数设置会实时影响语音合成效果

## 技术栈
- HTML5 + CSS3 + JavaScript
- Bootstrap 5
- MiniMax Text-01 & T2A v2 API
- localStorage数据持久化