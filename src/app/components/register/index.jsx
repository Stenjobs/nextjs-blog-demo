'use client'

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { registerApi } from '@/app/api';
import genPassword from '@/utils/cryp';
import axios from 'axios';

export default function RegisterModal({ isOpen, onClose, openLogin }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    realname: '',
    password: '',
    confirmPassword: '',
    avatar: null,
    avatarPath: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // 如果是文件类型
    if (type === 'file') {
      const file = files[0];
      if (file) {
        // 创建预览URL
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setFormData({
          ...formData,
          [name]: file
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      // 清理预览URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
    }, 300);
  };

  // 上传文件的函数
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/common/upload`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.code === 200) {
        return response.data.data.filePath;
      } else {
        throw new Error(response.data.msg || '文件上传失败');
      }
    } catch (error) {
      throw new Error('文件上传失败: ' + (error.message || '未知错误'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.username || !formData.password || !formData.realname) {
      toast.error('请填写所有必填字段');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('两次输入的密码不一致');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let avatarPath = '';
      
      // 如果有头像文件，先上传
      if (formData.avatar) {
        avatarPath = await uploadFile(formData.avatar);
      }
      
      // 准备注册数据
      const registerData = {
        username: formData.username,
        realname: formData.realname,
        pppp: genPassword(formData.password)
      };
      
      // 如果有头像路径，添加到注册数据中
      if (avatarPath) {
        registerData.avatarPath = avatarPath;
      }
      
      // 调用注册API
      const res = await registerApi(registerData);
      
      toast.success('注册成功');
      handleClose();
      router.refresh();
    } catch (error) {
      toast.error(error.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 切换到登录弹窗
  const switchToLogin = () => {
    handleClose();
    setTimeout(() => {
      openLogin();
    }, 300); // 等待关闭动画完成后再打开登录弹窗
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* 注册卡片 */}
      <div className={`relative backdrop-blur-2xl bg-white/90 p-6 rounded-xl shadow-lg border border-white/40 w-full max-w-sm mx-4 animate__animated animate__faster ${isClosing ? 'animate__fadeOutUp' : 'animate__fadeInDown'}`}
           style={{ '--animate-duration': '0.3s' }}
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
          <h2 className="text-xl font-bold text-gray-800">创建账号</h2>
          <p className="text-gray-600 text-sm mt-0.5">请填写以下信息完成注册</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">用户名 <span className="text-red-500">*</span></label>
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
          
          <div className="mb-3">
            <label htmlFor="realname" className="block text-xs font-medium text-gray-700 mb-1">真实姓名 <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="realname"
              name="realname"
              value={formData.realname}
              onChange={handleChange}
              className="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
              placeholder="请输入真实姓名"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">密码 <span className="text-red-500">*</span></label>
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
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">确认密码 <span className="text-red-500">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-1.5 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500 text-sm"
              placeholder="请再次输入密码"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="avatar" className="block text-xs font-medium text-gray-700 mb-1">头像</label>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <img src={previewUrl} alt={previewUrl} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="avatar"
                  className="inline-block px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                >
                  选择图片
                </label>
                <p className="text-xs text-gray-500 mt-1">支持JPG、PNG格式，大小不超过2MB</p>
              </div>
            </div>
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
                注册中...
              </div>
            ) : '注册'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            已有账号? 
            <button 
              onClick={switchToLogin} 
              className="text-blue-600 hover:text-blue-800 ml-1 transition-colors"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}