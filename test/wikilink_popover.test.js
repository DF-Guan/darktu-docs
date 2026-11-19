import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePopoverPosition,
  extractLeadExcerpt,
} from "../src/services/wikilinkPreview.js";

test("calculatePopoverPosition: normal bottom placement within viewport", () => {
  const rect = { left: 200, right: 300, top: 150, bottom: 170 };
  const popWidth = 340;
  const popHeight = 160;
  const vpWidth = 1200;
  const vpHeight = 800;

  const pos = calculatePopoverPosition(rect, popWidth, popHeight, vpWidth, vpHeight);
  assert.equal(pos.placement, "bottom");
  assert.equal(pos.left, 200);
  assert.equal(pos.top, 178); // 170 + 8
});

test("calculatePopoverPosition: right edge collision clamps left", () => {
  const rect = { left: 1100, right: 1180, top: 200, bottom: 220 };
  const popWidth = 340;
  const popHeight = 160;
  const vpWidth = 1200;
  const vpHeight = 800;

  const pos = calculatePopoverPosition(rect, popWidth, popHeight, vpWidth, vpHeight);
  assert.equal(pos.placement, "bottom");
  // 1200 - 340 - 16 = 844
  assert.equal(pos.left, 844);
  assert.equal(pos.top, 228);
});

test("calculatePopoverPosition: left edge collision clamps left", () => {
  const rect = { left: 5, right: 80, top: 200, bottom: 220 };
  const popWidth = 340;
  const popHeight = 160;
  const vpWidth = 1200;
  const vpHeight = 800;

  const pos = calculatePopoverPosition(rect, popWidth, popHeight, vpWidth, vpHeight);
  assert.equal(pos.placement, "bottom");
  assert.equal(pos.left, 16);
});

test("calculatePopoverPosition: bottom collision flips to top placement", () => {
  const rect = { left: 300, right: 400, top: 700, bottom: 720 };
  const popWidth = 340;
  const popHeight = 160;
  const vpWidth = 1200;
  const vpHeight = 800;

  // Bottom top would be 728; 728 + 160 = 888 > 800 - 16 (784)
  // Top space = 700 - 8 = 692, enough for popHeight (160)
  const pos = calculatePopoverPosition(rect, popWidth, popHeight, vpWidth, vpHeight);
  assert.equal(pos.placement, "top");
  assert.equal(pos.left, 300);
  assert.equal(pos.top, 700 - 160 - 8); // 532
});

test("calculatePopoverPosition: constrained viewport clamps without negative coordinates", () => {
  const rect = { left: 50, right: 100, top: 20, bottom: 40 };
  const popWidth = 340;
  const popHeight = 160;
  const vpWidth = 300;
  const vpHeight = 150;

  const pos = calculatePopoverPosition(rect, popWidth, popHeight, vpWidth, vpHeight);
  assert(pos.left >= 16);
  assert(pos.top >= 16);
});

test("extractLeadExcerpt correctly filters callouts and formats prose", () => {
  const mdWithBlockquote = `
# 标题
> 这是引言定义，应该被提取为导语。

正文段落。
`;
  assert.equal(extractLeadExcerpt(mdWithBlockquote), "这是引言定义，应该被提取为导语。");

  const mdWithCallout = `
# 标题
> [!NOTE]
> 提示信息

这是正文首段，带有 **加粗强调**。
`;
  assert.equal(extractLeadExcerpt(mdWithCallout), "这是正文首段，带有 加粗强调。");
});
