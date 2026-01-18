# 快速开始指南

## ✅ 已完成

1. ✅ Supabase 环境变量已配置
   - URL: `https://cnzqtuuegdqwkgvletaa.supabase.co`
   - Anon Key: 已配置
   - 后台密码: `123456`

2. ✅ 开发服务器已重启

## 🚀 下一步：创建数据库表

### 在 Supabase Dashboard 中执行 SQL

1. 访问您的 Supabase 项目：https://supabase.com/dashboard/project/cnzqtuuegdqwkgvletaa
2. 点击左侧菜单的 **SQL Editor**
3. 点击 **New query**
4. **直接复制 `supabase_setup.sql` 文件中的所有内容并执行**

或者，您也可以复制下面的 SQL：

```sql
-- 创建 leads 表（客户登记）
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  product_interest TEXT NOT NULL,
  usage TEXT,
  quantity TEXT,
  contact_preference TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- 创建 orders 表（订单）
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  form_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 创建 verification_codes 表（防伪验证码）
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_id TEXT,
  product_name TEXT,
  order_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_order_number ON verification_codes(order_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_status ON verification_codes(status);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created_at ON verification_codes(created_at DESC);

-- 设置 Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户插入数据（前端表单提交）
CREATE POLICY "Allow anonymous insert on leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允许匿名用户查询验证码（验证功能）
CREATE POLICY "Allow anonymous select on verification_codes"
  ON verification_codes FOR SELECT
  TO anon
  USING (status = 'active');

-- 允许匿名用户更新验证码状态（记录验证）
CREATE POLICY "Allow anonymous update verification on verification_codes"
  ON verification_codes FOR UPDATE
  TO anon
  USING (status = 'active')
  WITH CHECK (status IN ('active', 'used'));

-- 允许匿名用户插入验证码（订单创建时）
CREATE POLICY "Allow anonymous insert on verification_codes"
  ON verification_codes FOR INSERT
  TO anon
  WITH CHECK (true);
```

5. 点击 **Run** 执行 SQL

## 🧪 测试步骤

### 1. 测试后台登录
- 访问：http://localhost:8080/admin/login
- 输入密码：`123456`
- 应该能成功登录

### 2. 测试数据提交
- 访问首页，填写 LeadForm
- 提交后检查 Supabase Dashboard 的 Table Editor
- 应该能在 `leads` 表中看到数据

### 3. 测试订单和验证码
- 创建订单（加入购物车并结账）
- 检查 `orders` 表是否有订单
- 检查 `verification_codes` 表是否生成了验证码

### 4. 测试真伪验证
- 从后台复制一个验证码
- 访问 `/verify` 页面
- 输入验证码查询
- 应该显示验证成功

## 📋 检查清单

- [ ] 在 Supabase 中执行了 SQL 创建表
- [ ] 开发服务器已重启
- [ ] 可以访问网站 (http://localhost:8080)
- [ ] 可以登录后台 (`/admin/login`)
- [ ] 可以提交表单数据
- [ ] 可以在 Supabase 中看到数据
- [ ] 验证码功能正常

## 🔍 如果遇到问题

1. **检查环境变量**
   - 确认 `.env.local` 文件存在
   - 确认 Supabase URL 和 Key 正确

2. **检查数据库表**
   - 在 Supabase Dashboard > Table Editor 查看表是否存在
   - 确认表结构正确

3. **检查 RLS 策略**
   - 在 Supabase Dashboard > Authentication > Policies 查看
   - 确认策略已创建

4. **查看日志**
   - 浏览器控制台 (F12)
   - Supabase Dashboard > Logs

## 📞 需要帮助？

如果遇到任何问题，请告诉我：
- 具体的错误信息
- 操作步骤
- 浏览器控制台的错误
- Supabase Dashboard 的日志
