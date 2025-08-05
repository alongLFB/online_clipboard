# 部署指南

本文档详细说明如何将在线剪贴板应用部署到 Cloudflare。

## 前置要求

1. Cloudflare 账户
2. 安装 Wrangler CLI：`npm install -g wrangler`
3. Node.js 18+ 和 npm

## 步骤详解

### 1. 准备 Cloudflare 账户

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 记录你的 Account ID（在右侧栏可以找到）

### 2. 创建 API Token

1. 访问 [API Tokens 页面](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 "Create Token"
3. 使用 "Edit Cloudflare Workers" 模板
4. 设置权限：
   - Account: Cloudflare Workers Scripts:Edit
   - Account: Workers KV Storage:Edit
   - Zone: Page Rules:Edit (如果需要自定义域名)

### 3. 创建 KV 命名空间

```bash
# 登录 Cloudflare
wrangler login

# 创建生产环境 KV
wrangler kv:namespace create "CLIPBOARD_KV"

# 创建预览环境 KV（可选）
wrangler kv:namespace create "CLIPBOARD_KV" --preview
```

记录输出的 namespace ID。

### 4. 配置项目

1. 更新 `wrangler.toml`：
```toml
name = "online-clipboard"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "CLIPBOARD_KV"
id = "你的_KV_NAMESPACE_ID"
```

2. 创建 `.env.production` 文件：
```env
CLOUDFLARE_ACCOUNT_ID=你的账户ID
CLOUDFLARE_KV_NAMESPACE_ID=你的KV命名空间ID
CLOUDFLARE_API_TOKEN=你的API令牌
NEXT_PUBLIC_BASE_URL=https://你的域名.com
CONTENT_EXPIRY_MINUTES=15
```

### 5. 构建和部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy .next --project-name=online-clipboard
```

### 6. 配置自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中
2. 点击 "Custom domains"
3. 添加你的域名
4. 按照提示配置 DNS

### 7. 设置环境变量

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. 设置 -> 环境变量
3. 添加生产环境变量

## 故障排除

### KV 存储无法访问

确保：
- KV namespace ID 正确
- API Token 有正确的权限
- binding 名称匹配（CLIPBOARD_KV）

### 部署失败

检查：
- Node.js 版本是否兼容
- 构建输出是否在 `.next` 目录
- wrangler.toml 配置是否正确

### 自定义域名不工作

验证：
- DNS 记录正确指向 Cloudflare Pages
- SSL 证书已激活
- 域名在 Cloudflare 管理

## 监控和维护

### 查看日志

```bash
wrangler tail --project-name=online-clipboard
```

### 查看 KV 存储

```bash
# 列出所有键
wrangler kv:key list --namespace-id=你的_NAMESPACE_ID

# 查看特定内容
wrangler kv:key get "键名" --namespace-id=你的_NAMESPACE_ID
```

### 更新部署

每次代码更新后：
```bash
npm run build
npx wrangler pages deploy .next --project-name=online-clipboard
```

## 性能优化建议

1. **启用缓存**：在 Cloudflare 设置中配置页面规则
2. **压缩资源**：确保启用 Brotli 压缩
3. **使用 CDN**：静态资源自动通过 Cloudflare CDN 分发

## 安全建议

1. **限制 API 访问**：配置速率限制规则
2. **监控使用情况**：定期查看 KV 存储使用量
3. **备份重要数据**：虽然是临时数据，但建议监控异常

## 费用说明

Cloudflare 免费计划包含：
- 100,000 次/天 Workers 请求
- 1GB KV 存储空间
- 10万次/天 KV 读取

对于小型使用场景完全足够。