import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Undercover',
  description: 'A social deduction party game of trust, wordplay, and tactical voting',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Undercover Game',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-base">
          {children}
        </div>
      </body>
    </html>
  );
}

