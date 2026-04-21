import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Зарабатывай на ИИ — Мини-курс ИИ-специалиста",
  description: "5 уроков о том, как продавать услуги на основе ChatGPT и Claude. Тарифы от 1 490 ₽. Первые деньги через 7 дней.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased dark">
      <body
        className="min-h-full flex flex-col bg-black"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
