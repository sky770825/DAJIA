#!/bin/bash

echo "=========================================="
echo "      網站功能測試腳本"
echo "=========================================="
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 檢查服務器是否運行
echo "1. 檢查服務器狀態..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 服務器運行中 (http://localhost:5173)${NC}"
else
    echo -e "${RED}✗ 服務器未運行，請先執行: npm run dev${NC}"
    exit 1
fi
echo ""

# 檢查 HTML 結構
echo "2. 檢查 HTML 結構..."
if curl -s http://localhost:5173 | grep -q '<div id="root">'; then
    echo -e "${GREEN}✓ Root 元素存在${NC}"
else
    echo -e "${RED}✗ Root 元素缺失${NC}"
fi

if curl -s http://localhost:5173 | grep -q 'src="/src/main.tsx"'; then
    echo -e "${GREEN}✓ main.tsx 引用正確${NC}"
else
    echo -e "${RED}✗ main.tsx 引用缺失${NC}"
fi

if curl -s http://localhost:5173 | grep -q 'favicon.ico'; then
    echo -e "${GREEN}✓ favicon 配置正確${NC}"
else
    echo -e "${YELLOW}⚠ favicon 配置可能缺失${NC}"
fi
echo ""

# 檢查關鍵文件
echo "3. 檢查關鍵文件..."
FILES=(
    "src/main.tsx"
    "src/App.tsx"
    "src/pages/Index.tsx"
    "src/components/Header.tsx"
    "src/data/products.ts"
    "src/hooks/use-cart.ts"
    "public/favicon.ico"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file 不存在${NC}"
    fi
done
echo ""

# 檢查構建
echo "4. 檢查構建..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 構建成功${NC}"
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓ dist 目錄存在${NC}"
    else
        echo -e "${RED}✗ dist 目錄不存在${NC}"
    fi
else
    echo -e "${RED}✗ 構建失敗${NC}"
fi
echo ""

# 檢查環境變量文件
echo "5. 檢查環境變量..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓ .env.local 存在${NC}"
    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓ VITE_SUPABASE_URL 已配置${NC}"
    else
        echo -e "${YELLOW}⚠ VITE_SUPABASE_URL 未配置${NC}"
    fi
else
    echo -e "${YELLOW}⚠ .env.local 不存在（如果不需要 Supabase 可以忽略）${NC}"
fi
echo ""

# 檢查依賴
echo "6. 檢查依賴..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules 存在${NC}"
else
    echo -e "${RED}✗ node_modules 不存在，請執行: npm install${NC}"
fi
echo ""

echo "=========================================="
echo "      測試完成"
echo "=========================================="
echo ""
echo "如果所有檢查都通過，請在瀏覽器中訪問:"
echo -e "${GREEN}http://localhost:5173${NC}"
echo ""
echo "測試以下功能:"
echo "  1. 首頁商品展示"
echo "  2. 商品詳情頁面"
echo "  3. 購物車功能（添加、移除、更新數量）"
echo "  4. 結帳流程"
echo "  5. 真偽驗證功能"
echo "  6. 聯絡我們表單"
echo "  7. 導航菜單"
echo ""
