// ─── TOOL OPTIONS ───────────────────────────────────────────
const TOOLS = {
    cursor: {
        name: "Cursor",
        plans: ["Hobby (Free)", "Pro", "Business", "Enterprise"]
    },
    copilot: {
        name: "GitHub Copilot",
        plans: ["Individual", "Business", "Enterprise"]
    },
    claude: {
        name: "Claude (Anthropic)",
        plans: ["Free", "Pro", "Max", "Team", "Enterprise", "API Direct"]
    },
    chatgpt: {
        name: "ChatGPT (OpenAI)",
        plans: ["Plus", "Team", "Enterprise", "API Direct"]
    },
    anthropic_api: {
        name: "Anthropic API Direct",
        plans: ["Pay as you go"]
    },
    openai_api: {
        name: "OpenAI API Direct",
        plans: ["Pay as you go"]
    },
    gemini: {
        name: "Gemini (Google)",
        plans: ["Free", "Pro", "Ultra", "API Direct"]
    },
    windsurf: {
        name: "Windsurf",
        plans: ["Free", "Pro", "Teams"]
    }
}

let toolCount = 0

// ─── ADD TOOL CARD ───────────────────────────────────────────
function addToolCard(savedData = null) {
    toolCount++
    const id = toolCount
    const container = document.getElementById("toolsContainer")

    const card = document.createElement("div")
    card.className = "tool-card"
    card.id = `tool-card-${id}`

    // Build tool dropdown options
    const toolOptions = Object.entries(TOOLS).map(([key, val]) =>
        `<option value="${key}">${val.name}</option>`
    ).join("")

    card.innerHTML = `
        <div class="tool-card-header">
            <h3>Tool ${id}</h3>
            <button class="remove-btn" onclick="removeToolCard(${id})">✕ Remove</button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Tool</label>
                <select id="tool-name-${id}" onchange="updatePlans(${id})">
                    ${toolOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Plan</label>
                <select id="tool-plan-${id}"></select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Monthly Spend (USD $)</label>
                <input type="number" id="tool-spend-${id}" 
                    placeholder="e.g. 40" min="0" />
            </div>
            <div class="form-group">
                <label>Number of Seats</label>
                <input type="number" id="tool-seats-${id}" 
                    placeholder="e.g. 2" min="1" value="1" />
            </div>
        </div>
    `

    container.appendChild(card)
    updatePlans(id)

    // Restore saved data if exists
    if (savedData) {
        document.getElementById(`tool-name-${id}`).value = savedData.tool
        updatePlans(id)
        document.getElementById(`tool-plan-${id}`).value = savedData.plan
        document.getElementById(`tool-spend-${id}`).value = savedData.spend
        document.getElementById(`tool-seats-${id}`).value = savedData.seats
    }

    saveToLocalStorage()
}

// ─── UPDATE PLAN DROPDOWN ────────────────────────────────────
function updatePlans(id) {
    const toolKey = document.getElementById(`tool-name-${id}`).value
    const planSelect = document.getElementById(`tool-plan-${id}`)
    const plans = TOOLS[toolKey].plans

    planSelect.innerHTML = plans.map(p =>
        `<option value="${p}">${p}</option>`
    ).join("")

    saveToLocalStorage()
}

// ─── REMOVE TOOL CARD ────────────────────────────────────────
function removeToolCard(id) {
    document.getElementById(`tool-card-${id}`).remove()
    saveToLocalStorage()
}

// ─── SAVE TO LOCALSTORAGE ────────────────────────────────────
function saveToLocalStorage() {
    const tools = collectFormData()
    localStorage.setItem("auditai_tools", JSON.stringify(tools))
    localStorage.setItem("auditai_teamSize", document.getElementById("teamSize").value)
    localStorage.setItem("auditai_useCase", document.getElementById("useCase").value)
}

// ─── COLLECT FORM DATA ───────────────────────────────────────
function collectFormData() {
    const tools = []
    for (let i = 1; i <= toolCount; i++) {
        const nameEl = document.getElementById(`tool-name-${i}`)
        if (!nameEl) continue
        tools.push({
            tool: nameEl.value,
            plan: document.getElementById(`tool-plan-${i}`).value,
            spend: parseFloat(document.getElementById(`tool-spend-${i}`).value) || 0,
            seats: parseInt(document.getElementById(`tool-seats-${i}`).value) || 1
        })
    }
    return tools
}

// ─── RESTORE FROM LOCALSTORAGE ───────────────────────────────
function restoreFromLocalStorage() {
    const savedTools = JSON.parse(localStorage.getItem("auditai_tools") || "[]")
    const savedTeamSize = localStorage.getItem("auditai_teamSize")
    const savedUseCase = localStorage.getItem("auditai_useCase")

    if (savedTeamSize) document.getElementById("teamSize").value = savedTeamSize
    if (savedUseCase) document.getElementById("useCase").value = savedUseCase

    if (savedTools.length > 0) {
        savedTools.forEach(t => addToolCard(t))
    } else {
        addToolCard() // start with one empty card
    }
}

// ─── RUN AUDIT ───────────────────────────────────────────────
function runAudit() {
    const tools = collectFormData()
    const teamSize = parseInt(document.getElementById("teamSize").value)
    const useCase = document.getElementById("useCase").value

    if (tools.length === 0) {
        alert("Please add at least one AI tool!")
        return
    }

    const hasSpend = tools.some(t => t.spend > 0)
    if (!hasSpend) {
        alert("Please enter your monthly spend for at least one tool!")
        return
    }

    // Save everything and go to results
    saveToLocalStorage()
    localStorage.setItem("auditai_teamSize", teamSize)
    localStorage.setItem("auditai_useCase", useCase)

    window.location.href = "results.html"
}

// ─── AUTO SAVE ON CHANGE ─────────────────────────────────────
document.getElementById("teamSize").addEventListener("change", saveToLocalStorage)
document.getElementById("useCase").addEventListener("change", saveToLocalStorage)

// ─── INIT ────────────────────────────────────────────────────
restoreFromLocalStorage()