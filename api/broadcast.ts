
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { group, userId, message } = req.body;

  if (!TELEGRAM_TOKEN) return res.status(500).json({ error: 'Token missing' });

  try {
    const targets = userId ? [userId] : [];
    
    // В реальном приложении здесь был бы поиск всех ID по группе в Google Sheets
    // Если userId нет, но есть group, мы бы достали список из таблицы Users
    
    for (const id of targets) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: id,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
