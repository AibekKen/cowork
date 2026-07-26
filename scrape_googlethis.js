const google = require('googlethis');
const fs = require('fs');

const coworkings = [
  { slug: 'smart-point-almaty', query: 'SmArt.Point almaty coworking office interior' },
  { slug: 'most-it-hub', query: 'MOST IT Hub almaty coworking interior' },
  { slug: 'city-hub', query: 'City Hub coworking almaty interior office' },
  { slug: 'fifty-four', query: 'Fifty Four coworking almaty interior' },
  { slug: 'sail-coworking', query: 'Sail Coworking almaty interior' },
  { slug: 'jas-coworking', query: 'Jas Coworking almaty interior' },
  { slug: 'mantis-creative-space', query: 'Mantis Creative Space almaty coworking' },
  { slug: 'capital-coworking', query: 'Capital Coworking almaty interior' }
];

async function run() {
  const results = {};
  for (const cw of coworkings) {
    console.log('Searching images for', cw.query);
    try {
      const images = await google.image(cw.query, { safe: false });
      const urls = images.slice(0, 3).map(i => i.url);
      results[cw.slug] = urls;
    } catch(e) {
      console.error(e);
    }
  }
  fs.writeFileSync('google_images.json', JSON.stringify(results, null, 2));
  console.log('Done.');
}
run();
