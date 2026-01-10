import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;
const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export async function POST(req: NextRequest) {
  try {
    const { testId, userId, answers } = await req.json();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'TestResults',
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[testId, userId, JSON.stringify(answers), new Date().toISOString()]] },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Ошибка сохранения результата:', e);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}
