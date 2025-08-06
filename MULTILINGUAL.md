# 多语言配置说明

这个项目现在支持中文和英文两种语言。

## 功能特性

- ✅ 支持中文(zh)和英文(en)
- ✅ URL 路径包含语言代码 (`/zh` 或 `/en`)
- ✅ 用户可以在 Header 中切换语言
- ✅ 所有 UI 文案都已翻译
- ✅ 自动重定向到默认语言(中文)

## 文件结构

```
app/
├── [locale]/           # 语言路由
│   ├── layout.tsx      # 语言特定的布局
│   ├── page.tsx        # 首页
│   └── [id]/
│       └── page.tsx    # 动态页面
├── layout.tsx          # 根布局
└── page.tsx            # 重定向页面

messages/
├── zh.json             # 中文翻译
└── en.json             # 英文翻译

middleware.ts           # 路由中间件
i18n.ts                 # 国际化配置
```

## 使用方法

1. 访问 `http://localhost:3000` 会自动重定向到 `/zh`
2. 可以直接访问 `/zh` 或 `/en` 来使用不同语言
3. 在页面头部可以点击 "中文" 或 "EN" 切换语言
4. 所有创建的剪贴板链接都会保持当前语言

## 添加新语言

1. 在 `messages/` 目录添加新的语言文件 (如 `ja.json`)
2. 在 `i18n.ts` 中添加新语言到 `locales` 数组
3. 更新 `middleware.ts` 中的路径匹配规则
4. 在 Header 组件中添加新语言的切换按钮

## 技术栈

- Next.js 14 with App Router
- next-intl 用于国际化
- TypeScript
- Tailwind CSS
