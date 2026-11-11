/* 返工①测试：资料目录选择——口径校验（人话理由）+ /root GET/POST 契约 + 切换回滚 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDataDir, createHandler } from '../dsh/server.js';
import { Workbench } from '../dsh/workbench.js';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('口径校验：拒绝主目录/桌面/下载根/tmp，理由是人话', () => {
  const bad = [
    ['/Users/qinxiaoqiang', '主目录'],
    ['/home/someone', '主目录'],
    ['/Users/qinxiaoqiang/Desktop', '桌面'],
    ['/Users/qinxiaoqiang/Downloads', '下载根目录'],
    ['/tmp/cidp', 'tmp'],
    ['/private/tmp/cidp', 'tmp'],
    ['relative/path', '绝对路径'],
    ['', '目录为空'],
  ];
  for (const [dir, kw] of bad) {
    const v = checkDataDir(dir);
    assert.equal(v.ok, false, `${dir} 应被拒绝`);
    assert.ok(v.reason.includes(kw), `${dir} 的理由应含「${kw}」：${v.reason}`);
  }
  const good = checkDataDir('/Users/qinxiaoqiang/Documents/cidp-records');
  assert.equal(good.ok, true, '合法子目录应通过（下载根的**子目录**不在拒绝列）');
});

test('/root 契约：GET 返回当前根；POST 拒绝给出理由 + 保持原根（stub 服务，契约层）', async () => {
  let current = '/Users/qinxiaoqiang/Documents/cidp-stub-root';
  const handler = createHandler({
    apiBase: '',
    publicDir: null,
    services: {
      version: '0.2.0',
      dataRoot: () => current,
      setDataRoot: (dir) => { current = dir; return dir; },
    },
  });
    const invoke = (method, path, body) => new Promise((resolve) => {
      const req = { method, url: path, on: (ev, cb) => { if (ev === 'data') cb(Buffer.from(JSON.stringify(body || {}))); if (ev === 'end') cb(); } };
      const res = {
        code: 0, body: '',
        writeHead(code) { this.code = code; return this; },
        end(b) { this.body = b || ''; resolve({ status: this.code, json: (() => { try { return JSON.parse(this.body); } catch { return null; } })() }); },
      };
      handler(req, res);
    });
    const g1 = await invoke('GET', '/api/root');
    assert.equal(g1.status, 200);
    assert.equal(g1.json.dir, '/Users/qinxiaoqiang/Documents/cidp-stub-root', 'GET 返回当前根');

    const bad = await invoke('POST', '/api/root', { dir: '/tmp/nope' });
    assert.equal(bad.status, 400);
    assert.ok(bad.json.error.includes('tmp'), '拒绝理由给人话');
    assert.equal(bad.json.dir, '/Users/qinxiaoqiang/Documents/cidp-stub-root', '失败保持原根（不丢用户数据根）');

    const okPost = await invoke('POST', '/api/root', { dir: '/Users/qinxiaoqiang/Documents/cidp-new-root' });
    assert.equal(okPost.status, 200);
    assert.equal(okPost.json.dir, '/Users/qinxiaoqiang/Documents/cidp-new-root', '合法切换成功');
});

test('Workbench.setDataRoot：真实切换 + 空库播种 + 失败回滚（合法目录口径下）', async () => {
  const { rmSync } = await import('node:fs');
  /* checkDataDir 拒绝 tmp 系；真实切换测试用用户下载区的子目录（合法口径），跑完清理 */
  const target = join('/Users/qinxiaoqiang/Downloads', '.cidp-test-root-' + String(Date.now()));
  const root = mkdtempSync(join(tmpdir(), 'cidp-root2-'));
  const wb = new Workbench({ root });
  wb.open();
  try {
    wb.setDataRoot(target);
    assert.equal(wb.dataRoot, target, '根已切换');
    assert.ok(wb.stats.hasDemo, '新根空库已播种演示数据');
    assert.throws(() => wb.setDataRoot('/proc/nonexistent-xyz/deeper'), '不可创建的目录应抛错');
    assert.equal(wb.dataRoot, target, '失败回滚到切换后的根');
    assert.equal(wb.bootstrap().profiles.length, 2, '数据完好');
  } finally {
    wb.close();
    try { rmSync(target, { recursive: true, force: true }); } catch { /* 清理失败不挡测试结论 */ }
  }
});
