# User Interviews

## Interview 1
**Name:** Shreyas Dimbar
**Role:** Engineering Student / Developer
**Company Stage:** Individual / Side Projects
**Date:** 2025-05-08

**Notes:**
Spoke over WhatsApp chat for about 10 minutes. Shreyas is an
engineering student who actively uses AI tools for coding and
studying. He pays for Gemini and uses ChatGPT on a paid tier.
His total monthly AI spend converted to USD is approximately
$222/month — significantly more than most individual developers
his age.

**Direct Quotes:**
- "I use Gemini for most things because it feels faster for me"
- "I have ChatGPT paid but honestly I forget which plan I'm on"
- "I never actually calculated how much I spend on all these
  tools together — that's a lot when you say it out loud"

**Most Surprising Thing:**
When I told Shreyas his combined spend was over $220/month,
he went quiet for a second and said he had no idea it added
up that much. He had been paying for both Gemini and ChatGPT
paid tiers simultaneously without realizing there was significant
feature overlap between them for his use case.

**What It Changed About My Design:**
This conversation confirmed that the hero number — total
combined monthly spend — needs to be shown prominently
before the savings number. The shock of seeing the total
is what creates urgency. I made the spend summary more
visible on the results page as a result.

---

## Interview 2
**Name:** Mayur Dhavale
**Role:** Founder
**Company Stage:** Early stage startup (Shishutaa)
**Date:** 2025-05-09

**Notes:**
Spoke over WhatsApp for about 12 minutes. Mayur runs Shishutaa,
a startup focused on mom care, dad care and child care products
and services. His team uses both ChatGPT and Claude for content
creation, customer communication, and product descriptions.
He manages all AI tool decisions himself with no dedicated
tech team.

**Direct Quotes:**
- "We use ChatGPT for writing product descriptions and Claude
  for longer content — I didn't know I could just pick one"
- "Nobody told me there was a Team plan — we're all on
  individual accounts paying separately"
- "If a tool showed me exactly how much I could save I would
  use it the same day"

**Most Surprising Thing:**
Mayur's team had 3 people paying for ChatGPT individually
instead of one Team plan. They were spending roughly $60/month
when a Team plan for 3 people would cost the same but with
better admin controls and shared usage. Nobody had ever
audited this because "it didn't seem worth the effort."
The effort was 5 minutes.

**What It Changed About My Design:**
Added specific logic in the audit engine to detect when
multiple individual seats would be better consolidated into
a Team plan — and vice versa. Also made the per-seat vs
total spend distinction clearer in the results breakdown.

---
