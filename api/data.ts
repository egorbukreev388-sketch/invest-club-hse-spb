
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

async function getDoc() {
  if (!SPREADSHEET_ID) throw new Error('Environment variable GOOGLE_SHEETS_ID is missing');
  if (!GOOGLE_SERVICE_ACCOUNT_KEY) throw new Error('Environment variable GOOGLE_SERVICE_ACCOUNT_KEY is missing');
  
  let credentials;
  try {
    credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch (e) {
    throw new Error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY. Ensure it is a valid JSON string.');
  }
  
  // Vercel environment variables can sometimes mess up the private key newlines
  const privateKey = credentials.private_key ? credentials.private_key.replace(/\\n/g, '\n') : '';

  if (!privateKey) throw new Error('Private key is missing in the service account JSON');

  const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { type } = req.query;
    console.log(`Request type: ${type}, Method: ${req.method}`);
    
    const doc = await getDoc();

    if (req.method === 'GET') {
      if (type === 'quizzes') {
        // Try named sheet "Quizzes", fallback to first sheet if not found
        const sheet = doc.sheetsByTitle['Quizzes'] || doc.sheetsByIndex[0];
        if (!sheet) return res.status(200).json([]);
        
        const rows = await sheet.getRows();
        const quizzes = rows.map(row => {
          try {
            return {
              id: row.get('id') || '',
              title: row.get('title') || 'Без названия',
              description: row.get('description') || '',
              questions: JSON.parse(row.get('questions') || '[]'),
              createdAt: row.get('createdAt') || ''
            };
          } catch (e) {
            console.error('Error parsing row:', row.toObject());
            return null;
          }
        }).filter(q => q !== null);
        
        return res.status(200).json(quizzes);
      }

      if (type === 'users') {
        // Try named sheet "Users", fallback to second sheet if not found
        const sheet = doc.sheetsByTitle['Users'] || (doc.sheetCount > 1 ? doc.sheetsByIndex[1] : null);
        if (!sheet) return res.status(200).json([]);

        const rows = await sheet.getRows();
        const users = rows.map(row => ({
          id: row.get('id') || '',
          userId: row.get('userId') || '',
          firstName: row.get('firstName') || '',
          lastName: row.get('lastName') || '',
          sheet: row.get('sheet') || 'Main',
          status: row.get('status') || 'active',
          timestamp: row.get('timestamp') || ''
        }));
        return res.status(200).json(users);
      }
    }

    if (req.method === 'POST') {
       // Future implementation for saving results
       return res.status(200).json({ success: true, message: 'Endpoint ready for data submission' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('API Error Details:', error.message);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      hint: 'Check Vercel logs and Google Sheets permissions for the service account email.'
    });
  }
}
