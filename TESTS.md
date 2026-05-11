# Tests

## How To Run Tests

Open browser console on any page and paste the test code below.
Or open tests.js directly in Node if available.

All tests use a simple assertion helper:
```javascript
function assert(condition, message) {
    if (condition) {
        console.log("✅ PASS:", message)
    } else {
        console.error("❌ FAIL:", message)
    }
}
```

## Test 1 — Claude Max Should Flag Downgrade

**File:** js/audit.js
**Function:** auditTool()
**What it covers:** Claude Max plan right-sizing for solo users

```javascript
const result = auditTool("claude", "Max", 100, 1, 1, "mixed")
assert(result.savings === 80, "Claude Max solo should save $80/mo")
assert(result.severity === "danger", "Claude Max solo should be danger")
assert(result.recommendation.includes("Pro"), "Should recommend Pro")
console.log("Claude Max test:", result)
```

## Test 2 — GitHub Copilot Enterprise Overkill

**File:** js/audit.js
**Function:** auditTool()
**What it covers:** Enterprise plan flagging for small teams

```javascript
const result = auditTool("copilot", "Enterprise", 390, 10, 10, "coding")
assert(result.savings === 200, "Copilot Enterprise 10 seats should save $200/mo")
assert(result.severity === "danger", "Should be danger severity")
assert(result.recommendation.includes("Business"), "Should recommend Business")
console.log("Copilot Enterprise test:", result)
```

## Test 3 — Cursor Business Small Team

**File:** js/audit.js
**Function:** auditTool()
**What it covers:** Business plan overkill for teams under 3

```javascript
const result = auditTool("cursor", "Business", 120, 3, 3, "coding")
assert(result.savings === 60, "Cursor Business 3 seats should save $60/mo")
assert(result.severity === "warning", "Should be warning severity")
console.log("Cursor Business test:", result)
```

## Test 4 — Optimal Spend Returns No Savings

**File:** js/audit.js
**Function:** auditTool()
**What it covers:** Honest result for well-optimized spend

```javascript
const result = auditTool("copilot", "Individual", 10, 1, 1, "coding")
assert(result.savings === 0, "Individual Copilot solo should have no savings")
assert(result.severity === "ok", "Should be ok severity")
console.log("Optimal spend test:", result)
```

## Test 5 — Full Audit Totals Correctly

**File:** js/audit.js
**Function:** runFullAudit()
**What it covers:** Total savings calculation across multiple tools

```javascript
const tools = [
    { tool: "claude", plan: "Max", spend: 100, seats: 1 },
    { tool: "copilot", plan: "Enterprise", spend: 390, seats: 10 }
]
const audit = runFullAudit(tools, 10, "coding")
assert(audit.totalSavings === 280, "Total savings should be $280/mo")
assert(audit.annualSavings === 3360, "Annual savings should be $3360")
assert(audit.isHighSavings === false, "Should not be high savings")
assert(audit.results.length === 2, "Should have 2 tool results")
console.log("Full audit test:", audit)
```

## Test 6 — Overpay Detection

**File:** js/audit.js
**Function:** auditTool()
**What it covers:** Universal overpay check when spend exceeds official price

```javascript
const result = auditTool("gemini", "Pro", 222, 1, 1, "mixed")
assert(result.savings > 0, "Gemini Pro at $222 should flag savings")
assert(result.severity === "danger", "Overpaying should be danger")
console.log("Overpay detection test:", result)
```