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

## Day 3 — 2025-05-08
**Hours worked:** 3

**What I did:**
- Built results.html from scratch after first attempt failed to load
- Built js/results.js — renders hero savings, tool breakdown cards, AI summary
- Fixed audit.js — improved ChatGPT Team logic for different seat ranges
- Fixed form.js — added spend sanity check, replaced template literals
- Tested with real inputs — Claude Max + GitHub Copilot Enterprise showing correct savings
- AI summary generating correctly via Groq fallback

**What I learned:**
- Results page was blank because script load order matters — audit.js must load before results.js
- Template literals can cause issues in some environments — plain string concatenation is safer
- ChatGPT Team pricing logic needs multiple cases for different seat ranges
- The fallback summary is actually good enough that Groq API failure doesn't matter

**Blockers / what I'm stuck on:**
- Groq API not connecting yet — using fallback summary for now
- Supabase not connected yet — email capture stores to localStorage only
- Share URL points to localhost — needs real deployed URL

**Plan for tomorrow:**
- Connect Groq API properly for real AI summaries
- Set up Supabase table and connect email capture
- Set up Resend for transactional email
- Deploy to Netlify to get real URL


## Day 4 — 2025-05-09
**Hours worked:** 3

**What I did:**
- Created audits table in Supabase with all required columns
- Built backend.js with saveAuditToSupabase and sendConfirmationEmail
- Fixed Supabase RLS issue — disabled row level security so inserts work
- Connected email capture form to real Supabase backend
- Data now saving successfully to database
- Moved all API keys to config.js
- Fixed GitHub push protection error — removed secret from git history
- Added config.js to gitignore so keys never get pushed again

**What I learned:**
- Supabase enables Row Level Security by default — blocks all inserts silently
- Never commit API keys — GitHub will block the push automatically
- git rebase -i can rewrite history to remove secrets from old commits
- Always add config files with secrets to gitignore from Day 1

**Blockers / what I'm stuck on:**
- Resend email delivery needs verification
- Share URL still points to localhost — needs real deployed URL tomorrow

**Plan for tomorrow:**
- Deploy to Netlify — get live URL
- Build audit.html for public shareable pages
- Run Lighthouse score
- Start writing all documentation files