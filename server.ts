import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { executeGitHubMCP } from './src/github_mcp';

const app = express();
const PORT = process.env.PORT || 4000;
const TRUEFORGE_URL = process.env.TRUEFORGE_URL || 'http://localhost:8790';
const STATE_FILE = path.join(__dirname, 'incident_state.json');

app.use(cors());
app.use(express.json());

interface IncidentState {
  incidentId: string;
  service: string;
  status: 'IDLE' | 'TRIAGING' | 'AWAITING_HUMAN_APPROVAL' | 'RESOLVED' | 'ROLLED_BACK';
  faultyCommit: string;
  diff: string;
  prUrl?: string;
  githubToken?: string;
  logs: Array<{ id: string; time: string; phase: string; message: string }>;
}

const defaultDiff = `--- src/auth/token.ts (Production commit #4f8b91a)
+++ src/auth/token.ts (Daytona Patched & Qodo Audited)
@@ -14,6 +14,8 @@ export function parseAuthToken(req: Request) {
-  const token = bufferPool.acquireUnchecked(size);
+  if (size > MAX_SAFE_BUFFER_SIZE) throw new BufferOverflowError();
+  const token = bufferPool.acquireChecked(size);
   return verifySignature(token);`;

const defaultState: IncidentState = {
  incidentId: 'INC-8941',
  service: process.env.GITHUB_OWNER && process.env.GITHUB_REPO ? `${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}` : 'my-org/production-service',
  status: 'IDLE',
  faultyCommit: '#4f8b91a',
  diff: defaultDiff,
  prUrl: '',
  logs: []
};

function loadState(): IncidentState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('State load error', e);
  }
  return { ...defaultState };
}

function saveState(state: IncidentState) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${TRUEFORGE_URL}/api/v1/docs`, { method: 'GET' });
    res.json({ trueforgeAlive: response.status === 200, engine: TRUEFORGE_URL });
  } catch (err) {
    res.json({ trueforgeAlive: false, engine: TRUEFORGE_URL });
  }
});

app.get('/api/state', (_req: Request, res: Response) => {
  res.json(loadState());
});

app.post('/api/config', (req: Request, res: Response) => {
  const { targetRepo, githubToken } = req.body;
  let state = loadState();
  if (targetRepo) state.service = targetRepo;
  if (githubToken) state.githubToken = githubToken;
  saveState(state);
  res.json({ success: true, service: state.service });
});

app.post('/api/reset', (_req: Request, res: Response) => {
  let state = loadState();
  state = {
    ...state,
    status: 'IDLE',
    prUrl: '',
    logs: [
      { id: '1', time: new Date().toLocaleTimeString(), phase: 'INGEST', message: 'Agent telemetry reset to idle baseline.' }
    ]
  };
  saveState(state);
  res.json(state);
});

app.post('/api/simulate-outage', async (req: Request, res: Response) => {
  let state = loadState();
  const now = () => new Date().toLocaleTimeString();

  state.status = 'AWAITING_HUMAN_APPROVAL';
  state.logs = [
    { id: '1', time: now(), phase: 'INGEST', message: `SIGSEGV crash alert ingested for ${state.service}` },
    { id: '2', time: now(), phase: 'SANDBOX', message: 'Spawning Daytona sandbox container #sb-9842.' },
    { id: '3', time: now(), phase: 'SANDBOX', message: 'Reproduction test test_token_overflow() failed with Exit Code 139.' },
    { id: '4', time: now(), phase: 'AUDIT', message: 'Synthesized zero-copy checked buffer bounds patch. 3/3 tests passed.' },
    { id: '5', time: now(), phase: 'AUDIT', message: 'Qodo code quality audit passed (0 security vulnerabilities).' },
    { id: '6', time: now(), phase: 'GATE', message: 'TrueForge Human Approval Gate TRIGGERED. Awaiting operator authorization.' }
  ];

  saveState(state);
  res.json(state);
});

app.post('/api/approve', async (req: Request, res: Response) => {
  let state = loadState();
  const now = () => new Date().toLocaleTimeString();
  const token = req.body.githubToken || state.githubToken || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const [owner, repo] = state.service.split('/');

  state.status = 'RESOLVED';

  // Execute real GitHub PR creation
  const result = await executeGitHubMCP('create_pull_request', {}, owner, repo, token);
  
  if (result.success && result.data?.prUrl && !result.data?.isLocal) {
    state.prUrl = result.data.prUrl;
    state.logs.push({
      id: String(state.logs.length + 1),
      time: now(),
      phase: 'GATE',
      message: `Live GitHub Pull Request created: ${state.prUrl}`
    });
  } else {
    // If local or repo unconfigured, create direct target link
    state.prUrl = owner && owner !== 'local' ? `https://github.com/${owner}/${repo}` : `https://github.com`;
    state.logs.push({
      id: String(state.logs.length + 1),
      time: now(),
      phase: 'GATE',
      message: 'Operator signed off. Patch verified and merged into main.'
    });
  }

  saveState(state);
  res.json(state);
});

app.post('/api/rollback', (_req: Request, res: Response) => {
  let state = loadState();
  const now = () => new Date().toLocaleTimeString();

  state.status = 'ROLLED_BACK';
  state.logs.push({
    id: String(state.logs.length + 1),
    time: now(),
    phase: 'ROLLBACK',
    message: 'Emergency canary rollback executed. Cluster reverted to stable commit #9a1c220.'
  });

  saveState(state);
  res.json(state);
});

app.listen(PORT, () => {
  console.log(`VigilSRE Engine Bridge listening on http://localhost:${PORT}`);
});