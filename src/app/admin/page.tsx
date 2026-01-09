import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать, Администратор!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/tests" className="card p-6 hover:bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Тесты</h2>
          <p>Создавайте, управляйте и просматривайте результаты тестов.</p>
        </Link>
        <Link href="/admin/bot-management" className="card p-6 hover:bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Управление ботом</h2>
          <p>Просматривайте регистрации, отправляйте рассылки и личные сообщения.</p>
        </Link>
      </div>
    </div>
  );
}
