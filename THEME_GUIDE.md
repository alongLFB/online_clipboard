# 主题配置指南

## 概述

本项目支持 Light/Dark 双主题模式，并且可以通过修改配置文件轻松自定义颜色。

## 主题切换

页面右上角有主题切换按钮，点击可在浅色和深色主题之间切换。

## 自定义颜色

### 方法一：修改 theme.config.json（推荐）

最简单的方式是直接修改 `theme.config.json` 文件。该文件包含了所有主题颜色的配置：

```json
{
  "themes": {
    "light": {
      "colors": {
        "background": {
          "primary": "#ffffff",    // 主背景色
          "secondary": "#f9fafb",   // 次要背景色
          "tertiary": "#f3f4f6"     // 第三背景色
        },
        "foreground": {
          "primary": "#111827",     // 主文字颜色
          "secondary": "#4b5563",   // 次要文字颜色
          "tertiary": "#6b7280",    // 第三文字颜色
          "muted": "#9ca3af"        // 弱化文字颜色
        },
        // ... 其他配置
      }
    },
    "dark": {
      // 深色主题配置
    }
  }
}
```

### 方法二：修改 lib/theme.ts

如果需要更灵活的配置，可以直接修改 `lib/theme.ts` 文件。

### 方法三：修改 CSS 变量

在 `app/globals.css` 中直接修改 CSS 变量：

```css
:root {
  --background: #ffffff;
  --foreground: #111827;
  /* ... 其他变量 */
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  /* ... 其他变量 */
}
```

## 颜色变量说明

### 背景色 (background)
- `primary`: 页面主背景色
- `secondary`: 卡片、输入框等组件的背景色
- `tertiary`: 悬停状态的背景色

### 前景色 (foreground)
- `primary`: 主要文字颜色
- `secondary`: 次要说明文字
- `tertiary`: 时间戳、计数等辅助信息
- `muted`: 占位符等弱化文字

### 边框色 (border)
- `default`: 默认边框颜色
- `subtle`: 细微边框颜色

### 按钮色 (button)
- `primary`: 主按钮样式
- `secondary`: 次要按钮样式
- `ghost`: 幽灵按钮样式

### 输入框 (input)
- `bg`: 输入框背景色
- `border`: 输入框边框色
- `placeholder`: 占位符颜色
- `focus`: 聚焦时的边框色

### 卡片 (card)
- `bg`: 卡片背景色
- `border`: 卡片边框色

### 状态色 (status)
- `success`: 成功状态颜色
- `error`: 错误状态颜色
- `warning`: 警告状态颜色
- `info`: 信息状态颜色

## 配色建议

### 深色主题优化建议

为了提高深色主题的可读性，建议：

1. **背景色对比度**：确保不同层级的背景色有足够的对比度
   - primary: `#0f172a` (最深)
   - secondary: `#1e293b` (中等)
   - tertiary: `#334155` (最浅)

2. **文字颜色**：使用高对比度的文字颜色
   - primary: `#f8fafc` (几乎白色)
   - secondary: `#e2e8f0` (浅灰色)
   - tertiary: `#cbd5e1` (中灰色)

3. **边框颜色**：使用较浅的边框色以增加元素分隔
   - default: `#334155`
   - subtle: `#1e293b`

4. **按钮颜色**：深色主题下主按钮可使用蓝色系
   - primary bg: `#3b82f6` (亮蓝色)
   - primary hover: `#2563eb` (深蓝色)

## 应用修改

修改配置文件后，刷新页面即可看到效果。如果修改了 TypeScript 文件，需要重启开发服务器：

```bash
npm run dev
```