'use client';

import { useState, useRef, useCallback, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SendIcon, LoaderIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function useAutoResizeTextarea(minHeight: number, maxHeight = 200) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const adjust = useCallback((reset?: boolean) => {
    const el = ref.current;
    if (!el) return;
    el.style.height = `${minHeight}px`;
    if (!reset) {
      el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight))}px`;
    }
  }, [minHeight, maxHeight]);
  useEffect(() => { if (ref.current) ref.current.style.height = `${minHeight}px`; }, [minHeight]);
  return { textareaRef: ref, adjust };
}

const SUGGESTIONS = [
  'Подойдёт ли это новичку без опыта?',
  'Сколько времени нужно в день?',
  'Когда получу первые деньги?',
  'Чем отличаются тарифы?',
];

const ACCENT = '#F97316';
const BG = 'rgba(249,115,22,0.06)';
const BORDER = 'rgba(249,115,22,0.18)';

export function QuestionChat() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [focused, setFocused] = useState(false);
  const { textareaRef, adjust } = useAutoResizeTextarea(56, 180);

  const handleSend = () => {
    if (!value.trim()) return;
    startTransition(() => {
      setSent(true);
      setValue('');
      adjust(true);
    });
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: '#080502' }}>
      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(249,115,22,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: ACCENT, letterSpacing: '0.18em' }}>ЕСТЬ ВОПРОС?</p>
          <h2 className="mb-3 leading-tight" style={{ fontFamily: "'BebasNeue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#F5EDE0', letterSpacing: '0.02em' }}>
            НАПИШИ — Я ОТВЕЧУ
          </h2>
          <p className="mb-8 text-sm" style={{ color: '#7A5F3A' }}>
            Оставь вопрос — отвечу в течение нескольких часов
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-14 rounded-2xl text-center"
              style={{ background: BG, border: `1px solid ${BORDER}` }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle size={48} style={{ color: ACCENT }} />
              </motion.div>
              <p className="mt-4 font-semibold text-lg" style={{ color: '#F5EDE0' }}>Вопрос отправлен!</p>
              <p className="mt-2 text-sm" style={{ color: '#7A5F3A' }}>Отвечу в ближайшее время</p>
              <button
                onClick={() => setSent(false)}
                className="mt-6 text-xs underline underline-offset-4 transition-colors hover:text-orange-300"
                style={{ color: '#7A5F3A' }}
              >
                Задать ещё вопрос
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(20,12,4,0.9)', border: `1px solid ${BORDER}`, boxShadow: focused ? `0 0 30px rgba(249,115,22,0.08)` : 'none', transition: 'box-shadow 0.3s' }}
            >
              {/* Suggestions */}
              <div className="px-4 pt-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => { setValue(s); adjust(); }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                    style={{ background: 'rgba(249,115,22,0.07)', border: `1px solid rgba(249,115,22,0.15)`, color: '#C4A882' }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>

              {/* Input row */}
              <div className="px-4 pb-4 pt-2 flex items-end gap-3" style={{ borderTop: `1px solid rgba(249,115,22,0.08)` }}>
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => { setValue(e.target.value); adjust(); }}
                  onKeyDown={handleKey}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Напиши свой вопрос..."
                  className={cn('flex-1 resize-none bg-transparent text-sm focus:outline-none placeholder:text-[#3D2810]')}
                  style={{ minHeight: 44, maxHeight: 180, overflow: 'hidden', color: '#F5EDE0', lineHeight: 1.6, paddingTop: 10 }}
                />
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!value.trim() || isPending}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 disabled:opacity-40 flex-shrink-0"
                  style={value.trim() ? { background: ACCENT, color: '#000', boxShadow: '0 0 20px rgba(249,115,22,0.3)' } : { background: 'rgba(249,115,22,0.08)', color: '#7A5F3A', border: `1px solid rgba(249,115,22,0.1)` }}
                >
                  {isPending ? <LoaderIcon size={14} className="animate-spin" /> : <SendIcon size={14} />}
                  Отправить
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
