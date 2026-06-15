import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import PostContent from './PostContent';

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return { title: `${post.title} - @a7vicky blog` };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container">
      <div className="post-page-header">
        <Link href="/" className="back-link">
          &larr; Back to Posts
        </Link>
        <div className="post-page-meta">
          <div className="post-topic">{post.topic}</div>
        </div>
      </div>
      <article className="post-page-content">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-date">{formattedDate}</span>
            <span className="post-read-time">{post.readTime}</span>
          </div>
        </header>
        <PostContent content={post.content} />
      </article>
    </div>
  );
}
