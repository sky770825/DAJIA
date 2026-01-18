# 后台管理系统快速开始

## ✅ 已完成的功能

1. ✅ 后台登录页面 (`/admin/login`)
   - 密码验证
   - 使用 sessionStorage 存储登录状态
   - 密码从环境变量读取

2. ✅ 后台管理页面 (`/admin`)
   - 客户登记数据展示
   - 订单数据展示
   - 分页功能
   - 数据导出 CSV
   - 登出功能

3. ✅ 数据提交集成
   - LeadForm 自动提交到 Supabase
   - Checkout 订单自动保存到 Supabase
   - 同时保存到 localStorage 作为备份

## 🚀 快速开始

### 1. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=123456
```

### 2. 设置 Supabase 数据库

参考 `SUPABASE_SETUP.md` 文件创建数据库表。

### 3. 访问后台

1. 启动开发服务器：`npm run dev`
2. 访问：http://localhost:8080/admin/login
3. 输入密码：`123456`（或您在 `.env.local` 中设置的密码）

## 📋 功能说明

### 客户登记管理
- 查看所有客户登记信息
- 显示姓名、电话、Email、感兴趣商品等
- 支持分页浏览
- 可导出 CSV

### 订单管理
- 查看所有订单
- 显示订单编号、客户信息、商品数量、总金额、状态
- 支持分页浏览
- 可导出 CSV

## 🔒 安全提示

⚠️ **当前实现是前端验证，密码会暴露在客户端代码中**

生产环境建议：
1. 使用服务端 API 验证密码
2. 使用 Supabase Auth 进行身份验证
3. 使用 service_role key 在服务端查询数据

## 📝 数据表结构

### leads 表
- `id`: UUID (主键)
- `name`: 姓名
- `phone`: 电话
- `email`: Email
- `product_interest`: 感兴趣商品
- `usage`: 用途
- `quantity`: 数量
- `contact_preference`: 联系偏好
- `note`: 备注
- `created_at`: 创建时间

### orders 表
- `id`: UUID (主键)
- `order_number`: 订单编号 (唯一)
- `items`: 商品列表 (JSONB)
- `total`: 总金额
- `shipping`: 运费
- `form_data`: 收货信息 (JSONB)
- `status`: 订单状态
- `created_at`: 创建时间
