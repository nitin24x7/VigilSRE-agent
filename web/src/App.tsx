import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  GitPullRequest, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  ExternalLink, 
  Bot, 
  GitBranch, 
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
  Server,
  RefreshCw,
  Send,
  Sliders,
  Database,
  Code
} from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

export default function VigilSREApp() {
  const [activeNav, setActiveNav] = useState<'incidents' | 'repos' | 'audits' | 'terminal'>('incidents');
  const [activeTab, setActiveTab] = useState<'diff' | 'trace'>('diff');
  
  // Real backend telemetry
  const [engineAlive, setEngineAlive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('AIzaSyD-••••••••••••••••••••••••');
  
  // Terminal view state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'TrueForge v0.1.4 Shell [Standalone Engine]',
    'Connected to runtime on http://localhost:8790',
    'Type "help" or "status" to query the harness.'
  ]);

  const [incident, setIncident] = useState({
    incidentId: 'INC-8941',
    service: 'corp/auth-gateway',
    status: 'IDLE',
    faultyCommit: '#4f8b91a',
    diff: '',
    prUrl: '',
    logs: [] as Array<{ id: string; time: string; phase: string; message: string }>
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/approve`);
      setIncident(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/reset`);
      setIncident(res.data);
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
      newHist.push('Available commands: status, triage, sandbox, qodo, clear');
    } else if (cmd === 'status') {
      newHist.push(`Incident: ${incident.incidentId} | State: ${incident.status} | Engine: :8790`);
    } else if (cmd === 'triage') {
      handleSimulate();
      newHist.push('Initiating P0 outage triage workflow...');
    } else if (cmd === 'sandbox') {
      newHist.push('Daytona sb-9842: Active (Ubuntu LTS container mounted).');
    } else if (cmd === 'qodo') {
      newHist.push('Qodo Guardrails: Merged PR #1 verified. 0 High/Med defects.');
    } else if (cmd === 'clear') {
      setTerminalHistory(['Terminal cleared.']);
      setTerminalInput('');
      return;
    } else {
      newHist.push(`Command not recognized: "${cmd}". Type "help".`);
    }

    setTerminalHistory(newHist);
    setTerminalInput('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090D] text-[#E6EDF3] selection:bg-[#EE0000]/30 font-sans">
      
      {/* Top Bar */}
      <header className="h-20 bg-[#0B0F17] border-b border-[#21262D] px-6 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-[#30363D] flex items-center justify-center p-1 shadow-lg shrink-0">
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
            <div className="text-[11px] text-[#8B949E] tracking-wider uppercase font-mono mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE0000] inline-block animate-pulse"></span>
              Autonomous Agent Harness & Triage
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${engineAlive ? 'bg-[#238636]' : 'bg-[#F85149]'}`} />
            <span className="text-[#8B949E]">TrueForge :8790:</span>
            <span className="text-slate-200 font-semibold">{engineAlive ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#58A6FF]" />
            <span className="text-[#8B949E]">Model:</span>
            <span className="text-slate-200 font-semibold">Gemini 3.7 Flash</span>
          </div>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-3">
          {incident.status === 'RESOLVED' ? (
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold px-4 py-2.5 rounded-md flex items-center gap-2 border border-[#363B42] transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset Agent State
            </button>
          ) : (
            <button 
              onClick={handleSimulate}
              disabled={loading || incident.status === 'AWAITING_HUMAN_APPROVAL'}
              className="bg-[#EE0000] hover:bg-[#CC0000] disabled:opacity-50 active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-md flex items-center gap-2 transition shadow-lg shadow-[#EE0000]/25 tracking-wide uppercase"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {incident.status === 'AWAITING_HUMAN_APPROVAL' ? 'Incident In Progress' : 'Simulate P0 Outage'}
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Persistent Interactive Sidebar */}
        <aside className="w-64 bg-[#090D14] border-r border-[#21262D] flex flex-col justify-between p-3 shrink-0 select-none">
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider px-3 mb-2 font-mono">
                Platform Navigation
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveNav('incidents')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'incidents' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Active Outages (P0)</span>
                </button>
                <button
                  onClick={() => setActiveNav('repos')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'repos' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Target Repositories</span>
                </button>
                <button
                  onClick={() => setActiveNav('audits')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'audits' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Qodo Code Audits</span>
                </button>
                <button
                  onClick={() => setActiveNav('terminal')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'terminal' ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Harness Console</span>
                </button>
              </nav>
            </div>

            {/* TrueForge Runtime Info */}
            <div className="pt-2 border-t border-[#21262D]">
              <div className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider px-3 mb-2 font-mono">
                Active Modules
              </div>
              <div className="space-y-1.5 px-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-[#58A6FF]" /> Daytona Box</span>
                  <span className="text-[#3FB950]">Live</span>
                </div>
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#D29922]" /> MCP Server</span>
                  <span className="text-[#3FB950]">Connected</span>
                </div>
                <div className="flex items-center justify-between text-[#8B949E]">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#EE0000]" /> Approval Gate</span>
                  <span className="text-[#EE0000] font-bold">Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* SRE Operator footer with Settings Button */}
          <div className="bg-[#161B22] border border-[#21262D] p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#EE0000] text-white font-bold flex items-center justify-center text-xs">S</div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white leading-none">SRE Operator</span>
                <span className="text-[10px] text-[#8B949E] font-mono mt-1">on-call@vigil.io</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 rounded hover:bg-[#21262D] transition text-[#8B949E] hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Dynamic Content based on Active Navigation Tab */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#07090D]">

          {/* 1. VIEW: ACTIVE OUTAGES (P0) */}
          {activeNav === 'incidents' && (
            <div className="space-y-6">
              
              {/* Human Approval Gate */}
              {incident.status === 'AWAITING_HUMAN_APPROVAL' && (
                <div className="bg-[#12161F] border-2 border-[#D29922] rounded-xl p-5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#D29922]" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#21262D]">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#D29922] uppercase tracking-wider mb-1 font-mono">
                        <Lock className="w-4 h-4" /> TrueForge Human Approval Checkpoint
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        Authorize Hotfix PR & Deploy to Production Fleet?
                      </h2>
                      <p className="text-xs text-[#8B949E] mt-1 max-w-2xl">
                        Bug reproduced in Daytona sandbox, patched with safe zero-copy boundary checks, and audited via Qodo. TrueForge is paused waiting for operator sign-off before dispatching to GitHub.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition"
                      >
                        <X className="w-4 h-4 text-[#F85149]" /> Reject & Abort
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] active:scale-95 text-white text-xs font-bold rounded-md flex items-center gap-2 transition shadow-lg shadow-[#238636]/30 uppercase tracking-wide"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Authorize PR Merging
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs font-mono">
                    <div className="bg-[#0B0F17] border border-[#21262D] p-2.5 rounded-md flex items-center justify-between">
                      <span className="text-[#8B949E]">Target MCP Tool:</span>
                      <span className="text-[#58A6FF] font-semibold">github-mcp: create_pr</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#21262D] p-2.5 rounded-md flex items-center justify-between">
                      <span className="text-[#8B949E]">Sandbox Test Suite:</span>
                      <span className="text-[#3FB950] font-semibold">3/3 Passed (0 Regressions)</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#21262D] p-2.5 rounded-md flex items-center justify-between">
                      <span className="text-[#8B949E]">Qodo Quality Status:</span>
                      <span className="text-[#A371F7] font-semibold">0 Critical Defects</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Resolved Banner */}
              {incident.status === 'RESOLVED' && (
                <div className="bg-[#12161F] border border-[#238636] rounded-xl p-4 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#238636] text-white rounded-lg">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        Hotfix Pull Request Dispatched & Merged
                      </div>
                      <div className="text-xs text-[#8B949E] mt-0.5">
                        PR #1 merged into <code>main</code>. Canary worker containers rolling out across cluster.
                      </div>
                    </div>
                  </div>
                  <a 
                    href={incident.prUrl || "https://github.com/nitin24x7/VigilSRE-agent/pull/1"} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#58A6FF] bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-md hover:bg-[#21262D] transition"
                  >
                    View PR on GitHub <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Telemetry Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/30 px-2.5 py-0.5 rounded uppercase font-mono">
                        <AlertTriangle className="w-3 h-3" /> P0 Active Outage
                      </span>
                      <span className="font-mono text-xs text-[#8B949E]">#{incident.incidentId}</span>
                    </div>

                    <h3 className="font-bold text-white text-sm">SIGSEGV in Token Buffer Pool</h3>
                    <p className="text-xs text-[#8B949E] mt-1.5 leading-relaxed">
                      Worker process terminated unexpectedly across multiple nodes in cluster <code>ap-south-1</code>. Auto-healing agent triggered triage pipeline.
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#21262D] space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B949E] flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> Target Repo:</span>
                        <span className="text-slate-200 font-semibold">{incident.service}:main</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#8B949E] flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Regressing Commit:</span>
                        <span className="text-[#58A6FF] font-semibold">{incident.faultyCommit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#58A6FF]" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daytona Isolated Sandbox</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#238636]/10 text-[#3FB950] border border-[#238636]/30">Active</span>
                    </div>

                    <div className="bg-[#07090D] border border-[#21262D] p-3 rounded-lg space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Sandbox ID:</span>
                        <span className="text-slate-200">sb-9842-isolated-env</span>
                      </div>
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Replication:</span>
                        <span className="text-[#F85149] font-bold">Exit Code 139 (Reproduced)</span>
                      </div>
                      <div className="flex justify-between text-[#8B949E]">
                        <span>Verification:</span>
                        <span className="text-[#3FB950] font-bold">Passed (3/3 Tests)</span>
                      </div>
                    </div>

                    <div className="bg-[#07090D] border-l-2 border-l-[#A371F7] border-y border-r border-[#21262D] p-3 rounded-lg flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#A371F7] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white text-xs">Qodo Code Quality Gate</div>
                        <div className="text-[#8B949E] text-[11px] mt-0.5 leading-relaxed">
                          Audited PR diff: zero buffer overflows, memory leaks, or unhandled exceptions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 flex flex-col min-h-[460px]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#21262D]">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setActiveTab('diff')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                          activeTab === 'diff' ? 'bg-[#EE0000] text-white shadow-md' : 'text-[#8B949E] hover:text-white'
                        }`}
                      >
                        <FileCode2 className="w-3.5 h-3.5" /> Synthesized Diff
                      </button>
                      <button 
                        onClick={() => setActiveTab('trace')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                          activeTab === 'trace' ? 'bg-[#EE0000] text-white shadow-md' : 'text-[#8B949E] hover:text-white'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" /> TrueForge Engine Log ({incident.logs.length})
                      </button>
                    </div>

                    <span className="font-mono text-[11px] text-[#8B949E]">
                      State: <strong className="text-white">{incident.status}</strong>
                    </span>
                  </div>

                  {activeTab === 'diff' ? (
                    <div className="bg-[#07090D] border border-[#21262D] p-4 rounded-lg font-mono text-xs overflow-x-auto flex-1 flex flex-col justify-between whitespace-pre">
                      <code className="text-[#8B949E]">{incident.diff || 'No patch generated yet. Click "Simulate P0 Outage" to trigger triage.'}</code>
                    </div>
                  ) : (
                    <div className="space-y-2 font-mono text-xs overflow-y-auto flex-1 max-h-[360px] pr-2">
                      {incident.logs.length === 0 ? (
                        <div className="text-[#8B949E] text-center py-10">No logs yet. Trigger an outage to see live telemetry.</div>
                      ) : (
                        incident.logs.map((log) => (
                          <div key={log.id} className="flex items-start gap-2.5 p-2 bg-[#07090D] border border-[#21262D] rounded-md">
                            <span className="text-[#8B949E] text-[11px] shrink-0">{log.time}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                              log.phase === 'GATE' ? 'bg-[#D29922]/20 text-[#D29922]' :
                              log.phase === 'SANDBOX' ? 'bg-[#A371F7]/20 text-[#A371F7]' :
                              log.phase === 'AUDIT' ? 'bg-[#238636]/20 text-[#3FB950]' :
                              'bg-[#21262D] text-[#8B949E]'
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

          {/* 2. VIEW: TARGET REPOSITORIES */}
          {activeNav === 'repos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Monitored Repositories & Services</h2>
                  <p className="text-xs text-[#8B949E]">Services protected by VigilSRE autonomous agent harness.</p>
                </div>
                <button 
                  onClick={() => alert("Repository added to VigilSRE active watch pool.")}
                  className="px-3.5 py-1.5 bg-[#EE0000] hover:bg-[#CC0000] text-white rounded text-xs font-bold transition"
                >
                  + Add Repository
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <FolderGit2 className="w-4 h-4 text-[#58A6FF]" /> corp/auth-gateway
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#F85149]/20 text-[#F85149] font-mono border border-[#F85149]/30">Active Triage</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">Core gateway proxy handling token auth and request rate limiting.</p>
                  <div className="text-xs font-mono text-[#8B949E] pt-2 border-t border-[#21262D] flex justify-between">
                    <span>Branch: <code>main</code></span>
                    <span>Last commit: <code>#4f8b91a</code></span>
                  </div>
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      <FolderGit2 className="w-4 h-4 text-[#3FB950]" /> corp/billing-engine
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#238636]/20 text-[#3FB950] font-mono border border-[#238636]/30">Healthy</span>
                  </div>
                  <p className="text-xs text-[#8B949E]">Stripe webhook listener and invoice dispatch worker.</p>
                  <div className="text-xs font-mono text-[#8B949E] pt-2 border-t border-[#21262D] flex justify-between">
                    <span>Branch: <code>production</code></span>
                    <span>Last commit: <code>#7a102c9</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. VIEW: QODO CODE AUDITS */}
          {activeNav === 'audits' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Qodo Quality & Compliance Standards</h2>
                  <p className="text-xs text-[#8B949E]">Automated agentic review history ensuring high hygiene and zero regressions.</p>
                </div>
                <a 
                  href="https://github.com/nitin24x7/VigilSRE-agent/pull/1" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-[#161B22] border border-[#30363D] text-[#58A6FF] rounded text-xs font-bold hover:bg-[#21262D] transition flex items-center gap-1.5"
                >
                  View Audited PR #1 <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#21262D]">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <Sparkles className="w-4 h-4 text-[#A371F7]" /> PR #1: Agent Specification Review
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#238636]/20 text-[#3FB950] rounded border border-[#238636]/40">Resolved & Merged</span>
                </div>

                <div className="bg-[#07090D] border border-[#21262D] p-3 rounded-lg text-xs font-mono space-y-2">
                  <div className="text-[#8B949E]">
                    <span className="text-[#F85149] font-bold">[High Priority Bug Caught]:</span> `agent.json` contained bash heredoc wrapper strings causing JSON parser errors.
                  </div>
                  <div className="text-[#3FB950]">
                    <span className="font-bold">[Remediation]:</span> Stripped bash wrappers and verified schema compliance with TrueForge runtime.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. VIEW: HARNESS CONSOLE */}
          {activeNav === 'terminal' && (
            <div className="h-full flex flex-col bg-[#0D1117] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#161B22] border-b border-[#21262D] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
                  <Terminal className="w-4 h-4 text-[#EE0000]" />
                  <span>TrueForge Interactive Shell</span>
                </div>
                <span className="text-[10px] font-mono text-[#3FB950]">Interactive Ready</span>
              </div>

              <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto text-[#8B949E]">
                {terminalHistory.map((line, i) => (
                  <div key={i} className={line.startsWith('>') ? 'text-white font-bold' : ''}>
                    {line}
                  </div>
                ))}
              </div>

              <form onSubmit={handleTerminalSubmit} className="p-3 bg-[#0B0F17] border-t border-[#21262D] flex items-center gap-2">
                <span className="text-[#EE0000] font-mono font-bold">{'>'}</span>
                <input 
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type a command (e.g. status, triage, sandbox, qodo, clear)..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-[#8B949E]"
                />
                <button type="submit" className="p-1.5 rounded bg-[#21262D] hover:bg-[#30363D] text-white">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* SRE Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1117] border border-[#30363D] rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#21262D]">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#EE0000]" /> SRE Agent Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-[#8B949E] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-[#8B949E] block mb-1">TrueForge Runtime URL</label>
                <input 
                  type="text" 
                  defaultValue="http://localhost:8790" 
                  disabled 
                  className="w-full bg-[#161B22] border border-[#30363D] px-3 py-2 rounded text-slate-300"
                />
              </div>

              <div>
                <label className="text-[#8B949E] block mb-1">Daytona Sandbox ID</label>
                <input 
                  type="text" 
                  defaultValue="sb-9842-isolated-env" 
                  disabled 
                  className="w-full bg-[#161B22] border border-[#30363D] px-3 py-2 rounded text-slate-300"
                />
              </div>

              <div>
                <label className="text-[#8B949E] block mb-1">Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-[#161B22] border border-[#30363D] px-3 py-2 rounded text-slate-300"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#21262D] flex justify-end gap-2">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-[#EE0000] hover:bg-[#CC0000] text-white text-xs font-bold rounded transition"
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