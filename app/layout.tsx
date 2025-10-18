import type { Metadata } from 'next';
import './globals.css';
import { nunito, poppins } from '@/lib/utils/fonts';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { liveSiteUrl, siteName } from '@/lib/utils/seo';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'A blog about my journey to become the best version of myself.',
  metadataBase: new URL(liveSiteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: liveSiteUrl,
    siteName: siteName,
  },
  alternates: {
    canonical: liveSiteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${poppins.variable} min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-8Q7SX0LTWY" />
      </body>
    </html>
  );
}
