'use client'

import { useState, useEffect, Suspense } from 'react';
import Header from '../components/Header';
import dynamic from 'next/dynamic';
import { addBlogApi, getBlogDetailApi, updateBlogApi } from '../api';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';

// 动态导入编辑器组件以避免 SSR 问题
const Editor = dynamic(() => import('../components/editor'), { 
  ssr: false 
});

// 创建一个包含 useSearchParams 的组件
function BlogCreatorContent() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 获取 URL 中的 id 参数
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setBlogId(id);
      setIsEditMode(true);
      fetchBlogDetail(id);
    }
  }, [searchParams]);
  
  // 获取博客详情
  const fetchBlogDetail = async (id) => {
    setIsLoading(true);
    try {
      const res = await getBlogDetailApi({ id });
      if (res.data) {
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
      }
    } catch (error) {
      console.error('获取博客详情失败:', error);
      toast.error('获取博客详情失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    // 表单验证
    if (!title.trim() || !content.trim()) {
      toast.error('标题和内容不能为空');
      return;
    }

    setIsLoading(true);
    try {
      let res;
      
      if (isEditMode) {
        // 编辑模式：调用更新接口
        res = await updateBlogApi({
          _id: blogId,
          title: title,
          content: content
        });
      } else {
        // 创建模式：调用添加接口
        res = await addBlogApi({
          title: title,
          content: content
        });
      }
      
      if (res.code === 200) {
        toast.success(isEditMode ? '更新成功！' : '发布成功！');
        // 3秒后跳转到主页
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        toast.error((isEditMode ? '更新' : '发布') + '失败：' + res.message);
      }
    } catch (error) {
      console.error(isEditMode ? '更新' : '发布' + '文章时出错：', error);
      toast.error((isEditMode ? '更新' : '发布') + '失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 主要内容区域 */}
      <div className="mt-8">
        {/* 标题 */}
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isEditMode ? '编辑博客' : '创建博客'}
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              <div className="h-7 w-7 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin absolute top-1.5 left-1.5"></div>
            </div>
            <span className="text-gray-600 ml-3">加载中...</span>
          </div>
        ) : (
          <>
            {/* 标题输入框 */}
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入文章标题..."
                className="w-full px-6 py-4 text-2xl font-medium bg-white rounded-xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* 编辑器和预览区域容器 */}
            <div className="grid grid-cols-2 gap-6 h-[calc(100vh-280px)]">
              {/* 编辑器区域 */}
              <div className="backdrop-blur-xl bg-white/50 rounded-xl shadow-lg border border-white/30 overflow-hidden">
                <Editor 
                  value={content}
                  onChange={setContent}
                />
              </div>

              {/* 预览区域 */}
              <div className="backdrop-blur-xl bg-white/50 rounded-xl shadow-lg border border-white/30 p-6 overflow-y-auto">
                <div className="prose prose-slate max-w-none">
                  <h1 className="text-2xl font-bold mb-4">{title || '文章标题'}</h1>
                  <div dangerouslySetInnerHTML={{ __html: content || '开始编写你的文章...' }} />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-4 mt-6">
              <button className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                保存草稿
              </button>
              <button 
                onClick={handlePublish}
                disabled={isLoading}
                className={`px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isEditMode ? '更新博客' : '发布文章'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function BlogCreator() {
  return (
    <main className="p-8 bg-gray-100 min-w-[1080px] min-h-screen">
      <Header />
      <Suspense fallback={
        <div className="flex justify-center items-center h-64 mt-8">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            <div className="h-7 w-7 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin absolute top-1.5 left-1.5"></div>
          </div>
          <span className="text-gray-600 ml-3">加载中...</span>
        </div>
      }>
        <BlogCreatorContent />
      </Suspense>
    </main>
  );
}
