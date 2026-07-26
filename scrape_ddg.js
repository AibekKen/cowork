const { image_search } = require('duckduckgo-images-api');
const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', query: 'SmArt.Point almaty coworking photo' },
  { slug: 'most-it-hub', query: 'MOST IT Hub almaty interior' },
  { slug: 'city-hub', query: 'City Hub coworking almaty' },
  { slug: 'fifty-four', query: 'Fifty Four coworking almaty' },
  { slug: 'sail-coworking', query: 'Sail Coworking almaty' },
  { slug: 'jas-coworking', query: 'Jas Coworking almaty' },
  { slug: 'mantis-creative-space', query: 'Mantis Creative Space almaty' },
  { slug: 'capital-coworking', query: 'Capital Coworking almaty' }
];

async function run() {
  const results = {};
  for (const cw of coworkings) {
    try {
      const res = await image_search({ query: cw.query, moderate: true });
      if (res && res.length > 0) {
        results[cw.slug] = res.slice(0, 3).map(r => r.image);
        console.log('Found', cw.slug, results[cw.slug].length);
      }
    } catch(e) {
      console.error('Error', cw.slug, e);
    }
  }
  fs.writeFileSync('real_photos.json', JSON.stringify(results, null, 2));
}

run();
