/* 读模型测试：派生值读时算不落库、私密三出口过滤、ORDER BY rowid 稳定读序 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function freshDb() {
  const db = new DatabaseSync(':memory:');
  for (const f of readdirSync(join(ROOT, 'schema')).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort()) {
    db.exec(readFileSync(join(ROOT, 'schema', f), 'utf-8'));
  }
  return db;
}

async function seeded() {
  const db = freshDb();
  const demo = await import(join(ROOT, 'dsh/demo.js'));
  demo.seedDemoData(db);
  const rm = await import(join(ROOT, 'dsh/readmodels.js'));
  return { db, rm };
}

test('派生值读时算：复发中/缓解中第 N 天 / 距上次复发 / 近 90 天次数（以演示 TODAY 2026-11-08 复算）', async () => {
  const { db, rm } = await seeded();
  const st = rm.readDerivedStatus(db, 'demo-a', '2026-11-08');
  /* A 档案共享复发 1 条（a-f1 自 2026-09-05 复发中）→ 复发中第 65 天；无私密前无 sinceLast */
  assert.equal(st.mode, '复发中');
  assert.equal(st.dayN, 65);
  assert.equal(st.nearCount, 1); /* 近 90 天窗口自 2026-08-10 起：共享只有 2026-09-05（私密 a-f2 10-30 不计） */
  assert.equal(st.privateFlaps, 1);

  const b = rm.readDerivedStatus(db, 'demo-b', '2026-11-08');
  /* B 档案 6 次复发中 1 次私密：聚合只用共享 5 次；b-f6 自 2026-10-28 复发中 → 第 12 天 */
  assert.equal(b.privateFlaps, 1);
  assert.equal(b.mode, '复发中');
  assert.equal(b.dayN, 12);
  assert.equal(b.nearCount, 1); /* 近 90 天窗口：共享只有 2026-10-28（私密 2025-08-22 不在窗口也不计） */
});

test('派生值：私密复发不进聚合（共享口径）', async () => {
  const { db, rm } = await seeded();
  const shared = db.prepare("SELECT COUNT(*) c FROM flare_events WHERE profile_key='demo-b' AND is_private=0").get().c;
  const st = rm.readDerivedStatus(db, 'demo-b', '2026-11-08');
  assert.equal(shared, 5);
  assert.equal(st.nearCount, 1);
});

test('派生值：复发中形态（插入一条 end 为 NULL 的共享复发，行序语义不变）', async () => {
  const { db, rm } = await seeded();
  db.prepare("INSERT INTO flare_events (profile_key, start_date, end_date, trigger_text, note, is_private, ver) VALUES ('demo-a', '2026-10-01', NULL, '测试诱发', '测试复发中', 0, 1)").run();
  const st = rm.readDerivedStatus(db, 'demo-a', '2026-11-08');
  /* 行序语义与 app.js derivedStatus 一致：复发中取记录序第一条未结束复发（a-f1 2026-09-05）→ 第 65 天；
     新插入的共享未结束行使 nearCount 1→2（私密行不计，见上一测试） */
  assert.equal(st.mode, '复发中');
  assert.equal(st.dayN, 65);
  assert.equal(st.nearCount, 2);
});

test('距上次输注：infusion_events 只报最近一次事实间隔（不排程列）', async () => {
  const { db } = await seeded();
  const rows = db.prepare("SELECT event_date FROM infusion_events WHERE profile_key='demo-b' AND kind='免疫球蛋白输注' ORDER BY rowid").all();
  assert.ok(rows.length >= 4, 'B 档案输注 ≥4 次');
  const last = rows.map((r) => r.event_date).sort().pop();
  assert.equal(last, '2026-02-13', '最近一次输注日期（事实，非排程）');
  const cols = db.prepare('PRAGMA table_info(infusion_events)').all().map((c) => c.name);
  assert.ok(!cols.includes('next_due'), '无排程列 next_due');
});

test('三出口：export/ai 出口在读模型层剥掉全部私密行；dashboard 返回全量含标记', async () => {
  const { db, rm } = await seeded();
  for (const exit of ['export', 'ai']) {
    const b = rm.bootstrapForExit(db, exit);
    for (const p of b.profiles) {
      for (const x of [...p.flares, ...p.labs, ...p.infusions, ...p.exams, ...p.costs, ...p.questions, ...p.reports]) {
        assert.equal(x.private, false, `${exit} 出口存在私密行：${p.id} ${x.id}`);
      }
      for (const x of [...p.mind.feel, ...p.mind.family]) {
        assert.equal(x.private, false, `${exit} 出口存在私密心记：${p.id} ${x.d}`);
      }
    }
    const bb = b.profiles.find((p) => p.id === 'demo-b');
    assert.equal(bb.flares.length, 5, 'B 档案 export/ai 出口只剩 5 条共享复发');
  }
  const full = rm.bootstrapForExit(db, 'dashboard');
  const fb = full.profiles.find((p) => p.id === 'demo-b');
  assert.equal(fb.flares.length, 6, 'dashboard 全量（页面显示私密徽标）');
});

test('读序稳定：两次 readBootstrap 输出逐字节一致（ORDER BY rowid）', async () => {
  const { db, rm } = await seeded();
  const a = JSON.stringify(rm.readBootstrap(db));
  const b = JSON.stringify(rm.readBootstrap(db));
  assert.equal(a, b);
  /* 反向插入一行后，旧行序不变、新行在尾部 */
  db.prepare("INSERT INTO lab_results (profile_key, metric_key, measured_on, value, unit, method, org, is_private, ver) VALUES ('demo-a', 'hb', '2026-11-05', 5, 'g/L', '血常规 五分类', '示例市第一医院', 0, 1)").run();
  const again = rm.readBootstrap(db);
  const labs = again.profiles.find((p) => p.id === 'demo-a').labs;
  assert.equal(labs[labs.length - 1].date, '2026-11-05');
  assert.equal(labs[0].date, '2026-10-21');
});

test('section_titles / metric_defs 读出（分节标题进表，不用 subjects 平铺列）', async () => {
  const { db, rm } = await seeded();
  db.prepare("INSERT INTO section_titles (profile_key, key, title, ord) VALUES ('demo-a', 'labs', '化验与趋势', 0)").run();
  const titles = rm.readSectionTitles(db, 'demo-a');
  assert.equal(titles.length, 1);
  assert.equal(titles[0].title, '化验与趋势');
  const defs = rm.readMetricDefs(db);
  assert.deepEqual(defs.map((m) => m.title), ['IGG', 'HB', 'WBC', 'PLT', 'FPG', 'TC', 'CR', 'GRIP', '体重']);
});
