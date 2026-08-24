# Documentation History - Static Pages

## 2026-08-17 ~15:45 IST
**Session:** Tomorrow Makers programme page; hiring page moved to /work-with-us

/tomorrow-makers had been serving the *hiring* page (work-with-us.html) since July —
there was no page describing the programme itself. Prompted by the IITM Pravartak
proposal (external parties need to see the Godrej work, not job ads).

- **tomorrow-makers.html** (new): programme page in the gifted-lab-in-schools design
  language — hero, Godrej/partner credit strip, why/how sections, three session
  vignettes from the opening-cohort design, facts box, hiring CTA. Content sourced
  from `genwiki/partners/godrej.md`; deliberately external-safe (no enrolment
  numbers, no compensation, no internal timelines).
- **Worker routes**: /tomorrow-makers → tomorrow-makers.html; /work-with-us (freed
  by the WordPress lapse — the old Summer Program hiring page died with it) →
  work-with-us.html; /gtm-coach and /gtm-operations now 301 to /work-with-us
  anchors. Old LinkedIn links to /tomorrow-makers land on the programme page, which
  carries a "We're hiring" button — acceptable.
- **work-with-us.html**: canonical + og:url updated to /work-with-us.
- **Homepage**: fourth Programs card (Tomorrow Makers, dsc01611.webp), intro sentence
  extended, footer Work-with-us row repointed. Cards grid stays 3-col → 3+1 layout.
**Session:** Homepage For Teachers link now visible on mobile

Vishnu reported (GWG, 16 Aug) no route to /for-teachers from genwise.in on his phone.
The 14 Aug fix had added the link to the desktop nav only: the homepage's mobile rule
hides every nav link except the Write-to-us button under 860px, and the homepage has
no hamburger. Fix: exempt that one link (`.nav-teachers` — the only off-page
destination; the rest are same-page anchors reachable by scrolling) and add a
sub-400px sizing rule (smaller logo/gaps/button) so logo + link + button fit down to
320px. Watch the specificity: the base `.btn-sm` rule sits *after* the media block,
so mobile overrides need `.nav-links .btn-sm`. Verified live at 320/390px emulated
widths; /for-teachers, /genai and /my-misconception-mentor mobile navs re-checked OK.
GWG told it's fixed.

## 2026-08-14 ~09:45 IST
**Session:** Teacher-mentoring pages restored; For Teachers family built

