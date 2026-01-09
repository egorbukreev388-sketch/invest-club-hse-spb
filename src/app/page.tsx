import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img src="/logo.svg" alt="Invest Club HSE SPB" className="mx-auto mb-6 w-32 h-auto" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Invest Club HSE SPB</h1>
          <p className="text-xl mb-8">Мы - сообщество будущих финансистов и инвесторов!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test" className="btn-primary">Пройти тест</Link>
            <Link href="/event-registration" className="btn-secondary">Зарегистрироваться на мероприятие</Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Что мы предлагаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Эксклюзивные встречи</h3>
              <p>С топ-менеджерами из мира финансов и инвестиций.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Практика на кейсах</h3>
              <p>Работа с реальными задачами финансовых рынков.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Карьерные возможности</h3>
              <p>Стажировки у партнеров и шанс попасть в команду мечты.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 Invest Club HSE SPB. Все права защищены.</p>
          <div className="mt-4">
            <a href="https://t.me/investclubhsespb" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 mr-4">Telegram</a>
            <a href="https://vk.com/investclubhsespb" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">VK</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
