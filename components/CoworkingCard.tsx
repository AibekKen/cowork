import Image from 'next/image';
import { MapPin, Wifi, Clock, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Coworking, LocalizedString } from '@/types/coworking';
import WhatsAppButton from './WhatsAppButton';

interface CoworkingCardProps {
  coworking: Coworking & { distance?: number };
}

export default function CoworkingCard({ coworking }: CoworkingCardProps) {
  const t = useTranslations('Card');
  const locale = useLocale() as 'ru' | 'kk' | 'en';
  
  const getLocalized = (str: LocalizedString) => str[locale] || str.ru;
  
  const has247 = coworking.amenities.some(a => getLocalized(a).includes("24/7"));
  const hasWifi = coworking.amenities.some(a => getLocalized(a).includes("Wi-Fi"));

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link href={`/coworkings/${coworking.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={coworking.photos[0]}
          alt={coworking.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm flex items-center gap-1">
          ★ {coworking.rating}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2 gap-2">
          <Link href={`/coworkings/${coworking.slug}`}>
            <h3 className="font-bold text-xl text-gray-900 hover:text-emerald-500 transition-colors line-clamp-1">
              {coworking.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex flex-col gap-0.5 overflow-hidden">
            <p className="text-gray-600 text-sm flex items-center gap-1.5 line-clamp-1">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              {getLocalized(coworking.district)}
              {coworking.distance !== undefined && (
                <span className="text-emerald-600 font-medium ml-1">
                  • {coworking.distance < 1 ? `${Math.round(coworking.distance * 1000)} м` : `${coworking.distance.toFixed(1)} км`}
                </span>
              )}
            </p>
            <p className="text-gray-400 text-xs pl-5 line-clamp-1">
              {getLocalized(coworking.address)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            <a 
              href={`https://2gis.kz/almaty/search/${coworking.coordinates.lat},${coworking.coordinates.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-bold text-white bg-[#a3c33b] px-1.5 py-0.5 rounded shadow-sm hover:bg-[#8da731] transition-colors"
              title="Маршрут в 2GIS"
            >
              2GIS
            </a>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${coworking.coordinates.lat},${coworking.coordinates.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="text-[10px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded shadow-sm hover:bg-blue-600 transition-colors"
              title="Маршрут в Google Maps"
            >
              Google
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {has247 && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium">
              <Clock size={12} /> 24/7
            </span>
          )}
          {hasWifi && (
            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-md font-medium">
              <Wifi size={12} /> Wi-Fi
            </span>
          )}
          <span className="inline-flex items-center bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium border border-gray-100">
            {coworking.amenities.length > 2 
              ? t('amenities_more', { count: coworking.amenities.length - 2 }) 
              : getLocalized(coworking.amenities[0])}
          </span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{t('day_from')}</p>
              <p className="font-bold text-lg text-gray-900">{coworking.priceFrom.toLocaleString('ru-RU')} {t('currency')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">{t('meeting_from')}</p>
              <p className="font-semibold text-gray-900">{coworking.priceMeetingRoom.toLocaleString('ru-RU')} {t('currency_hour')}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link 
              href={`/coworkings/${coworking.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl px-4 py-2.5 transition-colors text-sm"
            >
              {t('details')}
            </Link>
            <WhatsAppButton 
              number={coworking.whatsappNumber} 
              message={t('wa_message', { name: coworking.name })}
              className="!px-3 flex-[0.3]"
              title={t('whatsapp')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
