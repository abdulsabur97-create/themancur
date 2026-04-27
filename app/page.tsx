'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Zap, Cpu, FileText, Layers, Target, Sparkles } from 'lucide-react';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import { VideoSpotlight } from '@/components/ui/video-spotlight';
import { GradientDots } from '@/components/ui/gradient-dots';
import { NeonButton } from '@/components/ui/neon-button';
import { SuccessIcon, HeartIcon, ToggleIcon, DownloadDoneIcon } from '@/components/ui/animated-state-icons';
import { QuestionChat } from '@/components/ui/question-chat';

const Hero = dynamic(() => import('@/components/ui/animated-shader-hero'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0C0501 0%, #1a0800 50%, #0C0501 100%)' }}>
      <div className="text-center px-4">
        <div className="text-5xl md:text-7xl font-bold mb-4" style={{ background: 'linear-gradient(90deg,#fb923c,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Зарабатывай на ИИ
        </div>
        <div className="text-5xl md:text-7xl font-bold" style={{ background: 'linear-gradient(90deg,#fbbf24,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          уже через 7 дней
        </div>
      </div>
    </div>
  ),
});

// ─── palette ──────────────────────────────────────────────
const P = {
  bg0:    '#080502',   // deepest
  bg1:    '#0C0804',   // warm section
  bg2:    '#100A05',   // alternate section
  card:   '#180D04',   // card bg
  cardHov:'#231205',
  border: 'rgba(249,115,22,0.14)',
  borderB:'rgba(249,115,22,0.28)',
  glow:   'rgba(249,115,22,0.07)',
  accent: '#F97316',
  accentL:'#FB923C',
  accentD:'#C2410C',
  text:   '#F5EDE0',
  dim:    '#C4A882',
  muted:  '#7A5F3A',
  faint:  '#3D2810',
} as const;

type AProps = { delay?: number; className?: string; style?: React.CSSProperties; children: React.ReactNode };
function A({ className, style, delay = 0.1, children }: AProps) {
  const skip = useReducedMotion();
  if (skip) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7 }}
      className={className} style={style}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase font-semibold mb-3" style={{ color: P.accent, letterSpacing: '0.18em' }}>
      {children}
    </p>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 leading-tight" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: P.text, letterSpacing: '0.02em' }}>
      {children}
    </h2>
  );
}
function Divider() {
  return (
    <div className="max-w-2xl mx-auto px-6">
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.border} 30%, ${P.border} 70%, transparent)` }} />
    </div>
  );
}

// ─── data ─────────────────────────────────────────────────
const courseFeatures = [
  { title: 'Услуги ИИ-специалиста', icon: Sparkles, description: '8+ готовых услуг с реальными ценами, которые можно продавать бизнесам прямо сейчас.' },
  { title: 'Claude — сайт за 1 час',  icon: Cpu,      description: 'Создаём полноценный продающий сайт за час и продаём услугу за 3 000–10 000 ₽.' },
  { title: 'Коммерческие предложения', icon: FileText,  description: 'Связка Claude + ChatGPT: продающее КП за 20–30 минут. Одно КП — 2 000–5 000 ₽.' },
  { title: 'Карусели для соцсетей',    icon: Layers,    description: 'ChatGPT + Canva + Midjourney. Карусель за 30 минут — 1 500–3 000 ₽ за штуку.' },
  { title: 'Поиск и закрытие клиентов',icon: Target,    description: 'Топ-5 каналов, скрипты переписок и стратегия выхода на 100 000 ₽ в первый месяц.' },
  { title: 'Первые деньги за 7–14 дней',icon: Zap,      description: 'Каждый урок — это готовая услуга. Без портфолио, без опыта, без вложений в рекламу.' },
];

const PRICE_BASIC = '2 990 ₽';
const PRICE_PRO   = '3 990 ₽';
const PRICE_VIP   = '8 990 ₽';

const lessons = [
  { number: '01', title: 'Услуги ИИ-специалиста — что продавать бизнесу', description: 'Разберём, какие конкретные услуги вы можете предлагать бизнесам и экспертам уже сегодня. Никакой теории — только живые примеры и реальные чеки. Узнаем, какие задачи бизнес готов делегировать ИИ-специалисту и сколько за это платить.', tags: ['8+ услуг с ценами', 'Позиционирование', 'Реальные кейсы', 'Как не демпинговать'] },
  { number: '02', title: 'Как создать контент-план с помощью ИИ', description: 'Покажу как создавать профессиональные контент-планы для бизнеса с помощью ИИ. Один контент-план можно продавать за 1 000–3 000 ₽ и делать несколько штук в день. Быстро, системно, с гарантированным результатом для клиента.', tags: ['Структура контент-плана', 'Инструменты ИИ', 'Готовые шаблоны', 'Как назначать цену'] },
  { number: '03', title: 'Создаём карусели с помощью ИИ', description: 'Карусели — самый вирусный формат в соцсетях. Покажу полный процесс: от идеи до готового дизайна. Услугу легко продавать за 1 500–3 000 ₽ за штуку, а делать — за 30 минут.', tags: ['Идеи через ChatGPT', 'Тексты и сценарии', 'Дизайн в Canva + Midjourney', 'Продажа пакетами'] },
  { number: '04', title: 'Claude — полный обзор и создание сайта за 1 час', description: 'Практический урок по работе с Claude. За один час создадим полноценный продающий сайт для клиента. Покажу все фишки, которые превращают Claude из чат-бота в полноценный инструмент заработка.', tags: ['Возможности Claude', 'Пошаговое создание сайта', 'Шаблоны промтов', 'Упаковка и продажа услуги'] },
  { number: '05', title: 'Где найти клиента и закрыть его на оплату', description: 'Самый практичный урок. Где искать клиентов и как закрывать их на деньги. Рабочие каналы, скрипты переписок и реальные подходы, которые мы с учениками используем прямо сейчас.', tags: ['Топ-5 каналов поиска', 'Скрипты переписок', 'Как презентовать услугу', 'Стратегия на 100 000 ₽'] },
];

const results = [
  { name: 'Нисо',     amount: '180 000 ₽', period: '' },
  { name: 'Карина',   amount: '90 000 ₽',  period: '' },
  { name: 'Юсуф',     amount: '90 000 ₽',  period: '' },
  { name: 'Хабибулла',amount: '80 000+ ₽', period: '' },
  { name: 'Али',      amount: '62 000 ₽',  period: '' },
  { name: 'Мухаммад', amount: '60 000 ₽',  period: '' },
];

const faqs = [
  { q: 'Нужен ли опыт в ИИ или программировании?', a: 'Нет. Курс рассчитан на полных новичков. Если ты умеешь пользоваться смартфоном и интернетом — этого достаточно. Начинаем с нуля.' },
  { q: 'За сколько времени заработать первые деньги?', a: 'Большинство учеников получают первый оплаченный заказ в течение 7–14 дней после прохождения курса. Всё зависит от твоей активности.' },
  { q: 'Нужно ли платить за ChatGPT или Claude?', a: 'За Claude нужно будет заплатить — около 2 000 ₽ в месяц в зависимости от региона. Этого тарифа полностью достаточно для всех задач курса. ChatGPT платить не обязательно — бесплатной версии хватит. Если хочешь, можешь перейти на платный план, но большинство задач решается бесплатно.' },
  { q: 'Чем тарифы отличаются друг от друга?', a: '«Базовый» (2 990 ₽) — 3 урока: услуги, контент-план и карусели. «Премиум» (3 990 ₽) — все 5 уроков, включая Claude-сайт и поиск клиентов. «VIP» (8 990 ₽) — все 5 уроков + личная сессия со мной и пошаговый план до 100 000 ₽.' },
  { q: 'Можно ли вернуть деньги?', a: 'Да. Если ты внедришь всё, что показано в курсе, и не получишь результат — вернём всю сумму в течение 1 месяца. Без лишних вопросов.' },
  { q: 'Это основной доход или подработка?', a: 'Зависит от тебя. Многие ученики начинали с подработки и вышли на 100 000+ ₽ в месяц. Курс даёт систему — ты решаешь, как её применять.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="cursor-pointer group"
      style={{ borderBottom: `1px solid ${P.border}` }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center py-5 gap-4">
        <span className="text-base font-medium transition-colors leading-snug" style={{ color: open ? P.accentL : P.dim }}>
          {q}
        </span>
        <span
          className="flex-shrink-0 transition-transform duration-300 text-xl font-light"
          style={{ color: P.accent, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >+</span>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
        >
          <div className="pb-5 text-sm leading-relaxed" style={{ color: P.muted }}>{a}</div>
        </motion.div>
      )}
    </div>
  );
}

function OfertaModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-8"
        style={{ background: '#140C04', border: `1px solid rgba(249,115,22,0.25)`, boxShadow: '0 0 60px rgba(249,115,22,0.08)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-orange-500/10 text-lg"
          style={{ color: '#7A5F3A' }}
        >✕</button>

        <h2 style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1.8rem', color: '#F5EDE0', letterSpacing: '0.04em', marginBottom: 4 }}>
          ДОГОВОР ПУБЛИЧНОЙ ОФЕРТЫ
        </h2>
        <p className="text-xs mb-8" style={{ color: '#7A5F3A' }}>на оказание информационно-консультационных услуг</p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#C4A882' }}>
          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
            <p>1.1. Настоящий документ является публичной офертой Уммалатова Мансура (далее — Исполнитель, ИНН: 201403510971) и содержит все существенные условия оказания информационно-консультационных услуг в форме онлайн-курса.</p>
            <p className="mt-2">1.2. Акцептом настоящей оферты является факт оплаты услуг Исполнителя. С момента оплаты договор считается заключённым.</p>
            <p className="mt-2">1.3. Оферта размещена на сайте и действует бессрочно до её отзыва Исполнителем.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>2. ПРЕДМЕТ ДОГОВОРА</p>
            <p>2.1. Исполнитель обязуется предоставить Заказчику доступ к онлайн-курсу «Зарабатывай на ИИ уже через 7 дней» в объёме выбранного тарифа.</p>
            <p className="mt-2">2.2. Услуги оказываются дистанционно посредством предоставления доступа к видеоматериалам, текстовым материалам и шаблонам.</p>
            <p className="mt-2">2.3. Доступ к материалам предоставляется в течение 24 часов с момента подтверждения оплаты.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>3. СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ</p>
            <p>3.1. Стоимость услуг определяется выбранным тарифом на момент оплаты:</p>
            <p className="mt-2">— Тариф «Базовый»: 2 990 рублей;</p>
            <p>— Тариф «Премиум»: 3 990 рублей;</p>
            <p>— Тариф «VIP»: 8 990 рублей.</p>
            <p className="mt-2">3.2. Оплата производится в рублях РФ через платёжные системы, указанные на сайте.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>4. ПРАВА И ОБЯЗАННОСТИ СТОРОН</p>
            <p>4.1. Исполнитель обязуется предоставить доступ к материалам курса в соответствии с выбранным тарифом.</p>
            <p className="mt-2">4.2. Заказчик обязуется использовать материалы только в личных целях. Перепродажа, копирование и распространение материалов третьим лицам запрещены.</p>
            <p className="mt-2">4.3. Исполнитель вправе вносить изменения в материалы курса, не снижающие его качества.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>5. ВОЗВРАТ ДЕНЕЖНЫХ СРЕДСТВ</p>
            <p>5.1. Заказчик вправе потребовать возврата полной стоимости в течение 7 (семи) календарных дней с момента оплаты, если не воспользовался более чем одним уроком курса.</p>
            <p className="mt-2">5.2. Для возврата необходимо направить заявку в Telegram: <span style={{ color: '#FB923C' }}>@themmancur</span>.</p>
            <p className="mt-2">5.3. Возврат осуществляется в течение 10 рабочих дней на реквизиты, с которых была произведена оплата.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>6. ОТВЕТСТВЕННОСТЬ</p>
            <p>6.1. Исполнитель не гарантирует конкретный финансовый результат от прохождения курса. Результат зависит от личных усилий и действий Заказчика.</p>
            <p className="mt-2">6.2. Ответственность Исполнителя ограничена стоимостью оплаченных услуг.</p>
          </section>

          <section>
            <p className="font-semibold mb-2" style={{ color: '#F5EDE0' }}>7. РЕКВИЗИТЫ ИСПОЛНИТЕЛЯ</p>
            <p>Поставщик: Уммалатов Мансур</p>
            <p className="mt-1">ИНН: 201403510971</p>
            <p className="mt-1">Контакт: <span style={{ color: '#FB923C' }}>@themmancur</span> (Telegram)</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const scrollToPricing = () => pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  const [ofertaOpen, setOfertaOpen] = useState(false);

  return (
    <>
    <AnimatePresence>
      {ofertaOpen && <OfertaModal onClose={() => setOfertaOpen(false)} />}
    </AnimatePresence>
    <main style={{ background: P.bg0, color: P.text, fontFamily: "'Montserrat', sans-serif" }} className="min-h-screen overflow-x-hidden">

      {/* ── STICKY NAV ──────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(8,5,2,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${P.border}` }}
      >
        <span style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1.1rem', letterSpacing: '0.12em', color: P.accentL }}>
          МАНСУР · ИИ-КУРС
        </span>
        <NeonButton variant="default" size="sm" onClick={scrollToPricing}>
          Купить курс
        </NeonButton>
      </nav>

      {/* ── HERO (НЕ ТРОГАЕМ) ───────────────────────────── */}
      <Hero
        trustBadge={{ text: 'Уже более 20 учеников заработали первые деньги с ИИ', icons: ['⭐','⭐','⭐','⭐','⭐'] }}
        headline={{ line1: 'Зарабатывай на ИИ', line2: 'уже через 7 дней' }}
        subtitle="5 уроков о том, как продавать услуги на основе ChatGPT и Claude — бизнесам, которые уже ищут таких специалистов"
        buttons={{
          primary:   { text: 'Начать за 2 990 ₽', onClick: scrollToPricing },
          secondary: { text: 'Смотреть урок ▶', onClick: () => {
            document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any)._wq = (window as any)._wq || [];
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any)._wq.push({ id: '59xz7v37fo', onReady: (video: any) => video.play() });
            }, 600);
          }},
        }}
      />

      {/* ── VIDEO ───────────────────────────────────────── */}
      <div id="video-section">
      <VideoSpotlight
        src="https://fast.wistia.net/embed/iframe/59xz7v37fo"
        label="СМОТРИ"
        title="КАК ЭТО РАБОТАЕТ НА ПРАКТИКЕ"
        subtitle=""
      />
      </div>

      {/* ── NARRATIVE ───────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden" style={{ background: P.bg1 }}>
        <div className="relative z-10 max-w-2xl mx-auto">
          <A>
            <Label>ЧЕСТНО</Label>
            <div className="space-y-6 text-lg leading-relaxed">
              <p style={{ color: P.text, fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.5 }}>
                ИИ уже меняет рынок. Вопрос — с какой стороны ты стоишь.
              </p>
              <p style={{ color: P.dim }}>
                Бизнесы платят за сайты, коммерческие предложения, карусели и контент-планы. Раньше на это уходили недели. Теперь — часы. И они ищут людей, которые умеют делать это быстро через ИИ.
              </p>
              <p style={{ color: P.dim }}>
                Ты уже пользуешься ChatGPT или Claude. Ты видишь, насколько это мощно. Но ты ещё не продаёшь это другим. Вот где деньги.
              </p>
              <p style={{ color: P.dim }}>
                Этот курс — не про теорию. Это конкретные услуги, конкретные инструменты и конкретные шаги, которые приводят к первым оплатам. У меня и моих учеников это работает прямо сейчас.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: `rgba(249,115,22,0.15)`, color: P.accent, border: `1px solid ${P.border}` }}>М</div>
              <div>
                <p className="font-semibold text-sm" style={{ color: P.text }}>Мансур</p>
                <p className="text-xs" style={{ color: P.muted }}>2+ млн ₽ заработано на ИИ и контенте · 41 000 подписчиков</p>
              </div>
            </div>
          </A>
        </div>
      </section>

      <Divider />

      {/* ── WHAT YOU GET ────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: P.bg2 }}>
        {/* orange top glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-48" style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 70%)` }} />
        <div className="relative z-10 mx-auto w-full max-w-5xl space-y-10">
          <A className="max-w-2xl mx-auto">
            <Label>ЧТО ВНУТРИ</Label>
            <SectionTitle>5 ПОЛНОЦЕННЫХ БЛОКОВ</SectionTitle>
            <p style={{ color: P.muted }}>
              Каждый урок — это готовая услуга, которую ты можешь продавать бизнесам сразу после просмотра.
            </p>
          </A>

          {/* stats */}
          <A delay={0.2} className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[{ v: '5', l: 'уроков' }, { v: '4', l: 'ИИ-инструмента' }, { v: '∞', l: 'доступ навсегда' }].map((s, i) => (
              <div key={i} className="text-center py-5 px-3 rounded-2xl" style={{ background: P.card, border: `1px solid ${P.border}` }}>
                <div style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '2.2rem', color: P.accent, lineHeight: 1 }}>{s.v}</div>
                <div className="text-xs mt-2" style={{ color: P.muted }}>{s.l}</div>
              </div>
            ))}
          </A>

          <A delay={0.35}
            className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
            style={{ borderColor: P.border }}
          >
            {courseFeatures.map((f, i) => (
              <FeatureCard key={i} patternIndex={i} feature={f} style={{ background: P.card, color: P.text, borderColor: P.border }} />
            ))}
          </A>
        </div>
      </section>

      <Divider />

      {/* ── LESSONS ─────────────────────────────────────── */}
      <section id="program" className="py-24 px-6" style={{ background: P.bg1 }}>
        <div className="max-w-2xl mx-auto">
          <A>
            <Label>ПРОГРАММА</Label>
            <SectionTitle>ЧТО МЫ РАЗБЕРЁМ</SectionTitle>
          </A>
          <div className="space-y-0 mt-4">
            {lessons.map((lesson, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="py-8 group"
                style={{ borderBottom: `1px solid ${P.border}` }}
              >
                <div className="flex gap-6 items-start">
                  <span style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1rem', color: P.accentD, letterSpacing: '0.08em', minWidth: '2rem', marginTop: 2 }}>
                    {lesson.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="mb-3 leading-tight group-hover:text-orange-300 transition-colors" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: P.text, letterSpacing: '0.02em' }}>
                      {lesson.title}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: P.muted }}>{lesson.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {lesson.tags.map((tag, j) => (
                        <span key={j} className="text-xs px-3 py-1 rounded-full" style={{ background: `rgba(249,115,22,0.08)`, color: P.accentL, border: `1px solid rgba(249,115,22,0.15)` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── RESULTS ─────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: P.bg2 }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <A>
            <Label>РЕЗУЛЬТАТЫ</Label>
            <SectionTitle>ОНИ УЖЕ ЗАРАБАТЫВАЮТ</SectionTitle>
            <p className="mb-12 text-sm" style={{ color: P.muted }}>Реальные результаты учеников. Без фотошопа, без накрутки.</p>
          </A>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                whileHover={{ scale: 1.03, borderColor: P.borderB }}
                className="p-5 rounded-2xl transition-all duration-200"
                style={{ background: P.card, border: `1px solid ${P.border}` }}
              >
                <div style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1.5rem', color: P.accent, lineHeight: 1, letterSpacing: '0.02em' }}>{r.amount}</div>
                <div className="font-medium text-sm mt-1" style={{ color: P.text }}>{r.name}</div>
                {r.period && <div className="text-xs mt-0.5" style={{ color: P.muted }}>{r.period}</div>}
              </motion.div>
            ))}
          </div>

          <A delay={0.3}>
            <div className="p-7 rounded-2xl" style={{ background: P.card, border: `1px solid ${P.borderB}`, boxShadow: `0 0 40px rgba(249,115,22,0.06)` }}>
              <p className="text-base leading-relaxed mb-3" style={{ color: P.dim }}>
                Я сам зарабатываю <span style={{ color: P.text, fontWeight: 600 }}>5+ миллионов рублей в год</span> через контент и ИИ-услуги. Начинал с нуля. Без связей, без большого бюджета.
              </p>
              <p className="text-base leading-relaxed" style={{ color: P.dim }}>
                В этом курсе — концентрат того, что работает прямо сейчас.
              </p>
            </div>
          </A>
        </div>
      </section>

      <Divider />

      {/* ── FOR WHOM ────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: P.bg1 }}>
        <div className="max-w-2xl mx-auto">
          <A>
            <Label>ДЛЯ КОГО</Label>
            <SectionTitle>ЭТО ДЛЯ ТЕБЯ, ЕСЛИ...</SectionTitle>
          </A>
          <div className="space-y-3 mt-8">
            {[
              'Хочешь зарабатывать онлайн, но не знаешь с чего начать',
              'Уже пользуешься ИИ, но только для личных задач',
              'Хочешь первые деньги без портфолио и опыта',
              'Готов уделить 1–2 часа в день и выйти на доход в этом месяце',
              'Ищешь дополнительный доход без ухода с основной работы',
              'Планируешь в будущем создать своё агентство',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ border: `1px solid ${P.border}`, background: P.card }}
                whileHover={{ borderColor: P.borderB, background: P.cardHov }}
              >
                <span className="flex-shrink-0 font-bold" style={{ color: P.accent }}>→</span>
                <span className="text-sm leading-relaxed" style={{ color: P.dim }}>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PRICING ─────────────────────────────────────── */}
      <section ref={pricingRef} id="pricing" className="relative py-24 px-6 overflow-hidden" style={{ background: P.bg2 }}>
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-64" style={{ background: `radial-gradient(ellipse 60% 100% at 50% 0%, rgba(249,115,22,0.1) 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <A>
            <Label>ЦЕНА</Label>
            <SectionTitle>ВЫБЕРИ СВОЙ ФОРМАТ</SectionTitle>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-10" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
              🔥 Цена повысится после продажи 50 мест
            </div>
          </A>

          <div className="grid md:grid-cols-3 gap-6">
            {/* БАЗОВЫЙ */}
            <A delay={0.15}>
              <div className="p-7 rounded-2xl flex flex-col h-full" style={{ background: P.card, border: `1px solid ${P.border}` }}>
                <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: P.muted, letterSpacing: '0.15em' }}>БАЗОВЫЙ</p>
                <div style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '2.6rem', color: P.text, lineHeight: 1, letterSpacing: '0.02em' }}>{PRICE_BASIC}</div>
                <p className="text-xs mt-1 line-through mb-1" style={{ color: P.faint }}>Обычная цена: 15 000 ₽</p>
                <p className="text-xs mb-6 font-semibold" style={{ color: '#4ade80' }}>Скидка 80%</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    'Урок 1: Услуги ИИ-специалиста',
                    'Урок 2: Контент-план с помощью ИИ',
                    'Урок 3: Карусели с помощью ИИ',
                    'Доступ навсегда',
                    'Шаблоны промтов',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: P.dim }}>
                      <span style={{ color: P.accent, flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <NeonButton variant="default" className="w-full" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', padding: '10px 0' }} onClick={() => window.open('https://payform.ru/qfbmeOJ/', '_blank')}>
                  КУПИТЬ
                </NeonButton>
              </div>
            </A>

            {/* ПРЕМИУМ */}
            <A delay={0.25}>
              <div className="relative p-7 rounded-2xl flex flex-col h-full" style={{ background: P.card, border: `2px solid ${P.borderB}`, boxShadow: `0 0 50px rgba(249,115,22,0.1)` }}>
                <div className="absolute -top-3.5 left-6 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider" style={{ background: P.accent, color: '#000' }}>
                  Рекомендуем
                </div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: P.accentL, letterSpacing: '0.15em' }}>ПРЕМИУМ</p>
                <div style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '2.6rem', color: P.accentL, lineHeight: 1, letterSpacing: '0.02em' }}>{PRICE_PRO}</div>
                <p className="text-xs mt-1 line-through mb-1" style={{ color: P.faint }}>Обычная цена: 25 000 ₽</p>
                <p className="text-xs mb-6 font-semibold" style={{ color: '#4ade80' }}>Скидка 84%</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    'Все 5 уроков',
                    'Урок 4: Claude — сайт за 1 час',
                    'Урок 5: Где найти клиента',
                    'Доступ навсегда',
                    'Шаблоны промтов',
                    'Скрипты для поиска клиентов',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: P.dim }}>
                      <span style={{ color: P.accentL, flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <NeonButton variant="solid" className="w-full" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', padding: '10px 0' }} onClick={() => window.open('https://payform.ru/40bmgHO/', '_blank')}>
                  КУПИТЬ
                </NeonButton>
              </div>
            </A>

            {/* VIP */}
            <A delay={0.35}>
              <div className="relative p-7 rounded-2xl flex flex-col h-full" style={{ background: '#1A0C04', border: `1px solid rgba(249,115,22,0.4)`, boxShadow: `0 0 60px rgba(249,115,22,0.08)` }}>
                <div className="absolute -top-3.5 left-6 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider" style={{ background: 'linear-gradient(90deg, #F97316, #FBBF24)', color: '#000' }}>
                  VIP
                </div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-5" style={{ color: '#FBBF24', letterSpacing: '0.15em' }}>VIP</p>
                <div style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: '2.6rem', color: '#FBBF24', lineHeight: 1, letterSpacing: '0.02em' }}>{PRICE_VIP}</div>
                <p className="text-xs mt-1 line-through mb-1" style={{ color: P.faint }}>Обычная цена: 50 000 ₽</p>
                <p className="text-xs mb-6 font-semibold" style={{ color: '#4ade80' }}>Скидка 82%</p>
                <ul className="space-y-3 flex-1 mb-8">
                  {[
                    'Все 5 уроков',
                    'Доступ навсегда',
                    'Шаблоны промтов',
                    'Скрипты для поиска клиентов',
                    'Личная сессия и разбор лично со мной',
                    'Пошаговый план до 100 000 ₽',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: P.dim }}>
                      <span style={{ color: '#FBBF24', flexShrink: 0, marginTop: 2 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
                <NeonButton variant="solid" className="w-full" style={{ background: 'linear-gradient(90deg,#F97316,#FBBF24)', color: '#000', fontFamily: "'BebasNeue', sans-serif", fontSize: '1.4rem', letterSpacing: '0.12em', padding: '10px 0' } as React.CSSProperties} onClick={() => window.open('https://payform.ru/8kbmgKg/', '_blank')}>
                  КУПИТЬ
                </NeonButton>
              </div>
            </A>
          </div>

          {/* guarantee — animated icons */}
          <A delay={0.3} className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { Icon: SuccessIcon, title: 'Гарантия 7 дней', desc: 'Не понравится — вернём деньги' },
                { Icon: DownloadDoneIcon, title: 'Доступ сразу', desc: 'Материалы после оплаты' },
                { Icon: ToggleIcon, title: 'Навсегда твоё', desc: 'Без ограничений по времени' },
                { Icon: HeartIcon, title: 'Реальный результат', desc: '200+ учеников уже зарабатывают' },
              ].map(({ Icon, title, desc }, i) => (
                <div key={i} className="flex flex-col items-center text-center p-4 rounded-2xl" style={{ background: P.card, border: `1px solid ${P.border}` }}>
                  <Icon size={36} color={P.accentL} duration={2000 + i * 300} />
                  <p className="mt-3 text-xs font-semibold" style={{ color: P.text }}>{title}</p>
                  <p className="text-xs mt-1" style={{ color: P.muted }}>{desc}</p>
                </div>
              ))}
            </div>
          </A>
        </div>
      </section>

      <Divider />

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: P.bg1 }}>
        <div className="max-w-2xl mx-auto">
          <A>
            <Label>ВОПРОСЫ</Label>
            <SectionTitle>ПРЕЖДЕ ЧЕМ СПРОСИТЬ</SectionTitle>
          </A>
          <div className="mt-8">
            {faqs.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── QUESTION CHAT ───────────────────────────────── */}
      <QuestionChat />

      <Divider />

      {/* ── FINAL CTA (НЕ ТРОГАЕМ) ──────────────────────── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: P.bg0 }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Label>ПОСЛЕДНИЙ ШАГ</Label>
          <h2 className="mb-6 leading-tight" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: 'clamp(2.8rem, 8vw, 5rem)', color: P.text, letterSpacing: '0.02em' }}>
            НАЧНИ ЗАРАБАТЫВАТЬ <span style={{ color: P.accent }}>НА ИИ СЕГОДНЯ</span>
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: P.muted, fontSize: '1.05rem' }}>
            5 уроков. Реальные инструменты. Конкретные деньги.<br />
            Пока другие думают — ты уже зарабатываешь.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeonButton variant="solid" size="lg" onClick={scrollToPricing}>
              Начать за 2 990 ₽
            </NeonButton>
            <NeonButton variant="ghost" size="lg" onClick={() => window.open('https://t.me/themmancur', '_blank')}>
              Задать вопрос в Telegram
            </NeonButton>
          </div>
          <p className="mt-8 text-xs" style={{ color: P.faint }}>
            Гарантия возврата 7 дней · Доступ сразу после оплаты · Навсегда твоё
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="py-10 px-6 text-center" style={{ borderTop: `1px solid ${P.border}`, background: P.bg0 }}>
        <p className="text-xs" style={{ color: P.faint }}>© 2025 Мансур — ИИ-специалист и контент-маркетолог</p>
        <p className="text-xs mt-1" style={{ color: P.faint }}>Поставщик: Уммалатов Мансур · ИНН: 201403510971</p>
        <p className="text-xs mt-1" style={{ color: P.faint }}>Результаты учеников индивидуальны и зависят от их усилий и применения материала.</p>
        <button
          onClick={() => setOfertaOpen(true)}
          className="mt-4 text-xs underline underline-offset-4 transition-colors hover:text-orange-400"
          style={{ color: '#7A5F3A' }}
        >
          Договор публичной оферты
        </button>
      </footer>

    </main>
    </>
  );
}
