/**
 * Review list of FashionDB (fashionwiki.wikibase.cloud) awards for designers
 * in this dataset. It never edits data: verify each candidate (CFDA, BFC,
 * BoF profile, official announcements) before adding it to designers.ts.
 *
 *   node scripts/awards/fashiondb.mjs                   every matched designer
 *   node scripts/awards/fashiondb.mjs --designer rafSimons
 *   node scripts/awards/fashiondb.mjs --new             only designers with something to add
 *
 * Each line is marked:
 *   ✓  already recorded (same award and year)
 *   +  candidate: maps to an AwardId but isn't recorded
 *   ?  FashionDB award with no AwardId (add one to awards.ts if it belongs)
 * FashionDB is incomplete and has errors and duplicate awards; an undated
 * award still needs its year researched.
 */
import { runnerImport } from 'vite';
import { dataPath, normalize, option } from '../collab/data.mjs';

const ENDPOINT = 'https://fashionwiki.wikibase.cloud/query/sparql';
const QUERY = `
PREFIX p: <https://fashionwiki.wikibase.cloud/prop/>
PREFIX ps: <https://fashionwiki.wikibase.cloud/prop/statement/>
PREFIX pq: <https://fashionwiki.wikibase.cloud/prop/qualifier/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?person ?personLabel ?awardLabel ?time WHERE {
  ?person p:P18 ?statement . ?statement ps:P18 ?award .
  OPTIONAL { ?statement pq:P28 ?time }
  ?person rdfs:label ?personLabel FILTER(lang(?personLabel) = "en")
  ?award rdfs:label ?awardLabel FILTER(lang(?awardLabel) = "en")
}`;

/** FashionDB award labels (any case or punctuation) → AwardId values. */
const LABELS = {
  'CFDA Womenswear Designer of the Year': 'cfdaWomenswearDesigner',
  'CFDA Menswear Designer of the Year': 'cfdaMenswearDesigner',
  'CFDA Accessory Designer of the Year': 'cfdaAccessoriesDesigner',
  'CFDA Lifetime Achievement Award': 'cfdaLifetimeAchievement',
  'CFDA Perry Ellis Award for Womenswear': 'cfdaPerryEllisAward',
  'CFDA Perry Ellis Award for New Fashion Talent': 'cfdaPerryEllisAward',
  'Coty Award': 'cotyAward',
  'Neiman Marcus Fashion Award': 'neimanMarcusAward',
  'National Design Awards': 'nationalDesignAwardFashion',
  'British Designer of the Year': 'bfaDesignerOfTheYear',
  'British Menswear Designer of the Year': 'bfaBritishMenswear',
  'International Designer of the Year': 'bfaInternationalDesigner',
  'ANDAM Fashion Award': 'andamGrandPrize',
  'SOEN Award': 'soenAward',
  'National Fashion Design Award': 'spainNationalFashionDesignAward',
  'Royal Designer for Industry': 'royalDesignerForIndustry',
  'honorary Royal Designer for Industry': 'honoraryRoyalDesignerForIndustry',
  'Praemium Imperiale': 'praemiumImperiale',
  'Academy Award for Best Costume Design': 'academyAwardCostumeDesign',
  'Academy Award for Best Costume Design, Color': 'academyAwardCostumeDesign',
  'Academy Award for Best Costume Design, Black-and-White': 'academyAwardCostumeDesign',
  'Knight of the Legion of Honour': 'legionOfHonourChevalier',
  'Officer of the Legion of Honour': 'legionOfHonourOfficier',
  'Commander of the Legion of Honour': 'legionOfHonourCommandeur',
  'Grand Officer of the Legion of Honour': 'legionOfHonourGrandOfficier',
  'Chevalier des Arts et des Lettres': 'artsEtLettresChevalier',
  'Officer of Arts and Letters': 'artsEtLettresOfficier',
  'Commandeur des Arts et des Lettres': 'artsEtLettresCommandeur',
  'Knight of the National Order of Merit': 'nationalOrderOfMeritChevalier',
  'Officer of the National Order of Merit': 'nationalOrderOfMeritOfficier',
  'Commander of the National Order of Merit': 'nationalOrderOfMeritCommandeur',
  'Member of the Order of the British Empire': 'mbe',
  'Officer of the Order of the British Empire': 'obe',
  'Commander of the Order of the British Empire': 'cbe',
  'A Most Excellent Commander Of The British Empire (Cbe)': 'cbe',
  'Dame Commander of the Order of the British Empire': 'dbe',
  'Knight Bachelor': 'knightBachelor',
  'Companion of Honour': 'companionOfHonour',
  'Commander of the Order of Merit of the Italian Republic': 'italianMeritCommendatore',
  'Grand Officer of the Order of Merit of the Italian Republic': 'italianMeritGrandeUfficiale',
  'Knight Grand Cross of the Order of Merit of the Italian Republic': 'italianMeritGrandCross',
  'Order of Merit for Labour': 'italianMeritForLabour',
  'Gold Medal of Merit in the Fine Arts': 'spainFineArtsGoldMedal',
  'Medal with Purple Ribbon': 'medalWithPurpleRibbon',
  'Person of Cultural Merit': 'personOfCulturalMerit',
  'Order of Culture': 'orderOfCulture',
};
const awardFor = new Map(Object.entries(LABELS).map(([label, id]) => [normalize(label), id]));

