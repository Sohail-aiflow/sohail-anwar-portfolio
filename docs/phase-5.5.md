# Phase 5.5 — Live Sanity activation and public-ID migration

The real Free project is `xc6vvvsv`, public dataset `production`. Both ignored
environment files are configured without API tokens. No application was deployed,
no webhook was configured, and no billing or permission settings were changed.

## Diagnosis and authorized remote operations

The owner-approved initial missing-only seed import created 32 documents while
preserving 12 internal records. Public queries returned only profile and homepage.
Equivalent authenticated queries returned all 32; CDN and direct API produced the
same discrepancy. The document types matched the schemas and GROQ filters.

The cause was dotted seed IDs: Sanity's fixed anonymous rules exclude subpaths.
The API omitted 30 records before the adapter ran. This was not a normalization,
draft, type-name, or caching error. See [IDs and paths](https://www.sanity.io/docs/content-lake/ids).

With explicit owner approval, `studio/migrate-public-ids.mjs --apply` created exactly
30 dot-free copies using one create-if-not-exists transaction. Existing documents
were never overwritten or deleted. IDs map as follows:

- `project.<slug>` → `project-<slug>`
- `skill.<category-icon>.<index>` → `skill-<category-icon>-<index>`
- `education.aptech` → `education-aptech`

The migration copies actual remote content, not potentially stale local seed facts.
It strips only revision/creation/update metadata and rewrites nested reference
targets through the ID mapping. All original content and all 44 original records,
including all 12 system revision IDs, were compared before/after and unchanged.
The snapshot contains no drafts or release versions. Destination conflicts and
unexpected documents abort before writes. A subsequent read-only rerun found zero
missing destinations and zero conflicts. Later legitimate edits to canonical
copies cause conflict checks to stop; the script will never overwrite those edits.

## Canonical editing and reads

The seed generator now produces 32 dot-free documents. Future `--missing` imports
skip the existing canonical IDs. The public GROQ query explicitly restricts reads
to dot-free published IDs, excluding archived originals even when authenticated.
Adapter identity protections recognize `project-<original-id>`.

Studio lists show canonical published documents and their drafts. Dotted legacy
originals and their drafts are excluded from normal lists. Canonical original
project slugs remain read-only, and slug uniqueness checks exclude archived
records. Archived originals still exist and could be accessed through tools or
direct document URLs; they are not deleted or made publicly readable.

## Live verification

Token-free published reads confirmed: profile 1, homepage 1, projects 4, skills 25,
education 1, total 32. Authenticated raw total is 74: original portfolio 32,
public copies 30, system records 12. No duplicate canonical project slugs exist.

The four routes remain `marketlink-team`, `car-rental-system`, `school-website-cms`,
and `marketlink-solo`. Team MarketLink preserves its three-member team, role
`Project Manager & Backend Developer`, and URL
`https://aptechmetrostargate.com:190/`. Verifying the stored URL is not a claim that
the external site is reachable; its existing unverified-access flag is retained.
Stacks, statuses, ownership, narrative fields, skills, and education are preserved.

The root production build loaded `.env.local` in explicit Sanity mode, completed
without missing-record warnings, and generated all four case-study HTML files.
The explicit live test fetches real public content and asserts adapter source
`sanity`, no fallback warnings, exact raw counts, slugs, and team metadata.
Run it with `VERIFY_LIVE_SANITY=1` and `npm.cmd run test`; ordinary offline test
runs skip that network-dependent test. Mocked content tests remain separate.

Final checks passed: root lint, root TypeScript, Studio TypeScript, repository
formatting, production build/static export, and **58 regression tests** with live
verification enabled (1.3 minutes). The suite includes 12 mocked/local content
tests, one real public CMS test, and the existing browser/export regressions.
All four exported case-study files exist. No Sanity API or credential environment
markers were found in public browser JavaScript. Missing genuine screenshots
remain intentional pending states rather than broken image links.

## Local changes and limitations

Changed: seed generator and seed NDJSON, public GROQ filter, adapter project ID
mapping, Studio lists and original-slug protections/uniqueness, content test IDs,
and root `test` script. Added migration script, opt-in live test, and this report.
The Studio environment loader fix from activation remains in place.

The owner completed the interactive edit/publish/restore test after migration.
Genuine asset uploads, external MarketLink reachability, and deployment remain
unverified. Known dependency advisories remain documented in Phase 5.
Publishing new changes still requires rebuilding and manually deploying the static
export in a later authorized task. No Phase 6 work was started.

## Final live publishing checkpoint

The owner edited canonical homepage `heroSupportingText` in Studio and published
`Phase 5.5 publishing check — temporary text.`. Real token-free reads returned the
exact temporary text; a live adapter test confirmed all 32 canonical records,
source `sanity`, and no fallback warnings. Generated homepage HTML subsequently
contained the exact temporary hero paragraph.

This test exposed persistent Next.js fetch caching: the first successful build
still exported the old text. A no-store experiment was incompatible with static
prerendering and was removed. The server-only Sanity client now uses the SDK's
typed `resolveFetch` option with `createNodeFetch` from `get-it/node`, bypassing
Next's data cache without making routes dynamic. The already installed Sanity
transport `get-it` is now a direct pinned dependency. No runtime backend was added.

The Studio browser crash was separately fixed by moving filesystem env loading
out of shared `environment.ts` into Node-only `sanity.cli.ts`. Browser config uses
Sanity's statically replaced public variables. Actual Chrome rendered the login
screen without runtime exceptions at `http://localhost:3333/`; that origin matches
the existing CORS entry. The owner subsequently confirmed both publications.

After the owner restored and published the original two-line value, token-free
API verification returned exactly:

```text
Practical software. Thoughtful interfaces.
A learning journey, made tangible.
```

A fresh CMS production build passed with no missing-content warnings. The rendered
hero contains the restored text, and all exported HTML/text/JavaScript files were
checked for absence of the temporary marker. All four case-study HTML files exist.
Authenticated final inspection confirms 74 total records, zero drafts and release
versions, all 32 canonical records matching the factual seed, and unchanged
revisions on all 30 archived originals and all 12 system records.

No automated remote writes were performed during the publishing checkpoint.
The owner made both edits and publications; restoration is complete.

Final restored-content checks passed: lint, root and Studio typechecks, formatting,
12 standalone content tests, fresh production export, and the full **58-test suite
with live verification enabled** (1.4 minutes). An additional real Chrome smoke
check visited the homepage and all four case studies with zero page runtime
errors. The live adapter test asserted no fallback warnings. Public JavaScript
contains none of the checked CMS API, credential-variable, or native-transport
markers. No unexpected CMS content changes or outstanding checkpoint blockers
were found. The existing dependency advisories and missing genuine assets remain
separate documented limitations.
