# FastCompanyAI Frontend

AI 代码生成平台前端，基于 Next.js 14 + Tailwind CSS + Framer Motion。

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 地址，如 `https://your-api.com` |

## Vercel 部署

1. 将本仓库导入 Vercel
2. 在项目设置中添加环境变量：`NEXT_PUBLIC_API_BASE_URL` = 你的后端 API 地址
3. 部署即可

**注意**：前端需配合后端 API 使用，请确保后端已部署并可公网访问。
