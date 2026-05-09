// ─── CONFIG ──────────────────────────────────────────────────
// Replace with your actual Groq API key


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

    heroSavings.textContent = `$${audit.totalSavings.toFixed(0)}`

    if (audit.totalSavings > 0) {
        heroAnnual.innerHTML = `That's <span>$${audit.annualSavings.toFixed(0)}/year</span> you could keep`
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

    audit.results.forEach(result => {
        const card = document.createElement("div")
        card.className = `tool-result-card ${result.severity}`

        const savingsHtml = result.savings > 0
            ? `<div class="tool-savings-badge">-$${result.savings.toFixed(0)}/mo</div>`
            : `<div class="tool-savings-badge no-savings">Optimized ✓</div>`

        card.innerHTML = `
            <div class="tool-result-header">
                <div>
                    <div class="tool-result-name">${result.toolName}</div>
                    <div class="tool-result-plan">${result.plan} · ${result.seats} seat${result.seats > 1 ? 's' : ''}</div>
                </div>
                ${savingsHtml}
            </div>
            <div class="tool-result-recommendation">${result.recommendation}</div>
            <div class="tool-result-reason">${result.reason}</div>
            <div class="tool-spend-row">
                <div>Current spend: <span>$${result.currentSpend}/mo</span></div>
                ${result.savings > 0 ? `<div>After savings: <span>$${(result.currentSpend - result.savings).toFixed(0)}/mo</span></div>` : ''}
            </div>
        `
        container.appendChild(card)
    })
}

// ─── GENERATE AI SUMMARY VIA GROQ ────────────────────────────
async function generateSummary() {
    const summaryEl = document.getElementById("summaryText")

    const toolsList = audit.results.map(r =>
        `${r.toolName} (${r.plan}): $${r.currentSpend}/mo — ${r.recommendation}`
    ).join("\n")

    const prompt = `You are an AI spend analyst. Write a 80-100 word personalized audit summary for a startup.

Their AI tools:
${toolsList}

Team size: ${teamSize}
Primary use case: ${useCase}
Total monthly savings opportunity: $${audit.totalSavings.toFixed(0)}
Annual savings: $${audit.annualSavings.toFixed(0)}

Write a direct, honest, friendly summary. Start with their biggest win. Be specific with numbers. End with one actionable next step. Do not use bullet points. Plain paragraph only.`

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                max_tokens: 150,
                messages: [{ role: "user", content: prompt }]
            })
        })

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content

        if (text) {
            summaryEl.textContent = text
        } else {
            throw new Error("No response")
        }

    } catch (error) {
        // Fallback summary if API fails
        summaryEl.textContent = `Your AI stack is costing $${audit.totalCurrentSpend}/month across ${audit.results.length} tool${audit.results.length > 1 ? 's' : ''}. ${audit.totalSavings > 0 ? `Our analysis shows you could save $${audit.totalSavings.toFixed(0)}/month ($${audit.annualSavings.toFixed(0)}/year) by right-sizing your plans. Your biggest opportunity is ${audit.results.find(r => r.savings > 0)?.toolName || 'your current stack'}. Start there first.` : `You're already spending efficiently — your plans are well matched to your team size and use case.`}`
    }
}

// ─── EMAIL SUBMIT ─────────────────────────────────────────────
async function submitEmail() {
    // Honeypot check — if filled, it's a bot
    if (document.getElementById("honeypot").value !== "") return

    const email = document.getElementById("emailInput").value.trim()
    if (!email || !email.includes("@")) {
        alert("Please enter a valid email address")
        return
    }

    const company = document.getElementById("companyInput").value.trim()
    const role = document.getElementById("roleInput").value.trim()

    // For now store in localStorage
    // Tomorrow (Day 4) we connect this to Supabase
    const leadData = {
        id: auditId,
        email,
        company,
        role,
        teamSize,
        useCase,
        totalSavings: audit.totalSavings,
        tools: savedTools,
        createdAt: new Date().toISOString()
    }

    localStorage.setItem("auditai_lead", JSON.stringify(leadData))

    // Show success
    document.getElementById("emailSuccess").style.display = "block"
    document.querySelector(".email-submit-btn").style.display = "none"

    console.log("Lead captured:", leadData)
    // Day 4: replace console.log with Supabase insert + Resend email
}

// ─── SHARE URL ───────────────────────────────────────────────
function setupShareUrl() {
    const shareInput = document.getElementById("shareUrl")
    // For now use current URL + audit ID
    // Day 5: this becomes yoursite.com/audit/auditId
    shareInput.value = `${window.location.origin}/audit.html?id=${auditId}`
}

function copyShareUrl() {
    const shareInput = document.getElementById("shareUrl")
    navigator.clipboard.writeText(shareInput.value)
    document.querySelector(".copy-btn").textContent = "Copied! ✓"
    setTimeout(() => {
        document.querySelector(".copy-btn").textContent = "Copy Link"
    }, 2000)
}

// ─── INIT ────────────────────────────────────────────────────
renderHero()
renderBreakdown()
generateSummary()
setupShareUrl()

//done