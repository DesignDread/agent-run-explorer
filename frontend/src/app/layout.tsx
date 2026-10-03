import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agent Run Explorer',
  description: 'Debug and inspect AI agent runs with real-time insights',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-cyan-500/30 group-hover:ring-cyan-400/60 transition-all duration-300">
              <Image src="/logo.png" alt="Agent Run Explorer" fill className="object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-sm tracking-wide">Agent Run</span>
              <span className="gradient-text text-xs font-semibold tracking-wider">EXPLORER</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <NavLink href="/runs" label="Runs" icon="⚡" />
            <NavLink href="/dashboard" label="Dashboard" icon="📊" />
            <a
              href="https://github.com/DesignDread/agent-run-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all duration-200"
    >
      <span className="text-xs">{icon}</span>
      {label}
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        <Navbar />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
