import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const GOOGLE_SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!SPREADSHEET_ID || !GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ error: 'Missing test ID' }, { status: 400 });
    }

    const testIndex = parseInt(idStr, 10);
    if (isNaN(testIndex) || testIndex < 1) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 });
    }

    // Индекс строки в Google Таблице: заголовок (1) + тесты (начинаются с 2)
    const rowIndex = testIndex + 1;

    const credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `Tests!A${rowIndex}:C${rowIndex}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ошибка в /api/tests/delete:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
