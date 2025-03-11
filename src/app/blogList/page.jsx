'use client'

import React, { useState, useEffect } from 'react';
import { getBlogListApi } from '@/app/api';
import Header from '../components/Header';
import Link from 'next/link';
import { formatDateTime } from '@/utils';
import DOMPurify from 'dompurify';
import 'animate.css';

export default function BlogList() {
  // 状态管理
  const [blogList, setBlogList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    author: '',
    keyword: '',
    sort: 'new' // 默认最新
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // 获取博客列表数据
  const fetchBlogList = async () => {
    setLoading(true);
    try {
      const res = await getBlogListApi({
        page: pagination.page,
        pageSize: pagination.pageSize,
        author: filters.author,
        keyword: filters.keyword,
        mode: filters.sort
      });
      
      setBlogList(res.data.list || []);
      setPagination(prev => ({
        ...prev,
        total: res.data.total || 0
      }));
    } catch (error) {
      console.error('获取博客列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 监听筛选条件和分页变化
  useEffect(() => {
    fetchBlogList();
  }, [pagination.page, pagination.pageSize, filters.sort]);

  // 处理筛选表单提交
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // 重置到第一页
    fetchBlogList();
  };

  // 处理筛选条件变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 处理分页变化
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // 处理每页条数变化
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  // 截取内容摘要
  const getContentSummary = (content) => {
    if (!content) return '';
    
    // 创建一个临时的 div 元素来解析 HTML 内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // 获取纯文本内容（这会自动解析 HTML 实体如 &nbsp;）
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // 截取前100个字符
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  // 生成分页按钮
  const renderPagination = () => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const pageButtons = [];
    
    // 添加上一页按钮
    pageButtons.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
        disabled={pagination.page === 1}
        className={`px-2 py-1 rounded-md text-xs ${pagination.page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
      >
        上一页
      </button>
    );
    
    // 添加页码按钮
    for (let i = 1; i <= totalPages; i++) {
      // 只显示当前页附近的页码
      if (
        i === 1 || 
        i === totalPages || 
        (i >= pagination.page - 2 && i <= pagination.page + 2)
      ) {
        pageButtons.push(
          <button 
            key={i} 
            onClick={() => handlePageChange(i)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${pagination.page === i ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'}`}
          >
            {i}
          </button>
        );
      } else if (
        (i === pagination.page - 3 && pagination.page > 3) || 
        (i === pagination.page + 3 && pagination.page < totalPages - 2)
      ) {
        // 添加省略号
        pageButtons.push(<span key={`ellipsis-${i}`} className="px-1 text-xs">...</span>);
      }
    }
    
    // 添加下一页按钮
    pageButtons.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
        disabled={pagination.page === totalPages || totalPages === 0}
        className={`px-2 py-1 rounded-md text-xs ${pagination.page === totalPages || totalPages === 0 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
      >
        下一页
      </button>
    );
    
    return pageButtons;
  };

  return (
    <main className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 min-w-[1080px] min-h-screen">
      <Header />
      
      <div className="max-w-5xl mx-auto mt-6">
        <div className="backdrop-blur-xl bg-white/60 p-5 rounded-xl shadow-md border border-white/50 mb-4 transition-all duration-300 hover:shadow-blue-100/30">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block">
            探索精彩博客
          </h1>
          
          {/* 筛选表单 */}
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-4 gap-3 mb-6">
            <div className="col-span-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="author"
                  value={filters.author}
                  onChange={handleFilterChange}
                  placeholder="作者名称"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="搜索关键词"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="col-span-1 flex gap-2">
              <div className="w-1/2">
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full py-2 px-3 text-sm bg-white/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
                >
                  <option value="new">最新</option>
                  <option value="hot">最热</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-1/2 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                搜索
              </button>
            </div>
          </form>
          
          {/* 博客列表 */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="relative">
                <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                <div className="h-7 w-7 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin absolute top-1.5 left-1.5"></div>
              </div>
              <span className="text-gray-600 ml-3 text-sm">加载中...</span>
            </div>
          ) : blogList.length > 0 ? (
            <div className="space-y-4">
              {blogList.map((blog, index) => (
                <div 
                  key={blog._id || index} 
                  className="backdrop-blur-sm bg-white/30 p-4 rounded-lg border border-white/30 hover:border-blue-200 hover:shadow-md transition-all duration-300 animate__animated animate__fadeIn group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link href={`/blog/${blog._id}`}>
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.title) }} />
                    </h2>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span>{blog.author || '匿名'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>{formatDateTime(blog.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{blog.likes || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span>{blog.stars || 0}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                      <span>{blog.views || 0}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed line-clamp-2">
                    {getContentSummary(blog.content)}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {['前端', '技术', 'React'].map((tag, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link 
                      href={`/blog/${blog._id}`}
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors group-hover:translate-x-0.5 transform duration-200"
                    >
                      阅读全文
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-medium mb-2">暂无博客内容</p>
              <p className="text-gray-400 max-w-md mx-auto text-sm">尝试调整筛选条件或稍后再试，也许是时候写下你自己的第一篇博客了？</p>
              <Link href="/creator" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-sm hover:shadow-md">
                创建博客
              </Link>
            </div>
          )}
          
          {/* 分页控制 */}
          {!loading && blogList.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-2 mb-3 sm:mb-0 bg-white/50 p-1.5 rounded-lg">
                <span className="text-xs text-gray-600">每页:</span>
                <select
                  value={pagination.pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-gray-300 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                  {(pagination.page - 1) * pagination.pageSize + 1}-
                  {Math.min(pagination.page * pagination.pageSize, pagination.total)} 
                  {' '}/ {pagination.total}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 justify-center bg-white/50 p-1.5 rounded-lg shadow-sm">
                {renderPagination()}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:from-blue-600 hover:to-cyan-600 transition-colors transform hover:scale-110 duration-300"
        aria-label="返回顶部"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </main>
  );
}
