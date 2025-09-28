# GenWise Static Pages

This repository hosts static HTML pages for GenWise on GitHub Pages.

## TNP365 Landing Page

A complete landing page for the GenWise Talent Nurturing Program 365, converted from Figma design to a self-contained HTML page.

### Live URLs

- **Main page**: https://genwise.github.io/static-pages/
- **TNP365 specific**: https://genwise.github.io/static-pages/tnp365.html

### Features

- Fully responsive design optimized for all devices
- Complete course information with interactive elements
- Self-contained HTML with inline CSS and JavaScript
- No external dependencies (except for images from giftedworld.org)
- Interactive testimonials carousel
- Expandable learning examples accordion
- Working application form
- Professional styling matching GenWise brand

### WordPress Integration

Use the iframe embed codes in `iframe-embed-code.html` to embed this page in WordPress posts or pages.

Recommended embed code:
```html
<iframe src="https://genwise.github.io/static-pages/tnp365.html"
        width="100%"
        height="3000px"
        frameborder="0"
        scrolling="auto"
        loading="lazy"
        title="GenWise Talent Nurturing Program 365"
        style="border: none; min-height: 3000px;">
</iframe>
```

### File Structure

- `index.html` - Main landing page (identical to tnp365.html)
- `tnp365.html` - TNP365 specific page
- `iframe-embed-code.html` - Ready-to-use iframe embed codes
- `README.md` - This documentation

### Deployment

Pages are automatically deployed via GitHub Pages when changes are pushed to the master branch.