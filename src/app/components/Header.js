'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
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

// 皮肤数据，实际项目中可能从API获取
const skinList = [
    {
        id: 999,
        name: "纯色1",
        thumbnailUrl: "/images/skins/skin0_thumb.jpg",
        backgroundUrl: "/images/skins/skin0_bg.jpg",
        className: "bg-gray-100"
    },
    {
        id: 1,
        name: "淡蓝",
        thumbnailUrl: "/images/skins/skin1_thumb.jpg",
        backgroundUrl: "/images/skins/skin1_bg.jpg"
    },
    {
        id: 2,
        name: "清新",
        thumbnailUrl: "/images/skins/skin2_thumb.jpg",
        backgroundUrl: "/images/skins/skin2_bg.jpg"
    },
    {
        id: 3,
        name: "跟随系统",
        thumbnailUrl: "/images/skins/skin3_thumb.jpg",
        backgroundUrl: "/images/skins/skin3_bg.jpg"
    },
    {
        id: 4,
        name: "蓝调",
        thumbnailUrl: "/images/skins/skin4_thumb.jpg",
        backgroundUrl: "/images/skins/skin4_bg.jpg"
    },
    {
        id: 5,
        name: "粉彩",
        thumbnailUrl: "/images/skins/skin5_thumb.jpg",
        backgroundUrl: "/images/skins/skin5_bg.jpg"
    },
    {
        id: 6,
        name: "山景",
        thumbnailUrl: "/images/skins/skin6_thumb.jpg",
        backgroundUrl: "/images/skins/skin6_bg.jpg"
    },
    {
        id: 7,
        name: "渐变蓝",
        thumbnailUrl: "/images/skins/skin7_thumb.jpg",
        backgroundUrl: "/images/skins/skin7_bg.jpg"
    },
    {
        id: 8,
        name: "阳光",
        thumbnailUrl: "/images/skins/skin8_thumb.jpg",
        backgroundUrl: "/images/skins/skin8_bg.jpg"
    },
    {
        id: 9,
        name: "绿意",
        thumbnailUrl: "/images/skins/skin9_thumb.jpg",
        backgroundUrl: "/images/skins/skin9_bg.jpg"
    },
    {
        id: 10,
        name: "星空",
        thumbnailUrl: "/images/skins/skin10_thumb.jpg",
        backgroundUrl: "/images/skins/skin10_bg.jpg"
    },
    {
        id: 11,
        name: "星空",
        thumbnailUrl: "/images/skins/skin11_thumb.jpg",
        backgroundUrl: "/images/skins/skin11_bg.jpg"
    },
    {
        id: 12,
        name: "星空",
        thumbnailUrl: "/images/skins/skin12_thumb.jpg",
        backgroundUrl: "/images/skins/skin12_bg.jpg"
    }
];

