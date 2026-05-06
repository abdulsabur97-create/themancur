import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const OFFER_URL = 'https://themancur.ru';

const MSG_D1 = `Вчера ты зашёл, но так и не посмотрел до конца — я понимаю, жизнь закрутила 😅\n\nНо хочу сказать честно: нейросети уже сейчас забирают работу у тех, кто ими не пользуется. И дают хороший доход тем, кто умеет.\n\nТы на какой стороне хочешь быть?`;
const MSG_D2 = `Смотри, я не буду давить 🙂\n\nПросто факт: люди которые уже прошли через это — зарабатывают на нейросетях от 50.000₽ в месяц.\n\nОни не были программистами. Они просто решились и сделали первый шаг.`;
const MSG_D3 = `Пока ты думаешь — другие уже делают.\n\n«потом» обычно не наступает. А те кто начал сегодня — уже считают первые результаты.\n\nВыбор простой: остаться где ты сейчас или сделать один клик.`;
const MSG_D4 = `Это моё последнее сообщение тебе.\n\nЯ не буду больше напоминать — ты взрослый человек и сам принимаешь решения.\n\nНо если ты всё ещё думаешь "может потом" — знай: "потом" обычно не наступает.\n\nПоследний раз оставляю ссылку 👇`;

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

async function getAllUsers(): Promise<any[]> {
  const keys: string[] = await redis(['KEYS', 'u_*']);
  if (!keys || keys.length === 0) return [];
  const values = await redisPipeline(keys.map(k => ['GET', k]));
  return values.map((v, i) => ({ key: keys[i], value: v ? JSON.parse(v) : null })).filter(u => u.value?.id);
}

async function getImg(key: string): Promise<string | null> {
  return await redis(['GET', `img_${key}`]);
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

export const dynamic = 'force-dynamic';

export async function GET() {
  const users = await getAllUsers();
  const now = Date.now();
  const H = 3600000;
  let sent = 0;

  for (const { value: u } of users) {
    const h = (now - u.joined) / H;
    let updated = false;

    if (h >= 24 && !u.d1) {
      const img = await getImg('d1');
      if (img) await sendPhoto(u.id, img, MSG_D1, { label: '👉 Досмотреть', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D1, { label: '👉 Досмотреть', url: OFFER_URL });
      u.d1 = true; updated = true; sent++;
    } else if (h >= 48 && u.d1 && !u.d2) {
      const img = await getImg('d2');
      if (img) await sendPhoto(u.id, img, MSG_D2, { label: '👉 Твой шаг', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D2, { label: '👉 Твой шаг', url: OFFER_URL });
      u.d2 = true; updated = true; sent++;
    } else if (h >= 72 && u.d2 && !u.d3) {
      const img = await getImg('d3');
      if (img) await sendPhoto(u.id, img, MSG_D3, { label: '👉 Сделать шаг', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D3, { label: '👉 Сделать шаг', url: OFFER_URL });
      u.d3 = true; updated = true; sent++;
    } else if (h >= 96 && u.d3 && !u.d4) {
      const img = await getImg('d4');
      if (img) await sendPhoto(u.id, img, MSG_D4, { label: '👉 Урок бесплатно', url: OFFER_URL });
      else await sendMsg(u.id, MSG_D4, { label: '👉 Урок бесплатно', url: OFFER_URL });
      u.d4 = true; updated = true; sent++;
    }

    if (updated) {
      await redis(['SET', `u_${u.id}`, JSON.stringify(u)]);
    }
    await new Promise(r => setTimeout(r, 40));
  }

  return NextResponse.json({ ok: true, sent });
}
