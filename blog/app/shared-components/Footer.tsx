import Link from 'next/link'
import Image from 'next/image'

const containerClasses =
    'prose prose-xl mx-auto flex flex-col items-center justify-between'

const navLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/terms-conditions', label: 'Terms and Conditions' },
]
export default function Navbar() {
    return (
        <nav>
            <div className={`${containerClasses}`}>
                <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4 p-6">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-2xl text-black/85 font-bold no-underline hover:text-black hover:underline"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
