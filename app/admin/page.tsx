import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect('/403');
    }

    return (
        <>
            <h1>Write those blogs boy!</h1>
            <div>
                <div className="flex space-x-4">
                    <Link
                        href="/admin/create-blog"
                        className="hover:underline hover:text-lg"
                    >
                        Create Blog
                    </Link>
                    <Link
                        href="/admin/delete-blog"
                        className="hover:underline hover:text-lg"
                    >
                        Delete Blog
                    </Link>
                </div>
            </div>
        </>
    );
}
