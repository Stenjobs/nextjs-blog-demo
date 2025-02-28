'use client'

import { useState } from 'react';
import Header from '../components/Header';
import dynamic from 'next/dynamic';

// 动态导入编辑器组件以避免 SSR 问题
const Editor = dynamic(() => import('../components/editor'), { 
  ssr: false 
});

export default function BlogCreator() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <main className="p-8 bg-gray-100 min-w-[1080px] min-h-screen">
      <Header />
      
      {/* 主要内容区域 */}
      <div className="mt-8">
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
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300">
            发布文章
          </button>
        </div>
      </div>
    </main>
  );
}
