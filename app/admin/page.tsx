import Link from 'next/link';
import { validateUserSession } from '@/lib/auth/validate-user-session';
import { Button } from '@/components/shared-components/button';
import { revalidateBlogCache } from '@/lib/api/common/revalidate-cache';

export default async function AdminPage() {
  await validateUserSession('UI');

  const handleRevalidate = async () => {
    'use server';
    revalidateBlogCache();
  };

  return (
    <main className="standard-page-format">
      <div className="flex flex-col items-center">
        <h1 className="py-5">Write those blogs boy!</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-xs">
          <Link href="/admin/create-blog" className="flex-1">
            <Button
              className="Button-primary w-full"
              data-testid="btn-admin-create-blog"
            >
              Create Blog
            </Button>
          </Link>
          <Link href="/admin/delete-blog" className="flex-1">
            <Button
              className="Button-destructive w-full"
              data-testid="btn-admin-delete-blog"
            >
              Delete Blog
            </Button>
          </Link>
        </div>
        <Button
          onClick={handleRevalidate}
          className="Button-destructive mt-10"
          data-testid="btn-admin-refresh-blog-cache"
        >
          Refresh Blog Cache
        </Button>
      </div>
    </main>
  );
}
