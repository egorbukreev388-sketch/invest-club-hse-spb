import { NextRequest, NextResponse } from 'next/server';
import { updateAttendance } from '@/lib/googleSheets';
import { sendMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (update.callback_query) {
      const chatId = String(update.callback_query.from.id);
      const data = update.callback_query.data as string;
      if (data.startsWith('attendance_')) {
        const [, , targetChatId] = data.split('_');
        const recordText = data.includes('yes') ? '✅ Придет' : '❌ Не придет';
        await updateAttendance(targetChatId, recordText);
        await sendMessage(targetChatId, data.includes('yes') ? '🎉 Супер! Ждем тебя!' : '😢 Жаль, что не сможешь прийти!');
      }
      return NextResponse.json({ ok: true });
    }

    if (!update.message) return NextResponse.json({ ok: true });

    const chatId = String(update.message.chat.id);
    const text = update.message.text || '';

    if (text === '/start') {
      await sendMessage(chatId, 'Привет! Добро пожаловать в Invest Club HSE SPB!');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ошибка вебхука:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
