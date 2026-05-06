# AuditAI — Free AI Spend Auditor

AuditAI helps startup founders and engineering managers instantly 
see where they're overspending on AI tools like Cursor, Claude, 
ChatGPT, and GitHub Copilot — and exactly how much they could save.

Built for: CTOs and engineering managers at seed-stage startups 
paying for multiple AI tools with no visibility into combined spend.

## Live URL
Coming soon

## Screenshots
Coming soon

## Quick Start
1. Clone this repo
2. Open index.html in your browser
3. No install needed

## Decisions
1. Chose vanilla JS over React — maximized shipping speed given timeline
2. Chose Supabase over Firebase — better free tier and SQL flexibility
3. Chose Netlify over Vercel — simpler for vanilla JS deployment
4. Chose Resend over Postmark — best developer experience on free tier
5. Chose client-side audit logic over AI — rules are deterministic, AI adds latency and cost

## Stack
- Frontend: Vanilla HTML, CSS, JavaScript
- Database: Supabase
- Email: Resend
- AI Summary: Anthropic Claude API
- Deployment: Netlify