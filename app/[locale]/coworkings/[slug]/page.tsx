import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Wifi, Clock, Star, CheckCircle2, Navigation, Map } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

import coworkingsData from '@/data/coworkings.json';
import { Coworking, LocalizedString } from '@/types/coworking';
import WhatsAppButton from '@/components/WhatsAppButton';
import ClientMap from '@/components/ClientMap';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach((locale) => {
    coworkingsData.forEach((coworking) => {
      params.push({ locale, slug: coworking.slug });
    });
  });
  return params;
}

const getLocalized = (str: LocalizedString, locale: string) => (str as any)[locale] || str.ru;

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const coworking = coworkingsData.find((c) => c.slug === slug) as Coworking | undefined;
  
  if (!coworking) {
    return {
      title: 'Not Found | Kenzcore Space',
    };
  }

  const t = await getTranslations({ locale, namespace: 'Details' });
  const title = t('title', { name: coworking.name });
  const desc = getLocalized(coworking.description, locale);

  return {
    title: `${title} | Kenzcore Space`,
    description: desc,
    openGraph: {
      title: `${title} | Kenzcore Space`,
      description: desc,
      url: `https://space.kenzcore.com/${locale}/coworkings/${coworking.slug}`,
      images: [
        {
          url: coworking.photos[0],
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/coworkings/${coworking.slug}`,
      languages: {
        'ru': `/ru/coworkings/${coworking.slug}`,
        'kk': `/kk/coworkings/${coworking.slug}`,
        'en': `/en/coworkings/${coworking.slug}`,
      }
    }
  };
}

export default async function CoworkingPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const coworking = coworkingsData.find((c) => c.slug === slug) as Coworking | undefined;

  if (!coworking) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Details' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: coworking.name,
    image: coworking.photos,
    description: getLocalized(coworking.description, locale),
    address: {
      '@type': 'PostalAddress',
      streetAddress: getLocalized(coworking.address, locale),
      addressLocality: 'Алматы',
      addressRegion: 'Алматы',
      addressCountry: 'KZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coworking.coordinates.lat,
      longitude: coworking.coordinates.lng,
    },
    url: `https://space.kenzcore.com/${locale}/coworkings/${coworking.slug}`,
    telephone: `+${coworking.whatsappNumber}`,
    priceRange: `${coworking.priceFrom} KZT - ${coworking.priceMeetingRoom} KZT`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: coworking.rating,
      reviewCount: 50,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
        {/* Photo Gallery Hero */}
        <div className="w-full h-[40vh] md:h-[50vh] min-h-[300px] grid grid-cols-1 md:grid-cols-4 gap-1 md:gap-2">
          <div className="relative h-full md:col-span-2 overflow-hidden">
            <Image src={coworking.photos[0]} alt={coworking.name} fill className="object-cover" priority />
          </div>
          {coworking.photos[1] && (
            <div className="relative h-full hidden md:block overflow-hidden">
              <Image src={coworking.photos[1]} alt={coworking.name} fill className="object-cover" />
            </div>
          )}
          {coworking.photos[2] && (
            <div className="relative h-full hidden md:block overflow-hidden">
              <Image src={coworking.photos[2]} alt={coworking.name} fill className="object-cover" />
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {/* <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} /> {coworking.rating}
                  </span> */}
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{t('verified')}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                  {t('title', { name: coworking.name })}
                </h1>
                <p className="text-lg text-gray-600 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-400 shrink-0" />
                  {getLocalized(coworking.address, locale)} ({getLocalized(coworking.district, locale)})
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">{t('about')}</h2>
                <div className="prose prose-emerald max-w-none text-gray-600">
                  <p>{getLocalized(coworking.fullDescription, locale)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">{t('amenities')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coworking.amenities.map(amenity => (
                    <div key={getLocalized(amenity, locale)} className="flex items-center gap-3">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                      <span className="text-gray-700 font-medium">{getLocalized(amenity, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold mb-6">{t('location')}</h2>
                <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200">
                  <ClientMap coworkings={[coworking]} center={[coworking.coordinates.lat, coworking.coordinates.lng]} zoom={15} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <a 
                    href={`https://2gis.kz/almaty/search/${encodeURIComponent(getLocalized(coworking.address, locale))}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#a3c33b] hover:bg-[#8da731] text-white font-medium rounded-xl px-4 py-3 transition-colors text-sm shadow-sm"
                  >
                    <Navigation size={18} />
                    {t('open_2gis')}
                  </a>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(getLocalized(coworking.address, locale) + ', Алматы')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl px-4 py-3 transition-colors text-sm shadow-sm"
                  >
                    <Map size={18} />
                    {t('open_google')}
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & CTA */}
            <div className="lg:col-span-1 sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-emerald-500/5 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100">{t('tariffs')}</h3>
                
                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 mb-6 text-xs text-orange-800">
                  {t('wa_alert')}
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-gray-600 font-medium">{t('hot_desk')}</span>
                      {Number(coworking.priceFrom) > 0 ? (
                        <span className="text-xl font-bold text-gray-900">{Number(coworking.priceFrom).toLocaleString('ru-RU')} ₸</span>
                      ) : (
                        <div className="text-xl font-bold text-gray-900 mb-1">{t('on_request')}</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{t('hot_desk_desc')}</p>
                  </div>
                  

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-gray-600 font-medium">{t('meeting')}</span>
                      {Number(coworking.priceMeetingRoom) > 0 ? (
                        <span className="text-xl font-bold text-gray-900">{Number(coworking.priceMeetingRoom).toLocaleString('ru-RU')} ₸</span>
                      ) : (
                        <div className="text-xl font-bold text-gray-900 mb-1">{t('on_request')}</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{t('meeting_desc')}</p>
                  </div>
                </div>

                <div className="hidden md:block">
                  <WhatsAppButton 
                    number={coworking.whatsappNumber}
                    message={t('wa_message', { name: coworking.name })}
                    fullWidth
                  />
                  <p className="text-center text-xs text-gray-500 mt-4">
                    {t('wa_direct')}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <p className="text-xs text-gray-500">{t('day_from')}</p>
            {Number(coworking.priceFrom) > 0 ? (
              <p className="font-bold text-gray-900">{Number(coworking.priceFrom).toLocaleString('ru-RU')} ₸</p>
            ) : (
              <p className="font-bold text-gray-900">{t('on_request')}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('meeting_from')}</p>
            {Number(coworking.priceMeetingRoom) > 0 ? (
              <p className="font-bold text-gray-900">{Number(coworking.priceMeetingRoom).toLocaleString('ru-RU')} ₸/ч</p>
            ) : (
              <p className="font-bold text-gray-900">{t('on_request')}</p>
            )}
          </div>
        </div>
        <WhatsAppButton 
          number={coworking.whatsappNumber}
          message={t('wa_message', { name: coworking.name })}
          fullWidth
          className="py-3.5 text-base shadow-emerald-500/25 shadow-lg"
        />
      </div>
    </>
  );
}
