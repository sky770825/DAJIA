# 安全删除表指南

## ✅ 重要说明

**`DROP TABLE` 命令只会删除您明确指定的表，不会影响其他表或数据！**

## 🔍 执行前检查

### 步骤 1：先检查现有表

在 Supabase SQL Editor 中执行 `check_tables.sql`，查看：
- 所有现有的表
- 本项目的三个表是否存在
- 表的结构是否正确

### 步骤 2：确认要删除的表

确认以下三个表是您要删除的：
- `leads` - 客户登记表
- `orders` - 订单表
- `verification_codes` - 验证码表

**如果这些表中有重要数据，请先备份！**

## 🛡️ 安全删除流程

### 方法 1：使用安全版本（推荐）

执行 `fix_tables_safe.sql`，这个文件：
- ✅ 只删除指定的三个表
- ✅ 不会影响其他表
- ✅ 包含检查步骤

### 方法 2：手动删除

如果您想更谨慎，可以逐个删除：

```sql
-- 只删除 leads 表
DROP TABLE IF EXISTS leads CASCADE;

-- 只删除 orders 表
DROP TABLE IF EXISTS orders CASCADE;

-- 只删除 verification_codes 表
DROP TABLE IF EXISTS verification_codes CASCADE;
```

## 📋 完整操作流程

### 1. 检查现有表
```sql
-- 查看所有表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. 检查要删除的表是否存在
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'orders', 'verification_codes');
```

### 3. 删除表（如果确认）
执行 `fix_tables_safe.sql` 或手动删除

### 4. 重新创建表
执行 `supabase_setup_simple.sql`

## ⚠️ 注意事项

1. **CASCADE 的作用**
   - `CASCADE` 会删除表的索引、约束等
   - **不会影响其他表**

2. **IF EXISTS 的作用**
   - 如果表不存在，不会报错
   - 安全执行，不会影响已存在的其他表

3. **其他表的安全性**
   - 其他项目的表不会被影响
   - 其他数据库的表不会被影响
   - 只有明确列出的表会被删除

## 🔒 数据备份（可选）

如果表中有重要数据，可以先导出：

```sql
-- 导出 leads 表数据（在 Supabase Dashboard 的 Table Editor 中操作更方便）
-- 或者使用 Supabase CLI
```

## ✅ 验证删除结果

删除后，可以验证：

```sql
-- 应该返回空结果（表已删除）
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'orders', 'verification_codes');
```

## 📞 如果还有疑虑

如果您担心影响其他数据，可以：
1. 先执行 `check_tables.sql` 查看所有表
2. 确认要删除的表名
3. 逐个删除，而不是一次性删除所有
