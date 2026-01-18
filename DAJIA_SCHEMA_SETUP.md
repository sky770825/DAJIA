# DAJIA Schema 配置说明

## ✅ 已完成

1. ✅ 已创建针对 DAJIA schema 的 SQL 文件
2. ✅ 已更新代码使用 DAJIA schema

## 📋 文件说明

### SQL 文件（使用 DAJIA schema）

- `supabase_setup_dajia.sql` - 在 DAJIA schema 中创建表
- `fix_tables_dajia.sql` - 删除 DAJIA schema 中的表
- `check_tables_dajia.sql` - 检查 DAJIA schema 中的表

### 代码更新

所有 Supabase 查询已更新为使用 `DAJIA.table_name` 格式：
- `DAJIA.leads`
- `DAJIA.orders`
- `DAJIA.verification_codes`

## 🚀 操作步骤

### 步骤 1：检查现有表

执行 `check_tables_dajia.sql` 查看 DAJIA schema 中的表：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'DAJIA';
```

### 步骤 2：删除旧表（如果需要）

如果表已存在但结构不对，执行 `fix_tables_dajia.sql`：

```sql
DROP TABLE IF EXISTS DAJIA.verification_codes CASCADE;
DROP TABLE IF EXISTS DAJIA.orders CASCADE;
DROP TABLE IF EXISTS DAJIA.leads CASCADE;
```

### 步骤 3：创建新表

执行 `supabase_setup_dajia.sql` 的完整内容。

## ⚙️ Supabase 配置

### 重要：启用 DAJIA schema 访问

Supabase PostgREST API 默认只能访问 `public` schema。要使用 `DAJIA` schema，需要配置：

1. **在 Supabase Dashboard 中**：
   - 进入 Settings > API
   - 找到 "Extra Search Path" 或 "Schema"
   - 添加 `DAJIA` 到搜索路径

2. **或者使用 SQL 配置**：

```sql
-- 设置 PostgREST 的搜索路径
ALTER DATABASE postgres SET search_path TO public, DAJIA;
```

3. **或者使用 API 配置**：
   - 在 Supabase Dashboard > Settings > API
   - 找到 "db.schema" 设置
   - 设置为 `public,DAJIA`

### 如果无法配置 schema 访问

如果 Supabase 项目不允许访问非 public schema，有两个选择：

#### 选项 1：将表移到 public schema

使用原来的 `supabase_setup_simple.sql` 文件，在 public schema 中创建表。

#### 选项 2：使用 RPC 函数

创建 PostgreSQL 函数来访问 DAJIA schema 的表。

## 🔍 验证配置

### 测试查询

在 Supabase SQL Editor 中测试：

```sql
-- 应该能查询到数据
SELECT * FROM DAJIA.leads LIMIT 1;
```

### 测试 API

在浏览器控制台测试：

```javascript
const { data, error } = await supabase
  .from('DAJIA.leads')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

如果出现 "relation does not exist" 或 "permission denied" 错误，说明需要配置 schema 访问权限。

## 📝 注意事项

1. **Schema 名称大小写**：
   - PostgreSQL 中，如果 schema 名称用双引号创建，则区分大小写
   - 如果没用双引号，会自动转换为小写
   - 建议统一使用大写 `DAJIA` 或小写 `dajia`

2. **代码中的引用**：
   - 代码中使用 `DAJIA.table_name` 格式
   - 如果 schema 名称是小写，可能需要改为 `dajia.table_name`

3. **其他表的安全性**：
   - 删除操作只影响 DAJIA schema 中的表
   - 不会影响其他 schema 或其他表

## 🆘 如果遇到问题

### 错误：relation "DAJIA.leads" does not exist

**可能原因**：
- Schema 访问权限未配置
- Schema 名称大小写不匹配

**解决方法**：
1. 检查 Supabase API 设置中的 schema 配置
2. 确认 schema 名称是否正确（大小写）

### 错误：permission denied for schema DAJIA

**解决方法**：
1. 在 Supabase Dashboard 中配置 schema 访问权限
2. 或使用 public schema（使用 `supabase_setup_simple.sql`）

## 📞 需要帮助？

如果遇到问题，请提供：
1. 具体的错误信息
2. Supabase Dashboard 中 API Settings 的截图
3. 执行的 SQL 语句
