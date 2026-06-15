import PostCard from './PostCard';

export default function PostGrid({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No posts found</h3>
        <p>Check back later for new content!</p>
      </div>
    );
  }

  return (
    <section className="posts-section">
      <div className="posts-header">
        <h2>Latest Posts</h2>
        <div className="posts-count">
          {posts.length} post{posts.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
