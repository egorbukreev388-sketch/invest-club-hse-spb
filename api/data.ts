
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

async function getDoc() {
  const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY!);
  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { type } = req.query;
    const doc = await getDoc();

    if (req.method === 'GET') {
      if (type === 'quizzes') {
        const sheet = doc.sheetsByTitle['Quizzes'] || doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        const quizzes = rows.map(row => ({
          id: row.get('id'),
          title: row.get('title'),
          description: row.get('description'),
          questions: JSON.parse(row.get('questions') || '[]'),
          createdAt: row.get('createdAt')
        }));
        return res.status(200).json(quizzes);
      }

      if (type === 'users') {
        const sheet = doc.sheetsByTitle['Users'] || doc.sheetsByIndex[1];
        const rows = await sheet.getRows();
        const users = rows.map(row => ({
          id: row.get('id'),
          userId: row.get('userId'),
          firstName: row.get('firstName'),
          lastName: row.get('lastName'),
          sheet: row.get('sheet') || 'Main',
          status: row.get('status') || 'active',
          timestamp: row.get('timestamp')
        }));
        return res.status(200).json(users);
      }
    }

    if (req.method === 'POST') {
      // Здесь можно добавить логику записи
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
