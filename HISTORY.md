# Documentation History - Static Pages

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
- Worker `genwise-tomorrow-makers`, source in `cloudflare-worker/`.
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
- `CLOUDFLARE_API_TOKEN` in `~/.env` was stale and failed outright. The working token is
  exported from `~/.zshrc` line 148, and a shell export beats `.env`. The two files held
  different values. Re-minted 2026-07-23 with Workers Scripts:Edit (account) and Workers
  Routes:Edit (zone genwise.in); `.env` updated, `.zshrc` still holds the old one.
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
