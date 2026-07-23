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

**Open (awaiting Siddharth):**
- Six content contradictions raised by email on 2026-07-23, incl. Operations Lead billed as
  both "Full-time" and "Consulting basis". Page should not be promoted until resolved.
- Both Google Forms appear to require a Google sign-in - needs confirming in an incognito
  window. If true it will suppress applications from the target candidate pool.

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
