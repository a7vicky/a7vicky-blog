import { JetBrains_Mono } from 'next/font/google';
import ThemeProvider from '../components/ThemeProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata = {
  title: '@a7vicky blog',
  description: 'Blog by A7Vicky - Senior Site Reliability Engineer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className={jetbrainsMono.className}>
        <ThemeProvider>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
