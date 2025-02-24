import { notFound } from 'next/navigation';
import { posts } from '@/lib/posts';

export async function generateStaticParams() {
  return posts.map(post => ({ id: post.id }));
}

export default function PostPage({ params }) {
  const post = posts.find(p => p.id === params.id);
  
  if (!post) notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-4">{post.date}</p>
      <p className="text-lg">{post.content}</p>
    </div>
  );
}