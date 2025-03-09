# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 使用缓存层优化依赖安装
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 只复制必要的文件进行构建-
COPY next.config.mjs jsconfig.json ./
COPY public ./public
COPY src ./src

# 构建应用
RUN npm run build

# 生产环境镜像
FROM node:18-alpine

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 只安装生产依赖
RUN npm ci --only=production --no-audit --no-fund

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8866

# 暴露端口
EXPOSE 8866

# 启动命令
CMD ["npm", "start"] 