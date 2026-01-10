
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import QuizPlayer from './components/QuizPlayer';
import { Quiz, AdminTab, UserRegistration } from './types';
import { fetchQuizzes, fetchUsers, sendTelegramBroadcast, sendTelegramMessage, deleteQuiz, saveQuiz } from './services/api';
import { WhaleIcon, WavesIcon } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'tests' | 'quiz' | 'admin'>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState<AdminTab>(AdminTab.TESTS);
  
  // Admin Login State
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('Main');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#tests') setView('tests');
      else if (hash === '#admin') setView('admin');
      else setView('home');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    
    // Load data
    fetchQuizzes().then(setQuizzes);
    fetchUsers().then(setUsers);

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name === 'Егор' && loginForm.password === '1808') {
      setIsAdmin(true);
    } else {
      alert('Неверное имя или пароль');
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('quiz');
  };

  const renderHome = () => (
    <div className="text-center py-12">
      <div className="mb-8 flex justify-center">
        <div className="bg-blue-100 p-8 rounded-full border-4 border-blue-200">
          <WhaleIcon className="w-24 h-24 text-blue-900 animate-swim" />
        </div>
      </div>
      <h1 className="text-5xl font-black text-blue-900 mb-6 tracking-tight">
        Добро пожаловать в Инвест Клуб
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        Сообщество амбициозных инвесторов и будущих финансистов. Изучайте рынки, 
        участвуйте в воркшопах и растите вместе с нами.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => window.location.hash = '#tests'}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
        >
          Пройти тесты
        </button>
        <a 
          href="https://t.me/investclubhsespb" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-blue-300 transition-all"
        >
          Наш Telegram Бот
        </a>
      </div>
      
      <div className="mt-24 grid md:grid-cols-3 gap-8 text-left">
        {[
          { title: 'Мероприятия', desc: 'Встречи с экспертами из мира финансов.', icon: '📅' },
          { title: 'Аналитика', desc: 'Разбор реальных кейсов и рыночных трендов.', icon: '📊' },
          { title: 'Комьюнити', desc: 'Постоянный обмен знаниями и опытом.', icon: '🌊' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-lg font-bold mb-2 text-blue-900">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTests = () => (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-blue-900 flex items-center">
        <WavesIcon className="w-8 h-8 mr-3" /> Доступные тесты
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
          <p className="text-gray-500 col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
            Пока нет доступных тестов. Загляните позже!
          </p>
        ) : (
          quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col">
              <h3 className="text-xl font-bold mb-3 text-blue-900">{quiz.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{quiz.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-medium text-gray-400">{quiz.questions.length} вопросов</span>
                <button 
                  onClick={() => startQuiz(quiz)}
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  Начать
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAdmin = () => {
    if (!isAdmin) {
      return (
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <WhaleIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-blue-900">Вход для администраторов</h2>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Имя</label>
                <input 
                  type="text" 
                  value={loginForm.name}
                  onChange={e => setLoginForm({...loginForm, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="Егор"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Пароль</label>
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="••••"
                  required
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                Войти в систему
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap gap-4">
          {[
            { id: AdminTab.TESTS, label: 'Тесты', icon: '📝' },
            { id: AdminTab.BOT, label: 'Управление Ботом', icon: '🤖' },
            { id: AdminTab.EVENTS, label: 'Мероприятия', icon: '📅' },
            { id: AdminTab.STATS, label: 'Статистика', icon: '📈' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as AdminTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                adminTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setIsAdmin(false)}
            className="ml-auto text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            Выход
          </button>
        </div>

        <div className="p-8">
          {adminTab === AdminTab.TESTS && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-blue-900">Управление тестами</h3>
                <button 
                  onClick={() => {
                    const title = prompt('Название теста:');
                    if (title) {
                      const newQuiz: Quiz = {
                        id: Math.random().toString(36).substr(2, 9),
                        title,
                        description: 'Описание нового теста...',
                        createdAt: new Date().toISOString(),
                        questions: []
                      };
                      saveQuiz(newQuiz).then(() => fetchQuizzes().then(setQuizzes));
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm"
                >
                  + Создать тест
                </button>
              </div>
              <div className="grid gap-4">
                {quizzes.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-900">{q.title}</h4>
                      <p className="text-xs text-gray-400">ID: {q.id} • {q.questions.length} вопросов</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">⚙️</button>
                      <button 
                        onClick={() => {
                          if (confirm('Удалить этот тест?')) {
                            deleteQuiz(q.id).then(() => fetchQuizzes().then(setQuizzes));
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab === AdminTab.BOT && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Рассылка сообщений</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Группа пользователей</label>
                    <select 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      value={broadcastTarget}
                      onChange={e => setBroadcastTarget(e.target.value)}
                    >
                      <option value="Main">Все (Main)</option>
                      <option value="GazpromEvent">Газпром Нефть</option>
                      <option value="Activa">Актив Клуба</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Текст сообщения</label>
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      placeholder="Введите текст рассылки (поддерживается Markdown)..."
                      value={broadcastMsg}
                      onChange={e => setBroadcastMsg(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        if (broadcastMsg.trim()) {
                          sendTelegramBroadcast(broadcastTarget, broadcastMsg);
                          setBroadcastMsg('');
                        }
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center w-full"
                    >
                      🚀 Отправить рассылку
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-6">Список пользователей</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase">Пользователь</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase">ID</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase">Лист</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase">Статус</th>
                        <th className="px-4 py-3 text-xs font-black text-gray-400 uppercase">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-bold text-gray-900">{user.firstName} {user.lastName}</td>
                          <td className="px-4 py-4 text-gray-500 font-mono text-xs">{user.userId}</td>
                          <td className="px-4 py-4">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">{user.sheet}</span>
                          </td>
                          <td className="px-4 py-4 text-green-500 text-xs font-bold">● {user.status}</td>
                          <td className="px-4 py-4">
                            <button 
                              onClick={() => {
                                const msg = prompt(`Написать ${user.firstName}:`);
                                if (msg) sendTelegramMessage(user.userId, msg);
                              }}
                              className="text-blue-600 hover:underline text-xs font-bold"
                            >
                              Написать
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === AdminTab.EVENTS && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold text-blue-900">Редактор форм в разработке</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2">
                Здесь можно будет создавать динамические формы для регистрации на новые мероприятия клуба.
              </p>
            </div>
          )}

          {adminTab === AdminTab.STATS && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Всего пользователей', value: users.length, icon: '👥' },
                { label: 'Пройдено тестов', value: '142', icon: '📝' },
                { label: 'Новых за неделю', value: '+12', icon: '📈' },
                { label: 'Активных в боте', value: '98%', icon: '🔥' }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase">{stat.label}</div>
                  <div className="text-3xl font-black text-blue-900 mt-1">{stat.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout 
      isAdmin={isAdmin}
      onAdminClick={() => {
        if (!isAdmin) window.location.hash = '#admin';
        else window.location.hash = '#admin';
      }}
    >
      {view === 'home' && renderHome()}
      {view === 'tests' && renderTests()}
      {view === 'quiz' && activeQuiz && (
        <QuizPlayer 
          quiz={activeQuiz} 
          onComplete={() => {
            setActiveQuiz(null);
            window.location.hash = '#tests';
          }}
          onCancel={() => {
            setActiveQuiz(null);
            window.location.hash = '#tests';
          }}
        />
      )}
      {view === 'admin' && renderAdmin()}
    </Layout>
  );
};

export default App;
