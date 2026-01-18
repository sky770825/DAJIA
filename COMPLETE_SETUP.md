# 完整设置指南

## 📋 设置步骤总览

### 1. 创建数据库表结构

执行 `supabase_setup_categories.sql` 创建：
- ✅ 主目錄表（DAJIA_main_categories）
- ✅ 子目錄表（DAJIA_sub_categories）
- ✅ 產品表（DAJIA_products）
- ✅ 媒體表（DAJIA_media）

### 2. 创建 Storage Bucket

1. 在 Supabase Dashboard > Storage 中创建 bucket
2. 名称：`product-images`
3. 设置为 Public
4. 执行 `STORAGE_SETUP.md` 中的 SQL 设置策略

### 3. 配置代码

代码已更新为使用：
- `PRIVATE.DAJIA_main_categories`
- `PRIVATE.DAJIA_sub_categories`
- `PRIVATE.DAJIA_products`
- `PRIVATE.DAJIA_media`

## 🎯 命名规范总结

### 表名规范
- 所有表使用 `DAJIA_` 前缀
- 位于 `PRIVATE` schema
- 格式：`PRIVATE.DAJIA_表名`

### 文件路径规范
- Storage 路径：`DAJIA/文件夹/文件名`
- 避免与其他项目冲突

### 字段命名规范
- 使用小写字母和底線
- 外鍵：`表名_id`
- 布林值：`is_` 前缀
- 時間戳：`_at` 後綴

## 📚 相关文件

- `supabase_setup_categories.sql` - 创建分类和产品表
- `CATEGORY_STRUCTURE.md` - 表结构详细说明
- `STORAGE_SETUP.md` - Storage 设置说明
- `src/lib/media.ts` - 图片上传工具函数
- `src/lib/categories.ts` - 分类查询工具函数

## ✅ 验证清单

- [ ] 执行 `supabase_setup_categories.sql` 创建表
- [ ] 创建 `product-images` Storage bucket
- [ ] 设置 Storage 策略
- [ ] 测试图片上传功能
- [ ] 测试分类查询功能
- [ ] 验证表关联关系

## 🚀 下一步

1. 执行 SQL 创建表结构
2. 设置 Storage bucket
3. 测试图片上传
4. 在后台管理中添加分类管理功能
