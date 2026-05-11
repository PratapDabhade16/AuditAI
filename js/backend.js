// ─── SUPABASE HELPERS ────────────────────────────────────────

// Save audit + lead to Supabase
async function saveAuditToSupabase(auditId, email, company, role, teamSize, useCase, audit, tools) {
    try {
        const response = await fetch(CONFIG.SUPABASE_URL + "/rest/v1/audits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": CONFIG.SUPABASE_ANON_KEY,
                "Authorization": "Bearer " + CONFIG.SUPABASE_ANON_KEY,
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({
                id: auditId,
                email: email,
                company: company || null,
                role: role || null,
                team_size: teamSize,
                use_case: useCase,
                total_spend: audit.totalCurrentSpend,
                total_savings: audit.totalSavings,
                annual_savings: audit.annualSavings,
                tools: JSON.stringify(tools)
            })
        })

        if (!response.ok) {
            const err = await response.text()
            console.error("Supabase error:", err)
            return false
        }

        console.log("Saved to Supabase successfully")
        return true

    } catch (err) {
        console.error("Supabase save failed:", err)
        return false
    }
}

// Get audit from Supabase by ID (for shareable URL)
async function getAuditFromSupabase(auditId) {
    try {
        const response = await fetch(
            CONFIG.SUPABASE_URL + "/rest/v1/audits?id=eq." + auditId + "&select=*",
            {
                headers: {
                    "apikey": CONFIG.SUPABASE_ANON_KEY,
                    "Authorization": "Bearer " + CONFIG.SUPABASE_ANON_KEY
                }
            }
        )

        const data = await response.json()
        if (data && data.length > 0) return data[0]
        return null

    } catch (err) {
        console.error("Supabase fetch failed:", err)
        return null
    }
}

// ─── EMAILJS HELPER ──────────────────────────────────────────

async function sendConfirmationEmail(email, company, totalSavings, annualSavings, auditId, isHighSavings) {
    try {
        emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY)

        const credexMessage = isHighSavings
            ? "Because your savings opportunity is over $500/month, a Credex advisor will reach out to help you save even more through discounted AI credits."
            : "We will notify you when new savings opportunities apply to your stack."

        await emailjs.send(
            CONFIG.EMAILJS_SERVICE_ID,
            CONFIG.EMAILJS_TEMPLATE_ID,
            {
                to_email: email,
                to_name: company || "there",
                total_savings: "$" + Math.round(totalSavings),
                annual_savings: "$" + Math.round(annualSavings) + "/year",
                audit_url: "https://spendaudit.netlify.app/audit.html?id=" + auditId,
                credex_message: credexMessage
            }
        )

        console.log("Email sent via EmailJS!")
        return true

    } catch (err) {
        console.error("EmailJS failed:", err)
        return false
    }
}