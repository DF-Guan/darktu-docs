import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  buildGraphData,
  stepSimulation,
  renderGraph,
  CATEGORY_COLORS
} from '../src/services/graphService.js';
import { DOCS_NAVIGATION } from '../src/data/navigation.js';
import { getArticleMarkdown } from '../src/data/articlesContent.js';

describe('Knowledge Graph Engine - 2D Graph View (Obsidian / Quartz Benchmark)', () => {
  it('buildGraphData should construct 48 nodes and extract topological wikilinks', () => {
    const graph = buildGraphData(DOCS_NAVIGATION, getArticleMarkdown);
    assert.strictEqual(graph.nodes.length, 48, 'Must construct all 48 article nodes');
    assert.ok(graph.links.length > 20, 'Must extract substantive wikilink connections across articles');

    graph.nodes.forEach(node => {
      assert.ok(node.title, 'Node must have title');
      assert.ok(node.slug, 'Node must have slug');
      assert.ok(node.color, 'Node must have category color');
      assert.ok(Number.isFinite(node.x) && Number.isFinite(node.y), 'Node must have finite coordinates');
      assert.ok(node.radius >= 5 && node.radius <= 14, 'Node radius must be clamped appropriately');
    });

    graph.links.forEach(link => {
      assert.ok(link.source >= 0 && link.source < 48, 'Link source must point to valid node index');
      assert.ok(link.target >= 0 && link.target < 48, 'Link target must point to valid node index');
      assert.notStrictEqual(link.source, link.target, 'Link must not be a self-loop');
    });
  });

  it('stepSimulation should apply forces and update velocities without NaN', () => {
    const graph = buildGraphData(DOCS_NAVIGATION, getArticleMarkdown);
    const initialPos = { x: graph.nodes[0].x, y: graph.nodes[0].y };

    stepSimulation(graph, 900, 600, 0.4);

    assert.ok(Number.isFinite(graph.nodes[0].x), 'Node X must remain finite');
    assert.ok(Number.isFinite(graph.nodes[0].y), 'Node Y must remain finite');
    assert.notStrictEqual(graph.nodes[0].x, initialPos.x, 'Node X must update position under forces');
  });

  it('renderGraph should execute 2D rendering routines without throwing', () => {
    const graph = buildGraphData(DOCS_NAVIGATION, getArticleMarkdown);
    const mockCtx = {
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      arc: () => {},
      fill: () => {},
      fillText: () => {},
      strokeStyle: '',
      fillStyle: '',
      lineWidth: 1,
      globalAlpha: 1.0,
      font: '',
      textAlign: ''
    };

    // 1. 常规全览渲染
    renderGraph(mockCtx, graph, { width: 900, height: 600, zoom: 1.0, panX: 0, panY: 0, hovered: null, activeSlug: 'syntax' });

    // 2. 聚焦悬浮高亮渲染
    renderGraph(mockCtx, graph, { width: 900, height: 600, zoom: 1.2, panX: 50, panY: 50, hovered: 0, activeSlug: 'overview' });

    assert.ok(true, 'Rendering executed gracefully without exception');
  });

  it('CATEGORY_COLORS should map all major categories to modern palette', () => {
    assert.ok(CATEGORY_COLORS['markdown-specs']);
    assert.ok(CATEGORY_COLORS['typography']);
    assert.ok(CATEGORY_COLORS['geo-search']);
    assert.strictEqual(CATEGORY_COLORS['markdown-specs'], '#3b82f6');
  });
});
