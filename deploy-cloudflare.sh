#!/bin/bash

# Cloudflare Pages 自动化部署脚本
# 使用方法: ./deploy-cloudflare.sh [--production]

set -e

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_NAME="dajia"
OUTPUT_DIR="dist"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}   Cloudflare Pages 自动化部署${NC}"
echo -e "${BLUE}==========================================${NC}"
echo ""

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}✗ wrangler CLI 未安装${NC}"
    echo -e "${YELLOW}正在安装 wrangler...${NC}"
    npm install -g wrangler
fi

# 检查是否已登录
echo -e "${BLUE}检查 Cloudflare 登录状态...${NC}"
if wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✓ 已登录 Cloudflare${NC}"
    wrangler whoami
else
    echo -e "${YELLOW}⚠ 未检测到 Cloudflare 登录${NC}"
    echo -e "${BLUE}正在启动登录流程...${NC}"
    echo -e "${YELLOW}请按照浏览器提示完成登录${NC}"
    echo ""
    wrangler login
    echo ""
    # 验证登录
    if wrangler whoami &> /dev/null; then
        echo -e "${GREEN}✓ 登录成功${NC}"
    else
        echo -e "${RED}✗ 登录失败，请重试${NC}"
        exit 1
    fi
fi
echo ""

# 构建项目
echo -e "${BLUE}步骤 1: 构建项目...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi
echo ""

# 检查构建输出
if [ ! -d "$OUTPUT_DIR" ] || [ ! -f "$OUTPUT_DIR/index.html" ]; then
    echo -e "${RED}✗ 构建输出目录不存在或缺少 index.html${NC}"
    exit 1
fi

# 检查 _redirects 文件
if [ ! -f "$OUTPUT_DIR/_redirects" ]; then
    echo -e "${YELLOW}⚠ _redirects 文件不存在，正在复制...${NC}"
    if [ -f "public/_redirects" ]; then
        cp public/_redirects "$OUTPUT_DIR/_redirects"
        echo -e "${GREEN}✓ _redirects 文件已复制${NC}"
    else
        echo -e "${YELLOW}⚠ 创建默认 _redirects 文件${NC}"
        echo "/*    /index.html   200" > "$OUTPUT_DIR/_redirects"
    fi
fi
echo ""

# 部署到 Cloudflare Pages
echo -e "${BLUE}步骤 2: 部署到 Cloudflare Pages...${NC}"
echo -e "${YELLOW}项目名称: $PROJECT_NAME${NC}"
echo -e "${YELLOW}输出目录: $OUTPUT_DIR${NC}"
echo ""

if [ "$1" == "--production" ]; then
    echo -e "${BLUE}部署到生产环境...${NC}"
    wrangler pages deploy "$OUTPUT_DIR" --project-name="$PROJECT_NAME" --branch=main
else
    echo -e "${BLUE}部署预览版本...${NC}"
    wrangler pages deploy "$OUTPUT_DIR" --project-name="$PROJECT_NAME"
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}   部署完成！${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo -e "${BLUE}查看部署状态:${NC}"
echo "  wrangler pages deployment list --project-name=$PROJECT_NAME"
echo ""
echo -e "${BLUE}查看项目:${NC}"
echo "  https://dash.cloudflare.com/82ebeb1d91888e83e8e1b30eeb33d3c3/pages/view/$PROJECT_NAME"
echo ""
