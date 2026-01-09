import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminId = getAdminSession();
  if (!adminId) redirect('/login');
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="ml-64 p-6">{children}</main>
    </div>
  );
}
