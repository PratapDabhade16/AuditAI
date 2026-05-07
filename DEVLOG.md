# Dev Log — AuditAI

## Day 1 — 2025-05-06
**Hours worked:** 2

**What I did:**
- Set up project folder structure and GitHub repo
- Researched and documented pricing for all 8 AI tools
- Signed up for Supabase, Netlify, Resend, Anthropic API
- Wrote README with initial decisions

**What I learned:**
- Claude Pro is $20/user but API pricing is completely different (token-based)
- GitHub Copilot Business minimum is per seat with no team minimum
- Cursor Business vs Pro threshold matters a lot for small teams

**Blockers / what I'm stuck on:**
- Need to figure out how Supabase JS SDK works
- Not sure yet how to generate unique audit URLs

**Plan for tomorrow:**
- Build the input form in HTML/CSS
- Write audit engine functions in audit.js
- Start with Cursor and Claude audit logic first

## Day 2 — 2025-05-07
**Hours worked:** 3

**What I did:**
- Built full spend input form with dynamic tool cards
- Implemented localStorage persistence for form state
- Built audit engine with logic for all 8 tools
- Covered plan right-sizing, cross-tool alternatives, seat optimization

**What I learned:**
- Cursor Business vs Pro threshold is significant for small teams
- GitHub Copilot Individual vs Business is a common overspend pattern
- Claude Max at $100/mo is genuinely overkill for most solo users

**Blockers / what I'm stuck on:**
- Results page UI needs to look impressive — spending time on design tomorrow
- Need to test all audit logic edge cases

**Plan for tomorrow:**
- Build results.html with hero savings number
- Connect audit.js output to a clean visual display
- Make it look good enough to screenshot