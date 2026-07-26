const puppeteer = require('puppeteer');
const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', query: 'SmArt.Point almaty coworking photo interior' },
  { slug: 'most-it-hub', query: 'MOST IT Hub almaty coworking interior photo' },
  { slug: 'city-hub', query: 'City Hub coworking almaty interior' },
  { slug: 'fifty-four', query: 'Fifty Four coworking almaty interior' },
  { slug: 'sail-coworking', query: 'Sail Coworking almaty interior' },
  { slug: 'jas-coworking', query: 'Jas Coworking almaty interior' },
  { slug: 'mantis-creative-space', query: 'Mantis Creative Space almaty interior' },
  { slug: 'capital-coworking', query: 'Capital Coworking almaty interior' },
  { slug: 'workspace-727', query: 'Workspace 727 almaty coworking photo' }
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
        const items = Array.from(document.querySelectorAll('.serp-item'));
        const urls = [];
        for (const item of items) {
           try {
             const dataBem = JSON.parse(item.getAttribute('data-bem'));
             if (dataBem && dataBem['serp-item'] && dataBem['serp-item']['img_href']) {
                urls.push(dataBem['serp-item']['img_href']);
             }
           } catch(e) {}
        }
        return urls.filter(src => src.startsWith('http')).slice(0, 3);
      });
      
      console.log(`Found ${images.length} high-res images`);
      results[cw.slug] = images;
      
    } catch (e) {
      console.log(`Error on ${cw.query}:`, e.message);
    }
  }
  
  fs.writeFileSync('yandex_highres.json', JSON.stringify(results, null, 2));
  console.log('Saved to yandex_highres.json');
  await browser.close();
  
  // Now update coworkings.json
  const coworkingsFile = '/Users/aibek/GIT/PERSONAL/cowork/data/coworkings.json';
  let data = JSON.parse(fs.readFileSync(coworkingsFile, 'utf8'));
  for (const cw of data) {
    if (results[cw.slug] && results[cw.slug].length > 0) {
      cw.photos = results[cw.slug];
      console.log(`Updated ${cw.slug} with high-res photos`);
    }
  }
  fs.writeFileSync(coworkingsFile, JSON.stringify(data, null, 2), 'utf8');
  console.log('Updated coworkings.json');

})();
