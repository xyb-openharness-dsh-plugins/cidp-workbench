/**
 * 领域服务：把"数据根 → 开库 → 播种 → 读模型"收在一个可测对象里。
 *
 * 为什么单独一层：`dsh/index.js` 要 import Schemastery（宿主提供的 peer，本仓装不上），
 * 那一行会让整个入口不可单测。把可测逻辑放这里，入口只留 wiring。
 */
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const HERE = dirname(fileURLToPath(import.meta.url));
import { openStore, closeStore, migrate } from './store.js';
import { seedDemoData, hasDemoData } from './demo.js';
import { readBootstrap } from './readmodels.js';
import { DB_FILE, HOME_DIR } from '../lib/identity.js';
import { version, displayVersion, build as buildDate } from '../lib/version.js';

export class Workbench {
  /**
   * @param {object} options
   * @param {string} options.root      用户资料目录（必须由用户明确指定；调用方负责校验）
   * @param {boolean} [options.seedDemo] 首次打开是否写入演示数据（默认 true，仅空库生效）
   */
  constructor({ root, seedDemo = true } = {}) {
    if (typeof root !== 'string' || root.trim() === '') throw new Error('Workbench 需要 root（用户资料目录）');
    this.root = root;
    this.dbFile = join(root, DB_FILE);
    this.db = null;
    this.seedDemo = seedDemo;
  }

  /** 打开（幂等）。迁移与播种都在这里完成。 */
  open() {
    if (this.db) return this;
    this.db = openStore(this.dbFile);
    this.migrations = migrate(this.db);
    /* 用户上次在面板里选过的资料目录优先于 cordis 的默认值（目录还在才生效）。
       少了这一步，「配置目录」选完重开 Desktop 又回到默认位置，等于没选。 */
    if (!this._rootApplied) {
      this._rootApplied = true;
      try {
        const row = this.db.prepare("SELECT value FROM app_setting WHERE key='data_root'").get();
        if (row?.value && row.value !== this.root && existsSync(row.value)) {
          closeStore(this.db);
          this.root = row.value;
          this.dbFile = join(this.root, DB_FILE);
          this.db = openStore(this.dbFile);
          this.migrations = migrate(this.db);
        }
      } catch { /* 旧库没有 app_setting 表也不该拦住打开 */ }
    }
    this.seeded = this.seedDemo ? seedDemoData(this.db) : { skipped: true, profiles: 0 };
    return this;
  }

  get dataRoot() { return this.root }

  /**
   * 切换资料目录：先开新库成功再替换，失败回滚到原库（不能把用户的数据根弄丢）。
   * 目录合法性由调用方（服务端）校验；这里只保证「切不过去就退回去」。
   */
  setDataRoot(nextRoot) {
    this.open();
    const dir = String(nextRoot || '').trim();
    if (!dir || dir === this.root) return this.root;
    const prevRoot = this.root;
    const prevFile = this.dbFile;
    closeStore(this.db);
    this.db = null;
    try {
      this.dbFile = join(dir, DB_FILE);
      this.db = openStore(this.dbFile);
      this.migrations = migrate(this.db);
      this.root = dir;
      this.db.prepare("INSERT INTO app_setting(key,value,updated_at) VALUES('data_root',?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at").run(dir);
      this.seeded = this.seedDemo ? seedDemoData(this.db) : { skipped: true, profiles: 0 };
      return this.root;
    } catch (error) {
      this.root = prevRoot;
      this.dbFile = prevFile;
      try { this.db = openStore(this.dbFile); } catch { this.db = null; }
      throw error;
    }
  }

  savedTrials() {
    this.open();
    return this.db.prepare('SELECT record_id, title, study_type, registry_numbers, source_url, snapshot_date, saved_at FROM saved_trial ORDER BY rowid DESC').all()
      .map((r) => ({ recordId: r.record_id, title: r.title, studyType: r.study_type, registryNumbers: r.registry_numbers ? JSON.parse(r.registry_numbers) : null, sourceUrl: r.source_url, snapshotDate: r.snapshot_date, savedAt: r.saved_at }));
  }

  saveTrial(rec = {}) {
    this.open();
    const id = String(rec.recordId || '').trim();
    if (!id) throw new Error('缺少 recordId');
    this.db.prepare(`INSERT INTO saved_trial(record_id,title,study_type,registry_numbers,source_url,snapshot_date)
      VALUES(?,?,?,?,?,?) ON CONFLICT(record_id) DO UPDATE SET title=excluded.title, saved_at=datetime('now')`)
      .run(id, rec.title ?? null, rec.studyType ?? null, rec.registryNumbers ? JSON.stringify(rec.registryNumbers) : null, rec.sourceUrl ?? null, rec.snapshotDate ?? null);
    return this.savedTrials();
  }

