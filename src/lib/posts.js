import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

function getMarkdownFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getAllPosts() {
  const files = getMarkdownFiles(postsDirectory);

  const posts = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(raw);
    const slug = path.basename(filePath, '.md');

    return {
      slug,
      title: data.title || slug,
      topic: data.topic || 'uncategorized',
      date: data.date || '',
      readTime: data.readTime || '5 min read',
      excerpt: data.excerpt || '',
    };
  });

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug) {
  const files = getMarkdownFiles(postsDirectory);
  const filePath = files.find((f) => path.basename(f, '.md') === slug);
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    topic: data.topic || 'uncategorized',
    date: data.date || '',
    readTime: data.readTime || '5 min read',
    excerpt: data.excerpt || '',
    content,
  };
}
