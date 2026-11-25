#!/usr/bin/env node
/**
 * darktu-mcp-server.mjs - Model Context Protocol (MCP) 生产级智能体工具总线
 * 遵循 MCP 规范 (JSON-RPC 2.0 via stdio) 与 Dune 架构公理
 * 为外部 Agent (Antigravity, Claude, Cursor) 提供结构化工具、资源与提示词能力
 */

import readline from "node:readline";
import { ALL_DOCS, getDocBySlugOrId } from "../src/data/navigation.js";
import { getArticleMarkdown } from "../src/data/articlesContent.js";
import { searchKnowledgeBase } from "../src/services/searchService.js";

const SERVER_NAME = "darktu-mcp-server";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2024-11-05";

// 工具定义清单
const TOOLS = [
  {
    name: "darktu_search_docs",
    description: "在 Darktu 知识库 48 篇词条与章节中执行 BM25/IDF 加权检索，支持中英混排分词与拼写容错，返回深层锚点与摘要",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "搜索关键词，支持多词组合或中英混排，如 'Markdown表格'、'HVV 算法' 或 'mXSS'" },
        limit: { type: "number", description: "最多返回结果数量，默认 5 条" },
      },
      required: ["query"],
    },
  },
  {
    name: "darktu_get_doc",
    description: "根据词条 slug 或 id 精确获取 Darktu 知识库任意文章的完整 Markdown 内容与结构化目录",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "词条标识符，如 'overview', 'syntax', 'w3c-clreq', 'hvv-hyperlink-vector-voting', 'mcp-model-context-protocol'" },
      },
      required: ["slug"],
    },
  },
  {
    name: "darktu_lint_typography",
    description: "依据 W3C CLReq 中文排版需求，对提供的中文文本进行盘古之白 (中英空格) 与排版合规检测",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "待检测排版合规性的中文文本内容" },
      },
      required: ["text"],
    },
  },
  {
    name: "darktu_canvas_action_schema",
    description: "获取 Darktu 专业画布 (darktu-canvas) 的 Agentic Canvas 双向操作协议定义与原子动作能力树",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// 资源定义清单
const RESOURCES = [
  {
    uri: "darktu://docs/catalog",
    name: "Darktu 知识库全量目录树与元数据清单",
    mimeType: "application/json",
    description: "包含全库 9 大分类、48 篇词条的标题、slug、描述与字数统计",
  },
];

// 提示词模板清单
const PROMPTS = [
  {
    name: "clreq_typesetting_review",
    description: "W3C CLReq 中文排版合规性评审提示词模板",
    arguments: [
      { name: "content", description: "需要进行中文排版审查的正文内容", required: true },
    ],
  },
  {
    name: "geo_citation_audit",
    description: "生成式引擎优化 (GEO) 句子级事实引用与抗幻觉审计提示词模板",
    arguments: [
      { name: "claim", description: "需要验证引用归因的陈述主张", required: true },
    ],
  },
];

/**
 * 执行工具调用
 */
export async function executeTool(name, args = {}) {
  switch (name) {
    case "darktu_search_docs": {
      const { query, limit = 5 } = args;
      const results = searchKnowledgeBase(query || "", undefined, undefined, { limit });
      const sliced = results.slice(0, limit).map((r) => ({
        id: r.doc.id,
        slug: r.doc.slug,
        title: r.doc.title,
        category: r.doc.categoryTitle,
        anchor: r.anchor || "",
        sectionTitle: r.sectionTitle || "",
        matchType: r.matchType || "content",
        snippet: r.snippet,
        score: r.score,
        url: r.anchor
          ? `https://docs.darktu.com/#/${r.doc.slug}#${r.anchor}`
          : `https://docs.darktu.com/#/${r.doc.slug}`,
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ query, totalHits: results.length, returned: sliced.length, results: sliced }, null, 2),
          },
        ],
      };
    }

    case "darktu_get_doc": {
      const { slug } = args;
      const { doc } = getDocBySlugOrId(slug);
      if (!doc) {
        return {
          isError: true,
          content: [{ type: "text", text: `未找到 slug 为 '${slug}' 的词条` }],
        };
      }
      const markdown = getArticleMarkdown(doc.id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              id: doc.id,
              slug: doc.slug,
              title: doc.title,
              category: doc.categoryTitle,
              url: `https://docs.darktu.com/#/${doc.slug}`,
              charCount: markdown.length,
              markdown,
            }, null, 2),
          },
        ],
      };
    }

    case "darktu_lint_typography": {
      const { text = "" } = args;
      const issues = [];

      // 检测缺少盘古之白 (中文字符与英文字符/数字紧密相连无空格)
      const cjkEngRegex = /([\u4e00-\u9fa5])([a-zA-Z0-9])/g;
      const engCjkRegex = /([a-zA-Z0-9])([\u4e00-\u9fa5])/g;
      let match;

      while ((match = cjkEngRegex.exec(text)) !== null) {
        issues.push({
          type: "missing_pangu_space",
          index: match.index,
          char: `${match[1]}${match[2]}`,
          suggestion: `${match[1]} ${match[2]}`,
          message: `中文字符 '${match[1]}' 与英数 '${match[2]}' 之间建议添加盘古之白空格`,
        });
      }

      while ((match = engCjkRegex.exec(text)) !== null) {
        issues.push({
          type: "missing_pangu_space",
          index: match.index,
          char: `${match[1]}${match[2]}`,
          suggestion: `${match[1]} ${match[2]}`,
          message: `英数字符 '${match[1]}' 与中文 '${match[2]}' 之间建议添加盘古之白空格`,
        });
      }

      // 检测直角引号或全角标点误用
      if (text.includes("“") && !text.includes("”")) {
        issues.push({ type: "unpaired_quote", message: "发现未闭合的双弯引号" });
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              totalCheckedChars: text.length,
              issuesCount: issues.length,
              isClean: issues.length === 0,
              issues,
            }, null, 2),
          },
        ],
      };
    }

    case "darktu_canvas_action_schema": {
      const actions = {
        GET_CANVAS_STATE: { description: "获取画布全局尺寸、图层数量、当前激活图层及几何定界框", payloadSchema: {} },
        CREATE_LAYER: { description: "创建新图层", payloadSchema: { name: "string", type: "raster|vector", fill: "string?", x: "number?", y: "number?" } },
        TRANSFORM_LAYER: { description: "原子平移与坐标重设", payloadSchema: { layerId: "string?", x: "number?", y: "number?", dx: "number?", dy: "number?" } },
        SET_LAYER_STYLE: { description: "调节图层样式属性", payloadSchema: { layerId: "string?", opacity: "number?", blendMode: "string?", visible: "boolean?", locked: "boolean?" } },
        ANNOTATE_RECT: { description: "在画布视口投射智能体空间批注矩形框与说明文字", payloadSchema: { x: "number", y: "number", width: "number", height: "number", label: "string", color: "string?" } },
        DELETE_LAYER: { description: "物理移除指定图层 (支持 100% 撤销)", payloadSchema: { layerId: "string" } },
      };
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ protocol: "AgentProtocol/1.0", supportedActions: actions }, null, 2),
          },
        ],
      };
    }

    default:
      return {
        isError: true,
        content: [{ type: "text", text: `未知的工具名称: ${name}` }],
      };
  }
}

