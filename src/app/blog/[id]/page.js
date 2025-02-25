'use client'

import React, { useState, useEffect } from 'react';    
import { getBlogDetailApi } from '@/app/api';
// import { useRouter } from 'next/router';

export default function BlogDetail() {
    // const router = useRouter();
    // const { id } = router.query;
    const id = '1';
    console.log(id,'33333333333333');
    const [blogDetail, setBlogDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const getBlog = async () => {
        const res = await getBlogDetailApi({ id });
        setBlogDetail(res.data);
        setLikes(res.data.likes || 0);
        setComments(res.data.comments || []);
        setIsLoading(false);
    }

    useEffect(() => {
        if (id) {
            getBlog();
        }
    }, [id]);

    const handleLike = () => {
        setLikes(likes + 1);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{blogDetail?.title || '无标题'}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <p className="text-gray-700">{blogDetail?.content || '内容为空'}</p>
            </div>
            <div className="flex items-center mb-4">
                <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded">
                    👍 {likes} Likes
                </button>
            </div>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">评论</h2>
                <form onSubmit={handleCommentSubmit} className="flex">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="添加评论..."
                        className="border rounded-l-lg p-2 flex-grow"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 rounded-r-lg">
                        发送
                    </button>
                </form>
                <div className="mt-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="border-b py-2">
                            {comment}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
