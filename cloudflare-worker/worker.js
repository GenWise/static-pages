// genwise.in - Tomorrow Makers hiring page
//
// Serves the GitHub Pages hiring page under the genwise.in domain, and gives the
// two roles short URLs for use in posts and messages.
//
//   genwise.in/tomorrow-makers  -> proxied from GitHub Pages (not an iframe, so the
//                                  page's own OG tags drive the LinkedIn preview and
//                                  #coach / #operations anchors actually scroll)
//   genwise.in/gtm-coach        -> /tomorrow-makers#coach
//   genwise.in/gtm-operations   -> /tomorrow-makers#operations
//
// Everything else on the zone falls through to WordPress untouched, including the
// existing /work-with-us page for the Summer Program.
//
// Page assets (logos) are absolute GitHub Pages URLs in the HTML, so only the one
// document path needs proxying.

const UPSTREAM = "https://genwise.github.io/static-pages/work-with-us.html";
const PAGE_PATH = "/tomorrow-makers";

const REDIRECTS = {
  "/gtm-coach": PAGE_PATH + "#coach",
  "/gtm-operations": PAGE_PATH + "#operations",
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

    if (path !== PAGE_PATH) {
      // not ours - let WordPress handle it
      return fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const upstream = await fetch(UPSTREAM, {
      method: request.method,
      cf: { cacheTtl: 300, cacheEverything: true },
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
    headers.set("cache-control", "public, max-age=300");
    headers.delete("x-github-request-id");

    return new Response(upstream.body, { status: 200, headers });
  },
};
