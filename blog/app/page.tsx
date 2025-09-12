import Link from 'next/link'
import FetchBlogsButton from './shared-components/FetchBlogsButton'

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center gap-8 p-8 sm:p-10">
            <p className="text-2xl sm:text-3xl font-medium text-center">
                Welcome to my blog! <br />
                I'm <span className="font-bold">Matthew</span>
            </p>
            <FetchBlogsButton />
            <Link
                href="/internal-app/create-blog"
                className="hover:underline hover:text-lg"
            >
                Create Blog
            </Link>
        </main>
    )
}
