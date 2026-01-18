# Cloudflare Pages 配置指南

## ✅ 已配置项目

### 1. 构建配置
- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **安装命令**: `npm install`
- **Node.js 版本**: 18+

### 2. SPA 路由配置
- ✅ `public/_redirects` 文件已创建
- ✅ 每次构建时自动复制到 `dist/` 目录
- ✅ 配置内容: `/*    /index.html   200`

### 3. 环境变量
在 Cloudflare Pages Dashboard 中配置以下环境变量：
- `VITE_SUPABASE_URL` - Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `VITE_ADMIN_PASSWORD` - 后台管理密码

## 🔧 在 Cloudflare Pages Dashboard 中的配置

### 步骤 1: 构建和部署设置

1. 进入项目设置 → **Builds & deployments**
2. 配置以下设置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (项目根目录)
   - **Node version**: `18` 或更高

### 步骤 2: 环境变量设置

1. 进入项目设置 → **Environment variables**
2. 添加以下变量（生产环境）：
   ```
   VITE_SUPABASE_URL=https://cnzqtuuegdqwkgvletaa.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_ADMIN_PASSWORD=123456
   ```

### 步骤 3: 函数和重定向

`_redirects` 文件会自动处理 SPA 路由重定向，无需额外配置。

## 📋 配置文件

项目已包含以下配置文件：
- `public/_redirects` - SPA 路由重定向规则
- `cloudflare-pages.json` - Cloudflare Pages 配置参考（仅供参考）

## 🚀 部署检查清单

- [x] `_redirects` 文件存在于 `public/` 目录
- [x] 构建命令正确 (`npm run build`)
- [x] 输出目录正确 (`dist`)
- [x] `dist/index.html` 存在
- [ ] 环境变量已在 Cloudflare Pages 中配置
- [ ] 生产部署成功

## 🐛 常见问题

### 问题 1: 路由 404 错误
**原因**: `_redirects` 文件未正确部署
**解决**: 确认 `public/_redirects` 文件存在，重新构建和部署

### 问题 2: 环境变量未生效
**原因**: 环境变量名称错误或未设置为生产环境
**解决**: 检查环境变量名称必须以 `VITE_` 开头，并确认设置为 Production 环境

### 问题 3: 构建失败
**原因**: Node.js 版本不兼容
**解决**: 在 Cloudflare Pages 设置中将 Node.js 版本设置为 18 或更高

## 📝 使用 Wrangler CLI

### 检查部署状态
```bash
wrangler pages project list
```

### 查看部署详情
```bash
wrangler pages deployment list --project-name=dajia
```

### 创建新的部署
```bash
wrangler pages deploy dist --project-name=dajia
```

## 🔗 相关链接

- Cloudflare Pages Dashboard: https://dash.cloudflare.com
- 项目链接: https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages/view/dajia
