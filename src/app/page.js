import { getAllPosts } from '../lib/posts';
import PostGrid from '../components/PostGrid';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="container">
      <PostGrid posts={posts} />
    </div>
  );
}
