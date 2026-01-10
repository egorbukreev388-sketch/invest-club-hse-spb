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
    const { title, questions } = await req.json();
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tests',
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[title, JSON.stringify(questions), new Date().toISOString()]] },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Ошибка создания теста:', e);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}
