# 大甲鎮瀾宮官方聯名系列網站

## 📋 專案簡介

大甲鎮瀾宮官方聯名系列電商網站，包含完整的電商功能、真偽驗證系統、後台管理等。

## ✨ 功能特色

### 前端功能
- ✅ 商品展示與搜尋
- ✅ 購物車系統
- ✅ 結賬流程
- ✅ 訂單管理與查詢
- ✅ 真偽驗證系統
- ✅ 客戶登記表單
- ✅ 響應式設計

### 後台管理
- ✅ 密碼保護登入
- ✅ 客戶登記管理
- ✅ 訂單管理
- ✅ 驗證碼管理
- ✅ 數據匯出功能
- ✅ 分頁顯示

### 數據庫功能
- ✅ Supabase 數據庫集成
- ✅ 主目錄與子目錄分類系統
- ✅ 圖片上傳功能
- ✅ 自動生成驗證碼
- ✅ 數據備份（localStorage）

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置環境變數

在項目根目錄創建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=123456
```

### 3. 設置 Supabase 數據庫

1. 訪問 Supabase Dashboard
2. 在 SQL Editor 中執行 `supabase_setup_categories.sql`
3. 創建 Storage bucket: `product-images`（Public）

詳細說明請參考：
- `SUPABASE_SETUP.md` - 數據庫設置說明
- `COMPLETE_SETUP.md` - 完整設置指南

### 4. 啟動開發服務器

```bash
npm run dev
```

訪問：http://localhost:5173

## 📁 專案結構

```
鎮南宮/
├── src/
│   ├── components/     # 組件
│   ├── pages/         # 頁面
│   ├── lib/           # 工具函數
│   ├── data/          # 數據文件
│   └── hooks/         # 自定義 Hooks
├── public/            # 靜態資源
├── supabase_setup_*.sql  # 數據庫設置 SQL
└── *.md              # 文檔文件
```

## 🔧 技術棧

- **前端框架**: React 18 + TypeScript
- **構建工具**: Vite
- **UI 組件**: shadcn-ui + Tailwind CSS
- **路由**: React Router DOM
- **表單處理**: react-hook-form + zod
- **狀態管理**: React Hooks + localStorage
- **數據庫**: Supabase (PostgreSQL)
- **存儲**: Supabase Storage

## 📚 重要文檔

- `SUPABASE_SETUP.md` - Supabase 數據庫設置
- `CATEGORY_STRUCTURE.md` - 分類系統說明
- `STORAGE_SETUP.md` - Storage 設置說明
- `ADMIN_SETUP.md` - 後台管理說明
- `VERIFICATION_SETUP.md` - 驗證碼系統說明
- `TESTING_GUIDE.md` - 測試指南

## 🔒 安全注意事項

⚠️ **重要**：
- `.env.local` 文件不會上傳到 Git（已加入 .gitignore）
- 後台密碼驗證目前是前端實現，生產環境建議使用服務端驗證
- Supabase API Key 請妥善保管，不要提交到公開倉庫

## 📝 數據庫表結構

### 主要表
- `DAJIA_main_categories` - 主目錄
- `DAJIA_sub_categories` - 子目錄
- `DAJIA_products` - 產品
- `DAJIA_media` - 媒體文件
- `leads` - 客戶登記
- `orders` - 訂單
- `verification_codes` - 驗證碼

所有表使用 `DAJIA_` 前綴，避免與其他專案衝突。

## 🧪 測試

訪問測試頁面檢查設置：
- http://localhost:5173/test

## 📞 聯絡資訊

如有問題，請參考各文檔文件或檢查：
- Supabase Dashboard Logs
- 瀏覽器控制台錯誤
- 測試頁面檢查結果

## 📄 授權

此專案為大甲鎮瀾宮官方聯名系列專案。
