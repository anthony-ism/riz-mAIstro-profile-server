import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { config } from './config.mjs';
import { profileTools } from './profile_tools.mjs';

export function createMcpServer() {
  // Create MCP server
  const server = new McpServer({
    name: config.server.name,
    version: config.server.version
  });

  // Register all profile tools
  Object.values(profileTools).forEach(tool => {
    server.registerTool(tool.name, {
      description: tool.description,
      inputSchema: tool.inputSchema
    }, tool.handler);
  });

  return server;
}