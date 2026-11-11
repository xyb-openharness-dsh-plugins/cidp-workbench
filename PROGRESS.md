# PROGRESS · cidp-workbench（小髓宝 MyelinPal · CIDP 慢性炎性脱髓鞘性多发性神经根神经病）

> 本文件按夜纲第 1 节维护：当前里程碑、已完成、下一步、阻塞、各闸口结论。
> 判未完成看本文件尾部最新更新，不看头部。

## 当前里程碑：M0–M9 全链完成（2026-11-12 01:25，晨审追认中）

## 已完成（认领四步，原子化落盘）
- BACKLOG 快照落盘：~/Downloads/night-logs-20261112/BACKLOG-snapshot-2319.md（2026-11-11 23:19）
- 认领 issue：xyb-openharness-dsh-plugins/.github#72（2026-11-11 23:28，labels: claim/triage/claimed，评论 /claim）
- 建私有仓：https://github.com/xyb-openharness-dsh-plugins/cidp-workbench（--private，2026-11-11 23:31）
- starter init：dsh-wb-cli 1.10.0-rc.37，239 文件，--config /tmp/cidp-init.json（小髓宝 MyelinPal · slug=cidp）
- 接线前置：cordis.patch.yml 已补 config.root: !!js dshHomePath('cidp')；package.json dsh 块与 repository 已核对

## 选型理由（写进 DEV-PLAN 的摘要）
- ⬜ 池交叉比对 issue 全列表后真实未认领项均为 T2；选 CIDP（罕见病 #13 · R2 · T2）
- 随访天然结构化：IVIG 周期输注（距上次输注 N 天）、复发—缓解区间、电生理复查
- 差异化明显：神经免疫慢性病族无既有仓；与 FSHD（遗传）/发作性睡病（中枢）/出血性疾病族（今晚已认领获得性血友病）语义不重叠
- 避碰：BACKLOG ⬜ 池中 PSC 与 pbc-workbench 语义重叠风险高、巨细胞动脉炎/NLRP3 与今晚密集认领的风湿族避碰、血小板无力症/VWD3 与出血族避碰
- claim 模板 404 事实已记录，issue 正文按 §0 六维手工补分级判定卡 + 4 条差异化矩阵（场景/功能/怎么验）

## 下一步
- M0：文档九件（SPEC、DEV-REQUIREMENTS、DIFF-MATRIX、PATIENT-FLOW、SCENARIOS、USER-RESEARCH、INTERACTION-DESIGN、CLINICAL-DATA、DEV-PLAN）+ 基线 npm run check + 首次 commit

## 阻塞
无

## 各闸口结论
（待填）


## 尾部更新（判未完成看这里）

### 2026-11-12 00:22 · M1+M2 完成
- M1（774cf74）：证据台账 E1–E7（患病率/2019 指南/目录归属，二次来源如实）；重名率实测 60%/20% ≤70%；SPEC 十节；G1 自动签认通过。
- M2（3fc6cc1 + 评审修复）：原型 v0.1（家族移植 + CIDP 语义重写，新增 检查与电生理/费用与医保 两页 + 输注间隔卡）；探针 39/39 + 10/10（显式 --url）+ 13/13；独立评审 P0×4 全修复 + P1×2 全修复；README 7 截图；G2 自动签认通过（待晨审追认）。
- M3 进行中：schema/0001_initial.sql（20 表）+ freeze-contract sha256 + test/schema.test.mjs（11 测试）。

### 阻塞
无

### 闸口结论
| 闸口 | 结论 |
| --- | --- |
| G1 | 通过（自动签认待晨审追认） |
| G2 | 通过（自动签认待晨审追认；独立评审 P0 清零） |


### 2026-11-12 01:26 · M3/M4/M5 完成
- M3（d44e4de+）：schema 0001（20 表）+ **0002 修复 exam_events FK mismatch**（M5 集成实测发现，按纪律走新增迁移）+ freeze sha256 + test 11/11；G3 通过。
- M4（37a8418）：unified-trial-mcp 实跑 **190 条**（ictrp 179 + chinadrugtrials 11；chictr_online FAILED 如实、TIMEOUT 1 不计查过）；四件套一致（manifest=jsonl=sqlite=190，hash 双对上）；一期不建匹配链路——临床页与设置 tab 同口径如实声明（快照已建、硬凑会造假符合度）。
- M5：dsh 七件 .cidp 化 + src→build→lib（551 行三注入）+ test **39/39** + check exit 0 + audit **44/44** + dev-server 双形态实测（health/bootstrap/seed 落库）+ public 形态探针 10/10+13/13 + pack:check 46 文件；V1 通过（docs/signoffs/V1-自动签认.md）。
- 过程修复：build-client 装载 id、migrate-public OLD 常量（含上游 pemphigus 残留）、ui-parity 引号口径、demo 成本金额数值还原、costs/exams 实体进读模型与三出口。

