-- ============================================
-- 修復 PRIVATE schema 中的表結構
-- ============================================
-- ⚠️ 此文件只會刪除 PRIVATE schema 中的以下三個表：
--    - PRIVATE.leads
--    - PRIVATE.orders  
--    - PRIVATE.verification_codes
-- 
-- ✅ 不會影響其他 schema 或其他表
-- ⚠️ 警告：會刪除這三個表的現有數據！
-- ============================================

-- 刪除現有策略（如果表不存在，這會顯示警告但不會報錯）
DROP POLICY IF EXISTS "Allow anonymous insert on leads" ON PRIVATE.leads;
DROP POLICY IF EXISTS "Allow anonymous insert on orders" ON PRIVATE.orders;
DROP POLICY IF EXISTS "Allow anonymous select on verification_codes" ON PRIVATE.verification_codes;
DROP POLICY IF EXISTS "Allow anonymous update verification on verification_codes" ON PRIVATE.verification_codes;
DROP POLICY IF EXISTS "Allow anonymous insert on verification_codes" ON PRIVATE.verification_codes;

-- 只刪除 PRIVATE schema 中的三個表
-- CASCADE 會自動刪除相關的索引、約束等，但不會影響其他 schema 的表
DROP TABLE IF EXISTS PRIVATE.verification_codes CASCADE;
DROP TABLE IF EXISTS PRIVATE.orders CASCADE;
DROP TABLE IF EXISTS PRIVATE.leads CASCADE;

-- 驗證表已刪除（可選）
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'PRIVATE' 
--   AND table_name IN ('leads', 'orders', 'verification_codes');
-- 應該返回空結果

-- ============================================
-- 完成！
-- ============================================
-- 現在可以執行 supabase_setup_private.sql 來重新創建表
-- ============================================
