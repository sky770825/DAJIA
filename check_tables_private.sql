-- ============================================
-- 檢查 PRIVATE schema 中的表
-- ============================================
-- 執行前先檢查，確認要操作的表
-- ============================================

-- 檢查 PRIVATE schema 中的所有表
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'PRIVATE'
ORDER BY table_name;

-- 檢查本項目需要的三個表是否存在
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'leads') 
    THEN '✅ leads 表存在' 
    ELSE '❌ leads 表不存在' 
  END as leads_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'orders') 
    THEN '✅ orders 表存在' 
    ELSE '❌ orders 表不存在' 
  END as orders_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'verification_codes') 
    THEN '✅ verification_codes 表存在' 
    ELSE '❌ verification_codes 表不存在' 
  END as verification_codes_status;

-- 檢查 orders 表的結構（確認是否有 order_number 列）
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'orders'
ORDER BY ordinal_position;

-- 檢查 verification_codes 表的結構
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'verification_codes'
ORDER BY ordinal_position;
