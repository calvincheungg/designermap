# Brand and designer research workflow

Use this workflow whenever asked to research, add or correct a brand. Apply it
to each requested brand, including batches. An addition includes implementation
and validation; a research-only request does not authorize editing the dataset.
Follow the user's latest scope and the data conventions in `CLAUDE.md`.

## 1. Check the existing data

- Search `houses.ts`, `designers.ts` and `groups.ts` with `rg` for the name,
  aliases and likely spelling variants. Reuse existing IDs and profiles.
- Read the relevant entries and their sources before searching. Identify only
  missing, uncertain or potentially outdated facts. Do not re-research confirmed
  historical facts without a reason.
- Resolve the identity: label versus retailer, diffusion line, similarly named
  company or generic product term. Ask once if the name remains ambiguous;
  continue independent work on identifiable brands.
- Do not add retailers as brands or add retailer collaborations. Distinguish
  clothing labels that sell their own designs from multi-brand retailers.

## 2. Establish the brand

Start with the official about/history page and current company information.
Research these fields:

| Field | What to establish |
| --- | --- |
| Identity | Canonical display name, useful aliases, official website |
| Origins | Launch/founding year, individual founders or founding organization |
| Location | Current creative/operating base and country; distinguish the founding city, factory and holding-company address |
| Origin & history | If founded in a different city: `origin: { city, country }` plus `history` events, oldest first: each `moved` (ending at the current base; omit `year` when unsourced), each `acquired` by an owner (link `group`, or `buyer` text), spin-offs and renames. Mark inferred years `approximate: true`; the latest owner must match `parentGroup` |
| Ownership | Current global owner, acquisition completion, and any relevant regional licence/operator |
| Creative identity | Design approach, signature materials/products, collection coverage |
| Classification | Existing market tier, categories, 1–3 aesthetics and up to 4 primary product specialties |

**Origin check (do this for every history task, before searching):**

- Compare the founding place in *all* evidence against `city`/`country`. That
  includes the house's own `notes`, any user-supplied table, and each source.
  "British-origin", "founded in Lancashire" or a foreign founding country in the
  notes counts as evidence.
- If the founding place differs, `origin` is required. Use the most specific
  place sources support (town, else county/region, e.g. `Lancashire`) and add it
  to `cities.ts`. Never drop an origin because no exact town is given.
- A founding country that differs from `country` always means a relocation.
  So does an acquisition by an owner in another country, which often moves the
  brand to the buyer's base. Add a `moved` event (year omitted if unsourced) and
  report it; never conclude "no moves" from sources that simply don't mention one.
- When delegating research, give the agent the house's current notes and base,
  and ask it to report the founding place at the most specific level found,
  flagging any conflict with the existing notes.
- The dev console's research to-do list (`missingOrigins` in `validate.ts`)
  flags notes that say a brand was founded in a known city or US/Canadian state
  other than its base when no `origin` is recorded. Clear those after edits.

Write brand descriptions (`notes` in `houses.ts`) around what the brand is and
what it makes: clothing and accessory ranges, style, silhouettes, signature
pieces, materials and craft. Use concise, concrete language that helps readers
understand the clothes and creative identity. Include history when it explains
that identity. Keep corporate ownership, acquisitions, financing and business
structure secondary; use the dedicated ownership fields and sources for those
facts. Include business context in the description only when it is necessary to
understand the brand or distinguish it from another label. Avoid filling the
description with research-process commentary or lists of unverified business
details; report unresolved questions in the research summary instead.

Separate retail founding, label launch, incorporation, independence and relaunch
dates. Explain material differences in notes instead of silently choosing a date.
**Treat a brand currently on hiatus or paused as inactive: add its Ended year,
even when the hiatus was announced as temporary.** Record the verified year
operations stopped or paused in `closed`, just as for a shutdown; Properties
shows it as "Ended" beside `founded`. Check activity status for every brand
addition or correction. Verify the operational pause year rather than using an
announcement year or final runway presentation by default. Research a missing
pause year; if it remains unconfirmed, omit `closed` and report the gap rather
than inventing a date. If the brand has resumed activity, remove `closed` and
preserve its earlier pauses and relaunches in notes.
Judge market tier across core products and comparable existing brands, not one
expensive item, a collaboration or the owner's other labels. Treat tags as
editorial judgments rather than externally certified facts.

