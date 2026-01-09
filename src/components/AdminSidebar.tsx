'use client';

import { getAdminSession, clearAdminSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSidebar() {
  const router = useRouter();
  const handleLogout = () => { clearAdminSession(); router.push('/'); };
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-800 text-white p-6">
      <div className="mb-8">
        <img src="/logo.svg" alt="Invest Club HSE SPB" className="w-32 h-auto mb-4" />
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li><Link href="/admin" className="block p-2 hover:bg-blue-700 rounded">Дашборд</Link></li>
          <li><Link href="/admin/tests" className="block p-2 hover:bg-blue-700 rounded">Тесты</Link></li>
          <li><Link href="/admin/bot-management" className="block p-2 hover:bg-blue-700 rounded">Управление ботом</Link></li>
        </ul>
      </nav>
      <div className="mt-8"><button onClick={handleLogout} className="w-full btn-danger">Выход</button></div>
    </aside>
  );
}
