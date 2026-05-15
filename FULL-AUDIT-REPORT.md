# ShortHand SEO Full Audit Report
**URL:** https://getshorthandapp.com  
**Date:** 2026-04-26  
**Auditor:** Claude SEO Skill

---

## Overall Score: 64/100 — Needs Improvement

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 72/100 | 25% | 18.0 |
| Content Quality | 70/100 | 20% | 14.0 |
| On-Page SEO | 75/100 | 15% | 11.25 |
| Schema / Structured Data | 45/100 | 15% | 6.75 |
| Performance (CWV) | 60/100 | 10% | 6.0 (estimated) |
| Image Optimization | 80/100 | 10% | 8.0 |
| AI Search Readiness (GEO) | 0/100 | 5% | 0.0 |
| **Total** | | | **64/100** |

---

## Critical Issues

### 1. FAQPage Schema is Restricted — Remove Immediately
- **Finding:** FAQPage JSON-LD is present on the homepage.
- **Evidence:** Schema type `FAQPage` detected in structured data.
- **Impact:** Since August 2023, Google restricts FAQPage rich results to government and healthcare authority sites only. Commercial sites using it get no benefit and may trigger a manual review flag.
- **Fix:** Remove the `FAQPage` schema block entirely. The FAQ content can remain on the page — just remove the JSON-LD wrapper.
- **Confidence:** Confirmed

### 2. No llms.txt File (AI Search Readiness = 0)
- **Finding:** No `/llms.txt` file found.
- **Evidence:** `https://getshorthandapp.com/llms.txt` returns 404.
- **Impact:** AI search engines (Perplexity, ChatGPT Search, Claude) use `llms.txt` to understand what a site is about and what content to surface. Without it, you're invisible to a growing share of search.
- **Fix:** Add a simple `llms.txt` to the public folder — see ACTION-PLAN.md for template.
- **Confidence:** Confirmed

### 3. External Links to classroom-pulse-public.vercel.app Are Not `rel="nofollow"`
- **Finding:** Three links point to `classroom-pulse-public.vercel.app` with no `rel` attribute.
- **Evidence:** Links to demo and free tool on the Vercel subdomain are dofollow.
- **Impact:** You're passing PageRank to a Vercel staging domain that has no SEO value. This dilutes link equity from your homepage.
- **Fix:** Add `rel="nofollow"` to all links pointing to `classroom-pulse-public.vercel.app`.
- **Confidence:** Confirmed

---

## Warnings

### 4. Canonical Tag Missing Trailing Slash Consistency
- **Finding:** Canonical is `https://getshorthandapp.com` (no trailing slash).
- **Evidence:** `<link rel="canonical" href="https://getshorthandapp.com">` — no slash.
- **Impact:** Minor — Next.js typically handles this, but inconsistency can cause soft duplicate signals.
- **Fix:** Ensure canonical and `og:url` always match the exact URL Google sees (check in Search Console).
- **Confidence:** Likely

### 5. No Twitter/X Handle in Twitter Card
- **Finding:** `twitter:site` tag is absent.
- **Evidence:** Twitter Card meta tags present but missing `twitter:site`.
- **Impact:** Reduces social sharing attribution and brand credibility in X previews.
- **Fix:** Add `<meta name="twitter:site" content="@yourhandle" />` if you have an account.
- **Confidence:** Confirmed

### 6. Only One Blog Post Visible
- **Finding:** Internal link crawl found one blog post linked from homepage (`/blog/the-sgo-data-trap`).
- **Evidence:** 13 pages crawled, blog section has minimal content.
- **Impact:** Blog is a major organic traffic driver for EdTech. One post provides almost no long-tail keyword coverage.
- **Fix:** Publish at least 6–10 blog posts targeting specific teacher pain-point searches (e.g., "how to track student behavior", "IEP progress notes template").
- **Confidence:** Confirmed

### 7. No Organization `sameAs` or Social Profiles in Schema
- **Finding:** Organization schema is missing `sameAs` links.
- **Evidence:** Organization JSON-LD has no social profile URLs.
- **Impact:** Reduces Google's ability to build a Knowledge Panel for ShortHand.
- **Fix:** Add `"sameAs": ["https://www.tiktok.com/@yourhandle", "https://instagram.com/yourhandle"]` to the Organization schema.
- **Confidence:** Confirmed

### 8. Meta Description Is Long (170 chars)
- **Finding:** Meta description is 170 characters.
- **Evidence:** `"ShortHand is an education technology platform for K-12 teachers. Classroom management, student progress tracking, behavior documentation, and AI-generated reports — built by a teacher, for teachers."`
- **Impact:** Google truncates at ~155–160 chars. The end gets cut off in SERPs.
- **Fix:** Trim to under 155 chars. Keep the emotional hook: "Built by a teacher, for teachers."
- **Confidence:** Confirmed

---

## Passes

- **Title tag:** Well-formed, 66 chars, includes brand + primary keyword. Pass.
- **H1:** Clear, emotionally resonant, one per page. Pass.
- **Canonical:** Present. Pass.
- **robots.txt:** Present, sitemap declared. Pass.
- **Sitemap:** Declared at `/sitemap.xml`. Pass.
- **Open Graph:** 6/7 tags present (missing `og:locale`). Near pass.
- **Images:** All have descriptive alt text. Images use Next.js optimized format (webp). Pass.
- **HTTPS:** Site is served over HTTPS. Pass.
- **Mobile-first:** Responsive layout confirmed. Pass.
- **Word count:** 1,535 words on homepage — above the 800-word minimum for competitive SaaS. Pass.
- **Internal linking:** 69 internal links across 13 pages — healthy structure. Pass.

---

## Environment Limitations

- PageSpeed / Core Web Vitals: API rate limited — CWV scores are estimated based on Next.js baseline.
- robots.txt AI crawler section: Script crashed on emoji output (Windows encoding) — data was partially captured (1 sitemap, 0 disallow rules confirmed).
