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
//   /tomorrow-makers                 -> programme page (GenWise x Godrej)
//   /work-with-us                    -> hiring page (was at /tomorrow-makers
//                                       until 2026-08-17)
//   /images/*                        -> page assets (mentor/school photos)
//   /for-teachers, /genai,
//   /my-misconception-mentor         -> the For Teachers family (restored/
//                                       consolidated 2026-08-14)
//   /tnp365* (old URLs)              -> 301 to the gifted-lab equivalents
//   /gtm-coach, /gtm-operations      -> 301 to /tomorrow-makers anchors
//   anything else                    -> 302 to / (temporary, new site coming)
//
// www.genwise.in is 301'd to the apex. When the new site takes over the domain,
// delete the genwise.in/* route (or repoint DNS) and trim this back down.

const GHP = "https://genwise.github.io/static-pages";

const PAGES = {
  "/": GHP + "/genwise-home.html",
  "/tomorrow-makers": GHP + "/tomorrow-makers.html",
  "/work-with-us": GHP + "/work-with-us.html",
  "/gifted-lab": GHP + "/gifted-lab.html",
  "/gifted-lab-how-it-works": GHP + "/gifted-lab-how-it-works.html",
  "/gifted-lab-mentors": GHP + "/gifted-lab-mentors.html",
  "/gifted-lab-what-students-learn": GHP + "/gifted-lab-what-students-learn.html",
  "/gifted-lab-in-schools": GHP + "/gifted-lab-in-schools.html",
  "/for-teachers": GHP + "/for-teachers.html",
  "/genai": GHP + "/genai.html",
  "/my-misconception-mentor": GHP + "/my-misconception-mentor.html",
};

// Values may be site-relative or absolute (absolute ones leave genwise.in).
const REDIRECTS = {
  "/gtm-coach": "/work-with-us#coach",
  "/gtm-operations": "/work-with-us#operations",
  "/tnp365": "/gifted-lab",
  "/tnp365-how-it-works": "/gifted-lab-how-it-works",
  "/tnp365-mentors": "/gifted-lab-mentors",
  "/tnp365-what-students-learn": "/gifted-lab-what-students-learn",
  "/teacher-mentoring": "/for-teachers",
};

// Whole path-prefixes proxied to other Workers (Eklavya's account), so their
// apps live under genwise.in. Forwarded verbatim - method, headers, body -
// because these are apps (forms, checkout), not static documents.
const PROXY_PREFIXES = {
  "/insider-circle": "https://genwise-insider-circle.afoaofa.workers.dev",
};

// Enquiry form endpoint (teacher-mentoring pages). Sends mail over SMTP2GO's
// HTTPS API — no droplet, no SMTP. Secret: `wrangler secret put SMTP2GO_API_KEY`.
const ENQUIRY_TO = "rajesh@genwise.in";

async function handleEnquiry(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // honeypot: real users never fill "website"
  if (data.website) return Response.json({ ok: true });

  const name = (data.name || "").trim().slice(0, 200);
  const email = (data.email || "").trim().slice(0, 200);
  if (!name || !email.includes("@")) {
    return Response.json({ ok: false, error: "Name and a valid email are required" }, { status: 400 });
  }

  const field = (label, value) =>
    value ? `${label}: ${String(value).trim().slice(0, 1000)}\n` : "";
  const body =
    `New enquiry from genwise.in${data.page ? " (" + data.page + ")" : ""}\n\n` +
    field("Name", name) + field("Email", email) + field("Phone", data.phone) +
    field("School", data.school) + field("Role", data.role) +
    field("Programme interest", data.program) + field("Message", data.message);

  const resp = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      api_key: env.SMTP2GO_API_KEY,
      sender: "rajesh@genwise.in",
      to: [ENQUIRY_TO],
      subject: `[genwise.in] Teacher-mentoring enquiry from ${name}`,
      text_body: body,
    }),
  });

  if (!resp.ok) {
    return Response.json({ ok: false, error: "Mail service error" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.genwise.in") {
      return Response.redirect("https://genwise.in" + url.pathname + url.search, 301);
    }

    // treat /foo and /foo/ as the same path
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/api/enquiry" && request.method === "POST") {
      return handleEnquiry(request, env);
    }

    const target = REDIRECTS[path];
    if (target) {
      const dest = target.startsWith("https://") ? target : url.origin + target;
      return Response.redirect(dest, 301);
    }

    for (const [prefix, upstreamHost] of Object.entries(PROXY_PREFIXES)) {
      if (path === prefix || path.startsWith(prefix + "/")) {
        return fetch(new Request(upstreamHost + url.pathname + url.search, request));
      }
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
