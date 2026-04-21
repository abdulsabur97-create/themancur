'use client';

import { motion } from 'motion/react';
import { useEffect } from 'react';

interface VideoSpotlightProps {
  src: string;
  label?: string;
  title?: string;
  subtitle?: string;
}

export function VideoSpotlight({ src, label, title, subtitle }: VideoSpotlightProps) {
  useEffect(() => {
    if (document.getElementById('wistia-api-script')) return;
    const s = document.createElement('script');
    s.id = 'wistia-api-script';
    s.src = 'https://fast.wistia.com/assets/external/E-v1.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Radial glow behind video */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(251,146,60,0.10) 0%, rgba(251,146,60,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          {label && (
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-4"
              style={{ color: '#fb923c', letterSpacing: '0.18em' }}
            >
              {label}
            </p>
          )}
          {title && (
            <h2
              className="leading-tight mb-3"
              style={{
                fontFamily: "'BebasNeue', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#E8EDF5',
                letterSpacing: '0.02em',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm" style={{ color: '#71717a' }}>
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Video wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(251,146,60,0.35) 0%, rgba(251,146,60,0.05) 50%, rgba(251,146,60,0.2) 100%)',
            }}
          />

          {/* Soft shadow bloom */}
          <div
            className="absolute -inset-8 rounded-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(251,146,60,0.12) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Video container */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              border: '1px solid rgba(251,146,60,0.22)',
              boxShadow:
                '0 0 0 1px rgba(251,146,60,0.08), 0 32px 64px rgba(0,0,0,0.6), 0 0 80px rgba(251,146,60,0.08)',
              paddingBottom: '56.25%',
              height: 0,
              background: '#000',
            }}
          >
            <iframe
              title="Wistia video player"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              src={src}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '1rem',
              }}
            />
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none" style={{ borderTop: '2px solid rgba(251,146,60,0.6)', borderLeft: '2px solid rgba(251,146,60,0.6)', borderRadius: '1rem 0 0 0' }} />
          <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none" style={{ borderTop: '2px solid rgba(251,146,60,0.6)', borderRight: '2px solid rgba(251,146,60,0.6)', borderRadius: '0 1rem 0 0' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none" style={{ borderBottom: '2px solid rgba(251,146,60,0.6)', borderLeft: '2px solid rgba(251,146,60,0.6)', borderRadius: '0 0 0 1rem' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none" style={{ borderBottom: '2px solid rgba(251,146,60,0.6)', borderRight: '2px solid rgba(251,146,60,0.6)', borderRadius: '0 0 1rem 0' }} />
        </motion.div>
      </div>
    </section>
  );
}
