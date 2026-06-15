'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Posts', href: '/' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const pathname = usePathname();

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
              className={`nav-link${pathname === item.href ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
