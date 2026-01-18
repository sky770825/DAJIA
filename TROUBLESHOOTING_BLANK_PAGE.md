# 空白页面故障排除指南

## ✅ 已修复的问题

1. **favicon.ico 404 错误** - 已在 `index.html` 中添加 favicon 链接

## 🔍 如果页面仍然空白，请检查：

### 1. 浏览器控制台错误

打开浏览器开发者工具（F12 或 Cmd+Option+I）：
- 查看 **Console** 标签是否有红色错误信息
- 查看 **Network** 标签是否有请求失败（红色）

### 2. 清除浏览器缓存

**Chrome/Edge:**
- 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
- 选择"缓存的图片和文件"
- 点击"清除数据"

**或者强制刷新:**
- `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

### 3. 检查服务器地址

确认访问的是正确的地址：
- http://localhost:5173
- 或 http://127.0.0.1:5173

### 4. 检查服务器状态

确认 Vite 服务器正在运行：
```bash
# 查看进程
ps aux | grep vite

# 重启服务器（如果需要）
npm run dev
```

### 5. 常见错误及解决方法

#### 错误：`Cannot find module`
**解决：**
```bash
rm -rf node_modules
npm install
npm run dev
```

#### 错误：`Failed to resolve import`
**解决：** 检查导入路径是否正确，确认文件是否存在

#### 错误：Supabase 连接错误
**解决：** 检查 `.env.local` 文件中的环境变量是否正确配置

### 6. 检查环境变量

确认 `.env.local` 文件存在且包含：
```env
VITE_SUPABASE_URL=https://cnzqtuuegdqwkgvletaa.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_ADMIN_PASSWORD=123456
```

### 7. 验证 HTML 结构

打开页面源代码（右键 → 查看页面源代码），确认：
- 有 `<div id="root"></div>`
- 有 `<script type="module" src="/src/main.tsx"></script>`

## 🆘 仍无法解决？

如果以上方法都无法解决问题，请提供：
1. 浏览器控制台的完整错误信息
2. Network 标签中失败的请求详情
3. 服务器终端的错误信息
