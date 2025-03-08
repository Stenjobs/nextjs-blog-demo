/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加基础路径配置
  basePath: '/nextClient', // 表示在这个路径下去运行的项目。因为服务器上的nginx配置了/nextClient就是访问这个项目，所以需要配置这个
  
  // 配置代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_BASE_URL || 'http://8.134.205.132:6677/api/:path*'
      }
    ]
  },
  
  // 其他配置选项
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 修复 images.domains 配置
  images: {
    domains: [
      // 从环境变量中提取域名，如果不存在则使用默认值
      process.env.NEXT_PUBLIC_BASE_URL || '8.134.205.132'
    ],
  }
};

export default nextConfig;
