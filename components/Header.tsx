'use client';

import { useState } from 'react';
import { MapPin, Menu, X, Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500 p-1.5 rounded-lg text-white group-hover:bg-emerald-600 transition-colors">
            <MapPin size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">
            Kenzcore <span className="text-emerald-500">Space</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-full p-1 text-sm font-medium">
            {['ru', 'kk', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`px-3 py-1 rounded-full transition-colors ${locale === l ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="mailto:hello@kenzcore.com" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm shadow-emerald-500/20">
            {t('contacts')}
          </a>
        </div>
      </div>
    </header>
  );
}
