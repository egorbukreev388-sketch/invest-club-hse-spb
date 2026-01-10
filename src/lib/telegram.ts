// src/lib/telegram.ts
import axios from 'axios';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function sendMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const res = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    });
    return res.data.ok;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Telegram send error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return false;
  }
}

// Другие функции (sendPhotoWithCaption и т.д.) — аналогично
