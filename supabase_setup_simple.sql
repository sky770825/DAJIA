-- ============================================
-- 大甲鎮瀾宮官方聯名系列 - Supabase 數據庫設置
-- 簡化版本（分步驟執行，避免錯誤）
-- ============================================

-- ============================================
-- 步驟 1: 創建 leads 表
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

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- ============================================
-- 步驟 2: 創建 orders 表
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

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ============================================
-- 步驟 3: 創建 verification_codes 表
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

CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_order_number ON verification_codes(order_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_status ON verification_codes(status);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created_at ON verification_codes(created_at DESC);

-- ============================================
-- 步驟 4: 啟用 Row Level Security
-- ============================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 步驟 5: 創建安全策略
-- ============================================

-- 刪除現有策略（避免重複創建錯誤）
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update verification on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous insert on verification_codes" ON verification_codes;

-- 創建新策略
CREATE POLICY "Allow anonymous insert on leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on orders"
  ON orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on verification_codes"
  ON verification_codes FOR SELECT
  TO anon
  USING (status = 'active');

CREATE POLICY "Allow anonymous update verification on verification_codes"
  ON verification_codes FOR UPDATE
  TO anon
  USING (status = 'active')
  WITH CHECK (status IN ('active', 'used'));

CREATE POLICY "Allow anonymous insert on verification_codes"
  ON verification_codes FOR INSERT
  TO anon
  WITH CHECK (true);
