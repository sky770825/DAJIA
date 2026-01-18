-- ============================================
-- Storage Bucket 檢查（需要在 Supabase Dashboard 中手動檢查）
-- ============================================
-- 注意：SQL 無法直接查詢 Storage，請在 Dashboard 中檢查
-- ============================================

-- 檢查是否有 Storage 相關的函數或視圖
SELECT 
  'Storage 檢查' as check_type,
  '請在 Supabase Dashboard > Storage 中手動檢查以下項目:' as instruction;

-- ============================================
-- 需要在 Dashboard 中檢查的項目：
-- ============================================
-- 1. Bucket 名稱：product-images
-- 2. Bucket 是否為 Public
-- 3. Storage 策略是否設置
-- 4. 測試上傳一個文件
-- ============================================

-- 檢查 Storage 策略（如果有的話）
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%product-images%'
ORDER BY policyname;
