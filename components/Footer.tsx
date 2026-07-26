import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Script from 'next/script';

export default function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <MapPin className="text-emerald-500" size={24} />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Kenzcore <span className="text-emerald-500">Space</span>
              </span>
            </Link>
            <p className="text-gray-500 mb-4 max-w-sm text-sm">
              {t('desc')}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">{t('for_owners_title')}</h4>
            <p className="text-gray-500 text-sm mb-2">{t('for_owners_text')}</p>
            <a href="mailto:kenzcorestudio@gmail.com" className="text-emerald-500 text-sm font-medium hover:underline">kenzcorestudio@gmail.com</a>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">{t('contacts')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500">Алматы, Казахстан</li>
              <li><a href="mailto:kenzcorestudio@gmail.com" className="text-emerald-500 hover:underline">kenzcorestudio@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col items-center text-center text-gray-500">
          <p className="max-w-3xl mb-4 text-xs text-gray-400">
            {t('disclaimer')}
          </p>
          <div className="flex flex-col items-center gap-4 w-full mt-2">
            <p className="text-sm">© {new Date().getFullYear()} Kenzcore Space. {t('rights')}</p>
            
            {/* ZERO.kz */}
            <span id="_zero_75625">
              <noscript>
                <a href="https://zero.kz/?s=75625" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://c.zero.kz/z.png?u=75625" width="88" height="31" alt="ZERO.kz" />
                </a>
              </noscript>
            </span>
            {/* End ZERO.kz */}
          </div>
        </div>
      </div>
      
      <Script id="zero-kz" strategy="afterInteractive" dangerouslySetInnerHTML={{
        __html: `
          var _zero_kz_ = _zero_kz_ || [];
          _zero_kz_.push(['id', 75625]);
          _zero_kz_.push(['type', 1]);

          (function () {
            var a = document.getElementsByTagName('script')[0],
            s = document.createElement('script');
            s.async = true;
            s.src = (document.location.protocol == 'http:' ? 'http:' : 'https:') +
              '//c.zero.kz/z.js';
            a.parentNode.insertBefore(s, a);
          })();
        `
      }} />
    </footer>
  );
}