Verify ownership using the brand, owner portfolio, completed acquisition release
or current filing. A proposed purchase, stockist listing, distributor or regional
licence does not prove global ownership. Record regional relationships separately.
Do not invent a parent group for an independent or unverified business.

## 3. Research the people and creative succession

Identify all documented founders and the actual designers behind the brand.
Then check creative directors, artistic directors, head designers, sustained
co-designers and relevant line-specific leaders, including departures and returns.
Research creative roles first. Do not spend time building CEO or executive
histories unless requested; retain existing sourced business-leadership data.

For each relevant person, search their full name plus `biography`, `interview`,
`career`, `appointed`, `left`, and the brand name as needed. Establish:

- Preferred name/spelling and aliases; reuse their existing profile.
- Actual role and scope, including menswear/womenswear, accessories or a line.
- Start/end years, separate stints, and whether a role is demonstrably current.
- Prior and subsequent employment, apprenticeships, design-team roles and their
  own labels. Search existing houses first to find meaningful map connections.

Use official biographies, appointment/departure announcements and first-person
interviews. Reputable fashion reporting and specialist stockist interviews can
fill historical gaps. A founder is not automatically a creative director. Record
an assistant or leather designer as `Other` with the exact `roleDetail`, rather
than promoting them into creative succession. Do not infer dates from graduation,
a first runway show or an unrelated appointment.

Add confirmed employment at existing houses to `career`, even when dates are
unknown. If a connected house is missing, preserve the sourced context in notes;
do not recursively add every related brand unless the user requests expansion.
No one-off collaborations, capsules, endorsements, friendships, stockist
relationships or shared ownership as career entries or designer connections.
Record researched brand collaborations in `src/data/collaborations.ts` instead,
with at least two distinct existing house IDs and the release year. Each release
has its own stable ID, including repeat partnerships.
Do not generate descriptions for new collaborations or show collaboration
descriptions in the interface. Record participants and year; exact collection
names are not needed. The history links to a Google search for the brands and year.
An ongoing partnership requires evidence of a sustained creative role.

## Collaboration-only lookups

When asked only to find a brand's missing collaborations, skip sections 1–3 and
work in this order to keep searches cheap:

1. In one shell call, list the brand's existing records with
   `grep -n -A1 "'<houseId>'" src/data/collaborations.ts` and keep them as the
   "already recorded" list. Entries can span several lines (houses on one line,
   year on the next), so never match only one-line `houses … year` entries.
   In the same call, check `src/data/research-log.ts` for a `collabSearches`
   entry. If one exists with `complete: true`, the crawl in step 2 is
   **incremental**: read pages from page 1 only until you reach articles older
   than its `date` (usually 1–3 pages, so no parallel agents are needed). Tell
   the user it was searched before, and do a full crawl only if they ask for a
   refresh. If the entry has `complete: false`, resume from its `lastPage`.
   With `noArchive: true`, first check whether a Hypebeast tag exists now;
   if not, repeat only the web searches.
2. Find candidates from several angles. A single search favours recent,
   high-profile releases and misses a brand's early years.
   - **Full archive crawl (default, always do this first):** read every page
     of the brand's Hypebeast archive, `https://hypebeast.com/brands/<slug>`
     then `/page/2`, `/page/3`… until a page returns 404. Do not stop at a
     fixed page count; established brands run to 50–90 pages, back to ~2007.
     Split the page range across two or three parallel `web-fetch` agents
     (for example 1–25, 26–60, 61+), and have each report the last page that
     existed and its oldest article date, so you can confirm the crawl reached
     the end. If an agent stops early, resume it with SendMessage or start
     another one for the remaining pages. Ask each agent for one line per
     collaboration, `partner(s) | year | title snippet`, with
     retailer/store exclusives flagged.
   - Run archive-crawl `web-fetch` agents with `model: "haiku"`; use
     `model: "sonnet"` for history and career fact-checks.
   - **Second list source:** for Japanese brands, also read the Fashion Press
     collab list, `https://www.fashion-press.net/news/brand/<id>/collab` with
     every `?page=N`. Otherwise use the brand's own collab/news page or its
     Wikipedia page.
   - **Neutral search:** `"<Brand> x" collaboration` and `"x <Brand>"`. Do not
     put guessed partner names in this query; they steer results toward those
     partners.
   - **Early years:** one search such as `<Brand> collaboration <founding
     year>–<founding year + 5>`.
   - **Dataset reverse lookup:** list houses in the brand's city or scene
     (`grep -n "city: '<City>'" src/data/houses.ts`) and search
     `<Brand> <partner A> <partner B> …` for those likely partners. Local
     streetwear peers (for example Los Angeles labels) are the most often missed.
   Batch searches for several brands in the same turn. Use `extended` only when
   `standard` returns little.
