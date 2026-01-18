-- ============================================
-- 大甲鎮瀾宮官方聯名系列 - 設置驗證腳本
-- ============================================
-- 此腳本會檢查所有表、索引、策略是否正確設置
-- ============================================

-- ============================================
-- 1. 檢查 Schema 是否存在
-- ============================================
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'PRIVATE')
    THEN '✅ PRIVATE schema 存在'
    ELSE '❌ PRIVATE schema 不存在'
  END as schema_status;

-- ============================================
-- 2. 檢查所有 DAJIA 表是否存在
-- ============================================
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'DAJIA_main_categories')
    THEN '✅ DAJIA_main_categories 表存在'
    ELSE '❌ DAJIA_main_categories 表不存在'
  END as main_categories_table,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'DAJIA_sub_categories')
    THEN '✅ DAJIA_sub_categories 表存在'
    ELSE '❌ DAJIA_sub_categories 表不存在'
  END as sub_categories_table,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'DAJIA_products')
    THEN '✅ DAJIA_products 表存在'
    ELSE '❌ DAJIA_products 表不存在'
  END as products_table,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'PRIVATE' AND table_name = 'DAJIA_media')
    THEN '✅ DAJIA_media 表存在'
    ELSE '❌ DAJIA_media 表不存在'
  END as media_table;

-- ============================================
-- 3. 檢查表結構（字段）
-- ============================================

-- 檢查主目錄表結構
SELECT 
  'DAJIA_main_categories 表結構:' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'DAJIA_main_categories'
ORDER BY ordinal_position;

-- 檢查子目錄表結構
SELECT 
  'DAJIA_sub_categories 表結構:' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'DAJIA_sub_categories'
ORDER BY ordinal_position;

-- 檢查產品表結構
SELECT 
  'DAJIA_products 表結構:' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'DAJIA_products'
ORDER BY ordinal_position;

-- 檢查媒體表結構
SELECT 
  'DAJIA_media 表結構:' as table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'PRIVATE' 
  AND table_name = 'DAJIA_media'
ORDER BY ordinal_position;

-- ============================================
-- 4. 檢查外鍵關聯
-- ============================================
SELECT 
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'PRIVATE'
  AND tc.table_name LIKE 'DAJIA_%'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- 5. 檢查索引
-- ============================================
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'PRIVATE'
  AND tablename LIKE 'DAJIA_%'
ORDER BY tablename, indexname;

-- ============================================
-- 6. 檢查 RLS 是否啟用
-- ============================================
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS 已啟用'
    ELSE '❌ RLS 未啟用'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'PRIVATE'
  AND tablename LIKE 'DAJIA_%'
ORDER BY tablename;

-- ============================================
-- 7. 檢查 RLS 策略
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'PRIVATE'
  AND tablename LIKE 'DAJIA_%'
ORDER BY tablename, policyname;

-- ============================================
-- 8. 檢查觸發器
-- ============================================
SELECT 
  trigger_schema,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'PRIVATE'
  AND event_object_table LIKE 'DAJIA_%'
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 9. 檢查示例數據
-- ============================================
SELECT 
  '主目錄數量:' as data_type,
  COUNT(*)::text as count
FROM PRIVATE.DAJIA_main_categories
UNION ALL
SELECT 
  '子目錄數量:' as data_type,
  COUNT(*)::text as count
FROM PRIVATE.DAJIA_sub_categories
UNION ALL
SELECT 
  '產品數量:' as data_type,
  COUNT(*)::text as count
FROM PRIVATE.DAJIA_products
UNION ALL
SELECT 
  '媒體數量:' as data_type,
  COUNT(*)::text as count
FROM PRIVATE.DAJIA_media;

-- ============================================
-- 10. 檢查主目錄和子目錄關聯
-- ============================================
SELECT 
  mc.name as main_category,
  mc.slug as main_slug,
  COUNT(sc.id) as sub_category_count
FROM PRIVATE.DAJIA_main_categories mc
LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON mc.id = sc.main_category_id
GROUP BY mc.id, mc.name, mc.slug
ORDER BY mc.display_order;

-- ============================================
-- 11. 檢查唯一約束
-- ============================================
SELECT 
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'PRIVATE'
  AND tc.table_name LIKE 'DAJIA_%'
  AND tc.constraint_type IN ('UNIQUE', 'PRIMARY KEY')
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.table_name, tc.constraint_type;

-- ============================================
-- 12. 測試查詢（驗證功能）
-- ============================================

-- 測試：查詢主目錄及其子目錄
SELECT 
  '測試查詢: 主目錄和子目錄' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM PRIVATE.DAJIA_main_categories mc
      LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON mc.id = sc.main_category_id
      LIMIT 1
    )
    THEN '✅ 查詢成功'
    ELSE '❌ 查詢失敗'
  END as test_result;

-- 測試：查詢產品關聯
SELECT 
  '測試查詢: 產品關聯' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM PRIVATE.DAJIA_products p
      LEFT JOIN PRIVATE.DAJIA_main_categories mc ON p.main_category_id = mc.id
      LEFT JOIN PRIVATE.DAJIA_sub_categories sc ON p.sub_category_id = sc.id
      LIMIT 1
    )
    THEN '✅ 查詢成功'
    ELSE '❌ 查詢失敗（可能沒有產品數據）'
  END as test_result;

-- ============================================
-- 完成驗證
-- ============================================
-- 請檢查以上所有結果，確認：
-- 1. ✅ 所有表都存在
-- 2. ✅ 表結構正確
-- 3. ✅ 外鍵關聯正確
-- 4. ✅ 索引已創建
-- 5. ✅ RLS 已啟用
-- 6. ✅ 策略已創建
-- 7. ✅ 觸發器已創建
-- ============================================
