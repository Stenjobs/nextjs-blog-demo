'use client'
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getBlogListApi,analysisApi,getUserSlatApi } from './api';
import Header from './components/Header';
import Charts from './components/home/charts';
import Trackers from './components/home/trackers';
import Meets from './components/home/meets';
import Profile from './components/home/profile';
import Card from './components/home/card';
import { useSelector } from 'react-redux';
export default function Dashboard() {

  useEffect(() => {
    getBlogList({mode:'new'})
    getAnalysisApi()
    getUserSlat()
  }, [])

  const [blogList, setBlogList] = useState([])
  const [analysisData, setAnalysisData] = useState({})
  const [userSlatData, setUserSlatData] = useState({})
  const user = useSelector(state => state.user)

  const getBlogList = async ({mode}) => {
    const res = await getBlogListApi({
      page: 1,
      pageSize: 5,
      mode: mode || 'new'
    })
    setBlogList(res.data.list)
  }

  const getAnalysisApi = async () => {
    const res = await analysisApi()
    setAnalysisData(res.data)
  }

  const getUserSlat = async () => {
    if(user && user.isLoggedIn){
      const res = await getUserSlatApi()
      setUserSlatData(res.data)
    }
  }

  const onChangeSort = (sort) => {
    getBlogList({mode:sort})
  }


  

  return (
    <main className="p-8 min-w-[1080px]">
      {/* 顶部导航栏 */}
      <Header />
      {/* 将内容分为两列 */}
      <div className="grid grid-cols-5 gap-6">
        {/* 左侧列：包含个人资料、统计卡片和图表 */}
        <div className="col-span-3 space-y-6">
          {/* 第一行：个人资料和统计卡片 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 个人资料卡片 */}
            <Profile slatData={userSlatData} getUserSlat={getUserSlat} />

            {/* 统计卡片区域 */}
            <div className="col-span-2 space-y-3">
              <Card analysisData={analysisData}/>
              {/* Trackers connected 卡片 */}
              <Trackers />
            </div>
          </div>

          {/* 折线图区域 */}
          <Charts activityTrend={analysisData.activityTrend} userTrend={analysisData.userTrend} />
        </div>

        {/* 右侧列：会议列表 */}
        <Meets blogList={blogList} onChangeSort={onChangeSort}/>
      </div>
    </main>
  );
}