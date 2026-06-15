'use client';

import { useSearchParams } from 'next/navigation';
import PostGrid from './PostGrid';

export default function HomeContent({ posts }) {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'all';
  const filtered = topic === 'all' ? posts : posts.filter((p) => p.topic === topic);

  return (
    <div className="container">
      <PostGrid posts={filtered} />
    </div>
  );
}
