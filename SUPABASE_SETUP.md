# Supabase 数据库设置说明

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com
2. 创建新项目
3. 获取项目 URL 和 Anon Key（在 Settings > API 中）

## 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（已创建模板）：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=123456
```

## 3. 创建数据库表

**最简单的方式：直接复制 `supabase_setup.sql` 文件中的所有内容到 Supabase SQL Editor 执行**

或者，在 Supabase SQL Editor 中执行以下 SQL：

### 创建 leads 表（客户登记）

```sql
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
```

### 创建 orders 表（订单）

```sql
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

### 创建 verification_codes 表（防伪验证码）

```sql
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_id TEXT,
  product_name TEXT,
  order_number TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, used, revoked
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_order_number ON verification_codes(order_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_status ON verification_codes(status);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created_at ON verification_codes(created_at DESC);
```

### 设置 Row Level Security (RLS)

```sql
-- 启用 RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

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

-- 启用验证码表的 RLS
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- 允许服务角色读取所有数据（后台管理）
-- 注意：后台管理需要通过服务端 API 或使用 service_role key
-- 这里暂时允许 authenticated 用户读取（需要配置 Supabase Auth）
-- 或者使用 service_role key 在服务端查询

-- 如果需要允许后台管理读取所有数据，可以创建以下策略：
-- （注意：这需要 Supabase Auth 或 service_role key）
-- CREATE POLICY "Allow service role read all"
--   ON verification_codes FOR SELECT
--   TO service_role
--   USING (true);
```

## 4. 安全建议

⚠️ **重要安全提示**：

1. **密码验证**：当前实现是前端验证，密码会暴露在客户端。生产环境应该：
   - 使用服务端 API 验证密码
   - 或使用 Supabase Auth 进行身份验证
   - 或使用 service_role key 在服务端验证

2. **数据访问**：建议：
   - 使用 Supabase Edge Functions 创建 API 端点
   - 在服务端验证管理员身份
   - 使用 service_role key 查询数据（不要暴露在前端）

3. **环境变量**：
   - `.env.local` 文件已添加到 `.gitignore`
   - 不要将包含真实密钥的文件提交到 Git

## 5. 使用方式

1. 配置环境变量后，重启开发服务器
2. 访问 `/admin/login` 登录后台
3. 默认密码：`123456`（可在 `.env.local` 中修改）
4. 登录后可查看客户登记和订单数据

## 6. 数据备份

系统同时会将数据保存到 localStorage 作为备份：
- 客户登记：`dajia-mazu-leads`
- 订单：`dajia-mazu-orders`

## 7. Supabase Storage 查询（可选）

如果需要检查或管理 Supabase Storage 中的文件，可以使用以下 SQL：

### 检查现有的 buckets

```sql
-- 檢查現有的 buckets
SELECT id, name, public, created_at
FROM storage.buckets;
```

### 检查特定 bucket 的文件

```sql
-- 檢查特定 bucket 的檔案
SELECT name, bucket_id, created_at
FROM storage.objects
WHERE bucket_id = '{{bucket_name}}'
LIMIT 10;
```

### 检查所有文件

```sql
-- 檢查所有 bucket 中的檔案
SELECT 
  o.name,
  o.bucket_id,
  b.name as bucket_name,
  o.created_at,
  o.metadata
FROM storage.objects o
JOIN storage.buckets b ON o.bucket_id = b.id
ORDER BY o.created_at DESC
LIMIT 50;
```

**注意**：当前项目中的产品图片都是本地静态资源（`src/assets/products/`），未使用 Supabase Storage。如需使用 Storage 存储图片，请参考 `SUPABASE_STORAGE.md` 文件。
