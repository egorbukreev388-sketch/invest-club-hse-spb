import axios from 'axios';
import { readSheet } from './googleSheets';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function sendMessage(chatId: string, text: string, keyboard?: any): Promise<boolean> {
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    };
    if (keyboard) payload.reply_markup = keyboard;
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, payload);
    return response.data.ok;
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error?.response?.data || error);
    return false;
  }
}

export async function sendPhotoWithCaption(chatId: string, photoUrl: string, caption: string): Promise<boolean> {
  try {
    const payload = { chat_id: chatId, photo: photoUrl, caption, parse_mode: 'Markdown' };
    const response = await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, payload);
    return response.data.ok;
  } catch (error) {
    console.error('Ошибка отправки фото:', error?.response?.data || error);
    return false;
  }
}

export async function checkUserStatus(chatId: string): Promise<'active' | 'blocked' | 'error'> {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, { chat_id: chatId, text: '.', disable_notification: true });
    return response.data.ok ? 'active' : 'blocked';
  } catch (error: any) {
    const desc = error.response?.data?.description || '';
    if (desc.includes('bot was blocked') || desc.includes('Forbidden') || desc.includes('user is deactivated')) return 'blocked';
    return 'error';
  }
}

export async function setWebhook(webhookUrl: string): Promise<boolean> {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    return response.data.ok;
  } catch (error) {
    console.error('Ошибка установки вебхука:', error?.response?.data || error);
    return false;
  }
}

export async function sendBroadcastToGroup(sheetName: string, messageText: string): Promise<{ sentCount: number, errorCount: number }> {
  try {
    const rows = await readSheet(sheetName);
    if (rows.length <= 1) return { sentCount: 0, errorCount: 0 };
    let sentCount = 0;
    let errorCount = 0;
    for (let i = 1; i < rows.length; i++) {
      const chatId = rows[i][1];
      if (chatId) {
        const status = await checkUserStatus(chatId);
        if (status === 'active') {
          const ok = await sendMessage(chatId, messageText);
          if (ok) sentCount++; else errorCount++;
        } else {
          errorCount++;
        }
        await new Promise(r => setTimeout(r, 100));
      }
    }
    return { sentCount, errorCount };
  } catch (error) {
    console.error('Ошибка рассылки:', error);
    return { sentCount: 0, errorCount: 0 };
  }
}

export async function sendMessageToUser(userId: string, messageText: string): Promise<{ success: boolean, error?: string }> {
  try {
    const success = await sendMessage(userId, messageText);
    return { success, error: success ? undefined : 'Не удалось отправить сообщение' };
  } catch (error) {
    console.error('Ошибка отправки личного сообщения:', error);
    return { success: false, error: String(error) };
  }
}
