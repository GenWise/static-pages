// genwise.in - standalone pages proxied from GitHub Pages
//
// Serves self-contained GitHub Pages documents under the genwise.in domain (not an
// iframe, so each page's own OG tags drive link previews and #anchors actually scroll).
//
//   genwise.in/tomorrow-makers        -> work-with-us.html (hiring page)
//   genwise.in/gtm-coach              -> /tomorrow-makers#coach
//   genwise.in/gtm-operations         -> /tomorrow-makers#operations
//   genwise.in/gifted-lab-in-schools  -> gifted-lab-in-schools.html (B2B page)
//
// Everything else on the zone falls through to WordPress untouched, including the
// existing /work-with-us page for the Summer Program.
//
// Page assets (logos) are absolute GitHub Pages URLs in the HTML, so only the
// document paths need proxying.

const GHP = "https://genwise.github.io/static-pages";

const PAGES = {
  "/tomorrow-makers": GHP + "/work-with-us.html",
  "/gifted-lab-in-schools": GHP + "/gifted-lab-in-schools.html",
};

const REDIRECTS = {
  "/gtm-coach": "/tomorrow-makers#coach",
  "/gtm-operations": "/tomorrow-makers#operations",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // treat /foo and /foo/ as the same path
    const path = url.pathname.replace(/\/+$/, "") || "/";

    const target = REDIRECTS[path];
    if (target) {
      return Response.redirect(url.origin + target, 301);
    }

    const upstreamUrl = PAGES[path];
    if (!upstreamUrl) {
      // not ours - let WordPress handle it
      return fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      cf: { cacheTtl: 60, cacheEverything: true },
    });

    if (!upstream.ok) {
      // don't serve a GitHub 404 page under our own domain
      return new Response("This page is temporarily unavailable.", {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    const headers = new Headers(upstream.headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("cache-control", "public, max-age=60");
    headers.delete("x-github-request-id");

    return new Response(upstream.body, { status: 200, headers });
  },
};
