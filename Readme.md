# AuditAI
# AuditAI — Free AI Spend Auditor

AuditAI helps startup founders and engineering managers instantly
see where they're overspending on AI tools like Cursor, Claude,
ChatGPT, and GitHub Copilot — and exactly how much they could save.

Built for: CTOs and engineering managers at seed-stage startups
paying for multiple AI tools with no visibility into combined spend.

## Live URL
🔗 https://spendaudit.netlify.app

## Screenshots

> Form page — enter your AI tools and spend
> Results page — see your savings breakdown
> Shareable URL — public audit report

*(Add screenshots here)*

## Quick Start

```bash
# Clone the repo
git clone https://github.com/PratapDabhade16/AuditAI.git
cd AuditAI

# Create config file with your API keys
# Copy the template below into js/config.js
```

Create `js/config.js`:
```javascript
const CONFIG = {
    SUPABASE_URL: "your_supabase_url",
    SUPABASE_ANON_KEY: "your_anon_key",
    GROQ_API_KEY: "your_groq_key",
    RESEND_API_KEY: "not_needed",
    EMAILJS_PUBLIC_KEY: "your_emailjs_key",
    EMAILJS_SERVICE_ID: "your_service_id",
    EMAILJS_TEMPLATE_ID: "your_template_id"
}
```

```bash
# Open in browser — no build step needed
open index.html

# Or use a local server
npx serve .
```

## Deploy

1. Push to GitHub
2. Connect repo to Netlify
3. Deploy — no build command needed
4. Add your config.js with real keys

## Decisions

1. **Vanilla JS over React** — Maximized shipping speed given 7-day
   timeline. Zero build tooling means faster iteration and simpler
   Netlify deployment with no configuration required.

2. **Supabase over Firebase** — Better free tier, real Postgres SQL,
   and a clean REST API that works with plain fetch() without any SDK.
   Row-level security available for production hardening.

3. **EmailJS over Resend** — Resend cannot be called directly from
   browsers due to CORS restrictions. EmailJS is purpose-built for
   browser-side email sending with no backend proxy needed.

4. **Client-side audit logic** — The audit engine uses zero AI and
   hardcoded rules only. Deterministic rules are auditable, explainable,
   and defensible to a finance person. No hallucination risk on
   financial recommendations.

5. **Groq over OpenAI for summaries** — Free tier available, extremely
   fast inference with LLaMA3, sufficient quality for 100-word audit
   summaries. Graceful fallback to templated text if API fails.