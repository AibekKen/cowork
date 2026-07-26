const puppeteer = require('puppeteer');
const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', query: 'SmArt.Point almaty coworking photo interior' },
  { slug: 'most-it-hub', query: 'MOST IT Hub almaty coworking interior photo' },
  { slug: 'city-hub', query: 'City Hub coworking almaty interior' },
  { slug: 'fifty-four', query: 'Fifty Four coworking almaty interior' },
  { slug: 'sail-coworking', query: 'Sail Coworking almaty interior' },
  { slug: 'jas-coworking', query: 'Jas Coworking almaty interior' },
  { slug: 'mantis-creative-space', query: 'Mantis Creative Space almaty' },
  { slug: 'capital-coworking', query: 'Capital Coworking almaty interior' }
];

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const results = {};
  
  for (const cw of coworkings) {
    console.log(`\nSearching Yandex Images for: ${cw.query}`);
    try {
      const url = `https://yandex.kz/images/search?text=${encodeURIComponent(cw.query)}`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 2000));
      
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .map(i => i.src || i.dataset?.src)
          .filter(src => src && src.includes('avatars.mds.yandex.net'))
          .slice(0, 3);
      });
      
      console.log(`Found ${images.length} images`);
      results[cw.slug] = images;
      
    } catch (e) {
      console.log(`Error on ${cw.query}:`, e.message);
    }
  }
  
  fs.writeFileSync('yandex_photos_real.json', JSON.stringify(results, null, 2));
  console.log('Saved to yandex_photos_real.json');
  await browser.close();
})();
