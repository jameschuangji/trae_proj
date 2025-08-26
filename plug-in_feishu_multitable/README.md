# 飞书多维表格链接采集器 - 使用说明

## 功能概述
本浏览器扩展可一键将当前网页链接保存到飞书多维表格中，方便内容收藏和管理。

## 安装方法
1. 在Chrome浏览器中打开 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择本扩展所在的文件夹

## 使用方法
1. 浏览任意网页时，点击浏览器工具栏中的扩展图标
2. 在弹出窗口中点击"插入当前页面链接"按钮
3. 等待操作完成提示（成功或错误信息）

## 配置说明
如需修改飞书配置，请编辑 `background.js` 文件中的以下常量：
```javascript
const FEISHU_APP_ID = "cli_a7321294a738d01c";
const FEISHU_APP_SECRET = "L4uyDgQNH2xd7yE7A3BXubeTvrSy5dSy";
const BASE_ID = "HrG6bqJf4auKfPsn3cic4VSHnic";
const TABLE_ID = "tblRfPUAZ8ewftUA";
```

## 文件说明
- `manifest.json`: 扩展配置文件
- `popup.html`: 扩展弹出窗口界面
- `popup.js`: 弹出窗口交互逻辑
- `background.js`: 后台服务及飞书API调用
- `images/`: 扩展图标目录（包含不同尺寸图标）

## 常见问题
### 保存失败怎么办？
1. 检查网络连接是否正常
2. 确认飞书配置信息是否正确
3. 确保多维表格中存在"链接"字段且类型为超链接

## 后续优化
- 添加批量链接导入功能
- 支持自定义字段映射
- 增加链接分类标签功能