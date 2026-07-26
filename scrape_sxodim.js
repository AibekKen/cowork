const cheerio = require('cheerio');
const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', url: 'https://sxodim.com/almaty/place/smart-point' },
  { slug: 'most-it-hub', url: 'https://sxodim.com/almaty/place/most-it-hub' },
  { slug: 'city-hub', url: 'https://sxodim.com/almaty/place/city-hub' },
  { slug: 'fifty-four', url: 'https://sxodim.com/almaty/place/fifty-four-54' },
  { slug: 'sail-coworking', url: 'https://sxodim.com/almaty/place/sail-coworking' },
  { slug: 'jas-coworking', url: 'https://sxodim.com/almaty/place/jas-coworking' },
  { slug: 'mantis-creative-space', url: 'https://sxodim.com/almaty/place/mantis-creative-space' },
  { slug: 'capital-coworking', url: 'https://sxodim.com/almaty/place/capital-coworking' },
  { slug: 'workspace-727', url: 'https://sxodim.com/almaty/place/workspace-727' }
];

async function run() {
  const results = {};
  for (const cw of coworkings) {
    try {
      const res = await fetch(cw.url, {
         headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
         console.log(cw.slug, 'not found on sxodim');
         continue;
      }
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const images = [];
      // Look for slider images or main images
      $('.slider-item img, .gallery-item img, .content-body img, .place-cover img').each((i, el) => {
         let src = $(el).attr('src') || $(el).attr('data-src');
         if (src && !src.includes('avatar') && !src.includes('logo')) {
            if (src.startsWith('/')) src = 'https://sxodim.com' + src;
            images.push(src);
         }
      });
      
      const unique = [...new Set(images)].filter(s => s.endsWith('.jpg') || s.endsWith('.jpeg') || s.endsWith('.png'));
      if (unique.length > 0) {
         results[cw.slug] = unique.slice(0, 3);
         console.log('Found', cw.slug, unique.length);
      } else {
         console.log(cw.slug, 'no images found');
      }
    } catch(e) {
      console.log('Error', cw.slug, e.message);
    }
  }
  fs.writeFileSync('sxodim_images.json', JSON.stringify(results, null, 2));
}

run();
