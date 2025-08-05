# PM2 部署指南

## 系统要求

- Node.js 18.17 或更高版本
- PM2 (进程管理器)
- Git

## 部署步骤

### 1. 安装 PM2

```bash
npm install -g pm2
```

### 2. 克隆项目

```bash
git clone <your-repo-url>
cd online_clipboard
```

### 3. 安装依赖

```bash
npm install
```

### 4. 配置环境变量

创建 `.env.local` 文件：

```bash
# Application Configuration
NEXT_PUBLIC_BASE_URL=http://your-domain.com
CONTENT_EXPIRY_MINUTES=15

# 如果使用 Cloudflare KV (可选)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_KV_NAMESPACE_ID=your_namespace_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### 5. 构建项目

```bash
npm run build
```

### 6. 启动应用

```bash
npm run pm2:start
```

## PM2 管理命令

```bash
# 启动应用
npm run pm2:start

# 停止应用
npm run pm2:stop

# 重启应用
npm run pm2:restart

# 查看日志
npm run pm2:logs

# 查看应用状态
pm2 status

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

## 配置选项

修改 `ecosystem.config.js` 来调整配置：

```javascript
module.exports = {
  apps: [
    {
      name: "online-clipboard",
      script: "npm",
      args: "start",
      instances: 1, // 实例数量
      autorestart: true, // 自动重启
      watch: false, // 文件监控
      max_memory_restart: "1G", // 内存限制
      env: {
        NODE_ENV: "production",
        PORT: 3000, // 端口号
      },
    },
  ],
};
```

## Nginx 反向代理配置 (可选)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 监控和日志

- PM2 监控: `pm2 monit`
- 实时日志: `pm2 logs online-clipboard --lines 100`
- 错误日志: `pm2 logs online-clipboard --err`

## 故障排除

1. **端口被占用**: 修改 `ecosystem.config.js` 中的端口号
2. **内存不足**: 增加 `max_memory_restart` 值
3. **构建失败**: 检查 Node.js 版本是否符合要求
4. **权限问题**: 确保用户有读写项目目录的权限
