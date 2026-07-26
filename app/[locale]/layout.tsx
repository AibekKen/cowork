import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Коворкинги Алматы 2026 — Каталог, Цены и Заказ в WhatsApp | Kenzcore Space",
  description: "Сравните все коворкинги и переговорные комнаты в Алматы. Актуальные цены от 3 000 ₸/день, адреса, фото и удобства. Бронирование и связь напрямую через WhatsApp.",
  metadataBase: new URL('https://space.kenzcore.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Коворкинги Алматы 2026 — Каталог, Цены и Заказ в WhatsApp | Kenzcore Space",
    description: "Сравните все коворкинги и переговорные комнаты в Алматы. Актуальные цены от 3 000 ₸/день, адреса, фото и удобства. Бронирование и связь напрямую через WhatsApp.",
    url: 'https://space.kenzcore.com',
    siteName: 'Kenzcore Space',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_KZ',
    type: 'website',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <Script id="yandex-metrika" strategy="afterInteractive" dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111045873', 'ym');

              ym(111045873, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `
          }} />
          <noscript>
            <div><img src="https://mc.yandex.ru/watch/111045873" style={{ position: 'absolute', left: '-9999px' }} alt="" /></div>
          </noscript>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
