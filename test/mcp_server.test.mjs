import test from "node:test";
import assert from "node:assert/strict";
import { handleRpcRequest, executeTool } from "../scripts/darktu-mcp-server.mjs";

test("MCP Server initialize handshake complies with specification", async () => {
  const initReq = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      clientInfo: { name: "test-client", version: "1.0.0" },
      capabilities: {},
    },
  };

  const res = await handleRpcRequest(initReq);
  assert.equal(res.jsonrpc, "2.0");
  assert.equal(res.id, 1);
  assert.equal(res.result.protocolVersion, "2024-11-05");
  assert.equal(res.result.serverInfo.name, "darktu-mcp-server");
  assert.ok(res.result.capabilities.tools);
  assert.ok(res.result.capabilities.resources);
  assert.ok(res.result.capabilities.prompts);
});

test("MCP Server tools/list and tools/call on darktu_search_docs", async () => {
  // tools/list
  const listReq = { jsonrpc: "2.0", id: 2, method: "tools/list" };
  const listRes = await handleRpcRequest(listReq);
  assert.equal(listRes.result.tools.length, 4);
  const toolNames = listRes.result.tools.map((t) => t.name);
  assert(toolNames.includes("darktu_search_docs"));
  assert(toolNames.includes("darktu_get_doc"));
  assert(toolNames.includes("darktu_lint_typography"));
  assert(toolNames.includes("darktu_canvas_action_schema"));

  // tools/call: search HVV
  const callReq = {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: {
      name: "darktu_search_docs",
      arguments: { query: "HVV 超链接", limit: 3 },
    },
  };
  const callRes = await handleRpcRequest(callReq);
  assert.equal(callRes.id, 3);
  assert.ok(callRes.result.content);
  const payload = JSON.parse(callRes.result.content[0].text);
  assert.ok(payload.totalHits >= 1);
  assert(payload.results[0].slug.includes("hvv"));
});

test("MCP Server tools/call on darktu_get_doc retrieves accurate markdown", async () => {
  const callReq = {
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: {
      name: "darktu_get_doc",
      arguments: { slug: "mcp-model-context-protocol" },
    },
  };
  const callRes = await handleRpcRequest(callReq);
  assert.equal(callRes.id, 4);
  const doc = JSON.parse(callRes.result.content[0].text);
  assert.equal(doc.slug, "mcp-model-context-protocol");
  assert(doc.markdown.includes("Model Context Protocol"));
  assert(doc.charCount > 500);
});

test("MCP Server tools/call on darktu_lint_typography detects spacing issues", async () => {
  const callReq = {
    jsonrpc: "2.0",
    id: 5,
    method: "tools/call",
    params: {
      name: "darktu_lint_typography",
      arguments: { text: "阅读CommonMark规范并学习100条准则" },
    },
  };
  const callRes = await handleRpcRequest(callReq);
  const lint = JSON.parse(callRes.result.content[0].text);
  assert.equal(lint.isClean, false);
  assert.ok(lint.issuesCount >= 2);
  assert.ok(lint.issues.some((i) => i.type === "missing_pangu_space"));
});

test("MCP Server prompts and resources interfaces", async () => {
  // prompts/list
  const promptsReq = { jsonrpc: "2.0", id: 6, method: "prompts/list" };
  const promptsRes = await handleRpcRequest(promptsReq);
  assert.ok(promptsRes.result.prompts.some((p) => p.name === "clreq_typesetting_review"));

  // resources/list & read
  const resReq = { jsonrpc: "2.0", id: 7, method: "resources/list" };
  const resRes = await handleRpcRequest(resReq);
  assert.ok(resRes.result.resources.some((r) => r.uri === "darktu://docs/catalog"));

  const readReq = { jsonrpc: "2.0", id: 8, method: "resources/read", params: { uri: "darktu://docs/catalog" } };
  const readRes = await handleRpcRequest(readReq);
  const catalog = JSON.parse(readRes.result.contents[0].text);
  assert.equal(catalog.length, 47);
});
