# 🛡️ VigilSRE: Autonomous AI Site Reliability Engineer

VigilSRE is an autonomous SRE harness that monitors live microservices, detects critical crashes (such as `SIGSEGV` Exit 139 and connection pool exhaustion), isolates bugs inside Daytona sandboxes, audits hotfixes with Qodo, and dispatches verified GitHub Pull Requests under strict TrueForge Human Approval Gates.

---

## ⚡ Key Features

- **Autonomous Crash Detection & Live Port Polling:** Real-time polling monitors application ports and triggers immediate diagnostic pipelines upon failure.
- **TrueForge Execution Runtime:** Orchestrates autonomous agent loops, context engineering, tool executions, and security governance.
- **Daytona Isolated Sandboxing:** Safely replicates crashes and validates generated patches inside isolated environments.
- **Qodo Static Code Guardrail:** Audits synthetic patches for memory leaks, contract safety, and zero security regressions.
- **Human-in-the-Loop Checkpoints:** Mandates human operator authorization before creating and merging remote GitHub Pull Requests.
- **One-Click Canary Rollback:** Instantly reroutes production traffic back to verified stable commits.
- **Autonomous Post-Mortem & RCA:** Calculates Mean Time to Resolution (MTTR) and exports Markdown incident reports.

---

## 🛠️ Architecture & Workflow

1. **Detection:** Live port poller or webhooks detect service termination.
2. **Ingestion & Diagnosis:** TrueForge analyzes regressing commits and triggers Daytona sandbox containers.
3. **Synthesis & Test Verification:** Gemini synthesizes bounds-checked fixes and runs sandbox test suites until passing (3/3).
4. **Qodo Audit:** Automated review scans diffs for enterprise security compliance.
5. **Human Approval Gate:** Execution pauses on the dashboard for operator review.
6. **Dispatch & Recovery:** Upon operator authorization, a real Pull Request is created on GitHub and merged.

---

## 🚀 Quick Start & Installation

### 1. Clone & Setup
git clone [https://github.com/](https://github.com/)<your-username>/VigilSRE-agent.git
cd VigilSRE-agent
npm install
cd web && npm install && cd ..
2. Configure Environment (.env)
Bash
cat << 'EOF' > .env
PORT=4000
TRUEFORGE_URL=http://localhost:8790
GEMINI_API_KEY=your_gemini_api_key
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_target_repo
EOF
3. Run the Services (in 3 Terminal Windows)
Terminal 1 (TrueForge Engine): npx @truefoundry/trueforge

Terminal 2 (API Bridge): npm run server

Terminal 3 (Dashboard): cd web && npm run dev

Open http://localhost:5173 to access the Mission Control dashboard.


---

### 4. Step-by-Step 

#### Step A: Push a Real Target Repo to Your GitHub
1. Create a repository on your GitHub account called `dummy-auth-gateway`.
2. Push your `dummy-auth-site` code to it:
   cd ~/dummy-auth-site
   git remote add origin https://github.com/<your-username>/dummy-auth-gateway.git
   git branch -M main
   git push -u origin main
Step B: Start All 4 Terminals
Terminal 1: npx @truefoundry/trueforge

Terminal 2: cd ~/VigilSRE-agent && npm run server

Terminal 3: cd ~/VigilSRE-agent/web && npm run dev

Terminal 4: cd ~/dummy-auth-site && node server.js
