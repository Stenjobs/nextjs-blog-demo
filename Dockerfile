# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npm run build

# 生产环境镜像
FROM node:18-alpine

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 只安装生产依赖
RUN npm ci --only=production

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8866

# 暴露端口
EXPOSE 8866

# 启动命令
CMD ["npm", "start"] 