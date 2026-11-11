/* CIDP（慢性炎性脱髓鞘性多发性神经根神经病）工作台 · 初始数据模型（0001）
 *
 * 家族四条契约（与家族各仓同源）：
 *   1. 看法恒不为结论（viewpoints 只是记录，无 is_conclusion 列，读模型保证恒为"不是医生结论"）；
 *   2. 显式 null ≠ 0：未知日期、缺失值一律 NULL，不用空串冒充；
 *   3. 更正只新增版本，不覆盖（各事实表带 ver 与 superseded_by，历史行保留）；
 *   4. 事实四层不合并（文档 / 候选 / 记录 / 指标分表存放）。
 *
 * 非肿瘤三条数据层红线（CIDP 语境）：
 *   A. 无判读列：全库不设 diagnosis / risk_level / stage / 线序 / 疗效 / 残疾分级 / 电生理正常异常判定 类列；
 *      「缓解中第 N 天 / 距上次复发 N 天 / 距上次输注 N 天 / 近 90 天复发次数 / 费用合计」等派生值读时计算（读模型 / 前端），不落库。
 *      电生理关键值只存原文（finding_text），不做正常/异常判定。
 *   B. 复发—缓解是第一实体：flare_events 一行=一次复发（start_date 到 end_date，end IS NULL 表示复发中）；
 *      trigger 列记劳累/受凉等诱因【患者自述/医生原话照录】，不做因果判定。
 *   C. 化验可比组 = method + org：lab_results 不做跨组合并，分类不进趋势（category 只作分组展示键）；
 *      神经传导跨机构同样按 org 分组陈列（exam_events），不合并画线。
 *
 * 输注红线：infusion_events 只登记已发生的事实（日期/类别/内容/反应），不设 next_due 之类的排程列——
 * 「下次输注」只能以医生原话存在 profile_facts 或 meds note 里，本库不生成排程。
 *
 * 迁移只增不改：本文件冻结后（sha256 见 freeze-contract.md），
 * 要加结构只能新增 0002_*.sql，改这里会被 check 拦下。
 *
 * 约定：
 *   - ORDER BY rowid 为稳定读序（家族契约）；
 *   - in_use 标记候选/记录是否被采用；
 *   - 分节标题进 section_titles 表（不用上一排 *_title 列，家族教训）；
 *   - is_private 缺省 0；读模型默认不过滤，三出口（看板摘要/导出/AI 上下文）必须显式过滤 is_private=1。
 */

/* ---------- 档案级（2） ---------- */

CREATE TABLE subjects (
  profile_key   TEXT PRIMARY KEY,
  name          TEXT,
  meta          TEXT,            -- 侧栏第二行（标签 · 随访阶段）
  headline      TEXT,            -- 看板顶部一句事实摘要
  action_plan   TEXT,            -- 医生求助行动计划【原话照录】，界面不生成；无则 NULL
  dash_keys     TEXT,            -- JSON 数组：看板快捷卡顺序
  created_on    TEXT,
  is_demo       INTEGER DEFAULT 0
);

/* 分节标题：key 与读模型 section 键一一对应；某档案没有这一节就不写行 */
CREATE TABLE section_titles (
  profile_key TEXT,
  key         TEXT,
  title       TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, key)
);

/* ---------- 指标（3） ---------- */

/* 指标目录：分类只作分组展示键，不进趋势
 * immun=免疫球蛋白 / hemogram=血象 / safety=安全监测（激素相关） / vitals=体征与功能 */
CREATE TABLE metric_defs (
  key         TEXT PRIMARY KEY,  -- IGG / HB / WBC / PLT / FPG / TC / CR / GRIP / 体重
  title       TEXT,
  category    TEXT,
  unit        TEXT,              -- g/L / ×10⁹/L / mmol/L / µmol/L / kg
  color       TEXT,
  ord         INTEGER
);