const only = option('designer');
const newOnly = process.argv.includes('--new');
const options = { configFile: false, logLevel: 'error' };
const { module: d } = await runnerImport(dataPath('designers.ts'), options);
const { module: a } = await runnerImport(dataPath('awards.ts'), options);
const known = new Set(Object.values(a.AwardId));
for (const id of awardFor.values()) if (!known.has(id)) throw new Error(`LABELS maps to unknown AwardId ${id}`);

const designerIds = new Map();
for (const [id, designer] of Object.entries(d.designers)) {
  const key = normalize(designer.name);
  designerIds.set(key, [...(designerIds.get(key) ?? []), id]);
}

const response = await fetch(`${ENDPOINT}?query=${encodeURIComponent(QUERY)}`, {
  headers: { Accept: 'application/sparql-results+json', 'User-Agent': 'designer-map-research/1.0' },
});
if (!response.ok) throw new Error(`FashionDB query failed: ${response.status}`);
const rows = (await response.json()).results.bindings;

/** designer id → FashionDB item and its awards, duplicates collapsed. */
const found = new Map();
for (const row of rows) {
  for (const id of designerIds.get(normalize(row.personLabel.value)) ?? []) {
    if (only && id !== only) continue;
    const entry = found.get(id) ?? { item: row.person.value.split('/').pop(), awards: new Map() };
    const year = row.time ? Number(row.time.value.match(/^[+-]?(\d{1,4})/)?.[1]) : undefined;
    const label = row.awardLabel.value;
    const key = `${label}:${year ?? ''}`;
    if (!entry.awards.has(key)) entry.awards.set(key, { label, year, award: awardFor.get(normalize(label)) });
    found.set(id, entry);
  }
}

// An undated duplicate of a dated award adds nothing.
const lines = [];
for (const [id, { item, awards }] of [...found].sort(([x], [y]) => x.localeCompare(y))) {
  const list = [...awards.values()].filter((award, _, all) =>
    award.year !== undefined || !all.some((other) => other.year !== undefined && other.label === award.label));
  const recorded = d.designers[id].awards ?? [];
  const marked = list.sort((x, y) => (x.year ?? Infinity) - (y.year ?? Infinity)).map((award) => {
    if (!award.award) return { mark: '?', award };
    const done = recorded.some((r) => r.award === award.award && (award.year === undefined || r.year === award.year));
    return { mark: done ? '✓' : '+', award };
  });
  if (newOnly && !marked.some(({ mark }) => mark !== '✓')) continue;
  lines.push(`${id} (${d.designers[id].name}) · FashionDB ${item}`);
  for (const { mark, award } of marked) {
    lines.push(`  ${mark} ${award.year ?? 'undated'}  ${award.award ?? award.label}${award.award ? `  [${award.label}]` : ''}`);
  }
}
console.log(lines.length ? lines.join('\n') : only ? `No FashionDB awards for ${only}.` : 'No matches.');
console.error(`\n${found.size} designers matched by name. Verify every candidate before adding it.`);