  removeTrial(recordId) {
    this.open();
    this.db.prepare('DELETE FROM saved_trial WHERE record_id = ?').run(String(recordId || ''));
    return this.savedTrials();
  }

  close() {
    if (this.db) { closeStore(this.db); this.db = null; }
  }

  get stats() {
    if (!this.db) return null;
    const subjects = this.db.prepare('SELECT COUNT(*) c FROM subjects').get().c;
    const labs = this.db.prepare('SELECT COUNT(*) c FROM lab_results').get().c;
    const flares = this.db.prepare('SELECT COUNT(*) c FROM flare_events').get().c;
    const infusions = this.db.prepare('SELECT COUNT(*) c FROM infusion_events').get().c;
    const metrics = this.db.prepare('SELECT COUNT(*) c FROM metric_defs').get().c;
    return { profiles: subjects, metrics, labs, flares, infusions, hasDemo: subjects > 0 };
  }

  bootstrap() {
    this.open();
    return readBootstrap(this.db);
  }

  profile(profileId) {
    this.open();
    return readBootstrap(this.db, profileId);
  }

  /** 供宿主 /health 用：只报事实，不报"是否已验证" */
  status() {
    return {
      version, displayVersion, buildDate,
      homeDir: HOME_DIR,
      dbFile: DB_FILE,
      root: this.root,
      capabilities: ['bootstrap', 'profile', 'health'],
      stats: this.stats,
      seeded: this.seeded ?? null,
      migrations: this.migrations ?? null,
    };
  }

  /** 演示数据重载（幂等；force 才清空重播，仅供开发用） */
  reloadDemo(force = false) {
    this.open();
    return seedDemoData(this.db, { force });
  }

  get hasData() {
    this.open();
    return hasDemoData(this.db);
  }

  /**
   * 临床试验检索（M4 research 快照，登记状态未核实；无匹配指数、无判读列）。
   * keyword 大小写不敏感 LIKE；未取得快照时返回 honest 空态（不写零结果）。
   */
  trialMatch(keyword, opts = {}) {
    /* 双形态查找：包内（宿主装机，research 随包发出）→ root 旁路（dev 布局）；都没有如实返回不可用 */
    const candidates = [
      join(HERE, '..', 'research', 'cidp', 'cidp_trials_2026.sqlite'),
      join(this.root, '..', 'research', 'cidp', 'cidp_trials_2026.sqlite'),
    ];
    let dbPath = null;
    for (const c of candidates) if (existsSync(c)) { dbPath = c; break; }
    if (!dbPath) {
      return { available: false, reason: 'research/cidp 快照不可用（M4 快照未采集或未随包发出）', records: [] };
    }
    const rdb = new DatabaseSync(dbPath, { readOnly: true });
    const kw = String(keyword || '').trim();
    const where = [];
    const params = [];
    if (kw) { where.push('title LIKE ?'); params.push('%' + kw + '%'); }
    if (opts.studyType) { where.push('study_type = ?'); params.push(String(opts.studyType)); }
    if (opts.source) { where.push('source_id = ?'); params.push(String(opts.source)); }
    const limit = Math.min(Math.max(Number(opts.limit) || 50, 1), 200);
    const sql = 'SELECT * FROM trials' + (where.length ? ' WHERE ' + where.join(' AND ') : '') + ' ORDER BY rowid LIMIT ?';
    const rows = rdb.prepare(sql).all(...params, limit);
    /* 候选池口径必须写在卡头上：已载多少、返回多少、不是全库扫描（35 号 §六） */
    const loaded = rdb.prepare('SELECT COUNT(*) c FROM trials').get().c;
    const studyTypes = rdb.prepare("SELECT DISTINCT study_type FROM trials WHERE study_type IS NOT NULL ORDER BY study_type").all().map((r) => r.study_type);
    const sources = rdb.prepare("SELECT DISTINCT source_id FROM trials WHERE source_id IS NOT NULL ORDER BY source_id").all().map((r) => r.source_id);
    const out = rows.map((r) => ({
      recordId: r.record_id, title: r.title, studyType: r.study_type,
      sponsors: r.sponsors ? JSON.parse(r.sponsors) : null,
      registryNumbers: r.registry_numbers ? JSON.parse(r.registry_numbers) : null,
      sourceUrl: r.source_url, statusNote: r.status_note, snapshotDate: r.snapshot_date,
    }));
    rdb.close();
    return {
      available: true,
      snapshotDate: out[0]?.snapshotDate ?? null,
      total: out.length,
      candidatePool: { loaded, returned: out.length, limit, notFullScan: true, studyTypes, sources },
      records: out,
    };
  }
}

export { readBootstrap, seedDemoData, openStore, closeStore };
