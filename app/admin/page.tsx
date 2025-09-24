import Link from 'next/link';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { Button } from '@/components/shared-components/button';

export default async function AdminPage() {
    validateUserSession('UI');

    return (
        <div className="flex flex-col items-center min-h-screen py-10">
            <h1>Write those blogs boy!</h1>
            <div className="flex space-x-4 p-5">
                <Link href="/admin/create-blog" className="hover:underline">
                    <Button className="Button-primary">Create Blog</Button>
                </Link>
                <Link href="/admin/delete-blog" className="hover:underline">
                    <Button className="Button-primary bg-red-700">
                        Delete Blog
                    </Button>
                </Link>
            </div>
        </div>
    );
}