/**
 * 处理 JSON-RPC 2.0 请求
 */
export async function handleRpcRequest(request) {
  const { id, method, params } = request;

  // 1. 初始化握手
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false },
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      },
    };
  }

  // 2. 初始化就绪通知 (无 id 响应)
  if (method === "notifications/initialized") {
    return null;
  }

  // 3. 工具列表
  if (method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { tools: TOOLS },
    };
  }

  // 4. 工具执行
  if (method === "tools/call") {
    const { name, arguments: args } = params || {};
    const result = await executeTool(name, args);
    return {
      jsonrpc: "2.0",
      id,
      result,
    };
  }

  // 5. 提示词列表
  if (method === "prompts/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { prompts: PROMPTS },
    };
  }

  // 6. 提示词获取
  if (method === "prompts/get") {
    const { name, arguments: args } = params || {};
    if (name === "clreq_typesetting_review") {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          description: "CLReq 中文排版合规性审查",
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `请作为 W3C CLReq 排版工程师，审查以下中文文本的排版美学与标点避头尾规范：\n\n${args?.content || ""}`,
              },
            },
          ],
        },
      };
    }
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: `未找到提示词模板: ${name}` },
    };
  }

  // 7. 资源列表
  if (method === "resources/list") {
    return {
      jsonrpc: "2.0",
      id,
      result: { resources: RESOURCES },
    };
  }

  // 8. 资源读取
  if (method === "resources/read") {
    const { uri } = params || {};
    if (uri === "darktu://docs/catalog") {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(ALL_DOCS.map((d) => ({
                id: d.id,
                slug: d.slug,
                title: d.title,
                category: d.categoryTitle,
                description: d.description,
                url: `https://docs.darktu.com/#/${d.slug}`,
              })), null, 2),
            },
          ],
        },
      };
    }
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: `未找到资源 URI: ${uri}` },
    };
  }

  // 未识别方法
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  };
}

/**
 * 启动 stdio 传输层监听 (当作为 CLI 运行时)
 */
function startStdioServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      const request = JSON.parse(trimmed);
      const response = await handleRpcRequest(request);
      if (response) {
        process.stdout.write(JSON.stringify(response) + "\n");
      }
    } catch (err) {
      const errResp = {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error: " + err.message },
      };
      process.stdout.write(JSON.stringify(errResp) + "\n");
    }
  });
}

// 若作为主脚本启动则开启 stdio 监听
if (process.argv[1] && process.argv[1].endsWith("darktu-mcp-server.mjs")) {
  startStdioServer();
}
