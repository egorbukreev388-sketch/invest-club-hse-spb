import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!SPREADSHEET_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tests',
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return NextResponse.json([]);
    }

    const tests = rows.slice(1).map((row, idx) => ({
      id: idx + 1,
      title: row[0] || 'Без названия',
      questions: row[1] ? JSON.parse(row[1]) : [],
    }));

    return NextResponse.json(tests);
  } catch (error: any) {
    console.error('Ошибка в /api/tests/list:', error);
    return NextResponse.json({ error: 'Failed to load tests' }, { status: 500 });
  }
}
