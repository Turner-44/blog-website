import { Poppins, Nunito, Patrick_Hand } from 'next/font/google';

// Headings
export const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Body text
export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '600'],
  display: 'swap',
});

// Accent / Handwritten
export const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  variable: '--font-patrick-hand',
  weight: ['400'],
  display: 'swap',
});
