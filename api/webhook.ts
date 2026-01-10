
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  const update = req.body;
  if (!update.message) return res.status(200).send('OK');

  const chatId = update.message.chat.id;
  const text = update.message.text;

  if (text === '/start') {
    await sendMsg(chatId, "🐋 Привет! Добро пожаловать в *Invest Club HSE SPB*.\n\nЯ твой помощник. Здесь ты можешь регистрироваться на мероприятия и получать важные уведомления.");
  }

  // Handle registration logic here (saving to Google Sheets)

  return res.status(200).send('OK');
}

async function sendMsg(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
  });
}
