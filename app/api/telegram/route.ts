import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const OFFER_URL = 'https://themancur.ru';
const ADMIN_ID = '1703248826';

async function redis(command: any[]): Promise<any> {
  const r = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await r.json();
  return data.result;
}

async function redisPipeline(commands: any[][]): Promise<any[]> {
  const r = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  const data = await r.json();
  return data.map((d: any) => d.result);
}

async function getUser(userId: number): Promise<any | null> {
  const raw = await redis(['GET', `u_${userId}`]);
  return raw ? JSON.parse(raw) : null;
}

async function setUser(userId: number, data: any): Promise<void> {
  await redis(['SET', `u_${userId}`, JSON.stringify(data)]);
}

async function getImg(key: string): Promise<string | null> {
  return await redis(['GET', `img_${key}`]);
}

async function getAllUsers(): Promise<any[]> {
  const keys: string[] = await redis(['KEYS', 'u_*']);
  if (!keys || keys.length === 0) return [];
  const values = await redisPipeline(keys.map(k => ['GET', k]));
  return values.map((v, i) => ({ key: keys[i], value: v ? JSON.parse(v) : null })).filter(u => u.value?.id);
}

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
      await redis(['SET', `img_${key}`, fileId]);
      await sendMsg(userId, `✅ Картинка <b>${key}</b> сохранена!`);
    }
    return NextResponse.json({ ok: true });
  }

  if (text === '/imgs' && userId.toString() === ADMIN_ID) {
    let status = '🖼 <b>Статус картинок:</b>\n\n';
    for (const k of ['main','d1','d2','d3','d4']) {
      const v = await getImg(k);
      status += v ? `✅ ${k}\n` : `❌ ${k} — не загружена\n`;
    }
    await sendMsg(userId, status);
    return NextResponse.json({ ok: true });
  }

  if (text === '/myid') {
    await sendMsg(userId, `🆔 Твой Telegram ID: <b>${userId}</b>`);
    return NextResponse.json({ ok: true });
  }

  if (text === '/stats' && userId.toString() === ADMIN_ID) {
    const keys: string[] = await redis(['KEYS', 'u_*']);
    await sendMsg(userId, `📊 Подписчиков в базе: <b>${keys?.length || 0}</b>`);
    return NextResponse.json({ ok: true });
  }

  if (text.startsWith('/broadcast ') && userId.toString() === ADMIN_ID) {
    const broadcastText = text.slice(11);
    const users = await getAllUsers();
    for (const u of users) {
      try { await sendMsg(u.value.id, broadcastText); await new Promise(r => setTimeout(r, 50)); } catch {}
    }
    await sendMsg(userId, `✅ Отправлено ${users.length} пользователям`);
    return NextResponse.json({ ok: true });
  }

  // Регистрируем любого кто пишет боту
  const existing = await getUser(userId);
  if (!existing) {
    await setUser(userId, {
      id: userId, name: msg.from.first_name || '', joined: Date.now(), d1: false, d2: false, d3: false, d4: false,
    });
    await sendWelcome(userId);
  } else if (text === '/start' || text.startsWith('/start ')) {
    await sendWelcome(userId);
  }

  return NextResponse.json({ ok: true });
}
