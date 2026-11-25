/**
 * Reads a Japanese brand's Fashion Press collab list and shows pairings not yet recorded.
 *   node scripts/collab/fashion-press.mjs --find スイコック        brand ids by katakana name
 *   node scripts/collab/fashion-press.mjs suicoke=3949 sacai=284   list new pairings
 *   … --all also prints headlines naming no known brand
 *
 * Partners come from the katakana table below; add names as you meet them. Years are
 * article dates, so check November–January rows. ids not in --find are in the brand's URL.
 */
import { setTimeout as sleep } from 'node:timers/promises';
import { loadData, option, recordedYears, rootOf } from './data.mjs';

const katakana = [
  'ラベンハム=lavenham,エルエルビーン=llBean,チャンピオン=champion,グレゴリー=gregory,サロモン=salomon,',
  'ブルックス ブラザーズ=brooksBrothers,ニューエラ=newEra,カンペール=camper,バンズ=vans,ヴァンズ=vans,VANS=vans,',
  'コール ハーン=coleHaan,スクリーンスターズ=screenStars,トゥミ=tumi,ワイルドシングス=wildThings,ショット=schott,UGG=ugg,',
  'アグ=ugg,ダナー=danner,マーモット=marmot,GU=gu,ジーユー=gu,ハリウッド=nHoolywood,マインデニム=minedenim,',
  'ディッキーズ=dickies,ドクターマーチン=drMartens,サンスペル=sunspel,フルーツオブザルーム=fruitOfTheLoom,ナイキ=nike,',
  'アディダス=adidas,リーボック=reebok,プーマ=puma,アシックス=asics,ニューバランス=newBalance,コンバース=converse,',
  'ポーター=porterYoshida,吉田カバン=porterYoshida,カーハート WIP=carharttWip,リーバイス=levis,',
  'ビルケンシュトック=birkenstock,スマイソン=smythson,ウエストン=jmWeston,ダブルタップス=wtaps,スピワック=spiewak,',
  'モンクレール=moncler,クラークス=clarks,アクロニウム=acronym,ディオール=dior,フラグメント=fragmentDesign,',
  'ジョージコックス=georgeCox,ゴルチエ=jeanPaulGaultier,A.P.C=apc,アー・ペー・セー=apc,アンダーカバー=undercover,',
  'テンシー=tenC,オフ-ホワイト=offWhite,アンブッシュ=ambush,グラミチ=gramicci,ノース・フェイス=theNorthFace,',
  'ペンドルトン=pendleton,ラコステ=lacoste,エンダースキーマ=henderScheme,グローバーオール=gloverall,カナダグース=canadaGoose,',
  'バーバリー=burberry,グッチ=gucci,シュプリーム=supreme,ステューシー=stussy,フライターグ=freitag,エドウイン=edwin,',
  'ルイスレザーズ=lewisLeathers,オニツカタイガー=onitsukaTiger,ミズノ=mizuno,アルファ インダストリーズ=alphaIndustries,',
  'シチズン=citizen,Gショック=gShock,G-SHOCK=gShock,ベイプ=bape,BAPE=bape,クロムハーツ=chromeHearts,',
  'レペット=repetto,パラブーツ=paraboot,バブアー=barbour,ウールリッチ=woolrich,コロンビア=columbia,マムート=mammut,',
  'カリマー=karrimor,ミステリーランチ=mysteryRanch,パレス=palace,ストーンアイランド=stoneIsland,ヘインズ=hanes,',
  'フィルメランジェ=filmelange,ハンター=hunter,キーン=keen,テバ=teva,ホカ=hoka,スイコック=suicoke,トーガ=toga,',
  'ネペンテス=nepenthes,ニードルズ=needles,エンジニアド=engineeredGarments,サウス2 ウエスト8=south2West8,ビームス=beams,',
  'ユナイテッドアローズ=unitedArrows,ビューティ&ユース=beautyAndYouth,アーバンリサーチ=urbanResearch,',
  'ジャーナル スタンダード=journalStandard,エディフィス=edifice,シップス=ships,ナノ・ユニバース=nanoUniverse,ナナミカ=nanamica,',
  'ナンガ=nanga,ハイク=hyke,マスターマインド=mastermindJapan,ワコマリア=wackoMaria,ネイバーフッド=neighborhood,',
  'ノンネイティブ=nonnative,ホワイトマウンテニアリング=whiteMountaineering,アンドワンダー=andWander,ダブレット=doublet,',
  'ブラックミーンズ=blackmeans,オーラリー=auralee,コモリ=comoli,グラフペーパー=graphpaper,ロンハーマン=ronHerman,ロエベ=loewe,',
  'フレッドペリー=fredPerry,マッキントッシュ=mackintosh,オールデン=alden,リーガル=regalShoeCo,サスクワッチ=sasquatchfabrix,',
  'パム=perksAndMini,ユニクロ=uniqlo,アウトドアプロダクツ=outdoorProducts,ブリーフィング=briefing,',
  'マスターピース=masterPiece,ラミダス=ramidus,バグジャック=bagjack,ラングラー=wrangler,リー=lee,',
  'シエラデザインズ=sierraDesigns,グレンフェル=grenfell,ジョンスメドレー=johnSmedley,ジョン スメドレー=johnSmedley,',
  'トリッカーズ=trickers,チャーチ=churchs,ジースター=gStarRaw,カシオ=gShock,キース=kith,マルニ=marni,マリメッコ=marimekko,',
  'ブラックアイパッチ=blackEyePatch,アヴィレックス=avirex,ジュンハシモト=junhashimoto,ヒューマンメイド=humanMade,',
  'フレッド シーガル=fredSegal,ゴールドウイン=goldwin,デサント=descente,モンベル=montbell,スノーピーク=snowPeak,',
  'ヘリーハンセン=hellyHansen,ルコック=leCoqSportif,オークリー=oakley,アフターベース=afterbase,イーストパック=eastpak,',
  'レスポートサック=lesportsac,ジャンスポーツ=janSport,マンハッタンポーテージ=manhattanPortage,エービーシー=abcMart,',
  'ロッキーマウンテン=rockyMountainFeatherbed,デュベティカ=duvetica,レッドウィング=redWing,ティンバーランド=timberland,',
  'セントジェームス=saintJames,オーシバル=orcival,マーガレット・ハウエル=margaretHowell,ポストオーバーオールズ=postOveralls,',
  'ケイスイス=kSwiss,サッカニー=saucony,カルフ=karhu,チャムス=chums,ハーレー=harleyDavidson,ベルスタッフ=belstaff,',
  'スペルガ=superga,セバゴ=sebago,G.H.バス=ghBass,ヴェトモン=vetements,エムエム6=mm6,マルジェラ=maisonMargiela,',
  'クロックス=crocs,サルヴァム=sulvam,ミキモト=mikimoto,ブラックコムデギャルソン=blackCommeDesGarcons,',
  'ドーバー=doverStreetMarket,ジュンヤ=junyaWatanabe,ギャルソン=commeDesGarcons,サカイ=sacai,',
  'ユニフォーム エクスペリメント=uniformExperiment,ソフネット=sophnet,ラルフ ローレン=poloRalphLauren,',
  'ジェイエムウエストン=jmWeston,ステュディオ=studious,アンリアレイジ=anrealage,ミナペルホネン=mina,トゥモローランド=tomorrowland,',
  'リステア=restir,アルパインスターズ=alpinestars,シャルベ=charvet',
].join('').split(',').filter(Boolean).map((pair) => pair.split('=')).sort((a, b) => b[0].length - a[0].length);

