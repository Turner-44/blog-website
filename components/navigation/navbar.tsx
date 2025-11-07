import Link from 'next/link';
import Image from 'next/image';
import TestBanner from '../shared-components/test-banner';

const navLinks = [
  { href: '/', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <div>
      {process.env.NEXT_PUBLIC_POINTED_AT_TEST && <TestBanner />}
      <div className="flex flex-col space-y-5 md:flex-row mt-5 mx-auto md:mx-15 md:mt-15 md:space-y-0">
        <div className="flex flex-col md:flex-1 items-center">
          <Image
            src="/images/logo.png"
            alt="Becoming Matthew Logo"
            width={100}
            height={100}
            className={`opacity-70`}
            priority={true}
          />
        </div>
        <div className="flex flex-col flex-5 justify-center items-center md:items-start pl-5">
          <div className="text-2xl font-semi -mb-1 font-poppins">Becoming</div>
          <div className="text-3xl font-bold -mt-1.5 font-poppins">Matthew</div>
        </div>
        <div
          className="flex flex-col mx-auto md:flex-row md:flex-3 md:space-x-7 items-center justify-end"
          data-testid="navigation-bar"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group text-2xl font-semi no-underline"
            >
              {label}
              <div className="mx-2 mt-1 duration-500 border-b-2 opacity-0 border-black group-hover:opacity-100 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>
      <div className="w-3/4 md:hidden border-b mx-auto border-gray-400 my-5 rounded" />
    </div>
  );
}
