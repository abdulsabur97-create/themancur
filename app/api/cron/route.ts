import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const EC_ID = process.env.EC_ID!;
const TEAM_ID = process.env.TEAM_ID!;
const OFFER_URL = 'https://themancur.ru';

const MSG_D1 = `Вчера ты зашёл, но так и не посмотрел до конца — я понимаю, жизнь закрутила 😅\n\nНо хочу сказать честно: нейросети уже сейчас забирают работу у тех, кто ими не пользуется. И дают хороший доход тем, кто умеет.\n\nТы на какой стороне хочешь быть?`;
const MSG_D2 = `Смотри, я не буду давить 🙂\n\nПросто факт: люди которые уже прошли через это — зарабатывают на нейросетях от 50.000₽ в месяц.\n\nОни не были программистами. Они просто решились и сделали первый шаг.`;
const MSG_D3 = `Пока ты думаешь — другие уже делают.\n\n«потом» обычно не наступает. А те кто начал сегодня — уже считают первые результаты.\n\nВыбор простой: остаться где ты сейчас или сделать один клик.`;
const MSG_D4 = `Это моё последнее сообщение тебе.\n\nЯ не буду больше напоминать — ты взрослый человек и сам принимаешь решения.\n\nНо если ты всё ещё думаешь "может потом" — знай: "потом" обычно не наступает.\n\nПоследний раз оставляю ссылку 👇`;

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

async function ecUpdate(userId: number, updates: any) {
  const items = await ecGet();
  const current = items.find((i: any) => i.key === `u_${userId}`)?.value || {};
  await fetch(`https://api.vercel.com/v1/edge-config/${EC_ID}/items?teamId=${TEAM_ID}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ operation: 'upsert', key: `u_${userId}`, value: { ...current, ...updates } }] }),
  });
}

async function getImg(key: string): Promise<string | null> {
  const items = await ecGet();
  return items.find((i: any) => i.key === `img_${key}`)?.value || null;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await ecGet();
  const now = Date.now();
  const H = 3600000;
  let sent = 0;

  for (const item of items) {
    if (!item.key.startsWith('u_')) continue;
    const u = item.value;
    const h = (now - u.joined) / H;

    if (h >= 24 && !u.d1) {
      const img = await getImg('d1');
      if (img) await sendPhoto(u.id, img, MSG_D1, { label: '👉 Досмотреть', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D1, { label: '👉 Досмотреть', url: OFFER_URL });
      await ecUpdate(u.id, { d1: true });
      sent++;
    } else if (h >= 48 && u.d1 && !u.d2) {
      const img = await getImg('d2');
      if (img) await sendPhoto(u.id, img, MSG_D2, { label: '👉 Твой шаг', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D2, { label: '👉 Твой шаг', url: OFFER_URL });
      await ecUpdate(u.id, { d2: true });
      sent++;
    } else if (h >= 72 && u.d2 && !u.d3) {
      const img = await getImg('d3');
      if (img) await sendPhoto(u.id, img, MSG_D3, { label: '👉 Сделать шаг', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D3, { label: '👉 Сделать шаг', url: OFFER_URL });
      await ecUpdate(u.id, { d3: true });
      sent++;
    } else if (h >= 96 && u.d3 && !u.d4) {
      const img = await getImg('d4');
      if (img) await sendPhoto(u.id, img, MSG_D4, { label: '👉 Урок бесплатно', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D4, { label: '👉 Урок бесплатно', url: OFFER_URL });
      await ecUpdate(u.id, { d4: true });
      sent++;
    }
    await new Promise(r => setTimeout(r, 40));
  }

  return NextResponse.json({ ok: true, sent });
}
