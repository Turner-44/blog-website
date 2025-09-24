import { Roboto, Nunito } from 'next/font/google';

export const roboto = Roboto({
    subsets: ['latin'],
    variable: '--font-roboto',
    display: 'swap',
});

export const nunito = Nunito({
    subsets: ['latin'],
    variable: '--font-nunito',
    display: 'swap',
});
