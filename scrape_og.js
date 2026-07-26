const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', url: 'https://2gis.kz/almaty/search/SmArt.Point/firm/70000001031388856' },
  { slug: 'most-it-hub', url: 'https://2gis.kz/almaty/search/MOST%20IT%20Hub' },
  { slug: 'city-hub', url: 'https://2gis.kz/almaty/search/City%20Hub' },
  { slug: 'fifty-four', url: 'https://2gis.kz/almaty/search/Fifty%20Four%20coworking' },
  { slug: 'sail-coworking', url: 'https://2gis.kz/almaty/search/Sail%20Coworking' },
  { slug: 'jas-coworking', url: 'https://2gis.kz/almaty/search/Jas%20Coworking' },
  { slug: 'mantis-creative-space', url: 'https://2gis.kz/almaty/search/Mantis%20Creative%20Space' },
  { slug: 'capital-coworking', url: 'https://2gis.kz/almaty/search/Capital%20Coworking' }
];

async function run() {
  const results = {};
  for (const cw of coworkings) {
    try {
      const res = await fetch(cw.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      
      const diskMatch = html.match(/https:\/\/disk\.2gis\.com\/[^"'\\]+/g);
      if (diskMatch) {
          const unique = [...new Set(diskMatch)].map(u => u.replace(/size=\d+x\d+/, 'size=1920x1080')).slice(0, 3);
          results[cw.slug] = unique;
          console.log('Found disk:', cw.slug, unique.length);
      } else {
          console.log('Not found:', cw.slug);
      }
    } catch(e) {
       console.log('Error', cw.slug, e.message);
    }
  }
  fs.writeFileSync('og_images.json', JSON.stringify(results, null, 2));
}

run();
