import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Просто подтверждаем получение — без работы с таблицами
  try {
    const update = await req.json();
    console.log('Webhook received:', update.message?.text || 'callback');
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
