-- ============================================
-- 大甲鎮瀾宮官方聯名系列 - 主目錄與子目錄結構
-- 使用 PRIVATE schema，表名使用 DAJIA 前綴避免衝突
-- ============================================
-- 請在 Supabase SQL Editor 中執行此文件
-- 訪問：https://supabase.com/dashboard/project/cnzqtuuegdqwkgvletaa
-- ============================================

-- ============================================
-- 0. 確保 PRIVATE schema 存在
-- ============================================
CREATE SCHEMA IF NOT EXISTS PRIVATE;

-- ============================================
-- 1. 創建主目錄表（DAJIA_main_categories）
-- ============================================
CREATE TABLE IF NOT EXISTS PRIVATE.DAJIA_main_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,                    -- 主目錄名稱（如：商品分類、內容管理）
  slug TEXT NOT NULL UNIQUE,                    -- URL 友好名稱
  description TEXT,                              -- 描述
  image_url TEXT,                                -- 主目錄圖片 URL
  display_order INTEGER DEFAULT 0,               -- 顯示順序
  is_active BOOLEAN DEFAULT true,               -- 是否啟用
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_dajia_main_categories_slug ON PRIVATE.DAJIA_main_categories(slug);
CREATE INDEX IF NOT EXISTS idx_dajia_main_categories_active ON PRIVATE.DAJIA_main_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_dajia_main_categories_order ON PRIVATE.DAJIA_main_categories(display_order);

-- ============================================
-- 2. 創建子目錄表（DAJIA_sub_categories）
-- ============================================
CREATE TABLE IF NOT EXISTS PRIVATE.DAJIA_sub_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  main_category_id UUID NOT NULL REFERENCES PRIVATE.DAJIA_main_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                            -- 子目錄名稱
  slug TEXT NOT NULL,                            -- URL 友好名稱
  description TEXT,                              -- 描述
  image_url TEXT,                                -- 子目錄圖片 URL
  display_order INTEGER DEFAULT 0,               -- 顯示順序
  is_active BOOLEAN DEFAULT true,               -- 是否啟用
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 確保同一主目錄下子目錄名稱唯一
  UNIQUE(main_category_id, name),
  UNIQUE(main_category_id, slug)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_dajia_sub_categories_main_id ON PRIVATE.DAJIA_sub_categories(main_category_id);
CREATE INDEX IF NOT EXISTS idx_dajia_sub_categories_slug ON PRIVATE.DAJIA_sub_categories(slug);
CREATE INDEX IF NOT EXISTS idx_dajia_sub_categories_active ON PRIVATE.DAJIA_sub_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_dajia_sub_categories_order ON PRIVATE.DAJIA_sub_categories(main_category_id, display_order);

-- ============================================
-- 3. 更新產品表，添加分類關聯（如果已存在）
-- ============================================
-- 如果 products 表已存在，添加分類關聯字段
DO $$
BEGIN
  -- 檢查 products 表是否存在
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'PRIVATE' 
      AND table_name = 'DAJIA_products'
  ) THEN
    -- 添加主目錄和子目錄關聯
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'PRIVATE' 
        AND table_name = 'DAJIA_products' 
        AND column_name = 'main_category_id'
    ) THEN
      ALTER TABLE PRIVATE.DAJIA_products 
      ADD COLUMN main_category_id UUID REFERENCES PRIVATE.DAJIA_main_categories(id),
      ADD COLUMN sub_category_id UUID REFERENCES PRIVATE.DAJIA_sub_categories(id);
    END IF;
  END IF;
END $$;

-- ============================================
-- 4. 創建產品表（如果不存在，使用 DAJIA 前綴）
-- ============================================
CREATE TABLE IF NOT EXISTS PRIVATE.DAJIA_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                            -- 產品名稱
  slug TEXT NOT NULL UNIQUE,                     -- URL 友好名稱
  description TEXT,                              -- 產品描述
  main_category_id UUID REFERENCES PRIVATE.DAJIA_main_categories(id),
  sub_category_id UUID REFERENCES PRIVATE.DAJIA_sub_categories(id),
  image_url TEXT,                                -- 主圖片 URL
  images JSONB,                                 -- 多張圖片（JSON 數組）
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,      -- 價格
  stock INTEGER DEFAULT 0,                       -- 庫存
  in_stock BOOLEAN DEFAULT true,                 -- 是否有庫存
  tags TEXT[],                                   -- 標籤數組
  specifications JSONB,                          -- 規格（JSON 對象）
  is_active BOOLEAN DEFAULT true,               -- 是否啟用
  display_order INTEGER DEFAULT 0,               -- 顯示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_dajia_products_slug ON PRIVATE.DAJIA_products(slug);
