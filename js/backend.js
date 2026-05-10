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
                tools: tools
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

// ─── RESEND EMAIL HELPER ─────────────────────────────────────

async function sendConfirmationEmail(email, company, totalSavings, annualSavings, auditId, isHighSavings) {
    try {
        const savingsText = totalSavings > 0
            ? "Our audit found $" + Math.round(totalSavings) + "/month ($" + Math.round(annualSavings) + "/year) in potential savings for your team."
            : "Your AI stack is already well optimized. We'll notify you when new savings opportunities appear."

        const credexText = isHighSavings
            ? "<p style='margin-top:16px'><strong>Because your savings opportunity is significant, a Credex advisor will reach out to show you how to capture even more savings through discounted AI credits.</strong></p>"
            : ""

        const emailBody = {
            from: "AuditAI <onboarding@resend.dev>",
            to: email,
            subject: "Your AI Spend Audit Report",
            html: `
                <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;color:#111">
                    <div style="background:#0f0f0f;padding:32px;border-radius:12px;margin-bottom:24px">
                        <h1 style="color:#00ff88;font-size:24px;margin:0 0 8px">AuditAI</h1>
                        <p style="color:#aaa;margin:0;font-size:14px">Your AI Spend Audit Report</p>
                    </div>

                    <h2 style="font-size:20px">Hi${company ? " from " + company : ""},</h2>

                    <p style="font-size:16px;line-height:1.6;color:#333">
                        ${savingsText}
                    </p>

                    ${credexText}

                    <div style="background:#f5f5f5;border-radius:8px;padding:20px;margin:24px 0">
                        <p style="margin:0;font-size:14px;color:#666">
                            View your full audit report:
                        </p>
                        <a href="https://auditai.netlify.app/audit.html?id=${auditId}"
                           style="color:#00cc6a;font-weight:600;word-break:break-all">
                            Your Audit Report →
                        </a>
                    </div>

                    <p style="font-size:13px;color:#999;margin-top:32px">
                        AuditAI — Free AI Spend Auditor for Startups<br>
                        Built by a developer, for developers.
                    </p>
                </div>
            `
        }

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + CONFIG.RESEND_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailBody)
        })

        if (!response.ok) {
            const err = await response.text()
            console.error("Resend error:", err)
            return false
        }

        console.log("Email sent successfully")
        return true

    } catch (err) {
        console.error("Resend failed:", err)
        return false
    }
}
// done
//done
//done