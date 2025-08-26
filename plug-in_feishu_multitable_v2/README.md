# 飞书文档链接采集器 - 使用说明

## 功能概述
本浏览器扩展可一键将当前网页链接保存到飞书文档中，方便内容收藏和管理。

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
const FEISHU_APP_ID = "cli_a8c8272140da900d";
const FEISHU_APP_SECRET = "5usHFrz2zbzAie1OpvXdSgobGbYeBEpV";
const FOLDER_TOKEN = "G26gflw7flcLGjdXCZlcuZV2nfh"; // 需要替换为实际的文件夹Token
const DOC_NAME = "网页收藏"; // 文档名称
```

### 获取文件夹Token
1. 登录飞书
2. 进入你想保存链接的文件夹
3. 查看浏览器地址栏，格式为：`https://xxx.feishu.cn/drive/folder/fldXXXXXX`
4. 其中`fldXXXXXX`部分就是文件夹Token

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
3. 确保文件夹Token正确且有编辑权限
4. 检查飞书应用是否有云文档的访问权限
5. 确保飞书应用已获得以下权限：
   - `drive:file:view` - 查看云空间中的文件
   - `drive:file:edit` - 编辑云空间中的文件
   - `drive:file:create` - 在云空间中创建文件

### 如何获取飞书应用权限？
1. 访问[飞书开放平台](https://open.feishu.cn/)
2. 登录并进入应用管理页面
3. 选择或创建应用
4. 在「权限管理」中添加上述权限
5. 发布应用或进行内部测试

## 后续优化
- 添加批量链接导入功能
- 支持自定义文档模板
- 增加链接分类标签功能
- 添加链接预览功能
- 支持选择保存目标文件夹