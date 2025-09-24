import Link from 'next/link';
import { validateUserSession } from '@/components/auth/validate-user-session';

export default async function AdminPage() {
    validateUserSession('UI');

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
