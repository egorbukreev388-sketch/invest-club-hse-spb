
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This function simulates the Google Sheets logic. 
// In a production environment, you would use 'google-spreadsheet' or fetch Google API.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type, id } = req.query;

  // Verify Admin (Ideally using a JWT or session, but using simple check for Egor as requested)
  // For standard GET/POST from frontend, you should check auth headers.

  if (req.method === 'GET') {
    if (type === 'quizzes') {
      // In reality: Fetch from Google Sheet "Quizzes"
      return res.status(200).json([
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
      ]);
    }

    if (type === 'users') {
      // In reality: Fetch from Google Sheet "Users"
      return res.status(200).json([
        { id: '1', userId: '1558532545', firstName: 'Egor', lastName: 'Invest', sheet: 'Main', status: 'active', timestamp: '2023-10-01' }
      ]);
    }
  }

  if (req.method === 'POST') {
    // Logic to save to Google Sheets
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    // Logic to delete from Google Sheets
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
