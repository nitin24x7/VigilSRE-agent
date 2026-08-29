import React, { useState } from 'react';
import { 
  Home, 
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
  Activity,
  Layers,
  Settings,
  FolderGit2,
  FileSearch,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  phase: 'INGEST' | 'SANDBOX' | 'AUDIT' | 'GATE';
  message: string;
}

export default function VigilSREApp() {
  const [activeNav, setActiveNav] = useState<'incidents' | 'repos' | 'audits' | 'terminal'>('incidents');
  const [pipelineState, setPipelineState] = useState<'idle' | 'triaging' | 'awaiting_approval' | 'merged'>('awaiting_approval');
  const [activeTab, setActiveTab] = useState<'trace' | 'diff'>('diff');

  const logs: LogItem[] = [
    { id: '1', time: '18:02:11', phase: 'INGEST', message: 'TrueForge Harness connected to engine at http://localhost:8790' },
    { id: '2', time: '18:02:14', phase: 'INGEST', message: 'Alert ingested via Webhook: SIGSEGV crash in AuthMiddleware worker pool' },
    { id: '3', time: '18:02:17', phase: 'SANDBOX', message: 'TrueForge Daytona Sandbox #sb-9842 mounted workspace: corp/auth-gateway' },
    { id: '4', time: '18:02:22', phase: 'SANDBOX', message: 'Sandbox test runner: test_token_overflow() exited with status 139 (Crash)' },
    { id: '5', time: '18:02:29', phase: 'AUDIT', message: 'Synthesized zero-copy buffer bounds patch. Test runner: 3/3 passing' },
    { id: '6', time: '18:02:33', phase: 'AUDIT', message: 'Qodo Code Quality Gate inspected diff: Clean (0 High / Medium alerts)' },
    { id: '7', time: '18:02:36', phase: 'GATE', message: 'TrueForge Human Approval Gate TRIGGERED. Holding execution before PR commit' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-[#07090D] text-[#E6EDF3] selection:bg-[#E00]/30 font-sans">
      
      {/* 4. EXPANDED TOP BAR (Increased height, 2x Logo size, Bold Wordmark) */}
      <header className="h-20 bg-[#0B0F17] border-b border-[#21262D] px-6 flex items-center justify-between shrink-0 shadow-md">
        
        {/* Left: 2x Sized Logo + VigilSRE Wordmark */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-black border border-[#30363D] flex items-center justify-center p-1 shadow-lg shrink-0">
            <img 
              src="/icon.png" 
              alt="VigilSRE" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* Styled VigilSRE title matching your brand image */}
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

        {/* Center: System Telemetry Badges */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#238636]" />
            <span className="text-[#8B949E]">Engine:</span>
            <span className="text-slate-200 font-semibold">:8790 (SQLite)</span>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#58A6FF]" />
            <span className="text-[#8B949E]">Model:</span>
            <span className="text-slate-200 font-semibold">Gemini 3.7 Flash</span>
          </div>
        </div>

        {/* Right: Red Hat Style Action Button */}
        <div className="flex items-center gap-3">
          {pipelineState === 'merged' ? (
            <button
              onClick={() => setPipelineState('awaiting_approval')}
              className="bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold px-4 py-2.5 rounded-md flex items-center gap-2 border border-[#363B42] transition"
            >
              <RotateCcw className="w-4 h-4" /> Reset Agent State
            </button>
          ) : (
            <button 
              onClick={() => setPipelineState('awaiting_approval')}
              className="bg-[#EE0000] hover:bg-[#CC0000] active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-md flex items-center gap-2 transition shadow-lg shadow-[#EE0000]/25 tracking-wide uppercase"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Simulate P0 Outage
            </button>
          )}
        </div>
      </header>

      {/* Main Body with Sidebar and Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* 2. SIDEBAR WITH RED ACCENT BUTTONS (Qodo / Enterprise Style) */}
        <aside className="w-64 bg-[#090D14] border-r border-[#21262D] flex flex-col justify-between p-3 shrink-0 select-none">
          <div className="space-y-6">
            
            {/* Main Menu Navigation */}
            <div>
              <div className="text-[11px] font-bold text-[#8B949E] uppercase tracking-wider px-3 mb-2 font-mono">
                Platform Navigation
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveNav('incidents')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'incidents'
                      ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Active Outages (P0)</span>
                </button>

                <button
                  onClick={() => setActiveNav('repos')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'repos'
                      ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>Target Repositories</span>
                </button>

                <button
                  onClick={() => setActiveNav('audits')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'audits'
                      ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Qodo Code Audits</span>
                </button>

                <button
                  onClick={() => setActiveNav('terminal')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition ${
                    activeNav === 'terminal'
                      ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20'
                      : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Harness Console</span>
                </button>
              </nav>
            </div>

            {/* TrueForge Capabilities List */}
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

          {/* User Profile Card in Sidebar Bottom (Qodo style) */}
          <div className="bg-[#161B22] border border-[#21262D] p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#EE0000] text-white font-bold flex items-center justify-center text-xs">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white leading-none">SRE Operator</span>
                <span className="text-[10px] text-[#8B949E] font-mono mt-1">on-call@vigil.io</span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-[#8B949E] hover:text-white cursor-pointer" />
          </div>
        </aside>

        {/* Main Work Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#07090D]">

          {/* 1. APPROVAL GATE (Yellow/Amber Human Checkpoint with Red/Green buttons) */}
          {pipelineState === 'awaiting_approval' && (
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
                    Bug reproduced inside Daytona sandbox, patched with safe zero-copy boundary checks, and audited via Qodo. Agent has paused execution and is waiting for authorization before dispatching to GitHub.
                  </p>
                </div>

                {/* Gate Trigger Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
                  <button
                    onClick={() => setPipelineState('idle')}
                    className="px-4 py-2 bg-[#21262D] hover:bg-[#30363D] text-white text-xs font-bold rounded-md flex items-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4 text-[#F85149]" /> Reject & Abort
                  </button>
                  <button
                    onClick={() => setPipelineState('merged')}
                    className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] active:scale-95 text-white text-xs font-bold rounded-md flex items-center gap-2 transition shadow-lg shadow-[#238636]/30 uppercase tracking-wide"
                  >
                    <Check className="w-4 h-4 stroke-[3]" /> Authorize PR Merging
                  </button>
                </div>
              </div>

              {/* Approval Info Badges */}
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

          {/* Success Banner if Approved */}
          {pipelineState === 'merged' && (
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
                    PR #43 merged into <code>main</code>. Canary worker containers rolling out across cluster.
                  </div>
                </div>
              </div>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[#58A6FF] bg-[#161B22] border border-[#30363D] px-3.5 py-1.5 rounded-md hover:bg-[#21262D] transition"
              >
                View on GitHub <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Core Telemetry Grid (Incident details & Terminal Diff) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card: Active Crash and Daytona Telemetry (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Incident Alert Block */}
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F85149] bg-[#F85149]/10 border border-[#F85149]/30 px-2.5 py-0.5 rounded uppercase font-mono">
                    <AlertTriangle className="w-3 h-3" /> P0 Active Outage
                  </span>
                  <span className="font-mono text-xs text-[#8B949E]">#INC-8941</span>
                </div>

                <h3 className="font-bold text-white text-sm">SIGSEGV in Token Buffer Pool</h3>
                <p className="text-xs text-[#8B949E] mt-1.5 leading-relaxed">
                  Worker process terminated unexpectedly across multiple nodes in cluster <code>ap-south-1</code>. Auto-healing agent triggered triage pipeline.
                </p>

                <div className="mt-4 pt-3 border-t border-[#21262D] space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8B949E] flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> Target Repo:</span>
                    <span className="text-slate-200 font-semibold">corp/auth-gateway:main</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8B949E] flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Regressing Commit:</span>
                    <span className="text-[#58A6FF] font-semibold">#4f8b91a</span>
                  </div>
                </div>
              </div>

              {/* Daytona Sandbox Telemetry */}
              <div className="bg-[#0D1117] border border-[#30363D] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#58A6FF]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daytona Isolated Sandbox</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#238636]/10 text-[#3FB950] border border-[#238636]/30">
                    Active
                  </span>
                </div>

                <div className="bg-[#07090D] border border-[#21262D] p-3 rounded-lg space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-[#8B949E]">
                    <span>Sandbox ID:</span>
                    <span className="text-slate-200">sb-9842-isolated-env</span>
                  </div>
                  <div className="flex justify-between text-[#8B949E]">
                    <span>Bug Reproduction:</span>
                    <span className="text-[#F85149] font-bold">Failed: Exit Code 139</span>
                  </div>
                  <div className="flex justify-between text-[#8B949E]">
                    <span>Verification Suite:</span>
                    <span className="text-[#3FB950] font-bold">Passed (3/3 Tests)</span>
                  </div>
                </div>

                {/* Qodo Audit Banner */}
                <div className="bg-[#07090D] border-l-2 border-l-[#A371F7] border-y border-r border-[#21262D] p-3 rounded-lg flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#A371F7] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-xs">
                      Qodo Code Quality Gate
                    </div>
                    <div className="text-[#8B949E] text-[11px] mt-0.5 leading-relaxed">
                      Patch verified clean. Zero buffer overflows, unhandled null pointers, or memory leaks identified.
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Card: Terminal Trace & Code Diff Viewer (7 cols) */}
            <div className="lg:col-span-7 bg-[#0D1117] border border-[#30363D] rounded-xl p-5 flex flex-col min-h-[460px]">
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#21262D]">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('diff')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      activeTab === 'diff' 
                        ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' 
                        : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5" /> Synthesized Diff
                  </button>
                  <button 
                    onClick={() => setActiveTab('trace')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      activeTab === 'trace' 
                        ? 'bg-[#EE0000] text-white shadow-md shadow-[#EE0000]/20' 
                        : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" /> TrueForge Engine Log
                  </button>
                </div>

                <span className="font-mono text-[11px] text-[#8B949E]">
                  Session: <span className="text-white">sess_7a2f099</span>
                </span>
              </div>

              {/* View 1: Unified Code Diff */}
              {activeTab === 'diff' && (
                <div className="bg-[#07090D] border border-[#21262D] p-4 rounded-lg font-mono text-xs overflow-x-auto flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[#8B949E] mb-1">--- src/auth/token.ts (Commit #4f8b91a)</div>
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

                  <div className="mt-6 pt-3 border-t border-[#21262D] text-[11px] text-[#8B949E] flex items-center justify-between">
                    <span>Confidence: 99.4% (Verified via Daytona Sandbox)</span>
                    <span className="font-semibold text-[#A371F7]">Qodo Audit Status: Clean</span>
                  </div>
                </div>
              )}

              {/* View 2: Agent Execution Trace Logs */}
              {activeTab === 'trace' && (
                <div className="space-y-2 font-mono text-xs overflow-y-auto flex-1 max-h-[360px] pr-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 p-2 bg-[#07090D] border border-[#21262D] rounded-md">
                      <span className="text-[#8B949E] text-[11px] shrink-0">{log.time}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                        log.phase === 'GATE' ? 'bg-[#D29922]/20 text-[#D29922] border border-[#D29922]/40' :
                        log.phase === 'SANDBOX' ? 'bg-[#A371F7]/20 text-[#A371F7] border border-[#A371F7]/40' :
                        log.phase === 'AUDIT' ? 'bg-[#238636]/20 text-[#3FB950] border border-[#238636]/40' :
                        'bg-[#21262D] text-[#8B949E]'
                      }`}>
                        {log.phase}
                      </span>
                      <span className="text-slate-200 leading-relaxed">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}