/* 化验结果：可比组 = method + org；不做跨组合并；IgG 谷浓度只存原始值，不做高低判定 */
CREATE TABLE lab_results (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  metric_key    TEXT NOT NULL REFERENCES metric_defs(key),
  measured_on   TEXT,            -- 未知则 NULL
  value         REAL,
  value_text    TEXT,            -- 文本型结果（如「结果未取」），与 value 二选一
  unit          TEXT,
  method        TEXT,            -- 免疫比浊 / 血常规 五分类 / 己糖激酶法 / 酶法 …
  org           TEXT,            -- 机构或「自录」
  report_id     TEXT,            -- 同一报告的多次修订同 ID（最近报告表口径）
  is_private    INTEGER DEFAULT 0,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 指标分组标题（指标页与一图秀共用同一目录，组名/顺序/项数一致） */
CREATE TABLE metric_group_titles (
  profile_key TEXT,
  category    TEXT,
  title       TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, category)
);

/* ---------- 通用（7） ---------- */

/* 报告登记（原件状态：原件已登记/未取得原件/仅题录） */
CREATE TABLE reports (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  report_key    TEXT,            -- 同一报告历次修订同 key
  title         TEXT NOT NULL,
  kind          TEXT,            -- 化验 / 病历 / 检查 / 其他
  reported_on   TEXT,
  source_state  TEXT,            -- 原件已登记 / 未取得原件 / 仅题录
  key_finding   TEXT,            -- 关键描述【照录】，不做判读
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  created_on    TEXT
);

/* 就医信息：多家医院逐条卡 */
CREATE TABLE hospitals (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  name          TEXT NOT NULL,
  dept          TEXT,            -- 神经内科 / 肌电图室 …
  contact       TEXT,            -- 电话或「出处引用」
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  created_on    TEXT
);

/* 复诊问题清单（含「由私密记录改写的问题同样算私密」的继承标记：source_private_note_id） */
CREATE TABLE visit_questions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  question      TEXT NOT NULL,
  added_on      TEXT,
  answered_on   TEXT,            -- NULL=待问
  is_private    INTEGER DEFAULT 0,
  source_private_note_id INTEGER, -- 由私密感受改写的问题继承私密
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 感受与照护：感受 / 家人支持事项（author=本人/家属；只记录不评估，无评分列） */
CREATE TABLE mind_notes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  kind          TEXT NOT NULL,   -- feel / family
  noted_on      TEXT,
  body          TEXT NOT NULL,
  author        TEXT,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 看法（患者/家属视角记录，恒不为结论） */
CREATE TABLE viewpoints (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  scope         TEXT,            -- 关联的 section 键
  body          TEXT NOT NULL,
  author        TEXT,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* 文档（资料库登记） */
CREATE TABLE documents (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  name          TEXT NOT NULL,
  doc_type      TEXT,            -- 病历 / 化验 / 检查
  doc_date      TEXT,
  state         TEXT,            -- 已登记 / 已核对 / 待核对
  file_path     TEXT,
  is_private    INTEGER DEFAULT 0,
  created_on    TEXT
);

/* 日常用药（医生方案原话照录；无剂量推荐列，剂量写进 schedule_text 原文） */
CREATE TABLE meds (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  name          TEXT NOT NULL,
  schedule_text TEXT,            -- 医生方案原话（如激素减量安排）
  since_on      TEXT,
  note          TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER
);

/* ---------- 病种专属（5） ---------- */

/* 复发事件（第一实体）：end_date IS NULL = 复发中 */
CREATE TABLE flare_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  start_date    TEXT NOT NULL,
  end_date      TEXT,            -- NULL = 复发中（缓解日期未知也 NULL + note 说明）
  trigger_text  TEXT,            -- 劳累/受凉等诱因【患者自述照录】；不确定写「未知」或 NULL，不做因果判定
  note          TEXT,            -- 经过【照录】，界面不生成
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  created_on    TEXT
);

