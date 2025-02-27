'use client'

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/userSlice';
import { loginApi } from '@/app/api';
import genPassword from '@/utils/cryp';
import { handleWeiboLogin, handleWechatLogin, handleGithubLogin } from '@/utils/socialLogin';

export default function LoginModal({ isOpen, onClose, openRegister }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 这里应该替换为实际的登录API调用
      const res = await loginApi({
        username:formData.username,
        pppp:genPassword(formData.password)
      });
      
      // 模拟登录成功
      setTimeout(() => {
        // 使用 Redux 存储用户信息
        const userData = {
          token: res.data.token,
          userInfo: res.data.userinfo
        };
        
        dispatch(login(userData));
        
        toast.success('登录成功');
        handleClose();
        router.refresh();
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      toast.error(error.message || '登录失败，请重试');
      setIsLoading(false);
    }
  };

  // 切换到注册弹窗
  const switchToRegister = () => {
    handleClose();
    setTimeout(() => {
      openRegister();
    }, 300); // 等待关闭动画完成后再打开注册弹窗
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* 登录卡片 - 添加animate__faster类来加快动画速度 */}
      <div className={`relative backdrop-blur-2xl bg-white/90 p-6 rounded-xl shadow-lg border border-white/40 w-full max-w-sm mx-4 animate__animated animate__faster ${isClosing ? 'animate__fadeOutUp' : 'animate__fadeInDown'}`}
           style={{ '--animate-duration': '0.3s' }} // 自定义动画持续时间为0.3秒
      >
        <button 
          onClick={handleClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">欢迎回来</h2>
          <p className="text-gray-600 text-sm mt-0.5">请登录您的账号</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
              placeholder="请输入用户名"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
              placeholder="请输入密码"
            />
          </div>
          
          <div className="flex items-center justify-between mb-4 text-xs">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="h-3 w-3 text-blue-500 border-gray-300 rounded focus:ring-blue-500/20"
              />
              <label htmlFor="remember" className="ml-1.5 block text-xs text-gray-700">
                记住我
              </label>
            </div>
            
            <a href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-colors">
              忘记密码?
            </a>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </div>
            ) : '登录'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            还没有账号? 
            <button 
              onClick={switchToRegister} 
              className="text-blue-600 hover:text-blue-800 ml-1 transition-colors"
            >
              立即注册
            </button>
          </p>
        </div>
        
        <div className="mt-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white/90 text-gray-500">或者使用</span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button 
            onClick={handleWeiboLogin}
            className="flex justify-center items-center py-1.5 px-3 border border-gray-200 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 1024 1024">
              <path d="M851.4 590.193c-22.196-66.233-90.385-90.422-105.912-91.863-15.523-1.442-29.593-9.94-19.295-27.505 10.302-17.566 29.304-68.684-7.248-104.681-36.564-36.14-116.512-22.462-173.094 0.866-56.434 23.327-53.39 7.055-51.65-8.925 1.89-16.848 32.355-111.02-60.791-122.395C311.395 220.86 154.85 370.754 99.572 457.15 16 587.607 29.208 675.873 29.208 675.873h0.58c10.009 121.819 190.787 218.869 412.328 218.869 190.5 0 350.961-71.853 398.402-169.478 0 0 0.143-0.433 0.575-1.156 4.938-10.506 8.71-21.168 11.035-32.254 6.668-26.205 11.755-64.215-0.728-101.66z m-436.7 251.27c-157.71 0-285.674-84.095-285.674-187.768 0-103.671 127.82-187.76 285.674-187.76 157.705 0 285.673 84.089 285.673 187.76 0 103.815-127.968 187.768-285.673 187.768z" />
            </svg>
          </button>
          
          <button 
            onClick={handleWechatLogin}
            className="flex justify-center items-center py-1.5 px-3 border border-gray-200 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 1024 1024">
              <path d="M692.677 342.677c11.52 0 22.827 0.64 34.133 1.493-30.72-143.36-183.68-249.6-358.4-249.6-195.413 0-354.987 133.12-354.987 300.8 0 97.28 53.12 177.067 141.653 238.933l-35.413 106.667 123.733-61.867c44.373 8.747 79.787 17.92 124.16 17.92 11.093 0 22.187-0.64 33.067-1.493-7.04-23.893-10.88-48.853-10.88-74.667 0-155.307 133.12-278.187 302.933-278.187zM498.944 248.32c26.453 0 44.373 17.92 44.373 44.373 0 26.667-17.92 44.587-44.373 44.587-26.667 0-53.12-17.92-53.12-44.587 0-26.453 26.453-44.373 53.12-44.373zM283.264 337.28c-26.667 0-53.333-17.92-53.333-44.587 0-26.453 26.667-44.373 53.333-44.373 26.453 0 44.373 17.92 44.373 44.373 0 26.667-17.92 44.587-44.373 44.587zM1024.043 629.333c0-141.653-141.653-257.28-300.8-257.28-168.533 0-301.653 115.627-301.653 257.28 0 142.08 133.12 257.28 301.653 257.28 35.413 0 71.04-8.96 106.667-17.92l97.28 53.12-26.667-88.747c71.253-53.333 123.52-124.373 123.52-203.733zM616.811 585.173c-17.92 0-35.627-17.92-35.627-35.84 0-17.707 17.707-35.627 35.627-35.627 26.88 0 44.587 17.92 44.587 35.627 0 17.92-17.707 35.84-44.587 35.84zM779.691 585.173c-17.707 0-35.413-17.92-35.413-35.84 0-17.707 17.707-35.627 35.413-35.627 26.667 0 44.373 17.92 44.373 35.627 0 17.92-17.707 35.84-44.373 35.84z" />
            </svg>
          </button>
          
          <button 
            onClick={handleGithubLogin}
            className="flex justify-center items-center py-1.5 px-3 border border-gray-200 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
