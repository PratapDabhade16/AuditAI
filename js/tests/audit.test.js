// Simple test runner — no dependencies needed
function assert(condition, message) {
    if (condition) {
        console.log("✅ PASS:", message)
    } else {
        console.error("❌ FAIL:", message)
        process.exit(1)
    }
}

// Load audit engine
const fs = require("fs")
eval(fs.readFileSync("js/audit.js", "utf8"))

// Test 1
const t1 = auditTool("claude", "Max", 100, 1, 1, "mixed")
assert(t1.savings === 80, "Claude Max solo should save $80/mo")

// Test 2
const t2 = auditTool("copilot", "Enterprise", 390, 10, 10, "coding")
assert(t2.savings === 200, "Copilot Enterprise 10 seats should save $200/mo")

// Test 3
const t3 = auditTool("cursor", "Business", 120, 3, 3, "coding")
assert(t3.savings === 60, "Cursor Business 3 seats should save $60/mo")

// Test 4
const t4 = auditTool("copilot", "Individual", 10, 1, 1, "coding")
assert(t4.savings === 0, "Individual Copilot solo should have no savings")

// Test 5
const tools = [
    { tool: "claude", plan: "Max", spend: 100, seats: 1 },
    { tool: "copilot", plan: "Enterprise", spend: 390, seats: 10 }
]
const audit = runFullAudit(tools, 10, "coding")
assert(audit.totalSavings === 280, "Total savings should be $280/mo")
assert(audit.annualSavings === 3360, "Annual savings should be $3360")

// Test 6
const t6 = auditTool("gemini", "Pro", 222, 1, 1, "mixed")
assert(t6.savings > 0, "Gemini Pro at $222 should flag savings")

console.log("\n🎉 All tests passed!")