# Supabase Storage 使用说明

## 📦 Storage 查询命令

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

### 删除文件

```sql
-- 刪除特定文件（需要管理權限）
DELETE FROM storage.objects
WHERE bucket_id = '{{bucket_name}}'
AND name = '{{file_path}}';
```

## 🎯 当前项目中的图片使用

目前项目中的产品图片都是本地静态资源：
- 位置：`src/assets/products/`
- 格式：`.jpg` 文件
- 使用方式：直接 import 到代码中

## 💡 如果需要使用 Supabase Storage

### 1. 创建存储桶

在 Supabase Dashboard > Storage 中：
- 点击 "New bucket"
- 输入名称（如：`product-images`）
- 选择 Public（公开访问）或 Private（私有）

### 2. 上传文件

可以通过以下方式：
- Supabase Dashboard 的 Storage 界面手动上传
- 使用 Supabase Client API 上传
- 使用 Supabase CLI

### 3. 在代码中使用

```typescript
import { supabase } from '@/lib/supabase';

// 获取公开文件的 URL
const getPublicUrl = (bucket: string, path: string) => {
  if (!supabase) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// 上传文件
const uploadFile = async (bucket: string, path: string, file: File) => {
  if (!supabase) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  return { data, error };
};
```

## 🔒 Storage 权限设置

### 创建存储策略

```sql
-- 允许公开读取
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 允许认证用户上传
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 允许认证用户更新
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- 允许认证用户删除
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

## 📋 常用 Storage 操作

### 列出文件

```sql
-- 列出特定 bucket 的所有文件
SELECT 
  name,
  id,
  bucket_id,
  created_at,
  updated_at,
  last_accessed_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'product-images'
ORDER BY created_at DESC;
```

### 统计文件数量

```sql
-- 统计每个 bucket 的文件数量
SELECT 
  b.name as bucket_name,
  COUNT(o.id) as file_count,
  SUM((o.metadata->>'size')::bigint) as total_size
FROM storage.buckets b
LEFT JOIN storage.objects o ON b.id = o.bucket_id
GROUP BY b.id, b.name;
```

### 查找大文件

```sql
-- 查找大于 1MB 的文件
SELECT 
  name,
  bucket_id,
  (metadata->>'size')::bigint as size_bytes,
  created_at
FROM storage.objects
WHERE (metadata->>'size')::bigint > 1048576
ORDER BY (metadata->>'size')::bigint DESC;
```

## 🚀 迁移图片到 Supabase Storage（可选）

如果需要将产品图片迁移到 Supabase Storage：

1. **创建存储桶**
   - 名称：`product-images`
   - 设置为 Public

2. **上传图片**
   - 上传所有 `src/assets/products/*.jpg` 文件
   - 保持相同的文件名

3. **更新代码**
   - 修改 `src/data/products.ts`
   - 将 import 改为使用 Supabase Storage URL

## 📝 注意事项

- Storage 有存储限制（免费版 1GB）
- 公开文件可以直接通过 URL 访问
- 私有文件需要通过 Supabase API 获取签名 URL
- 建议对上传的文件进行大小和类型验证
