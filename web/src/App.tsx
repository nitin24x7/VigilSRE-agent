import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  ExternalLink, 
  Bot, 
  GitBranch, 
  GitCommit,
  GitPullRequest,
  Search, 
  Check, 
  X, 
  FileCode2, 
  Lock, 
  Sparkles, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  FolderGit2, 
  Settings, 
  Layers,
  Send,
  Sliders,
  Activity,
  Radio,
  ArrowUpRight,
  UserCheck,
  Server,
  Workflow,
  Clock,
  RefreshCw,
  ShieldAlert,
  ArrowDown
} from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

interface GitCommitItem {
  hash: string;
  branch: string;
  message: string;
  author: string;
  timestamp: string;
  status: 'passed' | 'failed' | 'pending';
}

interface PRItem {
  number: number;
  title: string;
  author: string;
  branch: string;
  qodoAudit: string;
  status: 'Merged' | 'Open' | 'Reviewing';
  url: string;
}

export default function VigilSREApp() {
  const [activeNav, setActiveNav] = useState<'incidents' | 'tree' | 'prs' | 'fleet' | 'terminal'>('incidents');
  const [activeTab, setActiveTab] = useState<'diff' | 'trace'>('diff');
  
  // Real backend telemetry
  const [engineAlive, setEngineAlive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live second-by-second telemetry
  const [liveCpu, setLiveCpu] = useState(41.4);
  const [liveLatency, setLiveLatency] = useState(22);
  const [tickerTime, setTickerTime] = useState(new Date().toLocaleTimeString());
  const [canaryShedding, setCanaryShedding] = useState(false);

  // Editable configuration
  const [config, setConfig] = useState({
    trueforgeUrl: 'http://localhost:8790',
    daytonaId: 'sb-9842-isolated-env',
    geminiKey: 'AIzaSyD-••••••••••••••••••••••••',
    modelName: 'Gemini 3.7 Flash',
    targetRepo: 'nitin24x7/VigilSRE-agent',
    targetBranch: 'main'
  });

  // Terminal commands
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'VigilSRE Autonomous Kernel v1.2.0-prod [Active]',
    'TrueForge Runtime Bridge mounted at http://localhost:8790',
    'Repository: nitin24x7/VigilSRE-agent (tracking: main, feat/phase2-trueforge-agent)',
    'Type "help", "status", "rollback", or "triage" for autonomous commands.'
  ]);

  const [incident, setIncident] = useState({
    incidentId: 'INC-8941',
    service: 'nitin24x7/VigilSRE-agent',
    status: 'IDLE',
    faultyCommit: '#4f8b91a',
    diff: '',
    prUrl: 'https://github.com/nitin24x7/VigilSRE-agent/pull/1',
    logs: [] as Array<{ id: string; time: string; phase: string; message: string }>
  });

  // Simulated Commit Graph & History Tree
  const commits: GitCommitItem[] = [
    {
      hash: '55da8e7',
      branch: 'main',
      message: 'feat(ui): implement live telemetry dashboard & interactive console',
      author: 'nitin24x7',
      timestamp: 'Just now',
      status: 'passed'
    },
    {
      hash: 'd8d08f3',
      branch: 'main',
      message: 'Merge pull request #1 from nitin24x7/feat/phase2-trueforge-agent',
      author: 'nitin24x7',
      timestamp: '15m ago',
      status: 'passed'
    },
    {
      hash: '83d455a',
      branch: 'feat/phase2-trueforge-agent',
      message: 'fix(agent): remove bash heredoc wrappers to ensure valid json specification',
      author: 'nitin24x7',
      timestamp: '22m ago',
      status: 'passed'
    },
    {
      hash: '4f8b91a',
      branch: 'main',
      message: 'perf(auth): bypass bounds allocation in token worker threads',
      author: 'auth-team',
      timestamp: '1h ago',
      status: 'failed'
    },
    {
      hash: '9a1c220',
      branch: 'main',
      message: 'chore: initialize VigilSRE monorepo structure & Daytona sandbox setup',
      author: 'nitin24x7',
      timestamp: '3h ago',
      status: 'passed'
    }
  ];

  // Verified Pull Requests
  const pullRequests: PRItem[] = [
    {
      number: 1,
      title: 'feat(agent): initialize TrueForge agent specification & approval gates',
      author: 'nitin24x7',
      branch: 'feat/phase2-trueforge-agent -> main',
      qodoAudit: 'Passed (0 High / Med Defects)',
      status: 'Merged',
      url: 'https://github.com/nitin24x7/VigilSRE-agent/pull/1'
    }
  ];

  // Clock & Metrics Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString());
      setLiveCpu(prev => Number((Math.max(16, Math.min(84, prev + (Math.random() * 4 - 2)))).toFixed(1)));
      setLiveLatency(prev => Math.floor(Math.max(14, Math.min(55, prev + (Math.random() * 4 - 2)))));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchState = async () => {
    try {
      const [stateRes, healthRes] = await Promise.all([
        axios.get(`${API_BASE}/state`),
        axios.get(`${API_BASE}/health`)
      ]);
      setIncident(stateRes.data);
      setEngineAlive(healthRes.data.trueforgeAlive);
    } catch (err) {
      console.error('Backend offline', err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/simulate-outage`);
      setIncident(res.data);
      setActiveNav('incidents');
      showToast('P0 Incident Triggered: Daytona Sandbox Spawned');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/approve`);
      setIncident(res.data);
      showToast('TrueForge Approval Gate: Hotfix PR Dispatched to Production');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset`);
      setIncident(res.data);
      showToast('Incident State Reset to Healthy Baseline');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    const cmd = terminalInput.trim().toLowerCase();
    const newHist = [...terminalHistory, `> ${terminalInput}`];

    if (cmd === 'help') {
      newHist.push('Available commands: status, triage, rollback, sandbox, qodo, pr, fleet, clear');
    } else if (cmd === 'status') {
      newHist.push(`Target: ${config.targetRepo} | Branch: ${config.targetBranch} | Incident: ${incident.status}`);
    } else if (cmd === 'triage') {
      handleSimulate();
      newHist.push('Simulating P0 SIGSEGV incident triage cycle...');
    } else if (cmd === 'rollback') {
      setCanaryShedding(true);
      newHist.push('Initiating instant canary traffic shift away from failing nodes...');
      showToast('Traffic shed to fallback healthy cluster');
    } else if (cmd === 'fleet') {
      newHist.push('Node Cluster ap-south-1: 3 Nodes Active (ap-south-1a, ap-south-1b, ap-south-1c)');
    } else if (cmd === 'clear') {
      setTerminalHistory(['Console cleared.']);
      setTerminalInput('');
      return;
    } else {
      newHist.push(`Command not recognized: "${cmd}". Type "help".`);
    }

    setTerminalHistory(newHist);
    setTerminalInput('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#04060A] text-[#E6EDF3] selection:bg-[#EE0000]/30 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-8 z-50 bg-[#101622] border border-[#EE0000] text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 font-mono text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-[#EE0000]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: High-Contrast Live Operations Bar */}
      <header className="h-20 bg-[#080C14] border-b border-[#1E2635] px-6 flex items-center justify-between shrink-0 shadow-2xl z-30">
        
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-[#2D3748] flex items-center justify-center p-1.5 shadow-xl shrink-0">
            <img 
              src="/icon.png" 
              alt="VigilSRE" 
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-3xl font-black tracking-tight leading-none flex items-center">
              <span className="text-[#EE0000]">Vigil</span>
              <span className="text-white">SRE</span>
            </div>
            <div className="text-[11px] text-[#8B949E] tracking-wider uppercase font-mono mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EE0000] inline-block animate-ping"></span>
              Autonomous Agent Harness & Triage
            </div>
          </div>
        </div>

        {/* Live Second-by-Second Telemetry */}
        <div className="hidden xl:flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#0D121D] border border-[#1E2635] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#8B949E]" />
            <span className="text-white font-bold">{tickerTime}</span>
          </div>

          <div className="bg-[#0D121D] border border-[#1E2635] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${engineAlive ? 'bg-[#238636] shadow-[0_0_8px_#238636]' : 'bg-[#F85149]'}`} />
            <span className="text-[#8B949E]">Engine:</span>
            <span className="text-slate-200 font-semibold">{engineAlive ? 'ONLINE (:8790)' : 'WAITING'}</span>
          </div>

          <div className="bg-[#0D121D] border border-[#1E2635] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#EE0000] animate-pulse" />
            <span className="text-[#8B949E]">Cluster CPU:</span>
            <span className="text-slate-200 font-semibold">{liveCpu}%</span>
          </div>

          <div className="bg-[#0D121D] border border-[#1E2635] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-[#3FB950]" />
            <span className="text-[#8B949E]">Latency:</span>
            <span className="text-slate-200 font-semibold">{liveLatency}ms</span>
          </div>

          <div className="bg-[#0D121D] border border-[#1E2635] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-[#58A6FF]" />
            <span className="text-slate-200 font-semibold">{config.modelName}</span>
          </div>
        </div>

        {/* Global Driver Control */}
        <div className="flex items-center gap-3">
          {incident.status === 'RESOLVED' ? (
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-[#1C2331] hover:bg-[#252E40] text-white text-xs font-bold px-4 py-2.5 rounded-md flex items-center gap-2 border border-[#2D3748] transition shadow-md"
            >
              <RotateCcw className="w-4 h-4 text-[#58A6FF]" /> Reset Incident
            </button>
          ) : (
            <button 
              onClick={handleSimulate}
              disabled={loading || incident.status === 'AWAITING_HUMAN_APPROVAL'}
              className="bg-[#EE0000] hover:bg-[#CC0000] disabled:opacity-50 active:scale-95 text-white text-xs font-black px-5 py-2.5 rounded-md flex items-center gap-2 transition shadow-xl shadow-[#EE0000]/30 tracking-wider uppercase"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {incident.status === 'AWAITING_HUMAN_APPROVAL' ? 'Triage In Progress' : 'Simulate P0 Outage'}
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-[#070A10] border-r border-[#1E2635] flex flex-col justify-between p-3 shrink-0 select-none">
          <div className="space-y-6">
            
            {/* Monitored Repository Card */}
            <div className="bg-[#0D121C] border border-[#1E2635] p-3 rounded-lg">
              <div className="text-[10px] font-bold text-[#8B949E] uppercase tracking-wider font-mono mb-1.5 flex items-center justify-between">
                <span>Active Target</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-white truncate">
                <FolderGit2 className="w-4 h-4 text-[#EE0000] shrink-0" />
                <span className="truncate">{config.targetRepo}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#8B949E]">
                <GitBranch className="w-3 h-3 text-[#58A6FF]" />
                <span>{config.targetBranch}</span>
                <span className="text-[#3A4454]">•</span>
                <span className="text-[#3FB950]">Protected</span>
              </div>
            </div>

            {/* Menu Items */}
            <div>
              <div className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider px-3 mb-2 font-mono">
                Platform Navigation
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveNav('incidents')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'incidents' ? 'bg-[#EE0000] text-white shadow-lg shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Active Outages (P0)</span>
                </button>

                <button
                  onClick={() => setActiveNav('tree')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'tree' ? 'bg-[#EE0000] text-white shadow-lg shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <Workflow className="w-4 h-4" />
                  <span>Git Branch Tree</span>
                </button>

                <button
                  onClick={() => setActiveNav('prs')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'prs' ? 'bg-[#EE0000] text-white shadow-lg shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Pull Requests & Qodo</span>
                </button>

                <button
                  onClick={() => setActiveNav('fleet')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'fleet' ? 'bg-[#EE0000] text-white shadow-lg shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <Server className="w-4 h-4" />
                  <span>Cluster Fleet Health</span>
                </button>

                <button
                  onClick={() => setActiveNav('terminal')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'terminal' ? 'bg-[#EE0000] text-white shadow-lg shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white hover:bg-[#111622]'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Harness Console</span>
                </button>
              </nav>
            </div>

            {/* Modules Check */}
            <div className="pt-2 border-t border-[#1E2635]">
              <div className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider px-3 mb-2 font-mono">
                Active Modules
              </div>
              <div className="space-y-1.5 px-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#58A6FF]" /> Daytona Box</span>
                  <span className="text-[#3FB950] font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#D29922]" /> GitHub MCP</span>
                  <span className="text-[#3FB950] font-semibold">Ready</span>
                </div>
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#EE0000]" /> Approval Gate</span>
                  <span className="text-[#EE0000] font-bold">Armed</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Footer: Nitin Pathak / nitin24x7 */}
          <div className="bg-[#0D121C] border border-[#1E2635] p-3 rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EE0000] to-rose-700 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0 border border-white/20">
                N
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate">nitin24x7</span>
                  <UserCheck className="w-3 h-3 text-[#3FB950] shrink-0" />
                </div>
                <span className="text-[10px] text-[#8B949E] font-mono truncate">Lead SRE Operator</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg bg-[#151C2A] hover:bg-[#1E2635] text-[#8B949E] hover:text-white transition cursor-pointer"
              title="Configure Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#04060A] space-y-6">

          {/* 1. VIEW: ACTIVE OUTAGES (P0) */}
          {activeNav === 'incidents' && (
            <div className="space-y-6">
              
              {/* Approval Checkpoint Banner (Amber) */}
              {incident.status === 'AWAITING_HUMAN_APPROVAL' && (
                <div className="bg-[#0F1522] border-2 border-[#D29922] rounded-xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
                  <div className="absolute top-0 left-0 w-2.5 h-full bg-[#D29922]" />
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2635]">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D29922] uppercase tracking-wider mb-1 font-mono">
                        <Lock className="w-4 h-4" /> TrueForge Human Approval Checkpoint
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Authorize Hotfix PR & Deploy to Production Fleet?
                      </h2>
                      <p className="text-xs text-[#8B949E] mt-1 max-w-2xl leading-relaxed">
                        Crash reproduced in Daytona sandbox (exit code 139), patch synthesized with zero-copy buffer guard, and audited clean via Qodo. TrueForge holds execution before touching GitHub.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto justify-end shrink-0">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2.5 bg-[#1C2331] hover:bg-[#252E40] text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition border border-[#2D3748]"
                      >
                        <X className="w-4 h-4 text-[#F85149]" /> Reject & Abort
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] active:scale-95 text-white text-xs font-black rounded-md flex items-center gap-2 transition shadow-xl shadow-[#238636]/30 uppercase tracking-wide"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Authorize PR Merging
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs font-mono">
                    <div className="bg-[#080B12] border border-[#1E2635] p-2.5 rounded-lg flex items-center justify-between">
                      <span className="text-[#8B949E]">Target Tool:</span>
                      <span className="text-[#58A6FF] font-semibold">github-mcp: create_pr</span>
                    </div>
                    <div className="bg-[#080B12] border border-[#1E2635] p-2.5 rounded-lg flex items-center justify-between">
                      <span className="text-[#8B949E]">Sandbox Tests:</span>
                      <span className="text-[#3FB950] font-semibold">3/3 Passed (0 Regr.)</span>
                    </div>
                    <div className="bg-[#080B12] border border-[#1E2635] p-2.5 rounded-lg flex items-center justify-between">
                      <span className="text-[#8B949E]">Qodo Quality:</span>
                      <span className="text-[#A371F7] font-semibold">Clean (0 Defects)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolved State */}
              {incident.status === 'RESOLVED' && (
                <div className="bg-[#0C151F] border border-[#238636] rounded-xl p-4 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#238636] text-white rounded-lg shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>Hotfix Pull Request Dispatched & Merged</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#238636]/20 text-[#3FB950] font-mono">Auto-Canary Active</span>
                      </div>
                      <div className="text-xs text-[#8B949E] mt-0.5">
                        PR #1 merged into <code>main</code> branch of <strong>{config.targetRepo}</strong>. Traffic restored.
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://github.com/nitin24x7/VigilSRE-agent/pull/1" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#58A6FF] bg-[#151C2A] border border-[#2D3748] px-4 py-2 rounded-md hover:bg-[#1E2635] transition shadow-md"
                  >
                    View PR #1 on GitHub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Outage & Daytona Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div className="lg:col-span-5 space-y-6">
                  <div className="card-dark rounded-xl p-5 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/30 px-2.5 py-0.5 rounded uppercase font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" /> P0 Active Outage
                      </span>
                      <span className="font-mono text-xs text-[#8B949E]">#{incident.incidentId}</span>
                    </div>

                    <h3 className="font-bold text-white text-base">SIGSEGV in Token Buffer Pool</h3>
                    <p className="text-xs text-[#8B949E] mt-1.5 leading-relaxed">
                      Worker process terminated with code 139 in cluster <code>ap-south-1</code>. Auto-healing triage pipeline engaged.
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#1E2635] space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B949E] flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> Monitored Repo:</span>
                        <span className="text-slate-200 font-semibold">{config.targetRepo}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B949E] flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Faulty Commit:</span>
                        <span className="text-[#58A6FF] font-semibold">{incident.faultyCommit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-dark rounded-xl p-5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#58A6FF]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Daytona Isolated Sandbox</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#238636]/15 text-[#3FB950] border border-[#238636]/30">Active</span>
                    </div>

                    <div className="bg-[#05070D] border border-[#1E2635] p-3 rounded-lg space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Sandbox ID:</span>
                        <span className="text-slate-200">{config.daytonaId}</span>
                      </div>
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Replication Run:</span>
                        <span className="text-[#F85149] font-bold">Exit 139 (Reproduced)</span>
                      </div>
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Validation Run:</span>
                        <span className="text-[#3FB950] font-bold">Passed (3/3 Tests)</span>
                      </div>
                    </div>

                    <div className="bg-[#05070D] border-l-2 border-l-[#A371F7] border-y border-r border-[#1E2635] p-3 rounded-lg flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#A371F7] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white text-xs">Qodo Code Quality Gate</div>
                        <div className="text-[#8B949E] text-[11px] mt-0.5 leading-relaxed">
                          Clean PR diff verified: 0 buffer overflows, memory leaks, or unhandled exceptions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diff Viewer / Trace Logs */}
                <div className="lg:col-span-7 card-dark rounded-xl p-5 flex flex-col min-h-[460px] shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2635]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setActiveTab('diff')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                          activeTab === 'diff' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white'
                        }`}
                      >
                        <FileCode2 className="w-3.5 h-3.5" /> Synthesized Diff
                      </button>
                      <button 
                        onClick={() => setActiveTab('trace')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                          activeTab === 'trace' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/25' : 'text-[#8B949E] hover:text-white'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" /> Engine Telemetry ({incident.logs.length})
                      </button>
                    </div>

                    <span className="font-mono text-[11px] text-[#8B949E]">
                      State: <strong className="text-white uppercase">{incident.status}</strong>
                    </span>
                  </div>

                  {activeTab === 'diff' ? (
                    <div className="bg-[#05070D] border border-[#1E2635] p-4 rounded-lg font-mono text-xs overflow-x-auto flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[#8B949E] mb-1">--- src/auth/token.ts (Commit {incident.faultyCommit})</div>
                        <div className="text-[#8B949E] mb-3">+++ src/auth/token.ts (Daytona Patched & Qodo Audited)</div>
                        
                        <div className="space-y-1">
                          <div className="text-[#8B949E] pl-4">@@ -14,6 +14,8 @@ export function parseAuthToken(req: Request) &#123;</div>
                          <div className="bg-[#F85149]/15 text-[#FF7B72] px-2 py-1 rounded">
                            -  const token = bufferPool.acquireUnchecked(size);
                          </div>
                          <div className="bg-[#238636]/15 text-[#7EE787] px-2 py-1 rounded">
                            +  if (size &gt; MAX_SAFE_BUFFER_SIZE) throw new BufferOverflowError();
                          </div>
                          <div className="bg-[#238636]/15 text-[#7EE787] px-2 py-1 rounded">
                            +  const token = bufferPool.acquireChecked(size);
                          </div>
                          <div className="text-[#8B949E] pl-4">   return verifySignature(token);</div>
                        </div>
                      </div>

                      <div className="mt-6 pt-3 border-t border-[#1E2635] text-[11px] text-[#8B949E] flex items-center justify-between">
                        <span>Confidence: 99.4% (Sandbox Validated)</span>
                        <span className="font-semibold text-[#A371F7]">Qodo Audit Status: Clean</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 font-mono text-xs overflow-y-auto flex-1 max-h-[360px] pr-2">
                      {incident.logs.length === 0 ? (
                        <div className="text-[#8B949E] text-center py-12">No logs yet. Click "SIMULATE P0 OUTAGE" to initiate runtime telemetry.</div>
                      ) : (
                        incident.logs.map((log) => (
                          <div key={log.id} className="flex items-start gap-2.5 p-2 bg-[#05070D] border border-[#1E2635] rounded-md">
                            <span className="text-[#8B949E] text-[11px] shrink-0">{log.time}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              log.phase === 'GATE' ? 'bg-[#D29922]/20 text-[#D29922] border border-[#D29922]/40' :
                              log.phase === 'SANDBOX' ? 'bg-[#A371F7]/20 text-[#A371F7] border border-[#A371F7]/40' :
                              log.phase === 'AUDIT' ? 'bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40' :
                              'bg-[#1C2331] text-[#8B949E]'
                            }`}>
                              {log.phase}
                            </span>
                            <span className="text-slate-200 leading-relaxed">{log.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 2. VIEW: GIT BRANCH TREE & COMMIT GRAPH */}
          {activeNav === 'tree' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-[#EE0000]" /> Git Branch Topology & Commit Tree
                  </h2>
                  <p className="text-xs text-[#8B949E]">Visual commit timeline showing regressions, hotfix branches, and merged PRs.</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#101622] border border-[#1E2635] text-[#58A6FF]">
                    branch: main
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#101622] border border-[#1E2635] text-[#D29922]">
                    branch: feat/phase2-trueforge-agent
                  </span>
                </div>
              </div>

              {/* Commit Timeline */}
              <div className="card-dark rounded-xl p-6 shadow-xl space-y-6">
                <div className="relative pl-6 border-l-2 border-[#1E2635] space-y-8 font-mono text-xs">
                  {commits.map((c, idx) => (
                    <div key={c.hash} className="relative group">
                      {/* Node circle on tree */}
                      <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-[#04060A] ${
                        c.status === 'failed' ? 'bg-[#F85149] ring-4 ring-[#F85149]/20' : 
                        c.status === 'passed' ? 'bg-[#238636]' : 'bg-[#58A6FF]'
                      }`} />

                      <div className="bg-[#05070D] border border-[#1E2635] p-4 rounded-xl space-y-2 group-hover:border-[#2D3748] transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[#58A6FF] font-bold">#{c.hash}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-[#111622] border border-[#1E2635] text-[#8B949E]">
                              {c.branch}
                            </span>
                            {c.status === 'failed' && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-[#F85149]/20 text-[#F85149] font-bold border border-[#F85149]/40">
                                Regressing Commit (SIGSEGV)
                              </span>
                            )}
                          </div>
                          <span className="text-[#8B949E] text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {c.timestamp}
                          </span>
                        </div>

                        <div className="text-white font-sans text-xs font-semibold">{c.message}</div>

                        <div className="text-[#8B949E] text-[11px] flex items-center justify-between pt-2 border-t border-[#151C2A]">
                          <span>Committer: <strong>{c.author}</strong></span>
                          <span>Verified GPG Signature</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. VIEW: PULL REQUESTS & QODO AUDITS */}
          {activeNav === 'prs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <GitPullRequest className="w-5 h-5 text-[#EE0000]" /> Pull Requests & Qodo Compliance
                  </h2>
                  <p className="text-xs text-[#8B949E]">Audit trails verifying automated PR hygiene before merging to main.</p>
                </div>
                <a 
                  href="https://github.com/nitin24x7/VigilSRE-agent/pull/1"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#EE0000] hover:bg-[#CC0000] text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#EE0000]/25"
                >
                  View PR #1 on GitHub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="space-y-4">
                {pullRequests.map(pr => (
                  <div key={pr.number} className="card-dark rounded-xl p-5 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 font-bold font-mono text-xs">
                          #{pr.number}
                        </span>
                        <h3 className="font-bold text-white text-sm">{pr.title}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-[#238636]/20 text-[#3FB950] font-mono text-xs font-bold border border-[#238636]/40">
                        {pr.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#8B949E] space-y-1">
                      <div>Branch Target: <strong className="text-white">{pr.branch}</strong></div>
                      <div>Author: <strong className="text-white">{pr.author}</strong></div>
                    </div>

                    <div className="bg-[#05070D] border-l-2 border-l-[#A371F7] border-y border-r border-[#1E2635] p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                      <span className="text-[#8B949E]">Qodo Automated Analysis:</span>
                      <span className="text-[#3FB950] font-bold">{pr.qodoAudit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. VIEW: CLUSTER FLEET HEALTH & AUTO-ROLLBACK ENGINE */}
          {activeNav === 'fleet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-[#EE0000]" /> Cluster Node Matrix (Region: ap-south-1)
                  </h2>
                  <p className="text-xs text-[#8B949E]">Real-time container pod metrics, error densities, and automatic traffic shedding.</p>
                </div>
                <button
                  onClick={() => {
                    setCanaryShedding(!canaryShedding);
                    showToast(canaryShedding ? 'Canary traffic normal' : 'Emergency Canary traffic shed engaged');
                  }}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
                    canaryShedding ? 'bg-[#238636] text-white' : 'bg-[#1C2331] text-white hover:bg-[#252E40] border border-[#2D3748]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#EE0000]" />
                  {canaryShedding ? 'Traffic Shedding Active' : 'Engage Emergency Traffic Shedding'}
                </button>
              </div>

              {/* Node Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Node 1 */}
                <div className="card-dark p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-white font-bold">node-ap-south-1a</span>
                    <span className="px-2 py-0.5 rounded bg-[#F85149]/20 text-[#F85149] font-bold border border-[#F85149]/30">SIGSEGV Pod Crash</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-[#8B949E]">
                    <div className="flex justify-between"><span>Pod Restarts:</span><span className="text-[#F85149] font-bold">14</span></div>
                    <div className="flex justify-between"><span>Memory Load:</span><span>91.2%</span></div>
                    <div className="flex justify-between"><span>Active Commit:</span><span className="text-[#58A6FF]">#4f8b91a</span></div>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="card-dark p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-white font-bold">node-ap-south-1b</span>
                    <span className="px-2 py-0.5 rounded bg-[#238636]/20 text-[#3FB950] font-bold border border-[#238636]/30">Healthy</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-[#8B949E]">
                    <div className="flex justify-between"><span>Pod Restarts:</span><span className="text-white">0</span></div>
                    <div className="flex justify-between"><span>Memory Load:</span><span>34.1%</span></div>
                    <div className="flex justify-between"><span>Active Commit:</span><span className="text-[#58A6FF]">#55da8e7</span></div>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="card-dark p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-white font-bold">node-ap-south-1c</span>
                    <span className="px-2 py-0.5 rounded bg-[#238636]/20 text-[#3FB950] font-bold border border-[#238636]/30">Healthy</span>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-[#8B949E]">
                    <div className="flex justify-between"><span>Pod Restarts:</span><span className="text-white">0</span></div>
                    <div className="flex justify-between"><span>Memory Load:</span><span>29.8%</span></div>
                    <div className="flex justify-between"><span>Active Commit:</span><span className="text-[#58A6FF]">#55da8e7</span></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 5. VIEW: HARNESS CONSOLE */}
          {activeNav === 'terminal' && (
            <div className="h-full flex flex-col card-dark rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#0B1019] border-b border-[#1E2635] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
                  <Terminal className="w-4 h-4 text-[#EE0000]" />
                  <span>TrueForge Interactive Shell (:8790)</span>
                </div>
                <span className="text-[10px] font-mono text-[#3FB950] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse" /> Ready
                </span>
              </div>

              <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto text-[#8B949E] bg-[#05070D]">
                {terminalHistory.map((line, i) => (
                  <div key={i} className={line.startsWith('>') ? 'text-white font-bold' : ''}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="p-3 bg-[#080C14] border-t border-[#1E2635] flex items-center gap-2">
                <span className="text-[#EE0000] font-mono font-bold">{'>'}</span>
                <input 
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command (e.g. status, triage, rollback, sandbox, qodo, pr, fleet, clear)..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-[#8B949E]"
                />
                <button type="submit" className="p-2 rounded bg-[#161F2E] hover:bg-[#202B3E] text-white">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* SRE CONFIGURATION MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card-dark rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2635]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#EE0000]" />
                <h3 className="font-bold text-white text-sm">SRE Agent Configuration</h3>
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-[#8B949E] hover:text-white transition p-1 rounded-md hover:bg-[#151C2A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#8B949E] block mb-1 font-bold">Target Monitored Repository</label>
                <input 
                  type="text" 
                  value={config.targetRepo}
                  onChange={(e) => setConfig({ ...config, targetRepo: e.target.value })}
                  className="w-full bg-[#05070D] border border-[#1E2635] px-3.5 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#EE0000]"
                />
              </div>

              <div>
                <label className="text-[#8B949E] block mb-1 font-bold">Target Monitored Branch</label>
                <input 
                  type="text" 
                  value={config.targetBranch}
                  onChange={(e) => setConfig({ ...config, targetBranch: e.target.value })}
                  className="w-full bg-[#05070D] border border-[#1E2635] px-3.5 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#EE0000]"
                />
              </div>

              <div>
                <label className="text-[#8B949E] block mb-1 font-bold">TrueForge Standalone Engine URL</label>
                <input 
                  type="text" 
                  value={config.trueforgeUrl}
                  onChange={(e) => setConfig({ ...config, trueforgeUrl: e.target.value })}
                  className="w-full bg-[#05070D] border border-[#1E2635] px-3.5 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#EE0000]"
                />
              </div>

              <div>
                <label className="text-[#8B949E] block mb-1 font-bold">Daytona Sandbox ID</label>
                <input 
                  type="text" 
                  value={config.daytonaId}
                  onChange={(e) => setConfig({ ...config, daytonaId: e.target.value })}
                  className="w-full bg-[#05070D] border border-[#1E2635] px-3.5 py-2.5 rounded-lg text-white focus:outline-none focus:border-[#EE0000]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2635] flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-[#151C2A] hover:bg-[#1E2635] text-[#8B949E] hover:text-white text-xs font-bold rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowSettings(false);
                  showToast('SRE Configuration Saved Successfully');
                }}
                className="px-5 py-2 bg-[#EE0000] hover:bg-[#CC0000] text-white text-xs font-bold rounded-lg transition shadow-lg shadow-[#EE0000]/25"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}