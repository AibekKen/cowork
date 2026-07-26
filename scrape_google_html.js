const fs = require('fs');
const axios = require('axios');

const coworkings = [
  { slug: 'smart-point-almaty', query: 'SmArt.Point coworking almaty interior' },
  { slug: 'most-it-hub', query: 'MOST IT Hub coworking almaty' },
  { slug: 'city-hub', query: 'City Hub coworking almaty' },
  { slug: 'fifty-four', query: 'Fifty Four coworking almaty' },
  { slug: 'sail-coworking', query: 'Sail Coworking almaty' },
  { slug: 'jas-coworking', query: 'Jas Coworking almaty' },
  { slug: 'mantis-creative-space', query: 'Mantis Creative Space almaty' },
  { slug: 'capital-coworking', query: 'Capital Coworking almaty' },
  { slug: 'workspace-727', query: 'Workspace 727 coworking almaty' }
];

async function run() {
  const results = {};
  for (const cw of coworkings) {
    try {
      const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(cw.query)}`;
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });
      
      // Google images full urls are in AF_initDataCallback with huge JSON arrays
      // We can use a regex to find all URLs that look like image URLs
      const regex = /\["https:\/\/[^"]+\.(jpg|jpeg|png)[\"|\\"]/gi;
      let match;
      const urls = [];
      while ((match = regex.exec(data)) !== null) {
         let img = match[0].replace('["', '').replace('"', '').replace('\\"', '');
         if (!img.includes('gstatic') && !img.includes('logo') && !img.includes('icon') && !img.includes('fbsbx')) {
             urls.push(img);
         }
      }
      
      const unique = [...new Set(urls)].slice(0, 3);
      results[cw.slug] = unique;
      console.log('Found', cw.slug, unique.length);
      
    } catch(e) {
      console.log('Error', cw.slug, e.message);
    }
  }
  
  fs.writeFileSync('google_highres.json', JSON.stringify(results, null, 2));
  
  const coworkingsFile = '/Users/aibek/GIT/PERSONAL/cowork/data/coworkings.json';
  let cData = JSON.parse(fs.readFileSync(coworkingsFile, 'utf8'));
  for (const cw of cData) {
    if (results[cw.slug] && results[cw.slug].length > 0) {
      cw.photos = results[cw.slug];
      console.log(`Updated ${cw.slug} with high-res photos`);
    }
  }
  fs.writeFileSync(coworkingsFile, JSON.stringify(cData, null, 2), 'utf8');
}

run();
