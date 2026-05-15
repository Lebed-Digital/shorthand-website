# ShortHand SEO Action Plan
**Site:** https://getshorthandapp.com  
**Date:** 2026-04-26

Ordered by impact vs. effort.

---

## Priority 1 — Fix Now (Low Effort, High Impact)

### A. Remove FAQPage Schema
**File:** Wherever JSON-LD is injected (likely `app/page.tsx` or a `<Script>` block)  
Delete the entire `FAQPage` JSON-LD block. The FAQ section on the page is fine — just remove the schema wrapper.  
**Why:** FAQPage is restricted to gov/healthcare since Aug 2023. It's dead weight and a potential flag.

### B. Add `rel="nofollow"` to Vercel Links
**File:** `app/page.tsx` or component containing demo links  
Add `rel="nofollow"` to all 3 links pointing to `classroom-pulse-public.vercel.app`.  
**Why:** You're leaking PageRank to a staging domain.

### C. Trim Meta Description to Under 155 Characters
**Current (170 chars):** "ShortHand is an education technology platform for K-12 teachers. Classroom management, student progress tracking, behavior documentation, and AI-generated reports — built by a teacher, for teachers."  
**Suggested (~145 chars):** "ShortHand helps K-12 teachers log student behavior, generate AI progress reports, and send parent messages — built by a teacher, for teachers."

### D. Add `og:locale` Tag
Add `<meta property="og:locale" content="en_US" />` to the site's head metadata.

---

## Priority 2 — Do This Week (Medium Effort, High Impact)

### E. Add `llms.txt`
Create `public/llms.txt` with:
```
# ShortHand

> ShortHand is a K-12 classroom management app built by a teacher. It helps teachers log student behavior notes in under 5 seconds, generate AI progress reports, and send parent communication instantly.

## Pages
- Homepage: https://getshorthandapp.com
- How It Works: https://getshorthandapp.com/how-it-works
- Blog: https://getshorthandapp.com/blog
- Privacy Policy: https://getshorthandapp.com/privacy
```
**Why:** AI search engines (Perplexity, ChatGPT Search) use this to understand your site.

### F. Add `sameAs` to Organization Schema
In the Organization JSON-LD, add:
```json
"sameAs": [
  "https://www.tiktok.com/@yourhandle",
  "https://www.instagram.com/yourhandle"
]
```
Replace with actual handles. Helps Google build a Knowledge Panel for ShortHand.

### G. Add Twitter `twitter:site` Meta Tag
Add `<meta name="twitter:site" content="@yourhandle" />` if you have a TikTok/X presence.

---

## Priority 3 — Ongoing (High Effort, Highest Long-Term Impact)

### H. Publish Blog Content Targeting Teacher Search Queries
Current: 1 blog post. Target: 10+ posts.

High-value keyword opportunities:
- "how to track student behavior in the classroom"
- "IEP progress note examples for teachers"
- "parent communication log for teachers"
- "behavior tracking app for teachers"
- "how to write progress reports faster"
- "classroom management tools for elementary teachers"

Each post = a new entry point from Google search.

### I. Add Review / Testimonial Schema
Once you have teacher testimonials, add `Review` or `AggregateRating` to the SoftwareApplication schema. This can unlock star ratings in SERPs.

---

## Score Projection After Fixes

| Fix | Score Gain |
|-----|-----------|
| Remove FAQPage schema (A) | +3 |
| Add llms.txt (E) | +5 |
| nofollow Vercel links (B) | +2 |
| Meta description trim (C) | +1 |
| sameAs in schema (F) | +2 |
| Blog content (H) | +8–15 (over time) |
| **Projected score after quick fixes** | **~72/100** |
