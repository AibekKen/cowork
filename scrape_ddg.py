import json
from duckduckgo_search import DDGS

coworkings = [
  { 'slug': 'smart-point-almaty', 'query': 'SmArt.Point almaty coworking photo' },
  { 'slug': 'most-it-hub', 'query': 'MOST IT Hub almaty interior photo' },
  { 'slug': 'city-hub', 'query': 'City Hub coworking almaty interior' },
  { 'slug': 'fifty-four', 'query': 'Fifty Four coworking almaty interior' },
  { 'slug': 'sail-coworking', 'query': 'Sail Coworking almaty interior' },
  { 'slug': 'jas-coworking', 'query': 'Jas Coworking almaty interior' },
  { 'slug': 'mantis-creative-space', 'query': 'Mantis Creative Space almaty' },
  { 'slug': 'capital-coworking', 'query': 'Capital Coworking almaty interior' }
]

results = {}

with DDGS() as ddgs:
    for cw in coworkings:
        try:
            print('Searching', cw['query'])
            imgs = list(ddgs.images(
                cw['query'],
                region='wt-wt',
                safesearch='moderate',
                size='Large',
                max_results=3
            ))
            results[cw['slug']] = [i['image'] for i in imgs]
            print('Found', len(results[cw['slug']]))
        except Exception as e:
            print('Error', cw['slug'], e)

with open('ddg_images.json', 'w') as f:
    json.dump(results, f, indent=2)
print("Saved to ddg_images.json")
