# Metrics

## North Star Metric

**Audits completed per week**

This is the single metric that drives everything else. An audit
completed means a user got real value — they saw their savings
number. Everything downstream (email capture, consultation bookings,
credit purchases) only happens after an audit is completed.

We do not use DAU because this is a tool people use once per quarter
when they review their stack — not daily. DAU would be misleading
and would optimize for the wrong behavior.

## 3 Input Metrics That Drive The North Star

**1. Audit start rate**
What percentage of landing page visitors click "Get My Free Audit"
Target: 40%+ of visitors start an audit
If below 30%: hero copy or CTA is not compelling enough

**2. Audit completion rate**
What percentage of audit starters finish and see results
Target: 60%+ of starters complete
If below 50%: form is too long or too confusing

**3. Traffic from sharing**
What percentage of visitors came from a shared audit URL
Target: 20%+ of traffic from shared links
This is the viral coefficient — if high, growth is compounding

## What I Would Instrument First

1. Page view on index.html (total visitors)
2. Click event on "Get My Free Audit" button (start rate)
3. Page view on results.html (completion rate)
4. Email form submission (capture rate)
5. Click on shareable URL copy button (share intent)
6. Page view on audit.html with ?id= param (shared audit views)
7. Click on Credex consultation CTA (high-value intent)

Simple implementation: one line of JS per event sending to
Plausible Analytics (privacy-friendly, no cookie banner needed)

## What Number Triggers A Pivot Decision

If after 500 audits completed:
- Email capture rate is below 15% → value proposition not landing
- Credex CTA click rate is below 3% → savings numbers not high enough
  to motivate action, or Credex offer not compelling
- Sharing rate is below 5% → results page not screenshot-worthy enough

The pivot would not be to abandon the tool — it would be to change
the email capture offer (e.g. add PDF export as incentive) or improve
the results page visual design to make it more shareable.