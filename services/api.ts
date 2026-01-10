
import { Quiz, UserRegistration } from '../types';

/**
 * All frontend requests now go to /api endpoints.
 * These endpoints interact with Google Sheets and Telegram.
 */

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await fetch('/api/data?type=quizzes');
    if (!response.ok) throw new Error('Failed to fetch quizzes');
    return await response.json();
  } catch (err) {
    console.error(err);
    // Fallback to local storage if API is down
    const saved = localStorage.getItem('invest_club_quizzes');
    return saved ? JSON.parse(saved) : [];
  }
};

export const saveQuiz = async (quiz: Quiz) => {
  const response = await fetch('/api/data?type=quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quiz),
  });
  if (!response.ok) throw new Error('Failed to save quiz');
};

export const deleteQuiz = async (id: string) => {
  const response = await fetch(`/api/data?type=quizzes&id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete quiz');
};

export const fetchUsers = async (): Promise<UserRegistration[]> => {
  try {
    const response = await fetch('/api/data?type=users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const sendTelegramBroadcast = async (group: string, message: string) => {
  const response = await fetch('/api/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group, message }),
  });
  
  if (response.ok) {
    alert(`Рассылка для группы "${group}" успешно отправлена!`);
  } else {
    const err = await response.json();
    alert(`Ошибка рассылки: ${err.message || 'Неизвестная ошибка'}`);
  }
};

export const sendTelegramMessage = async (userId: string, message: string) => {
  const response = await fetch('/api/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, message }),
  });
  
  if (response.ok) {
    alert(`Сообщение пользователю ${userId} отправлено!`);
  } else {
    alert('Ошибка при отправке сообщения');
  }
};
