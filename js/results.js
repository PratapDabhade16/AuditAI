// ─── LOAD DATA FROM LOCALSTORAGE ─────────────────────────────
const savedTools = JSON.parse(localStorage.getItem("auditai_tools") || "[]")
const teamSize = parseInt(localStorage.getItem("auditai_teamSize") || "1")
const useCase = localStorage.getItem("auditai_useCase") || "mixed"

// Redirect back if no data
if (savedTools.length === 0) {
    window.location.href = "index.html"
}

// ─── RUN AUDIT ───────────────────────────────────────────────
const audit = runFullAudit(savedTools, teamSize, useCase)

// ─── GENERATE UNIQUE AUDIT ID ────────────────────────────────
let auditId = localStorage.getItem("auditai_current_id")
if (!auditId) {
    auditId = crypto.randomUUID()
    localStorage.setItem("auditai_current_id", auditId)
}

// ─── RENDER HERO SAVINGS ─────────────────────────────────────
function renderHero() {
    const heroSavings = document.getElementById("heroSavings")
    const heroAnnual = document.getElementById("heroAnnual")
    const optimalBadge = document.getElementById("optimalBadge")
    const credexBanner = document.getElementById("credexBanner")

    heroSavings.textContent = "$" + Math.round(audit.totalSavings)

    if (audit.totalSavings > 0) {
        heroAnnual.innerHTML = "That's <span>$" + Math.round(audit.annualSavings) + "/year</span> you could keep"
    }

    if (audit.isOptimal) {
        optimalBadge.style.display = "block"
        heroSavings.style.color = "#ffffff"
    }

    if (audit.isHighSavings) {
        credexBanner.style.display = "block"
    }
}

// ─── RENDER TOOL BREAKDOWN ───────────────────────────────────
function renderBreakdown() {
    const container = document.getElementById("toolBreakdown")
    container.innerHTML = ""

    audit.results.forEach(function(result) {
        const card = document.createElement("div")
        card.className = "tool-result-card " + result.severity

        const savingsHtml = result.savings > 0
            ? '<div class="tool-savings-badge">-$' + Math.round(result.savings) + '/mo</div>'
            : '<div class="tool-savings-badge no-savings">Optimized ✓</div>'

        const afterSavings = result.savings > 0
            ? '<div>After savings: <span>$' + Math.round(result.currentSpend - result.savings) + '/mo</span></div>'
            : ""

        card.innerHTML =
            '<div class="tool-result-header">' +
                '<div>' +
                    '<div class="tool-result-name">' + result.toolName + '</div>' +
                    '<div class="tool-result-plan">' + result.plan + ' · ' + result.seats + ' seat' + (result.seats > 1 ? 's' : '') + '</div>' +
                '</div>' +
                savingsHtml +
            '</div>' +
            '<div class="tool-result-recommendation">' + result.recommendation + '</div>' +
            '<div class="tool-result-reason">' + result.reason + '</div>' +
            '<div class="tool-spend-row">' +
                '<div>Current: <span>$' + result.currentSpend + '/mo</span></div>' +
                afterSavings +
            '</div>'

        container.appendChild(card)
    })
}

// ─── GENERATE AI SUMMARY VIA GROQ ────────────────────────────
async function generateSummary() {
    const summaryEl = document.getElementById("summaryText")

    const toolsList = audit.results.map(function(r) {
        return r.toolName + " (" + r.plan + "): $" + r.currentSpend + "/mo — " + r.recommendation
    }).join("\n")

    const prompt = "You are an AI spend analyst. Write a 80-100 word personalized audit summary for a startup.\n\n" +
        "Their AI tools:\n" + toolsList + "\n\n" +
        "Team size: " + teamSize + "\n" +
        "Primary use case: " + useCase + "\n" +
        "Total monthly savings opportunity: $" + Math.round(audit.totalSavings) + "\n" +
        "Annual savings: $" + Math.round(audit.annualSavings) + "\n\n" +
        "Write a direct, honest, friendly summary. Start with their biggest win. Be specific with numbers. End with one actionable next step. Plain paragraph only, no bullet points."

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + CONFIG.GROQ_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                max_tokens: 150,
                messages: [{ role: "user", content: prompt }]
            })
        })

        const data = await response.json()
        const text = data.choices && data.choices[0] && data.choices[0].message.content

        if (text) {
            summaryEl.textContent = text
        } else {
            throw new Error("No response")
        }

    } catch (error) {
        // Fallback summary if Groq fails
        const biggestSaving = audit.results.find(function(r) { return r.savings > 0 })
        if (audit.totalSavings > 0 && biggestSaving) {
            summaryEl.textContent = "Your AI stack is costing $" + Math.round(audit.totalCurrentSpend) +
                "/month across " + audit.results.length + " tool" + (audit.results.length > 1 ? "s" : "") + ". " +
                "Your biggest opportunity is " + biggestSaving.toolName + " — " + biggestSaving.recommendation + ". " +
                "In total you could save $" + Math.round(audit.totalSavings) +
                "/month ($" + Math.round(audit.annualSavings) + "/year). Start with " +
                biggestSaving.toolName + " this week."
        } else {
            summaryEl.textContent = "Your AI stack of " + audit.results.length + " tool" +
                (audit.results.length > 1 ? "s" : "") + " is well optimized. " +
                "You're spending $" + Math.round(audit.totalCurrentSpend) +
                "/month and your plans are well matched to your team size and use case. " +
                "We'll notify you when new savings opportunities apply to your stack."
        }
    }
}

// ─── EMAIL SUBMIT ─────────────────────────────────────────────
async function submitEmail() {
    // Honeypot check
    if (document.getElementById("honeypot").value !== "") return

    const email = document.getElementById("emailInput").value.trim()
    if (!email || !email.includes("@")) {
        alert("Please enter a valid email address")
        return
    }

    const company = document.getElementById("companyInput").value.trim()
    const role = document.getElementById("roleInput").value.trim()

    // Disable button to prevent double submit
    const btn = document.querySelector(".email-submit-btn")
    btn.textContent = "Saving..."
    btn.disabled = true

    // 1 — Save to Supabase
    const saved = await saveAuditToSupabase(
        auditId,
        email,
        company,
        role,
        teamSize,
        useCase,
        audit,
        savedTools
    )

    // 2 — Send confirmation email via Resend
    await sendConfirmationEmail(
        email,
        company,
        audit.totalSavings,
        audit.annualSavings,
        auditId,
        audit.isHighSavings
    )

    // 3 — Always show success to user
    document.getElementById("emailSuccess").style.display = "block"
    btn.style.display = "none"

    if (!saved) {
        // Fallback to localStorage if Supabase fails
        localStorage.setItem("auditai_lead", JSON.stringify({
            id: auditId,
            email: email,
            company: company,
            role: role,
            totalSavings: audit.totalSavings,
            createdAt: new Date().toISOString()
        }))
        console.log("Supabase failed — saved to localStorage")
    }
}

// ─── SHARE URL ───────────────────────────────────────────────
function setupShareUrl() {
    document.getElementById("shareUrl").value =
        window.location.origin + "/audit.html?id=" + auditId
}

function copyShareUrl() {
    const input = document.getElementById("shareUrl")
    navigator.clipboard.writeText(input.value)
    document.querySelector(".copy-btn").textContent = "Copied! ✓"
    setTimeout(function() {
        document.querySelector(".copy-btn").textContent = "Copy Link"
    }, 2000)
}

// ─── INIT ────────────────────────────────────────────────────
renderHero()
renderBreakdown()
generateSummary()
setupShareUrl()