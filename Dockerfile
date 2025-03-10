# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 设置构建时环境变量
ENV NEXT_PUBLIC_BASE_URL=http://8.134.205.132:6677
ENV NEXT_PUBLIC_API_URL=http://8.134.205.132:6677

# 使用缓存层优化依赖安装
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 复制所有源文件
COPY . .

# 构建应用
RUN npm run build
RUN echo "CSS 文件内容:" && cat .next/static/css/*.css

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
ENV NEXT_PUBLIC_BASE_URL=http://8.134.205.132:6677
ENV NEXT_PUBLIC_API_URL=http://8.134.205.132:6677

# 暴露端口
EXPOSE 8866

# 启动命令
CMD ["npm", "start"] 