import Link from 'next/link';

const navLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/terms-conditions', label: 'Terms and Conditions' },
];
export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center md:flex-row md:space-x-10 mt-auto">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="group py-3 text-center text-sm text-black font-bold no-underline nav-hover-effect"
        >
          {label}
          <div className="mx-2 mt-1 duration-500 border-b-2 opacity-0 border-black group-hover:opacity-100 group-hover:-translate-y-0.5" />
        </Link>
      ))}
    </footer>
  );
}
