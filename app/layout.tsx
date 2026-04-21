import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Index Atlas NextGraph",
  description: "Next.js dashboard and graph explorer for a global stock index dataset."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div>
              <div className="badge">global-index-atlas-nextgraph</div>
              <h1 style={{ margin: "12px 0 6px" }}>Global Index Atlas NextGraph</h1>
              <div className="muted">Global Stock Index Atlas — Next.js dashboard + graph explorer for an 80K+ equity index dataset.</div>
            </div>
            <nav className="nav">
              <Link href="/">Dashboard</Link>
              <Link href="/graph">Graph</Link>
              <a href="/world_stock_indices_equity_filtered.csv">CSV</a>
            </nav>
          </header>
          {children}
          <div className="footer">Built for Vercel deployment with Next.js App Router and route handlers.</div>
        </div>
      </body>
    </html>
  );
}
