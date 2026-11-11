/* 0002 · 修复 exam_events.report_id 外键指向（2026-11-12 M5 集成实测发现）
 *
 * 缺陷：0001 里 exam_events.report_id TEXT REFERENCES reports(report_key)，
 * 但 reports.report_key 是可空普通列（非 UNIQUE/PK）——SQLite 建表即报
 * "foreign key mismatch"，开库直接失败（host-apply 实测踩到）。
 *
 * 修法：重建 exam_events，report_id 改为软引用（TEXT，无 FK）——
 * 报告关联在原型口径里本来就是展示层挂链（点「查看报告原文」），
 * 不需要数据库级完整性；演示数据播种也不写该列。
 *
 * 幂等：migration ledger 保证只执行一次；新库直接得到正确结构。
 */
DROP TABLE IF EXISTS exam_events;

CREATE TABLE exam_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  exam_date     TEXT NOT NULL,
  kind          TEXT NOT NULL,
  org           TEXT,
  finding_text  TEXT,            -- 原文照录；不做判读
  report_id     TEXT,            -- 软引用 reports.report_key；展示层挂链，不设 FK
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  created_on    TEXT
);

CREATE INDEX idx_exam_profile ON exam_events(profile_key, exam_date);
