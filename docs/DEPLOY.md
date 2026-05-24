# 部署文档

> 待补充 — 上线前完善

## 环境要求

- Node.js >= 18
- 服务器：Linux (Ubuntu 20.04+)

## 后端部署

```bash
cd server
npm ci
cp .env.example .env
# 编辑 .env 配置
npm run init-db
npm start  # 或用 pm2: pm2 start src/app.js --name flash-ask-server
```

## 后台管理部署

```bash
cd admin
npm ci
npm run build
# 将 dist/ 目录部署到 Nginx
```

## Nginx 配置参考

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后台管理
    location /admin/ {
        root /var/www/admin;
        try_files $uri $uri/ /admin/index.html;
    }

    # App H5
    location / {
        root /var/www/client;
        try_files $uri $uri/ /index.html;
    }
}
```
