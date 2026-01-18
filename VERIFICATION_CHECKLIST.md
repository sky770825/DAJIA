# 設置驗證檢查清單

## 📋 執行驗證腳本

### 步驟 1：執行數據庫驗證

在 Supabase SQL Editor 中執行 `verify_setup.sql`，檢查：

- ✅ Schema 是否存在
- ✅ 所有表是否存在
- ✅ 表結構是否正確
- ✅ 外鍵關聯是否正確
- ✅ 索引是否創建
- ✅ RLS 是否啟用
- ✅ 策略是否創建
- ✅ 觸發器是否創建
- ✅ 示例數據是否插入

### 步驟 2：檢查 Storage

在 Supabase Dashboard > Storage 中手動檢查：

1. **Bucket 是否存在**
   - 名稱：`product-images`
   - 類型：Public

2. **Storage 策略**
   - 執行 `verify_storage.sql` 檢查策略
   - 或手動檢查 Dashboard > Storage > Policies

3. **測試上傳**
   - 嘗試上傳一個測試圖片
   - 確認可以訪問公開 URL

## ✅ 預期結果

### 數據庫表（應該存在）

1. ✅ `PRIVATE.DAJIA_main_categories` - 主目錄表
2. ✅ `PRIVATE.DAJIA_sub_categories` - 子目錄表
3. ✅ `PRIVATE.DAJIA_products` - 產品表
4. ✅ `PRIVATE.DAJIA_media` - 媒體表

### 表結構檢查點

#### DAJIA_main_categories
- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `name` (TEXT, NOT NULL, UNIQUE)
- ✅ `slug` (TEXT, NOT NULL, UNIQUE)
- ✅ `image_url` (TEXT)
- ✅ `display_order` (INTEGER)
- ✅ `is_active` (BOOLEAN)

#### DAJIA_sub_categories
- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `main_category_id` (UUID, FOREIGN KEY)
- ✅ `name` (TEXT, NOT NULL)
- ✅ `slug` (TEXT, NOT NULL)
- ✅ `image_url` (TEXT)
- ✅ `display_order` (INTEGER)
- ✅ `is_active` (BOOLEAN)

#### DAJIA_products
- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `name` (TEXT, NOT NULL)
- ✅ `slug` (TEXT, UNIQUE)
- ✅ `main_category_id` (UUID, FOREIGN KEY, 可選)
- ✅ `sub_category_id` (UUID, FOREIGN KEY, 可選)
- ✅ `image_url` (TEXT)
- ✅ `images` (JSONB)
- ✅ `price` (NUMERIC)
- ✅ `stock` (INTEGER)

#### DAJIA_media
- ✅ `id` (UUID, PRIMARY KEY)
- ✅ `file_name` (TEXT, NOT NULL)
- ✅ `file_path` (TEXT, NOT NULL)
- ✅ `file_url` (TEXT, NOT NULL)
- ✅ `file_type` (TEXT)
- ✅ `file_size` (BIGINT)
- ✅ `width` (INTEGER, 可選)
- ✅ `height` (INTEGER, 可選)
- ✅ `main_category_id` (UUID, FOREIGN KEY, 可選)
- ✅ `sub_category_id` (UUID, FOREIGN KEY, 可選)
- ✅ `product_id` (UUID, FOREIGN KEY, 可選)
- ✅ `usage_type` (TEXT)

### 外鍵關聯

- ✅ `DAJIA_sub_categories.main_category_id` → `DAJIA_main_categories.id`
- ✅ `DAJIA_products.main_category_id` → `DAJIA_main_categories.id`
- ✅ `DAJIA_products.sub_category_id` → `DAJIA_sub_categories.id`
- ✅ `DAJIA_media.main_category_id` → `DAJIA_main_categories.id`
- ✅ `DAJIA_media.sub_category_id` → `DAJIA_sub_categories.id`
- ✅ `DAJIA_media.product_id` → `DAJIA_products.id`

### RLS 策略

每個表應該有：
- ✅ SELECT 策略（允許匿名用戶讀取）
- ✅ INSERT 策略（如果需要）
- ✅ UPDATE 策略（如果需要）
- ✅ DELETE 策略（如果需要）

### 觸發器

- ✅ `update_dajia_main_categories_updated_at`
- ✅ `update_dajia_sub_categories_updated_at`
- ✅ `update_dajia_products_updated_at`
- ✅ `update_dajia_media_updated_at`

### 示例數據

- ✅ 至少有一個主目錄（"商品分類"）
- ✅ 至少有一個子目錄（關聯到主目錄）

## 🔍 常見問題排查

### 問題 1：表不存在

**解決方法**：
- 執行 `supabase_setup_categories.sql`
- 檢查是否有錯誤訊息

### 問題 2：外鍵關聯失敗

**解決方法**：
- 確認主表（如 main_categories）先創建
- 檢查外鍵引用的表是否存在

### 問題 3：RLS 策略缺失

**解決方法**：
- 重新執行 `supabase_setup_categories.sql` 的策略部分
- 或手動創建策略

### 問題 4：Storage Bucket 不存在

**解決方法**：
- 在 Dashboard > Storage 中創建 bucket
- 名稱：`product-images`
- 設置為 Public

## 📝 驗證報告模板

執行驗證後，請記錄：

```
✅ Schema: PRIVATE - 存在
✅ 表數量: 4 個
✅ 索引數量: XX 個
✅ RLS 策略: XX 個
✅ 觸發器: 4 個
✅ 示例數據: 主目錄 X 個，子目錄 X 個
✅ Storage Bucket: product-images - 存在/不存在
```

## 🚀 下一步

驗證通過後：
1. 測試圖片上傳功能
2. 測試分類查詢功能
3. 在後台管理中添加分類管理界面
