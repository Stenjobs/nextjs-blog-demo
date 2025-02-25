'use client'
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getBlogListApi } from './api';
import Header from './components/Header';
import Charts from './components/home/charts';
import Trackers from './components/home/trackers';
import Meets from './components/home/meets';
import Profile from './components/home/profile';
import Card from './components/home/card';
export default function Dashboard() {

  useEffect(() => {
    getBlogList()
  }, [])

  const [blogList, setBlogList] = useState([])

  const getBlogList = async () => {
    const res = await getBlogListApi()
    setBlogList(res.data.list)
  }


  

  return (
    <main className="p-8 bg-gray-100 min-w-[1080px]">
      {/* 顶部导航栏 */}
      <Header />
      {/* 将内容分为两列 */}
      <div className="grid grid-cols-5 gap-6">
        {/* 左侧列：包含个人资料、统计卡片和图表 */}
        <div className="col-span-3 space-y-6">
          {/* 第一行：个人资料和统计卡片 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 个人资料卡片 */}
            <Profile />

            {/* 统计卡片区域 */}
            <div className="col-span-2 space-y-3">
              <Card />
              {/* Trackers connected 卡片 */}
              <Trackers />
            </div>
          </div>

          {/* 折线图区域 */}
          <Charts />
        </div>

        {/* 右侧列：会议列表 */}
        <Meets blogList={blogList} />
      </div>
    </main>
  );
}