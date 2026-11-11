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

/* 同批：saved_trial（收藏跟踪的服务端持久层；原型态只写 localStorage，开发版双写）。
 * 只存登记的结构化字段 + 收藏时间；无登记状态时间线列（快照没有这个数据，不画假进度条），
 * 无任何判读列。 */
CREATE TABLE IF NOT EXISTS saved_trial (
  record_id        TEXT PRIMARY KEY,
  title            TEXT,
  study_type       TEXT,
  registry_numbers TEXT,
  source_url       TEXT,
  snapshot_date    TEXT,
  saved_at         TEXT NOT NULL DEFAULT (datetime('now'))
);
