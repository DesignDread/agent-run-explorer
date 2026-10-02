import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Run Explorer",
  description: "Explore agent runs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4">
          <div className="flex gap-6 items-center">
            <h1 className="font-bold text-xl">Agent Run Explorer</h1>
            <Link href="/runs" className="hover:text-blue-400">Runs</Link>
            <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
          </div>
        </nav>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
