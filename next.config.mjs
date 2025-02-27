/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://8.134.205.132:6677/api/:path*' // 替换为你的后端服务器地址
      }
    ]
  },
  
  // 其他配置选项
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 如果需要配置其他选项，例如：
  images: {
    domains: ['8.134.205.132'],
  }
};

export default nextConfig;
