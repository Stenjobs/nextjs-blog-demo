'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactECharts from 'echarts-for-react';
import { getBlogListApi } from './api';

export default function Dashboard() {

  useEffect(() => {
    getBlogList()
  }, [])

  const getBlogList = async () => {
    const res = await getBlogListApi()
    console.log(res)
  }


  // 图表配置
  const chartOption = {
    grid: {
      top: 60,       // 增加顶部空间给图例
      right: 40,     // 增加右侧边距
      bottom: 40,    // 增加底部边距给x轴标签
      left: 40,      // 增加左侧边距给y轴
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(0, 0, 0, 0.05)',
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: '#666'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      axisLine: {
        show: true,  // 显示x轴线
        lineStyle: {
          color: '#E5E7EB'  // 使用浅灰色
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        margin: 12    // 增加标签与轴的距离
      },
      boundaryGap: true
    },
    yAxis: {
      type: 'value',
      show: true,    // 显示y轴
      min: -100,
      max: 100,
      splitLine: {   // 添加网格线
        show: true,
        lineStyle: {
          color: '#E5E7EB',
          type: 'dashed'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#666',
        margin: 12
      }
    },
    legend: {
      data: ['Maximum of focus', 'Min or lack of focus'],
      top: 0,
      left: 0,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#666',
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Maximum of focus',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: true,
        data: [30, 60, -20, -40, 30, 60, -20],
        lineStyle: {
          color: '#FF9999',
          width: 3
        },
        itemStyle: {
          color: '#FF9999',
          borderWidth: 2,
          borderColor: '#FFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(255, 153, 153, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(255, 153, 153, 0)'
            }]
          }
        }
      },
      {
        name: 'Min or lack of focus',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: false,
        hoverAnimation: true,
        data: [-40, -10, 40, 20, -40, -10, 40],
        lineStyle: {
          color: '#99CCFF',
          width: 3
        },
        itemStyle: {
          color: '#99CCFF',
          borderWidth: 2,
          borderColor: '#FFF'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(153, 204, 255, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(153, 204, 255, 0)'
            }]
          }
        }
      }
    ]
  };

  return (
    <main className="p-8 bg-gray-100 min-w-[1080px]">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, Kristin</h1>
          <p className="text-sm text-gray-500">Your personal dashboard overview</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Search" 
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
          </div>
          <button className="p-2 rounded-full bg-gray-200/70 hover:bg-gray-300 transition-colors duration-200 ease-in-out active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 将内容分为两列 */}
      <div className="grid grid-cols-4 gap-6">
        {/* 左侧列：包含个人资料、统计卡片和图表 */}
        <div className="col-span-3 space-y-6">
          {/* 第一行：个人资料和统计卡片 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 个人资料卡片 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium">Profile</h3>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-3">
                  <Image
                    src="/profile-pic.jpg"
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-0.5">Kristin Watson</h2>
                <p className="text-sm text-gray-500 mb-4">Design Manager</p>

                <div className="flex gap-4 w-full justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span className="font-semibold">11</span>
                    </div>
                    <span className="text-xs text-gray-500">Teams</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">56</span>
                    </div>
                    <span className="text-xs text-gray-500">Projects</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">12</span>
                    </div>
                    <span className="text-xs text-gray-500">Awards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 统计卡片区域 */}
            <div className="col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {/* Prioritized tasks 卡片 */}
                <div className="relative p-8 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02]" style={{
                  background: `
                    radial-gradient(circle at 50% 50%, #FFFFFF 0%, transparent 70%),
                    linear-gradient(to bottom right, #FFE0E6 0%, #FFD4E4 50%, #FFB8D9 100%),
                    linear-gradient(to top left, #F8E4FF 0%, #FFE4F4 100%)
                  `,
                  minHeight: '180px'
                }}>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Prioritized tasks</h3>
                      <button className="p-2 hover:bg-white/30 rounded-full transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-1">83%</div>
                      <p className="text-sm text-gray-600">Avg. Completed</p>
                    </div>
                  </div>
                </div>

                {/* Additional tasks 卡片 */}
                <div className="relative p-8 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02]" style={{
                  background: `
                    radial-gradient(circle at 50% 50%, #FFFFFF 0%, transparent 70%),
                    linear-gradient(to bottom right, #E4F5FF 0%, #E0F4FF 50%, #D4F4FF 100%),
                    linear-gradient(to top left, #E4FFFA 0%, #E4F8FF 100%)
                  `,
                  minHeight: '180px'
                }}>
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">Additional tasks</h3>
                      <button className="p-2 hover:bg-white/30 rounded-full transition-colors">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <div className="text-4xl font-bold mb-1">56%</div>
                      <p className="text-sm text-gray-600">Avg. Completed</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Trackers connected 卡片 */}
              <div className="bg-gray-200/95 backdrop-blur-sm p-3 rounded-xl border border-gray-300/50">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Trackers connected</h3>
                    <p className="text-xs text-gray-500">3 active connections</p>
                  </div>
                  <button className="p-1.5 hover:bg-white/50 rounded-full transition-colors">
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.3 5.71a.996.996 0 00-1.41 0L9 14.6l-2.89-2.89a.996.996 0 10-1.41 1.41l3.59 3.59a.996.996 0 001.41 0l9.59-9.59a.996.996 0 000-1.41z" />
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                      <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z" />
                    </svg>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                  </div>
                  <button className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 折线图区域 */}
          <div className="mt-6 px-2 h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Focusing</h2>
                <p className="text-sm text-gray-500">Productivity analytics</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Range:</span>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 appearance-none pr-8 hover:bg-gray-100 transition-colors cursor-pointer" style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}>
                  <option>Last month</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>
            
            <div className="w-full h-[500px]">
              <ReactECharts 
                opts={{ renderer: 'svg' }}
                option={chartOption}
                style={{ 
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* 右侧列：会议列表 */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">My meetings</h2>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Tue, 11 Jul</p>
                  <p className="font-medium">Quick Daily Meeting</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <span className="text-sm text-gray-500">Zoom</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">08:15 am</span>
              </div>
              {/* 更多会议项目 */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Tue, 11 Jul</p>
                  <p className="font-medium">John Onboarding</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                      <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
                    </svg>
                    <span className="text-sm text-gray-500">Google Meet</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">09:30 pm</span>
              </div>
              {/* 查看更多按钮 */}
              <button className="text-sm text-blue-500 hover:text-blue-600 transition-colors mt-4">
                See all meetings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}