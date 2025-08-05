# 在线剪贴板

一个简洁高效的在线剪贴板工具，可以快速在不同设备间传输文本内容。

## 功能特点

- 🚀 **快速分享**：粘贴内容即可生成短链接和二维码
- 📱 **跨设备**：通过扫码或短链接在手机上快速访问
- 🔒 **隐私保护**：内容 15 分钟后自动删除
- 🆓 **无需登录**：匿名使用，无需注册
- 🔗 **短链接**：6-8 位字符的易记短链接

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI 组件**：自定义组件 + Tailwind CSS
- **部署平台**：Cloudflare Pages + Workers
- **数据存储**：Cloudflare KV
- **其他**：TypeScript, qrcode, nanoid

## 本地开发

### 1. 克隆项目

```bash
git clone <repository-url>
cd online-clipboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 部署到 Cloudflare

### 1. 创建 Cloudflare KV 命名空间

```bash
wrangler kv namespace create "CLIPBOARD_KV"
```

### 2. 更新 wrangler.toml

将生成的 KV namespace ID 填入 `wrangler.toml` 文件的 `id` 字段。

### 3. 构建项目

```bash
npm run pages:build
```

### 4. 部署应用

```bash
npm run pages:deploy
# 或者使用部署脚本
./deploy.sh
```

### 5. 配置环境变量

在 Cloudflare Dashboard 中设置以下环境变量：

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_KV_NAMESPACE_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_BASE_URL`

## 使用说明

1. **创建剪贴板**：

   - 在首页文本框中粘贴内容
   - 点击"生成短链接"按钮
   - 获取短链接和二维码

2. **访问内容**：

   - 通过短链接直接访问
   - 扫描二维码访问
   - 点击"复制内容"按钮复制到剪贴板

3. **注意事项**：
   - 内容会在 15 分钟后自动删除
   - 请勿分享敏感信息
   - 单个内容最大支持 1MB

## 项目结构

```
online-clipboard/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── [id]/              # 动态路由页面
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── clipboard/         # 剪贴板相关组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI 基础组件
├── lib/                   # 工具库
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
└── docs/                  # 文档
```

## 开发指南

### 添加新功能

1. 在 `types/` 中定义相关类型
2. 在 `lib/` 中实现业务逻辑
3. 在 `components/` 中创建 UI 组件
4. 在 `app/api/` 中创建 API 端点

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

## License

MIT
