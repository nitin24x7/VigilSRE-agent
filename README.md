# VigilSRE 🛡️🤖
### Autonomous SRE Incident Triage & Hotfix Agent powered by TrueForge, Daytona, and Qodo

VigilSRE is an autonomous site reliability engineering agent designed to ingest production crash alerts, isolate failures inside Daytona sandboxes, synthesize verified hotfixes, audit code changes using Qodo, and halt at a strict **Human-in-the-Loop Approval Checkpoint** before dispatching pull requests to GitHub.

---

## Architecture & Tech Stack
* **Agent Harness:** TrueForge runtime engine (`npx @truefoundry/trueforge`) with MCP tool routing.
* **Sandbox Execution:** Daytona isolated containers (`sb-9842`).
* **Code Quality Assurance:** Qodo automated pull request reviews and static security checks.
* **Frontend Dashboard:** React 18, TypeScript, Tailwind CSS, and Lucide Icons (MacOS-inspired Dark Terminal UI).
* **LLM Core:** Gemini 3.7 Flash.

---

## Qodo Code Review Evidence
To demonstrate rigorous engineering standards, all agent components and configuration specifications were vetted through automated Qodo code reviews prior to merging into `main`:
* **Pull Request #1:** [View Merged PR #1 - Agent Specification & Guardrails](https://github.com/nitin24x7/VigilSRE-agent/pull/1)
  * *Qodo finding addressed:* Corrected JSON formatting on `agent.json` by stripping shell heredoc wrappers to ensure robust parser compatibility.

---

## Quick Start & Local Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone [https://github.com/nitin24x7/VigilSRE-agent.git](https://github.com/nitin24x7/VigilSRE-agent.git)
   cd VigilSRE-agent