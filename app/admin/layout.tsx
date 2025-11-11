import SessionProvider from '@/components/auth/session-provider';
import AdminOptions from '@/components/blog/admin/admin-options';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="max-w-6xl justify-center items-center md:items-start flex flex-col md:flex-row px-10 py-5 space-y-5 md:space-y-0 md:space-x-10">
        <div className="flex flex-none py-10 max-w-lg 2xl:max-w-2xl lg:justify-end">
          <AdminOptions />
        </div>
        <div className="flex flex-1 justify-start mx-auto w-full max-w-3xl ">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
