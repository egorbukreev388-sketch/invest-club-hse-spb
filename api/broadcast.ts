
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  const { group, userId, message } = req.body;

  if (!TELEGRAM_TOKEN) {
    return res.status(500).json({ message: 'TELEGRAM_TOKEN not configured' });
  }

  try {
    let targets = [];

    if (userId) {
      targets = [userId];
    } else if (group) {
      // Logic: Fetch all user IDs from Google Sheet that belong to 'group'
      // Mocking 1 user for demo
      targets = ['1558532545']; 
    }

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

    return res.status(200).json({ success: true, count: targets.length });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
