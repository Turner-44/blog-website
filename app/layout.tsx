import type { Metadata } from 'next';
import './globals.css';
import { nunito, poppins } from '@/lib/utils/fonts';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { liveSiteUrl, siteName } from '@/lib/utils/seo';
import { GoogleAnalytics } from '@next/third-parties/google';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

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
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            primaryColor: 'blue',
            fontFamily: 'var(--font-nunito), sans-serif',
            headings: { fontFamily: 'var(--font-poppins), sans-serif' },
          }}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MantineProvider>
        <GoogleAnalytics gaId="G-8Q7SX0LTWY" />
      </body>
    </html>
  );
}
