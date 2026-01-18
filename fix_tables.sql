-- ============================================
-- 修復表結構（如果表已存在但結構不對）
-- ============================================
-- ⚠️ 此文件只會刪除以下三個表：
--    - leads
--    - orders  
--    - verification_codes
-- 
-- ✅ 不會影響其他表或數據
-- ⚠️ 警告：會刪除這三個表的現有數據！
-- ============================================

-- 刪除現有策略（如果表不存在，這會顯示警告但不會報錯）
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update verification on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous insert on verification_codes" ON verification_codes;

-- 只刪除本項目需要的三個表
-- CASCADE 會自動刪除相關的索引、約束等，但不會影響其他表
DROP TABLE IF EXISTS verification_codes CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- 刪除現有策略（如果存在）
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON leads;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous select on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update verification on verification_codes" ON verification_codes;
DROP POLICY IF EXISTS "Allow anonymous insert on verification_codes" ON verification_codes;

-- 現在執行 supabase_setup_simple.sql 文件來重新創建表
