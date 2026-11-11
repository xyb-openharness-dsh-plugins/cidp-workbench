# 变更记录

只增不删；每条写清"改了什么 + 为什么 + 用户可见结果"。版本号与 VERSION、package.json 三处必须一致。

## 0.1.2 — 2026-11-12

两条共同错误（同日两仓同踩）在本仓的修复：

- **资料目录从"说明弹窗"变真入口**：面板顶栏新增「配置目录」按钮 → `bridge.uiWorkspace.pickDirectory()` 调起系统选择器 → 口径硬拒主目录本身 / 桌面 / 下载根目录 / tmp（客户端与服务端各判一遍）→ `POST /api/cidp/api/root` 落盘并回显。宿主没有选择能力时**才**提示「本原型为示意，目录未真实挂载」。页面里那个只弹文字的 `open-store` 改成指向面板按钮。
- **临床试验恢复四段（不是裁剪说明）**：开发版的临床页此前被手改成「裁剪说明」——但原型里本来就有完整的 35 号四段（`prototypes/v0.2/trial-match.js` + 检索表单 + 候选池口径 + 逐条三态 + 收藏跟踪）。0.1.1 走 `build` 恢复原型那一版：检索走 `/api/cidp/api/trials`（快照 190 条，返回上限 50，卡头写「不是全库扫描」）、匹配按 `CidpTrialMatch` 纯函数出符合度与分层（可对照项不足 2 条不给百分数）、收藏可收藏/拒收/推进阶段。
- 新：`schema/0004_saved_trial.sql`（只增不改）——`saved_trial` 存收藏；`app_setting`（data_root）沿用 `0003_add_app_setting.sql`，两张表职责分开、编号不重复；收藏双写：localStorage 存跟进阶段，`saved_trial` 存基础记录。
- 新：服务端 `GET/POST /api/root`、`GET/POST/DELETE /api/saved-trials`；`trialMatch` 支持 studyType/source/limit 并返回 `candidatePool{loaded,returned,limit,notFullScan,studyTypes,sources}`。
- 修：探针 `probe-cidp-m2.mjs` 覆盖清单从 `clinical/notice` 改回四条真实子页；schema 单测表数 20→22（0003 新增两表）。
- 闸门：`check-data-dir.mjs` / `check-trial-chain.mjs` 入 `npm run check`；`npm run check` 全绿，`audit` 43/44（0 失败）。

## 0.2.0 — 2026-11-12（验收返工轮 · 晨审反馈两项）

- **资料目录真实选择**：设置·工作区「更改位置…」从示意弹窗改为真表单——GET/POST /api/root，服务端 checkDataDir 口径再判一遍（拒绝主目录/桌面/下载根/tmp，理由为人话），合法切换 = 新库迁移 + 空库播种演示数据，失败回滚原根并显示原因；上次选择的目录在重开宿主后仍生效（app_setting.data_root，0003 迁移）。原型（file://）态诚实保留「不会挂载目录」说明。
- **临床试验线按 35 号四段链路补齐**（此前「候选池个位数」为推断，190 条实测推翻）：建档（只有已确认入库字段参与）→ 检索（关键词+类型，按条件排不掺分数；开发版走本机快照 190 条）→ 匹配（匹配卡=符合度方块+登记元信息+硬性条件标签+固定行「n / m 项对得上 · k 项待确认」+ 证据链三态，可对照不足 2 条不给百分数；靶点不进分母）→ 收藏与跟踪（只存本机；开发版双写 saved_trial，换资料目录仍在；无进度条）。trial-match.js 纯函数 + check-trial-matching（--self-test 11/11）入 check 链。
- 版本 v0.2.0：改包必升版；检查器/探针同步（probe 44/44，新增 CLIN1–4、ROOT1–2）。
- 用户可见结果：开发版里「更改位置」真的换目录（拒绝有理由、切换即生效）；临床页从「裁剪说明」变成可用的四段试验线（检索 190 条真实快照，登记状态一律未核实）。

## 0.1.0 — 2026-11-12（M2–M6 夜间无人值守，晨审追认）

- 原型 v0.1（CIDP 语义全量）：看板状态卡（复发中/缓解中第 N 天 + 距上次输注 N 天，读时算）、复发—缓解区间带、免疫球蛋白输注按次登记（三态保存）、检查与电生理（原文照录 + 可比组）、费用与医保（读时算汇总）、化验四组 3D 指标卡、一图秀、疾病概要四段（？按钮双入口）、两套合成档案 A/B 切换；临床试验线一期不建匹配链路（快照 190 条已留存，如实声明）。
- 开发版：dsh 七件（index/server/store/readmodels/workbench/mineru/demo）+ src→build→lib 客户端链路（三注入）+ apiBase 定稿契约（交界守卫/双形态/禁裸 throw）+ MinerU 字典 9 项 + schema 0001（20 表）+ 0002（exam_events FK 修复）+ test 39/39 + check 全绿 + audit 44/44。
- 装机：pnpm 装 DSH Desktop profile，bundles 74，重启后宿主加载无激活失败；真机库 21 表 + 演示播种全量（V3 服务层已验、UI 走查待人工）。
- 用户可见结果：装好 DSH Desktop 后打开工作台即可查看与录入（演示数据形态，直到导入真实资料）；AI 对话经宿主 newSession 创建，草稿只填不发。

## 0.0.x — 2026-11-11

- 由社区脚手架 dsh-wb-cli@1.10.0-rc.37 (64b1582) 初始化（骨架占位，无业务功能）。
