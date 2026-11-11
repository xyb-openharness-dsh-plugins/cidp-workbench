-- 0004（只增不改）：临床试验收藏。
-- 与 0003_add_app_setting.sql 分开：那一张是运行时设置（data_root），这一张是用户动作（收藏一条登记）。
-- 为什么需要它：收藏只存 localStorage 时，换资料目录/重装就丢；35 号 §一 段4 要求落 saved_trial。
CREATE TABLE IF NOT EXISTS saved_trial (
  record_id TEXT PRIMARY KEY,
  title TEXT,
  study_type TEXT,
  registry_numbers TEXT,
  source_url TEXT,
  snapshot_date TEXT,
  saved_at TEXT NOT NULL DEFAULT (datetime('now'))
);
