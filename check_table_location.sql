-- ============================================
-- 檢查表實際位置
-- ============================================
-- 此查詢會顯示表實際在哪個 schema 中
-- ============================================

-- 檢查所有包含 DAJIA 的表
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_name LIKE '%DAJIA%'
  OR table_name LIKE '%main_categories%'
  OR table_name LIKE '%sub_categories%'
ORDER BY table_schema, table_name;

-- 檢查 PRIVATE schema 中的所有表
SELECT 
  'PRIVATE schema 中的表:' as info,
  table_name
FROM information_schema.tables
WHERE table_schema = 'PRIVATE'
ORDER BY table_name;

-- 檢查 public schema 中的所有表
SELECT 
  'public schema 中的表:' as info,
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (table_name LIKE '%DAJIA%' 
       OR table_name LIKE '%category%'
       OR table_name LIKE '%product%'
       OR table_name LIKE '%media%')
ORDER BY table_name;
