'use client';

import { useState } from 'react';
import PostCard from './PostCard';

const TOPICS = ['all', 'tech', 'personal', 'tutorials'];

export default function PostGrid({ posts }) {
  const [topic, setTopic] = useState('all');
  const filtered = topic === 'all' ? posts : posts.filter((p) => p.topic === topic);

  return (
    <section className="posts-section">
      <div className="posts-header">
        <h2>Latest Posts</h2>
        <div className="topic-filters">
          {TOPICS.map((t) => (
            <button
              key={t}
              className={`filter-btn${topic === t ? ' active' : ''}`}
              onClick={() => setTopic(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts found</h3>
          <p>Check back later for new content!</p>
        </div>
      ) : (
        <>
          <div className="posts-count">
            {filtered.length} post{filtered.length !== 1 ? 's' : ''}
          </div>
          <div className="posts-grid">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
