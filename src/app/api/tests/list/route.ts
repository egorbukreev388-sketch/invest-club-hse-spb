import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function GET() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tests',
    });
    const rows = res.data.values || [];
    const tests = rows.slice(1).map((row, idx) => ({
      id: idx + 1,
      title: row[0],
      questions: JSON.parse(row[1] || '[]'),
    }));
    return NextResponse.json(tests);
  } catch (e) {
    console.error('Ошибка загрузки тестов:', e);
    return NextResponse.json({ error: 'Failed to load tests' }, { status: 500 });
  }
}
