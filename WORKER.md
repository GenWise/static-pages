# The Worker moved out

The Cloudflare Worker that serves genwise.in used to live in `cloudflare-worker/` in this
repo. On 2026-08-24 it moved to its own private repo:

**https://github.com/GenWise/genwise-worker**

Its history moved with it. Deploys run from there (`wrangler deploy`), not from here.

## Why

This repo holds page content, and we want people who write page copy to be able to raise
pull requests against it. Routing, form handling and — shortly — payment logic should not
sit in a repo with a wider set of contributors, and should not be public.

Nothing about how genwise.in is served changed. This repo still publishes the pages; the
Worker still points at them.
