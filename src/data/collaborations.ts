import type { CollaborationData } from '../types';
import type { HouseId } from './houses';

/**
 * Brand collaborations, keyed by a stable camelCase project/release ID.
 * Add one entry per release, using two or more distinct keys from houses.ts
 * and its release year. Do not generate exact collection names or descriptions
 * for new entries. Existing names, notes and sources may remain as metadata.
 *
 * Entry template (replace placeholders with researched facts):
 * projectId: {
 *   houses: ['firstHouseId', 'secondHouseId', 'optionalThirdHouseId'],
 *   year: 2026,
 * },
 *
 * These records are separate from employment and never generate career moves.
 * The starter set is 50 notable releases, not a ranking or exhaustive history.
 * Years refer to release, rather than an earlier announcement or runway show.
 */
export const collaborations = {
  vaqueraAmericanApparel2018: {
    houses: ['vaquera', 'americanApparel'], year: 2018,
    sources: ['https://www.vogue.com/fashion-shows/fall-2018-ready-to-wear/vaquera'],
  },
  vaqueraVans2022: {
    houses: ['vaquera', 'vans'], year: 2022,
    sources: ['https://www.vogue.com/fashion-shows/fall-2022-ready-to-wear/vaquera'],
  },
  vaqueraMarcJacobs2024: {
    houses: ['vaquera', 'marcJacobs'], year: 2024,
    sources: ['https://milled.com/marc-jacobs/the-stam-returns-vaquera-x-marc-jacobs-2myqgtppkcm_6imd'],
  },
  vaqueraConverse2025: {
    houses: ['vaquera', 'converse'], year: 2025,
    sources: ['https://about.nike.com/en-GB/newsroom/releases/nike-and-converse-begin-vaquera-partnership-with-two-bold-expressions-of-the-chuck-taylor-all-star'],
  },
  vaqueraNike2025: {
    houses: ['vaquera', 'nike'], year: 2025,
    sources: ['https://about.nike.com/en-GB/newsroom/releases/nike-and-converse-begin-vaquera-partnership-with-two-bold-expressions-of-the-chuck-taylor-all-star', 'https://milled.com/comme-des-garcons/nike-x-vaquera-air-max-dn8-now-available-6aLc0sckw1q_wWtt'],
  },
  vaqueraSupreme2026: {
    houses: ['vaquera', 'supreme'], year: 2026,
    sources: ['https://hypebeast.com/2026/11/supreme-vaquera-fall-2026-collaboration-collection-release-info'],
  },
  raisedByWolvesVans2016: {
    houses: ['raisedByWolves', 'vans'], year: 2016,
    sources: ['https://sneakernews.com/2016/02/23/off-the-hook-raised-by-wolves-vans-collaboration/'],
  },
  raisedByWolvesReebok2017: {
    houses: ['raisedByWolves', 'reebok'], year: 2017,
    sources: ['https://sneakernews.com/2017/12/12/raised-by-wolves-reebok-classic-leather-gore-tex-available-now/'],
  },
  raisedByWolvesTimberland2018: {
    houses: ['raisedByWolves', 'timberland'], year: 2018,
    sources: ['https://hypebeast.com/2018/4/raised-by-wolves-timberland-lookbook'],
  },
  raisedByWolvesNakedAndFamous2018: {
    houses: ['raisedByWolves', 'nakedAndFamous'], year: 2018,
    sources: ['https://nakedandfamousdenim.com/blogs/capsule-collections/naked-famous-denim-x-raised-by-wolves', 'https://milled.com/tate-yoko/f-ck-off-capsule-collection-now-available-p7FYNW7r_Qf1WWt2'],
  },
  raisedByWolvesSauconyAya2020: {
    houses: ['raisedByWolves', 'saucony'], year: 2020,
    sources: ['https://www.finessestore.com/blogs/journal/sneaker-releases-raised-by-wolves-x-saucony-aya-january-25'],
  },
  raisedByWolvesSauconyJazz812023: {
    houses: ['raisedByWolves', 'saucony'], year: 2023,
    sources: ['https://www.linkedin.com/pulse/raised-wolves-spring-23-saucony-originals-wolf-pack-cal-green', 'https://www.soleretriever.com/news/articles/raised-by-wolves-saucony-jazz-81-release-date-february-2023'],
  },
  raisedByWolvesSauconyGridAzura2023: {
    houses: ['raisedByWolves', 'saucony'], year: 2023,
    sources: ['https://www.linkedin.com/pulse/raised-wolves-spring-23-saucony-originals-wolf-pack-cal-green', 'https://www.nicekicks.com/raised-by-wolves-saucony-grid-azura-2000-s70737-2-pack-leader/'],
  },
  raisedByWolvesNakedAndFamous2023: {
    houses: ['raisedByWolves', 'nakedAndFamous'], year: 2023,
    sources: ['https://nakedandfamousdenim.squarespace.com/en/news/2023/10/30/a-midnight-collaboration-naked-amp-famous-denim-x-raised-by-wolves'],
  },
  northFaceJunyaWatanabeMan2006: {
    houses: ['theNorthFace', 'junyaWatanabeMan'], year: 2006,
    sources: ['https://hypebeast.com/2006/7/eye-junya-watanabe-x-north-face-t-shirt'],
  },
  northFaceNanamica2003: {
    houses: ['theNorthFace', 'nanamica'], year: 2003,
    sources: ['https://about.goldwin.co.jp/eng/about/history'],
  },
  northFaceHykeSpring2018: {
    houses: ['theNorthFace', 'hyke'], year: 2018,
    sources: ['https://www.houyhnhnm.jp/en/news/143896/'],
  },
  northFaceHykeAutumn2018: {
    houses: ['theNorthFace', 'hyke'], year: 2018,
    sources: ['https://www.thenorthface.jp/whatsnew/2981'],
  },
  northFaceVans2017: {
    houses: ['theNorthFace', 'vans'], year: 2017,
    sources: ['https://www.nicekicks.com/north-face-x-vans-collection-release-date/'],
  },
  northFaceBeams2017: {
    houses: ['theNorthFace', 'beams'], year: 2017,
    sources: ['https://www.beams.co.jp/news/571/'],
  },
  northFaceBrainDead2020: {
    houses: ['theNorthFace', 'brainDead'], year: 2020,
    sources: ['https://www.highsnobiety.com/p/the-north-face-brain-dead-fall-2020/'],
  },
  northFaceOnlineCeramics2022: {
    houses: ['theNorthFace', 'onlineCeramics'], year: 2022,
    sources: ['https://shop-eat-surf-outdoor.com/press-releases/the-north-face-teams-up-with-online-ceramics-for-earth-day-inspired-collection/515198/'],
  },
  northFaceCdg2023: {
    houses: ['theNorthFace', 'cdg'], year: 2023,
    sources: ['https://milled.com/TheNorthFace/the-north-face-x-cdg-is-live-JeRCpsoYsW75JdLV'],
  },
  northFaceUndercover2023: {
    houses: ['theNorthFace', 'undercover'], year: 2023,
    sources: ['https://www.highsnobiety.com/p/undercover-the-north-face-soukuu-release-information/'],
  },
  northFaceCecilieBahnsen2025: {
    houses: ['theNorthFace', 'cecilieBahnsen'], year: 2025,
    sources: ['https://www.vogue.co.uk/article/cecilie-bahnsen-the-north-face-collaboration'],
  },
  northFaceSkims2024: {
    houses: ['theNorthFace', 'skims'], year: 2024,
    sources: ['https://milled.com/TheNorthFace/the-north-face-x-skims-is-here-Lmj6ZvGAQ798f7yA'],
  },
  northFaceAimeLeonDore2025: {
    houses: ['theNorthFace', 'aimeLeonDore'], year: 2025,
    sources: ['https://www.aimeleondore.com/blogs/news/aime-leon-dore-the-north-face', 'https://www.youtube.com/watch?v=8o6u5pDgJoI'],
  },
  // Verified: The North Face × KAWS (2022). KAWS is an artist, not an existing
  // house; preserve this research gap until artist collaborations are supported.
  // https://www.endclothing.com/us/features/the-north-face-xx-kaws-collection
  momotaroNakedAndFamous2010: {
    houses: ['momotaro', 'nakedAndFamous'], year: 2010,
    sources: ['https://dutildenim.com/blogs/jeans/momotaro-x-naked-famous-available-at-dutil'],
  },
  togaSuicoke2016: {
    houses: ['toga', 'suicoke'], year: 2016,
    sources: ['https://www.fashion-headline.com/en/article/7993', 'https://www.gqjapan.jp/fashion/news/20190521/toga-suicoke-dogs-news'],
  },
  togaPorterYoshida2019: {
    houses: ['toga', 'porterYoshida'], year: 2019,
    sources: ['https://int.toga.jp/blogs/information/toga-porter-released-on-november-21st'],
  },
  togaLee2019: {
    houses: ['toga', 'lee'], year: 2019,
    sources: ['https://store.toga.jp/blogs/information/aw2019-20-toga-lee'],
  },
  togaVans2020: {
    houses: ['toga', 'vans'], year: 2020,
    sources: ['https://store.toga.jp/blogs/information/vans-otc-sales200710'],
  },
  togaTabio2020: {
    houses: ['toga', 'tabio'], year: 2020,
    sources: ['https://corporate.tabio.com/jp/corporate/news/press/2020/8604/'],
  },
  togaUmbro2026: {
    houses: ['toga', 'umbro'], year: 2026,
    sources: ['https://www.mensnonno.jp/fashion/new-topics/728571/'],
  },
  sasquatchfabrixStussy2014: {
    houses: ['sasquatchfabrix', 'stussy'], year: 2014,
    sources: ['https://hypebeast.com/2014/7/sasquatchfabrix-x-stussy-t-shirt-collection', 'https://nimunamu.base.shop/items/109961363'],
  },
  sasquatchfabrixNewEra2011: {
    houses: ['sasquatchfabrix', 'newEra'], year: 2011,
    sources: ['https://hypebeast.com/2011/11/sasquatchfabrix-x-new-era-rabbit-fur-ninja-fitted-cap'],
  },
  sasquatchfabrixSupreme2016: {
    houses: ['sasquatchfabrix', 'supreme'], year: 2016,
    sources: ['https://www.xxlmag.com/supreme-x-sasquatchfabrix-collection/'],
  },
  sasquatchfabrixBeams2016: {
    houses: ['sasquatchfabrix', 'beams'], year: 2016,
    sources: ['https://www.beams.co.jp/special/talk/archive/2016/0422/'],
  },
  sasquatchfabrixVansBeams2016: {
    houses: ['sasquatchfabrix', 'vans', 'beams'], year: 2016,
    sources: ['https://www.beams.co.jp/special/talk/archive/2016/0422/'],
  },
  sasquatchfabrixHaven2016: {
    houses: ['sasquatchfabrix', 'haven'], year: 2016,
    sources: ['https://milled.com/haven/visvim-stone-island-adidas-x-white-mountaineering-ganryu-adidas-consortium-ZKQRfC_mfp0z0f6S'],
  },
  sasquatchfabrixPumaBeams2024: {
    houses: ['sasquatchfabrix', 'puma', 'beams'], year: 2024,
    sources: ['https://www.beams.co.jp/en/news/4041/'],
  },
  kateSpadeKeds2017: {
    houses: ['kateSpade', 'keds'], year: 2017,
    sources: ['https://www.earnshaws.com/news/twinkle-twinkle-little-shoe/', 'https://www.femalemag.com.sg/gallery/fashion/kate-spade-shoes-keds-sneakers/'],
  },
  bedwinDickies2011: {
    houses: ['bedwinTheHeartbreakers', 'dickies'], year: 2011,
    sources: ['https://hypebeast.com/2011/4/bedwin-the-heartbreakers-dickies-circus-pants', 'https://www.gq.com/story/stuff-we-like-bedwin-and-the-heartbreakers-at-odin'],
  },
  bedwinAdidas2013: {
    houses: ['bedwinTheHeartbreakers', 'adidas'], year: 2013,
    sources: ['https://hypebeast.com/2013/6/adidas-originals-by-bedwin-2013-fall-winter-footwear-collection', 'https://www.bkmagazine.com/shop/sports-and-fitness-adidas-originals-concept-store/'],
  },
  bedwinAdidas2015: {
    houses: ['bedwinTheHeartbreakers', 'adidas'], year: 2015,
    sources: ['https://dlxtokyo.com/en/works/index.html'],
  },
  bedwinRvca2021: {
    houses: ['bedwinTheHeartbreakers', 'rvca'], year: 2021,
    sources: ['https://openers.jp/en/fashion/fashion_news/M12l7'],
  },
  bedwinVans2021: {
    houses: ['bedwinTheHeartbreakers', 'vans'], year: 2021,
    sources: ['https://bedwintokyo.com/en/blogs/journal/vault-by-vans-x-bedwin-the-heartbreakers'],
  },
  bedwinMaisonMiharaYasuhiro2025: {
    houses: ['bedwinTheHeartbreakers', 'maisonMiharaYasuhiro'], year: 2025,
    sources: ['https://en.miharayasuhiro.jp/blog/?cid=4', 'https://www.fashion-press.net/news/138255'],
  },
  bedwinTheNorthFace2011: {
    houses: ['bedwinTheHeartbreakers', 'theNorthFace'], year: 2011,
    sources: ['https://hypebeast.com/2011/11/bedwin-the-heartbreakers-x-the-north-face-2011-fallwinter-collection', 'https://www.ragtag.jp/closet/buyers_voice/80.html'],
  },
  bedwinConverse2011: {
    houses: ['bedwinTheHeartbreakers', 'converse'], year: 2011,
    sources: ['https://www.sneakerfiles.com/bedwin-the-heartbreakers-x-converse-chuck-taylor-all-star-hi-%E2%80%98tom%E2%80%99/'],
  },
  bedwinEverlast2018: {
    houses: ['bedwinTheHeartbreakers', 'everlast'], year: 2018,
    sources: ['https://prtimes.jp/main/html/rd/p/000000002.000038672.html'],
  },
  bedwinFila2023: {
    houses: ['bedwinTheHeartbreakers', 'fila'], year: 2023,
    sources: ['https://www.fashion-press.net/news/107175'],
  },
  mountainHardwearColeHaan2015: {
    houses: ['mountainHardwear', 'coleHaan'], year: 2015,
    sources: ['https://www.prnewswire.com/news-releases/cole-haan-debuts-zerogrand-lifestyle-collection-300155004.html'],
  },
  mountainHardwearBeams2023: {
    houses: ['mountainHardwear', 'beams'], year: 2023,
    sources: ['https://www.beams.co.jp/blog/nmb/125605/', 'https://www.beams.co.jp/blog/js/127180/'],
  },
  stussyMountainHardwear2023: {
    houses: ['stussy', 'mountainHardwear'], year: 2023,
    sources: ['https://www.stussy.com/blogs/features/stussy-mountain-hardwear'],
  },
  stussyMountainHardwear2025: {
    houses: ['stussy', 'mountainHardwear'], year: 2025,
    sources: ['https://www.stussy.com/blogs/news/stussy-and-mountain-hardwear'],
  },
  stussyMountainHardwear2026: {
    houses: ['stussy', 'mountainHardwear'], year: 2026,
    sources: ['https://www.mountainhardwear.com/stussy.html', 'https://www.stussy.com/blogs/news/mountain-hardwear'],
  },
  maryQuantKangol1967: {
    houses: ['maryQuant', 'kangol'], year: 1967,
    sources: ['https://kangol.jp/shop/t/t1531/', 'https://www.maryquant.co.jp/special/70th/kangol.html'],
  },
  soarRunningAltra2025: {
    houses: ['soarRunning', 'altra'], year: 2025,
    sources: ['https://www.soarrunning.com/en-us/pages/soar-x-altra', 'https://altrarunning.hk/blogs/news/altra-x-soar-nbsp-%E8%81%AF%E4%B9%98%E8%B6%8A%E9%87%8E%E8%B7%91%E9%9E%8B%E9%A6%96%E5%BA%A6%E4%BA%AE%E7%9B%B8'],
  },
  paulSmithRapha2007: {
    houses: ['paulSmith', 'rapha'], year: 2007,
    sources: ['https://bikebiz.com/rapha-teams-up-with-paul-smith-for-new-collection/'],
  },
  paulSmithBurton2010: {
    houses: ['paulSmith', 'burton'], year: 2010,
    sources: ['https://www.snowboarder.com/news/burton-snowboards-and-paul-smith-collab-2011-vapor-snowboard'],
  },
  paulSmithJohnLobb2012: {
    houses: ['paulSmith', 'johnLobb'], year: 2012,
    sources: ['https://www.thefashionisto.com/paul-smith-collaborates-with-bootmaker-john-lobb/'],
  },
  paulSmithBarbour2012: {
    houses: ['paulSmith', 'barbour'], year: 2012,
    sources: ['https://www.vogue.co.uk/gallery/barbour-paul-smith-jeans-collaboration-launches'],
  },
  paulSmithNewBalance2018: {
    houses: ['paulSmith', 'newBalance'], year: 2018,
    sources: ['https://prtimes.jp/main/html/rd/p/000000013.000031226.html'],
  },
  paulSmithAhluwalia2022: {
    houses: ['paulSmith', 'ahluwalia'], year: 2022,
    sources: ['https://ahluwalia.world/pages/about', 'https://www.crash.fr/paul-smith-x-aluwhalia/'],
  },
  paulSmithPorterYoshida2022: {
    houses: ['paulSmith', 'porterYoshida'], year: 2022,
    sources: ['https://prtimes.jp/main/html/rd/p/000000081.000031226.html'],
  },
  umbroSupreme2022: {
    houses: ['umbro', 'supreme'], year: 2022,
    sources: ['https://supreme.com/previews/springsummer2022/jackets/supreme-umbro-track-jacket-5', 'https://www.versus.uk.com/articles/supreme-and-umbro-reunite-for-summer-football-shirt-drop/'],
  },
  umbroAries2021: {
    houses: ['umbro', 'aries'], year: 2021,
    sources: ['https://www.umbro.com/en/style/collections/aries-arise-x-umbro/'],
  },
  umbroAries2023: {
    houses: ['umbro', 'aries'], year: 2023,
    sources: ['https://www.umbro.com/en/style/collections/aries-x-umbro-2023/'],
  },
  umbroAries2024: {
    houses: ['umbro', 'aries'], year: 2024,
    sources: ['https://www.umbro.com/en/style/collections/aries-x-umbro/'],
  },
  umbroVetements2017: {
    houses: ['umbro', 'vetements'], year: 2017,
    sources: ['https://cream.ac.uk/features/ambika-p3-contains-the-crowds-umbro-100-sportswear-x-fashion/'],
  },
  umbroRowingBlazers2021: {
    houses: ['umbro', 'rowingBlazers'], year: 2021,
    sources: ['https://rowingblazers.com/blogs/dispatches/rowing-blazers-x-umbro-shop-the-collaboration-now', 'https://www.theindustry.fashion/rowing-blazers-launches-collaboration-collection-with-umbro/'],
  },
  umbroNigelCabourn2021: {
    houses: ['umbro', 'nigelCabourn'], year: 2021,
    sources: ['https://www.umbro.com/en/style/collections/nigel-cabourn-x-umbro/'],
  },
  umbroNigelCabourn2022: {
    houses: ['umbro', 'nigelCabourn'], year: 2022,
    sources: ['https://www.umbro.co.uk/blog/umbro-gets-matchday-ready-with-second-round-nigel-cabourn-collab-collection', 'https://www.cabourn.com/en-au/blogs/journal/styling-story-005-umbro-nigel-cabourn'],
  },
  umbroNHoolywood2019: {
    houses: ['umbro', 'nHoolywood'], year: 2019,
    sources: ['https://hypebeast.com/2019/3/nhoolywood-umbro-spring-summer-2019-collection'],
  },
  umbroBikkembergs2005: {
    houses: ['umbro', 'bikkembergs'], year: 2005,
    sources: ['https://studycenter.momu.be/archiefdirkbikkembergs/s/en/item/642', 'https://www.standaard.be/media-en-cultuur/focus/43498161.html'],
  },
  umbroPaulSmith2002: {
    houses: ['umbro', 'paulSmith'], year: 2002,
    sources: ['https://www.umbro.com/en/100-years-of-umbro/always-umbro-since-1924/celebrating-100-years-of-umbro/'],
  },
  umbroPalace2012: {
    houses: ['umbro', 'palace'], year: 2012,
    sources: ['https://blog.slamcity.com/palace-x-umbro/'],
  },
  umbroOffWhite2017: {
    houses: ['umbro', 'offWhite'], year: 2017,
    sources: ['https://pausemag.co.uk/2017/02/virgil-ablohs-off-white-x-umbro-collaboration-is-now-available/'],
  },
  umbroHiddenNy2025: {
    houses: ['umbro', 'hiddenNy'], year: 2025,
    sources: ['https://www.umbro.com/en/style/collections/hidden-x-umbro/'],
  },
  umbroRains2025: {
    houses: ['umbro', 'rains'], year: 2025,
    sources: ['https://www.umbro.com/en/style/collections/rains-x-umbro/'],
  },
  wranglerBillabong2021: {
    houses: ['wrangler', 'billabong'], year: 2021,
    sources: ['https://www.kontoorbrands.com/news-media/feature-story/13512/western-meets-west-coast-in-first-ever-billabong-x-wrangler-collaboration'],
  },
  wranglerPendleton2022: {
    houses: ['wrangler', 'pendleton'], year: 2022,
    sources: ['https://www.kontoorbrands.com/investors/news-events/press-releases/detail/138/wrangler-and-pendleton-woolen-mills-weave-the-spirit-of'],
  },
  wranglerGant2022: {
    houses: ['wrangler', 'gant'], year: 2022,
    sources: ['https://officemagazine.net/gant-goes-west-wrangler'],
  },
  wranglerStaud2023: {
    houses: ['wrangler', 'staud'], year: 2023,
    sources: ['https://www.prnewswire.com/news-releases/staud-and-wrangler-blend-california-cool-and-western-heritage-in-new-premium-denim-collaboration-301919324.html'],
  },
  wranglerAvirex2026: {
    houses: ['wrangler', 'avirex'], year: 2026,
    sources: ['https://www.kontoorbrands.com/investors/news-events/press-releases/detail/223/icons-collide-wrangler-and-avirex-launch-limited-edition'],
  },
  wranglerRoa2026: {
    houses: ['wrangler', 'roa'], year: 2026,
    sources: ['https://www.wrangler.com/shop/collections-wrangler-x-roa'],
  },
  ovoJordanBrand2015: {
    houses: ['ovo', 'jordanBrand'], year: 2015,
    sources: ["https://www.gq.com/story/drake-jordan-x-ovo-release-date"],
  },
  ovoCanadaGoose2011: {
    houses: ['ovo', 'canadaGoose'], year: 2011,
    sources: ["https://globalgrind.com/1767227/drake-canada-goose-release-5000-leather-jacket-photos/"],
  },
  ovoCanadaGoose2023: {
    houses: ['ovo', 'canadaGoose'], year: 2023,
    sources: ["https://www.canadagoose.jp/news/detail?id=233&y=2023"],
  },
  ovoBape2023: {
    houses: ['ovo', 'bape'], year: 2023,
    sources: ["https://us.bape.com/blogs/news/a-bathing-ape-x-octobers-very-own-1"],
  },
  ovoBape2025: {
    houses: ['ovo', 'bape'], year: 2025,
    sources: ["https://eu.bape.com/blogs/news/bape%C2%AE-x-ovo"],
  },
  ovoRoots2011: {
    houses: ['ovo', 'roots'], year: 2011,
    sources: ["https://www.thefader.com/2011/11/04/first-look-drake-designed-varsity-jackets"],
  },
  ovoClarks2017: {
    houses: ['ovo', 'clarks'], year: 2017,
    sources: ["https://stockx.com/news/ovo-x-clarks-originals-desert-boot-black/"],
  },
  ovoTimberland2017: {
    houses: ['ovo', 'timberland'], year: 2017,
    sources: ["https://www.xxlmag.com/ovo-and-timberland-have-a-collaboration-on-the-way/"],
  },
  ovoNeedles2024: {
    houses: ['ovo', 'needles'], year: 2024,
    sources: ["https://www.fullress.com/needles-ovo-octobers-very-own/"],
  },
  ovoNewEra2025: {
    houses: ['ovo', 'newEra'], year: 2025,
    sources: ["https://octobersveryown.com/pages/new-era-mlb-collection-2025"],
  },
  ovoSuicoke2021: {
    houses: ['ovo', 'suicoke'], year: 2021,
    sources: ["https://www.highsnobiety.com/p/octobers-very-own-ovo-suicoke-fw21-collab/"],
  },
  ovoMitchellAndNess2016: {
    houses: ['ovo', 'mitchellAndNess'], year: 2016,
    sources: ["https://www.xxlmag.com/ovo-x-toronto-raptors-x-mitchell-ness-unveil-spring-2016-collection/"],
  },
  ovoStarter2025: {
    houses: ['ovo', 'starter'], year: 2025,
    sources: ["https://octobersveryown.com/pages/starter-collection-2025"],
  },
  ovoDsquared22019: {
    houses: ['ovo', 'dsquared2'], year: 2019,
    sources: ["https://www.wonderlandmagazine.com/2019/05/21/dsquared2-ovo-collection/"],
  },
  ovoDsquared22020: {
    houses: ['ovo', 'dsquared2'], year: 2020,
    sources: ["https://prtimes.jp/main/html/rd/p/000000009.000046849.html"],
  },
  nordaCieleAthletics2022: {
    houses: ['norda', 'cieleAthletics'], year: 2022,
    sources: ['https://hypebeast.com/2022/10/ciele-athletics-norda-001-sneaker-gravel-release-date'],
  },
  nordaSatisfy2022: {
    houses: ['norda', 'satisfy'], year: 2022,
    sources: ['https://believeintherun.com/articles/satisfy-norda-peace-silence/'],
  },
  nordaZegna2023: {
    houses: ['norda', 'zegna'], year: 2023,
    sources: ['https://hypebeast.com/2023/3/zegna-norda-001-sneaker-release-date'],
  },
  nordaReigningChamp2023: {
    houses: ['norda', 'reigningChamp'], year: 2023,
    sources: ['https://imboldn.com/reigning-champ-x-norda-collaboration/'],
  },
  nordaSoarRunning2024: {
    houses: ['norda', 'soarRunning'], year: 2024,
    sources: ['https://believeintherun.com/articles/norda-soar-trail-collection/'],
  },
  nordaBlackDiamond2026: {
    houses: ['norda', 'blackDiamond'], year: 2026,
    sources: ['https://outdoorindustry.org/press-release/norda-and-black-diamond-equipment-launch-long-term-partnership/'],
  },
  havenNewBalance2019: {
    houses: ['haven', 'newBalance'], year: 2019,
    sources: ["https://store.newbalance.co.jp/press/2020/p-53973"],
  },
  havenNewBalance2020: {
    houses: ['haven', 'newBalance'], year: 2020,
    sources: ["https://store.newbalance.co.jp/press/2020/p-53973"],
  },
  havenVans2026: {
    houses: ['haven', 'vans'], year: 2026,
    sources: ["https://havenshop.com/news/haven-otw-by-vans-nyc-pop-up/"],
  },
  havenClarks2023: {
    houses: ['haven', 'clarks'], year: 2023,
    sources: ["https://snkrdunk.com/articles/21702/"],
  },
  havenTimberland2026: {
    houses: ['haven', 'timberland'], year: 2026,
    sources: ["https://havenshop.com/features/editorial/haven-timberland-field-boot-gtx"],
  },
  havenDrMartens2021: {
    houses: ['haven', 'drMartens'], year: 2021,
    sources: ["https://www.houyhnhnm.jp/en/news/519688/"],
  },
  havenConverse2026: {
    houses: ['haven', 'converse'], year: 2026,
    sources: ["https://www.converse.com/shop/haven-collection"],
  },
  havenAsics2025: {
    houses: ['haven', 'asics'], year: 2025,
    sources: ["https://havenshop.com/news/haven-asics-release-information"],
  },
  havenViberg2025: {
    houses: ['haven', 'viberg'], year: 2025,
    sources: ["https://havenshop.com/features/process/haven-fall-winter-2025-process/"],
  },
  havenHoka2025: {
    houses: ['haven', 'hoka'], year: 2025,
    sources: ["https://havenshop.com/features/process/haven-fall-winter-2025-process/"],
  },
  havenLowa2025: {
    houses: ['haven', 'lowa'], year: 2025,
    sources: ["https://havenshop.com/news/haven-lowa-winter-2025"],
  },
  havenTarvas2025: {
    houses: ['haven', 'tarvas'], year: 2025,
    sources: ["https://havenshop.com/news/haven-fall-2025-delivery-2-release-information/"],
  },
  havenRegalShoeCo2025: {
    houses: ['haven', 'regalShoeCo'], year: 2025,
    sources: ["https://www.regal.co.jp/features/detail/regal-shoe-and-co/250530-haven"],
  },
  havenNanga2024: {
    houses: ['haven', 'nanga'], year: 2024,
    sources: ["https://havenshop.com/features/editorial/haven-nanga-editorial/"],
  },
  havenNanga2025: {
    houses: ['haven', 'nanga'], year: 2025,
    sources: ["https://mastered.jp/news/haven-x-nanga-20251121/"],
  },
  havenSchott2018: {
    houses: ['haven', 'schott'], year: 2018,
    sources: ["https://www.eyecmag.com/news/2018/11/14/haven-and-schott-nyc-reveal-their-perfecto-leather-jacket-collaboration"],
  },
  havenPorter2019: {
    houses: ['haven', 'porterYoshida'], year: 2019,
    sources: ["https://www.houyhnhnm.jp/en/news/295246/"],
  },
  havenMountainResearch2020: {
    houses: ['haven', 'mountainResearch'], year: 2020,
    sources: ["https://www.houyhnhnm.jp/en/news/338086/"],
  },
  havenBedwin2016: {
    houses: ['haven', 'bedwinTheHeartbreakers'], year: 2016,
    sources: ["https://hypebeast.com/hb100/2016/arthur-and-daniel-chmielewski"],
  },
  havenHerill2026: {
    houses: ['haven', 'herill'], year: 2026,
    sources: ["https://havenshop.com/features/editorial/herill-for-haven-20th-anniversary-exclusive/"],
  },
  havenTheAByBeams2026: {
    houses: ['haven', 'theAByBeams'], year: 2026,
    sources: ["https://havenshop.com/features/editorial/the-a-by-beams-for-haven-20th-anniversary-exclusive/"],
  },
  // TODO: Studio 189 × J.Crew is confirmed, but its release year remains unverified.
  studio189ScotchAndSoda2022: {
    houses: ['studio189', 'scotchAndSoda'], year: 2022,
    sources: ['https://www.prnewswire.co.uk/news-releases/scotch-amp-soda-in-collaboration-with-studio-189-introduces-limited-edition-handmade-bag-849824168.html'],
  },
  // TODO: SUBU × TONYWACK is confirmed, but its release year remains unknown.
  // BAPE’s first release was November 2024; no separate 2025 release is verified.
  // Verify the release of BEAMS’ announced November 2026 textile edition separately.
  subuNanga2021: {
    houses: ['subu', 'nanga'], year: 2021,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuNanga2022: {
    houses: ['subu', 'nanga'], year: 2022,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuNanga2023: {
    houses: ['subu', 'nanga'], year: 2023,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuNanga2024: {
    houses: ['subu', 'nanga'], year: 2024,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuNanga2025: {
    houses: ['subu', 'nanga'], year: 2025,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuNanga2026: {
    houses: ['subu', 'nanga'], year: 2026,
    sources: ['https://www.subu2016.com/post/%E3%80%8Cnanga%E3%80%8D-%E3%80%8Csubu%E3%80%8D%E6%BB%8B%E8%B3%80%E7%9C%8C%E3%82%92%E6%8B%A0%E7%82%B9%E3%81%A8%E3%81%99%E3%82%8B%E5%9B%BD%E7%94%A3%E3%83%80%E3%82%A6%E3%83%B3%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E3%81%A8%E3%81%AE%E3%80%816%E5%B9%B4%E9%80%A3%E7%B6%9A%E3%81%A8%E3%81%AA%E3%82%8B%E3%82%B3%E3%83%A9%E3%83%9C%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8C%E7%99%BA%E5%A3%B2%E9%96%8B%E5%A7%8B%E3%80%82'],
  },
  subuApc2024: {
    houses: ['subu', 'apc'], year: 2024,
    sources: ['https://qui.tokyo/news/2411-apc-subu-collaboration'],
  },
  subuToga2025: {
    houses: ['subu', 'toga'], year: 2025,
    sources: ['https://nubiantokyo.com/en/blogs/news/toga-subu-knitslipon'],
  },
  subuNangaWackoMaria2025: {
    houses: ['subu', 'nanga', 'wackoMaria'], year: 2025,
    sources: ['https://hypebeast.com/2025/11/wacko-maria-nanga-subu-fall-winter-fw-2025-collaboration-collection-release-info'],
  },
  subuNangaSouth2West82026: {
    houses: ['subu', 'nanga', 'south2West8'], year: 2026,
    sources: ['https://nepenthes.co.jp/topics/article-1535/'],
  },
  sandyLiangVans2020: {
    houses: ['sandyLiang', 'vans'], year: 2020,
    sources: ['https://www.thefader.com/2020/02/18/sandy-liang-vans-collab-2020-interview-details-lookbook'],
  },
  sandyLiangVans2021: {
    houses: ['sandyLiang', 'vans'], year: 2021,
    sources: ['https://www.viacomcbs.it/licensing/wp-content/uploads/2021/05/SB-x-Vans-10.05-1.pdf'],
  },
  sandyLiangVans2022: {
    houses: ['sandyLiang', 'vans'], year: 2022,
    sources: ['https://www.sneakerfiles.com/sandy-liang-vans-collection-2022-release-date-info/'],
  },
  sandyLiangSalomon2023: {
    houses: ['sandyLiang', 'salomon'], year: 2023,
    sources: ['https://www.soleretriever.com/news/articles/sandy-liang-salomon-collection-release-date-2023'],
  },
  sandyLiangSalomon2024: {
    houses: ['sandyLiang', 'salomon'], year: 2024,
    sources: ['https://www.salomon.com/en-us/lp/salomon-tv/sandy-liang'],
  },
  sandyLiangSalomon2025: {
    houses: ['sandyLiang', 'salomon'], year: 2025,
    sources: ['https://sneakernews.com/2025/01/14/sandy-liang-salomon-xt-whisper-l47846300/'],
  },
  sandyLiangHeavenMarcJacobs2024: {
    houses: ['sandyLiang', 'heavenMarcJacobs'], year: 2024,
    sources: ['https://www.highsnobiety.com/p/heaven-marc-jacobs-sandy-liang-collab/'],
  },
  sandyLiangGap2025: {
    houses: ['sandyLiang', 'gap'], year: 2025,
    sources: ['https://www.gapinc.com/en-us/articles/2025/10/gap-and-sandy-liang-to-launch-collaboration-inspir'],
  },
  sandyLiangPorter2026: {
    houses: ['sandyLiang', 'porterYoshida'], year: 2026,
    sources: ['https://bangkok.shop-porter.com/blogs/journal/collaboration-items-with-the-new-york-based-brand-sandy-liang-will-be-released'],
  },
  // TODO: Cou Cou Intimates × Sandy Liang (2026) needs a partner house profile.
  // Confirmed by https://sandyliangdiary.substack.com/p/sandy-liang-x-cou-cou
  subuSandyLiang2023: {
    houses: ['subu', 'sandyLiang'], year: 2023,
    sources: ['https://fashionista.com/2023/10/fashionista-editors-best-purchases-october-2023'],
  },
  subuSandyLiang2024: {
    houses: ['subu', 'sandyLiang'], year: 2024,
    sources: ['https://milled.com/sandy-liang/subu-x-sandy-liang-2024-wEntyPfqzo3OR28V'],
  },
  subuSandyLiang2025: {
    houses: ['subu', 'sandyLiang'], year: 2025,
    sources: ['https://sandyliangdiary.substack.com/p/2025-gift-guide'],
  },
  subuBedJwFord2025: {
    houses: ['subu', 'bedJwFord'], year: 2025,
    sources: ['https://www.fashionsnap.com/article/2025-12-06/bed-jw-ford-subu/'],
  },
  subuBeamsSeptember2026: {
    houses: ['subu', 'beams'], year: 2026,
    sources: ['https://www.beams.co.jp/news/4940/'],
  },
  subuBeamsOctober2026: {
    houses: ['subu', 'beams'], year: 2026,
    sources: ['https://www.beams.co.jp/news/4940/'],
  },
  subuBape2024: {
    houses: ['subu', 'bape'], year: 2024,
    sources: ['https://jp.bape.com/blogs/news/subu'],
  },
  subuBapeJanuary2026: {
    houses: ['subu', 'bape'], year: 2026,
    sources: ['https://hypebeast.com/2025/12/bape-subu-puffer-sandals-bapesta-release-info'],
  },
  subuBapeOctober2026: {
    houses: ['subu', 'bape'], year: 2026,
    sources: ['https://jp.bape.com/blogs/news/subu-fw26'],
  },
  subuAvirex2026: {
    houses: ['subu', 'avirex'], year: 2026,
    sources: ['https://prtimes.jp/main/html/rd/p/000001277.000009786.html'],
  },
  subuFcRealBristol2025: {
    houses: ['subu', 'fcRealBristol'], year: 2025,
    sources: ['https://prtimes.jp/main/html/rd/p/000000055.000150214.html'],
  },
  subuFcRealBristol2026: {
    houses: ['subu', 'fcRealBristol'], year: 2026,
    sources: ['https://prtimes.jp/main/html/rd/p/000000055.000150214.html'],
  },
  subuBlackEyePatch2025: {
    houses: ['subu', 'blackEyePatch'], year: 2025,
    sources: ['https://prtimes.jp/main/html/rd/p/000000037.000150214.html'],
  },
  subuPopTradingCompany2024: {
    houses: ['subu', 'popTradingCompany'], year: 2024,
    sources: ['https://www.subu2016.com/post/subu-x-pop-trading-%E3%82%B3%E3%83%A9%E3%83%9C%E7%99%BA%E5%A3%B2'],
  },
  // TODO: Butter Goods × Padmore & Barnes is confirmed in the Peanuts/Vince Guaraldi
  // capsule, but its November 16 release year remains unverified.
  pumaButterGoods2023: {
    houses: ['butterGoods', 'puma'], year: 2023,
    sources: ['https://mediahub.puma.com/articles/puma-and-butter-goods-race-inspired-collaboration-is-a-photo-finish'],
  },
  butterGoodsDcShoes2019: {
    houses: ['butterGoods', 'dcShoes'], year: 2019,
    sources: ['https://www.skateboarding.com/news/dc-shoes-x-butter-goods'],
  },
  butterGoodsDcShoes2022: {
    houses: ['butterGoods', 'dcShoes'], year: 2022,
    sources: ['https://thepremierstore.com/blogs/product/butter-goods-x-dc'],
  },
  butterGoodsHuf2018: {
    houses: ['butterGoods', 'huf'], year: 2018,
    sources: ['https://hufworldwide.com/blogs/news/huf-x-butter-goods'],
  },
  butterGoodsUmbro2026: {
    houses: ['butterGoods', 'umbro'], year: 2026,
    sources: ['https://buttergoods.com/blogs/news/butter-umbro-lookbook'],
  },
  butterGoodsCrocs2025: {
    houses: ['butterGoods', 'crocs'], year: 2025,
    sources: ['https://buttergoods.com/blogs/news/butter-crocs'],
  },
  butterGoodsSubu2026: {
    houses: ['butterGoods', 'subu'], year: 2026,
    sources: ['https://prtimes.jp/main/html/rd/p/000000061.000150214.html'],
  },
  sperryBandOfOutsiders2008: {
    houses: ['sperry', 'bandOfOutsiders'], year: 2008,
    sources: ['https://hypebeast.com/2008/5/band-outsiders-x-sperry-topsider'],
  },
  sperryBandOfOutsiders2009: {
    houses: ['sperry', 'bandOfOutsiders'], year: 2009,
    sources: ['https://hypebeast.com/2009/8/band-of-outsiders-x-sperry-2009-fall-winter-collection'],
  },
  sperryBandOfOutsiders2010: {
    houses: ['sperry', 'bandOfOutsiders'], year: 2010,
    sources: ['https://hypebeast.com/2010/8/band-outsiders-sperry-2010-fallwinter-collection'],
  },
  sperryBandOfOutsiders2011: {
    houses: ['sperry', 'bandOfOutsiders'], year: 2011,
    sources: ['https://hypebeast.com/2011/8/band-of-outsiders-2011-fall-lookbook'],
  },
  sperryNoah2016: {
    houses: ['sperry', 'noah'], year: 2016,
    sources: ['https://hypebeast.com/2016/7/noah-sperry-top-sider-summer-2016'],
  },
  sperryNoahSpring2018: {
    houses: ['sperry', 'noah'], year: 2018,
    sources: ['https://www.gq.com/story/noah-sperry-top-sider-prep-collaboration-2018'],
  },
  sperryNoahAutumn2018: {
    houses: ['sperry', 'noah'], year: 2018,
    sources: ['https://hypebeast.com/2018/12/noah-sperry-fw18-capsule'],
  },
  sperryNoahSummer2019: {
    houses: ['sperry', 'noah'], year: 2019,
    sources: ['https://hypebeast.com/2019/5/noah-nyc-sperry-cloud-cvo-footwear-collaboration-flora-print-release-information'],
  },
  sperryNoahAutumn2019: {
    houses: ['sperry', 'noah'], year: 2019,
    sources: ['https://noahny.com/blogs/news/noah-x-sperry-1'],
  },
  sperryRowingBlazersSummer2019: {
    houses: ['sperry', 'rowingBlazers'], year: 2019,
    sources: ['https://mr-mag.com/sperry-teams-up-with-rowing-blazers-on-shoe-capsule/'],
  },
  sperryRowingBlazersAutumn2019: {
    houses: ['sperry', 'rowingBlazers'], year: 2019,
    sources: ['https://www.esquire.com/style/mens-fashion/a29951707/rowing-blazers-sperry-autumn-winter-2019-collaboration/'],
  },
  sperryRowingBlazers2023: {
    houses: ['sperry', 'rowingBlazers'], year: 2023,
    sources: ['https://rowingblazers.com/blogs/dispatches/rowing-blazers-x-sperry-summer-23'],
  },
  sperryToddSnyder2024: {
    houses: ['sperry', 'toddSnyder'], year: 2024,
    sources: ['https://cfda.com/news/todd-snyder-and-sperry-host-a-summer-kick-off-party/'],
  },
  sperryToddSnyder2025: {
    houses: ['sperry', 'toddSnyder'], year: 2025,
    sources: ['https://www.toddsnyder.com/pages/sperry-by-todd-snyder-25'],
  },
  sperryBeamsPlus2025: {
    houses: ['sperry', 'beamsPlus'], year: 2025,
    sources: ['https://hypebeast.com/2025/2/beams-plus-sperry-collaboration-cvo-collection-release-info'],
  },
  sperryAbercrombieFitch2026: {
    houses: ['sperry', 'abercrombieFitch'], year: 2026,
    sources: ['https://abercrombieandfitchcompany.gcs-web.com/news-releases/news-release-details/abercrombie-fitch-and-sperry-reunite-after-six-decades-reviving'],
  },
  sperryPleasures2023: {
    houses: ['sperry', 'pleasures'], year: 2023,
    sources: ['https://hypebeast.com/2023/1/pleasures-sperry-2023-collection-release-info'],
  },
  sperryPleasures2025: {
    houses: ['sperry', 'pleasures'], year: 2025,
    sources: ['https://houseofheat.co/sperry/sperry-pleasures-3-eye-vibram-collaboration-details'],
  },
  sperryAritziaSpring2025: {
    houses: ['sperry', 'aritzia'], year: 2025,
    sources: ['https://corporate.authentic.com/press-releases/sperry-aritzia-boat-shoe-collection'],
  },
  sperryAritziaSummer2025: {
    houses: ['sperry', 'aritzia'], year: 2025,
    sources: ['https://www.glossy.co/fashion/inside-aritzia-x-sperry-how-the-brands-pulled-off-consecutive-sold-out-drops/'],
  },
  sperryAritzia2026: {
    houses: ['sperry', 'aritzia'], year: 2026,
    sources: ['https://www.sperry.com/collections/sperry-x-aritzia'],
  },
  // TODO: Verify a dated Thug Club × Nike release; SNKRDUNK mentions a partnership
  // without identifying a release. Converse A19255C/A18452C are Anonymous Club,
  // despite some third-party listings attributing them to Thug Club.
  thugClubMcm2023: {
    houses: ['thugClub', 'mcm'], year: 2023,
    sources: ['https://hbx.com/journal/2023/08/thug-club-korean-streetwear-brand-facts'],
  },
  thugClubGentleMonster2023: {
    houses: ['thugClub', 'gentleMonster'], year: 2023,
    sources: ['https://highxtar.com/en/the-second-part-of-bold-gentle-monsters-more-futuristic-line-has-arrived/'],
  },
  thugClubFila2023: {
    houses: ['thugClub', 'fila'], year: 2023,
    sources: ['https://www.wackeris.com/fila-x-thug-club-collaboration'],
  },
  thugClubAdidasSpring2025: {
    houses: ['thugClub', 'adidas'], year: 2025,
    sources: ['https://modernnotoriety.com/thug-club-adidas-superstar-ss25-release-date/'],
  },
  thugClubAdidasAutumn2025: {
    houses: ['thugClub', 'adidas'], year: 2025,
    sources: ['https://news.adidas.com/originals/adidas-originals-and-thug-club-present-their-first-global-fall-winter-2025-collection-blending-fenci/s/0c68b835-aac8-4df3-9bb5-2fb69b069643'],
  },
  thugClubAdidas2026: {
    houses: ['thugClub', 'adidas'], year: 2026,
    sources: ['https://news.adidas.com/originals/adidas-originals-and-thug-club-bring-playground-energy-to-sports-culture-in-their-second-global-coll/s/4372e3a3-fd4b-4e58-9b0a-47a61d90a456'],
  },
  thugClubDiesel2025: {
    houses: ['thugClub', 'diesel'], year: 2025,
    sources: ['https://milled.com/Diesel/diesel-x-thug-club-x8LD2QDvN45Hsr9E'],
  },
  // TODO: Alice Hollywood × Saint Mxxxxxx and × Denim Tears were announced in July 2026;
  // confirm actual release years before adding them. F.M.C.D.’s founders/designers
  // remain unidentified.
  aliceHollywoodThugClub2026: {
    houses: ['aliceHollywood', 'thugClub'], year: 2026,
    sources: ['https://thugclub.store/collections/alice-hollywood', 'https://localbody.blog/ja/events/5e8b9d91-4aff-4977-aaec-049aec0d8fba'],
  },
  aliceHollywoodKsubi2025: {
    houses: ['aliceHollywood', 'ksubi'], year: 2025,
    sources: ['https://ksubi.com/pages/lookbook-ksubi-by-alice-hollywood', 'https://modernnotoriety.com/ksubi-alice-hollywood-release-date/'],
  },
  aliceHollywoodSsur2025: {
    houses: ['aliceHollywood', 'ssur'], year: 2025,
    sources: ['https://nubiantokyo.com/blogs/news/alicehollywood-ssur-capsulecollection'],
  },
  aliceHollywood4242026: {
    houses: ['aliceHollywood', 'fourTwoFour'], year: 2026,
    sources: ['https://hypebeast.com/2026/4/alice-hollywood-424-shane-gonzales-guillermo-andrade-debut-collaboration-release-info'],
  },
  aliceHollywoodFmcd2025: {
    houses: ['aliceHollywood', 'fmcd'], year: 2025,
    sources: ['https://nubiantokyo.com/blogs/news/sapporo-exclusive-vol1'],
  },
  // TODO: Verify the requested NEEDLES × Sasquatchfabrix. 2026 release before adding it.
  needlesReebok2023: {
    houses: ['needles', 'reebok'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesReebokSpring2024: {
    houses: ['needles', 'reebok'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesReebokAutumn2024: {
    houses: ['needles', 'reebok'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesAsics2023: {
    houses: ['needles', 'asics'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesAsics2024: {
    houses: ['needles', 'asics'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesVans2018: {
    houses: ['needles', 'vans'], year: 2018,
    sources: ['https://sneakernews.com/2018/10/13/needles-vans-slip-on-release-info/'],
  },
  needlesVans2022: {
    houses: ['needles', 'vans'], year: 2022,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesDrMartens2020: {
    houses: ['needles', 'drMartens'], year: 2020,
    sources: ['https://www.boomerang-online.jp/blog/needles/40146/'],
  },
  needlesUniqlo2025: {
    houses: ['needles', 'uniqlo'], year: 2025,
    sources: ['https://www.uniqlo.com/es/en/women/special-collaboration/uniqlo-and-needles'],
  },
  needlesPalace2024: {
    houses: ['needles', 'palace'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesKith2022: {
    houses: ['needles', 'kith'], year: 2022,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesHiddenNySpring2022: {
    houses: ['needles', 'hiddenNy'], year: 2022,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesHiddenNyAutumn2022: {
    houses: ['needles', 'hiddenNy'], year: 2022,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesOvo2026: {
    houses: ['needles', 'ovo'], year: 2026,
    sources: ['https://octobersveryown.com/pages/needles-collection-2026'],
  },
  needlesNewEra2021: {
    houses: ['needles', 'newEra'], year: 2021,
    sources: ['https://szu.jp/en/brands/needles/collaborations'],
  },
  needlesNewEra2026: {
    houses: ['needles', 'newEra'], year: 2026,
    sources: ['https://www.fullress.com/needles-new-era-2026-ss-59fifty/'],
  },
  needlesSuicoke2021: {
    houses: ['needles', 'suicoke'], year: 2021,
    sources: ['https://glltn.com/?s=needles'],
  },
  needlesSuicoke2023: {
    houses: ['needles', 'suicoke'], year: 2023,
    sources: ['https://nepentheslondon.com/blogs/news/needles-x-suicoke-cappo'],
  },
  needlesBaracuta2021: {
    houses: ['needles', 'baracuta'], year: 2021,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSchott2023: {
    houses: ['needles', 'schott'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesClarks2025: {
    houses: ['needles', 'clarks'], year: 2025,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesFila2026: {
    houses: ['needles', 'fila'], year: 2026,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSorel2026: {
    houses: ['needles', 'sorel'], year: 2026,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesBrooksBrothers2026: {
    houses: ['needles', 'brooksBrothers'], year: 2026,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrix2022: {
    houses: ['needles', 'sasquatchfabrix'], year: 2022,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrixSpring2023: {
    houses: ['needles', 'sasquatchfabrix'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrixAutumn2023: {
    houses: ['needles', 'sasquatchfabrix'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrixSpring2024: {
    houses: ['needles', 'sasquatchfabrix'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrixAutumn2024: {
    houses: ['needles', 'sasquatchfabrix'], year: 2024,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesSasquatchfabrix2025: {
    houses: ['needles', 'sasquatchfabrix'], year: 2025,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesMiyagihidetaka2021: {
    houses: ['needles', 'miyagihidetaka'], year: 2021,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesMiyagihidetaka2023: {
    houses: ['needles', 'miyagihidetaka'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesGirlsDontCry2020: {
    houses: ['needles', 'girlsDontCry'], year: 2020,
    sources: ['https://www.needles.jp/news.html'],
  },
  needlesBeams2026: {
    houses: ['needles', 'beams'], year: 2026,
    sources: ['https://snkrdunk.com/articles/32836/'],
  },
  needlesHaven2023: {
    houses: ['needles', 'haven'], year: 2023,
    sources: ['https://www.needles.jp/news.html'],
  },
  guidiNonnative2021: {
    houses: ['guidi', 'nonnative'], year: 2021,
    sources: ['https://item.rakuten.co.jp/beegle/12060242/'],
  },
  guidiUndercover2025: {
    houses: ['guidi', 'undercover'], year: 2025,
    sources: ['https://guidi.it/pages/collabs'],
  },
  guidiYohjiYamamotoPourHomme2023: {
    houses: ['guidi', 'yohjiYamamotoPourHomme'], year: 2023,
    sources: ['https://theshopyohjiyamamoto.jp/shop/storestaff/stylingdetail.aspx?cid=24386865'],
  },
  guidiYohjiYamamotoPourHomme2024: {
    houses: ['guidi', 'yohjiYamamotoPourHomme'], year: 2024,
    sources: ['https://fascinate-online.com/en/cont/arrival_yyph_20241215_en/'],
  },
  guidiAlyx2023: {
    houses: ['guidi', 'alyx'], year: 2023,
    sources: ['https://guidi.it/pages/collabs'],
  },
  guidiCaseyCasey2023: {
    houses: ['guidi', 'caseyCasey'], year: 2023,
    sources: ['https://guidi.it/pages/collabs'],
  },
  guidiBeams2020: {
    houses: ['guidi', 'beams'], year: 2020,
    sources: ['https://www.beams.co.jp/feature/20200910/'],
  },
  guidiTheSoloist2024: {
    houses: ['guidi', 'theSoloist'], year: 2024,
    sources: ['https://the-soloist.net/en/blogs/value-ws/gui-x-takahiro-miya-shita-tezo-st'],
  },
  guidiMastermindWorld2025: {
    houses: ['guidi', 'mastermindWorld'], year: 2025,
    sources: ['https://guidi.it/pages/collabs'],
  },
  nonnativeUndercover2022: {
    houses: ['nonnative', 'undercover'], year: 2022,
    sources: ['https://www.wwdjapan.com/articles/1468197'],
  },
  nonnativeUndercover2024: {
    houses: ['nonnative', 'undercover'], year: 2024,
    sources: ['https://coverchord.com/blogs/feature/nonnative-undercover-ozism-2024aw-collection'],
  },
  nonnativeUndercover2025: {
    houses: ['nonnative', 'undercover'], year: 2025,
    sources: ['https://coverchord.com/blogs/feature/nonnative-undercover-ozism-2025-winter-collection'],
  },
  nonnativeUndercover2026: {
    houses: ['nonnative', 'undercover'], year: 2026,
    sources: ['https://coverchord.com/en/blogs/feature/nonnative-undercover-ozism-2026-spring-collection'],
  },
  nonnativeTimberland2023: {
    houses: ['nonnative', 'timberland'], year: 2023,
    sources: ['https://nonnative.com/nonnative_2024aw/special10/'],
  },
  nonnativeTimberland2024: {
    houses: ['nonnative', 'timberland'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special11/'],
  },
  nonnativeTimberland2026: {
    houses: ['nonnative', 'timberland'], year: 2026,
    sources: ['https://www.diverse-web.com/en/blogs/feature/nonnative-x-timberland'],
  },
  nonnativeMizuno2023: {
    houses: ['nonnative', 'mizuno'], year: 2023,
    sources: ['https://nonnative.com/nonnative_2023aw/special9/'],
  },
  nonnativeGramicci2024: {
    houses: ['nonnative', 'gramicci'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special11/'],
  },
  nonnativeGramicci2025: {
    houses: ['nonnative', 'gramicci'], year: 2025,
    sources: ['https://nonnative.com/25aw/specialproducts/gramicci-nonnativewalker-tp-easy-pants-climber-easy-pants-wool-cashmere-twill/'],
  },
  nonnativeGramicci2026: {
    houses: ['nonnative', 'gramicci'], year: 2026,
    sources: ['https://coverchord.com/en/blogs/men-style/260110-nn-item'],
  },
  nonnativeConverse2024: {
    houses: ['nonnative', 'converse'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special11/'],
  },
  nonnativeConverse2026: {
    houses: ['nonnative', 'converse'], year: 2026,
    sources: ['https://nonnative.com/26ss/specialproducts/converse-x-nonnativeall-star-gore-tex-centerzip-ox-nn/'],
  },
  nonnativeAsics2024: {
    houses: ['nonnative', 'asics'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special/'],
  },
  nonnativeAsics2025: {
    houses: ['nonnative', 'asics'], year: 2025,
    sources: ['https://www.nonnative.com/25ss/products/asics-x-nonnative-gel-yetitokyo-hi-gtx/'],
  },
  nonnativeNewBalance2020: {
    houses: ['nonnative', 'newBalance'], year: 2020,
    sources: ['https://www.sneakerfreaker.com/releases/gawk-at-the-gorpcore-nonnative-x-new-balance-hierro-gore-tex-mole'],
  },
  nonnativeSuicoke2019: {
    houses: ['nonnative', 'suicoke'], year: 2019,
    sources: ['https://nonnative.com/nonnative_2020ss/special/'],
  },
  nonnativeSuicoke2020: {
    houses: ['nonnative', 'suicoke'], year: 2020,
    sources: ['https://nonnative.com/nonnative_2023aw/special4/'],
  },
  nonnativeMinedenim2022: {
    houses: ['nonnative', 'minedenim'], year: 2022,
    sources: ['https://eyescream.jp/fashion/109520/'],
  },
  nonnativeGuidi2024: {
    houses: ['nonnative', 'guidi'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special/'],
  },
  nonnativeGuidi2025: {
    houses: ['nonnative', 'guidi'], year: 2025,
    sources: ['https://www.nonnative.com/25ss/specialproducts/guidi-x-nonnative-zipper-unit-boots-big-daddy/'],
  },
  nonnativeGuidi2026: {
    houses: ['nonnative', 'guidi'], year: 2026,
    sources: ['https://nonnative.com/25aw/specialproducts/guidi-x-nonnative-hiking-boots-horse-leather/'],
  },
  nonnativeRegalShoeCo2025: {
    houses: ['nonnative', 'regalShoeCo'], year: 2025,
    sources: ['https://coverchord.com/blogs/feature/regal-nonnative-2025'],
  },
  nonnativeFragmentArtistProof2024: {
    houses: ['nonnative', 'fragmentDesign', 'artistProof'], year: 2024,
    sources: ['https://nonnative.com/nonnative_2024aw/special/'],
  },
  nonnativeFragmentArtistProof2025: {
    houses: ['nonnative', 'fragmentDesign', 'artistProof'], year: 2025,
    sources: ['https://www.fashionsnap.com/article/2025-12-16/nonnative-artist-proof-frgmt/'],
  },
  nonnativeFragmentArtistProofSummer2026: {
    houses: ['nonnative', 'fragmentDesign', 'artistProof'], year: 2026,
    sources: ['https://hypebeast.com/2026/7/fragment-design-artist-proof-nonnative-reconnect-new-t-shirt-capsule'],
  },
  nonnativeFragmentArtistProofAutumn2026: {
    houses: ['nonnative', 'fragmentDesign', 'artistProof'], year: 2026,
    sources: ['https://yakkun-fashion.jp/artist-proof-x-fragment-design-x-nonnative-26fw/'],
  },
  mizunoPatta2018: {
    houses: ['mizuno', 'patta'], year: 2018,
    sources: ['https://sneakernews.com/2018/08/06/patta-mizuno-sky-medal-release-date-photos/'],
  },
  mizunoPatta2022: {
    houses: ['mizuno', 'patta'], year: 2022,
    sources: ['https://www.soleretriever.com/news/articles/patta-mizuno-sky-medal-ivory-red-green-release-date-2022'],
  },
  mizunoMaharishi2023: {
    houses: ['mizuno', 'maharishi'], year: 2023,
    sources: ['https://www.maharishistore.com/blogs/archive/maharishi-x-mizuno-fire-phoenix-wave-rider-10'],
  },
  mizunoMaharishiSpring2025: {
    houses: ['mizuno', 'maharishi'], year: 2025,
    sources: ['https://www.sneakerfreaker.com/releases/maharishi-mizuno-wave-mujin-10-gtx-price-buy-release-date'],
  },
  mizunoMaharishiAutumn2025: {
    houses: ['mizuno', 'maharishi'], year: 2025,
    sources: ['https://jpn.mizuno.com/mizuno1906/journal/journal_collection/166'],
  },
  mizunoMargaretHowell2017: {
    houses: ['mizuno', 'margaretHowell'], year: 2017,
    sources: ['https://corp.mizuno.com/jp/news-release/2024/20240220'],
  },
  mizunoMargaretHowell2024: {
    houses: ['mizuno', 'margaretHowell'], year: 2024,
    sources: ['https://corp.mizuno.com/jp/news-release/2024/20240220'],
  },
  mizunoMargaretHowell2025: {
    houses: ['mizuno', 'margaretHowell'], year: 2025,
    sources: ['https://www.houyhnhnm.jp/en/news/976729/'],
  },
  mizunoMargaretHowell2026: {
    houses: ['mizuno', 'margaretHowell'], year: 2026,
    sources: ['https://www.margarethowell.jp/mizuno_campaign_ss26.html'],
  },
  mizunoWoodWood2020: {
    houses: ['mizuno', 'woodWood'], year: 2020,
    sources: ['https://corpkr.mizuno.com/sports/news/sportsstyle/journal_036'],
  },
  mizunoHanKjobenhavn2026: {
    houses: ['mizuno', 'hanKjobenhavn'], year: 2026,
    sources: ['https://jpn.mizuno.com/mizuno1906/journal/journal_collection/207'],
  },
  mizunoNonnative2024: {
    houses: ['mizuno', 'nonnative'], year: 2024,
    sources: ['https://qui.tokyo/news/2411-mizuno-nonnative-collaboration'],
  },
  mizunoNonnativeSpring2025: {
    houses: ['mizuno', 'nonnative'], year: 2025,
    sources: ['https://www.fashion-press.net/news/132843'],
  },
  mizunoNonnativeAutumn2025: {
    houses: ['mizuno', 'nonnative'], year: 2025,
    sources: ['https://snkrdunk.com/products/D1GG215503'],
  },
  mizunoNonnative2026: {
    houses: ['mizuno', 'nonnative'], year: 2026,
    sources: ['https://www.diverse-web.com/en/blogs/feature/mizuno-x-nonnative'],
  },
  oneillAnnaSui2015: {
    houses: ['oneill', 'annaSui'],
    year: 2015,
    sources: ['https://kitesista.com/anna-sui-collection-for-oneill/'],
  },
  oneillByborre2023: {
    houses: ['oneill', 'byborre'],
    year: 2023,
    sources: ['https://hypebeast.com/2023/2/oneill-byborre-collaboration-release-details'],
  },
  // TODO: O’Neill × Woolrich is confirmed, but its release year remains unverified.
  // https://us.oneill.com/blogs/news/introducing-the-oneill-x-woolrich-collection
  pattaNike2006: {
    houses: ['patta', 'nike'],
    year: 2006,
    sources: ['https://www.sneakerfreaker.com/performance/features/talking-shop/talking-shop-a-history-of-patta-collaborations'],
  },
  pattaNikeChlorophyll2009: {
    houses: ['patta', 'nike'],
    year: 2009,
    sources: ['https://about.nike.com/en-GB/newsroom/releases/nike-x-patta-celebrate-landmark-anniversary-with-new-release-of-coveted-air-max-1-chlorophyll'],
  },
  pattaNikePurpleDenim2009: {
    houses: ['patta', 'nike'],
    year: 2009,
    sources: ['https://thesolesupplier.co.uk/news/every-patta-x-nike-collaboration-ever-made/'],
  },
  pattaNikeFifthAnniversary2009: {
    houses: ['patta', 'nike'],
    year: 2009,
    sources: ['https://thesolesupplier.co.uk/news/every-patta-x-nike-collaboration-ever-made/'],
  },
  pattaNikeLuckyGreen2010: {
    houses: ['patta', 'nike'],
    year: 2010,
    sources: ['https://thesolesupplier.co.uk/news/every-patta-x-nike-collaboration-ever-made/'],
  },
  pattaNikeCherrywood2010: {
    houses: ['patta', 'nike'],
    year: 2010,
    sources: ['https://thesolesupplier.co.uk/news/every-patta-x-nike-collaboration-ever-made/'],
  },
  pattaNikeMonarch2021: {
    houses: ['patta', 'nike'],
    year: 2021,
    sources: ['https://www.sneakerfreaker.com/releases/patta-nike-air-max-1-pure-platinum-DQ0299-100-release-date'],
  },
  pattaNikeNoiseAqua2021: {
    houses: ['patta', 'nike'],
    year: 2021,
    sources: ['https://patta.nl/blogs/news/patta-x-nike-the-wave-ch-2-loud-clear'],
  },
  pattaNikeRushMaroon2021: {
    houses: ['patta', 'nike'],
    year: 2021,
    sources: ['https://www.sneakerfreaker.com/releases/patta-nike-air-max-1-pure-platinum-DQ0299-100-release-date'],
  },
  pattaNikeBlack2021: {
    houses: ['patta', 'nike'],
    year: 2021,
    sources: ['https://www.sneakerfreaker.com/releases/patta-nike-air-max-1-pure-platinum-DQ0299-100-release-date'],
  },
  pattaNike2022: {
    houses: ['patta', 'nike'],
    year: 2022,
    sources: ['https://www.sneakerfreaker.com/releases/patta-nike-air-max-1-pure-platinum-DQ0299-100-release-date'],
  },
  pattaNike2024: {
    houses: ['patta', 'nike'],
    year: 2024,
    sources: ['https://about.nike.com/en-GB/newsroom/releases/nike-x-patta-celebrate-landmark-anniversary-with-new-release-of-coveted-air-max-1-chlorophyll'],
  },
  pattaNikeNewWaveFirst2025: {
    houses: ['patta', 'nike'],
    year: 2025,
    sources: ['https://www.puna.nl/news/patta-en-nike-brengen-samen-the-new-wave-met-vier-air-max-90s-en-collectie-tracksuits'],
  },
  pattaNikeNewWaveSecond2025: {
    houses: ['patta', 'nike'],
    year: 2025,
    sources: ['https://www.puna.nl/news/patta-en-nike-brengen-samen-the-new-wave-met-vier-air-max-90s-en-collectie-tracksuits'],
  },
  pattaNikeDn82025: {
    houses: ['patta', 'nike'],
    year: 2025,
    sources: ['https://patta.nl/pages/patta-x-nike-dn8'],
  },
  pattaAdidasForum2009: {
    houses: ['patta', 'adidas'],
    year: 2009,
    sources: ['https://sneakersbr.co/adidas-consortium-3way-project-grupo-1/'],
  },
  pattaAsics2011: {
    houses: ['patta', 'asics'],
    year: 2011,
    sources: ['https://www.lesitedelasneaker.com/2017/06/patta-asics-collaborations-10-ans/'],
  },
  pattaReebok2012: {
    houses: ['patta', 'reebok'],
    year: 2012,
    sources: ['https://www.sneakers-actus.fr/patta-amsterdam-10eme-anniversaire/81607.html'],
  },
  pattaConverse2012: {
    houses: ['patta', 'converse'],
    year: 2012,
    sources: ['https://sneakernews.com/2012/10/23/patta-x-converse-first-string-pro-leather/'],
  },
  pattaConverse2014: {
    houses: ['patta', 'converse'],
    year: 2014,
    sources: ['https://www.knotoryus.com/articles/archives/16909'],
  },
  pattaConverse2017: {
    houses: ['patta', 'converse'],
    year: 2017,
    sources: ['https://hypebeast.com/2017/12/converse-patta-deviation'],
  },
  pattaConverse2023: {
    houses: ['patta', 'converse'],
    year: 2023,
    sources: ['https://www.endclothing.com/us/features/converse-x-patta-one-star-pro-register-now-at-end-launches'],
  },
  pattaNewBalance2020: {
    houses: ['patta', 'newBalance'],
    year: 2020,
    sources: ['https://pattaclothing.us/blogs/events/patta-x-new-balance-920'],
  },
  pattaNewBalance2021: {
    houses: ['patta', 'newBalance'],
    year: 2021,
    sources: ['https://patta.nl/blogs/news/patta-x-new-balance-991'],
  },
  pattaVans2015: {
    houses: ['patta', 'vans'],
    year: 2015,
    sources: ['https://patta.co/blogs/lookbooks/patta-x-vans-mean-eyed-cat-lookbook'],
  },
  pattaVans2017: {
    houses: ['patta', 'vans'],
    year: 2017,
    sources: ['https://patta.co/blogs/lookbooks/patta-x-vans-mean-eyed-cat-lookbook'],
  },
  pattaVans2021: {
    houses: ['patta', 'vans'],
    year: 2021,
    sources: ['https://patta.co/blogs/lookbooks/patta-x-vans-mean-eyed-cat-lookbook'],
  },
  pattaMizuno2020: {
    houses: ['patta', 'mizuno'],
    year: 2020,
    sources: ['https://www.lesitedelasneaker.com/release/patta-mizuno-sky-medal-2020/'],
  },
  pattaCpCompany2021: {
    houses: ['patta', 'cpCompany'],
    year: 2021,
    sources: ['https://www.beams.co.jp/en/news/2481/'],
  },
  pattaBeams2021: {
    houses: ['patta', 'beams'],
    year: 2021,
    sources: ['https://www.beams.co.jp/news/2552/'],
  },
  pattaJunyaWatanabeMan2022: {
    houses: ['patta', 'junyaWatanabeMan'],
    year: 2022,
    sources: ['https://www.webuomo.jp/fashion/topic/367028/'],
  },
  pattaJunyaWatanabeMan2024: {
    houses: ['patta', 'junyaWatanabeMan'],
    year: 2024,
    sources: ['https://www.webuomo.jp/fashion/topic/367028/'],
  },
  pattaTommyJeans2022: {
    houses: ['patta', 'tommyJeans'],
    year: 2022,
    sources: ['https://www.beams.co.jp/news/3346/'],
  },
  pattaRapha2023: {
    houses: ['patta', 'rapha'],
    year: 2023,
    sources: ['https://patta.co/blogs/lookbooks/patta-x-rapha-lookbook'],
  },
  pattaHavaianas2025: {
    houses: ['patta', 'havaianas'],
    year: 2025,
    sources: ['https://www.linkedin.com/posts/havaianas-europe_patta-edgardavids-activity-7336728316441157632-rEmS'],
  },
  pattaSebago2021: {
    houses: ['patta', 'sebago'],
    year: 2021,
    sources: ['https://patta.nl/blogs/lookbooks/patta-x-sebago-lookbook'],
  },
  pattaUmbro2017: {
    houses: ['patta', 'umbro'],
    year: 2017,
    sources: ['https://patta.nl/blogs/lookbooks/patta-x-umbro-football-jersey-collection'],
  },
  jmWestonMaisonKitsune2011: {
    houses: ['jmWeston', 'maisonKitsune'],
    year: 2011,
    sources: ['https://maisonkitsune.com/mk/2011/11/wear/gildas-loaec-10-essentials-for-gq-us/'],
  },
  jmWestonMaisonKitsune2015: {
    houses: ['jmWeston', 'maisonKitsune'],
    year: 2015,
    sources: ['https://maisonkitsune.com/mk/2015/02/default/j-m-weston-x-maison-kitsune-new-yorker/'],
  },
  sacaiJmWestonSpring2025: {
    houses: ['sacai', 'jmWeston'],
    year: 2025,
    sources: ['https://www.sacai.jp/en/blogs/news/j-m-weston-sacai-spring-summer-2025'],
  },
  sacaiJmWestonAutumn2025: {
    houses: ['sacai', 'jmWeston'],
    year: 2025,
    sources: ['https://www.fashion-headline.com/en/article/487178'],
  },
  jmWestonBalenciaga2026: {
    houses: ['jmWeston', 'balenciaga'],
    year: 2026,
    sources: ['https://www.balenciaga.com/en-fr/balenciaga-%7C-j.m.-weston-loafer-black-A0087PWCID01000.html', 'https://cpp-luxury.com/balenciaga-launches-collaboration-with-french-shoemaker-j-m-weston/'],
  },
  clarksSupreme2011: {
    houses: ['clarks', 'supreme'],
    year: 2011,
    sources: ['https://hypebeast.com/2011/4/supreme-x-clarks-desert-chukka'],
  },
  clarksSupreme2012: {
    houses: ['clarks', 'supreme'],
    year: 2012,
    sources: ['https://www.sneakerfreaker.com/releases/supreme-x-clarks-wallabee-crocodile'],
  },
  clarksSupreme2013: {
    houses: ['clarks', 'supreme'],
    year: 2013,
    sources: ['https://hypebeast.com/2013/5/supreme-x-clarks-2013-spring-summer-desert-boot'],
  },
  clarksSupreme2016: {
    houses: ['clarks', 'supreme'],
    year: 2016,
    sources: ['https://hypebeast.com/2016/5/supreme-x-clarks-2016-spring-summer-collection'],
  },
  clarksSupreme2019: {
    houses: ['clarks', 'supreme'],
    year: 2019,
    sources: ['https://www.sneakerfreaker.com/releases/wallabee-collection-surfaces-from-supreme-and-clarks'],
  },
  clarksBeams2011: {
    houses: ['clarks', 'beams'],
    year: 2011,
    sources: ['https://hypebeast.com/2011/11/beams-x-clarks-desert-boot'],
  },
  clarksBeams2025: {
    houses: ['clarks', 'beams'],
    year: 2025,
    sources: ['https://hypebeast.com/2025/10/beams-clarks-originals-desert230-gtx-11-32-0865-100-release-info'],
  },
  clarksBeams2026: {
    houses: ['clarks', 'beams'],
    year: 2026,
    sources: ['https://www.beams.co.jp/news/4846/'],
  },
  clarksKithAdidas2023: {
    houses: ['clarks', 'kith', 'adidas'],
    year: 2023,
    sources: ['https://kith.com/blogs/discover/the-8th-street-samba-by-ronnie-fieg-for-adidas-originals-clarks-originals'],
  },
  clarksKithAdidas2024: {
    houses: ['clarks', 'kith', 'adidas'],
    year: 2024,
    sources: ['https://kith.com/blogs/discover/8th-st-as350-by-ronnie-fieg-for-adidas-originals-clarks-originals'],
  },
  clarksKithAdidas2025: {
    houses: ['clarks', 'kith', 'adidas'],
    year: 2025,
    sources: ['https://kith.com/blogs/discover/raekwon-ghostface-killah-for-the-8th-st-wallabee'],
  },
  clarksKith2026: {
    houses: ['clarks', 'kith'],
    year: 2026,
    sources: ['https://uk.kith.com/collections/kith-winter-2026'],
  },
  clarksMoncler2022: {
    houses: ['clarks', 'moncler'],
    year: 2022,
    sources: ['https://www.clarks.com/en-us/originals/collaboration/moncler-wallabee-collection'],
  },
  clarksMoncler2026: {
    houses: ['clarks', 'moncler'],
    year: 2026,
    sources: ['https://milled.com/Moncler/the-moncler-clarks-originals-trailgrip-wallabee-gtx-Jq_QTb5KYrp4ZDxI'],
  },
  clarksHumanMade2025: {
    houses: ['clarks', 'humanMade'],
    year: 2025,
    sources: ['https://www.humanmade.jp/en/news/human-made-x-clarks-originals-2024-dec.html'],
  },
  clarksPleasures2024: {
    houses: ['clarks', 'pleasures'],
    year: 2024,
    sources: ['https://www.clarks.com/en-us/collaborations/pleasures'],
  },
  clarksVandyThePink2023: {
    houses: ['clarks', 'vandyThePink'],
    year: 2023,
    sources: ['https://www.clarks.com/en-es/originals/collaborations/vandythepink'],
  },
  clarksNicholasDaley2025: {
    houses: ['clarks', 'nicholasDaley'],
    year: 2025,
    sources: ['https://www.clarks.com/en-us/originals/nicholas-daley'],
  },
  clarksGolfWang2026: {
    houses: ['clarks', 'golfWang'],
    year: 2026,
    sources: ['https://prtimes.jp/main/html/rd/p/000000058.000140622.html'],
  },
  clarksPostArchiveFaction2025: {
    houses: ['clarks', 'postArchiveFaction'],
    year: 2025,
    sources: ['https://limitededt.com/blogs/launches/clarks-originals-post-archive-faction-paf-wallabe'],
  },
  clarksMasu2026: {
    houses: ['clarks', 'masu'],
    year: 2026,
    sources: ['https://hypebeast.com/2026/7/masu-clarks-desert-boot-collaboration-release-info'],
  },
  clarksInvincible2025: {
    houses: ['clarks', 'invincible'],
    year: 2025,
    sources: ['https://invincible.com.tw/pages/story-invincible%C2%AE-x-clarks-wallabee-boot'],
  },
  clarksBodega2025: {
    houses: ['clarks', 'bodega'],
    year: 2025,
    sources: ['https://bdgastore.com/blogs/upcoming-releases/bodega-x-clarks-patchwork-wallabee-3-0-northeast-corridor'],
  },
  clarksCarharttWip2019: {
    houses: ['clarks', 'carharttWip'],
    year: 2019,
    sources: ['https://www.endclothing.com/us/features/clarks-originals-x-carhartt-wip-register-now-on-end-launches'],
  },
  cpCompanyClarks2022: {
    houses: ['cpCompany', 'clarks'],
    year: 2022,
    sources: ['https://www.endclothing.com/us/features/cp-company-x-clarks-originals'],
  },
  clarksToddSnyder2019: {
    houses: ['clarks', 'toddSnyder'],
    year: 2019,
    sources: ['https://www.sneakerfreaker.com/releases/todd-snyder-x-clarks-wallabees-add-rich-tapestry'],
  },
  clarksUndercover2022: {
    houses: ['clarks', 'undercover'],
    year: 2022,
    sources: ['https://www.sneakerfreaker.com/releases/clarks-wallabee-undercover-collaboration-release-date'],
  },
  clarksAimeLeonDore2020: {
    houses: ['clarks', 'aimeLeonDore'],
    year: 2020,
    sources: ['https://www.endclothing.com/us/features/clarks-originals-x-aime-leon-dore-wallabee-register-now-on-end-launches'],
  },
  clarksPatta2019: {
    houses: ['clarks', 'patta'],
    year: 2019,
    sources: ['https://www.sneakerfreaker.com/releases/revealed-patta-x-clarks-originals-desert-trek-pack'],
  },
  stussyDriesVanNoten2022: {
    houses: ['stussy', 'driesVanNoten'],
    year: 2022,
    sources: ['https://www.stussy.com/blogs/features/stussy-dries-van-noten'],
  },
  carharttWipApc2010: {
    houses: ['carharttWip', 'apc'],
    year: 2010,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  carharttWipApc2013: {
    houses: ['carharttWip', 'apc'],
    year: 2013,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  carharttWipApc2020: {
    houses: ['carharttWip', 'apc'],
    year: 2020,
    sources: ['https://us.carhartt-wip.com/en-us/journal/a-p-c-x-carhartt-wip'],
  },
  carharttWipMarni2023: {
    houses: ['carharttWip', 'marni'],
    year: 2023,
    sources: ['https://us.carhartt-wip.com/en-gb/journal/marni-x-carhartt-wip'],
  },
  carharttWipPalace2023: {
    houses: ['carharttWip', 'palace'],
    year: 2023,
    sources: ['https://www.carhartt-wip.com.my/blogs/journal/palace-carhartt-wip'],
  },
  carharttWipPatta2014: {
    houses: ['carharttWip', 'patta'],
    year: 2014,
    sources: ['https://us.carhartt-wip.com/en-us/journal/fall-26-patta-x-carhartt-wip'],
  },
  carharttWipPatta2026: {
    houses: ['carharttWip', 'patta'],
    year: 2026,
    sources: ['https://us.carhartt-wip.com/en-us/journal/fall-26-patta-x-carhartt-wip'],
  },
  carharttWipNike2018: {
    houses: ['carharttWip', 'nike'],
    year: 2018,
    sources: ['https://milled.com/carharttwip/nike-x-carhartt-wip-GVTksRMzW0_X8_Z5'],
  },
  carharttWipNike2026: {
    houses: ['carharttWip', 'nike'],
    year: 2026,
    sources: ['https://us.carhartt-wip.com/en-us/journal/fw26-carhartt-wip-x-nike'],
  },
  carharttWipNewBalance2022: {
    houses: ['carharttWip', 'newBalance'],
    year: 2022,
    sources: ['https://carhartt-wip.jp/blogs/journal/coming-soon-new-balance-x-carhartt-wip'],
  },
  carharttWipNewBalance2023: {
    houses: ['carharttWip', 'newBalance'],
    year: 2023,
    sources: ['https://us.carhartt-wip.com/en-us/journal/new-balance-x-carhartt-wip'],
  },
  carharttWipConverse2017: {
    houses: ['carharttWip', 'converse'],
    year: 2017,
    sources: ['https://www.sneakerfreaker.com/releases/carhartt-wip-x-converse-chuck-70-pack'],
  },
  carharttWipConverse2021: {
    houses: ['carharttWip', 'converse'],
    year: 2021,
    sources: ['https://www.endclothing.com/gb/features/converse-x-carhartt-wip-chuck-taylor-70-hi-register-now-on-end-launches'],
  },
  carharttWipAwakeNy2020: {
    houses: ['carharttWip', 'awakeNy'],
    year: 2020,
    sources: ['https://carhartt-wip.jp/blogs/journal/carhartt-wip-awake-ny'],
  },
  carharttWipAwakeNy2023: {
    houses: ['carharttWip', 'awakeNy'],
    year: 2023,
    sources: ['https://us.carhartt-wip.com/en-us/journal/carhartt-wip-x-awake-ny'],
  },
  carharttWipWackoMaria2020: {
    houses: ['carharttWip', 'wackoMaria'],
    year: 2020,
    sources: ['https://carhartt-wip.jp/blogs/journal/coming-soon-wacko-maria-x-carhartt-wip'],
  },
  carharttWipToogood2022: {
    houses: ['carharttWip', 'toogood'],
    year: 2022,
    sources: ['https://www.nssmag.com/en/fashion/30038/collaboration-carhartt-wip-toogood'],
  },
  carharttWipFragmentDesignSpring2014: {
    houses: ['carharttWip', 'fragmentDesign'],
    year: 2014,
    sources: ['https://hypebeast.com/2014/4/fragment-design-x-carhartt-wip-2014-spring-summer-carfrgmnt-collection'],
  },
  carharttWipFragmentDesignAutumn2014: {
    houses: ['carharttWip', 'fragmentDesign'],
    year: 2014,
    sources: ['https://hypebeast.com/2014/12/fragment-design-x-carhartt-wip-2014-fall-winter-cafrgmt-collection'],
  },
  carharttWipFragmentDesign2016: {
    houses: ['carharttWip', 'fragmentDesign'],
    year: 2016,
    sources: ['https://hypebeast.com/2016/8/carhartt-wip-fragment-design-capsule'],
  },
  carharttWipVetements2017: {
    houses: ['carharttWip', 'vetements'],
    year: 2017,
    sources: ['https://haussmann.galerieslafayette.com/en/vetements-available-exclusively-at-galeries-lafayette/'],
  },
  carharttWipSalomon2022: {
    houses: ['carharttWip', 'salomon'],
    year: 2022,
    sources: ['https://carhartt-wip.com.sg/blogs/news/salomon-for-carhartt-wip'],
  },
  carharttWipSalomon2025: {
    houses: ['carharttWip', 'salomon'],
    year: 2025,
    sources: ['https://us.carhartt-wip.com/en-us/journal/salomon-x-carhartt-wip'],
  },
  carharttWipSolovair2025: {
    houses: ['carharttWip', 'solovair'],
    year: 2025,
    sources: ['https://us.carhartt-wip.com/en-us/journal/solovair-x-carhartt-wip'],
  },
  carharttWipNicholasDaley2025: {
    houses: ['carharttWip', 'nicholasDaley'],
    year: 2025,
    sources: ['https://nicholasdaley.net/pages/collaborations'],
  },
  carharttWipNicholasDaley2026: {
    houses: ['carharttWip', 'nicholasDaley'],
    year: 2026,
    sources: ['https://us.carhartt-wip.com/en-us/journal/rise-as-one'],
  },
  carharttWipPaccbet2018: {
    houses: ['carharttWip', 'paccbet'],
    year: 2018,
    sources: ['https://www.carhartt-wip.com/en-gb/e/history'],
  },
  carharttWipVans2015: {
    houses: ['carharttWip', 'vans'],
    year: 2015,
    sources: ['https://www.sneakerfreaker.com/releases/carhartt-wip-x-vans-classics-2015-collection'],
  },
  sacaiCarharttWip2024: {
    houses: ['carharttWip', 'sacai'],
    year: 2024,
    sources: ['https://www.sacai.jp/en/blogs/news/sacai-x-carhartt-wip-2024-spring-and-summer'],
  },
  sacaiCarharttWip2025: {
    houses: ['carharttWip', 'sacai'],
    year: 2025,
    sources: ['https://us.carhartt-wip.com/en-us/journal/sacai-x-carhartt-wip-fall-winter-2025'],
  },
  sacaiCarharttWip2026: {
    houses: ['carharttWip', 'sacai'],
    year: 2026,
    sources: ['https://us.carhartt-wip.com/en-us/journal/sacai-x-carhartt-wip-spring-summer-2026'],
  },
  carharttWipJunyaWatanabeManSpring2024: {
    houses: ['carharttWip', 'junyaWatanabeMan'],
    year: 2024,
    sources: ['https://www.sivasdescalzo.com/en/p/men-s-jacket-wm-j901-100-2'],
  },
  carharttWipJunyaWatanabeMan2018: {
    houses: ['carharttWip', 'junyaWatanabeMan'],
    year: 2018,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  carharttWipNeighborhood2014: {
    houses: ['carharttWip', 'neighborhood'],
    year: 2014,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  carharttWipWtaps2015: {
    houses: ['carharttWip', 'wtaps'],
    year: 2015,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  carharttWipMastermindJapan2013: {
    houses: ['carharttWip', 'mastermindJapan'],
    year: 2013,
    sources: ['https://www.grailed.com/drycleanonly/carhartt-wip-collaborations-list'],
  },
  mulberryNicholasDaley2022: {
    houses: ['mulberry', 'nicholasDaley'],
    year: 2022,
    sources: ['https://www.theindustry.fashion/mulberry-x-nicholas-daley-capsule-collaboration-collection-launches/', 'https://nicholasdaley.net/pages/about'],
  },
  mulberryAhluwalia2021: {
    houses: ['mulberry', 'ahluwalia'],
    year: 2021,
    sources: ['https://www.vogue.co.uk/fashion/article/mulberry-ahluwalia'],
  },
  mulberryRichardMalone2021: {
    houses: ['mulberry', 'richardMalone'],
    year: 2021,
    sources: ['https://www.mulberry.com/fr/mulberry-world/journal/mulberry-editions', 'https://www.vogue.co.uk/fashion/article/richard-malone-mulberry-collaboration'],
  },
  mulberryStefanCooke2023: {
    houses: ['mulberry', 'stefanCooke'],
    year: 2023,
    sources: ['https://www.stefancooke.co.uk/pages/about-us', 'https://www.mulberry.com/us/shop/mulberry-stefan-cooke'],
  },
  mulberryStefanCooke2024: {
    houses: ['mulberry', 'stefanCooke'],
    year: 2024,
    sources: ['https://www.stefancooke.co.uk/pages/about-us', 'https://www.vogue.co.uk/article/mulberry-stefan-cooke-vintage-bags-collection'],
  },
  mulberryPaulSmith2023: {
    houses: ['mulberry', 'paulSmith'],
    year: 2023,
    sources: ['https://www.mulberry.com/plugins/investor_relations/pdf/Interim_Report_2023.pdf', 'https://www.wallpaper.com/fashion-beauty/paul-smith-mulberry-collaboration-antony-bag'],
  },
  mulberryAxelArigato2023: {
    houses: ['mulberry', 'axelArigato'],
    year: 2023,
    sources: ['https://www.victorialeeds.co.uk/news/axel-arigato-for-mulberry-a-new-collaborative-capsule/'],
  },
  mulberryMiraMikati2024: {
    houses: ['mulberry', 'miraMikati'],
    year: 2024,
    sources: ['https://miramikati.com/blogs/our-world/mira-mikati-x-mulberry'],
  },
  mulberryRejinaPyo2024: {
    houses: ['mulberry', 'rejinaPyo'],
    year: 2024,
    sources: ['https://www.mulberry.com/shop/mulberry-rejina-pyo', 'https://www.mulberry.com/plugins/investor_relations/pdf/Interim_Statement_2024.pdf'],
  },
  mulberryEleventy2024: {
    houses: ['mulberry', 'eleventy'],
    year: 2024,
    sources: ['https://www.mulberry.com/gb/mulberry-eleventy', 'https://www.mulberry.com/plugins/investor_relations/pdf/Interim_Statement_2024.pdf'],
  },
  timberlandOffWhite2018: {
    houses: ['timberland', 'offWhite'],
    year: 2018,
    sources: ['https://stockx.com/news/en-us/off-white-timberland-6-inch-boot-black-velvet/'],
  },
  timberlandJimmyChoo2020: {
    houses: ['timberland', 'jimmyChoo'],
    year: 2020,
    sources: ['https://fashionunited.uk/news/retail/jimmy-choo-announces-collaboration-with-timberland/2020090950800'],
  },
  timberlandJimmyChoo2022: {
    houses: ['timberland', 'jimmyChoo'],
    year: 2022,
    sources: ['https://story.jimmychoo.com/timberland22', 'https://fashionunited.com/news/fashion/jimmy-choo-and-timberland-collaborate-on-a-new-york-inspired-collection/2022120150966'],
  },
  timberlandSupreme2006: {
    houses: ['timberland', 'supreme'],
    year: 2006,
    sources: ['https://hypebeast.com/2006/12/timberland-x-supreme-field-boot-release'],
  },
  timberlandSupreme2013: {
    houses: ['timberland', 'supreme'],
    year: 2013,
    sources: ['https://www.gq.com/story/supreme-timberland-6-inch-boot-collaboration'],
  },
  timberlandSupremeCdgShirt2015: {
    houses: ['timberland', 'supreme', 'cdgShirt'],
    year: 2015,
    sources: ['https://supreme.com/news/archive', 'https://www.xxlmag.com/supreme-x-comme-des-garcons-x-timberland-6-boot-release-date/'],
  },
  timberlandSupreme2018: {
    houses: ['timberland', 'supreme'],
    year: 2018,
    sources: ['https://www.sneakerfreaker.com/releases/supreme-timberland-world-hiker-front-country-boot'],
  },
  timberlandSupreme2021: {
    houses: ['timberland', 'supreme'],
    year: 2021,
    sources: ['https://hypebeast.com/2021/10/supreme-timberland-fall-2021-collaboration-release-info'],
  },
  timberlandSupreme2024: {
    houses: ['timberland', 'supreme'],
    year: 2024,
    sources: ['https://hypebeast.com/2024/11/supreme-timberland-fall-2024-collaboration-release-info'],
  },
  timberlandSupreme2025: {
    houses: ['timberland', 'supreme'],
    year: 2025,
    sources: ['https://modernnotoriety.com/supreme-timberland-patchwork-release-date/'],
  },
  timberlandAimeLeonDore2023: {
    houses: ['timberland', 'aimeLeonDore'],
    year: 2023,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-aim--leon-dore-return-with-iconic-3-eye-lug-handsewn-boat-shoe/s/a6e03518-85d6-4b34-94c9-afb38489b3a6'],
  },
  whiteMountaineeringAdidasSpring2015: {
    houses: ['whiteMountaineering', 'adidas'], year: 2015,
    sources: ['https://hypebeast.com/2015/5/white-mountaineering-x-adidas-originals-2015-spring-summer-stan-smith'],
  },
  whiteMountaineeringAdidasAutumn2015: {
    houses: ['whiteMountaineering', 'adidas'], year: 2015,
    sources: ['https://www.wwdjapan.com/articles/240067'],
  },
  whiteMountaineeringAdidas2016: {
    houses: ['whiteMountaineering', 'adidas'], year: 2016,
    sources: ['https://openers.jp/en/fashion/fashion_men/1468826'],
  },
  whiteMountaineeringAdidas2017: {
    houses: ['whiteMountaineering', 'adidas'], year: 2017,
    sources: ['https://sneakernews.com/2017/01/17/white-mountaineering-adidas-nmd-trail-release-date-info/'],
  },
  whiteMountaineeringAdidas2018: {
    houses: ['whiteMountaineering', 'adidas'], year: 2018,
    sources: ['https://prtimes.jp/a/?c=3301&f=d3301-506-pdf-0.pdf&r=506'],
  },
  whiteMountaineeringAdidas2019: {
    houses: ['whiteMountaineering', 'adidas'], year: 2019,
    sources: ['https://news.adidas.com/originals/adidas-originals-x-white-mountaineering-fw19-collection/s/afef09a3-892c-4f8a-aa6c-7d3b68330fee'],
  },
  whiteMountaineeringAdidasJanuary2020: {
    houses: ['whiteMountaineering', 'adidas'], year: 2020,
    sources: ['https://news.adidas.com/originals/adidas-originals-and-white-mountaineering-unveil-their-take-on-the-lxcon/s/d02f766d-acd5-4eaa-bb9d-b0c8ea10afd3'],
  },
  whiteMountaineeringAdidasMay2020: {
    houses: ['whiteMountaineering', 'adidas'], year: 2020,
    sources: ['https://www.sneakerfreaker.com/releases/white-mountaineering-and-adidas-deliver-a-sleek-lxcon'],
  },
  whiteMountaineeringUniqlo2021: {
    houses: ['whiteMountaineering', 'uniqlo'], year: 2021,
    sources: ['https://www.uniqlo.com/us/en/contents/collaboration/whitemountaineering/21fw/'],
  },
  whiteMountaineeringUniqlo2024: {
    houses: ['whiteMountaineering', 'uniqlo'], year: 2024,
    sources: ['https://www.uniqlo.com/jp/ja/contents/corp/press-release/2024/10/24100811_White%20Mountaineering.html'],
  },
  whiteMountaineeringBarbour2015: {
    houses: ['whiteMountaineering', 'barbour'], year: 2015,
    sources: ['https://www.fashionbeans.com/2015/barbour-white-mountaineering-clothing-ss15/'],
  },
  whiteMountaineeringReebok2024: {
    houses: ['whiteMountaineering', 'reebok'], year: 2024,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-reebok'],
  },
  whiteMountaineeringReebokAutumn2025: {
    houses: ['whiteMountaineering', 'reebok'], year: 2025,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-reebok-2'],
  },
  whiteMountaineeringEcco2024: {
    houses: ['whiteMountaineering', 'ecco'], year: 2024,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-ecco'],
  },
  whiteMountaineeringSchott2024: {
    houses: ['whiteMountaineering', 'schott'], year: 2024,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-schott'],
  },
  whiteMountaineeringSchott2025: {
    houses: ['whiteMountaineering', 'schott'], year: 2025,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-schott-1'],
  },
  whiteMountaineeringAlphaSpring2026: {
    houses: ['whiteMountaineering', 'alphaIndustries'], year: 2026,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-alpha-industries-1'],
  },
  whiteMountaineeringAlphaAutumn2026: {
    houses: ['whiteMountaineering', 'alphaIndustries'], year: 2026,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-alpha-industries-2'],
  },
  whiteMountaineeringDickiesAutumn2026: {
    houses: ['whiteMountaineering', 'dickies'], year: 2026,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-dickies-26aw'],
  },
  whiteMountaineeringDanner2025: {
    houses: ['whiteMountaineering', 'danner'], year: 2025,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-danner'],
  },
  whiteMountaineeringDanner2026: {
    houses: ['whiteMountaineering', 'danner'], year: 2026,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-danner-1'],
  },
  whiteMountaineeringUmbro2024: {
    houses: ['whiteMountaineering', 'umbro'], year: 2024,
    sources: ['https://whitemountaineering.com/blogs/news/blk-white-mountaineering-umbro'],
  },
  whiteMountaineeringUmbroSpring2025: {
    houses: ['whiteMountaineering', 'umbro'], year: 2025,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-umbro'],
  },
  whiteMountaineeringUmbroAutumn2025: {
    houses: ['whiteMountaineering', 'umbro'], year: 2025,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-umbro-1'],
  },
  whiteMountaineeringUmbro2026: {
    houses: ['whiteMountaineering', 'umbro'], year: 2026,
    sources: ['https://whitemountaineering.com/blogs/news/white-mountaineering-umbro-2'],
  },
  whiteMountaineeringReebokSpring2025: {
    houses: ['whiteMountaineering', 'reebok'], year: 2025,
    sources: ['https://www.thenewsmarket.com/news/reebok--white-mountaineering-unveil-second-collaboration-featuring-classic-leather--available-april-/s/4c5596cb-f01e-4cc9-80a0-31f3fcf3e779'],
  },
  // TODO: Merrell, TAION, BRIEFING and John Smedley collaborations need partner house profiles.
  timberlandWhiteMountaineeringSpring2024: {
    houses: ['timberland', 'whiteMountaineering'],
    year: 2024,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-white-mountaineering-collaborate-in-an-elevated-exploration-of-the-outdoors/s/c69b67ce-e1dc-46a3-8a32-9ba690b686e8'],
  },
  timberlandWhiteMountaineeringAutumn2024: {
    houses: ['timberland', 'whiteMountaineering'],
    year: 2024,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-white-mountaineering-redefine-outdoor-style-with-second-collaboration/s/87a8686c-196d-4be4-908d-32979383bfdc'],
  },
  timberlandIcebreaker2023: {
    houses: ['timberland', 'icebreaker'],
    year: 2023,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-icebreaker-launch-collaboration-designed-for-the-present--with-the-future-in-mind/s/f1bab733-1132-4736-843b-402502a9cef4'],
  },
  timberlandJjjjound2024: {
    houses: ['timberland', 'jjjjound'],
    year: 2024,
    sources: ['https://newsroom.timberland.com/latest-news/jjjj-timberland/s/940ef941-bcd7-4a2a-958b-0ecbab4c0013'],
  },
  timberlandHenderScheme2025: {
    houses: ['timberland', 'henderScheme'],
    year: 2025,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-hender-scheme-bring-unique-balance-of-heritage-and-modernity-to-a-classic/s/1a7fc045-6284-4267-b501-dfa2097796c3'],
  },
  timberlandJacquemus2025: {
    houses: ['timberland', 'jacquemus'],
    year: 2025,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-and-jacquemus-announce-new-collaboration/s/6fa25db8-3f0b-4d72-b5c3-e9d8a2ce9b38'],
  },
  timberlandJacquemusSummer2026: {
    houses: ['timberland', 'jacquemus'],
    year: 2026,
    sources: ['https://newsroom.timberland.com/latest-News/timberland-and-jacquemus-unveil-second-collaboration-for-summer-2026/s/5c660343-2b84-4a4a-bb68-c3d1f3f13482'],
  },
  timberlandJacquemusAutumn2026: {
    houses: ['timberland', 'jacquemus'],
    year: 2026,
    sources: ['https://www.timberland.co.jp/news-261016_jacquemus.html'],
  },
  timberlandAvirex2025: {
    houses: ['timberland', 'avirex'],
    year: 2025,
    sources: ['https://milled.com/avirex-com/unlock-exclusive-styles-today-Wf8AwVDkzX60J3mc'],
  },
  timberlandTelfar2025: {
    houses: ['timberland', 'telfar'],
    year: 2025,
    sources: ['https://telfar.net/collections/timberland-x-telfar', 'https://www.sneakerjagers.com/en/n/timberland-and-telfar-ring-in-the-fall-with-their-latest-collab/106689'],
  },
  timberlandNonnativeSixInch2025: {
    houses: ['timberland', 'nonnative'],
    year: 2025,
    sources: ['https://www.timberland.com/en-gb/blog/inspiration/timberland-x-nonnative'],
  },
  timberlandNonnativeChukka2025: {
    houses: ['timberland', 'nonnative'],
    year: 2025,
    sources: ['https://www.nonnative.com/25ss/specialproducts/timberland-x-nonnative-chukka-boot-vibram-gtx/'],
  },
  timberlandBeams2026: {
    houses: ['timberland', 'beams'],
    year: 2026,
    sources: ['https://newsroom.timberland.com/latest-news/beams-and-timberland-team-up-on-special-capsule-collection-to-mark-beams--50th-anniversary/s/4b34f011-bba0-4c36-8b77-ab427a077c94'],
  },
  timberlandNewEra2026: {
    houses: ['timberland', 'newEra'],
    year: 2026,
    sources: ['https://newsroom.timberland.com/latest-news/timberland-x-new-era--big-styles-for-the-big-leagues/s/22f8dec5-f54c-4371-85b5-baa48b50280e'],
  },
  jeremyScottAdidas2003: {
    houses: ['jeremyScottLabel', 'adidas'],
    year: 2003,
    sources: ['https://news.adidas.com/originals/paying-homage-with-jeremy-scott-to-our-roots-with-the-launch-of-the-2021-js-money-wings-sneaker/s/554764de-216d-4fcd-b86a-f3f0d8d21efb'],
  },
  jeremyScottAdidas2009: {
    houses: ['jeremyScottLabel', 'adidas'],
    year: 2009,
    sources: ['https://www.dazeddigital.com/fashion/article/1281/1/jeremy-scott-takes-on-adidas-originals'],
  },
  jeremyScottAdidasMoney2021: {
    houses: ['jeremyScottLabel', 'adidas'],
    year: 2021,
    sources: ['https://news.adidas.com/originals/paying-homage-with-jeremy-scott-to-our-roots-with-the-launch-of-the-2021-js-money-wings-sneaker/s/554764de-216d-4fcd-b86a-f3f0d8d21efb'],
  },
  jeremyScottAdidasDip2021: {
    houses: ['jeremyScottLabel', 'adidas'],
    year: 2021,
    sources: ['https://news.adidas.com/originals/getting-playful-with-the-launch-of-the-dip-collection-with-jeremy-scott/s/fa513148-12c2-4873-8987-0aa4b043b120'],
  },
  jeremyScottLindaFarrow2005: {
    houses: ['jeremyScottLabel', 'lindaFarrow'],
    year: 2005,
    sources: ['https://cfda.com/wp-content/uploads/2025/05/CFDA-Annual-Report-2016.pdf'],
  },
  jeremyScottLindaFarrow2008: {
    houses: ['jeremyScottLabel', 'lindaFarrow'],
    year: 2008,
    sources: ['https://www.vogue.co.uk/article/linda-farrow-jeremy-scott-sunglasses'],
  },
  jeremyScottLongchamp2006: {
    houses: ['jeremyScottLabel', 'longchamp'],
    year: 2006,
    sources: ['https://www.vogue.co.uk/article/longchamps-new-man'],
  },
  jeremyScottLongchamp2026: {
    houses: ['jeremyScottLabel', 'longchamp'],
    year: 2026,
    sources: ['https://www.longchamp.com/ca/en/maison-longchamp/editorials/longchamp-jeremy-scott.html'],
  },
  jeremyScottKsubi2007: {
    houses: ['jeremyScottLabel', 'ksubi'],
    year: 2007,
    sources: ['https://www.scmp.com/article/582776/ksubi'],
  },
  jeremyScottChristianLouboutin1997: {
    houses: ['jeremyScottLabel', 'christianLouboutin'],
    year: 1997,
    sources: ['https://fashion.mam-e.it/jeremy-scott/'],
  },
  redWingJCrew2007: {
    houses: ['redWing', 'jCrew'],
    year: 2007,
    sources: ['https://www.redwingshoeco.com/history'],
  },
  redWingFragmentDesign2019: {
    houses: ['redWing', 'fragmentDesign'],
    year: 2019,
    sources: ['https://www.maxim.com/style/red-wing-heritage-fragment-special-edition-moc-toe-2019-12/'],
  },
  redWingNewBalance2019: {
    houses: ['redWing', 'newBalance'],
    year: 2019,
    sources: ['https://www.redwingshoeco.com/blog-entries/red-wing-heritage-and-new-balance-partner-on-a-classic'],
  },
  redWingBeams2021: {
    houses: ['redWing', 'beams'],
    year: 2021,
    sources: ['https://www.beams.co.jp/blog/kkj/83480/'],
  },
  redWingBeams2022: {
    houses: ['redWing', 'beams'],
    year: 2022,
    sources: ['https://www.beams.co.jp/news/3097/'],
  },
  redWingBeams2026: {
    houses: ['redWing', 'beams'],
    year: 2026,
    sources: ['https://www.beams.co.jp/news/5074/'],
  },
  redWingEngineeredGarments2024: {
    houses: ['redWing', 'engineeredGarments'],
    year: 2024,
    sources: ['https://www.engineeredgarments.com/stories/special-release-red-wing-heritage-and-engineered-garments-press-release'],
  },
  redWingEngineeredGarments2025: {
    houses: ['redWing', 'engineeredGarments'],
    year: 2025,
    sources: ['https://www.engineeredgarments.com/stories/special-release-red-wing-heritage-and-engineered-garments-press-release-1'],
  },
  dickiesSupreme2021: {
    houses: ['dickies', 'supreme'],
    year: 2021,
    sources: ['https://hypebeast.com/2021/12/supreme-dickies-fall-2021-collaboration-release-details'],
  },
  dickiesSupreme2023: {
    houses: ['dickies', 'supreme'],
    year: 2023,
    sources: ['https://www.gq-magazine.co.uk/article/supreme-dickies-autumn-2023-collection'],
  },
  dickiesSupreme2024: {
    houses: ['dickies', 'supreme'],
    year: 2024,
    sources: ['https://www.dickies.com/en-us/blogs/collaborations/supreme'],
  },
  dickiesSupreme2025: {
    houses: ['dickies', 'supreme'],
    year: 2025,
    sources: ['https://modernnotoriety.com/supreme-dickies-fall-2025-release-date/'],
  },
  dickiesBrainDead2022: {
    houses: ['dickies', 'brainDead'],
    year: 2022,
    sources: ['https://shop-eat-surf-outdoor.com/press-releases/dickies-x-brain-dead-launch-first-collaboration/520551/'],
  },
  dickiesOpeningCeremony2022: {
    houses: ['dickies', 'openingCeremony'],
    year: 2022,
    sources: ['https://shop-eat-surf-outdoor.com/press-releases/dickies-partners-with-opening-ceremony/521973/'],
  },
  dickiesWillyChavarria2023: {
    houses: ['dickies', 'willyChavarria'],
    year: 2023,
    sources: ['https://www.wallpaper.com/fashion-beauty/dickies-willy-chavarria-collaboration'],
  },
  dickiesToga2021: {
    houses: ['dickies', 'toga'],
    year: 2021,
    sources: ['https://hypebeast.com/2021/7/toga-dickies-collaboration-spring-summer-2021-release-info'],
  },
  dickiesToga2023: {
    houses: ['dickies', 'toga'],
    year: 2023,
    sources: ['https://store.toga.jp/blogs/information/dickies-2023'],
  },
  dickiesFacetasm2020: {
    houses: ['dickies', 'facetasm'],
    year: 2020,
    sources: ['https://www.fashionsnap.com/article/2020-05-29/facetasm-dickies/'],
  },
  dickiesFacetasm2023: {
    houses: ['dickies', 'facetasm'],
    year: 2023,
    sources: ['https://hypebeast.com/2023/3/dickies-facetasm-collection-release-info'],
  },
  dickiesWackoMaria2021: {
    houses: ['dickies', 'wackoMaria'],
    year: 2021,
    sources: ['https://www.gsc-rinkan.com/column/wacko-maria/waco-maria-dickies-nice-dreams-collaboration-21ss/'],
  },
  dickiesWackoMaria2024: {
    houses: ['dickies', 'wackoMaria'],
    year: 2024,
    sources: ['https://www.dickies.jp/news/detail/dickies_wackomaria_fw24.html'],
  },
  dickiesWackoMaria2025: {
    houses: ['dickies', 'wackoMaria'],
    year: 2025,
    sources: ['https://cdn.wackomaria.co.jp/news/dickies-wackomaria-25ss-movie'],
  },
  dickiesWackoMaria2026: {
    houses: ['dickies', 'wackoMaria'],
    year: 2026,
    sources: ['https://www.sowld.jp/news-detail/4246'],
  },
  dickiesMastermindJapan2019: {
    houses: ['dickies', 'mastermindJapan'],
    year: 2019,
    sources: ['https://hypebeast.com/2019/11/dickies-mastermind-japan-collection-release-info'],
  },
  dickiesMastermindJapan2025: {
    houses: ['dickies', 'mastermindJapan'],
    year: 2025,
    sources: ['https://mastermindtokyo.com/blogs/%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9/dickies-mastermind-japan%E7%99%BA%E5%A3%B2%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B'],
  },
  dickiesUndercover2026: {
    houses: ['dickies', 'undercover'],
    year: 2026,
    sources: ['https://undercoverism.com/new/20260226_/newarrival'],
  },
  dickiesWhiteMountaineering2026: {
    houses: ['dickies', 'whiteMountaineering'],
    year: 2026,
    sources: ['https://www.fashionsnap.com/article/2026-02-18/white-mountaineering-dickies-2026/'],
  },
  dickiesNHoolywood2025: {
    houses: ['dickies', 'nHoolywood'],
    year: 2025,
    sources: ['https://www.laid-back.jp/blog/detail/1694'],
  },
  dickiesJunyaWatanabeMan2022: {
    houses: ['dickies', 'junyaWatanabeMan'],
    year: 2022,
    sources: ['https://www.fashion-press.net/news/75431'],
  },
  dickiesBedwinTheHeartbreakers2024: {
    houses: ['dickies', 'bedwinTheHeartbreakers'],
    year: 2024,
    sources: ['https://bedwintokyo.com/en/blogs/journal/pants-collection-in-september'],
  },
  dickiesXlarge2024: {
    houses: ['dickies', 'xlarge'],
    year: 2024,
    sources: ['https://xlarge.jp/news/collaboration/detail23789'],
  },
  dickiesHuf2022: {
    houses: ['dickies', 'huf'],
    year: 2022,
    sources: ['https://www.hufworldwide.jp/blogs/what/huf-x-dickies_2'],
  },
  dickiesHuf2023: {
    houses: ['dickies', 'huf'],
    year: 2023,
    sources: ['https://hufworldwide.com/blogs/news/huf-x-dickies-japan-only'],
  },
  dickiesSyte2026: {
    houses: ['dickies', 'syte'],
    year: 2026,
    sources: ['https://www.yohjiyamamoto.co.jp/en/news/detail/syte-x-dickies-collaboration-collection/'],
  },
  dickiesSophnet2021: {
    houses: ['dickies', 'sophnet'],
    year: 2021,
    sources: ['https://blog.soph.net/2021/04/26/'],
  },
  snsHerningCdg2008: {
    houses: ['snsHerning', 'cdg'],
    year: 2008,
    sources: ['https://monocle.com/design/sns-herning-danish-knitwear-revival/'],
  },
  snsHerningNHoolywood2017: {
    houses: ['snsHerning', 'nHoolywood'],
    year: 2017,
    sources: ['https://www.vogue.com/fashion-shows/fall-2017-menswear/n-hoolywood', 'https://wear.jp/item/26232280/'],
  },
  snsHerningJjjjound2024: {
    houses: ['snsHerning', 'jjjjound'],
    year: 2024,
    sources: ['https://www.jjjjound.com/blogs/projects/s-n-s-herning'],
  },
  snsHerningJjjjound2025: {
    houses: ['snsHerning', 'jjjjound'],
    year: 2025,
    sources: ['https://www.jjjjound.com/blogs/projects/s-n-s-herning-ii'],
  },
  martineRoseNapapijri2017: {
    houses: ['martineRose', 'napapijri'],
    year: 2017,
    sources: ['https://www.martine-rose.com/pages/aw-2017'],
  },
  martineRoseNapapijriSpring2018: {
    houses: ['martineRose', 'napapijri'],
    year: 2018,
    sources: ['https://www.martine-rose.com/pages/ss-2018'],
  },
  martineRoseNapapijriAutumn2018: {
    houses: ['martineRose', 'napapijri'],
    year: 2018,
    sources: ['https://www.martine-rose.com/pages/aw-2018'],
  },
  martineRoseNapapijri2019: {
    houses: ['martineRose', 'napapijri'],
    year: 2019,
    sources: ['https://www.martine-rose.com/pages/napapijri-ss2019'],
  },
  martineRoseNapapijri2025: {
    houses: ['martineRose', 'napapijri'],
    year: 2025,
    sources: ['https://www.napapijri.com/en-ie/pages/napa-by-martine-rose'],
  },
  martineRoseNike2019: {
    houses: ['martineRose', 'nike'],
    year: 2019,
    sources: ['https://www.vogue.co.jp/fashion/news/2018-12-17/nike'],
  },
  martineRoseNike2022: {
    houses: ['martineRose', 'nike'],
    year: 2022,
    sources: ['https://about.nike.com/en/newsroom/releases/nike-x-martine-rose-shox-mule-mr4-official-release-date'],
  },
  martineRoseNike2023: {
    houses: ['martineRose', 'nike'],
    year: 2023,
    sources: ['https://about.nike.com/en/newsroom/releases/nike-x-martine-rose-collection-redefines-women-s-football-styling'],
  },
  martineRoseClarksSpring2024: {
    houses: ['martineRose', 'clarks'],
    year: 2024,
    sources: ['https://www.martine-rose.com/pages/clarks-x-martine-rose'],
  },
  martineRoseClarksAutumn2024: {
    houses: ['martineRose', 'clarks'],
    year: 2024,
    sources: ['https://www.martine-rose.com/pages/clarks-x-martine-rose-aw24'],
  },
  martineRoseClarks2025: {
    houses: ['martineRose', 'clarks'],
    year: 2025,
    sources: ['https://www.martine-rose.com/pages/clarks-x-martine-rose-ss25'],
  },
  martineRoseSupreme2024: {
    houses: ['martineRose', 'supreme'],
    year: 2024,
    sources: ['https://supreme.com/news/970'],
  },
  martineRoseSupremeClarks2024: {
    houses: ['martineRose', 'supreme', 'clarks'],
    year: 2024,
    sources: ['https://www.sneakerfreaker.com/releases/martine-rose-supreme-clarks-desert-trek-price-buy-release-date'],
  },
  martineRoseSupreme2026: {
    houses: ['martineRose', 'supreme'],
    year: 2026,
    sources: ['https://www.martine-rose.com/pages/supreme%C2%AE-martine-rose%C2%AE'],
  },
  martineRoseSupremeNike2026: {
    houses: ['martineRose', 'supreme', 'nike'],
    year: 2026,
    sources: ['https://modernnotoriety.com/supreme-martine-rose-fw26-release-date/'],
  },
  martineRoseStussy2023: {
    houses: ['martineRose', 'stussy'],
    year: 2023,
    sources: ['https://www.stussy.com/blogs/features/stussy-martine-rose'],
  },
  martineRoseTommyJeans2022: {
    houses: ['martineRose', 'tommyJeans'],
    year: 2022,
    sources: ['https://prtimes.jp/main/html/rd/p/000000192.000010635.html'],
  },
  supremeVans1996: {
    houses: ["supreme", "vans"],
    year: 1996,
    name: "Old Skool",
    notes: "Co-branded skate shoes that began a long-running partnership.",
    sources: ["https://www.vans.com/en-gb/since-66"],
  },
  supremeNike2002: {
    houses: ["supreme", "nike"],
    year: 2002,
    name: "Cement SB Dunk Low",
    notes: "Elephant-print Dunks connected skate-shop culture with collectible sneakers.",
    sources: ["https://stockx.com/nike-dunk-sb-low-supreme-ny-black-cement-2002"],
  },
  supremeNorthFace2007: {
    houses: ["supreme", "theNorthFace"],
    year: 2007,
    name: "First outerwear collection",
    notes: "Technical mountain outerwear reinterpreted through New York skate culture.",
    sources: ["https://www.goat.com/editorial/north-face-supreme-collab-guide"],
  },
  supremeCdgVans2012: {
    houses: ["supreme", "cdgShirt", "vans"],
    year: 2012,
    name: "Comme des Garçons SHIRT capsule",
    notes: "Reversed box logos, polka dots and striped shirts, with Vans Authentic and Sk8-Hi footwear.",
    sources: ["https://hypebeast.com/2012/3/comme-des-garcons-shirt-x-supreme-2012-capsule-collection"],
  },
  supremeStoneIsland2014: {
    houses: ["supreme", "stoneIsland"],
    year: 2014,
    name: "Autumn/Winter capsule",
    notes: "Garment-dyed outerwear brought Italian fabric experimentation into Supreme’s wardrobe.",
    sources: ["https://stockx.com/news/supreme-x-stone-island-a-history-of-collaboration/"],
  },
  supremeLouisVuitton2017: {
    houses: ["supreme", "louisVuitton"],
    year: 2017,
    name: "Louis Vuitton / Supreme",
    notes: "Monogram leather goods and box-logo clothing joined luxury craftsmanship with skatewear.",
    sources: ["https://officemagazine.net/louis-vuittonsupreme"],
  },
  supremeLacoste2017: {
    houses: ["supreme", "lacoste"],
    year: 2017,
    name: "Spring collection",
    notes: "Polo shirts and tracksuits blended tennis heritage with skate style.",
    sources: ["https://www.vogue.com/article/supreme-lacoste-collaboration-availalbe-in-stores-online-spring-shopping"],
  },
  supremeBurberry2022: {
    houses: ["supreme", "burberry"],
    year: 2022,
    name: "Spring capsule",
    notes: "Burberry checks and outerwear met Supreme branding.",
    sources: ["https://prtimes.jp/main/html/rd/p/000000397.000002612.html"],
  },
  hmStellaMcCartney2005: {
    houses: ["hm", "stellaMcCartney"],
    year: 2005,
    name: "Stella McCartney × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmCommeDesGarcons2008: {
    houses: ["hm", "commeDesGarcons"],
    year: 2008,
    name: "Comme des Garçons × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmLanvin2010: {
    houses: ["hm", "lanvin"],
    year: 2010,
    name: "Lanvin × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmVersace2011: {
    houses: ["hm", "versace"],
    year: 2011,
    name: "Versace × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmMaisonMargiela2012: {
    houses: ["hm", "maisonMargiela"],
    year: 2012,
    name: "Maison Martin Margiela × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmIsabelMarant2013: {
    houses: ["hm", "isabelMarant"],
    year: 2013,
    name: "Isabel Marant × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmAlexanderWang2014: {
    houses: ["hm", "alexanderWang"],
    year: 2014,
    name: "Alexander Wang × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmBalmain2015: {
    houses: ["hm", "balmain"],
    year: 2015,
    name: "Balmain × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmKenzo2016: {
    houses: ["hm", "kenzo"],
    year: 2016,
    name: "KENZO × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmMoschino2018: {
    houses: ["hm", "moschino"],
    year: 2018,
    name: "MOSCHINO [tv] H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmSimoneRocha2021: {
    houses: ["hm", "simoneRocha"],
    year: 2021,
    name: "Simone Rocha × H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  hmMugler2023: {
    houses: ["hm", "mugler"],
    year: 2023,
    name: "Mugler H&M",
    sources: ["https://hmgroup.com/news/hm-to-collaborate-with-glenn-martens-for-autumn-2025/"],
  },
  uniqloUndercover2012: {
    houses: ["uniqlo", "undercover"],
    year: 2012,
    name: "UU",
    notes: "Family clothing combined Undercover’s design language with accessible everyday staples.",
    sources: ["https://www.fastretailing.com/eng/group/news/1202011500.html"],
  },
  uniqloLemaire2015: {
    houses: ["uniqlo", "lemaire"],
    year: 2015,
    name: "UNIQLO AND LEMAIRE",
    notes: "Restrained menswear and womenswear preceded the later Uniqlo U studio line.",
    sources: ["https://www.fastretailing.com/eng/group/news/1503031700.html"],
  },
  uniqloJwAnderson2017: {
    houses: ["uniqlo", "jwAnderson"],
    year: 2017,
    name: "UNIQLO and JW ANDERSON debut",
    notes: "British wardrobe references reworked as everyday LifeWear.",
    sources: ["https://www.uniqlo.com/us/en/contents/collaboration/jwanderson/22fw/"],
  },
  uniqloMarni2022: {
    houses: ["uniqlo", "marni"],
    year: 2022,
    name: "UNIQLO and MARNI",
    notes: "Playful shapes and colourful prints expanded the vocabulary of everyday basics.",
    sources: ["https://www.fastretailing.com/eng/group/news/2204261100.html"],
  },
  nikeStussy2000: {
    houses: ["nike", "stussy"],
    year: 2000,
    name: "Air Huarache LE",
    notes: "An early streetwear sneaker partnership centred on the Huarache.",
    sources: ["https://www.sneakerfreaker.com/features/the-complete-history-of-stussy-x-nike-collaborations"],
  },
  nikeOffWhite2017: {
    houses: ["nike", "offWhite"],
    year: 2017,
    name: "The Ten",
    notes: "Deconstruction, exposed construction and industrial typography reimagined familiar footwear.",
    sources: ["https://about.nike.com/en/newsroom/releases/virgil-abloh-nike-the-10"],
  },
  nikeSacai2019: {
    houses: ["nike", "sacai"],
    year: 2019,
    name: "LDWaffle",
    notes: "Doubled tongues, Swooshes and soles turned two running references into a hybrid.",
    sources: ["https://www.endclothing.com/us/features/nike-x-sacai-ldwaffle-register-now-on-end-launches"],
  },
  nikeJacquemus2022: {
    houses: ["nike", "jacquemus"],
    year: 2022,
    name: "Nike × Jacquemus debut",
    notes: "Athletic ready-to-wear combined with Jacquemus’s fashion perspective.",
    sources: ["https://about.nike.com/en/newsroom/releases/nike-x-jacquemus-spring-2024-official-images-release-date"],
  },
  nikeSacaiFragment2021: {
    houses: ["nike", "sacai", "fragmentDesign"],
    year: 2021,
    name: "LDWaffle × fragment design",
    notes: "A three-brand take on sacai’s layered running silhouette.",
    sources: ["https://www.endclothing.com/row/features/nike-x-sacai-x-fragment-ldwaffle-register-now-on-end-launches"],
  },
  clotNikeKod2006: {
    houses: ['clot', 'nike'], year: 2006,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeAlumni2015: {
    houses: ['clot', 'nike'], year: 2015,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeKod2021: {
    houses: ['clot', 'nike'], year: 2021,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeCha2021: {
    houses: ['clot', 'nike'], year: 2021,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeSolarRed2021: {
    houses: ['clot', 'nike'], year: 2021,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeClotezFebruary2023: {
    houses: ['clot', 'nike'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeClotezMarch2023: {
    houses: ['clot', 'nike'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeClotezApril2023: {
    houses: ['clot', 'nike'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeCork2023: {
    houses: ['clot', 'nike'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeWhatThe2023: {
    houses: ['clot', 'nike'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotNikeFragment2023: {
    houses: ['clot', 'nike', 'fragmentDesign'], year: 2023,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  nikeSacaiClotOctober2021: {
    houses: ['clot', 'nike', 'sacai'], year: 2021,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanTerracotta2018: {
    houses: ['clot', 'jordanBrand'], year: 2018,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanInfraBred2018: {
    houses: ['clot', 'jordanBrand'], year: 2018,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanFearless2019: {
    houses: ['clot', 'jordanBrand'], year: 2019,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanTerracottaAndJade2021: {
    houses: ['clot', 'jordanBrand'], year: 2021,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanJade2022: {
    houses: ['clot', 'jordanBrand'], year: 2022,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordanDelta2022: {
    houses: ['clot', 'jordanBrand'], year: 2022,
    sources: ['https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/'],
  },
  clotJordan2023: {
    houses: ['clot', 'jordanBrand'], year: 2023,
    sources: ['https://snkrdunk.com/en/magazine/2023/09/04/clot-continues-its-20th-anniversary-celebration-with-the-nike-air-jordan-5-low-white-silk/'],
  },
  clotAdidas2024: {
    houses: ['clot', 'adidas'], year: 2024,
    sources: ['https://news.adidas.com/originals/adidas-originals-by-edison-chen---first-global-collaboration-drop--clot-superstar/s/e5b5710e-0cdb-4d68-9e6b-a8a6a5529ba9'],
  },
  clotAdidas2025: {
    houses: ['clot', 'adidas'], year: 2025,
    sources: ['https://news.adidas.com/brands/adidas-originals-and-clot-by-edison-chen-release-a-collaborative-collection-with-heritage-classics--/s/0aa382ba-2844-4d3c-adb3-b87afa91aeca'],
  },
  clotAdidas2026: {
    houses: ['clot', 'adidas'], year: 2026,
    sources: ['https://news.adidas.com/originals/adidas-originals-and-clot-by-edison-chen-present-the-mundial-collection--a-reimaging-of-football-leg/s/3595c117-422a-4ef4-9ab4-215caffdf064'],
  },
  clotConverse2018: {
    houses: ['clot', 'converse'], year: 2018,
    sources: ['https://hypebeast.com/2018/2/clot-converse-spring-summer-2018-collection-release-date'],
  },
  clotConverse2021: {
    houses: ['clot', 'converse'], year: 2021,
    sources: ['https://www.nicekicks.com/clot-x-converse-chuck-70-hi-white/'],
  },
  clotBapeJanuary2025: {
    houses: ['clot', 'bape'], year: 2025,
    sources: ['https://juicestore.com/blogs/editorial/bape-x-clot-collaboration-celebrating-eastern-aesthetics-through-modern-streetwear'],
  },
  clotBapeJuly2025: {
    houses: ['clot', 'bape'], year: 2025,
    sources: ['https://juicestore.com/blogs/editorial/icons-unite-again-discover-the-bold-new-bape-x-clot-camouflage-reimagination'],
  },
  clotBapeAdidas2025: {
    houses: ['clot', 'bape', 'adidas'], year: 2025,
    sources: ['https://preview.thenewsmarket.com/Previews/ADID/DocumentAssets/708731_v2.pdf'],
  },
  clotTimberland2023: {
    houses: ['clot', 'timberland'], year: 2023,
    sources: ['https://selectabisso.com/en/clot-x-timberland-future73/'],
  },
  clotDrMartens2021: {
    houses: ['clot', 'drMartens'], year: 2021,
    sources: ['https://hypebeast.com/2021/5/clot-dr-martens-1461-release-date'],
  },
  clotSuicoke2018: {
    houses: ['clot', 'suicoke'], year: 2018,
    sources: ['https://suicoke.ca/blogs/news/clot-x-suicoke-collaboration'],
  },
  clotCoach2025: {
    houses: ['clot', 'coach'], year: 2025,
    sources: ['https://clotinc.com/blogs/editorial/coach-introduces-coach-clot-collection'],
  },
  clotCrocs2024: {
    houses: ['clot', 'crocs'], year: 2024,
    sources: ['https://selectabisso.com/en/clot-x-crocs-classic-clog/'],
  },
  nikeSacaiClot2021: {
    houses: ["nike", "sacai", "clot"],
    year: 2021,
    name: "LDWaffle × CLOT",
    notes: "CLOT’s colour references met sacai’s doubled construction.",
    sources: ["https://sneakernews.com/2023/08/10/every-sneaker-release-in-the-history-of-clot-and-nike/"],
  },
  diorJordan2020: {
    houses: ["dior", "jordanBrand"],
    year: 2020,
    name: "Air Dior",
    notes: "Dior gray and Oblique motifs reworked the Air Jordan 1 with a matching clothing capsule.",
    sources: ["https://www.youtube.com/watch?v=3Lf3bbYcNd4"],
  },
  adidasBape2003: {
    houses: ["adidas", "bape"],
    year: 2003,
    name: "Super Ape Star",
    notes: "The first Super Ape Star began a lasting streetwear partnership.",
    sources: ["https://news.adidas.com/originals/adidas-originals-and-bape--celebrate-20-years-of-collaboration/s/dac59ef4-41b2-44fc-9d75-3813e27b4514"],
  },
  adidasRafSimons2013: {
    houses: ["adidas", "rafSimonsLabel"],
    year: 2013,
    name: "adidas by Raf Simons debut",
    notes: "Sculptural performance-inspired sneakers helped connect runway fashion with sports footwear.",
    sources: ["https://www.gq.com/story/sneaker-grail-of-the-week-pfw-edition-adidas-by-raf-simons"],
  },
  adidasYeezy2015: {
    houses: ["adidas", "yeezy"],
    year: 2015,
    name: "YEEZY BOOST 750",
    notes: "Suede high-tops marked the retail debut of adidas YEEZY footwear.",
    sources: ["https://sneakernews.com/2015/02/09/adidas-yeezy-boost-release-date/"],
  },
  adidasPrada2019: {
    houses: ["adidas", "prada"],
    year: 2019,
    name: "Prada for adidas Limited Edition",
    notes: "Italian-made Superstar sneakers and a bowling bag joined sporting icons with luxury leatherwork.",
    sources: ["https://www.pradagroup.com/en/news-media/press-releases-documents/2019/19-11-25-prada-for-adidas-limited-edition.html"],
  },
  adidasWalesBonner2020: {
    houses: ["adidas", "walesBonner"],
    year: 2020,
    name: "adidas Originals by Wales Bonner debut",
    notes: "Knitwear, tracksuits and footwear explored British-Caribbean cultural connections.",
    sources: ["https://news.adidas.com/originals/wales-bonner-captures-her-own-jamaican-heritage-in-our-first-collaborative-collection/s/299fe6a0-37cb-4600-a1ee-e5f6ba6e41bf"],
  },
  adidasGucci2022: {
    houses: ["adidas", "gucci"],
    year: 2022,
    name: "adidas × Gucci",
    notes: "Retro sportswear, Gazelles and intertwined brand codes crossed fashion and athletic wardrobes.",
    sources: ["https://news.adidas.com/originals/showcasing-adidas-x-gucci/s/6f1599ec-2c0f-4dc8-8061-d846211f5be4"],
  },
  newBalanceAime2019: {
    houses: ["newBalance", "aimeLeonDore"],
    year: 2019,
    name: "ALD / New Balance 997",
    notes: "The 997 launch began the brands’ ongoing footwear partnership.",
    sources: ["https://eu.aimeleondore.com/blogs/news/ald-new-balance-997-og-mismatch"],
  },
  newBalanceMiuMiu2022: {
    houses: ["newBalance", "miuMiu"],
    year: 2022,
    name: "New Balance × Miu Miu 574",
    notes: "Raw edges and altered materials recast a familiar running-shoe silhouette.",
    sources: ["https://www.miumiu.com/eu/en/miumiu-club/special-projects/new-balance-x-miumiu.html"],
  },
  asicsKiko2018: {
    houses: ["asics", "kikoKostadinov"],
    year: 2018,
    name: "GEL-BURZ 1",
    notes: "Technical running components became footwear for Kostadinov’s clothing collection.",
    sources: ["https://www.endclothing.com/us/features/watch-now-asics-x-kiko-kostadinov-gel-burz-1-launching-6th-february"],
  },
  asicsCecilie2023: {
    houses: ["asics", "cecilieBahnsen"],
    year: 2023,
    name: "GT-2160 Mary Jane sneakers",
    notes: "Floral embellishment and Mary Jane references softened a technical sneaker.",
    sources: ["https://fashionweekonline.com/cecilie-bahnsen-x-asics-gt-2160-launch-during-paris-fashion-week"],
  },
  salomonMm62022: {
    houses: ["salomon", "mm6"],
    year: 2022,
    name: "Cross Low and Cross High",
    notes: "Trail-shoe technology combined with MM6’s unconventional silhouettes.",
    sources: ["https://zeitblatt.com/mm6-maison-margiela-x-salomon-autumn-winter-2022/"],
  },
  gucciNorthFace2021: {
    houses: ["gucci", "theNorthFace"],
    year: 2021,
    name: "The North Face × Gucci",
    notes: "Outdoor equipment and clothing entered Gucci’s colourful fashion world.",
    sources: ["https://static1.squarespace.com/static/5d8c0391980d9708b9b9cfa4/t/5ff62dcba8875e1df5478278/1609969099962/Press%2Brelease_The%2BNorth%2BFace%2Bx%2BGucci%2BDocumentary.pdf"],
  },
  gucciBalenciaga2021: {
    houses: ["gucci", "balenciaga"],
    year: 2021,
    name: "The Hacker Project",
    notes: "Both houses’ silhouettes and logos were deliberately appropriated and recombined.",
    sources: ["https://www.gucci.com/us/en/st/stories/article/gucci-gift-2021"],
  },
  balenciagaCrocs2018: {
    houses: ['balenciaga', 'crocs'],
    year: 2018,
    name: 'Balenciaga × Crocs platform clogs',
    notes: 'Foam clogs were raised on exaggerated platforms and decorated with colourful charms. Presented on the Spring/Summer 2018 runway in 2017; released in 2018.',
  },
  balenciagaAdidas2022: {
    houses: ['balenciaga', 'adidas'],
    year: 2022,
    name: 'Balenciaga / adidas',
    notes: 'Three-stripe tracksuits, oversized sportswear and reworked sneakers combined adidas sporting references with Balenciaga silhouettes.',
  },
  yeezyGapBalenciaga2022: {
    houses: ['yeezy', 'gap', 'balenciaga'],
    year: 2022,
    name: 'Yeezy Gap Engineered by Balenciaga',
    notes: 'Oversized hoodies, denim and utilitarian layers reworked Gap wardrobe staples through Yeezy and Balenciaga proportions.',
  },
  balenciagaUnderArmour2024: {
    houses: ['balenciaga', 'underArmour'],
    year: 2024,
    name: 'Balenciaga | Under Armour',
    notes: 'Athletic base layers, reversible outerwear and tracksuits combined Under Armour performance references with Balenciaga volumes.',
  },
  balenciagaPuma2025: {
    houses: ['balenciaga', 'puma'],
    year: 2025,
    name: 'Balenciaga | PUMA',
    notes: 'Deconstructed Speedcat sneakers, ballet-inspired footwear and sportswear reinterpreted Puma football and motorsport references.',
  },
  fendiVersace2022: {
    houses: ["fendi", "versace"],
    year: 2022,
    name: "Fendace",
    notes: "A creative swap produced Fendi by Versace and Versace by Fendi. Presented in 2021; released in 2022.",
    sources: ["https://www.vogue.com/article/fendace"],
  },
  louisVuittonTimberland2024: {
    houses: ["louisVuitton", "timberland"],
    year: 2024,
    name: "LV × Timberland boots",
    notes: "Work boots were reinterpreted through Louis Vuitton’s leatherwork and monogram.",
    sources: ["https://newsroom.timberland.com/latest-news/louis-vuitton-men-s-workwear-capsule-collection-by-pharrell-williams/s/e5a5c6d7-3699-4a9a-a47b-699fe817afc6"],
  },
  palacePolo2018: {
    houses: ["palace", "poloRalphLauren"],
    year: 2018,
    name: "Palace × Polo Ralph Lauren",
    notes: "American prep and British skatewear met in clothing including a kickflipping Polo Bear sweater.",
    sources: ["https://www.vogue.com/article/palace-x-polo-ralph-lauren-launch-new-york-city"],
  },
  palaceGucci2022: {
    houses: ["palace", "gucci"],
    year: 2022,
    name: "Palace Gucci",
    notes: "Skatewear, tailoring and combined logos brought Palace into Gucci’s Vault.",
    sources: ["https://www.vogue.co.uk/fashion/article/palace-gucci"],
  },
  diorBirkenstock2022: {
    houses: ["dior", "birkenstock"],
    year: 2022,
    name: "Dior by Birkenstock",
    notes: "Tokio mules and Milano sandals combined cork footbeds with Dior materials and hardware.",
    sources: ["https://www.birkenstock-group.com/de/en/detail-press/dior-by-birkenstock-collaboration-introduced-in-paris/"],
  },
  converseCdgPlay2009: {
    houses: ["converse", "cdgPlay"],
    year: 2009,
    name: "Converse × Comme des Garçons PLAY",
    notes: "The heart-with-eyes motif became a familiar feature of the Chuck Taylor partnership.",
    sources: ["https://www.converse.com/fr/landing-converse-history"],
  },
  reebokAwakeNy2020: {
    houses: ['reebok', 'awakeNy'],
    year: 2020,
    name: 'Reebok × Awake NY debut capsule',
    notes: 'Workout Low and Instapump Fury sneakers joined a sportswear capsule inspired by New York streetwear and Reebok heritage.',
  },
  reebokMaisonMargiela2020: {
    houses: ['reebok', 'maisonMargiela'],
    year: 2020,
    name: 'Tabi Instapump Fury',
    notes: 'Maison Margiela’s split-toe Tabi construction merged with Reebok’s inflatable Instapump Fury design in flat and heeled versions.',
  },
  reebokVetements2017: {
    houses: ['reebok', 'vetements'],
    year: 2017,
    name: 'Vetements × Reebok Instapump Fury',
    notes: 'Vetements reworked the Instapump Fury with prominent branding and graphic treatments, alongside socks and scarves.',
  },
  junyaWatanabeManFilson2025: {
    houses: ['junyaWatanabeMan', 'filson'],
    year: 2025,
    name: 'Junya Watanabe MAN × Filson Autumn/Winter 2025',
  },
  junyaWatanabeManNewBalance2025: {
    houses: ['junyaWatanabeMan', 'newBalance'],
    year: 2025,
    name: 'Junya Watanabe MAN × New Balance 471',
  },
  junyaWatanabeManCarhartt2024: {
    houses: ['junyaWatanabeMan', 'carharttWip'],
    year: 2024,
    name: 'Junya Watanabe MAN × Carhartt WIP Autumn/Winter 2024',
    sources: ['https://www.sivasdescalzo.com/us/p/men-s-pants-wn-p901-100-1'],
  },
  vivienneWestwoodAsics2019: {
    houses: ['vivienneWestwood', 'asics'],
    year: 2019,
    name: 'Vivienne Westwood × ASICS GEL-MAI Knit & GEL-KAYANO 5 OG',
  },
  craigGreenAdidas2020: {
    houses: ['craigGreen', 'adidas'],
    year: 2020,
    name: 'adidas Originals by Craig Green CG Kontuur I & II',
  },
  humanMadeLouisVuitton2021: {
    houses: ['humanMade', 'louisVuitton'],
    year: 2021,
    name: 'LV² “LV MADE” by Nigo',
  },
  asicsUndefeated2016: {
    houses: ['asics', 'undefeated'],
    year: 2016,
    name: 'UNDEFEATED × ASICS GEL-LYTE V “Disarray”',
  },
  wackoMariaVans2021: {
    houses: ['wackoMaria', 'vans'],
    year: 2021,
    name: 'Wacko Maria × Vault by Vans OG Authentic LX',
  },
  brainDeadConverse2019: {
    houses: ['brainDead', 'converse'],
    year: 2019,
    name: 'Brain Dead × Converse One Star',
  },
  arcteryxBeams2001: {
    houses: ['arcteryx', 'beams'],
    year: 2001,
  },
  arcteryxPalace2020: {
    houses: ['arcteryx', 'palace'],
    year: 2020,
  },
  arcteryxJilSander2021: {
    houses: ['arcteryx', 'jilSander'],
    year: 2021,
  },
  canadaGooseOvo2010: {
    houses: ['canadaGoose', 'ovo'],
    year: 2010,
  },
  canadaGooseJunyaWatanabeMan2018: {
    houses: ['canadaGoose', 'junyaWatanabeMan'],
    year: 2018,
  },
  canadaGooseVetements2016: {
    houses: ['canadaGoose', 'vetements'],
    year: 2016,
  },
  canadaGooseYProject2020: {
    houses: ['canadaGoose', 'yProject'],
    year: 2020,
  },
  canadaGooseAngelChen2021: {
    houses: ['canadaGoose', 'angelChen'],
    year: 2021,
  },
  canadaGooseBape2023: {
    houses: ['canadaGoose', 'bape'],
    year: 2023,
  },
  canadaGooseJuunJ2019: {
    houses: ['canadaGoose', 'juunJ'],
    year: 2019,
  },
  fengChenWangConverseApril2019: {
    houses: ['fengChenWang', 'converse'], year: 2019,
    sources: ['https://sneakernews.com/2019/04/24/converse-feng-cheng-wang-faith-connexion-koche-release-info/'],
  },
  fengChenWangConverseNovember2019: {
    houses: ['fengChenWang', 'converse'], year: 2019,
    sources: ['https://www.nssmag.com/en/fashion/19781/feng-chen-wang-and-converse-teamed-up-again-for-the-ss20'],
  },
  fengChenWangConverseAugust2020: {
    houses: ['fengChenWang', 'converse'], year: 2020,
    sources: ['https://sneakerbardetroit.com/feng-chen-wang-converse-jack-purcell-release-date/'],
  },
  fengChenWangConverseOctober2020: {
    houses: ['fengChenWang', 'converse'], year: 2020,
    sources: ['https://sneakernews.com/2020/10/15/feng-chen-wang-converse-chuck-70-2-in-1-release-date/'],
  },
  fengChenWangConverse2021: {
    houses: ['fengChenWang', 'converse'], year: 2021,
    sources: ['https://www.converse.com.au/stories/2-in-1-chucks-converse-x-feng-chen-wang', 'https://www.highsnobiety.com/p/feng-chen-wang-converse-chuck-70-fw21-release-date-price/'],
  },
  fengChenWangConverseFebruary2024: {
    houses: ['fengChenWang', 'converse'], year: 2024,
    sources: ['https://sneakernews.com/2024/01/12/feng-chen-wang-converse-chuck-70-low-spring-2024/'],
  },
  fengChenWangConverseMay2024: {
    houses: ['fengChenWang', 'converse'], year: 2024,
    sources: ['https://hypebeast.com/2024/4/feng-chen-wang-converse-2-in-1-chuck-70-2-collaboration-release-info'],
  },
  fengChenWangConverseSummer2024: {
    houses: ['fengChenWang', 'converse'], year: 2024,
    sources: ['https://fengchenwang.com/en-us/pages/converse-x-feng-chen-wang-su24-apparel-drop', 'https://www.zalando.co.uk/releases/qbbbTxAJzH3PaUMRyNFqz/'],
  },
  fengChenWangNike2023: {
    houses: ['fengChenWang', 'nike'], year: 2023,
    sources: ['https://about.nike.com/en/newsroom/releases/the-nike-x-feng-chen-wang-collection'],
  },
  fengChenWangUggSpring2021: {
    houses: ['fengChenWang', 'ugg'], year: 2021,
    sources: ['https://mb.cision.com/Main/7795/3326278/1402062.pdf'],
  },
  fengChenWangUggAutumn2021: {
    houses: ['fengChenWang', 'ugg'], year: 2021,
    sources: ['https://prtimes.jp/main/html/rd/p/000000495.000003434.html'],
  },
  fengChenWangUgg2022: {
    houses: ['fengChenWang', 'ugg'], year: 2022,
    sources: ['https://fengchenwang.com/en-us/pages/ugg-autumn-winter-2022-part-3'],
  },
  fengChenWangUgg2023: {
    houses: ['fengChenWang', 'ugg'], year: 2023,
    sources: ['https://www.highsnobiety.com/p/fcw-ugg-collab-2023/'],
  },
  fengChenWangUgg2025: {
    houses: ['fengChenWang', 'ugg'], year: 2025,
    sources: ['https://nz.ugg.com/products/ugg-x-feng-chen-wang-tasman-crm', 'https://modesens.com/product/ugg-x-feng-chen-wang-tasman-cream-white-neutral-115947966/'],
  },
  fengChenWangLevis2020: {
    houses: ['fengChenWang', 'levis'], year: 2020,
    sources: ['https://pausemag.co.uk/2020/12/feng-chen-wang-levis-red-team-up-for-an-ode-to-the-worker-collection/'],
  },
  fengChenWangBarbour2026: {
    houses: ['fengChenWang', 'barbour'], year: 2026,
    sources: ['https://fengchenwang.com/pages/barbour-x-feng-chen-wang'],
  },
  fengChenWangLee2026: {
    houses: ['fengChenWang', 'lee'], year: 2026,
    sources: ['https://leejeans.vn/blogs/news/lee-x-feng-chen-wang'],
  },
  // TODO: Verify distinct Converse releases in 2022 and 2023; announcements and campaign dates alone are insufficient.
  canadaGooseFengChenWang2022: {
    houses: ['canadaGoose', 'fengChenWang'],
    year: 2022,
    sources: ['https://www.scmp.com/magazines/style/luxury/article/3200148/style-edit-canada-goose-unveils-new-collaborative-collection-london-based-designer-feng-chen-wang'],
  },
  canadaGoosePyerMoss2023: {
    houses: ['canadaGoose', 'pyerMoss'],
    year: 2023,
  },
  canadaGooseAlife2006: {
    houses: ['canadaGoose', 'alife'],
    year: 2006,
  },
  canadaGooseLevis2013: {
    houses: ['canadaGoose', 'levis'],
    year: 2013,
  },
  canadaGooseWingsHorns2014: {
    houses: ['canadaGoose', 'wingsHorns'],
    year: 2014,
  },
  rickOwensChampion2020: {
    houses: ['rickOwens', 'champion'],
    year: 2020,
  },
  rickOwensVeja2019: {
    houses: ['rickOwens', 'veja'],
    year: 2019,
  },
  drkshdwConverse2021: {
    houses: ['drkshdw', 'converse'],
    year: 2021,
  },
  rickOwensDrMartens2021: {
    houses: ['rickOwens', 'drMartens'],
    year: 2021,
  },
  rickOwensAdidas2014: {
    houses: ['rickOwens', 'adidas'],
    year: 2014,
  },
  rickOwensBirkenstock2018: {
    houses: ['rickOwens', 'birkenstock'],
    year: 2018,
  },
  rickOwensMoncler2020: {
    houses: ['rickOwens', 'moncler'],
    year: 2020,
  },
  rickOwensRimowa2025: {
    houses: ['rickOwens', 'rimowa'],
    year: 2025,
  },
  vetementsAlphaIndustries2017: {
    houses: ['vetements', 'alphaIndustries'],
    year: 2017,
  },
  vetementsChampion2017: {
    houses: ['vetements', 'champion'],
    year: 2017,
  },
  vetementsLevis2017: {
    houses: ['vetements', 'levis'],
    year: 2017,
  },
  vetementsMackintosh2017: {
    houses: ['vetements', 'mackintosh'],
    year: 2017,
  },
  vetementsSchott2017: {
    houses: ['vetements', 'schott'],
    year: 2017,
  },
  vetementsChurchs2017: {
    houses: ['vetements', 'churchs'],
    year: 2017,
  },
  vetementsTommyHilfiger2018: {
    houses: ['vetements', 'tommyHilfiger'],
    year: 2018,
  },
  vetementsUmbro2018: {
    houses: ['vetements', 'umbro'],
    year: 2018,
    sources: ['https://hypebeast.com/2018/4/km20-vetements-umbro-spring-summer-2018-editorial'],
  },
  vetementsOakley2019: {
    houses: ['vetements', 'oakley'],
    year: 2019,
  },
  vetementsBrioni2017: {
    houses: ['vetements', 'brioni'],
    year: 2017,
  },
  sacaiAcronym2022: { houses: ['sacai', 'acronym'], year: 2022 },
  sacaiThomasMason2024: { houses: ['sacai', 'thomasMason'], year: 2024 },
  sacaiUgg2018: { houses: ['sacai', 'ugg'], year: 2018 },
  sacaiBirkenstock2027: { houses: ['sacai', 'birkenstock'], year: 2027 },
  sacaiNorthFace2017: { houses: ['sacai', 'theNorthFace'], year: 2017 },
  sacaiMoncler2023: { houses: ['sacai', 'moncler'], year: 2023 },
  sacaiCarharttWip2023: { houses: ['sacai', 'carharttWip'], year: 2023 },
  sacaiApc2021: { houses: ['sacai', 'apc'], year: 2021 },
  sacaiVans2014: { houses: ['sacai', 'vans'], year: 2014 },
  sacaiLevis2025: { houses: ['sacai', 'levis'], year: 2025 },
  sacaiWtaps2025: { houses: ['sacai', 'wtaps'], year: 2025 },
  sacaiJmWeston2024: {
    houses: ['sacai', 'jmWeston'],
    year: 2024,
    sources: ['https://www.sacai.jp/en/blogs/news/jm-weston-sacai-collaboration'],
  },
  sacaiNewEra2024: { houses: ['sacai', 'newEra'], year: 2024 },
  sacaiPorterYoshida2020: { houses: ['sacai', 'porterYoshida'], year: 2020 },
  sacaiPendleton2018: { houses: ['sacai', 'pendleton'], year: 2018 },
  sacaiGloverall2018: { houses: ['sacai', 'gloverall'], year: 2018 },
  sacaiSpiewak2024: { houses: ['sacai', 'spiewak'], year: 2024 },
  birkenstockValentino2019: { houses: ['birkenstock', 'valentino'], year: 2019 },
  birkenstockProenzaSchouler2020: { houses: ['birkenstock', 'proenzaSchouler'], year: 2020 },
  birkenstockStussy2020: { houses: ['birkenstock', 'stussy'], year: 2020 },
  birkenstockJilSander2021: { houses: ['birkenstock', 'jilSander'], year: 2021 },
  birkenstockFearOfGod2023: { houses: ['birkenstock', 'fearOfGod'], year: 2023 },
  birkenstockBeams2019: { houses: ['birkenstock', 'beams'], year: 2019 },
  birkenstock032c2018: { houses: ['birkenstock', 'thirtyTwoC'], year: 2018 },
  birkenstockEtro2026: { houses: ['birkenstock', 'etro'], year: 2026 },
  birkenstockAderError2022: { houses: ['birkenstock', 'aderError'], year: 2022 },
  fearOfGodNike2018: { houses: ['fearOfGod', 'nike'], year: 2018 },
  fearOfGodAdidas2023: { houses: ['fearOfGod', 'adidas'], year: 2023 },
  fearOfGodZegna2020: { houses: ['fearOfGod', 'zegna'], year: 2020 },
  fearOfGodVans2016: { houses: ['fearOfGod', 'vans'], year: 2016 },
  fearOfGodNewEra2017: { houses: ['fearOfGod', 'newEra'], year: 2017 },
  essentialsConverse2018: { houses: ['essentials', 'converse'], year: 2018 },
  fearOfGodMastermindJapan2016: { houses: ['fearOfGod', 'mastermindJapan'], year: 2016 },
  fearOfGodAwakeNy2023: { houses: ['fearOfGod', 'awakeNy'], year: 2023 },
  alphaIndustries032c2024: { houses: ['alphaIndustries', 'thirtyTwoC'], year: 2024 },
  alphaIndustriesOvo2025: { houses: ['alphaIndustries', 'ovo'], year: 2025 },
  alphaIndustriesThugClub2025: { houses: ['alphaIndustries', 'thugClub'], year: 2025 },
  alphaIndustriesJunyaWatanabeMan2025: { houses: ['alphaIndustries', 'junyaWatanabeMan'], year: 2025 },
  alphaIndustriesSupreme2022: { houses: ['alphaIndustries', 'supreme'], year: 2022 },
  alphaIndustriesBape2020: { houses: ['alphaIndustries', 'bape'], year: 2020 },
  alphaIndustriesWtaps2026: { houses: ['alphaIndustries', 'wtaps'], year: 2026 },
  alphaIndustriesNHoolywood2024: { houses: ['alphaIndustries', 'nHoolywood'], year: 2024 },
  alphaIndustriesJiyongKim2024: { houses: ['alphaIndustries', 'jiyongKim'], year: 2024 },
  alphaIndustriesPatta2024: { houses: ['alphaIndustries', 'patta'], year: 2024 },
  alphaIndustriesCecilieBahnsen2026: { houses: ['alphaIndustries', 'cecilieBahnsen'], year: 2026 },
  alphaIndustriesWhiteMountaineering2025: { houses: ['alphaIndustries', 'whiteMountaineering'], year: 2025 },
  diorSacai2021: { houses: ['dior', 'sacai'], year: 2021 },
  diorStoneIsland2024: { houses: ['dior', 'stoneIsland'], year: 2024 },
  diorErl2023: { houses: ['dior', 'erl'], year: 2023 },
  diorRimowa2019: { houses: ['dior', 'rimowa'], year: 2019 },
  diorDenimTears2023: { houses: ['dior', 'denimTears'], year: 2023 },
  birkenstockValentino2020: { houses: ['birkenstock', 'valentino'], year: 2020 },
  valentinoUndercover2019: { houses: ['valentino', 'undercover'], year: 2019 },
  valentinoOnitsukaTiger2020: { houses: ['valentino', 'onitsukaTiger'], year: 2020 },
  valentinoMoncler2018: { houses: ['valentino', 'moncler'], year: 2018 },
  valentinoLevis2021: { houses: ['valentino', 'levis'], year: 2021 },
  valentinoCraigGreen2021: { houses: ['valentino', 'craigGreen'], year: 2021 },
  valentinoVans2025: { houses: ['valentino', 'vans'], year: 2025 },
  valentinoGap2010: { houses: ['valentino', 'gap'], year: 2010 },
  valentinoHavaianas2014: { houses: ['valentino', 'havaianas'], year: 2014 },
  versaceKith2019: { houses: ['versace', 'kith'], year: 2019 },
  versaceOnitsukaTiger2026: { houses: ['versace', 'onitsukaTiger'], year: 2026 },
  stoneIslandAdidas2009: { houses: ['stoneIsland', 'adidas'], year: 2009 },
  stoneIslandNewBalance2009: { houses: ['stoneIsland', 'newBalance'], year: 2009 },
  stoneIslandNike2016: { houses: ['stoneIsland', 'nike'], year: 2016 },
  stoneIslandPorterYoshida2015: { houses: ['stoneIsland', 'porterYoshida'], year: 2015 },
  stoneIslandPersol2020: { houses: ['stoneIsland', 'persol'], year: 2020 },
  stoneIslandBeams2026: { houses: ['stoneIsland', 'beams'], year: 2026 },
  cpCompanyAdidas2018: { houses: ['cpCompany', 'adidas'], year: 2018 },
  cpCompanyPatta2019: { houses: ['cpCompany', 'patta'], year: 2019 },
  cpCompanyBarbour2021: { houses: ['cpCompany', 'barbour'], year: 2021 },
  cpCompanyClarks2021: { houses: ['cpCompany', 'clarks'], year: 2021 },
  cpCompanyEmporioArmani2021: { houses: ['cpCompany', 'emporioArmani'], year: 2021 },
  cpCompanyPalace2022: { houses: ['cpCompany', 'palace'], year: 2022 },
  cpCompanyAsics2024: { houses: ['cpCompany', 'asics'], year: 2024 },
  missoniAdidas2019: { houses: ['missoni', 'adidas'], year: 2019 },
  missoniPalmAngels2021: { houses: ['missoni', 'palmAngels'], year: 2021 },
  missoniSuicoke2022: { houses: ['missoni', 'suicoke'], year: 2022 },
  missoniSupreme2021: { houses: ['missoni', 'supreme'], year: 2021 },
  chloeMoonBoot2021: { houses: ['chloe', 'moonBoot'], year: 2021 },
  chloeBarbour2022: { houses: ['chloe', 'barbour'], year: 2022 },
  junyaWatanabeManFilson2012: { houses: ['junyaWatanabeMan', 'filson'], year: 2012 },
  filsonNigelCabourn2014: { houses: ['filson', 'nigelCabourn'], year: 2014 },
  filsonBirkenstock2024: { houses: ['filson', 'birkenstock'], year: 2024 },
  filsonWrangler2025: {
    houses: ['filson', 'wrangler'], year: 2025,
    sources: ['https://www.kontoorbrands.com/investors/news-events/press-releases/detail/220/filson-x-wrangler-two-icons-of-american-craftsmanship'],
  },
  filsonStetson2025: { houses: ['filson', 'stetson'], year: 2025 },
  uniqloMarimekko2024: { houses: ['uniqlo', 'marimekko'], year: 2024 },
  humanMadeLevis2022: { houses: ['humanMade', 'levis'], year: 2022 },
  humanMadeGirlsDontCry2023: { houses: ['humanMade', 'girlsDontCry'], year: 2023 },
  humanMadeGirlsDontCry2024: { houses: ['humanMade', 'girlsDontCry'], year: 2024 },
  humanMadeCactusPlantFleaMarket2019: { houses: ['humanMade', 'cactusPlantFleaMarket'], year: 2019 },
  humanMadeUndercover2025: { houses: ['humanMade', 'undercover'], year: 2025 },
  humanMadeRedWing2026: { houses: ['humanMade', 'redWing'], year: 2026 },
  humanMadeAdidas2019: { houses: ['humanMade', 'adidas'], year: 2019 },
  humanMadeAdidas2020: { houses: ['humanMade', 'adidas'], year: 2020 },
  humanMadeAdidas2021: { houses: ['humanMade', 'adidas'], year: 2021 },
  diorDescente2020: { houses: ['dior', 'descente'], year: 2020 },
  diorDescente2021: { houses: ['dior', 'descente'], year: 2021 },
  diorDescente2022: { houses: ['dior', 'descente'], year: 2022 },
  diorDescente2023: { houses: ['dior', 'descente'], year: 2023 },
  lanvinGalleryDept2021: { houses: ['lanvin', 'galleryDept'], year: 2021 },
  lanvinGalleryDept2022: { houses: ['lanvin', 'galleryDept'], year: 2022 },
  lanvinSuicoke2022: { houses: ['lanvin', 'suicoke'], year: 2022 },
  coperniPuma2024: { houses: ['coperni', 'puma'], year: 2024 },
  coperniRayBan2025: { houses: ['coperni', 'rayBan'], year: 2025 },
  brainDeadAdidas2024: { houses: ['brainDead', 'adidas'], year: 2024 },
  brainDeadAdidas2025: { houses: ['brainDead', 'adidas'], year: 2025 },
  brainDeadAdidas2026: { houses: ['brainDead', 'adidas'], year: 2026 },
  brainDeadOakley2022: { houses: ['brainDead', 'oakley'], year: 2022 },
  brainDeadOakley2023: { houses: ['brainDead', 'oakley'], year: 2023 },
  brainDeadOakley2024: { houses: ['brainDead', 'oakley'], year: 2024 },
  brainDeadOakley2025: { houses: ['brainDead', 'oakley'], year: 2025 },
  brainDeadAsics2021: { houses: ['brainDead', 'asics'], year: 2021 },
  brainDeadAsics2023: { houses: ['brainDead', 'asics'], year: 2023 },
  brainDeadReebok2020: { houses: ['brainDead', 'reebok'], year: 2020 },
  brainDeadReebok2021: { houses: ['brainDead', 'reebok'], year: 2021 },
  brainDeadReebok2022: { houses: ['brainDead', 'reebok'], year: 2022 },
  brainDeadConverse2020: { houses: ['brainDead', 'converse'], year: 2020 },
  brainDeadVans2017: { houses: ['brainDead', 'vans'], year: 2017 },
  brainDeadHoka2023: { houses: ['brainDead', 'hoka'], year: 2023 },
  stussyNike2001: { houses: ['stussy', 'nike'], year: 2001 },
  stussyNike2005: { houses: ['stussy', 'nike'], year: 2005 },
  stussyNike2015: { houses: ['stussy', 'nike'], year: 2015 },
  stussyNike2020: { houses: ['stussy', 'nike'], year: 2020 },
  stussyNike2021: { houses: ['stussy', 'nike'], year: 2021 },
  stussyNike2022: { houses: ['stussy', 'nike'], year: 2022 },
  stussyNike2023: { houses: ['stussy', 'nike'], year: 2023 },
  stussyNike2024: { houses: ['stussy', 'nike'], year: 2024 },
  stussyNike2025: { houses: ['stussy', 'nike'], year: 2025 },
  stussyConverse2013: { houses: ['stussy', 'converse'], year: 2013 },
  stussyConverse2022: { houses: ['stussy', 'converse'], year: 2022 },
  stussyConverse2023: { houses: ['stussy', 'converse'], year: 2023 },
  stussyConverse2024: { houses: ['stussy', 'converse'], year: 2024 },
  stussyVans2017: { houses: ['stussy', 'vans'], year: 2017 },
  stussyLevis2023: { houses: ['stussy', 'levis'], year: 2023 },
  stussyLevis2024: { houses: ['stussy', 'levis'], year: 2024 },
  stussyBirkenstock2023: { houses: ['stussy', 'birkenstock'], year: 2023 },
  stussyDrMartens2016: { houses: ['stussy', 'drMartens'], year: 2016 },
  stussyDrMartens2021: { houses: ['stussy', 'drMartens'], year: 2021 },
  stussyDrMartens2024: { houses: ['stussy', 'drMartens'], year: 2024 },
  stussyOurLegacy2020: { houses: ['stussy', 'ourLegacy'], year: 2020 },
  stussyOurLegacy2021: { houses: ['stussy', 'ourLegacy'], year: 2021 },
  stussyOurLegacy2022: { houses: ['stussy', 'ourLegacy'], year: 2022 },
  stussyOurLegacy2023: { houses: ['stussy', 'ourLegacy'], year: 2023 },
  stussyOurLegacy2024: { houses: ['stussy', 'ourLegacy'], year: 2024 },
  stussyOurLegacy2025: { houses: ['stussy', 'ourLegacy'], year: 2025 },
  stussyOurLegacy2026: { houses: ['stussy', 'ourLegacy'], year: 2026 },
  stussyOurLegacy2026Vol11: { houses: ['stussy', 'ourLegacy'], year: 2026 },
  stussyOurLegacyDenimTears2021: { houses: ['stussy', 'ourLegacy', 'denimTears'], year: 2021 },
  ourLegacyStussyConverse2023: { houses: ['ourLegacy', 'stussy', 'converse'], year: 2023 },
  ourLegacyConverse2025: { houses: ['ourLegacy', 'converse'], year: 2025 },
  ourLegacyConverse2026: { houses: ['ourLegacy', 'converse'], year: 2026 },
  ourLegacyVans2017: { houses: ['ourLegacy', 'vans'], year: 2017 },
  ourLegacyDrMartens2022: { houses: ['ourLegacy', 'drMartens'], year: 2022 },
  ourLegacyEmporioArmani2023: { houses: ['ourLegacy', 'emporioArmani'], year: 2023 },
  ourLegacyEmporioArmani2025: { houses: ['ourLegacy', 'emporioArmani'], year: 2025 },
  ourLegacyDickies2026: { houses: ['ourLegacy', 'dickies'], year: 2026 },
  ourLegacyTimberland2026: { houses: ['ourLegacy', 'timberland'], year: 2026 },
  ourLegacyCpCompany2025: { houses: ['ourLegacy', 'cpCompany'], year: 2025 },
  ourLegacyRoa2025: { houses: ['ourLegacy', 'roa'], year: 2025 },
  ourLegacyGoldwin2026: { houses: ['ourLegacy', 'goldwin'], year: 2026 },
  ourLegacySatisfy2023: { houses: ['ourLegacy', 'satisfy'], year: 2023 },
  ourLegacySatisfy2024: { houses: ['ourLegacy', 'satisfy'], year: 2024 },
  stussyDenimTears2022: { houses: ['stussy', 'denimTears'], year: 2022 },
  stussyDenimTears2025: { houses: ['stussy', 'denimTears'], year: 2025 },
  stussyPatta2024: { houses: ['stussy', 'patta'], year: 2024 },
  stussyMountainHardwear2024: {
    houses: ['stussy', 'mountainHardwear'], year: 2024,
    sources: ['https://www.stussy.com/blogs/features/stussy-mountain-hardwear-1', 'https://www.youtube.com/watch?v=z_S0mtKLy5o'],
  },
  stussyCdg2021: { houses: ['stussy', 'cdg'], year: 2021 },
  stussyJunyaWatanabeMan2024: { houses: ['stussy', 'junyaWatanabeMan'], year: 2024 },
  stussySuicoke2017: { houses: ['stussy', 'suicoke'], year: 2017 },
  stussyClarks2023: { houses: ['stussy', 'clarks'], year: 2023 },
  visvimSupreme2008: { houses: ['visvim', 'supreme'], year: 2008 },
  visvimSupreme2009: { houses: ['visvim', 'supreme'], year: 2009 },
  visvimMoncler2010: { houses: ['visvim', 'moncler'], year: 2010 },
  visvimCdgShirt2007: { houses: ['visvim', 'cdgShirt'], year: 2007 },
  visvimCommeDesGarcons2008: { houses: ['visvim', 'commeDesGarcons'], year: 2008 },
  visvimSophnet2011: { houses: ['visvim', 'sophnet'], year: 2011 },
  visvimSophnet2012: { houses: ['visvim', 'sophnet'], year: 2012 },
  visvimMastermindJapan2009: { houses: ['visvim', 'mastermindJapan'], year: 2009 },
  visvimFragmentDesign2006: { houses: ['visvim', 'fragmentDesign'], year: 2006 },
  visvimUndercover2007: { houses: ['visvim', 'undercover'], year: 2007 },
  crocsChristopherKane2017: { houses: ['crocs', 'christopherKane'], year: 2017 },
  balenciagaCrocs2021: { houses: ['balenciaga', 'crocs'], year: 2021 },
  balenciagaCrocs2022: { houses: ['balenciaga', 'crocs'], year: 2022 },
  crocsBeams2020: { houses: ['crocs', 'beams'], year: 2020 },
  crocsBeams2021: { houses: ['crocs', 'beams'], year: 2021 },
  crocsPalace2021: { houses: ['crocs', 'palace'], year: 2021 },
  crocsPalace2023: { houses: ['crocs', 'palace'], year: 2023 },
  crocsPalace2024: { houses: ['crocs', 'palace'], year: 2024 },
  crocsMcm2022: { houses: ['crocs', 'mcm'], year: 2022 },
  crocsMcm2023: { houses: ['crocs', 'mcm'], year: 2023 },
  crocsChristianCowan2022: { houses: ['crocs', 'christianCowan'], year: 2022 },
  crocsLevis2023: { houses: ['crocs', 'levis'], year: 2023 },
  crocsAries2023: { houses: ['crocs', 'aries'], year: 2023 },
  crocsAries2025: { houses: ['crocs', 'aries'], year: 2025 },
  crocsJjjjound2023: { houses: ['crocs', 'jjjjound'], year: 2023 },
  crocsFengChenWang2023: { houses: ['crocs', 'fengChenWang'], year: 2023 },
  crocsMschf2023: { houses: ['crocs', 'mschf'], year: 2023 },
  crocsSimoneRocha2024: { houses: ['crocs', 'simoneRocha'], year: 2024 },
  crocsSimoneRocha2025: { houses: ['crocs', 'simoneRocha'], year: 2025 },
  crocsMuseumOfPeaceQuiet2023: { houses: ['crocs', 'museumOfPeaceQuiet'], year: 2023 },
  crocsThreeSixteen2024: { houses: ['crocs', 'threeSixteen'], year: 2024 },
  crocsBape2025: { houses: ['crocs', 'bape'], year: 2025 },
  crocsBarbour2025: { houses: ['crocs', 'barbour'], year: 2025 },
  crocsJuicyCouture2025: { houses: ['crocs', 'juicyCouture'], year: 2025 },
  crocsMarimekko2025: { houses: ['crocs', 'marimekko'], year: 2025 },
  muglerWolford2022: { houses: ['mugler', 'wolford'], year: 2022 },
  muglerJimmyChoo2022: { houses: ['mugler', 'jimmyChoo'], year: 2022 },
  muglerGentleMonster2024: { houses: ['mugler', 'gentleMonster'], year: 2024 },
  gloverallJunyaWatanabeMan2012: { houses: ['gloverall', 'junyaWatanabeMan'], year: 2012 },
  gloverallStudioNicholson2019: { houses: ['gloverall', 'studioNicholson'], year: 2019 },
  gloverallAlphaIndustries2020: { houses: ['gloverall', 'alphaIndustries'], year: 2020 },
  gloverallDescente2020: { houses: ['gloverall', 'descente'], year: 2020 },
  gloverallEngineeredGarments2022: { houses: ['gloverall', 'engineeredGarments'], year: 2022 },
  gloverallBlackstockWeber2023: { houses: ['gloverall', 'blackstockWeber'], year: 2023 },
  gloverallLongchamp2025: { houses: ['gloverall', 'longchamp'], year: 2025 },
  gloverallNoah2026: { houses: ['gloverall', 'noah'], year: 2026 },
  loeweOn2022: { houses: ['loewe', 'onRunning'], year: 2022 },
  loeweOn2023: { houses: ['loewe', 'onRunning'], year: 2023 },
  loeweOn2024: { houses: ['loewe', 'onRunning'], year: 2024 },
  loeweOn2025: { houses: ['loewe', 'onRunning'], year: 2025 },
  loeweOn2026: { houses: ['loewe', 'onRunning'], year: 2026 },
  adidasPrada2020: { houses: ['adidas', 'prada'], year: 2020 },
  adidasPrada2022: { houses: ['adidas', 'prada'], year: 2022 },
  adidasPrada2023: { houses: ['adidas', 'prada'], year: 2023 },
  pradaGentleMonster2026: { houses: ['prada', 'gentleMonster'], year: 2026 },
  newBalanceMiuMiu2023: { houses: ['newBalance', 'miuMiu'], year: 2023 },
  newBalanceMiuMiu2024: { houses: ['newBalance', 'miuMiu'], year: 2024 },
  newBalanceMiuMiu2025: { houses: ['newBalance', 'miuMiu'], year: 2025 },
  miuMiuChurchs2023: { houses: ['miuMiu', 'churchs'], year: 2023 },
  miuMiuChurchs2024: { houses: ['miuMiu', 'churchs'], year: 2024 },
  fendiFila2018: { houses: ['fendi', 'fila'], year: 2018 },
  fendiSkims2021: { houses: ['fendi', 'skims'], year: 2021 },
  fendiRedWing2025: { houses: ['fendi', 'redWing'], year: 2025 },
  fendiPorterYoshida2019: { houses: ['fendi', 'porterYoshida'], year: 2019 },
  fendiPorterYoshida2022: { houses: ['fendi', 'porterYoshida'], year: 2022 },
  fendiFragmentDesign2024: { houses: ['fendi', 'fragmentDesign'], year: 2024 },
  maisonMargielaConverse2013: { houses: ['maisonMargiela', 'converse'], year: 2013 },
  maisonMargielaConverse2014: { houses: ['maisonMargiela', 'converse'], year: 2014 },
  reebokMaisonMargiela2021: { houses: ['reebok', 'maisonMargiela'], year: 2021 },
  reebokMaisonMargiela2022: { houses: ['reebok', 'maisonMargiela'], year: 2022 },
  maisonMargielaGentleMonster2023: { houses: ['maisonMargiela', 'gentleMonster'], year: 2023 },
  maisonMargielaGentleMonster2024: { houses: ['maisonMargiela', 'gentleMonster'], year: 2024 },
  maisonMargielaGentleMonster2025: { houses: ['maisonMargiela', 'gentleMonster'], year: 2025 },
  maisonMargielaGentleMonster2026: { houses: ['maisonMargiela', 'gentleMonster'], year: 2026 },
  mm6NorthFace2020: { houses: ['mm6', 'theNorthFace'], year: 2020 },
  mm6Eastpak2021: { houses: ['mm6', 'eastpak'], year: 2021 },
  mm6Eastpak2022: { houses: ['mm6', 'eastpak'], year: 2022 },
  salomonMm62023: { houses: ['salomon', 'mm6'], year: 2023 },
  salomonMm62024: { houses: ['salomon', 'mm6'], year: 2024 },
  salomonMm62025: { houses: ['salomon', 'mm6'], year: 2025 },
  salomonMm62026: { houses: ['salomon', 'mm6'], year: 2026 },
  mm6Supreme2024: { houses: ['mm6', 'supreme'], year: 2024 },
  mm6Supreme2026: { houses: ['mm6', 'supreme'], year: 2026 },
  mm6DrMartens2024: { houses: ['mm6', 'drMartens'], year: 2024 },
  mm6DrMartens2025: { houses: ['mm6', 'drMartens'], year: 2025 },
  keenEngineeredGarments2022: { houses: ['keen', 'engineeredGarments'], year: 2022 },
  keenEngineeredGarments2024: { houses: ['keen', 'engineeredGarments'], year: 2024 },
  keenEngineeredGarments2025: { houses: ['keen', 'engineeredGarments'], year: 2025 },
  keenHyke2023: { houses: ['keen', 'hyke'], year: 2023 },
  keenGramicci2024: { houses: ['keen', 'gramicci'], year: 2024 },
  keenGramicci2025: { houses: ['keen', 'gramicci'], year: 2025 },
  keenNHoolywood2026: { houses: ['keen', 'nHoolywood'], year: 2026 },
  keenHenrikVibskov2026: { houses: ['keen', 'henrikVibskov'], year: 2026 },
  keenOpenYy2026: { houses: ['keen', 'openYy'], year: 2026 },
  keenEighteenEast2026: { houses: ['keen', 'eighteenEast'], year: 2026 },
  keenEtudesStudio2025: { houses: ['keen', 'etudesStudio'], year: 2025 },
  keenBeams2021: { houses: ['keen', 'beams'], year: 2021 },
  neighborhoodBape2004: { houses: ['neighborhood', 'bape'], year: 2004 },
  neighborhoodBape2017: { houses: ['neighborhood', 'bape'], year: 2017 },
  neighborhoodBape2019: { houses: ['neighborhood', 'bape'], year: 2019 },
  neighborhoodAdidas2005: { houses: ['neighborhood', 'adidas'], year: 2005 },
  lukerAdidas2010: { houses: ['luker', 'adidas'], year: 2010 },
  neighborhoodAdidas2014: { houses: ['neighborhood', 'adidas'], year: 2014 },
  neighborhoodBapeAdidas2017: { houses: ['neighborhood', 'bape', 'adidas'], year: 2017 },
  neighborhoodAdidas2018: { houses: ['neighborhood', 'adidas'], year: 2018 },
  neighborhoodBapeAdidas2019: { houses: ['neighborhood', 'bape', 'adidas'], year: 2019 },
  neighborhoodAdidas2024: { houses: ['neighborhood', 'adidas'], year: 2024 },
  neighborhoodSupreme2006: { houses: ['neighborhood', 'supreme'], year: 2006 },
  neighborhoodStussy2008: { houses: ['neighborhood', 'stussy'], year: 2008 },
  neighborhoodStussy2010: { houses: ['neighborhood', 'stussy'], year: 2010 },
  neighborhoodWtaps2018: { houses: ['neighborhood', 'wtaps'], year: 2018 },
  neighborhoodWtaps2020: { houses: ['neighborhood', 'wtaps'], year: 2020 },
  neighborhoodConverse2017: { houses: ['neighborhood', 'converse'], year: 2017 },
  neighborhoodConverse2019: { houses: ['neighborhood', 'converse'], year: 2019 },
  neighborhoodVans2017: { houses: ['neighborhood', 'vans'], year: 2017 },
  neighborhoodVans2025: { houses: ['neighborhood', 'vans'], year: 2025 },
  neighborhoodDrMartens2018: { houses: ['neighborhood', 'drMartens'], year: 2018 },
  neighborhoodClarks2024: { houses: ['neighborhood', 'clarks'], year: 2024 },
  neighborhoodTeva2017: { houses: ['neighborhood', 'teva'], year: 2017 },
  neighborhoodUgg2019: { houses: ['neighborhood', 'ugg'], year: 2019 },
  neighborhoodDanner2020: { houses: ['neighborhood', 'danner'], year: 2020 },
  neighborhoodDanner2023: { houses: ['neighborhood', 'danner'], year: 2023 },
  neighborhoodPorter2010: { houses: ['neighborhood', 'porterYoshida'], year: 2010 },
  neighborhoodPorter2011: { houses: ['neighborhood', 'porterYoshida'], year: 2011 },
  neighborhoodPorter2012: { houses: ['neighborhood', 'porterYoshida'], year: 2012 },
  neighborhoodPorter2016: { houses: ['neighborhood', 'porterYoshida'], year: 2016 },
  neighborhoodPorter2018: { houses: ['neighborhood', 'porterYoshida'], year: 2018 },
  neighborhoodPorter2020: { houses: ['neighborhood', 'porterYoshida'], year: 2020 },
  neighborhoodBillionaireBoysClub2019: { houses: ['neighborhood', 'billionaireBoysClub'], year: 2019 },
  neighborhoodDickies2023: { houses: ['neighborhood', 'dickies'], year: 2023 },
  neighborhoodDickies2024: { houses: ['neighborhood', 'dickies'], year: 2024 },
  neighborhoodBountyHunterRussellAthletic2025: { houses: ['neighborhood', 'bountyHunter', 'russellAthletic'], year: 2025 },
  neighborhoodClot2025: {
    houses: ['neighborhood', 'clot'], year: 2025,
    sources: ['https://hypebeast.com/2025/11/clot-neighborhood-fall-winter-new-2025-collaboration-release-info'],
  },
  neighborhoodY32025: { houses: ['neighborhood', 'y3'], year: 2025 },
  neighborhoodYohjiYamamotoPourHomme2025: { houses: ['neighborhood', 'yohjiYamamotoPourHomme'], year: 2025 },
  neighborhoodAgnesB2026: { houses: ['neighborhood', 'agnesB'], year: 2026 },
  eastpakRafSimonsLabel2008: { houses: ['eastpak', 'rafSimonsLabel'], year: 2008 },
  eastpakRafSimonsLabel2009: { houses: ['eastpak', 'rafSimonsLabel'], year: 2009 },
  eastpakRafSimonsLabel2018: { houses: ['eastpak', 'rafSimonsLabel'], year: 2018 },
  eastpakRafSimonsLabel2019: { houses: ['eastpak', 'rafSimonsLabel'], year: 2019 },
  eastpakRafSimonsLabel2020: { houses: ['eastpak', 'rafSimonsLabel'], year: 2020 },
  eastpakDrkshdw2009: { houses: ['eastpak', 'drkshdw'], year: 2009 },
  eastpakJeanPaulGaultier2014: { houses: ['eastpak', 'jeanPaulGaultier'], year: 2014 },
  eastpakJeanPaulGaultier2015: { houses: ['eastpak', 'jeanPaulGaultier'], year: 2015 },
  eastpakVetements2017: { houses: ['eastpak', 'vetements'], year: 2017 },
  eastpakApc2013: { houses: ['eastpak', 'apc'], year: 2013 },
  eastpakVivienneWestwood2020: { houses: ['eastpak', 'vivienneWestwood'], year: 2020 },
  eastpakVivienneWestwood2023: { houses: ['eastpak', 'vivienneWestwood'], year: 2023 },
  eastpakUndercover2021: { houses: ['eastpak', 'undercover'], year: 2021 },
  eastpakUndercover2022: { houses: ['eastpak', 'undercover'], year: 2022 },
  eastpakUndercover2023: { houses: ['eastpak', 'undercover'], year: 2023 },
  eastpakTelfar2022: { houses: ['eastpak', 'telfar'], year: 2022 },
  eastpakAColdWall2022: { houses: ['eastpak', 'aColdWall'], year: 2022 },
  eastpakAderError2022: { houses: ['eastpak', 'aderError'], year: 2022 },
  eastpakAries2021: { houses: ['eastpak', 'aries'], year: 2021 },
  eastpakPleasures2021: { houses: ['eastpak', 'pleasures'], year: 2021 },
  eastpakSamsoeSamsoe2021: { houses: ['eastpak', 'samsoeSamsoe'], year: 2021 },
  eastpakMaisonKitsune2017: { houses: ['eastpak', 'maisonKitsune'], year: 2017 },
  eastpakBeams2016: { houses: ['eastpak', 'beams'], year: 2016 },
  eastpakMsgm2014: { houses: ['eastpak', 'msgm'], year: 2014 },
  eastpakWalterVanBeirendonck2014: { houses: ['eastpak', 'walterVanBeirendonck'], year: 2014 },
  eastpakManoloBlahnik2014: { houses: ['eastpak', 'manoloBlahnik'], year: 2014 },
  eastpakHenrikVibskov2014: { houses: ['eastpak', 'henrikVibskov'], year: 2014 },
  eastpakChristopherShannon2014: { houses: ['eastpak', 'christopherShannon'], year: 2014 },
  eastpakAvavav2024: { houses: ['eastpak', 'avavav'], year: 2024 },
  eastpakCourreges2014: { houses: ['eastpak', 'courreges'], year: 2014 },
  eastpakDiesel2025: { houses: ['eastpak', 'diesel'], year: 2025 },
  eastpakCraigGreen2025: { houses: ['eastpak', 'craigGreen'], year: 2025 },
  eastpakEgonlab2026: { houses: ['eastpak', 'egonlab'], year: 2026 },
  eastpakEssentials2026: { houses: ['eastpak', 'essentials'], year: 2026 },
  rafSimonsEastpak2013: { houses: ['rafSimonsLabel', 'eastpak'], year: 2013 },
  rafSimonsFredPerry2008: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2008 },
  rafSimonsFredPerry2009: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2009 },
  rafSimonsFredPerry2010: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2010 },
  rafSimonsFredPerry2011: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2011 },
  rafSimonsFredPerry2013: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2013 },
  rafSimonsFredPerry2014: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2014 },
  rafSimonsFredPerry2015: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2015 },
  rafSimonsFredPerry2016: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2016 },
  rafSimonsFredPerry2017: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2017 },
  rafSimonsFredPerry2018: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2018 },
  rafSimonsFredPerry2019: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2019 },
  rafSimonsFredPerry2020: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2020 },
  rafSimonsFredPerry2021: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2021 },
  rafSimonsFredPerry2022: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2022 },
  rafSimonsFredPerry2023: { houses: ['rafSimonsLabel', 'fredPerry'], year: 2023 },
  rafSimonsLindaFarrow2008: { houses: ['rafSimonsLabel', 'lindaFarrow'], year: 2008 },
  rafSimonsAsics2009: { houses: ['rafSimonsLabel', 'asics'], year: 2009 },
  rafSimonsDrMartens2009: { houses: ['rafSimonsLabel', 'drMartens'], year: 2009 },
  rafSimonsDrMartens2020: { houses: ['rafSimonsLabel', 'drMartens'], year: 2020 },
  rafSimonsAdidas2014: { houses: ['rafSimonsLabel', 'adidas'], year: 2014 },
  rafSimonsAdidas2015: { houses: ['rafSimonsLabel', 'adidas'], year: 2015 },
  rafSimonsAdidas2016: { houses: ['rafSimonsLabel', 'adidas'], year: 2016 },
  rafSimonsAdidas2017: { houses: ['rafSimonsLabel', 'adidas'], year: 2017 },
  rafSimonsAdidas2018: { houses: ['rafSimonsLabel', 'adidas'], year: 2018 },
  rafSimonsAdidas2019: { houses: ['rafSimonsLabel', 'adidas'], year: 2019 },
  rafSimonsTempla2019: { houses: ['rafSimonsLabel', 'templa'], year: 2019 },
  craigGreenBjornBorg2016: { houses: ['craigGreen', 'bjornBorg'], year: 2016 },
  craigGreenMoncler2018: { houses: ['craigGreen', 'moncler'], year: 2018 },
  craigGreenMoncler2019: { houses: ['craigGreen', 'moncler'], year: 2019 },
  craigGreenMoncler2020: { houses: ['craigGreen', 'moncler'], year: 2020 },
  craigGreenMoncler2021: { houses: ['craigGreen', 'moncler'], year: 2021 },
  craigGreenMoncler2022: { houses: ['craigGreen', 'moncler'], year: 2022 },
  craigGreenGrenson2018: { houses: ['craigGreen', 'grenson'], year: 2018 },
  craigGreenGrenson2019: { houses: ['craigGreen', 'grenson'], year: 2019 },
  craigGreenGrenson2020: { houses: ['craigGreen', 'grenson'], year: 2020 },
  craigGreenGrenson2021: { houses: ['craigGreen', 'grenson'], year: 2021 },
  craigGreenGrenson2025: { houses: ['craigGreen', 'grenson'], year: 2025 },
  craigGreenGrenson2026: { houses: ['craigGreen', 'grenson'], year: 2026 },
  craigGreenAdidas2021: { houses: ['craigGreen', 'adidas'], year: 2021 },
  craigGreenAdidas2022: { houses: ['craigGreen', 'adidas'], year: 2022 },
  craigGreenAdidas2023: { houses: ['craigGreen', 'adidas'], year: 2023 },
  craigGreenAdidas2024: { houses: ['craigGreen', 'adidas'], year: 2024 },
  craigGreenChampion2020: { houses: ['craigGreen', 'champion'], year: 2020 },
  craigGreenFredPerry2024: { houses: ['craigGreen', 'fredPerry'], year: 2024 },
  craigGreenFredPerry2025: { houses: ['craigGreen', 'fredPerry'], year: 2025 },
  craigGreenFredPerry2026: { houses: ['craigGreen', 'fredPerry'], year: 2026 },
  craigGreenEcco2025: { houses: ['craigGreen', 'ecco'], year: 2025 },
  craigGreenEcco2026: { houses: ['craigGreen', 'ecco'], year: 2026 },
  pendletonVans2008: { houses: ['pendleton', 'vans'], year: 2008 },
  pendletonOpeningCeremony2009: { houses: ['pendleton', 'openingCeremony'], year: 2009 },
  pendletonLevis2010: { houses: ['pendleton', 'levis'], year: 2010 },
  pendletonJunyaWatanabeMan2010: { houses: ['pendleton', 'junyaWatanabeMan'], year: 2010 },
  pendletonNike2013: { houses: ['pendleton', 'nike'], year: 2013 },
  pendletonHurley2009: { houses: ['pendleton', 'hurley'], year: 2009 },
  pendletonHurley2010: { houses: ['pendleton', 'hurley'], year: 2010 },
  pendletonGap2016: { houses: ['pendleton', 'gap'], year: 2016 },
  pendletonOneill2014: { houses: ['pendleton', 'oneill'], year: 2014 },
  pendletonCalvinKlein2018: { houses: ['pendleton', 'calvinKlein'], year: 2018 },
  pendletonSnowPeak2018: { houses: ['pendleton', 'snowPeak'], year: 2018 },
  pendletonSnowPeak2024: { houses: ['pendleton', 'snowPeak'], year: 2024 },
  pendletonKith2020: { houses: ['pendleton', 'kith'], year: 2020 },
  pendletonReigningChamp2022: { houses: ['pendleton', 'reigningChamp'], year: 2022 },
  pendletonBape2023: { houses: ['pendleton', 'bape'], year: 2023 },
  pendletonMaisonMargiela2023: { houses: ['pendleton', 'maisonMargiela'], year: 2023 },
  pendletonTommyHilfiger2023: { houses: ['pendleton', 'tommyHilfiger'], year: 2023 },
  pendletonBirdwell2024: { houses: ['pendleton', 'birdwell'], year: 2024 },
  pendletonHenderScheme2024: { houses: ['pendleton', 'henderScheme'], year: 2024 },
  pendletonWackoMaria2025: { houses: ['pendleton', 'wackoMaria'], year: 2025 },
  pendletonYohjiYamamotoPourHomme2025: { houses: ['pendleton', 'yohjiYamamotoPourHomme'], year: 2025 },
  pendletonCrocs2026: { houses: ['pendleton', 'crocs'], year: 2026 },
  pendletonNeedles2026: { houses: ['pendleton', 'needles'], year: 2026 },
  pumaJilSander1998: { houses: ['puma', 'jilSander'], year: 1998 },
  pumaJilSander2025: { houses: ['puma', 'jilSander'], year: 2025 },
  pumaJilSander2026: { houses: ['puma', 'jilSander'], year: 2026 },
  pumaJilSander2026SecondRelease: { houses: ['puma', 'jilSander'], year: 2026 },
  pumaAlexanderMcQueen2006: { houses: ['puma', 'alexanderMcQueen'], year: 2006 },
  pumaMiharaYasuhiro2000: { houses: ['puma', 'maisonMiharaYasuhiro'], year: 2000 },
  pumaAmiParis2022: { houses: ['puma', 'amiParis'], year: 2022 },
  pumaAmiParis2022SecondRelease: { houses: ['puma', 'amiParis'], year: 2022 },
  pumaMaisonKitsune2021: { houses: ['puma', 'maisonKitsune'], year: 2021 },
  pumaMaisonKitsune2021SecondRelease: { houses: ['puma', 'maisonKitsune'], year: 2021 },
  pumaOttolinger2023: { houses: ['puma', 'ottolinger'], year: 2023 },
  pumaOttolinger2024: { houses: ['puma', 'ottolinger'], year: 2024 },
  pumaHeliotEmil2024: { houses: ['puma', 'heliotEmil'], year: 2024 },
  pumaKidSuper2020: { houses: ['puma', 'kidSuper'], year: 2020 },
  pumaKidSuper2021: { houses: ['puma', 'kidSuper'], year: 2021 },
  pumaKidSuper2024: { houses: ['puma', 'kidSuper'], year: 2024 },
  pumaButterGoods2021: { houses: ['puma', 'butterGoods'], year: 2021 },
  pumaButterGoods2022: { houses: ['puma', 'butterGoods'], year: 2022 },
  pumaTheHundreds2020: { houses: ['puma', 'theHundreds'], year: 2020 },
  pumaLibertyLondon2022: { houses: ['puma', 'libertyLondon'], year: 2022 },
  pumaMadhappy2025: { houses: ['puma', 'madhappy'], year: 2025 },
  pumaMadhappy2026: { houses: ['puma', 'madhappy'], year: 2026 },
  pumaNahmias2026: { houses: ['puma', 'nahmias'], year: 2026 },
  pumaAhluwalia2025: { houses: ['puma', 'ahluwalia'], year: 2025 },
  pumaAhluwalia2026: { houses: ['puma', 'ahluwalia'], year: 2026 },
  pumaAderError2018: { houses: ['puma', 'aderError'], year: 2018 },
  pumaAderError2019: { houses: ['puma', 'aderError'], year: 2019 },
  pumaPleasures2023: { houses: ['puma', 'pleasures'], year: 2023 },
  pumaPleasures2024: { houses: ['puma', 'pleasures'], year: 2024 },
  pumaNoah2023: { houses: ['puma', 'noah'], year: 2023 },
  pumaNanamica2023: { houses: ['puma', 'nanamica'], year: 2023 },
  pumaJjjjound2023: { houses: ['puma', 'jjjjound'], year: 2023 },
  pumaKoche2023: { houses: ['puma', 'koche'], year: 2023 },
  pumaJuunJ2023: { houses: ['puma', 'juunJ'], year: 2023 },
  pumaPalomoSpain2023: { houses: ['puma', 'palomoSpain'], year: 2023 },
  underArmourMarineSerre2026: { houses: ['underArmour', 'marineSerre'], year: 2026 },
  underArmourFengChenWang2026: {
    houses: ['underArmour', 'fengChenWang'], year: 2026,
    sources: ['https://about.underarmour.com/en/stories/2026/10/under-armour-and-feng-chen-wang-bring-rebel-daughter-to-china---.html'],
  },
  elieSaabHm2026: {
    houses: ['elieSaab', 'hm'], year: 2026,
    sources: ['https://hmgroup.com/news/announcing-elie-saab-hm-a-celebration-of-glamour-and-timeless-elegance/'],
  },
  hedMaynerReebok2023: {
    houses: ['hedMayner', 'reebok'], year: 2023,
    sources: ['https://www.stadiumgoods.com/blogs/news/introducing-reebok-ltd-luxury-sneakers'],
  },
  hedMaynerReebok2024: {
    houses: ['hedMayner', 'reebok'], year: 2024,
    sources: ['https://www.sivasdescalzo.com/us/p/hed-mayner-classic-leather-rmia041c99lea0025200'],
  },
  hedMaynerReebok2024Blacktop: {
    houses: ['hedMayner', 'reebok'], year: 2024,
    sources: ['https://goodwoodkobe.jp/blogs/news/590495449341'],
  },
  hedMaynerReebok2025: {
    houses: ['hedMayner', 'reebok'], year: 2025,
    sources: ['https://www.goat.com/sneakers/hed-mayner-x-bb-5600-ltd-cut-mixed-black-100236606'],
  },
  hedMaynerReebok2026: {
    houses: ['hedMayner', 'reebok'], year: 2026,
    sources: ['https://www.thenewsmarket.com/news/reebok-reunites-with-hed-mayner-for-a-luxe-take-on-the-iconic-workout-plus-og/s/aadbf667-cbdf-44fe-89e9-7a2b53218a96'],
  },
  smartwoolAltra2024: {
    houses: ['smartwool', 'altra'], year: 2024,
    sources: ['https://www.backbone.media/newsroom/smartwool-teams-up-with-altra-to-launch-a-limited-edition-cold-weather-run-collection'],
  },
  smartwoolWestonNativesOutdoors2022: {
    houses: ['smartwool', 'weston', 'nativesOutdoors'], year: 2022,
    sources: ['https://www.natives-outdoors.org/blog/weston-smartwool-nativesoutdoors', 'https://www.spokeandblossom.com/stories/2022/12/29/art-under-your-feet-the-graphics-behind-colorado-based-skis-snowboards'],
  },
  leeJCrew2026: {
    houses: ['lee', 'jCrew'], year: 2026,
    sources: ['https://www.kontoorbrands.com/news-media/press-release/225/j-crew-and-lee-announce-first-ever-collaboration-rooted'],
  },
  leePaulSmith2025: {
    houses: ['lee', 'paulSmith'], year: 2025,
    sources: ['https://www.kontoorbrands.com/news-media/feature-story/40062/lee-and-paul-smith-debut-new-global-capsule-collection'],
  },
  leeAlphaIndustries2024: {
    houses: ['lee', 'alphaIndustries'], year: 2024,
    sources: ['https://d1io3yog0oux5.cloudfront.net/_31da635dad4c3cd5d2faad4131bea342/kontoorbrands/news/2024-11-14_A_New_Lee_and_Alpha_Industries_Collaboration_189.pdf'],
  },
  leeStutterheim2024: {
    houses: ['lee', 'stutterheim'], year: 2024,
    sources: ['https://stutterheim.com/en-se/stutterheim-stories/collaboration-stutterheim-lee-jeans'],
  },
  leeFce2026: {
    houses: ['lee', 'fce'], year: 2026,
    sources: ['https://fce-store.com/journal/2026/10/16/674', 'https://qui.tokyo/news/2610-f-ce-x-lee'],
  },
  leeNigelCabourn2026: {
    houses: ['lee', 'nigelCabourn'], year: 2026,
    sources: ['https://www.cabourn.com/products/satou20260911'],
  },
  leeHm2021: {
    houses: ['lee', 'hm'], year: 2021,
    sources: ['https://www.prnewswire.com/news-releases/lee-x-hm-collaborating-for-the-next-generation-of-more-sustainable-denim-301222312.html'],
  },
  leeTheHundreds2021: {
    houses: ['lee', 'theHundreds'], year: 2021,
    sources: ['https://www.kontoorbrands.com/news-media/feature-story/12944/lee-and-the-hundreds-release-a-new-collaboration'],
  },
  leeTheHundreds2022: {
    houses: ['lee', 'theHundreds'], year: 2022,
    sources: ['https://www.kontoorbrands.com/news-media/press-release/121/lee-x-the-hundreds-launches-new-capsule-collection'],
  },
  leeSchott2022: {
    houses: ['lee', 'schott'], year: 2022,
    sources: ['https://folkr.fr/schott-lee-walk-in-par-87042/'],
  },
  leeSchott2024: {
    houses: ['lee', 'schott'], year: 2024,
    sources: ['https://schott-nyc.jp/feature/278.html'],
  },
  leeDiesel2023: {
    houses: ['lee', 'diesel'], year: 2023,
    sources: ['https://hypebeast.com/2023/12/diesel-lee-upcycled-denim-collaboration-release-info'],
  },
  leeDiesel2024: {
    houses: ['lee', 'diesel'], year: 2024,
    sources: ['https://www.fashiondive.com/news/diesel-loves-lee-launches-collection/709857/'],
  },
  leeDiesel2024December: {
    houses: ['lee', 'diesel'], year: 2024,
    sources: ['https://hypebeast.com/2024/12/diesel-x-lee-meets-in-the-middle-to-rework-unsold-stock-into-hybrid-jeans'],
  },
  leeAlife2020: {
    houses: ['lee', 'alife'], year: 2020,
    sources: ['https://fashionweekdaily.com/lee-and-alife-collab/'],
  },
  awakeNyAsics2019: {
    houses: ['awakeNy', 'asics'], year: 2019,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyAsics2020: {
    houses: ['awakeNy', 'asics'], year: 2020,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyAsics2021: {
    houses: ['awakeNy', 'asics'], year: 2021,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyAsics2022: {
    houses: ['awakeNy', 'asics'], year: 2022,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyAsics2023: {
    houses: ['awakeNy', 'asics'], year: 2023,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyReebok2021: {
    houses: ['awakeNy', 'reebok'], year: 2021,
    sources: ['https://sneakerbardetroit.com/awake-ny-reebok-classic-leather-club-c-release-date/'],
  },
  awakeNyMoncler2020: {
    houses: ['awakeNy', 'moncler'], year: 2020,
    sources: ['https://milled.com/roden-gray-cad/launch-moncler-x-awake-new-arrivals-craig-green-tPOnljYOtTigliJ3'],
  },
  awakeNyNewEra2020: {
    houses: ['awakeNy', 'newEra'], year: 2020,
    sources: ['https://hypebeast.com/2020/10/awake-ny-new-era-mets-yankees-collection-info'],
  },
  awakeNyNewEra2021: {
    houses: ['awakeNy', 'newEra'], year: 2021,
    sources: ['https://juicestore.com/blogs/editorial/awake-ny-ss21-spring-summer-2021-final-release'],
  },
  awakeNyLacoste2022: {
    houses: ['awakeNy', 'lacoste'], year: 2022,
    sources: ['https://corporate.lacoste.com/app/uploads/2022/01/PR-LACOSTE-X-AWAKE-ENG.pdf'],
  },
  awakeNyVans2023: {
    houses: ['awakeNy', 'vans'], year: 2023,
    sources: ['https://sneakernews.com/2023/01/04/awake-ny-vans-old-skool-2023-release-date/'],
  },
  awakeNyConverse2023: {
    houses: ['awakeNy', 'converse'], year: 2023,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyNanamica2022: {
    houses: ['awakeNy', 'nanamica'], year: 2022,
    sources: ['https://us.nanamica.com/blogs/journal/nanamica-x-awake-ny-announce-a-capsule-collection'],
  },
  awakeNyTommyJeans2023: {
    houses: ['awakeNy', 'tommyJeans'], year: 2023,
    sources: ['https://uptodate.tokyo/awake-ny-x-tommy-jeans-collection/'],
  },
  awakeNyJordanBrand2024: {
    houses: ['awakeNy', 'jordanBrand'], year: 2024,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyJordanBrand2025: {
    houses: ['awakeNy', 'jordanBrand'], year: 2025,
    sources: ['https://www.sneakerfreaker.com/features/awake-ny-footwear-colabs-history-explained'],
  },
  awakeNyJordanBrand2026: {
    houses: ['awakeNy', 'jordanBrand'], year: 2026,
    sources: ['https://www.sneakerfreaker.com/releases/awake-ny-x-air-jordan-6-price-buy-release-date'],
  },
  awakeNyLevis2024: {
    houses: ['awakeNy', 'levis'], year: 2024,
    sources: ['https://www.highsnobiety.com/p/awake-levis-collab-2024/'],
  },
  awakeNyDrMartens2024: {
    houses: ['awakeNy', 'drMartens'], year: 2024,
    sources: ['https://www.soleretriever.com/news/articles/awake-ny-dr-martens-lowell-pack-release-date-december-2024'],
  },
  awakeNyFortySeven2025: {
    houses: ['awakeNy', 'fortySeven'], year: 2025,
    sources: ['https://uptodate.tokyo/awake-ny-x-47/'],
  },
  awakeNyGap2026: {
    houses: ['awakeNy', 'gap'], year: 2026,
    sources: ['https://www.gapinc.com/en-ca/articles/2026/03/gap-and-awake-ny-announce-collaboration-rooted-in'],
  },
  awakeNyAlphaIndustries2026: {
    houses: ['awakeNy', 'alphaIndustries'], year: 2026,
    sources: ['https://alphaindustries.co.jp/blogs/collaborations/awake-ny'],
  },
  awakeNyMerrell2021: {
    houses: ['awakeNy', 'merrell'], year: 2021,
    sources: ['https://www.sneakerfreaker.com/releases/merrell-1trl-taps-awake-ny-for-a-jungle-moc'],
  },
  awakeNyCrocs2021: {
    houses: ['awakeNy', 'crocs'], year: 2021,
    sources: ['https://hypebeast.com/2021/11/awake-ny-crocs-collaboration-angelo-baque-release-info'],
  },
  awakeNyCrocs2022: {
    houses: ['awakeNy', 'crocs'], year: 2022,
    sources: ['https://hypebeast.com/2022/5/awake-ny-crocs-collaboration-release-infp'],
  },
  awakeNyGapFortySeven2026: {
    houses: ['awakeNy', 'gap', 'fortySeven'], year: 2026,
    sources: ['https://www.gapinc.com/en-ca/articles/2026/03/gap-and-awake-ny-announce-collaboration-rooted-in'],
  },
  perryEllisLevis1984: {
    houses: ['perryEllis', 'levis'], year: 1984,
    sources: ['https://www.perryellis.com/pages/about-us'],
  },
  bodegaConverse2007: {
    houses: ['bodega', 'converse'], year: 2007,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaSaucony2008: {
    houses: ['bodega', 'saucony'], year: 2008,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaSaucony2019: {
    houses: ['bodega', 'saucony'], year: 2019,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaSaucony2023: {
    houses: ['bodega', 'saucony'], year: 2023,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaSaucony2024: {
    houses: ['bodega', 'saucony'], year: 2024,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaReebok2008: {
    houses: ['bodega', 'reebok'], year: 2008,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaReebok2021: {
    houses: ['bodega', 'reebok'], year: 2021,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaReebok2022: {
    houses: ['bodega', 'reebok'], year: 2022,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaNewBalance2013: {
    houses: ['bodega', 'newBalance'], year: 2013,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaNewBalance2018: {
    houses: ['bodega', 'newBalance'], year: 2018,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaNewBalance2020: {
    houses: ['bodega', 'newBalance'], year: 2020,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaNewBalance2021: {
    houses: ['bodega', 'newBalance'], year: 2021,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaAsics2014: {
    houses: ['bodega', 'asics'], year: 2014,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaAdidas2021: {
    houses: ['bodega', 'adidas'], year: 2021,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaClarks2019: {
    houses: ['bodega', 'clarks'], year: 2019,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaClarks2022: {
    houses: ['bodega', 'clarks'], year: 2022,
    sources: ['https://www.sneakerfreaker.com/features/a-brief-history-of-bodega-collaborations'],
  },
  bodegaNewBalance574Legacy2022: {
    houses: ['bodega', 'newBalance'], year: 2022,
    sources: ['https://bdgastore.com/blogs/blogdega/a-closer-look-bodega-x-new-balance-574-legacy'],
  },
  bodegaNewBalance9060AgeOfDiscovery2022: {
    houses: ['bodega', 'newBalance'], year: 2022,
    sources: ['https://www.houyhnhnm.jp/en/news/663304/'],
  },
  bodegaNewBalance2023: {
    houses: ['bodega', 'newBalance'], year: 2023,
    sources: ['https://snkrdunk.com/en/magazine/2023/05/19/first-look-bodega-x-new-balance-610-the-trail-less-taken/'],
  },
  bodegaAsics2022: {
    houses: ['bodega', 'asics'], year: 2022,
    sources: ['https://www.sneakerfreaker.com/releases/bodega-x-asics-gel-mc-plus-spring-release-date'],
  },
  bodegaAsics2023: {
    houses: ['bodega', 'asics'], year: 2023,
    sources: ['https://www.sneakerfreaker.com/releases/bodega-asics-gel-nyc-after-hours-exclusive-first-look-price-buy-release-date'],
  },
  bodegaAsics2024: {
    houses: ['bodega', 'asics'], year: 2024,
    sources: ['https://bdgastore.com/blogs/upcoming-releases/bodega-x-asics-kayano-20-small-wins-add-up'],
  },
  bodegaNike2020: {
    houses: ['bodega', 'nike'], year: 2020,
    sources: ['https://sneakernews.com/2020/12/29/bodega-nike-dunk-high-legend-cz8125-200-release-date/'],
  },
  bodegaVans2023: {
    houses: ['bodega', 'vans'], year: 2023,
    sources: ['https://bdgastore.com/blogs/blogdega/editorial-bodega-x-vault-by-vans-mid-top-modern'],
  },
  bodegaSalomon2022: {
    houses: ['bodega', 'salomon'], year: 2022,
    sources: ['https://bdgastore.com/blogs/blogdega/a-closer-look-bodega-x-salomon-full-bleed'],
  },
  bodegaSalomon2025: {
    houses: ['bodega', 'salomon'], year: 2025,
    sources: ['https://sneakernews.com/2025/08/21/bodega-salomon-xt-4-l47848400/'],
  },
  bodegaHoka2023: {
    houses: ['bodega', 'hoka'], year: 2023,
    sources: ['https://ir.deckers.com/news-events/press-releases/detail/626/hoka-and-bodega-come-together-again-to-fuse-outdoor-performance-engineering-with-city-inspired-streetwear-design'],
  },
  bodegaCrocs2024: {
    houses: ['bodega', 'crocs'], year: 2024,
    sources: ['https://bdgastore.com/blogs/blogdega/behind-the-design-bodega-x-crocs-nict-tech-2-0'],
  },
  bodegaPuma2025: {
    houses: ['bodega', 'puma'], year: 2025,
    sources: ['https://bdgastore.com/blogs/blogdega/event-recap-bodega-x-puma-release-party'],
  },
  bodegaBeamsAdidas2023: {
    houses: ['bodega', 'beams', 'adidas'], year: 2023,
    sources: ['https://www.sneakerfreaker.com/releases/bodega-beams-adidas-capsule-price-buy-release-date'],
  },
  goshaRubchinskiyAdidas2017: {
    houses: ['goshaRubchinskiy', 'adidas'], year: 2017,
    sources: ['https://pausemag.co.uk/2017/07/gosha-rubchinskiy-x-adidas-is-finally-here/'],
  },
  goshaRubchinskiyAdidas2018Spring: {
    houses: ['goshaRubchinskiy', 'adidas'], year: 2018,
    sources: ['https://hypebeast.com/2018/1/raf-simons-gosha-rubchinskiy-adidas-release-details'],
  },
  goshaRubchinskiyAdidas2018Fall: {
    houses: ['goshaRubchinskiy', 'adidas'], year: 2018,
    sources: ['https://hypebae.com/2018/7/gosha-rubchinskiy-fall-winter-2018-burberry-adidas-collaboration-apparel-footwear-accessories'],
  },
  goshaRubchinskiyReebok2016PhaseOne: {
    houses: ['goshaRubchinskiy', 'reebok'], year: 2016,
    sources: ['https://www.goat.com/sneakers/gosha-rubchinskiy-x-phase-1-black-ar0903'],
  },
  goshaRubchinskiyReebok2016RedSpecial: {
    houses: ['goshaRubchinskiy', 'reebok'], year: 2016,
    sources: ['https://hypebeast.com/2016/9/gosha-rubchinskiy-reebok-paccbet-dsml-sneakers'],
  },
  goshaRubchinskiyVans2014: {
    houses: ['goshaRubchinskiy', 'vans'], year: 2014,
    sources: ['https://i-d.co/article/get-a-spring-in-your-step-with-gosha-rubchinskiy-x-vans/'],
  },
  goshaRubchinskiyVans2015Spring: {
    houses: ['goshaRubchinskiy', 'vans'], year: 2015,
    sources: ['https://i-d.co/article/get-a-spring-in-your-step-with-gosha-rubchinskiy-x-vans/'],
  },
  goshaRubchinskiyVans2015Fall: {
    houses: ['goshaRubchinskiy', 'vans'], year: 2015,
    sources: ['https://i-d.co/article/gosha-rubchinskiy-and-vans-continue-collaborations-for-fallwinter-15/'],
  },
  goshaRubchinskiyVans2016: {
    houses: ['goshaRubchinskiy', 'vans'], year: 2016,
    sources: ['https://theblueprint.ru/news/1241'],
  },
  goshaRubchinskiyCamper2014: {
    houses: ['goshaRubchinskiy', 'camper'], year: 2014,
    sources: ['https://www.highsnobiety.com/p/camper-interview-gosha-rubchinskiy/'],
  },
  goshaRubchinskiyFila2017: {
    houses: ['goshaRubchinskiy', 'fila'], year: 2017,
    sources: ['https://pausemag.co.uk/2017/01/where-to-buy-gosha-rubchinskiy-ss17-collection/'],
  },
  goshaRubchinskiyKappa2017: {
    houses: ['goshaRubchinskiy', 'kappa'], year: 2017,
    sources: ['https://pausemag.co.uk/2017/01/where-to-buy-gosha-rubchinskiy-ss17-collection/'],
  },
  goshaRubchinskiySergioTacchini2017: {
    houses: ['goshaRubchinskiy', 'sergioTacchini'], year: 2017,
    sources: ['https://hypebeast.com/2017/2/gosha-rubchinskiy-2017-spring-summer-second-drop-dsm'],
  },
  goshaRubchinskiySuperga2017: {
    houses: ['goshaRubchinskiy', 'superga'], year: 2017,
    sources: ['https://hypebeast.com/2017/2/gosha-rubchinskiy-2017-spring-summer-second-drop-dsm'],
  },
  goshaRubchinskiyRetrosuperfuture2017: {
    houses: ['goshaRubchinskiy', 'retrosuperfuture'], year: 2017,
    sources: ['https://pausemag.co.uk/2017/01/where-to-buy-gosha-rubchinskiy-ss17-collection/'],
  },
  goshaRubchinskiyBurberry2018Spring: {
    houses: ['goshaRubchinskiy', 'burberry'], year: 2018,
    sources: ['https://hypebeast.com/2018/1/raf-simons-gosha-rubchinskiy-adidas-release-details'],
  },
  goshaRubchinskiyBurberry2018Fall: {
    houses: ['goshaRubchinskiy', 'burberry'], year: 2018,
    sources: ['https://hypebae.com/2018/7/gosha-rubchinskiy-fall-winter-2018-burberry-adidas-collaboration-apparel-footwear-accessories'],
  },
  goshaRubchinskiyLevis2018: {
    houses: ['goshaRubchinskiy', 'levis'], year: 2018,
    sources: ['https://hypebeast.com/2018/9/gosha-rubchinskiy-fall-winter-2018-drop-3'],
  },
  goshaRubchinskiyDrMartens2018: {
    houses: ['goshaRubchinskiy', 'drMartens'], year: 2018,
    sources: ['https://hypebeast.com/2018/9/gosha-rubchinskiy-fall-winter-2018-drop-3'],
  },
  tilakHaven2023: {
    houses: ['tilak', 'haven'], year: 2023,
    sources: ['https://www.tilak.com/en/news/haven-x-tilak-1'],
  },
  tilakHaven2025: {
    houses: ['tilak', 'haven'], year: 2025,
    sources: ['https://havenshop.com/features/editorial/haven-tilak-winter-2025'],
  },
  tilakRoa2024: {
    houses: ['tilak', 'roa'], year: 2024,
    sources: ['https://www.tilak.com/en/news/roa-x-tilak-high-performing-outdoor-gear-celebrating-top-tier-craftsmanship'],
  },
  tilakSophnet2009: {
    houses: ['tilak', 'sophnet'], year: 2009,
    sources: ['https://hypebeast.com/2008/12/soph-10th-anniversary-tilak-x-sophnet-attack-jacket'],
  },
} satisfies Record<string, CollaborationData<HouseId>>;

export type CollaborationId = keyof typeof collaborations;
