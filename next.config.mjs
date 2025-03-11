/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加基础路径配置
  // basePath: '/nextClient', // 表示在这个路径下去运行的项目。因为服务器上的nginx配置了/nextClient就是访问这个项目，所以需要配置这个
  
  // 配置代理
  async rewrites() {
    const destination = process.env.NEXT_PUBLIC_BASE_URL?process.env.NEXT_PUBLIC_BASE_URL+'/api/:path*': 'http://8.134.205.132:6677/api/:path*'
    return [
      {
        source: '/api/:path*',
        destination: destination
      }
    ]
  },
  
  // 其他配置选项
  reactStrictMode: true,
  poweredByHeader: false,
  
  // 修复 images.domains 配置
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '8.134.205.132',
        port: '6677',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
 