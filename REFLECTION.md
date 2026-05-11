# Reflection

## 1. The Hardest Bug I Hit This Week

The hardest bug was the Supabase duplicate key error that appeared
on Day 4. The symptom was silent — the email form showed success
but nothing was saved to the database. I only discovered it by
opening the browser console and seeing a 409 conflict error.

My first hypothesis was that the Supabase table schema was wrong.
I checked the column types and they looked correct. My second
hypothesis was that the API key was invalid — I tested it with
a direct fetch() call in the console and it worked fine.

The third hypothesis was the right one: the audit ID was being
read from localStorage and reused across multiple submissions.
The first submission created the row. Every subsequent submission
tried to insert the same UUID as the primary key, which Postgres
rejected with a unique constraint violation.

The fix was two lines — generate a fresh UUID on every page load
instead of reading from localStorage. What made this hard to debug
was that the error was silent from the user's perspective — the
success message showed regardless. I added console.error logging
to every backend call after this to make failures visible.

## 2. A Decision I Reversed Mid-Week

I originally planned to use Resend for transactional email. I set
up the account, got the API key, and wrote the integration. It
worked perfectly in my local tests.

When I deployed to Netlify and tested the live site, every email
call failed with a CORS error. Resend's API does not include
Access-Control-Allow-Origin headers, which means browsers block
all direct calls to it. It is designed for server-side use only.

I reversed the decision on Day 5 and switched to EmailJS, which
is purpose-built for browser-side email sending. The reversal cost
me about 2 hours but was the right call. The lesson: always test
third-party APIs on the deployed environment, not just localhost.
CORS issues never appear in local development.

## 3. What I Would Build In Week 2

Three things in priority order:

First, a Netlify serverless function to proxy API calls. This
would let me move all API keys server-side, eliminating the
config.js exposure problem entirely. It would also unblock
using Resend properly.

Second, a benchmark mode showing "your AI spend per developer
is $X — companies your size average $Y." This requires collecting
anonymized aggregate data from audits, which we now have in
Supabase. The benchmark creates urgency and is inherently viral
— people want to know how they compare.

Third, PDF export of the audit report. Several users in my
interviews mentioned they would want to share the report with
their co-founder or board. A downloadable PDF makes this easier
than a shared URL.

## 4. How I Used AI Tools

I used Claude (Anthropic) as my primary coding assistant throughout
the week. Specifically I used it for: generating boilerplate HTML
structure, debugging JavaScript errors when I described the symptom,
explaining Supabase REST API syntax, and writing the EmailJS
integration.

I did not trust AI for: the audit engine logic (too important to
get right — I wrote every rule manually and verified against
official pricing pages), the entrepreneurial files (GTM, economics,
user interviews — these require real thinking and real conversations),
and debugging CORS errors (the AI kept suggesting solutions that
assumed server-side code, which was not my environment).

One specific time the AI was wrong: it suggested using Resend
directly from the browser and provided working-looking code. The
code was syntactically correct but would always fail in production
due to CORS. I caught this when the live site failed and traced
the error back to the API call structure.

## 5. Self-Rating

**Discipline: 7/10**
I committed code on 6 distinct calendar days and maintained the
DEVLOG consistently. Lost one point because I underestimated how
long the email integration would take and had to rush Day 5.

**Code Quality: 6/10**
The audit engine is clean and well-structured with clear separation
of concerns. The results.js file grew too large and should be split
into smaller modules. No TypeScript was used which the assignment
preferred.

**Design Sense: 7/10**
The dark theme with green accents is cohesive and professional.
The results page hierarchy is clear — hero number, summary, breakdown.
Mobile responsiveness works. Lost points for not adding more
microinteractions and hover states.

**Problem Solving: 8/10**
Debugged the Supabase duplicate key issue, the CORS email problem,
and the form localStorage persistence bug all without external help.
Each time I formed a hypothesis, tested it, and moved to the next
one systematically.

**Entrepreneurial Thinking: 7/10**
I did real user interviews, wrote specific GTM with named channels,
and built the Credex integration genuinely into the product rather
than as an afterthought. Lost points for not having a referral
mechanic and for not writing the optional blog post or Twitter thread.