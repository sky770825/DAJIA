# 故障排除指南

## ❌ 错误：column "order_number" does not exist

### 可能原因

1. **表还没有创建就尝试创建索引**
   - 执行顺序问题
   - 表创建失败但继续执行索引创建

2. **表已存在但结构不同**
   - 之前创建的表结构不完整
   - 需要删除旧表重新创建

### 解决方法

#### 方法 1：使用简化版 SQL（推荐）

使用 `supabase_setup_simple.sql` 文件，这个版本更简洁，按顺序执行。

#### 方法 2：检查并删除旧表

如果表已存在但结构不对，先删除再重新创建：

```sql
-- 删除现有表（谨慎操作！会删除所有数据）
DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
```

然后重新执行 `supabase_setup.sql` 或 `supabase_setup_simple.sql`。

#### 方法 3：分步执行

如果一次性执行失败，可以分步执行：

**步骤 1：创建表**
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
```

**步骤 2：创建索引**
```sql
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

**步骤 3：启用 RLS**
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
```

**步骤 4：创建策略**
```sql
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON orders;
CREATE POLICY "Allow anonymous insert on orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);
```

### 检查表是否存在

```sql
-- 检查表是否存在
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'orders', 'verification_codes');
```

### 检查表结构

```sql
-- 检查 orders 表的结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'orders'
ORDER BY ordinal_position;
```

### 检查 verification_codes 表的结构

```sql
-- 检查 verification_codes 表的结构
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'verification_codes'
ORDER BY ordinal_position;
```

## 🔍 其他常见错误

### 错误：relation "xxx" already exists

**原因**：表已存在

**解决**：使用 `CREATE TABLE IF NOT EXISTS` 不会报错，可以继续执行

### 错误：policy "xxx" already exists

**原因**：策略已存在

**解决**：使用 `DROP POLICY IF EXISTS` 先删除，再创建

### 错误：permission denied

**原因**：权限不足

**解决**：
1. 确认使用的是正确的 Supabase 项目
2. 检查 API Key 是否正确
3. 确认 RLS 策略设置正确

## ✅ 验证设置

执行以下 SQL 验证所有表都已正确创建：

```sql
-- 检查所有表
SELECT 
  table_name,
  (SELECT COUNT(*) 
   FROM information_schema.columns 
   WHERE table_name = t.table_name 
   AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('leads', 'orders', 'verification_codes')
ORDER BY table_name;
```

## 📞 需要帮助？

如果以上方法都无法解决问题，请提供：
1. 完整的错误信息
2. 执行的 SQL 语句
3. Supabase Dashboard 中 Table Editor 的截图
