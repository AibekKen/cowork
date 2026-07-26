'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Coworking, LocalizedString } from '@/types/coworking';
import CoworkingCard from './CoworkingCard';

// Dynamically import map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center animate-pulse">
      <span className="text-gray-400 font-medium text-sm">Загрузка карты...</span>
    </div>
  )
});

interface HomeClientProps {
  initialCoworkings: Coworking[];
  locale: 'ru' | 'kk' | 'en';
}

const getLocalized = (str: LocalizedString, locale: 'ru' | 'kk' | 'en') => str[locale] || str.ru;

export default function HomeClient({ initialCoworkings, locale }: HomeClientProps) {
  const t = useTranslations('Filters');
  
  const DISTRICTS = [
    t('all_districts'), 
    getLocalized(initialCoworkings[0].district, locale), // Бостандыкский
    getLocalized(initialCoworkings[1].district, locale), // Медеуский
    getLocalized(initialCoworkings[2].district, locale), // Алмалинский
    getLocalized(initialCoworkings[9].district, locale)  // Ауэзовский
  ];

  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [has247, setHas247] = useState(false);
  const [hasMeetingRoom, setHasMeetingRoom] = useState(false);

  const filteredCoworkings = useMemo(() => {
    return initialCoworkings.filter(c => {
      const cDistrict = getLocalized(c.district, locale);
      if (district !== DISTRICTS[0] && cDistrict !== district) return false;
      if (has247 && !c.amenities.some(a => getLocalized(a, locale).includes("24/7"))) return false;
      if (hasMeetingRoom && c.priceMeetingRoom === 0) return false;
      return true;
    });
  }, [initialCoworkings, district, has247, hasMeetingRoom, locale]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 w-full sm:w-[200px]"
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <input type="checkbox" checked={has247} onChange={(e) => setHas247(e.target.checked)} className="rounded text-emerald-500 focus:ring-emerald-500 bg-white border-gray-300 w-4 h-4 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">24/7</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <input type="checkbox" checked={hasMeetingRoom} onChange={(e) => setHasMeetingRoom(e.target.checked)} className="rounded text-emerald-500 focus:ring-emerald-500 bg-white border-gray-300 w-4 h-4 cursor-pointer" />
            <span className="text-sm font-medium text-gray-700">Переговорная</span>
          </label>
        </div>

        <div className="flex items-center bg-gray-100 rounded-lg p-1 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => setView('grid')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutGrid size={16} /> {t('grid')}
          </button>
          <button 
            onClick={() => setView('map')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'map' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon size={16} /> {t('map')}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500">
        {t('found')} <span className="font-bold text-gray-900">{filteredCoworkings.length}</span>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoworkings.map(coworking => (
            <CoworkingCard key={coworking.id} coworking={coworking} />
          ))}
          {filteredCoworkings.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              {t('empty')}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <MapComponent coworkings={filteredCoworkings} />
        </div>
      )}
    </div>
  );
}
