#!/bin/bash

# Cloudflare Pages 部署脚本

echo "🚀 开始部署到 Cloudflare Pages..."

# 1. 构建项目
echo "📦 构建项目..."
npm run pages:build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 2. 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
wrangler pages deploy .vercel/output/static --project-name=online-clipboard

if [ $? -eq 0 ]; then
    echo "🎉 部署成功！"
    echo "🔗 你的应用已经部署到 Cloudflare Pages"
else
    echo "❌ 部署失败"
    exit 1
fi
