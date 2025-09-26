import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header>
      <Image
        src="/images/logo.png"
        alt="Becoming Matthew Logo"
        width={100}
        height={100}
        className={`mx-auto p-4`}
        priority={true}
      />
      {process.env.NEXT_PUBLIC_ENVIRONMENT !== 'PRODUCTION' && (
        <h2 className="text-center">
          This is {process.env.NEXT_PUBLIC_ENVIRONMENT}.
        </h2>
      )}
      <div className="mt-auto bg-black">
        <div className="mx-auto max-w-4xl">
          <nav className="flex flex-col sm:grid sm:grid-cols-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-3 text-center text-xl text-white/85 font-bold no-underline nav-hover-effect"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