### 闸口结论
| 闸口 | 结论 |
| --- | --- |
| G1/G2/G3 | 通过（自动签认待晨审追认） |
| V1 | 通过（自动签认；audit 44/44） |


### 2026-11-12 00:50 · M6 完成（V2 通过）
- pack 0.1.0 tgz（46 文件）→ check-install 四要素（排除 DeepSeek Harness.app 干扰项）→ pnpm 装 Desktop profile（+1，兄弟 57 工作台完好）→ bundles 74 登记 → **AppleScript 重启宿主**（quit 16:41:49Z → 启动 16:41:53Z，本次段无激活失败）→ verify-desktop-load ✓（清单含本包、bundles 含本包）。
- 真机库直查：`$DSH_HOME/cidp/cidp-workbench.sqlite` 21 表 + migrations 0001+0002 + subjects 2/flares 8/infusions 11/labs 32（宿主侧服务层真实播种，config.root 生效）。
- V3 UI 级走查待人工（GUI 会话授权无法无人值守）——如实记录。

### 闸口结论
| 闸口 | 结论 |
| --- | --- |
| V2 | 通过（自动签认） |
| V3 | 服务层已验（真机直查）· UI 级走查待人工 |


### 2026-11-12 01:25 · M9 完成 + 验收巡检 + 晨审报告
- 验收巡检：USER-ACCEPTANCE-AUTOFIX A–F 全类通过（docs/signoffs/ACCEPTANCE-AUTOFIX-巡检-20261112.md）。
- M9 回流：starter rc.39（a9c4602）——init 骨架补真实 AI 面板接线（L90，fresh init 冒烟 exit 0）+ LESSONS L90–L92 + CHANGELOG 记回收；starter test 67/67 + check-starter 229 pass（本地 commit 未推送）。
- MORNING-REVIEW.md 落盘（六节）。
- git：全部 commit 已推 origin/main（私有仓 9d036a0）。

### 闸口结论（终版）
| 闸口 | 结论 |
| --- | --- |
| G1/G2/G3/V1/V2 | 通过（自动签认待晨审追认） |
| V3 | 服务层真机已验 · UI 级走查待人工 |
| M7/M8 | 草稿冻结（docs/release-draft/，未发布） |
| M9 | 完成（starter rc.39） |


### 2026-11-12 06:50 · 0.2.0 验收返工轮（晨审反馈两项 + 并行会话合流）
- 反馈①资料目录真选择：checkDataDir 口径校验（人话拒绝）+ /api/root GET/POST + Workbench.setDataRoot（切换/回滚/app_setting 持久化，0003）+ 设置页真表单（原型态诚实不挂载）；api-root.test 3 断言。
- 反馈②35 号四段试验线：建档/检索/匹配/收藏四子页 + trial-match.js 纯函数 + saved_trial 双写（0004 + /api/saved-trials）+ check-trial-matching（--self-test 11/11）入链；开发版检索走本机快照 190 条（notFullScan 口径）。
- **并行会话合流事件**：fbe7d66（0.1.2，另一会话同题返工）与本轮 0.2.0 在同一工作树交织——按「check 链为准合流」收束：22 表断言、顶栏配置目录（lib）+ 设置页更改位置（public）双入口共存、0003/0004 并存；CHANGELOG 三段（0.2.0/0.1.2/0.1.0）如实记两轮。
- 门禁：check 0 · test 42/42 · audit 44/44 · probe 44/44 · 0.2.0 已装 Desktop profile + 重启验证（23 表）。
- 已推送 origin/main 至 b718fee。

### 闸口结论（0.2.0 轮）
| 闸口 | 结论 |
| --- | --- |
| 返工①② | 通过（docs/signoffs/0.2.0-返工轮-自动签认.md，待晨审追认） |
