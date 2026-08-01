// genwise.in - full-site stopgap (2026-08-01)
//
// The WordPress.com subscription ended, so WordPress bounces every genwise.in
// request to a dead "Coming Soon" page. Until the new site is ready, this Worker
// owns the whole zone (route: genwise.in/*) and serves the pages we have from
// GitHub Pages:
//
//   /                                -> genwise-home.html (holding homepage)
//   /gifted-lab (+3 siblings)        -> the parent-facing Gifted Lab pages
//   /gifted-lab-in-schools           -> B2B page
//   /tomorrow-makers                 -> hiring page
//   /images/*                        -> page assets (mentor/school photos)
//   /tnp365* (old URLs)              -> 301 to the gifted-lab equivalents
//   /gtm-coach, /gtm-operations      -> 301 to /tomorrow-makers anchors
//   anything else                    -> 302 to / (temporary, new site coming)
//
// www.genwise.in is 301'd to the apex. When the new site takes over the domain,
// delete the genwise.in/* route (or repoint DNS) and trim this back down.

const GHP = "https://genwise.github.io/static-pages";

const PAGES = {
  "/": GHP + "/genwise-home.html",
  "/tomorrow-makers": GHP + "/work-with-us.html",
  "/gifted-lab": GHP + "/gifted-lab.html",
  "/gifted-lab-how-it-works": GHP + "/gifted-lab-how-it-works.html",
  "/gifted-lab-mentors": GHP + "/gifted-lab-mentors.html",
  "/gifted-lab-what-students-learn": GHP + "/gifted-lab-what-students-learn.html",
  "/gifted-lab-in-schools": GHP + "/gifted-lab-in-schools.html",
};

const REDIRECTS = {
  "/gtm-coach": "/tomorrow-makers#coach",
  "/gtm-operations": "/tomorrow-makers#operations",
  "/tnp365": "/gifted-lab",
  "/tnp365-how-it-works": "/gifted-lab-how-it-works",
  "/tnp365-mentors": "/gifted-lab-mentors",
  "/tnp365-what-students-learn": "/gifted-lab-what-students-learn",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "www.genwise.in") {
      return Response.redirect("https://genwise.in" + url.pathname + url.search, 301);
    }

    // treat /foo and /foo/ as the same path
    const path = url.pathname.replace(/\/+$/, "") || "/";

    const target = REDIRECTS[path];
    if (target) {
      return Response.redirect(url.origin + target, 301);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    // page assets referenced with relative paths (mentor photos etc.)
    if (path.startsWith("/images/")) {
      const upstream = await fetch(GHP + path, { cf: { cacheTtl: 3600, cacheEverything: true } });
      if (!upstream.ok) return new Response("Not found", { status: 404 });
      const headers = new Headers(upstream.headers);
      headers.set("cache-control", "public, max-age=3600");
      headers.delete("x-github-request-id");
      return new Response(upstream.body, { status: 200, headers });
    }

    const upstreamUrl = PAGES[path];
    if (!upstreamUrl) {
      // unknown old WordPress URL - send home until the new site maps it
      return Response.redirect(url.origin + "/", 302);
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
