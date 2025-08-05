# 技术栈选型

## 前端技术栈

### 核心框架
- **Next.js 14+** (App Router)
  - 服务端渲染支持
  - API Routes 处理后端逻辑
  - 优秀的性能优化
  - 与 Cloudflare 兼容性好

### UI 框架
- **shadcn/ui**
  - 基于 Radix UI 和 Tailwind CSS
  - 可定制的组件库
  - 轻量级，按需引入

### 其他前端依赖
- **qrcode** - 二维码生成
- **nanoid** - 短链接ID生成
- **date-fns** - 时间处理
- **react-hot-toast** - 通知提示

## 后端/数据存储方案

### 推荐方案：Cloudflare Workers + KV Storage

**优势：**
- **Cloudflare Workers**：边缘计算，全球分布，低延迟
- **Cloudflare KV**：键值存储，支持TTL（自动过期）
- **无服务器架构**：按需计费，自动扩展
- **原生支持过期时间**：KV 支持设置 TTL，自动删除过期数据

**架构设计：**
```
用户 -> Cloudflare CDN -> Next.js (部署在 Cloudflare Pages) 
                       -> API Routes -> Cloudflare Workers
                                     -> Cloudflare KV Storage
```

### 备选方案：Cloudflare D1 (SQLite)

如果需要更复杂的查询能力，可以使用 Cloudflare D1：
- 完全托管的 SQLite 数据库
- 支持 SQL 查询
- 需要自行实现过期清理逻辑

## 部署架构

### Cloudflare 服务配置
1. **Cloudflare Pages** - 托管 Next.js 应用
2. **Cloudflare Workers** - 处理 API 请求
3. **Cloudflare KV** - 存储剪贴板数据
4. **Cloudflare R2** (可选) - 未来存储文件/图片

### 环境变量配置
```env
# Cloudflare KV
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_KV_NAMESPACE_ID=your_kv_namespace_id
CLOUDFLARE_API_TOKEN=your_api_token

# 应用配置
NEXT_PUBLIC_BASE_URL=https://your-domain.com
CONTENT_EXPIRY_MINUTES=15
```

## 数据结构设计

### KV 存储结构
```typescript
// Key: 短链接ID (6-8位字符)
// Value: ClipboardContent
interface ClipboardContent {
  id: string;           // 短链接ID
  content: string;      // 剪贴板内容
  createdAt: number;    // 创建时间戳
  expiresAt: number;    // 过期时间戳
  views?: number;       // 访问次数（可选）
}
```

### API 端点设计
- `POST /api/clipboard` - 创建新的剪贴板
- `GET /api/clipboard/[id]` - 获取剪贴板内容
- `GET /[id]` - 短链接重定向页面

## 开发工具
- **TypeScript** - 类型安全
- **ESLint** - 代码规范
- **Prettier** - 代码格式化
- **Wrangler** - Cloudflare CLI 工具