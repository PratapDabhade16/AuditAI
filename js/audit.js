// ─── PRICING DATA ────────────────────────────────────────────
// Official prices per seat per month (USD)
const OFFICIAL_PRICING = {
    cursor: {
        "Hobby (Free)": 0,
        "Pro": 20,
        "Business": 40,
        "Enterprise": 40 // custom but estimate 40+
    },
    copilot: {
        "Individual": 10,
        "Business": 19,
        "Enterprise": 39
    },
    claude: {
        "Free": 0,
        "Pro": 20,
        "Max": 100,
        "Team": 30,
        "Enterprise": 30, // custom but minimum ~30
        "API Direct": 0 // variable
    },
    chatgpt: {
        "Plus": 20,
        "Team": 30,
        "Enterprise": 30, // custom
        "API Direct": 0 // variable
    },
    anthropic_api: {
        "Pay as you go": 0 // variable
    },
    openai_api: {
        "Pay as you go": 0 // variable
    },
    gemini: {
        "Free": 0,
        "Pro": 20,
        "Ultra": 30,
        "API Direct": 0
    },
    windsurf: {
        "Free": 0,
        "Pro": 15,
        "Teams": 35
    }
}

// ─── CHEAPER ALTERNATIVES BY USE CASE ───────────────────────
const ALTERNATIVES = {
    coding: {
        tool: "Cursor Pro",
        price: 20,
        reason: "Best coding AI — most engineers need only Pro, not Business"
    },
    writing: {
        tool: "Claude Pro",
        price: 20,
        reason: "Claude excels at writing tasks at $20/month"
    },
    data: {
        tool: "ChatGPT Plus",
        price: 20,
        reason: "ChatGPT with Code Interpreter handles most data analysis"
    },
    research: {
        tool: "Gemini Pro",
        price: 20,
        reason: "Gemini Pro has strong research and web search capabilities"
    },
    mixed: {
        tool: "Claude Pro",
        price: 20,
        reason: "Claude handles mixed workloads well at $20/month"
    }
}

