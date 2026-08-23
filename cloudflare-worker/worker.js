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
// games.genwise.in is served by the same Worker (own route): / -> games.html, the
// hub fronting RamP's games. Each game itself sits on its own subdomain, on his
// hosting — we serve only the hub.
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

// ---------------------------------------------------------------------------
// Forms
//
// One endpoint for every form on the site: POST /api/forms/<slug>. Adding a
// form means adding an entry to FORMS below — not a new Worker, route, or KV
// namespace. Everything lands in the single FORMS_KV namespace, keyed by slug,
// so the Cloudflare dashboard stays at one Worker + one namespace no matter how
// many forms exist.
//
// Every submission is written to KV BEFORE the email is attempted. A lead must
// never depend on the mail hop succeeding — that failure mode killed ~18 Gifted
// Lab leads between May and Aug 2026 (wiki/incidents/2026-08-18-gifted-lab-form-dead.md).
//
// Secret: `wrangler secret put SMTP2GO_API_KEY`.
// ---------------------------------------------------------------------------

const MAIL_FROM = "rajesh@genwise.in";

const FORMS = {
  "teacher-mentoring": {
    // Vishnu and Sowmya added 2026-08-24: seven Aster Public School teachers
    // enquired on 23 Aug and only Rajesh saw them, so nobody could follow up.
    to: ["rajesh@genwise.in", "vishnu@genwise.in", "sowmya@genwise.in"],
    subject: (d) => `[genwise.in] Teacher-mentoring enquiry from ${d.name}`,
    heading: "New enquiry from genwise.in",
    fields: [
      ["Name", "name"], ["Email", "email"], ["Phone", "phone"],
      ["School", "school"], ["Role", "role"],
      ["Programme interest", "program"], ["Message", "message"],
    ],
  },
  "gifted-lab": {
    to: ["tnp@genwise.in"],
    subject: (d) => `Gifted Lab Interest: ${d.child_name || "Unknown"} (Grade ${d.grade || "?"})`,
    heading: "New Gifted Lab Interest Form Submission",
    fields: [
      ["Parent Name", "parent_name"], ["Child's Name", "child_name"],
      ["Email", "email"], ["Phone", "phone"], ["Grade", "grade"],
      ["How did you hear of us", "hear_about"],
      ["Why does your child need Gifted Lab", "why_gifted_lab"],
      // older tnp365 copies of this form send `subject` instead of the two above
      ["Subject", "subject"],
    ],
  },
  "gsp-interest": {
    to: ["rajesh@genwise.in", "eklavya@genwise.in"],
    subject: (d) => `GSP'27 interest: ${d.parent_name || "Unknown"} (Grade ${d.grade || "?"})`,
    heading: "New GSP'27 register-interest submission",
    fields: [
      ["Parent Name", "parent_name"], ["Email", "email"], ["Phone", "phone"],
      ["Child's grade", "grade"],
    ],
  },
};

// Eklavya's Worker (which this endpoint replaces for the homepage form) carried
// an origin allowlist and a per-IP rate limit alongside the honeypot; he asked
// for both to survive the move (WhatsApp, 19 Aug 2026).
const ALLOWED_ORIGINS = new Set([
  "https://genwise.in",
  "https://www.genwise.in",
  "https://genwise.github.io",
]);

const RATE_LIMIT = 5;        // submissions per IP
const RATE_WINDOW = 600;     // seconds

// Returns true when this IP has already spent its allowance. KV is eventually
// consistent, so this is a speed bump for bots rather than a hard guarantee.
async function rateLimited(env, ip) {
  if (!env.FORMS_KV || !ip) return false;
  const key = `rl:${ip}`;
  const n = Number((await env.FORMS_KV.get(key)) || 0);
  if (n >= RATE_LIMIT) return true;
  await env.FORMS_KV.put(key, String(n + 1), { expirationTtl: RATE_WINDOW });
  return false;
}

// Name lives under different keys per form; accept either.
const nameOf = (d) => (d.name || d.parent_name || "").trim().slice(0, 200);

