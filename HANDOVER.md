# Static Pages - Session Handover

## Session Metadata
- Date: 2026-01-01 ~17:00 IST
- Duration: ~1 hour
- Thread Context: TNP365 Figma redesign

## Current Status
TNP365 website redesigned from Figma export, deployed as 4 separate pages with WordPress iframe embeds. Placeholder images used for school logos and mentor photos.

## Exact Position
- ✅ Figma extraction and analysis
- ✅ 4 HTML pages created (main + 3 sub-pages)
- ✅ Git push to GitHub Pages
- ✅ WordPress iframe pages created (3 sub-pages)
- ⏭️ Next: Add real school logos and mentor photos

## Critical Context
1. Design is desktop-first (needs mobile-first verification)
2. School logos are placeholder divs ("Logo" text)
3. Mentor photos are emoji placeholders (👩‍🔬, 👨‍🏫, etc.)
4. 6 schools listed: Shiv Nadar, GEMS Dubai, Sri Kumarans, DAIS Mumbai, Fountainhead Surat, Sanskriti Guwahati
5. 14 mentors total: 7 Science + 7 Math (some overlap like Sukanya Sinha, Siddharth Bharath)

## Decisions Made
- **Decision:** Separate HTML files (Option B) over single scrollable page
  **Rationale:** User requested; matches original React routing structure; easier WordPress management

- **Decision:** Self-contained HTML with inline CSS/JS
  **Rationale:** WordPress iframe pattern requires no external dependencies

## Files Modified This Session
- `tnp365.html` - Complete redesign from Figma
- `tnp365-what-students-learn.html` - New file (Science/Math tabs)
- `tnp365-how-it-works.html` - New file (Format, fees, FAQ)
- `tnp365-mentors.html` - New file (7 Science + 7 Math mentors)
- `index.html` - Copy of tnp365.html

## WordPress Pages Created
- https://genwise.in/tnp365/ (existing, updated iframe)
- https://genwise.in/tnp365-what-students-learn/ (new)
- https://genwise.in/tnp365-how-it-works/ (new)
- https://genwise.in/tnp365-mentors/ (new)

## Next Steps for Next Thread
1. **Verify mobile-first:** Check if current CSS is mobile-first or needs refactoring
2. **School logos:** Check repo for existing logos, else web search for:
   - Shiv Nadar Schools
   - GEMS Modern Academy Dubai
   - Sri Kumarans Bengaluru
   - Dhirubhai Ambani International School Mumbai
   - Fountainhead School Surat
   - Sanskriti The Gurukul Guwahati
3. **Mentor photos:** Check `/Users/rajeshpanchanathan/Library/CloudStorage/GoogleDrive-rajesh@genwise.in/My Drive/Company Level/Mentor_Founders` subfolders for:
   - Sukanya Sinha, Radha Gopalan, Anusha Krishnan, Rupin Chheda, Dhanya K, Siddharth Bharath, Rachit Rawat (Science)
   - Utpal Chattopadhyay, Jayasree S, Vidhya Govindan, Saukhin Sarkar, Kanchana Suryakumar (Math)

## Handover Prompt
"Continue TNP365 website polish: (1) Verify mobile-first CSS or refactor, (2) Add school logos from repo or web search, (3) Add mentor photos from Google Drive path in HANDOVER.md. All 4 pages deployed at genwise.in/tnp365*. Read HANDOVER.md for mentor/school lists and file paths."