// ─── AUDIT ONE TOOL ──────────────────────────────────────────
function auditTool(toolKey, plan, spend, seats, teamSize, useCase) {
    const result = {
        toolName: getToolName(toolKey),
        plan: plan,
        currentSpend: spend,
        seats: seats,
        recommendation: "",
        savings: 0,
        reason: "",
        severity: "ok" // ok | warning | danger
    }

    const officialPrice = (OFFICIAL_PRICING[toolKey]?.[plan] || 0) * seats
    const spendPerSeat = seats > 0 ? spend / seats : spend

    // ── CURSOR ──────────────────────────────────────────────
    if (toolKey === "cursor") {
        if (plan === "Business" && seats <= 3) {
            const proSavings = (40 - 20) * seats
            result.recommendation = `Downgrade to Cursor Pro`
            result.savings = proSavings
            result.reason = `Business plan is overkill for ${seats} seats. Pro has all features small teams need at $20/seat.`
            result.severity = "warning"
        } else if (plan === "Enterprise") {
            result.recommendation = "Evaluate if Enterprise features are actually used"
            result.savings = 20 * seats
            result.reason = "Enterprise adds SSO and admin controls — only worth it for 20+ seat orgs with compliance needs."
            result.severity = "warning"
        } else if (plan === "Pro" && useCase !== "coding") {
            result.recommendation = "Consider replacing with Claude Pro for non-coding tasks"
            result.savings = 0
            result.reason = "Cursor is optimized for coding. For writing/research, Claude Pro gives better ROI."
            result.severity = "ok"
        } else {
            result.recommendation = "No change needed"
            result.reason = "You're on the right Cursor plan for your team size."
            result.severity = "ok"
        }
    }

    // ── GITHUB COPILOT ───────────────────────────────────────
    else if (toolKey === "copilot") {
        if (plan === "Enterprise" && seats < 20) {
            result.recommendation = "Downgrade to Copilot Business"
            result.savings = (39 - 19) * seats
            result.reason = `Enterprise adds policy controls and audit logs — unnecessary for teams under 20. Save $${(39-19)*seats}/mo.`
            result.severity = "danger"
        } else if (plan === "Business" && seats === 1) {
            result.recommendation = "Switch to Individual plan"
            result.savings = 19 - 10
            result.reason = "Individual plan at $10/mo has the same features for solo developers."
            result.severity = "warning"
        } else if (plan === "Business" && useCase === "writing") {
            result.recommendation = "Replace with Claude Pro for writing tasks"
            result.savings = (19 * seats) - 20
            result.reason = "Copilot is a coding tool. For writing, Claude Pro at $20/mo flat is more capable."
            result.severity = "warning"
        } else {
            result.recommendation = "No change needed"
            result.reason = "Copilot is well-matched to your usage."
            result.severity = "ok"
        }
    }

    // ── CLAUDE ───────────────────────────────────────────────
    else if (toolKey === "claude") {
        if (plan === "Max" && seats === 1) {
            result.recommendation = "Downgrade to Claude Pro"
            result.savings = 100 - 20
            result.reason = "Claude Max ($100) is for very high-volume users. Pro ($20) covers 90% of use cases."
            result.severity = "danger"
        } else if (plan === "Team" && seats <= 2) {
            result.recommendation = "Switch to individual Pro plans"
            result.savings = (30 * seats) - (20 * seats)
            result.reason = `Team plan costs $30/seat. Two Pro plans = $40 vs $60 Team. Same features for small teams.`
            result.severity = "warning"
        } else if (plan === "Enterprise" && seats < 10) {
            result.recommendation = "Evaluate if Enterprise features are needed"
            result.savings = 10 * seats
            result.reason = "Enterprise adds compliance and SSO — typically only needed for 10+ seat orgs."
            result.severity = "warning"
        } else {
            result.recommendation = "No change needed"
            result.reason = "Your Claude plan looks right-sized."
            result.severity = "ok"
        }
    }

    // ── CHATGPT ──────────────────────────────────────────────
    else if (toolKey === "chatgpt") {
        if (plan === "Team" && seats <= 2) {
            result.recommendation = "Switch to individual Plus plans"
            result.savings = (30 * seats) - (20 * seats)
            result.reason = `Team plan requires minimum 2 seats at $30 each. Two Plus plans = $40 vs $60.`
            result.severity = "warning"
        } else if (plan === "Enterprise" && seats < 15) {
            result.recommendation = "Downgrade to Team plan"
            result.savings = 10 * seats
            result.reason = "Enterprise pricing is for large orgs needing custom contracts and SSO."
            result.severity = "danger"
        } else if (plan === "Plus" && useCase === "coding" && seats >= 3) {
            result.recommendation = "Consider switching to Cursor Pro for coding"
            result.savings = 0
            result.reason = "For coding teams, Cursor Pro ($20/seat) gives better IDE integration than ChatGPT."
            result.severity = "ok"
        } else {
            result.recommendation = "No change needed"
            result.reason = "Your ChatGPT plan looks appropriate."
            result.severity = "ok"
        }
    }

    // ── GEMINI ───────────────────────────────────────────────
    else if (toolKey === "gemini") {
        if (plan === "Ultra" && useCase === "coding") {
            result.recommendation = "Switch to Cursor Pro for coding"
            result.savings = (30 * seats) - (20 * seats)
            result.reason = "Gemini Ultra is not optimized for coding. Cursor Pro gives better coding ROI at $20/seat."
            result.severity = "warning"
        } else if (plan === "Pro" && seats > 1) {
            result.recommendation = "Evaluate Claude Pro as alternative"
            result.savings = 0
            result.reason = "Claude Pro matches Gemini Pro capability for writing/research at same price point."
            result.severity = "ok"
        } else {
            result.recommendation = "No change needed"
            result.reason = "Gemini plan looks appropriate for your use case."
            result.severity = "ok"
        }
    }

    // ── WINDSURF ─────────────────────────────────────────────
    else if (toolKey === "windsurf") {
        if (plan === "Teams" && seats <= 3) {
            result.recommendation = "Switch to individual Pro plans"
            result.savings = (35 - 15) * seats
            result.reason = `Teams plan overhead not worth it for ${seats} people. Pro plans save $${(35-15)*seats}/mo.`
            result.severity = "warning"
        } else {
            result.recommendation = "No change needed"
            result.reason = "Windsurf plan looks well-matched."
            result.severity = "ok"
        }
    }

    // ── API DIRECT ───────────────────────────────────────────
    else if (toolKey === "anthropic_api" || toolKey === "openai_api") {
        if (spend > 200) {
            result.recommendation = "Audit API usage — consider caching or model downgrades"
            result.savings = spend * 0.3
            result.reason = "High API spend often has 20-40% savings from switching to smaller models for simple tasks."
            result.severity = "warning"
        } else {
            result.recommendation = "API spend looks reasonable"
            result.reason = "Under $200/mo API spend is typical for small teams."
            result.severity = "ok"
        }
    }

    // ── DEFAULT ──────────────────────────────────────────────
    else {
        result.recommendation = "No change needed"
        result.reason = "Plan looks appropriate."
        result.severity = "ok"
    }

    return result
}

// ─── AUDIT ALL TOOLS ─────────────────────────────────────────
function runFullAudit(tools, teamSize, useCase) {
    const results = tools.map(t =>
        auditTool(t.tool, t.plan, t.spend, t.seats, teamSize, useCase)
    )

    const totalCurrentSpend = tools.reduce((sum, t) => sum + t.spend, 0)
    const totalSavings = results.reduce((sum, r) => sum + r.savings, 0)
    const totalAfterSavings = totalCurrentSpend - totalSavings

    return {
        results,
        totalCurrentSpend,
        totalSavings,
        totalAfterSavings,
        annualSavings: totalSavings * 12,
        isOptimal: totalSavings < 10,
        isHighSavings: totalSavings > 500
    }
}

// ─── HELPER ──────────────────────────────────────────────────
function getToolName(toolKey) {
    const names = {
        cursor: "Cursor",
        copilot: "GitHub Copilot",
        claude: "Claude",
        chatgpt: "ChatGPT",
        anthropic_api: "Anthropic API",
        openai_api: "OpenAI API",
        gemini: "Gemini",
        windsurf: "Windsurf"
    }
    return names[toolKey] || toolKey
}
//done