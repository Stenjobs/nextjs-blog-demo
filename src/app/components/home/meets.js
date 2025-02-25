import DOMPurify from 'dompurify';
import Link from 'next/link';

export default function Meets({ blogList }) {
    const isLoading = blogList.length === 0;
    return (
        <div className="col-span-2 animate__animated animate__lightSpeedInRight">
            <div className="backdrop-blur-2xl bg-white/40 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-medium text-gray-800">博客列表</h2>
                    <select className="p-1.5 bg-white/30 border border-white/40 rounded-md text-xs text-gray-700 hover:bg-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50">
                        <option value="latest">最新</option>
                        <option value="popular">最热</option>
                    </select>
                </div>
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <svg className="animate-spin w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="text-gray-600 ml-2">加载中...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {blogList.map((item) => (
                                <Link href={`/blog/${item._id}`} key={item._id}>
                                    <div
                                        className="cursor-pointer hover:bg-white/30 rounded-md p-1 transition-all duration-200 group"
                                    >
                                        <div className="backdrop-blur-sm bg-white/20 p-2 rounded-lg border border-white/20 group-hover:border-white/30 group-hover:shadow-md transition-all duration-200">
                                            <h3 className="font-medium text-base text-gray-800">{item.title}</h3>
                                            <div
                                                className="text-gray-700 mt-1 text-sm line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(item.content)
                                                }}
                                            />
                                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/10">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600">{item.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600">{item.viewCount || 666}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600">{item.likeCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors mt-3 backdrop-blur-xl bg-white/30 px-3 py-1.5 rounded-md hover:bg-white/40">
                    查看更多 →
                </button>
            </div>
        </div>
    )
}