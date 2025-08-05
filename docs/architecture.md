# 系统架构设计

## 整体架构图

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   用户浏览器     │────▶│  Cloudflare CDN │────▶│ Cloudflare Pages│
│                 │     │                 │     │   (Next.js)     │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │                 │
                                                 │  API Routes     │
                                                 │                 │
                                                 └────────┬────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │                 │
                                                 │Cloudflare Workers│
                                                 │                 │
                                                 └────────┬────────┘
                                                          │
                                                          ▼
                                                 ┌─────────────────┐
                                                 │                 │
                                                 │ Cloudflare KV   │
                                                 │   Storage       │
                                                 └─────────────────┘
```

## 核心流程设计

### 1. 创建剪贴板流程

```
用户粘贴内容 -> 前端验证 -> API: POST /api/clipboard
                              |
                              ▼
                         生成短链接ID (6-8位)
                              |
                              ▼
                    存储到 KV (设置15分钟TTL)
                              |
                              ▼
                    返回短链接和二维码数据
```

### 2. 访问剪贴板流程

```
用户访问短链接 -> Next.js 路由 /[id] -> API: GET /api/clipboard/[id]
                                          |
                                          ▼
                                   从 KV 获取内容
                                          |
                                          ▼
                                  渲染内容展示页面
```

## 数据模型详细设计

### 剪贴板内容模型

```typescript
// types/clipboard.ts
export interface ClipboardContent {
  id: string;              // 短链接ID，6-8位字符
  content: string;         // 剪贴板内容
  createdAt: number;       // 创建时间戳
  expiresAt: number;       // 过期时间戳
  contentType?: string;    // 内容类型（text/url/code等）
  views?: number;          // 访问次数
}

export interface CreateClipboardRequest {
  content: string;
  contentType?: string;
}

export interface CreateClipboardResponse {
  id: string;
  shortUrl: string;
  qrCodeData: string;      // Base64 编码的二维码图片
  expiresAt: number;
}
```

### 短链接ID生成策略

```typescript
// utils/shortId.ts
import { customAlphabet } from 'nanoid';

// 使用安全的字符集，避免混淆
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);

export function generateShortId(): string {
  return nanoid();
}
```

## API 设计

### 1. 创建剪贴板 API

**端点**: `POST /api/clipboard`

**请求体**:
```json
{
  "content": "要分享的内容",
  "contentType": "text"
}
```

**响应**:
```json
{
  "id": "aBc123Xy",
  "shortUrl": "https://domain.com/aBc123Xy",
  "qrCodeData": "data:image/png;base64,...",
  "expiresAt": 1704355200000
}
```

### 2. 获取剪贴板内容 API

**端点**: `GET /api/clipboard/[id]`

**响应**:
```json
{
  "id": "aBc123Xy",
  "content": "分享的内容",
  "contentType": "text",
  "createdAt": 1704354300000,
  "expiresAt": 1704355200000,
  "views": 5
}
```

**错误响应**:
```json
{
  "error": "Content not found or expired",
  "code": "NOT_FOUND"
}
```

## 页面路由设计

### 页面结构

```
/                   # 首页 - 创建剪贴板
/[id]              # 查看剪贴板内容
/api/clipboard     # 创建剪贴板 API
/api/clipboard/[id] # 获取剪贴板内容 API
```

### 组件结构

```
components/
├── clipboard/
│   ├── ClipboardForm.tsx      # 创建剪贴板表单
│   ├── ClipboardView.tsx      # 查看剪贴板内容
│   └── QRCodeDisplay.tsx      # 二维码显示组件
├── ui/                        # shadcn/ui 组件
│   ├── button.tsx
│   ├── input.tsx
│   ├── textarea.tsx
│   └── toast.tsx
└── layout/
    ├── Header.tsx
    └── Footer.tsx
```

## 安全设计

### 1. 输入验证
- 限制内容大小（最大 1MB）
- XSS 防护：对用户输入进行转义
- 内容类型检查

### 2. 访问控制
- 短链接使用足够长度（8位）防止暴力枚举
- 限制 API 请求频率
- CORS 配置

### 3. 数据安全
- HTTPS 加密传输
- 自动过期删除敏感数据
- 不记录用户 IP 等隐私信息

## 性能优化

### 1. 缓存策略
- 静态资源使用 CDN 缓存
- API 响应设置合理的缓存头
- 使用 SWR 进行客户端数据缓存

### 2. 加载优化
- 代码分割和懒加载
- 图片优化（二维码按需生成）
- 使用 Next.js 的 ISR/SSG 特性

### 3. 边缘计算
- 利用 Cloudflare Workers 的全球节点
- 就近访问，减少延迟