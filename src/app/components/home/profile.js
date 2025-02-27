'use client'

import { useSelector } from 'react-redux';
import Image from 'next/image';

export default function Profile() {
    const { userInfo, isLoggedIn } = useSelector(state => state.user);

    // 如果未登录，显示默认信息
    const displayName = isLoggedIn ? (userInfo.nickname || userInfo.username) : 'Guest User';
    const avatarSrc = isLoggedIn ? (process.env.NEXT_PUBLIC_BASE_URL +'/'+ userInfo.avatarPath || '/images/kk.png') : '/images/user.png';

    return <div className="animate__animated animate__lightSpeedInLeft bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
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
                    src={avatarSrc}
                    fill
                    className="rounded-full object-cover"
                />
            </div>
            <h2 className="text-lg font-semibold mb-0.5">{displayName}</h2>
            <p className="text-sm text-gray-500 mb-4">
                {isLoggedIn ? 'Design Manager' : '请登录查看更多信息'}
            </p>


            <div className="flex gap-4 w-full justify-center">
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">--</span>
                    </div>
                    <span className="text-xs text-gray-500">发帖数</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="font-semibold">--</span>
                    </div>
                    <span className="text-xs text-gray-500">点赞</span>
                </div>
                <div className="text-center">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                        <span className="font-semibold">--</span>
                    </div>
                    <span className="text-xs text-gray-500">收藏</span>
                </div>
            </div>

        </div>
    </div>
}

