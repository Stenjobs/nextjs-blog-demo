/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置代理
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://8.134.205.132:6677/api/:path*' // 替换为你的后端服务器地址
        // destination: 'http://localhost:3000/api/:path*' // 替换为你的后端服务器地址
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*'
      }
    ]
  },
  
  // 其他配置选项
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 如果需要配置其他选项，例如：
  images: {
    // domains: ['8.134.205.132'],
    domains: [process.env.NEXT_PUBLIC_BASE_URL],
  }
  ,
  // // 配置静态文件导出
  // output: 'export',
  // // 静态导出时禁用图片优化
  // images: {
  //   ...nextConfig.images,
  //   unoptimized: true
  // },
  // // 禁用 i18n
  // i18n: null
};

export default nextConfig;
