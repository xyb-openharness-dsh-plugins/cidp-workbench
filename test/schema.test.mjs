/* M3 schema 测试：内存全建 + 判读列 0 + freeze sha256 一致 + 演示数据可装载 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { createHash } from 'node:crypto'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SQL = readFileSync(join(ROOT, 'schema/0001_initial.sql'), 'utf8')

function build() {
  const db = new DatabaseSync(':memory:')
  db.exec(SQL)
  return db
}

const EXPECTED_TABLES = ['subjects', 'section_titles', 'metric_defs', 'lab_results', 'metric_group_titles', 'reports', 'hospitals', 'visit_questions', 'mind_notes', 'viewpoints', 'documents', 'meds', 'flare_events', 'infusion_events', 'exam_events', 'cost_records', 'profile_facts', 'import_batches', 'import_candidates', 'import_conflicts']

test('schema：内存全建（20 表）', () => {
  const db = build()
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid").all()
  assert.equal(rows.length, 20, `建表数 ${rows.length} != 20`)
  for (const t of EXPECTED_TABLES) assert.ok(rows.some(r => r.name === t), `缺表 ${t}`)
})

test('schema：判读列 0（diagnosis/risk_level/stage/grade/score/activity 类派生判定不入库）', () => {
  const db = build()
  const banned = ['diagnosis', 'risk_level', 'stage', 'grade', 'score', 'activity', 'severity_level', 'is_conclusion', 'next_due', 'eligible', 'suitability']
  const hits = []
  for (const t of EXPECTED_TABLES) {
    const cols = db.prepare(`PRAGMA table_info(${t})`).all().map(c => c.name.toLowerCase())
    for (const c of cols) {
      if (banned.some(b => c === b || c.endsWith('_' + b))) hits.push(`${t}.${c}`)
    }
  }
  assert.deepEqual(hits, [], `判读列命中：${hits.join(', ')}`)
})

test('schema：ORDER BY rowid 稳定读序 + 显式 null（flare end NULL=复发中）', () => {
  const db = build()
  db.prepare("INSERT INTO flare_events (profile_key, start_date, end_date, note) VALUES ('p1', '2026-10-01', NULL, '进行中'), ('p1', '2026-09-01', '2026-09-20', '已缓解')").run()
  const rows = db.prepare("SELECT id, end_date FROM flare_events WHERE profile_key='p1' ORDER BY rowid").all()
  assert.equal(rows[0].end_date, null, '复发中必须显式 NULL（不用空串）')
  assert.equal(rows[1].end_date, '2026-09-20')
  const open = db.prepare("SELECT count(*) AS n FROM flare_events WHERE profile_key='p1' AND end_date IS NULL").get()
  assert.equal(open.n, 1, 'end IS NULL = 复发中，可据此派生状态卡')
})

test('schema：更正链（ver + superseded_by）与 in_use 候选语义', () => {
  const db = build()
  db.prepare("INSERT INTO profile_facts (profile_key, fact_key, fact_value, ver) VALUES ('p1', '确诊经过', '医生原话 v1', 1)").run()
  db.prepare("INSERT INTO profile_facts (profile_key, fact_key, fact_value, ver) VALUES ('p1', '确诊经过', '医生原话 v2', 2)").run()
  const vers = db.prepare("SELECT ver FROM profile_facts WHERE profile_key='p1' AND fact_key='确诊经过' ORDER BY ver").all().map(r => r.ver)
  assert.deepEqual(vers, [1, 2], '更正=新增版本，历史保留')
  db.prepare("INSERT INTO import_candidates (batch_id, target_table, payload, in_use) VALUES (1, 'lab_results', '{}', 0)").run()
  const cand = db.prepare('SELECT in_use FROM import_candidates').get()
  assert.equal(cand.in_use, 0, '候选缺省未采用，不进事实层')
})

test('schema：freeze-contract sha256 与文件一致', () => {
  const contract = readFileSync(join(ROOT, 'schema/freeze-contract.md'), 'utf8')
  const sha = createHash('sha256').update(SQL).digest('hex')
  assert.ok(contract.includes(sha), 'freeze-contract 里的 sha256 必须与 0001_initial.sql 实际 hash 一致')
})

test('演示数据（唯一源）可整体装载且两套档案字段齐备', () => {
  const src = readFileSync(join(ROOT, 'prototypes/v0.2/demo-data.js'), 'utf8')
  const sandbox = { window: {} }
  new Function('window', src)(sandbox.window)
  const data = sandbox.window.DEMO_DATA
  assert.ok(data.profiles.length === 2, '两套档案（A/B）')
  const required = ['flares', 'labs', 'infusions', 'exams', 'costs', 'meds', 'questions', 'hospitals', 'reports', 'docs', 'mind']
  for (const p of data.profiles) {
    for (const k of required) assert.ok(p[k] !== undefined, `${p.id} 缺 ${k}`)
  }
  assert.ok(data.profiles[1].flares.length >= 5, 'B 档复发多次')
  assert.ok(data.profiles[1].infusions.filter(x => x.kind === '免疫球蛋白输注').length >= 4, 'B 档输注 ≥4 次')
  const privFlare = data.profiles[1].flares.some(f => f.private)
  const privLab = data.profiles[1].labs.some(l => l.private)
  assert.ok(privFlare && privLab, '私密标记两档均有')
})

test('metricDefs 与 schema metric_defs 语境一致（category 四组、无阈值列）', () => {
  const src = readFileSync(join(ROOT, 'prototypes/v0.2/demo-data.js'), 'utf8')
  const sandbox = { window: {} }
  new Function('window', src)(sandbox.window)
  const defs = sandbox.window.DEMO_DATA.metricDefs
  const cats = new Set(defs.map(d => d.category))
  assert.ok(cats.has('immun') && cats.has('hemogram') && cats.has('safety') && cats.has('vitals'), '四组分类')
  const db = build()
  const ins = db.prepare('INSERT INTO metric_defs (key, title, category, unit, color, ord) VALUES (?, ?, ?, ?, ?, ?)')
  for (const d of defs) ins.run(d.key, d.title, d.category, d.unit, d.color, d.ord)
  const n = db.prepare('SELECT count(*) AS n FROM metric_defs').get()
  assert.equal(n.n, defs.length, '演示 metricDefs 全部可入库（列对齐）')
})
