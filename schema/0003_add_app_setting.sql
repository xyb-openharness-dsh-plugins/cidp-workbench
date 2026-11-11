/* 0003 · 新增 app_setting（运行时键值设置；2026-11-12 验收返工①）
 *
 * 用途：data_root（用户在面板里切换的资料目录优先于 cordis 默认值——
 * 目录还在时重开宿主仍生效；Workbench.open() 读它）。
 * 与事实表无关：纯运行时设置，不参与读模型、不进演示 parity。
 */
CREATE TABLE IF NOT EXISTS app_setting (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
