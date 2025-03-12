'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Header.scss';
import { getBlogListApi } from '@/app/api';
import debounce from 'lodash/debounce';  // 需要安装 lodash
import LoginModal from './login';
import RegisterModal from './register';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/userSlice';
import { toast } from 'react-toastify';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    
    // 从 Redux 获取用户信息
    const { userInfo, isLoggedIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
    
    // 处理退出登录
    const handleLogout = () => {
      dispatch(logout());
      toast.success('已退出登录');
    };

    // 使用 useCallback 包装防抖函数，避免重复创建
    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
            setShowResults(query.length > 0);
            // 这里可以添加实际的搜索API调用
        }, 300),  // 300ms 延迟
        []
    );

    // 清理防抖函数
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        // 立即更新输入框的值，保持输入响应
        e.target.value = query;
        // 使用防抖处理实际搜索
        debouncedSearch(query);
    };

    const getSearchResults = async () => {
        const res = await getBlogListApi({
            keyword: searchQuery
        });
        console.log(res,'res---');
        res.data.list && setSearchResults(res.data.list);
    }

    // 点击外部关闭弹窗
    const handleClickOutside = (e) => {
        if (!e.target.closest('.search-container')) {
            setShowResults(false);
        }
    };

    const handleFocus = () => {
        // 当输入框有内容时，聚焦时显示搜索结果
        if (searchQuery.trim()) {
            setShowResults(true);
        }
    };
    
    useEffect(() => {
        getSearchResults();
    }, [searchQuery]);

    // 点击外部关闭弹窗
    useEffect(() => {
        // 添加全局点击事件监听
        document.addEventListener('click', handleClickOutside);
        
        // 清理函数，组件卸载时移除监听器
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
                {/* 调整 Logo 大小和样式，固定尺寸防止加载时变化 */}
                <Link href="/" className="flex-shrink-0 mr-3">
                    <div className="w-20 h-10 relative" style={{ minWidth: '80px', minHeight: '40px' }}>
                        <Image 
                            src="/images/logo.png" 
                            alt="Logo" 
                            fill
                            priority
                            className="object-contain mix-blend-multiply"
                        />
                    </div>
                </Link>
                
                <div>
                    <h1 className="text-2xl font-semibold">
                        Welcome, {isLoggedIn ? (userInfo.nickname || userInfo.username) : '请登录~'}
                    </h1>
                    <p className="text-sm text-gray-500">What shall we do today?</p>
                </div>
                <nav className="nav flex items-center gap-6 ml-6">
                    <Link href="/" className="text-gray-600 hover:text-[#a0e3e6] transition-colors duration-200">首页</Link>
                    <Link href="/thoughts" className="text-gray-600 hover:text-[#a0e3e6] transition-colors duration-200">闪念</Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative search-container">
                    <input
                        type="search"
                        placeholder="Search"
                        onChange={handleSearchChange}
                        onFocus={handleFocus}
                        className="pl-10 pr-4 py-2 rounded-full bg-gray-200/70 w-64 focus:w-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <svg
                        className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    
                    {/* 搜索结果弹窗 */}
                    {showResults && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
                            {searchResults
                                .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map(result => (
                                    <Link 
                                        href={`/blog/${result._id}`} 
                                        key={result.id}
                                        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {result.title}
                                    </Link>
                                ))
                            }
                            {searchResults.filter(item => 
                                item.title.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                                <div className="px-4 py-6 text-center">
                                    <div className="text-gray-400 text-sm">
                                        <svg 
                                            className="w-5 h-5 mx-auto mb-2" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" 
                                            />
                                        </svg>
                                        <span>未找到 "{searchQuery}" 相关结果</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 创作按钮 */}
                {isLoggedIn && (
                    <div className="relative group">
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 active:scale-95 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            创作
                        </button>
                        
                        {/* 添加一个不可见的连接区域 */}
                        <div className="absolute h-2 w-full top-full"></div>
                        
                        {/* 创作菜单 */}
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <Link href="/creator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                写文章
                            </Link>
                            <Link href="/thoughts/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                发闪念
                            </Link>
                        </div>
                    </div>
                )}

                {/* 登录和注册按钮 */}
                {!isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-4 py-2 rounded-full bg-gray-200/70 hover:bg-gray-300 transition-colors duration-200 ease-in-out active:scale-95 text-sm"
                        >
                            登录
                        </button>
                        <button 
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 active:scale-95 text-sm"
                        >
                            注册
                        </button>
                    </div>
                ) : (
                    <div className="relative group">
                        <button className="p-2 rounded-full bg-gray-200/70 hover:bg-gray-300 transition-colors duration-200 ease-in-out active:scale-95">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>
                        
                        {/* 添加一个不可见的连接区域 */}
                        <div className="absolute h-2 w-full top-full"></div>
                        
                        {/* 用户菜单 */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                个人资料
                            </Link>
                            <Link href="/myBlogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                我的文章
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                退出登录
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* 登录弹窗 */}
            <LoginModal 
                isOpen={isLoginModalOpen} 
                onClose={() => setIsLoginModalOpen(false)} 
                openRegister={()=>setIsRegisterModalOpen(true)}
            />
            
            {/* 注册弹窗 */}
            <RegisterModal 
                isOpen={isRegisterModalOpen} 
                onClose={() => setIsRegisterModalOpen(false)} 
                openLogin={()=>setIsLoginModalOpen(true)}
            />
        </div>
    );
}