import { spawn } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '';

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Dispatches a tool call directly to the GitHub MCP JSON-RPC Stdio Server
 */
export async function executeGitHubMCP(toolName: string, params: Record<string, any>): Promise<MCPResponse> {
  return new Promise((resolve) => {
    if (!GITHUB_TOKEN) {
      console.warn('[GitHub MCP] No token provided. Running in sandbox simulated mode.');
      return resolve({
        success: true,
        data: {
          action: toolName,
          diff: `--- a/src/auth/token.ts\n+++ b/src/auth/token.ts\n@@ -14,6 +14,8 @@\n- const token = bufferPool.acquireUnchecked(size);\n+ if (size > MAX_SAFE_BUFFER_SIZE) throw new BufferOverflowError();\n+ const token = bufferPool.acquireChecked(size);`,
          prUrl: `https://github.com/nitin24x7/VigilSRE-agent/pull/1`
        }
      });
    }

    const mcpProcess = spawn('npx', ['-y', '@modelcontextprotocol/server-github'], {
      env: {
        ...process.env,
        GITHUB_PERSONAL_ACCESS_TOKEN: GITHUB_TOKEN
      }
    });

    const rpcPayload = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };

    let output = '';
    mcpProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcpProcess.stderr.on('data', (err) => {
      console.error(`[GitHub MCP STDERR]: ${err}`);
    });

    mcpProcess.on('close', (code) => {
      try {
        const parsed = JSON.parse(output);
        resolve({ success: true, data: parsed.result });
      } catch (e) {
        resolve({ success: false, error: output || `Process exited with code ${code}` });
      }
    });

    // Send the JSON-RPC request to the MCP server
    mcpProcess.stdin.write(JSON.stringify(rpcPayload) + '\n');
  });
}