import Link from 'next/link';

export default function PostCard({ post }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/posts/${post.slug}`} className="post-card">
      <div className="post-topic">{post.topic}</div>
      <h3 className="post-title">{post.title}</h3>
      <p className="post-excerpt">{post.excerpt}</p>
      <div className="post-meta">
        <span className="post-date">{formattedDate}</span>
        <span className="post-read-time">{post.readTime}</span>
      </div>
    </Link>
  );
}
