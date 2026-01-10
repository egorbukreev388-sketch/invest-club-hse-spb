
import { Quiz, UserRegistration, Question } from '../types';

// NOTE: Since we are in a frontend environment, these functions would normally 
// call Vercel Serverless Functions (API routes) to interact with Google Sheets/Telegram.
// For the purpose of this SPA demo, we provide the logic structure.

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  // In a real app: return await fetch('/api/quizzes').then(r => r.json());
  const saved = localStorage.getItem('invest_club_quizzes');
  return saved ? JSON.parse(saved) : [
    {
      id: '1',
      title: 'Основы инвестирования',
      description: 'Проверьте свои базовые знания о фондовом рынке.',
      createdAt: new Date().toISOString(),
      questions: [
        { id: 'q1', text: 'Что такое акция?', options: ['Доля в компании', 'Долговое обязательство', 'Валюта'], correctIndex: 0 },
        { id: 'q2', text: 'Как называется распределение прибыли компании?', options: ['Кешбэк', 'Дивиденды', 'Кэш-флоу'], correctIndex: 1 }
      ]
    }
  ];
};

export const saveQuiz = async (quiz: Quiz) => {
  const quizzes = await fetchQuizzes();
  const index = quizzes.findIndex(q => q.id === quiz.id);
  if (index >= 0) {
    quizzes[index] = quiz;
  } else {
    quizzes.push(quiz);
  }
  localStorage.setItem('invest_club_quizzes', JSON.stringify(quizzes));
};

export const deleteQuiz = async (id: string) => {
  const quizzes = await fetchQuizzes();
  const filtered = quizzes.filter(q => q.id !== id);
  localStorage.setItem('invest_club_quizzes', JSON.stringify(filtered));
};

export const fetchUsers = async (): Promise<UserRegistration[]> => {
  // Mocking Google Sheets data
  return [
    { id: '1', userId: '1558532545', firstName: 'Egor', lastName: 'Invest', sheet: 'Main', status: 'active', timestamp: '2023-10-01' },
    { id: '2', userId: '1311275607', firstName: 'Ivan', lastName: 'Petrov', sheet: 'GazpromEvent', status: 'active', timestamp: '2023-11-05' },
    { id: '3', userId: '920336488', firstName: 'Daria', lastName: 'Ivanova', sheet: 'Activa', status: 'active', timestamp: '2023-12-10' }
  ];
};

export const sendTelegramBroadcast = async (group: string, message: string) => {
  console.log(`Sending broadcast to ${group}: ${message}`);
  // Real implementation: call Vercel API that uses TELEGRAM_TOKEN
  alert(`Рассылка для группы "${group}" успешно инициирована!`);
};

export const sendTelegramMessage = async (userId: string, message: string) => {
  console.log(`Sending DM to ${userId}: ${message}`);
  alert(`Сообщение пользователю ${userId} отправлено!`);
};