async function page(path) {
  const response = await fetch(`https://www.fashion-press.net${path}`, {
    headers: { 'user-agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(40_000),
  });
  if (response.status === 404) return '';
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

const find = option('find');
if (find) {
  const html = await page('/brands/');
  const hits = [...html.matchAll(/href="\/brands\/(\d+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, id, name]) => `${id} ${name.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`)
    .filter((line) => line.includes(find));
  console.log([...new Set(hits)].join('\n') || 'Not in the index; search the site for the brand page.');
  process.exit();
}
const pairs = process.argv.slice(2).filter((arg) => /^\w+=\d+$/.test(arg));
if (!pairs.length) {
  console.error('Usage: node scripts/collab/fashion-press.mjs houseId=brandId … | --find <katakana>');
  process.exit(1);
}
const { houses, collaborations } = await loadData();
const known = katakana.filter(([, house]) => Object.hasOwn(houses, house));
for (const pair of pairs) {
  const [id, brand] = pair.split('=');
  if (!Object.hasOwn(houses, id)) { console.log(`${id}: unknown house, skipped`); continue; }
  const family = rootOf(houses, id);
  const recorded = recordedYears(houses, collaborations, id);
  const links = new Set();
  const seen = new Set();
  console.log(`## ${id}`);
  for (let n = 1; n < 60; n++) {
    const html = await page(`/news/brand/${brand}/collab?page=${n}`);
    let added = 0;
    for (const [article] of html.matchAll(/<article class="fp_media_tile[\s\S]*?<\/article>/g)) {
      const link = article.match(/href="(\/news\/\d+)" title="([^"]*)"/);
      if (!link || links.has(link[1])) continue;
      links.add(link[1]);
      added++;
      // Very recent articles show "18時間前" instead of a date.
      const date = article.match(/<span>(\d{4})\.(\d+)\.\d+/);
      const year = date ? Number(date[1]) : new Date().getFullYear();
      const month = date ? Number(date[2]) : new Date().getMonth() + 1;
      let title = link[2];
      const partners = new Set();
      for (const [name, house] of known) {
        if (house === 'lee' && !/(^|[×\s&“「・])リー[×\s&”」のと]/.test(title)) continue;
        if (!title.includes(name)) continue;
        if (rootOf(houses, house) !== family) partners.add(house);
        title = title.replaceAll(name, '◆');
      }
      const fresh = [...partners].filter((house) => {
        const years = recorded.get(rootOf(houses, house));
        return !(years?.has(year) || (month >= 11 && years?.has(year + 1))) && !seen.has(house + year);
      });
      fresh.forEach((house) => seen.add(house + year));
      if (fresh.length) console.log(`${year}/${month} [${fresh.join(' ')}] ${link[2].slice(0, 40)}`);
      else if (!partners.size && process.argv.includes('--all')) console.log(`${year}/${month} ? ${link[2].slice(0, 40)}`);
    }
    if (!added) break;
    await sleep(1500);
  }
  console.log(`${links.size} articles read`);
}
