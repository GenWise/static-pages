# Static Pages - Session Handover

## Session Metadata
- Date: 2026-01-01 ~19:30 IST
- Duration: ~2.5 hours
- Thread Context: TNP365 polish - logos, photos, form integration

## Current Status
TNP365 website fully polished with real school logos, mentor photos from Instructor Photos folder, thinner nav bar, and Express Interest form with SMTP2GO email backend.

## Exact Position
- ✅ Mobile-first CSS verified (was already correct)
- ✅ School logos added (5 real + 1 placeholder for Sanskriti)
- ✅ Mentor photos from Instructor Photos folder (8 real + 4 initials placeholders)
- ✅ Nav bar thinned (64px → 44px)
- ✅ Express Interest form + SMTP2GO backend deployed
- ⏭️ Next: Get missing mentor photos (Dhanya K, Siddharth Bharath, Vidhya Govindan, Kanchana Suryakumar)

## Critical Context
1. Mentor photos source: `/Company Level/Mentor_Founders/Instructor Photos/` (NOT Mentors folder - that has profile cards with text)
2. Form backend runs on DO droplet at `https://tnp-form.genwise.in/tnp365-interest`
3. Emails sent to `tnp@genwise.in` via SMTP2GO API
4. Sanskriti The Gurukul logo not found - using CSS text placeholder
5. 4 mentors without photos use initials placeholders (DK, SB, VG, KS)

## Decisions Made
- **Decision:** Use Instructor Photos folder, not Mentors folder
  **Rationale:** Mentors folder contains profile cards with text overlay, not clean headshots

- **Decision:** Nav bar 44px height (from 64px)
  **Rationale:** User requested thinner to reduce visual clutter with WordPress dual-nav

- **Decision:** SMTP2GO API on DO droplet (not Formspree/third-party)
  **Rationale:** User requested SMTP2GO; reused existing tnp-form.genwise.in nginx config

## Backend Details (TNP365 Form)
- **Endpoint:** `POST https://tnp-form.genwise.in/tnp365-interest`
- **Service:** `/root/apps/tnp365-form/app.py` (Flask)
- **Systemd:** `tnp365-form.service` on port 5002
- **Nginx:** `/etc/nginx/sites-available/tnp-form` (was port 5020, updated to 5002)
- **API Key:** Uses `SMTP2GO_API_KEY` from systemd Environment
- **Sends to:** `tnp@genwise.in` from `rajesh@genwise.in`

## Files Modified This Session
- `tnp365.html` - Added logos, form, CSS for form styling
- `tnp365-mentors.html` - Added real mentor photos, initials placeholders
- `tnp365-what-students-learn.html` - Thinner nav
- `tnp365-how-it-works.html` - Thinner nav
- `images/schools/*` - 5 school logos
- `images/mentors/*` - 8 mentor photos

## Handover Prompt
"TNP365 website complete with form integration. Missing: 4 mentor photos (Dhanya K, Siddharth Bharath, Vidhya Govindan, Kanchana Suryakumar) and Sanskriti school logo. Backend at tnp-form.genwise.in sends to tnp@genwise.in. Next: source missing photos or keep placeholders."