3. Check every candidate partner against `houses.ts` in one shell loop before
   researching it further. Drop partners that aren't houses (artists,
   celebrities, retailers, non-fashion companies, sports clubs) and list them
   once in the summary. Do not add houses unless asked.
4. A collaboration's release year from search results or reputable coverage is
   enough. Open a page only when sources conflict or the year is missing.
   Never infer a year from an announcement or runway date alone.
5. Add one-line entries, `idPartnerYear: { houses: [...], year },`, before the
   closing `satisfies` line. Give repeat releases in one year distinct IDs (for
   example `Spring2026` and `Fall2026`). No names, notes or sources are needed.
   For archive bulk adds, record one entry per partner per year, plus separate
   entries for three-or-more-brand projects. Insert with a script that skips
   any (house set, year) already recorded, parsing whole multi-line entries.
6. Add or update the brand's entry in `collabSearches` in
   `src/data/research-log.ts` (keys in alphabetical order): today's `date`,
   `complete` (whether the crawl reached the archive's last page), and the
   `lastPage` and `oldestYear` the crawl reported. After an incremental crawl,
   update only `date`, keeping the earlier `lastPage` and `oldestYear`.
   Then run `npm run check && npm test` once after all brands are added.
7. In the summary, say which angles were searched and how far the archive
   crawl reached (last page, oldest year), so gaps are visible. List partners
   that aren't houses once, so the user can ask for them to be added. Never
   describe the list as complete: archive crawls read titles only.

## 4. Resolve evidence and uncertainty

- Batch independent searches. Open the relevant pages and read the supporting
  passages; search snippets alone are discovery aids for important claims.
- Prefer primary sources; use reputable secondary sources when primary history
  is unavailable. Search in the brand's native language when useful.
- Source URLs are optional internal metadata. Preserve existing research links,
  but new links need not be provided. Keep source links out of the interface and
  task summaries unless explicitly requested; continue verifying the facts.
- Check source dates against event dates. Verify current roles and ownership
  against recent evidence, rather than assuming an old announcement still holds.
- Resolve conflicting dates or spellings with the strongest evidence. Explain
  unresolved differences briefly; do not turn uncertainty into a precise fact.
- Omit unknown years. `end: null` means confirmed current; omitted `end` means
  unknown. Use `approximate: true` only for an evidence-based estimated year,
  never to disguise a guess. Leave unsupported optional fields empty/omitted.

Stop searching when the requested fields and material creative connections have
adequate support. Follow up on specific gaps or contradictions, not arbitrary
source counts or exhaustive executive biographies. Summarize remaining unknowns.

## 5. Implement and verify an addition

1. Add/update the house in `src/data/houses.ts` using the existing enums and
   stable camelCase ID. Add useful search aliases; keep canonical spelling.
2. Add/reuse people in `src/data/designers.ts`. House `founders` must reference
   profile IDs with `as const`; career facts live only in the person's profile.
   Use corporate-founder fields for organizations. Never duplicate succession
   lists or derived moves on the house.
3. Add a sourced current owner in `groups.ts` only when necessary. Add missing
   city coordinates in `cities.ts` and state/province metadata for US/Canadian
   cities. Regional names belong only in the expanded right-hand city menus.
4. Look up the brand's official website and Instagram for every brand you
   research. Record the website as a full URL and Instagram as the bare handle,
   only once verified as the brand's own (not a retailer, fan or reseller page).
   Every house keeps both fields: set `website` and `instagram` to `''` when the
   brand has none or it can't be verified. Set `logo` to `''` when unknown; do
   not invent asset paths or overwrite user-provided logos.
5. Review the resulting diff for duplicate people, unsupported dates, accidental
   collaboration links and unrelated changes. Run `npm run check && npm test`.
   Update any affected existing membership expectations. For data-only edits,
   existing validation is usually sufficient; add tests for new behavior only.
6. Report the brands/creative links added, any unresolved facts, and check results.
   Do not claim a complete history when evidence is partial.
