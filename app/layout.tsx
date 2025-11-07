import type { Metadata } from 'next';
import './globals.css';
import { nunito, poppins } from '@/utils/fonts';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { liveSiteUrl, siteName } from '@/utils/seo';
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
      <body>
        {/* Global Container */}
        <div
          className={`${nunito.variable} ${poppins.variable} min-h-screen flex flex-col bg-slate-100`}
        >
          {/* Parent Container */}
          <div className="mx-auto justify-center shadow-2xl rounded-2xl bg-white mt-5 px-2 w-full max-w-2xl md:px-4 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl md:mt-10 4xl:mt-20">
            <MantineProvider
              defaultColorScheme="light"
              theme={{
                primaryColor: 'blue',
                fontFamily: 'var(--font-nunito), sans-serif',
                headings: { fontFamily: 'var(--font-poppins), sans-serif' },
              }}
            >
              <Navbar />
              <main>{children}</main>
            </MantineProvider>
            <GoogleAnalytics gaId="G-8Q7SX0LTWY" />
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