The /for-teachers, /genai and /my-misconception-mentor pages had silently dropped in
the 2026-08-01 WordPress lapse (the stopgap Worker only mapped 7 pages; everything
else 302'd home). Restored and then consolidated into a proper page family.

- **/for-teachers + /genai** rebuilt from `~/code/websites/wordpress-export-2026-08-01/`.
  The REST export strips `<style>/<script>/<form>/<iframe>` TAGS but keeps inner text;
  wp.com image URLs 403 since the lapse — all images now live in this repo under
  `images/teacher-mentoring/`.
- **/my-misconception-mentor** consolidated from the React SPA at
  misconception-mentor.pages.dev into a static family page (same design language).
  The SPA + its D1 chatbot DB are retirable. The mmm.genwise.in custom-domain idea
  was closed as moot. Gotcha: SPA tab content (Middle School topics) is not in a
  rendered DOM dump — had to be clicked out via chrome-devtools.
- **Family nav** (canonical for page families, copied from gifted-lab's): `← GenWise |
  For Teachers` + Overview / My Misconception Mentor / GenAI + navy Enquire CTA;
  hamburger under 768px. Active page = orange pill; CTA deliberately navy so the
  you-are-here marker and the action button don't look alike (Rajesh's call).
  The first-pass navs had links overflowing the bar at phone widths — the homepage
  nav pattern is NOT reusable on sub-pages (it hides all links on mobile).
- **Enquiry endpoint**: POST /api/enquiry on the Worker → SMTP2GO HTTPS API (secret
  set via `wrangler secret put SMTP2GO_API_KEY`). Forms on /for-teachers and MMM.
  **Leads go to rajesh@genwise.in only** (`ENQUIRY_TO` in worker.js) pending a
  routing decision.
- **Homepage nav** got a "For Teachers" link (only edit to Eklavya's page).
- /genai cohort dates neutralized to "To Be Announced" (Dec 2025 was stale);
  pricing ₹11,800 / AED 570 kept but unverified. **Rajesh owns GenAI** — dates wait
  on him.
- Follow-ups tracked in **issue #2** (redesign to new design language when a cohort
  is live; GenAI dates/pricing; lead routing).
- Verification gotcha: plain headless-Chrome `--window-size=375` clamps to a ~500px
  minimum and crops the screenshot — false overflow signal. Use chrome-devtools MCP
  `emulate` for real mobile viewports.
- Why this surfaced: after the lapse, Chrome had cached WordPress's 301
  genwise.in → ashish5fd091456a.wordpress.com; Rajesh's browser kept landing on the
  dead WP backend. "genwise.in doesn't load" → check incognito first, then clear cache.

## 2026-07-24 ~11:00 IST
**Session:** Siddharth's post-review edits to the hiring page

- Compensation figures removed from both roles (his call, 2026-07-24). The kicker
  strips, the fact grids, and both apply-button hints now say compensation is
  competitive for the role and experience level. No number appears anywhere.
- Applicant contact switched from siddharth@genwise.in to onlineprograms@genwise.in
  in the closing CTA, and reworded to cover people who cannot submit the form. Kept
  the existing WhatsApp number alongside it. **Someone has to actually monitor that
  mailbox** - it is now the only fallback for anyone the sign-in wall blocks.

**Sign-in wall - closed, not fixed.** Siddharth's decision: leave it. His reasoning
is that the CV upload forces sign-in regardless, and Android users have Google
accounts. The first half is correct. The residual risk he is accepting is the
applicant on a shared or school desktop with no session, and the school teacher who
has never had a CV as a file on a phone. The email fallback above is the mitigation.

**Hours mismatch - RESOLVED.** Siddharth rewrote the Operations form. It now says
"Full-time role", "Compensation depending on experience and capability", and the
Time & pay section describes workload varying across the year instead of naming an
hours figure. The ~25 hrs number was a leftover from when the role was Godrej-only;
combining Godrej with M3 makes it full-time. Verified against the page via the Forms
API - type, pay, start, duration, 60/40 split, 1-4 years, and languages all agree.

**Coach form - RESOLVED.** Siddharth checked and removed the Rs 8,000-10,000 stipend
figure. Page and both forms now agree: no compensation number is published anywhere.

**Nothing open on this page as of 2026-07-24.**

**Reading a form you do not own.** The Coach form could not be inspected from here.
Anonymous curl gets 401 (the sign-in wall), it is not in rajesh's Drive so the Forms
API has no ID to query, and both browser routes were unavailable (claude-in-chrome
extension not connected, Chrome not running with a remote debugging port). Note this
does NOT mean the form is unshared: Drive "shared with me" only lists explicit file
grants, and a link-accessible Google Form never appears there. Clicking Apply while
signed in opens it fine for a human. The Operations form was readable only because it
does sit in rajesh's Drive. To check a form like this, either get the file shared, or
open it in a signed-in browser.

**Short links were never communicated.** Siddharth asked for genwise.in/coach and
/operations; what shipped was /gtm-coach and /gtm-operations. The prefix reasoning is
sound but he was not told until 2026-07-24, a day after deployment and while he was
drafting ads against the paths he had requested. Tell the requester when a URL they
asked for changes.

**Correction to the note below:** an earlier version of the 2026-07-23 entry warned
that sharing genwise.in would break the LinkedIn preview. That applied to the iframe
approach we started with. The shipped Worker is a reverse proxy, so the page's own OG
tags are served under genwise.in and the preview is correct. genwise.in/tomorrow-makers
is the right link to share.

## 2026-07-23 ~18:40 IST
**Session:** Add work-with-us hiring page (GenWise x Godrej Tomorrow Makers)

**Files Created:**
+ `work-with-us.html` - Hiring page for Coach + Operations Lead roles (design by Siddharth)
+ `images/brand/genwise-logo.png` - Optimised header logo (225x60, 2 KB)
+ `images/brand/genwise-logo-reversed.png` - Optimised footer logo for dark bg (184x60, 2 KB)
+ `images/brand/work-with-us-og.png` - 1200x630 social preview card

**Technical Fixes Applied to Source HTML:**
- Added Open Graph + Twitter card tags. Source had none; page is intended for LinkedIn
  sharing, so previews rendered as a blank box.
- Contrast: brand orange `--flare` #f0842a is only 2.3:1 on light backgrounds and 2.6:1
  behind white text, both failing WCAG AA. Introduced `--flare-ink` #a94b00 for small
  orange text on paper/card (5.1:1); text sitting on an orange fill now uses `--abyss`
  (6.4:1) instead of white. Brand orange itself is unchanged as a fill and on dark
  backgrounds, where it already passes at 6.4:1.
- Logos were inlined as base64 (134 KB) but displayed at 30px tall. Extracted, resized to
  2x display size, quantised. Page went 203 KB -> 26.5 KB HTML + 4 KB images.
- Added canonical URL, favicon, theme-color, and explicit img width/height (avoids layout shift).

**Not Done:**
- UTM tagging on the apply links. Verified that `forms.gle` strips query parameters on
  redirect, so UTMs cannot survive to the form. Attribution needs either a "how did you
  hear about us" question in the form, or distinct redirect paths logged at the Cloudflare
  Worker. Flagged to Siddharth.

**Content Decisions (Siddharth, 2026-07-23):**
- Operations Lead is a full-time engagement hired on contract, not salaried employment.
  Now stated consistently: kicker "Full-time - contract", fact "Full-time, on contract",
  footer "A full-time engagement, contracted rather than salaried, paid monthly."
- Operations Lead starts Sept 2026 (was "Aug / Sep 2026"). Coach still starts Aug 2026.
- Dropped "a small group of" from the Coach one-liner - 30 students is not a small group.
- Grade 9-10 maths/science for a Std 6-7 cohort is intentional; it is a gifted programme.
  Left as written.
- Language: dropped Tamil/Telugu. Hindi and English fluency required; Marathi or another
  regional language a bonus. Marathi retained since sessions run in Hindi or Marathi.
- No deadline (not a paid campaign). Added "Applications are reviewed on a rolling basis,
  so earlier is better."

**Cloudflare Worker (deployed 2026-07-23 ~21:15 IST):**
- Worker `genwise-tomorrow-makers`, source in `GenWise/genwise-worker` (was `cloudflare-worker/` here until 2026-08-24).
- genwise.in/work-with-us was already taken by the Summer Program hiring page, so this
  page lives at genwise.in/tomorrow-makers instead. Summer Program page untouched.
- Reverse-proxy, NOT an iframe. This matters: with an iframe the page's OG tags never
  reach LinkedIn (the wrapper's tags win) and a #coach hash on the wrapper does not
  scroll the inner frame, so the short links would land at the top of the page.
- Short links are gtm- prefixed, not /coach: the Summer Program hires a "Residential
  Coach", so a bare /coach becomes ambiguous when summer hiring reopens ~November.
- Page assets use absolute GitHub Pages URLs so only the one document path is proxied.
- Worker caches upstream for 60s. After pushing to this repo, genwise.in can lag the
  github.io origin by up to a minute. Not a bug; just wait or purge.

**Gotchas hit:**
- Deploying this Worker needs a Cloudflare API token scoped Workers Scripts:Edit
  (account) and Workers Routes:Edit (zone genwise.in). Read it from the environment at
  deploy time; never write a token into a tracked file.
- If wrangler authenticates as a stale identity, look for a `CLOUDFLARE_API_TOKEN`
  exported by your shell profile: a shell export silently beats `.env`, so two config
  sources can hold different values and the stale one can be the one actually in effect.
  Reconcile them rather than guessing which is live.
- Account-owned tokens (cfat_ prefix) always fail `/user/tokens/verify` - that endpoint is
  user-token only. Test permissions against a real endpoint instead.
- Worker route patterns are literal: `/tomorrow-makers` does not match `/tomorrow-makers/`.
  Hence the `*` on that pattern.
- Newly created routes can 404 for ~10s before propagating.

**Open - CONFIRMED BLOCKER:**
- Both Google Forms require a Google sign-in. Verified 2026-07-23 in a clean headless
  Chrome profile: both forms.gle links land on "Sign in with your Google Account to
  continue to Google Forms", and the operations form's page title is literally
  "Google Forms: Sign-in". Neither form renders for an anonymous visitor.
  This is invisible to the form owner, whose own session always passes.
  Fix is in each form's Settings: turn off "Limit to 1 response" and any restriction to
  GenWise users. Until then every apply button on the page leads to a login wall.

## 2026-01-01 ~17:00 IST
**Session:** TNP365 Figma redesign and deployment

**Files Created:**
+ `tnp365.html` - Complete redesign from Figma export
+ `tnp365-what-students-learn.html` - Science/Math tabs, competencies, modules
+ `tnp365-how-it-works.html` - Format, schedule, trial, fees, full FAQ
+ `tnp365-mentors.html` - 7 Science + 7 Math mentor profiles

**HANDOVER.md Created:**
+ Initial handover with next steps for images
+ School logo list (6 schools)
+ Mentor list (14 mentors, 7 Science + 7 Math)

**WordPress Pages Created:**
+ genwise.in/tnp365-what-students-learn/
+ genwise.in/tnp365-how-it-works/
+ genwise.in/tnp365-mentors/

**Key Decisions:**
- Option B (separate files) chosen over Option A (single scrollable page)
- Self-contained HTML with inline CSS/JS for iframe compatibility
- Placeholder images used pending asset collection
