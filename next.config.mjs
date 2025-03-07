/** @type {import('next').NextConfig} */
const nextConfig = {
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