CREATE INDEX IF NOT EXISTS idx_dajia_products_main_category ON PRIVATE.DAJIA_products(main_category_id);
CREATE INDEX IF NOT EXISTS idx_dajia_products_sub_category ON PRIVATE.DAJIA_products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_dajia_products_active ON PRIVATE.DAJIA_products(is_active);
CREATE INDEX IF NOT EXISTS idx_dajia_products_order ON PRIVATE.DAJIA_products(display_order);

-- ============================================
-- 5. 創建圖片上傳記錄表（DAJIA_media）
-- ============================================
CREATE TABLE IF NOT EXISTS PRIVATE.DAJIA_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,                       -- 原始檔案名稱
  file_path TEXT NOT NULL,                       -- 儲存路徑
  file_url TEXT NOT NULL,                        -- 完整 URL
  file_type TEXT,                                -- 檔案類型（image/jpeg, image/png 等）
  file_size BIGINT,                              -- 檔案大小（bytes）
  width INTEGER,                                 -- 圖片寬度
  height INTEGER,                                -- 圖片高度
  alt_text TEXT,                                 -- 替代文字
  caption TEXT,                                  -- 說明文字
  -- 關聯到主目錄、子目錄或產品
  main_category_id UUID REFERENCES PRIVATE.DAJIA_main_categories(id) ON DELETE SET NULL,
  sub_category_id UUID REFERENCES PRIVATE.DAJIA_sub_categories(id) ON DELETE SET NULL,
  product_id UUID REFERENCES PRIVATE.DAJIA_products(id) ON DELETE SET NULL,
  -- 用途標記
  usage_type TEXT,                               -- 'main_category', 'sub_category', 'product', 'general'
  display_order INTEGER DEFAULT 0,               -- 顯示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_dajia_media_main_category ON PRIVATE.DAJIA_media(main_category_id);
