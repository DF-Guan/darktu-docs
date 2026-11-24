/**
 * graphService.js - 2D Interactive Knowledge Graph View (对标 Obsidian / Quartz)
 * 纯客户端 60fps 力导向拓扑网络，展示 48 篇知识库词条间的维基内链关联
 */
import { DOCS_NAVIGATION, getDocBySlugOrId } from '../data/navigation.js';
import { getArticleMarkdown } from '../data/articlesContent.js';

export const CATEGORY_COLORS = {
  'markdown-specs': '#3b82f6', 'typography': '#10b981', 'latex-math': '#f59e0b',
  'mermaid-charts': '#8b5cf6', 'clipboard-eng': '#06b6d4', 'media-storage': '#ec4899',
  'compliance-legal': '#ef4444', 'geo-search': '#6366f1', 'appendix': '#64748b'
};

export function buildGraphData(nav = DOCS_NAVIGATION, getMd = getArticleMarkdown) {
  const allDocs = [];
  nav.forEach(cat => cat.items.forEach(item => allDocs.push({ ...item, categoryId: cat.id, categoryTitle: cat.title })));

  const docMap = new Map();
  const nodes = allDocs.map((d, idx) => {
    docMap.set(d.id, idx); docMap.set(d.slug, idx);
    if (d.aliasSlugs) d.aliasSlugs.forEach(a => docMap.set(a, idx));
    const angle = (idx / allDocs.length) * 2 * Math.PI, r = 200 + (idx % 3) * 40;
    return {
      index: idx, id: d.id, slug: d.slug, title: d.title, categoryId: d.categoryId,
      categoryTitle: d.categoryTitle, color: CATEGORY_COLORS[d.categoryId] || '#64748b',
      linksCount: 0, x: 450 + Math.cos(angle) * r, y: 320 + Math.sin(angle) * r,
      vx: 0, vy: 0, radius: 6
    };
  });

  const links = [], linkSet = new Set();
  allDocs.forEach((d, srcIdx) => {
    const md = getMd(d.id) || '', regex = /\(#\/([a-zA-Z0-9_-]+)\)/g;
    let match;
    while ((match = regex.exec(md)) !== null) {
      const targetDoc = getDocBySlugOrId(match[1].trim());
      if (targetDoc) {
        const tgtIdx = docMap.get(targetDoc.doc?.id || targetDoc.id);
        if (tgtIdx !== undefined && tgtIdx !== srcIdx) {
          const key = srcIdx < tgtIdx ? `${srcIdx}-${tgtIdx}` : `${tgtIdx}-${srcIdx}`;
          if (!linkSet.has(key)) {
            linkSet.add(key); links.push({ source: srcIdx, target: tgtIdx });
            nodes[srcIdx].linksCount++; nodes[tgtIdx].linksCount++;
          }
        }
      }
    }
  });

  nodes.forEach(n => { n.radius = Math.max(5, Math.min(13, 5 + Math.sqrt(n.linksCount) * 2.2)); });
  return { nodes, links };
}

export function stepSimulation(graph, width, height, alpha = 0.3) {
  const { nodes, links } = graph, cx = width / 2, cy = height / 2;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i], n2 = nodes[j], dx = n2.x - n1.x, dy = n2.y - n1.y;
      const d2 = dx * dx + dy * dy + 100, f = (600 / d2) * alpha;
      const fx = (dx / Math.sqrt(d2)) * f, fy = (dy / Math.sqrt(d2)) * f;
      n1.vx -= fx; n1.vy -= fy; n2.vx += fx; n2.vy += fy;
    }
  }
  for (const l of links) {
    const s = nodes[l.source], t = nodes[l.target], dx = t.x - s.x, dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1, f = (dist - 75) * 0.05 * alpha;
    const fx = (dx / dist) * f, fy = (dy / dist) * f;
    s.vx += fx; s.vy += fy; t.vx -= fx; t.vy -= fy;
  }
  nodes.forEach(n => {
    n.vx += (cx - n.x) * 0.015 * alpha; n.vy += (cy - n.y) * 0.015 * alpha;
    n.x += n.vx * 0.85; n.y += n.vy * 0.85; n.vx *= 0.8; n.vy *= 0.8;
  });
}

