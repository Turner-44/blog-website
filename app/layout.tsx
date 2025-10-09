import type { Metadata } from 'next';
import './globals.css';
import { nunito, roboto } from '@/lib/utils/fonts';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';

export const metadata: Metadata = {
  title: 'Becoming Matthew',
  description: 'A blog about my journey to become the best version of myself.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${roboto.variable} min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
