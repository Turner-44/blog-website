import Link from 'next/link';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { Button } from '@/components/shared-components/button';

export default async function AdminPage() {
    validateUserSession('UI');

    return (
        <div className="flex flex-col items-center min-h-screen py-10">
            <h1>Write those blogs boy!</h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-xs">
                <Link href="/admin/create-blog" className="flex-1">
                    <Button className="Button-primary w-full">
                        Create Blog
                    </Button>
                </Link>
                <Link href="/admin/delete-blog" className="flex-1">
                    <Button className="Button-destructive w-full">
                        Delete Blog
                    </Button>
                </Link>
            </div>
        </div>
    );
}
