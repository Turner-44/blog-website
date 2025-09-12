import Link from 'next/link'
import Image from 'next/image'

const containerClasses =
    'prose prose-md mx-auto flex flex-col items-center justify-between'
const navLinks = [
    { href: '/', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
    return (
        <div>
            <Image
                src="/images/logo.png"
                alt="Becoming Matthew Logo"
                width={100}
                height={100}
                className={`${containerClasses} p-4`}
                priority={true}
            />
            <nav>
                <div className="bg-black/90 p-3 text-white sticky top-0 drop-shadow-md z-10">
                    <div className={`${containerClasses}`}>
                        <div className="flex flex-row justify-center sm:justify-evenly align-middle gap-4">
                            {navLinks.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="text-2xl text-white/85 font-bold no-underline hover:text-white"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
