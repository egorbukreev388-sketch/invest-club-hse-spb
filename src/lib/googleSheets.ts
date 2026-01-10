import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Используем credentials из переменной среды или файл, который вы добавите локально.
let authClient: any;

if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    authClient = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  } catch (err) {
    console.warn('Не удалось распарсить GOOGLE_SERVICE_ACCOUNT_KEY');
  }
} else {
  authClient = new google.auth.GoogleAuth({
    scopes: SCOPES,
  });
}

const sheets = google.sheets({ version: 'v4', auth: authClient });

export async function readSheet(sheetName: string): Promise<any[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];
    return rows;
  } catch (error) {
    console.error('Ошибка чтения листа:', error);
    throw error;
  }
}

export async function appendToSheet(sheetName: string, values: any[]): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
  } catch (error) {
    console.error('Ошибка записи в лист:', error);
    throw error;
  }
}

export async function updateRow(sheetName: string, rowIndex: number, values: any[]): Promise<void> {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });
  } catch (error) {
    console.error('Ошибка обновления строки:', error);
    throw error;
  }
}

export async function getSheetHeaders(sheetName: string): Promise<string[]> {
  const rows = await readSheet(sheetName);
  return rows.length > 0 ? rows[0] : [];
}

export async function findUserByChatId(sheetName: string, chatId: string): Promise<{ row: number, data: any[] } | null> {
  const rows = await readSheet(sheetName);
  if (rows.length <= 1) return null;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] == chatId) {
      return { row: i + 1, data: rows[i] };
    }
  }
  return null;
}

export async function updateAttendance(chatId: string, status: string): Promise<void> {
  const sheetName = 'GazpromEvent';
  const rows = await readSheet(sheetName);
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1] == chatId) {
      const updatedRow = [...rows[i]];
      updatedRow[5] = status;
      await updateRow(sheetName, i + 1, updatedRow);
      return;
    }
  }
  throw new Error(`Пользователь с ID ${chatId} не найден`);
}

export async function getAllTests(): Promise<any[]> {
  const rows = await readSheet('Tests');
  if (rows.length <= 1) return [];
  return rows.slice(1).map((row, idx) => ({
    id: idx + 1,
    title: row[0],
    questions: JSON.parse(row[1] || '[]'),
    createdAt: row[2],
  }));
}

export async function createTest(title: string, questions: any[]): Promise<void> {
  await appendToSheet('Tests', [title, JSON.stringify(questions), new Date().toISOString()]);
}

export async function deleteTest(index: number): Promise<void> {
  const sheet = google.sheets({ version: 'v4', auth: authClient }).spreadsheets;
  await sheet.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `Tests!A${index + 2}:C${index + 2}`,
  });
}

export async function saveTestResult(testId: number, userId: string, answers: any[]): Promise<void> {
  await appendToSheet('TestResults', [testId, userId, JSON.stringify(answers), new Date().toISOString()]);
}