// 换肤下拉组件
function SkinDropdown({ isOpen, onClose }) {
    const [skins, setSkins] = useState([]);
    const [loadedSkins, setLoadedSkins] = useState({});
    const dropdownRef = useRef(null);

    // 初始化加载本地存储的皮肤数据
    useEffect(() => {
        // 从localStorage获取已下载的皮肤
        const storedSkins = localStorage.getItem('downloadedSkins');
        if (storedSkins) {
            setLoadedSkins(JSON.parse(storedSkins));
        }

        // 获取当前使用的皮肤
        const currentSkin = localStorage.getItem('currentSkin');
        if (currentSkin) {
            applyBackgroundImage(JSON.parse(currentSkin));
        }

        setSkins(skinList);
    }, []);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // 应用背景图片
    const applyBackgroundImage = (skin) => {
        // 先清除所有可能的类名和背景样式
        document.body.className = document.body.className
            .split(' ')
            .filter(cls => !cls.startsWith('bg-'))
            .join(' ');
        document.body.style.backgroundImage = '';
        
        if (skin.className) {
            document.body.classList.add(skin.className);
        } else {
            document.body.style.backgroundImage = `url(${skin.base64 || skin.backgroundUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
        }

        // 保存当前皮肤到localStorage
        localStorage.setItem('currentSkin', JSON.stringify(skin));
    };

    // 下载并应用皮肤
    const downloadAndApplySkin = async (skin) => {
        // 检查是否已经下载过
        if (loadedSkins[skin.id]) {
            applyBackgroundImage(loadedSkins[skin.id]);
            return;
        }

        try {
            // 获取图片并转换为base64
            const response = await fetch(skin.backgroundUrl);
            const blob = await response.blob();

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // 创建包含base64数据的皮肤对象
                    const skinWithBase64 = {
                        ...skin,
                        base64: reader.result
                    };

                    // 更新已下载皮肤
                    const updatedLoadedSkins = {
                        ...loadedSkins,
                        [skin.id]: skinWithBase64
                    };

                    setLoadedSkins(updatedLoadedSkins);

                    // 保存到localStorage
                    localStorage.setItem('downloadedSkins', JSON.stringify(updatedLoadedSkins));

                    // 应用背景
                    applyBackgroundImage(skinWithBase64);

                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('下载皮肤失败:', error);
            toast.error('下载皮肤失败，请稍后重试');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-72 backdrop-blur-xl bg-white/10 rounded-xl shadow-lg border border-white/40 z-50 animate__animated animate__fadeIn animate__faster"
            style={{ '--animate-duration': '0.2s' }}
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-medium text-gray-800">换肤</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-xs text-gray-500 mb-3">纯色壁纸</p>

                {/* 皮肤网格 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    {skins.filter(skin => skin.className).map(skin => (
                        <div
                            key={skin.id}
                            className="relative rounded-md overflow-hidden cursor-pointer group"
                            onClick={() => downloadAndApplySkin(skin)}
                        >
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                <Image
                                    src={skin.thumbnailUrl}
                                    alt={skin.name}
                                    width={100}
                                    height={56}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* 未下载标识 */}
                            {!loadedSkins[skin.id] && (
                                <div className="absolute top-1 right-1 bg-white/70 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-0.5 px-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {skin.name}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-xs text-gray-500 mb-2">图片壁纸</div>

                {/* 更多皮肤网格 */}
                <div className="grid grid-cols-3 gap-2">
                    {skins.filter(skin => !skin.className).map(skin => (
                        <div
                            key={skin.id}
                            className="relative rounded-md overflow-hidden cursor-pointer group"
                            onClick={() => downloadAndApplySkin(skin)}
                        >
                            <div className="aspect-w-16 aspect-h-9 w-full">
                                <Image
                                    src={skin.thumbnailUrl}
                                    alt={skin.name}
                                    width={100}
                                    height={56}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* 未下载标识 */}
                            {!loadedSkins[skin.id] && (
                                <div className="absolute top-1 right-1 bg-white/70 rounded-full p-0.5">
                                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs py-0.5 px-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                {skin.name}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-3 text-center">
                    <button
                        className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={() => {
                            // 实际项目中可能会有更多皮肤
                            toast.info('查看更多壁纸功能开发中...');
                        }}
                    >
                        查看更多壁纸
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isSkinDropdownOpen, setIsSkinDropdownOpen] = useState(false);
    const skinButtonRef = useRef(null);

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
        console.log(res, 'res---');
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

            <div className="flex items-center gap-3">
                {/* 搜索框 */}
                <div className="search-container relative">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索..."
                            className="pl-10 pr-4 py-2 rounded-full bg-gray-200/70 w-64 focus:w-80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            onChange={handleSearchChange}
                            onFocus={handleFocus}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* 搜索结果 */}
                    {showResults && (
                        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map((result) => (
                                        <li key={result.id} className="border-b border-gray-100 last:border-0">
                                            <Link href={`/blog/${result._id}`} className="block px-4 py-2 hover:bg-gray-50">
                                                <div className="font-medium text-gray-800">{result.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">{result.author} · {new Date(result.createdAt).toLocaleDateString()}</div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">无搜索结果</div>
                            )}
                        </div>
                    )}
                </div>

                {/* 换肤按钮 */}
                <div className="relative">
                    <button
                        ref={skinButtonRef}
                        onClick={() => setIsSkinDropdownOpen(!isSkinDropdownOpen)}
                        className="p-2 rounded-full bg-gray-200/70 hover:bg-gray-300 transition-colors duration-200 ease-in-out active:scale-95"
                        title="更换皮肤"
                    >
                        <Image 
                            src="/images/icons/plain-t-shirt-svgrepo-com.svg"
                            width={20}
                            height={20}
                            alt="换肤"
                        />
                    </button>

                    {/* 换肤下拉菜单 */}
                    <SkinDropdown
                        isOpen={isSkinDropdownOpen}
                        onClose={() => setIsSkinDropdownOpen(false)}
                    />
                </div>

                {/* 登录/注册按钮 */}
                {!isLoggedIn ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 active:scale-95 text-sm font-medium"
                        >
                            登录
                        </button>
                        <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="px-4 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 active:scale-95 text-sm font-medium"
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
                openRegister={() => setIsRegisterModalOpen(true)}
            />

            {/* 注册弹窗 */}
            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                openLogin={() => setIsLoginModalOpen(true)}
            />
        </div>
    );
}