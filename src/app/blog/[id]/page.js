'use client'

import React, { useState, useEffect } from 'react';    
import { useSelector } from 'react-redux';
import { getBlogDetailApi, likeBlogApi, addCommentApi, replyCommentApi, starBlogApi } from '@/app/api';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import 'animate.css';
import { formatDateTime } from '@/utils';
import { toast } from 'react-toastify';

// 动态导入 Header 组件，禁用 SSR
const Header = dynamic(() => import('@/app/components/Header'), { ssr: false });

// 使用 NoSSR 包装组件，确保只在客户端渲染
function BlogDetailContent() {
    const params = useParams();
    const id = params.id;
    const [blogDetail, setBlogDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});
    const [isStarred, setIsStarred] = useState(false);
    const { userInfo } = useSelector(state => state.user);
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                const res = await getBlogDetailApi({ id });
                setBlogDetail(res.data);
                setLikes(res.data.likes || 0);
                setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
                setIsStarred(res.data.starUsers.includes(userInfo._id) || false);
            } catch (error) {
                console.error('获取博客详情失败:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleLike = async () => {
        try {
            await likeBlogApi({ id });
            setLikes(likes + 1);
        } catch (error) {
            console.error('点赞失败:', error);
        }
    };

    const handleStar = async () => {
        try {
            await starBlogApi({ 
                id,
                status: !isStarred // 当前状态取反:true表示收藏,false表示取消收藏
            });
            setIsStarred(!isStarred);
            toast.success(isStarred ? '已取消收藏' : '收藏成功');
        } catch (error) {
            console.error('收藏操作失败:', error);
            toast.error('操作失败，请稍后重试');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                await addCommentApi({ id, content: newComment });
                const newCommentObj = {
                    content: newComment,
                    userId: 'current-user',
                    realname: '当前用户',
                    createdAt: new Date().toISOString(),
                    replies: []
                };
                setComments([...comments, newCommentObj]);
                setNewComment('');
            } catch (error) {
                console.error('评论失败:', error);
            }
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim() || !replyingTo) return;
        
        try {
            const { type, index, parentIndex } = replyingTo;
            
            // 回复主评论
            if (type === 'comment') {
                const comment = comments[index];
                
                // 调用回复评论API
                await replyCommentApi({
                    blogId: id,
                    commentId: comment._id, // 评论ID
                    content: replyContent,
                    replyToId: comment._id
                });
                
                const updatedComments = [...comments];
                
                const newReply = {
                    content: replyContent,
                    userId: userInfo._id,
                    realname: userInfo.realname,
                    createdAt: new Date().toISOString(),
                    replyTo: {
                        userId: comment.userId,
                        realname: comment.realname
                    }
                };
                
                if (!updatedComments[index].replies) {
                    updatedComments[index].replies = [];
                }
                
                updatedComments[index].replies.push(newReply);
                setComments(updatedComments);
            } 
            // 回复评论的回复
            else if (type === 'reply') {
                const comment = comments[parentIndex];
                const reply = comment.replies[index];
                
                // 调用回复评论API
                await replyCommentApi({
                    blogId: id,
                    commentId: comment._id, // 评论ID
                    content: replyContent,
                    replyToId: reply._id,
                });
                
                const updatedComments = [...comments];
                
                const newReply = {
                    content: replyContent,
                    userId: userInfo._id,
                    realname: userInfo.realname,
                    createdAt: new Date().toISOString(),
                    replyTo: {
                        userId: reply.userId,
                        realname: reply.realname
                    }
                };
                
                if (!updatedComments[parentIndex].replies) {
                    updatedComments[parentIndex].replies = [];
                }
                
                updatedComments[parentIndex].replies.push(newReply);
                setComments(updatedComments);
            }
            
            setReplyContent('');
            setReplyingTo(null);
        } catch (error) {
            console.error('回复失败:', error);
        }
    };

    const toggleReplies = (commentIndex) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentIndex]: !prev[commentIndex]
        }));
    };

    return (
        <main className="p-8 bg-gray-100 min-w-[1080px] min-h-screen">
            <Header />
            
            <div className="max-w-4xl mx-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <svg className="animate-spin w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span className="text-gray-600 ml-2">加载中...</span>
                    </div>
                ) : (
                    <div className="animate__animated animate__fadeIn">
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group">
                            <div className="flex items-center bg-white/50 hover:bg-white/80 transition-all duration-300 px-3 py-1.5 rounded-full shadow-sm">
                                <svg className="w-5 h-5 mr-1.5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                返回首页
                            </div>
                        </Link>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent inline-block">{blogDetail?.title || '无标题'}</h1>
                            
                            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <span>{blogDetail?.author || '匿名'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    <span>{formatDateTime(blogDetail?.createdAt) || '未知时间'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                    </svg>
                                    <span>{blogDetail?.views || 0} 次浏览</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="backdrop-blur-2xl bg-white/40 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 mb-6">
                            <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blogDetail?.content || '内容为空' }} />
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <button 
                                onClick={handleLike} 
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span>{likes} 点赞</span>
                            </button>

                            <button 
                                onClick={handleStar}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 ${
                                    isStarred 
                                        ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span>收藏</span>
                            </button>
                        </div>
                        
                        <div className="backdrop-blur-2xl bg-white/40 p-6 rounded-lg shadow-lg border border-white/30">
                            <h2 className="text-xl font-semibold mb-4">评论</h2>
                            
                            <form onSubmit={handleCommentSubmit} className="mb-6">
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="添加评论..."
                                        className="border border-gray-300 rounded-l-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                                    />
                                    <button 
                                        type="submit" 
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 rounded-r-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                    >
                                        发送
                                    </button>
                                </div>
                            </form>
                            
                            <div className="space-y-4">
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="backdrop-blur-sm bg-white/20 p-4 rounded-lg border border-white/20 hover:border-white/30 hover:shadow-md transition-all duration-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-medium">
                                                    {index + 1}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {comment.realname || comment.userId || `用户${index + 1}`}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDateTime(comment.createdAt)}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mb-2">{comment.content}</p>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <button 
                                                            onClick={() => toggleReplies(index)}
                                                            className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                        >
                                                            <svg className={`w-4 h-4 transition-transform ${expandedReplies[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                            {comment.replies.length} 条回复
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <button 
                                                    onClick={() => setReplyingTo({type: 'comment', index})}
                                                    className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                                                >
                                                    回复
                                                </button>
                                            </div>
                                            
                                            {replyingTo && replyingTo.type === 'comment' && replyingTo.index === index && (
                                                <form onSubmit={handleReplySubmit} className="mt-3 mb-3">
                                                    <div className="flex">
                                                        <input
                                                            type="text"
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder={`回复 ${comment.realname || comment.userId || `用户${index + 1}`}...`}
                                                            className="border border-gray-300 rounded-l-lg p-2 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                                                        />
                                                        <button 
                                                            type="submit" 
                                                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-r-lg text-sm hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                                        >
                                                            发送
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            
                                            {comment.replies && comment.replies.length > 0 && expandedReplies[index] && (
                                                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                                                    {comment.replies.map((reply, replyIndex) => (
                                                        <div key={replyIndex} className="backdrop-blur-sm bg-white/10 p-3 rounded-lg border border-white/10">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="text-sm font-medium text-gray-700">
                                                                    {reply.realname || reply.userId || `用户${replyIndex + 1}`}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {formatDateTime(reply.createdAt)}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700 text-sm">
                                                                {reply.replyTo && (
                                                                    <span className="text-blue-500">
                                                                        @{reply.replyTo.realname || reply.replyTo.userId} 
                                                                    </span>
                                                                )}
                                                                {' '}{reply.content}
                                                            </p>
                                                            
                                                            <div className="flex justify-end mt-1">
                                                                <button 
                                                                    onClick={() => setReplyingTo({type: 'reply', index: replyIndex, parentIndex: index})}
                                                                    className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                                                                >
                                                                    回复
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    
                                                    {replyingTo && replyingTo.type === 'reply' && replyingTo.parentIndex === index && (
                                                        <form onSubmit={handleReplySubmit} className="mt-3">
                                                            <div className="flex">
                                                                <input
                                                                    type="text"
                                                                    value={replyContent}
                                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                                    placeholder={`回复 ${comment.replies[replyingTo.index].realname || comment.replies[replyingTo.index].userId || `用户`}...`}
                                                                    className="border border-gray-300 rounded-l-lg p-2 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                                                                />
                                                                <button 
                                                                    type="submit" 
                                                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-r-lg text-sm hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                                                >
                                                                    发送
                                                                </button>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p>暂无评论，快来发表第一条评论吧！</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>
        </main>
    );
}

// 导出一个完全客户端渲染的组件
export default function BlogDetail() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
        return null;
    }
    
    return <BlogDetailContent />;
}
