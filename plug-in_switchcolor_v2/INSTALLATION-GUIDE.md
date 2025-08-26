# SwitchColor Chrome Extension - 安装和测试指南

## 📦 安装步骤

### 1. 准备工作
确保你有以下文件在项目文件夹中：
```
switchcolor/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── content.js
├── icons/icon.png
├── test-page.html (测试页面)
├── debug-extension.js (调试工具)
└── README.md
```

### 2. 在Chrome中安装扩展

#### 步骤 A: 打开扩展管理页面
1. 打开Chrome浏览器
2. 在地址栏输入：`chrome://extensions/`
3. 或者通过菜单：Chrome菜单 → 更多工具 → 扩展程序

#### 步骤 B: 启用开发者模式
1. 在扩展程序页面右上角找到"开发者模式"开关
2. 点击开关启用开发者模式

#### 步骤 C: 加载扩展
1. 点击"加载已解压的扩展程序"按钮
2. 选择包含manifest.json的项目文件夹
3. 点击"选择文件夹"

#### 步骤 D: 验证安装
- ✅ 扩展应该出现在扩展列表中
- ✅ 浏览器工具栏应该显示SwitchColor图标
- ✅ 没有错误提示

## 🧪 测试步骤

### 测试 1: 基础功能测试

1. **打开测试页面**
   ```
   file:///[你的路径]/plug-in_switchcolor/test-page.html
   ```

2. **测试扩展加载**
   - 点击页面上的"检查扩展状态"按钮
   - 应该显示"✅ SwitchColor扩展已加载"

3. **测试背景切换**
   - 点击浏览器工具栏的SwitchColor图标
   - 选择一个颜色（如红色）
   - 点击"切换背景颜色"按钮
   - 页面背景应该变为选择的颜色

4. **测试恢复功能**
   - 再次点击"切换背景颜色"按钮
   - 页面背景应该恢复为原始状态

### 测试 2: 真实网站测试

测试以下网站的兼容性：

1. **Google搜索** - `https://www.google.com`
2. **GitHub** - `https://github.com`
3. **百度** - `https://www.baidu.com`
4. **本地HTML文件** - 任何本地HTML文件

对每个网站重复基础功能测试步骤。

### 测试 3: 调试工具测试

1. **打开浏览器开发者工具**
   - 按F12或右键 → 检查

2. **在控制台中运行调试命令**
   ```javascript
   // 检查扩展状态
   SwitchColorDebugger.runFullDiagnostic()
   
   // 测试颜色切换
   SwitchColorDebugger.testColorSwitch('#FF0000')
   
   // 监听DOM变化
   const stopMonitoring = SwitchColorDebugger.startDOMMonitoring()
   ```

## 🐛 故障排除

### 问题 1: 扩展图标不显示
**解决方案：**
- 检查manifest.json中的图标路径
- 确保icons/icon.png文件存在
- 重新加载扩展

### 问题 2: 点击图标没有反应
**解决方案：**
- 检查popup.html文件是否存在
- 查看扩展详情页面是否有错误
- 重新加载扩展

### 问题 3: 背景切换不工作
**解决方案：**
- 检查content.js是否正确加载
- 在控制台查看是否有JavaScript错误
- 确认网站允许内容脚本运行

### 问题 4: 某些网站不支持
**预期行为：**
以下网站类型可能不支持：
- Chrome内部页面 (chrome://)
- 扩展商店页面
- 某些有严格安全策略的网站

## 📊 测试检查清单

### ✅ 安装测试
- [ ] 扩展成功加载到Chrome
- [ ] 图标显示在工具栏
- [ ] 没有安装错误

### ✅ UI测试
- [ ] 点击图标打开弹窗
- [ ] 颜色选择器工作正常
- [ ] 按钮响应点击
- [ ] 状态指示器更新

### ✅ 功能测试
- [ ] 背景颜色成功切换
- [ ] 能够恢复原始背景
- [ ] 颜色偏好被保存
- [ ] 错误处理正常工作

### ✅ 兼容性测试
- [ ] 在Google.com上工作
- [ ] 在GitHub.com上工作
- [ ] 在本地HTML文件上工作
- [ ] 在测试页面上工作

## 🔧 开发者工具

### 查看扩展日志
1. 右键点击扩展图标
2. 选择"检查弹出内容"
3. 查看Console标签页的日志

### 查看内容脚本日志
1. 在网页上按F12
2. 查看Console标签页
3. 寻找以"SwitchColor:"开头的日志

### 重新加载扩展
1. 在chrome://extensions/页面
2. 找到SwitchColor扩展
3. 点击刷新按钮🔄

## 📞 获取帮助

如果遇到问题：

1. **检查控制台错误**
   - 查看弹窗控制台和页面控制台的错误信息

2. **运行诊断工具**
   ```javascript
   SwitchColorDebugger.runFullDiagnostic()
   ```

3. **检查文件完整性**
   - 确保所有必需文件都存在
   - 检查文件权限

4. **重新安装扩展**
   - 移除扩展
   - 重新加载

---

**祝你测试顺利！** 🎨✨
