-- ============================================
-- 大甲鎮瀾宮官方聯名系列 - Supabase 數據庫設置
-- ============================================
-- 請在 Supabase SQL Editor 中執行此文件
-- 訪問：https://supabase.com/dashboard/project/cnzqtuuegdqwkgvletaa
-- ============================================
-- 注意：如果遇到錯誤，請先檢查表是否已存在
-- ============================================

-- ============================================
-- 1. 創建 leads 表（客戶登記）
-- ============================================
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

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ============================================
-- 2. 創建 orders 表（訂單）
-- ============================================
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

-- 創建索引（使用 DO 塊確保表存在）
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  END IF;
END $$;

-- ============================================
-- 3. 創建 verification_codes 表（防偽驗證碼）
-- ============================================
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_id TEXT,
  product_name TEXT,
  order_number TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引（使用 DO 塊確保表存在）
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verification_codes') THEN
    CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
    CREATE INDEX IF NOT EXISTS idx_verification_codes_order_number ON verification_codes(order_number);
    CREATE INDEX IF NOT EXISTS idx_verification_codes_status ON verification_codes(status);
    CREATE INDEX IF NOT EXISTS idx_verification_codes_created_at ON verification_codes(created_at DESC);
  END IF;
END $$;

-- ============================================
-- 4. 設置 Row Level Security (RLS)
-- ============================================

-- 啟用 RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. 創建安全策略 (Policies)
-- ============================================
-- 注意：如果策略已存在，會顯示錯誤，但不影響功能

-- 刪除現有策略（如果存在）
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update verification on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous insert on verification_codes" ON verification_codes;

-- 允許匿名用戶插入客戶登記數據（前端表單提交）
CREATE POLICY "Allow anonymous insert on leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允許匿名用戶插入訂單數據（結賬功能）
CREATE POLICY "Allow anonymous insert on orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

-- 允許匿名用戶查詢驗證碼（驗證功能）
CREATE POLICY "Allow anonymous select on verification_codes"
  ON verification_codes FOR SELECT
  TO anon
  USING (status = 'active');

-- 允許匿名用戶更新驗證碼狀態（記錄驗證）
CREATE POLICY "Allow anonymous update verification on verification_codes"
  ON verification_codes FOR UPDATE
  TO anon
  USING (status = 'active')
  WITH CHECK (status IN ('active', 'used'));

-- 允許匿名用戶插入驗證碼（訂單創建時）
CREATE POLICY "Allow anonymous insert on verification_codes"
  ON verification_codes FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- 6. 驗證設置（可選 - 用於檢查）
-- ============================================

-- 檢查表是否創建成功
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('leads', 'orders', 'verification_codes')
ORDER BY table_name;

-- 檢查索引
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('leads', 'orders', 'verification_codes')
ORDER BY tablename, indexname;

-- ============================================
-- 完成！
-- ============================================
-- 執行完成後，您可以在 Supabase Dashboard 的 Table Editor 中查看這些表
-- 現在可以開始測試網站功能了！
-- ============================================