export function renderGraph(ctx, graph, { width, height, zoom = 1, panX = 0, panY = 0, hovered = null, activeSlug = '' }) {
  ctx.clearRect(0, 0, width, height); ctx.save();
  ctx.translate(panX, panY); ctx.scale(zoom, zoom);

  const connectedSet = new Set();
  if (hovered !== null) {
    connectedSet.add(hovered);
    graph.links.forEach(l => {
      if (l.source === hovered) connectedSet.add(l.target);
      if (l.target === hovered) connectedSet.add(l.source);
    });
  }

  graph.links.forEach(l => {
    const s = graph.nodes[l.source], t = graph.nodes[l.target];
    const isLit = hovered !== null && (l.source === hovered || l.target === hovered);
    ctx.strokeStyle = isLit ? '#3b82f6' : (hovered !== null ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.28)');
    ctx.lineWidth = isLit ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(t.x, t.y); ctx.stroke();
  });

  graph.nodes.forEach((n, idx) => {
    const isHovered = hovered === idx, isConn = connectedSet.has(idx);
    ctx.globalAlpha = (hovered !== null && !isConn) ? 0.15 : 1.0;
    if (n.slug === activeSlug) {
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = n.color; ctx.beginPath();
    ctx.arc(n.x, n.y, isHovered ? n.radius + 3 : n.radius, 0, Math.PI * 2); ctx.fill();

    if (isHovered || isConn || (n.linksCount >= 3 && zoom > 0.75)) {
      ctx.fillStyle = isHovered ? '#38bdf8' : (isConn ? '#f1f5f9' : '#cbd5e1');
      ctx.font = isHovered ? 'bold 12px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.title.length > 9 ? n.title.slice(0, 9) + '…' : n.title, n.x, n.y + n.radius + 12);
    }
  });
  ctx.restore();
}

export function setupKnowledgeGraph(getCurrentDoc) {
  if (typeof window === 'undefined') return;
  const btn = document.getElementById('knowledgeGraphBtn');
  let modal = document.getElementById('knowledgeGraphModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'knowledgeGraphModal'; modal.className = 'graph-modal-overlay';
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="graph-modal-dialog">
        <div class="graph-modal-header">
          <div class="graph-modal-title-group">
            <h2 class="graph-modal-title">🕸️ 知识图谱全景视网膜网络</h2>
            <span class="graph-modal-badge" id="graphStatsBadge">48 篇词条 · 拓扑连通</span>
          </div>
          <div class="graph-modal-actions">
            <button type="button" class="graph-action-btn" id="graphResetViewBtn">⟲ 复位</button>
            <button type="button" class="graph-action-btn" id="graphCloseModalBtn">✕ 关闭</button>
          </div>
        </div>
        <div class="graph-canvas-container" id="graphCanvasContainer">
          <canvas class="graph-canvas" id="knowledgeGraphCanvas"></canvas>
          <div class="graph-tooltip" id="graphTooltip"></div>
        </div>
        <div class="graph-modal-footer">
          <div class="graph-legend">${Object.entries(CATEGORY_COLORS).map(([k, c]) => `<span class="graph-legend-item"><span class="graph-legend-dot" style="background:${c}"></span>${k}</span>`).join('')}</div>
          <span>滚轮缩放，拖拽节点或视野，点击词条跳转</span>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  const canvas = modal.querySelector('#knowledgeGraphCanvas'), tooltip = modal.querySelector('#graphTooltip');
  const container = modal.querySelector('#graphCanvasContainer');
  let graph = null, animId = null, alpha = 0.5, zoom = 1, panX = 0, panY = 0, hovered = null;
  let isPanning = false, dragNode = null, startX = 0, startY = 0;

  function loop() {
    if (alpha > 0.005) { stepSimulation(graph, container.clientWidth, container.clientHeight, alpha); alpha *= 0.985; }
    const ctx = canvas.getContext('2d');
    renderGraph(ctx, graph, { width: container.clientWidth, height: container.clientHeight, zoom, panX, panY, hovered, activeSlug: getCurrentDoc?.()?.slug || '' });
    animId = requestAnimationFrame(loop);
  }
  function openModal() {
    graph = buildGraphData(); modal.classList.add('visible');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr; canvas.height = container.clientHeight * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
    alpha = 0.5; zoom = 1; panX = 0; panY = 0; animId = requestAnimationFrame(loop);
  }
  function closeModal() { modal.classList.remove('visible'); if (animId) cancelAnimationFrame(animId); }

  btn?.addEventListener('click', openModal);
  modal.querySelector('#graphCloseModalBtn')?.addEventListener('click', closeModal);
  modal.querySelector('#graphResetViewBtn')?.addEventListener('click', () => { zoom = 1; panX = 0; panY = 0; alpha = 0.2; });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('visible')) closeModal(); });

  canvas?.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.max(0.3, Math.min(3, zoom * (e.deltaY < 0 ? 1.1 : 0.9))); });
  canvas?.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect(), mx = (e.clientX - rect.left - panX) / zoom, my = (e.clientY - rect.top - panY) / zoom;
    dragNode = graph.nodes.find(n => Math.hypot(n.x - mx, n.y - my) <= n.radius + 4) || null;
    if (dragNode) { alpha = 0.3; } else { isPanning = true; startX = e.clientX - panX; startY = e.clientY - panY; }
  });
  window.addEventListener('mousemove', (e) => {
    if (!modal.classList.contains('visible')) return;
    const rect = canvas.getBoundingClientRect();
    if (dragNode) {
      dragNode.x = (e.clientX - rect.left - panX) / zoom; dragNode.y = (e.clientY - rect.top - panY) / zoom; alpha = 0.2;
    } else if (isPanning) {
      panX = e.clientX - startX; panY = e.clientY - startY;
    } else {
      const mx = (e.clientX - rect.left - panX) / zoom, my = (e.clientY - rect.top - panY) / zoom;
      const found = graph?.nodes.find(n => Math.hypot(n.x - mx, n.y - my) <= n.radius + 4);
      hovered = found ? found.index : null;
      if (found && tooltip) {
        tooltip.style.display = 'block'; tooltip.style.left = `${e.clientX - rect.left}px`; tooltip.style.top = `${e.clientY - rect.top}px`;
        tooltip.innerHTML = `<strong>${found.title}</strong><br><span style="opacity:0.8;font-size:11px;">[${found.categoryTitle}] · 关联 ${found.linksCount} 处</span>`;
      } else if (tooltip) { tooltip.style.display = 'none'; }
    }
  });
  window.addEventListener('mouseup', () => { dragNode = null; isPanning = false; });
  canvas?.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect(), mx = (e.clientX - rect.left - panX) / zoom, my = (e.clientY - rect.top - panY) / zoom;
    const found = graph?.nodes.find(n => Math.hypot(n.x - mx, n.y - my) <= n.radius + 4);
    if (found) { window.location.hash = `#/${found.slug}`; closeModal(); }
  });
}
