# GenWise Static Pages - Best Practices

## Architecture Pattern

**GitHub Pages + WordPress iframe = Best approach for complex web pages**

### Why This Pattern?

1. **Full design control**: Self-contained HTML with inline CSS/JS avoids WordPress theme conflicts
2. **No CSS stripping**: WordPress.com often strips custom CSS when HTML is posted directly
3. **Version control**: All changes tracked in Git
4. **Easy updates**: Edit → Push → Auto-deploy (no WordPress admin needed)
5. **Works across plans**: No need for WordPress Business plan ($300/yr) for custom CSS

### Architecture Flow

```
Figma Design
    ↓
Static HTML (tnp365.html) with embedded <style> and <script>
    ↓
GitHub Pages (https://genwise.github.io/static-pages/tnp365.html)
    ↓
WordPress iframe (genwise.in/tnp365)
```

## Update Workflow

### Making Content Changes

1. **Edit the correct file**: `/Users/rajeshpanchanathan/code/websites/static-pages/tnp365.html`
   - ⚠️ NOT `tnp365_complete.html` or `tnp365_body_only.html` (these are workspace files)

2. **Copy to index.html**:
   ```bash
   cd /Users/rajeshpanchanathan/code/websites/static-pages
   cp tnp365.html index.html
   ```

3. **Commit and push**:
   ```bash
   git add tnp365.html index.html
   git commit -m "Update TNP365 content: [describe changes]"
   git push origin master
   ```

4. **Verify deployment**: GitHub Pages auto-deploys in 1-2 minutes
   - Check: https://genwise.github.io/static-pages/tnp365.html
   - WordPress automatically shows updates via iframe

### One-Time WordPress Setup

If iframe is missing or broken, restore it:

```python
import requests

url = "https://public-api.wordpress.com/rest/v1.1/sites/genwise.in/posts/7841"
token = "pIdxrOstfkSNI4ENRtxLOVSS^@1*(HB!mLA4PaFbWRPndVZv@VM65CC4)Dfl%ubZ"

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

iframe_content = """<!-- wp:html -->
<iframe src="https://genwise.github.io/static-pages/tnp365.html"
        width="100%"
        height="3000px"
        frameborder="0"
        scrolling="auto"
        loading="lazy"
        title="GenWise Talent Nurturing Program 365"
        style="border: none; min-height: 3000px;">
</iframe>
<!-- /wp:html -->"""

response = requests.post(url, headers=headers, json={"content": iframe_content})
print(response.json()["URL"])
```

## Critical Don'ts

❌ **Never deploy HTML directly to WordPress** (loses styling, breaks design)
❌ **Never edit files outside static-pages/** (wrong workflow)
❌ **Never assume WordPress has CSS** (it doesn't, unless Business plan)

## File Structure

```
static-pages/
├── tnp365.html                      # Main landing page
├── tnp365-what-students-learn.html  # Science/Math tabs, competencies
├── tnp365-how-it-works.html         # Format, fees, FAQ
├── tnp365-mentors.html              # Science + Math mentor profiles
├── index.html                       # Copy of tnp365.html (GitHub Pages root)
├── HANDOVER.md                      # Session handover state
├── HISTORY.md                       # Change log
├── CLAUDE.md                        # This file
└── iframe-embed-code.html
```

## WordPress URLs
- https://genwise.in/tnp365/
- https://genwise.in/tnp365-what-students-learn/
- https://genwise.in/tnp365-how-it-works/
- https://genwise.in/tnp365-mentors/

## Testing Changes

1. **Local preview**: Open `tnp365.html` in browser
2. **GitHub Pages**: Wait 1-2 min after push, check genwise.github.io/static-pages/tnp365.html
3. **WordPress**: Check genwise.in/tnp365 (iframe should show GitHub Pages version)

## Troubleshooting

**Problem**: WordPress shows broken/unstyled content
**Solution**: Check if iframe is present. If not, redeploy iframe (see One-Time Setup above)

**Problem**: Changes not showing on WordPress
**Solution**:
1. Check GitHub Pages deployed (1-2 min delay)
2. Hard refresh browser (Cmd+Shift+R)
3. Verify iframe src URL is correct

**Problem**: Need to change iframe height
**Solution**: Update WordPress iframe height attribute (default: 3000px)

## Future Pages

Use this pattern for all complex GenWise web pages:
1. Create self-contained HTML in `static-pages/`
2. Push to GitHub
3. Embed via iframe in WordPress

**Benefits**: Fast iteration, full design control, no WordPress limitations.
