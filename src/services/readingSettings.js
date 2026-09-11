/**
 * 阅读排版舒适度与字号调节服务 (readingSettings.js)
 * 支持 紧凑 (15px) / 标准 (16px) / 舒适 (18px) / 大字 (20px) 4 档排版
 * 自动持久化至 localStorage，并在切换时给出即时气泡反馈
 */

import { showToast } from "./uiHelpers.js";

const STORAGE_KEY = "darktu_reading_size";
const SIZES = [
  { key: "compact", label: "紧凑", size: "15px", line: "1.65" },
  { key: "standard", label: "标准", size: "16px", line: "1.75" },
  { key: "cozy", label: "舒适", size: "18px", line: "1.85" },
  { key: "large", label: "大字", size: "20px", line: "1.95" },
];

export function getInitialReadingSize() {
  if (typeof window === "undefined") return "standard";
  return localStorage.getItem(STORAGE_KEY) || "standard";
}

export function applyReadingSize(sizeKey, notify = false) {
  const target = SIZES.find((s) => s.key === sizeKey) || SIZES[1];
  document.documentElement.setAttribute("data-reading-size", target.key);
  try {
    localStorage.setItem(STORAGE_KEY, target.key);
  } catch (e) {
    // 忽略 localStorage 存储异常
  }

  const btn = document.getElementById("fontSizeToggleBtn");
  if (btn) {
    btn.setAttribute("data-current-size", target.key);
    btn.setAttribute("title", `当前正文字号：${target.label} (${target.size}) · 点击切换`);
    const labelSpan = btn.querySelector(".font-size-label");
    if (labelSpan) labelSpan.innerText = target.label;
  }

  if (notify) {
    showToast(`已切换至「${target.label}」排版 (${target.size}) 📖`);
  }
}

export function cycleNextReadingSize() {
  const currentKey = document.documentElement.getAttribute("data-reading-size") || "standard";
  const currentIndex = SIZES.findIndex((s) => s.key === currentKey);
  const nextIndex = (currentIndex + 1) % SIZES.length;
  applyReadingSize(SIZES[nextIndex].key, true);
}

export function setupReadingSettings() {
  if (typeof window === "undefined") return;

  const initial = getInitialReadingSize();
  applyReadingSize(initial, false);

  const btn = document.getElementById("fontSizeToggleBtn");
  btn?.addEventListener("click", () => {
    cycleNextReadingSize();
  });
}
