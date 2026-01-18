# 主目錄與子目錄結構說明

## 📋 表結構設計

### 1. 主目錄表（DAJIA_main_categories）

用於儲存主分類，例如：
- 商品分類
- 內容管理
- 其他主要分類

**字段說明**：
- `id`: UUID 主鍵
- `name`: 主目錄名稱（唯一）
- `slug`: URL 友好名稱（唯一）
- `description`: 描述
- `image_url`: 主目錄圖片 URL
- `display_order`: 顯示順序
- `is_active`: 是否啟用
- `created_at`, `updated_at`: 時間戳

### 2. 子目錄表（DAJIA_sub_categories）

用於儲存子分類，關聯到主目錄。

**字段說明**：
- `id`: UUID 主鍵
- `main_category_id`: 關聯到主目錄（外鍵）
- `name`: 子目錄名稱（同一主目錄下唯一）
- `slug`: URL 友好名稱（同一主目錄下唯一）
- `description`: 描述
- `image_url`: 子目錄圖片 URL
- `display_order`: 顯示順序
- `is_active`: 是否啟用
- `created_at`, `updated_at`: 時間戳

**關聯規則**：
- 一個主目錄可以有多個子目錄
- 子目錄必須屬於一個主目錄
- 同一主目錄下，子目錄名稱和 slug 必須唯一

### 3. 產品表（DAJIA_products）

用於儲存產品資訊，可關聯到主目錄和子目錄。

**字段說明**：
- `id`: UUID 主鍵
- `name`: 產品名稱
- `slug`: URL 友好名稱（唯一）
- `description`: 產品描述
- `main_category_id`: 關聯主目錄（可選）
- `sub_category_id`: 關聯子目錄（可選）
- `image_url`: 主圖片 URL
- `images`: 多張圖片（JSON 數組）
- `price`: 價格
- `stock`: 庫存
- `in_stock`: 是否有庫存
- `tags`: 標籤數組
- `specifications`: 規格（JSON 對象）
- `is_active`: 是否啟用
- `display_order`: 顯示順序
- `created_at`, `updated_at`: 時間戳

### 4. 媒體表（DAJIA_media）

用於儲存圖片上傳記錄，可關聯到主目錄、子目錄或產品。

**字段說明**：
- `id`: UUID 主鍵
- `file_name`: 原始檔案名稱
- `file_path`: 儲存路徑
- `file_url`: 完整 URL
- `file_type`: 檔案類型
- `file_size`: 檔案大小
- `width`, `height`: 圖片尺寸
- `alt_text`: 替代文字
- `caption`: 說明文字
- `main_category_id`: 關聯主目錄（可選）
- `sub_category_id`: 關聯子目錄（可選）
- `product_id`: 關聯產品（可選）
- `usage_type`: 用途標記（'main_category', 'sub_category', 'product', 'general'）
- `display_order`: 顯示順序
- `created_at`, `updated_at`: 時間戳

## 🔗 關聯關係

```
DAJIA_main_categories (主目錄)
    ├── DAJIA_sub_categories (子目錄) [1對多]
    │       └── DAJIA_products (產品) [1對多]
    │
    └── DAJIA_products (產品) [1對多，直接關聯主目錄]

DAJIA_media (媒體)
    ├── 可關聯到 main_category_id
    ├── 可關聯到 sub_category_id
    └── 可關聯到 product_id
```

## 📝 命名規範

### 表名規範
- 所有表名使用 `DAJIA_` 前綴
- 使用小寫字母和底線
- 格式：`DAJIA_表類型_名稱`

### 字段命名規範
- 使用小寫字母和底線
- 外鍵使用 `表名_id` 格式（如 `main_category_id`）
- 布林值使用 `is_` 前綴（如 `is_active`）
- 時間戳使用 `_at` 後綴（如 `created_at`）

### Slug 命名規範
- 使用小寫字母、數字和連字號
- 避免特殊字符
- 保持簡潔和描述性

## 🖼️ 圖片上傳流程

### 1. 上傳到 Supabase Storage

```typescript
// 上傳圖片到 Storage
const uploadImage = async (file: File, folder: string) => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `DAJIA/${folder}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('product-images') // 需要在 Supabase 中創建這個 bucket
    .upload(filePath, file);
  
  if (error) throw error;
  
  // 獲取公開 URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);
  
  return urlData.publicUrl;
};
```

### 2. 保存到媒體表

```typescript
// 保存圖片記錄到數據庫
const saveMedia = async (imageData: {
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: number;
  width?: number;
  height?: number;
  main_category_id?: string;
  sub_category_id?: string;
  product_id?: string;
  usage_type: string;
}) => {
  const { data, error } = await supabase
    .from('PRIVATE.DAJIA_media')
    .insert([imageData]);
  
  if (error) throw error;
  return data;
};
```

## 🔍 查詢示例

### 查詢主目錄及其子目錄

```sql
SELECT 
  mc.id as main_id,
  mc.name as main_name,
  mc.slug as main_slug,
  sc.id as sub_id,
  sc.name as sub_name,
  sc.slug as sub_slug
FROM PRIVATE.DAJIA_main_categories mc
LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON mc.id = sc.main_category_id
WHERE mc.is_active = true
ORDER BY mc.display_order, sc.display_order;
```

### 查詢產品及其分類

```sql
SELECT 
  p.*,
  mc.name as main_category_name,
  sc.name as sub_category_name
FROM PRIVATE.DAJIA_products p
LEFT JOIN PRIVATE.DAJIA_main_categories mc ON p.main_category_id = mc.id
LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON p.sub_category_id = sc.id
WHERE p.is_active = true
ORDER BY p.display_order;
```

### 查詢產品的所有圖片

```sql
SELECT *
FROM PRIVATE.DAJIA_media
WHERE product_id = '產品ID'
  AND usage_type = 'product'
ORDER BY display_order;
```

## ✅ 優勢

1. **避免衝突**：所有表名使用 `DAJIA_` 前綴
2. **層次清晰**：主目錄 → 子目錄 → 產品的清晰結構
3. **靈活關聯**：產品可以關聯主目錄或子目錄
4. **圖片管理**：統一的媒體表管理所有圖片
5. **易於擴展**：可以輕鬆添加新的分類層級
