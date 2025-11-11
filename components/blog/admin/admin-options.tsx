'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminOptions() {
  const links = [
    { href: '/admin', label: 'Home' },
    { href: '/admin/create-blog', label: 'Create' },
    { href: '/admin/delete-blog', label: 'Delete' },
  ];

  const pathname = usePathname();

  return (
    <div className="flex md:flex-col h-fit justify-center p-4 rounded-xl border border-gray-200 shadow-sm gap-2">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          data-testid={`btn-admin-${label.toLowerCase().replace(' ', '-')}-blog`}
          className={
            'group px-3 py-1 rounded-sm text-lg font-medium transition-all no-underline active:font-bold'
          }
        >
          {label}
          <div
            className={`mx-2 mt-1 duration-500 border-b-2 opacity-0 border-black group-hover:opacity-100 group-hover:-translate-y-0.5 group-active:opacity-100 group-active:-translate-y-0.5 ${pathname === href ? 'opacity-100' : ''}`}
          />
        </Link>
      ))}
    </div>
  );
}