async function handleForm(request, env, slug) {
  const form = FORMS[slug];
  if (!form) return Response.json({ ok: false, error: "Unknown form" }, { status: 404 });

  // A missing Origin is fine - server-side posts and older browsers send none.
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  if (await rateLimited(env, request.headers.get("cf-connecting-ip"))) {
    return Response.json(
      { ok: false, error: "Too many submissions - please try again in a few minutes" },
      { status: 429 }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  // honeypot: real users never fill "website"
  if (data.website) return Response.json({ ok: true });

  const name = nameOf(data);
  const email = (data.email || "").trim().slice(0, 200);
  if (!name || !email.includes("@")) {
    return Response.json(
      { ok: false, error: "Name and a valid email are required" },
      { status: 400 }
    );
  }

  // 1. Persist first. If this throws we genuinely cannot accept the lead.
  const record = { ...data, form: slug, received_at: new Date().toISOString() };
  if (env.FORMS_KV) {
    try {
      await env.FORMS_KV.put(
        `sub:${slug}:${record.received_at}:${crypto.randomUUID().slice(0, 8)}`,
        JSON.stringify(record)
      );
    } catch (e) {
      console.log(`KV write failed for ${slug}: ${e}`);
      return Response.json({ ok: false, error: "Could not save — please try again" }, { status: 503 });
    }
  }

  // 2. Then notify. A failed email no longer loses the lead, so report success.
  const field = (label, key) =>
    data[key] ? `${label}: ${String(data[key]).trim().slice(0, 1000)}\n` : "";
  const body =
    `${form.heading}${data.page ? " (" + data.page + ")" : ""}\n\n` +
    form.fields.map(([label, key]) => field(label, key)).join("") +
    `\n---\nReceived ${record.received_at}\n`;

  try {
    const resp = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: env.SMTP2GO_API_KEY,
        sender: MAIL_FROM,
        to: form.to,
        subject: form.subject(data),
        text_body: body,
      }),
    });
    // SMTP2GO returns HTTP 200 with the real outcome in the body, so `resp.ok`
    // alone does not tell you the mail was sent.
    const result = await resp.json();
    if (!resp.ok || !(result?.data?.succeeded > 0)) {
      console.log(`SMTP2GO failed for ${slug}: ${JSON.stringify(result)}`);
      if (!env.FORMS_KV) {
        return Response.json({ ok: false, error: "Mail service error" }, { status: 502 });
      }
    }
  } catch (e) {
    console.log(`SMTP2GO threw for ${slug}: ${e}`);
    if (!env.FORMS_KV) {
      return Response.json({ ok: false, error: "Mail service error" }, { status: 502 });
    }
  }

  return Response.json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.genwise.in") {
      return Response.redirect("https://genwise.in" + url.pathname + url.search, 301);
    }

    // games.genwise.in — the hub fronting RamP's games. Its own host rather than a
    // path, because each game lives on his hosting under its own subdomain and the
    // hub is the only page we serve. GitHub Pages can't take this domain (one custom
    // domain per repo, and static-pages already serves from genwise.github.io).
    if (url.hostname === "games.genwise.in") {
      const p = url.pathname.replace(/\/+$/, "") || "/";
      const src = p === "/" ? GHP + "/games.html"
                : p.startsWith("/images/") ? GHP + p
                : null;
      if (!src) return Response.redirect("https://games.genwise.in/", 302);

      const upstream = await fetch(src, { cf: { cacheTtl: 60, cacheEverything: true } });
      if (!upstream.ok) {
        return new Response("This page is temporarily unavailable.", {
          status: 502,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
      const headers = new Headers(upstream.headers);
      headers.delete("x-github-request-id");
      headers.set("cache-control", "public, max-age=60");
      return new Response(upstream.body, { status: 200, headers });
    }

    // treat /foo and /foo/ as the same path
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "POST") {
      // canonical: /api/forms/<slug>
      if (path.startsWith("/api/forms/")) {
        return handleForm(request, env, path.slice("/api/forms/".length));
      }
      // legacy alias — live pages still POST here; keep until they are repointed
      if (path === "/api/enquiry") {
        return handleForm(request, env, "teacher-mentoring");
      }
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