/* 免疫球蛋白输注按次登记：kind = 免疫球蛋白输注 / 复诊 / 调药 / 其他治疗；
 * name=医生安排原话照录；note=输注反应/备注【照录或事实描述】；
 * 不做疗效判定、不设排程列（「下次输注」只能来自医生原话） */
CREATE TABLE infusion_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  event_date    TEXT NOT NULL,
  kind          TEXT NOT NULL,
  name          TEXT NOT NULL,
  note          TEXT,
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  flare_id      INTEGER REFERENCES flare_events(id)
);

/* 检查与电生理按次登记：kind = 神经传导 / 肌电图 / 腰穿 / 彩超 / 其他；
 * finding_text=关键值原文照录；跨机构按 org 分组陈列，不设正常/异常判定列 */
CREATE TABLE exam_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  exam_date     TEXT NOT NULL,
  kind          TEXT NOT NULL,
  org           TEXT,
  finding_text  TEXT,            -- 原文照录；不做判读
  report_id     TEXT REFERENCES reports(report_key),
  is_private    INTEGER DEFAULT 0,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  created_on    TEXT
);

/* 费用与医保逐笔记录：只记事实金额，无报销比例/政策解读列 */
CREATE TABLE cost_records (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key    TEXT NOT NULL,
  spent_on       TEXT,
  item           TEXT NOT NULL,  -- 免疫球蛋白输注 / 化验 / 检查 / 药费 / 其他
  total_amount   TEXT,           -- 金额以文本存（票据未整理时存原文），数值汇总读时算
  reimbursed     TEXT,
  out_of_pocket  TEXT,
  is_private     INTEGER DEFAULT 0,
  ver            INTEGER DEFAULT 1,
  superseded_by INTEGER,
  infusion_id    INTEGER REFERENCES infusion_events(id),
  created_on     TEXT
);

/* 确诊档案字段（key-value，原文照录；不含分期/危险度/残疾分级判定）
 * fact_key 约定：确诊经过 / 进一步检查 / 并发症筛查 / 就诊医院 / 医生行动计划原话 */
CREATE TABLE profile_facts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  fact_key      TEXT NOT NULL,
  fact_value    TEXT NOT NULL,
  fact_date     TEXT,
  ver           INTEGER DEFAULT 1,
  superseded_by INTEGER,
  UNIQUE (profile_key, fact_key, ver)
);

/* ---------- 导入（3） ---------- */

CREATE TABLE import_batches (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_key   TEXT NOT NULL,
  imported_on   TEXT,
  source_desc   TEXT,
  status        TEXT             -- pending / partial / done / failed
);

CREATE TABLE import_candidates (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id      INTEGER NOT NULL REFERENCES import_batches(id),
  target_table  TEXT NOT NULL,   -- lab_results / reports / flare_events …
  payload       TEXT NOT NULL,   -- JSON
  in_use        INTEGER DEFAULT 0,  -- 核对采用才置 1；未采用候选不进事实层
  is_private    INTEGER DEFAULT 0,
  review_note   TEXT
);

CREATE TABLE import_conflicts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id      INTEGER NOT NULL REFERENCES import_batches(id),
  candidate_id  INTEGER REFERENCES import_candidates(id),
  conflict_kind TEXT,            -- duplicate / unit_mismatch / method_mismatch
  detail        TEXT,
  resolved_on   TEXT
);

/* 读序索引（ORDER BY rowid 契约的补充索引，不改变语义） */
CREATE INDEX idx_lab_profile_metric ON lab_results(profile_key, metric_key, measured_on);
CREATE INDEX idx_flare_profile ON flare_events(profile_key, start_date);
CREATE INDEX idx_infusion_profile ON infusion_events(profile_key, event_date);
CREATE INDEX idx_exam_profile ON exam_events(profile_key, exam_date);
CREATE INDEX idx_cost_profile ON cost_records(profile_key, spent_on);
