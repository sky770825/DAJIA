-- ============================================
-- 檢查當前表的位置和結構
-- ============================================
-- 此查詢會幫助確認表實際在哪個 schema 中
-- ============================================

-- 檢查所有 schema
SELECT schema_name 
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;

-- 檢查 PRIVATE schema 中的表
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema = 'PRIVATE'
ORDER BY table_name;

-- 檢查是否有 DAJIA schema
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema = 'DAJIA'
ORDER BY table_name;

-- 檢查所有包含 "lead", "order", "verification" 的表（不區分大小寫）
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
  AND (
    LOWER(table_name) LIKE '%lead%' 
    OR LOWER(table_name) LIKE '%order%' 
    OR LOWER(table_name) LIKE '%verification%'
  )
ORDER BY table_schema, table_name;
