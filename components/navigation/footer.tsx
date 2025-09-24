import Link from 'next/link';

const navLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/terms-conditions', label: 'Terms and Conditions' },
];
export default function Footer() {
    return (
        <footer className="pt-5">
            <div className="mt-auto bg-black">
                <div className="mx-auto max-w-4xl">
                    <nav className="flex flex-col sm:grid sm:grid-cols-3">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className="py-3 text-center text-sm text-white/85 font-bold no-underline nav-hover-effect"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    );
}
