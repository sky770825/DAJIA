# PRIVATE Schema 配置说明

## ✅ 已完成

1. ✅ 已创建针对 PRIVATE schema 的 SQL 文件
2. ✅ 已更新代码使用 PRIVATE schema

## 📋 文件说明

### SQL 文件（使用 PRIVATE schema）

- `supabase_setup_private.sql` - 在 PRIVATE schema 中创建表
- `fix_tables_private.sql` - 删除 PRIVATE schema 中的表
- `check_tables_private.sql` - 检查 PRIVATE schema 中的表

### 代码更新

所有 Supabase 查询已更新为使用 `PRIVATE.table_name` 格式：
- `PRIVATE.leads`
- `PRIVATE.orders`
- `PRIVATE.verification_codes`

## 🚀 操作步骤

### 步骤 1：检查现有表

执行 `check_tables_private.sql` 查看 PRIVATE schema 中的表：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'PRIVATE';
```

### 步骤 2：删除旧表（如果需要）

如果表已存在但结构不对，执行 `fix_tables_private.sql`：

```sql
DROP TABLE IF EXISTS PRIVATE.verification_codes CASCADE;
DROP TABLE IF EXISTS PRIVATE.orders CASCADE;
DROP TABLE IF EXISTS PRIVATE.leads CASCADE;
```

### 步骤 3：创建新表

执行 `supabase_setup_private.sql` 的完整内容。

## ⚠️ 重要：PRIVATE Schema 访问权限

**Supabase PostgREST API 默认无法访问 `PRIVATE` schema！**

`PRIVATE` schema 是 Supabase 的保留 schema，通常用于内部功能。要使用它，需要特殊配置：

### 方法 1：配置 PostgREST（推荐）

在 Supabase Dashboard 中：

1. 进入 **Settings > API**
2. 找到 **"db.schema"** 或 **"Extra Search Path"** 设置
3. 添加 `PRIVATE` 到搜索路径：`public,PRIVATE`

### 方法 2：使用 public schema（更简单）

如果无法配置 PRIVATE schema 访问，建议使用 `public` schema：

1. 使用 `supabase_setup_simple.sql` 在 public schema 中创建表
2. 代码会自动使用 public schema（不需要指定 schema 名称）

### 方法 3：创建自定义 schema

如果 PRIVATE 无法访问，可以创建自己的 schema：

```sql
CREATE SCHEMA IF NOT EXISTS dajia;
```

然后使用 `dajia` schema 创建表。

## 🔍 验证配置

### 测试查询

在 Supabase SQL Editor 中测试：

```sql
-- 应该能查询到数据
SELECT * FROM PRIVATE.leads LIMIT 1;
```

### 测试 API

在浏览器控制台测试：

```javascript
const { data, error } = await supabase
  .from('PRIVATE.leads')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

如果出现以下错误，说明需要配置 schema 访问权限：
- `relation "PRIVATE.leads" does not exist`
- `permission denied for schema PRIVATE`

## 📝 建议

### 如果 PRIVATE schema 无法访问

**推荐方案**：使用 `public` schema

1. 执行 `supabase_setup_simple.sql`（在 public schema 中创建表）
2. 我会把代码改回使用 `public` schema（不需要指定 schema 名称）

这样更简单，不需要特殊配置。

## 🆘 如果遇到问题

### 错误：relation "PRIVATE.leads" does not exist

**可能原因**：
- PRIVATE schema 访问权限未配置
- 表还没有创建

**解决方法**：
1. 先执行 `check_tables_private.sql` 检查表是否存在
2. 如果表不存在，执行 `supabase_setup_private.sql`
3. 如果表存在但无法访问，配置 schema 访问权限
4. 或者改用 `public` schema

### 错误：permission denied for schema PRIVATE

**解决方法**：
1. 在 Supabase Dashboard 中配置 PRIVATE schema 访问权限
2. 或改用 `public` schema（使用 `supabase_setup_simple.sql`）

## 📞 需要帮助？

如果遇到问题，请告诉我：
1. 具体的错误信息
2. 是否能够访问 PRIVATE schema
3. 如果无法访问，我可以帮您改回使用 `public` schema
