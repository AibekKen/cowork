import { MetadataRoute } from 'next';
import coworkingsData from '@/data/coworkings.json';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://space.kenzcore.com';

  const sitemapUrls: MetadataRoute.Sitemap = [];

  routing.locales.forEach((locale) => {
    // Add home page for each locale
    sitemapUrls.push({
      url: locale === 'ru' ? baseUrl : `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Add coworking pages for each locale
    coworkingsData.forEach((coworking) => {
      sitemapUrls.push({
        url: locale === 'ru' ? `${baseUrl}/coworkings/${coworking.slug}` : `${baseUrl}/${locale}/coworkings/${coworking.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return sitemapUrls;
}
