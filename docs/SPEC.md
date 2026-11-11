# 项目规格 · cidp-workbench（小髓宝 MyelinPal CIDP 工作台）

版本：v0.1 · 2026-11-12 · 状态：M1 草案（无人值守默认值落 DEV-PLAN §五，晨审追认；用户确认方向不等于 SPEC 确认）

## 一、问题、用户与最小闭环

- **输入**：患者/家属手上的 IVIG 输注记录、复发—缓解经过、化验与电生理报告、医生口头方案、费用票据。
- **动作**：按次登记（输注/复发/缓解/化验/检查/用药方案/费用）、看趋势、备复诊。
- **输出**：可追溯的病程档案——输注间隔一览、复发—缓解时间线、指标趋势、费用汇总、复诊问题清单。
- **失败恢复**：录入表单校验有提示；AI 候选拒收零副作用；更正=新增版本（无裸删除）。
- **成功标准**：患者复诊前 5 分钟内能列出「最近输注与间隔、最近复发经过、想问医生的 5 个问题」。
- 最小闭环：登记一笔输注 → 看板「距上次输注 N 天」更新 → 复诊清单引用该记录。

## 二、方案与 ADR

- **ADR-1 布局**：business-first（主区业务 + 右侧原生 AI 面板 35%，可拖 25–45%）。理由：宿主 customFrame 家族基线（40 号）；替代（AI 浮层/左侧）违反 Q5/A9，否决。
- **ADR-2 会话激活**：按宿主归属服务判定会话（`service.ownsSession` + `currentSession`），无会话走 `service.newSession(defaultWorkspace?.()?.workspaceId)`；禁 `Boolean(conversation)` 与 `ensureSession({})`（0.2.1 小暖宝实测教训 + check-agent-pane-contract 7 条断言）。已在骨架 lib/client.js 实现，静态 7/7。
- **ADR-3 试验线**：预设裁剪候选，M4 实测快照量级后定夺（DEV-PLAN §四）；裁剪时设置·临床数据库 tab 如实声明。
- **ADR-4 非肿瘤表达**：复发—缓解区间带（非症状色块日历）；「缓解中第 N 天/复发中第 N 天」（非 D+N）；医生原话照抄（非改写）。
- 目标宿主能力：desktopWorkbenches.register / newSession / defaultWorkspace / ownsSession / subscribe / sessions.scope——宿主合同见 docs/02-DSH-CONTRACT.md；装机核验在 M6。

## 三、功能范围

FEATURE-INVENTORY 一级/二级页面见 INTERACTION-DESIGN §一（10 页 + subpages）；功能线 F1–F11 见 DEV-REQUIREMENTS §二；每页有 AI 候选通道（IP5），AI 输出永远是「候选/预览」。

## 四、数据与 API

- 实体：profile（档案 2 表组）、metric（指标 3 表组）、infusion、flare、exam、medication_plan、cost、hospital、visit_item、record_asset——通用 7 + 专属 N 在 M3 schema/0001_initial.sql 冻结。
- 事实层唯一：手工/AI/导入三通道写同一事实层与更正链（IP9）；AI 候选不入事实层，核对后才入。
- 外部信息合同：疾病概要四段数据（来源四态，EVIDENCE-LEDGER E1–E7）；临床试验快照（如保留，M4 四件套）；未知值显式 null；时间窗/排序在 M3 定。

## 五、设置与配置页面

照 breast v0.4 CFG_TABS 三 tab（弹层，不占一级导航）：工作区（资料目录口径「拒绝主目录/桌面/下载根/tmp」）／文档解析 MinerU（未接入形态，勾选与保存不联网如实标注）／临床数据库（快照状态与裁剪声明，与临床页同口径）。详见 docs/SETTINGS-DESIGN.md。

## 六、UI 与原型一致性

原型 prototypes/v0.2（index.html/app.js/style.css/demo-data.js + primer 三件套）；语义 token；字号 12.5–15；三档断点 1180/900/600；ui-parity 双闸（check-ui-parity）在 M5 建。偏离逐条记录进 PARITY。

## 七、DSH 原生 AI 对话入口与面板

顶栏「AI 对话」固定序位；五态（展开/收起/隐藏/重开/窄屏抽屉）；无会话经宿主 newSession（取消/失败提示在面板 note 位，ADR-2）；草稿只填不发；`cidp:agent-draft` 桥携带本页事实上下文（无判定词），业务页 preventDefault 后 postMessage。装机人工走查项（V3）：面板出现/取消目录重试提示/失败原因提示/已有会话开合。

## 八、实施与验证

M2 原型（探针显式 --url）→ M3 schema 冻结 → M4 临床库 → M5 移植（src→lib→public，ui-parity）→ M6 装机（check-install 四要素 + verify-desktop-load）→ M7/M8 草稿。每步证据落 PROGRESS.md 与 signoffs/。

## 九、交付与发布

版本四处同源（VERSION/package.json/CHANGELOG/README）；M7 tag+release 与 M8 BACKLOG PR 只备草稿（docs/release-draft/），不发布不推送；市场投稿不适用（未授权）。

## 十、互动设计与确认关口

DESIGN-SESSION 未开（无人值守）：以两套参考基准（breast v0.4 + aml v0.2 #mind）+ 家族移植样板 cervical 为视觉与结构依据，晨审逐项追认；未确认模块不记为开发完成。
