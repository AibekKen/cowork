import HomeClient from '@/components/HomeClient';
import coworkingsData from '@/data/coworkings.json';
import { Coworking } from '@/types/coworking';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  return {
    title: t('seo_title_1'),
    description: t('seo_p1')
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const coworkings = coworkingsData as Coworking[];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-emerald-50 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {t('hero_title_1')}<br className="hidden md:block"/> {t('hero_title_2')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-medium">
            {t('hero_subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content & Filters */}
      <HomeClient initialCoworkings={coworkings} locale={locale as any} />

      {/* SEO Text Block */}
      <section className="container mx-auto px-4 py-16 border-t border-gray-100">
        <div className="max-w-3xl mx-auto prose prose-emerald prose-sm md:prose-base text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('seo_title_1')}</h2>
          <p className="mb-4">
            {t('seo_p1')}
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{t('seo_title_2')}</h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>{t('seo_li1')}</li>
            <li>{t('seo_li2')}</li>
            <li>{t('seo_li3')}</li>
          </ul>
          <p>
            {t('seo_p2')}
          </p>
        </div>
      </section>
    </>
  );
}
