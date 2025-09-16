import type { Metadata } from 'next';
import './globals.css';
import Navbar from './ui/navigation/Navbar';
import Footer from './ui/navigation/Footer';

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
            <body>
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
