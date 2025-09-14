import type { Metadata } from 'next';
import { Roboto, Nunito } from 'next/font/google';
import './globals.css';
import Navbar from './shared-components/Navbar';
import Footer from './shared-components/Footer';

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
});

const nunito = Nunito({
    variable: '--font-nunito',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Becoming Matthew',
    description:
        'A blog about my journey to become the best version of myself.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${nunito.variable} ${nunito.variable} antialiased dark:bg-black dark:text-white`}
            >
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