CREATE INDEX IF NOT EXISTS idx_dajia_media_sub_category ON PRIVATE.DAJIA_media(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_dajia_media_product ON PRIVATE.DAJIA_media(product_id);
CREATE INDEX IF NOT EXISTS idx_dajia_media_usage_type ON PRIVATE.DAJIA_media(usage_type);

-- ============================================
-- 6. 設置 Row Level Security (RLS)
-- ============================================
ALTER TABLE PRIVATE.DAJIA_main_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE PRIVATE.DAJIA_sub_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE PRIVATE.DAJIA_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE PRIVATE.DAJIA_media ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 7. 創建安全策略 (Policies)
-- ============================================

-- 刪除現有策略（避免重複創建錯誤）
DROP POLICY IF EXISTS "Allow anonymous select main categories" ON PRIVATE.DAJIA_main_categories;
DROP POLICY IF EXISTS "Allow anonymous select sub categories" ON PRIVATE.DAJIA_sub_categories;
DROP POLICY IF EXISTS "Allow anonymous select products" ON PRIVATE.DAJIA_products;
DROP POLICY IF EXISTS "Allow anonymous select media" ON PRIVATE.DAJIA_media;

-- 允許匿名用戶查詢主目錄（公開讀取）
CREATE POLICY "Allow anonymous select main categories"
  ON PRIVATE.DAJIA_main_categories FOR SELECT
  TO anon
  USING (is_active = true);

-- 允許匿名用戶查詢子目錄（公開讀取）
CREATE POLICY "Allow anonymous select sub categories"
  ON PRIVATE.DAJIA_sub_categories FOR SELECT
  TO anon
  USING (is_active = true);

-- 允許匿名用戶查詢產品（公開讀取）
CREATE POLICY "Allow anonymous select products"
  ON PRIVATE.DAJIA_products FOR SELECT
  TO anon
  USING (is_active = true);

-- 允許匿名用戶查詢媒體（公開讀取）
CREATE POLICY "Allow anonymous select media"
  ON PRIVATE.DAJIA_media FOR SELECT
  TO anon
  USING (true);

-- ============================================
-- 8. 創建更新時間觸發器函數
-- ============================================
CREATE OR REPLACE FUNCTION PRIVATE.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 刪除現有觸發器（如果存在）
DROP TRIGGER IF EXISTS update_dajia_main_categories_updated_at ON PRIVATE.DAJIA_main_categories;
DROP TRIGGER IF EXISTS update_dajia_sub_categories_updated_at ON PRIVATE.DAJIA_sub_categories;
DROP TRIGGER IF EXISTS update_dajia_products_updated_at ON PRIVATE.DAJIA_products;
DROP TRIGGER IF EXISTS update_dajia_media_updated_at ON PRIVATE.DAJIA_media;

-- 為所有表添加更新時間觸發器
CREATE TRIGGER update_dajia_main_categories_updated_at
  BEFORE UPDATE ON PRIVATE.DAJIA_main_categories
  FOR EACH ROW
  EXECUTE FUNCTION PRIVATE.update_updated_at_column();

CREATE TRIGGER update_dajia_sub_categories_updated_at
  BEFORE UPDATE ON PRIVATE.DAJIA_sub_categories
  FOR EACH ROW
  EXECUTE FUNCTION PRIVATE.update_updated_at_column();

CREATE TRIGGER update_dajia_products_updated_at
  BEFORE UPDATE ON PRIVATE.DAJIA_products
  FOR EACH ROW
  EXECUTE FUNCTION PRIVATE.update_updated_at_column();

CREATE TRIGGER update_dajia_media_updated_at
  BEFORE UPDATE ON PRIVATE.DAJIA_media
  FOR EACH ROW
  EXECUTE FUNCTION PRIVATE.update_updated_at_column();

-- ============================================
-- 9. 插入示例數據（可選）
-- ============================================

-- 插入示例主目錄
INSERT INTO PRIVATE.DAJIA_main_categories (name, slug, description, display_order)
VALUES 
  ('商品分類', 'products', '所有商品的分類', 1),
  ('內容管理', 'content', '網站內容管理', 2)
ON CONFLICT (slug) DO NOTHING;

-- 插入示例子目錄（關聯到"商品分類"主目錄）
INSERT INTO PRIVATE.DAJIA_sub_categories (main_category_id, name, slug, description, display_order)
SELECT 
  mc.id,
  sub.name,
  sub.slug,
  sub.description,
  sub.display_order
FROM PRIVATE.DAJIA_main_categories mc,
(VALUES
  ('隨身配飾', 'carry', '可隨身攜帶的配飾商品', 1),
  ('禮品系列', 'gift', '適合送禮的商品', 2),
  ('居家用品', 'home', '居家裝飾用品', 3),
  ('辦公用品', 'office', '辦公室相關商品', 4)
) AS sub(name, slug, description, display_order)
WHERE mc.slug = 'products'
ON CONFLICT (main_category_id, slug) DO NOTHING;

-- ============================================
-- 10. 驗證設置
-- ============================================

-- 檢查表是否創建成功
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema = 'PRIVATE'
  AND table_name LIKE 'DAJIA_%'
ORDER BY table_name;

-- 檢查主目錄和子目錄關聯
SELECT 
  mc.name as main_category,
  sc.name as sub_category,
  sc.slug as sub_slug
FROM PRIVATE.DAJIA_main_categories mc
LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON mc.id = sc.main_category_id
ORDER BY mc.display_order, sc.display_order;

-- ============================================
-- 完成！
-- ============================================
-- 表結構：
-- - DAJIA_main_categories: 主目錄
-- - DAJIA_sub_categories: 子目錄（關聯主目錄）
-- - DAJIA_products: 產品（可關聯主目錄和子目錄）
-- - DAJIA_media: 圖片上傳記錄
-- 
-- 所有表名都使用 DAJIA 前綴，避免與其他專案衝突
-- ============================================
