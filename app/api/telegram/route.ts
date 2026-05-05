import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const EC_ID = process.env.EC_ID!;
const TEAM_ID = process.env.TEAM_ID!;
const OFFER_URL = 'https://themancur.ru';
const ADMIN_ID = '1703248826';

async function sendPhoto(chatId: number, fileId: string, caption: string, button?: { label: string; url: string }) {
  const body: any = { chat_id: chatId, photo: fileId, caption, parse_mode: 'HTML' };
  if (button) body.reply_markup = { inline_keyboard: [[{ text: button.label, url: button.url }]] };
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}

async function sendMsg(chatId: number, text: string, button?: { label: string; url: string }) {
  const body: any = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (button) body.reply_markup = { inline_keyboard: [[{ text: button.label, url: button.url }]] };
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
}

async function ecGet(): Promise<any[]> {
  const r = await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=${TEAM_ID}`,
    { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

async function ecPatch(items: any[]) {
  await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=${TEAM_ID}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
}

async function getImg(key: string): Promise<string | null> {
  const items = await ecGet();
  return items.find((i: any) => i.key === `img_${key}`)?.value || null;
}

async function sendWelcome(userId: number) {
  const imgMain = await getImg('main');
  const caption = `👋 Привет! Рад что ты здесь.\n\nЯ подготовил для тебя кое-что важное — как зарабатывать с помощью нейросетей, даже если ты никогда ими не пользовался.\n\nБез технических знаний. Без опыта. Просто бери и делай.\n\n🔥 Нажми на кнопку ниже, переходи на сайт и забирай свой тариф.`;
  const btn = { label: '👉 Перейти на сайт', url: OFFER_URL };
  if (imgMain) await sendPhoto(userId, imgMain, caption, btn);
  else await sendMsg(userId, caption, btn);
}

export async function POST(req: NextRequest) {
  const update = await req.json();
  if (!update.message) return NextResponse.json({ ok: true });
  const { message: msg } = update;
  const userId = msg.from.id;
  const text = (msg.text || msg.caption || '').trim();

  // Загрузка картинки: отправь фото с подписью /setimg main
  if (text.startsWith('/setimg ') && userId.toString() === ADMIN_ID && msg.photo) {
    const key = text.slice(8).trim();
    if (['main','d1','d2','d3','d4'].includes(key)) {
      const fileId = msg.photo[msg.photo.length - 1].file_id;
      await ecPatch([{ operation: 'upsert', key: `img_${key}`, value: fileId }]);
      await sendMsg(userId, `✅ Картинка <b>${key}</b> сохранена!`);
    }
    return NextResponse.json({ ok: true });
  }

  if (text === '/imgs' && userId.toString() === ADMIN_ID) {
    const items = await ecGet();
    let status = '🖼 <b>Статус картинок:</b>\n\n';
    for (const k of ['main','d1','d2','d3','d4']) {
      status += items.find((i: any) => i.key === `img_${k}`) ? `✅ ${k}\n` : `❌ ${k} — не загружена\n`;
    }
    await sendMsg(userId, status);
    return NextResponse.json({ ok: true });
  }

  if (text === '/myid') {
    await sendMsg(userId, `🆔 Твой Telegram ID: <b>${userId}</b>`);
    return NextResponse.json({ ok: true });
  }

  if (text === '/stats' && userId.toString() === ADMIN_ID) {
    const items = await ecGet();
    const count = items.filter((i: any) => i.key.startsWith('u_')).length;
    await sendMsg(userId, `📊 Подписчиков в базе: <b>${count}</b>`);
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith('/broadcast ') && userId.toString() === ADMIN_ID) {
    const broadcastText = text.slice(11);
    const items = await ecGet();
    const users = items.filter((i: any) => i.key.startsWith('u_'));
    for (const item of users) {
      try { await sendMsg(item.value.id, broadcastText); await new Promise(r => setTimeout(r, 50)); } catch {}
    }
    await sendMsg(userId, `✅ Отправлено ${users.length} пользователям`);
    return NextResponse.json({ ok: true });
  }

  // Регистрируем любого кто пишет боту
  const items = await ecGet();
  const alreadyRegistered = items.some((i: any) => i.key === `u_${userId}`);
  if (!alreadyRegistered) {
    await ecPatch([{ operation: 'upsert', key: `u_${userId}`, value: {
      id: userId, name: msg.from.first_name || '', joined: Date.now(), d1: false, d2: false, d3: false, d4: false,
    }}]);
    await sendWelcome(userId);
  } else if (text === '/start' || text.startsWith('/start ')) {
    await sendWelcome(userId);
  }

  return NextResponse.json({ ok: true });
}
