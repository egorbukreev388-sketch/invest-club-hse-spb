import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!SPREADSHEET_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const { testId, userId, answers } = await req.json();

    if (typeof testId !== 'number' || typeof userId !== 'string' || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'TestResults',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[testId, userId, JSON.stringify(answers), new Date().toISOString()]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ошибка в /api/tests/save:', error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
