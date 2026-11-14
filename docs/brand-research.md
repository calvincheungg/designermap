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

## 2. Establish the brand

Start with the official about/history page and current company information.
Research these fields:

| Field | What to establish |
| --- | --- |
| Identity | Canonical display name, useful aliases, official website |
| Origins | Launch/founding year, individual founders or founding organization |
| Location | Current creative/operating base and country; distinguish the founding city, factory and holding-company address |
| Ownership | Current global owner, acquisition completion, and any relevant regional licence/operator |
| Creative identity | Design approach, signature materials/products, collection coverage |
| Classification | Existing market tier, categories, 1–3 aesthetics and up to 4 primary product specialties |

Separate retail founding, label launch, incorporation, independence and relaunch
dates. Explain material differences in notes instead of silently choosing a date.
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
An ongoing partnership requires evidence of a sustained creative role.

## 4. Resolve evidence and uncertainty

- Batch independent searches. Open the relevant pages and read the supporting
  passages; search snippets alone are discovery aids for important claims.
- Prefer primary sources; use reputable secondary sources when primary history
  is unavailable. Search in the brand's native language when useful.
- Save direct supporting URLs in house/person `sources`, and attach tenure
  sources to the relevant career entry. Reuse a source across supported facts.
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
4. Use verified official social handles. Set `instagram` and `logo` to `''`
   when unknown; do not invent asset paths or overwrite user-provided logos.
5. Review the resulting diff for duplicate people, unsupported dates, accidental
   collaboration links and unrelated changes. Run `npm run check && npm test`.
   Update any affected existing membership expectations. For data-only edits,
   existing validation is usually sufficient; add tests for new behavior only.
6. Report the brands/creative links added, any unresolved facts, and check results.
   Do not claim a complete history when evidence is partial.
