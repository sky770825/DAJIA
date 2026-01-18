# Supabase Storage 设置说明

## 📦 创建 Storage Bucket

### 步骤 1：创建 Bucket

1. 访问 Supabase Dashboard：https://supabase.com/dashboard/project/cnzqtuuegdqwkgvletaa
2. 点击左侧菜单的 **Storage**
3. 点击 **New bucket**
4. 设置：
   - **Name**: `product-images`
   - **Public bucket**: ✅ 勾选（允许公开访问）
   - 点击 **Create bucket**

### 步骤 2：设置 Storage 策略

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 允许公开读取
CREATE POLICY "Public Access for product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- 允许认证用户上传（如果需要后台上传）
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

## 📁 文件夹结构

Storage 中的文件将按以下结构组织：

```
product-images/
  └── DAJIA/
      ├── main-categories/     # 主目錄圖片
      ├── sub-categories/      # 子目錄圖片
      ├── products/            # 產品圖片
      └── general/             # 一般圖片
```

## 🔒 安全建议

1. **公开访问**：如果图片需要公开显示，bucket 设置为 Public
2. **私有访问**：如果需要权限控制，bucket 设置为 Private，使用签名 URL
3. **文件大小限制**：建议限制单个文件大小（如 5MB）
4. **文件类型限制**：只允许图片格式（jpg, png, webp 等）

## 📝 使用示例

### 上传图片

```typescript
import { saveMediaRecord } from '@/lib/media';

const handleUpload = async (file: File) => {
  try {
    const media = await saveMediaRecord({
      file,
      folder: 'products',
      usageType: 'product',
      productId: '產品ID',
      altText: '產品圖片',
    });
    console.log('上傳成功:', media.file_url);
  } catch (error) {
    console.error('上傳失敗:', error);
  }
};
```

### 查询图片

```typescript
import { getMediaRecords } from '@/lib/media';

const getProductImages = async (productId: string) => {
  try {
    const images = await getMediaRecords({
      productId,
      usageType: 'product',
    });
    return images;
  } catch (error) {
    console.error('查詢失敗:', error);
    return [];
  }
};
```

## ⚠️ 注意事项

1. **Bucket 名称**：必须与代码中的 `product-images` 一致
2. **文件夹路径**：使用 `DAJIA/` 前缀避免与其他项目冲突
3. **文件命名**：使用时间戳和随机字符串确保唯一性
4. **错误处理**：上传失败时要有适当的错误提示
