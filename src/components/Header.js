'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'All Posts', href: '/' },
  { label: 'Tech', href: '/?topic=tech' },
  { label: 'Personal', href: '/?topic=personal' },
  { label: 'Tutorials', href: '/?topic=tutorials' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get('topic');

  function isActive(item) {
    if (item.href === '/about') return pathname === '/about';
    if (item.href === '/') return pathname === '/' && !currentTopic;
    const paramMatch = new URL(item.href, 'http://x').searchParams.get('topic');
    return pathname === '/' && currentTopic === paramMatch;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="blog-title">a7vicky blog</Link>
          <ThemeToggle />
        </div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link${isActive(item) ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
