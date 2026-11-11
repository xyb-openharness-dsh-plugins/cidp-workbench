# DEV-PLAN · cidp-workbench（小髓宝 MyelinPal · CIDP）

版本：v0.1.0-dev · 2026-11-12 夜班 · 无人值守模式（不提问、不停等，默认值落 §五，晨审追认）

## 一、领取与选型理由

- BACKLOG 快照 2026-11-11 23:19（~/Downloads/night-logs-20261112/BACKLOG-snapshot-2319.md）；claim issue #72。
- ⬜ 池交叉比对 issue 全列表后，真实未认领项均为 T2；选 **CIDP（罕见病 #13 · R2 · T2）**。
- 选型四条：① 随访天然结构化——IVIG 周期输注（「距上次输注 N 天」）、复发—缓解区间、电生理复查、激素安全监测化验；② R2 FSHD 形态四块（确诊档案+功能与日常+并发症筛查+医保资源）直接适配；③ 神经免疫慢性病族无既有仓，差异化明显；④ 避碰：PSC 与 pbc-workbench 语义重叠、巨细胞动脉炎/NLRP3-AID 与当晚密集认领的风湿族避碰、血小板无力症/VWD3 与出血性疾病族（获得性血友病当晚认领）避碰。
- 品牌名：小髓宝 MyelinPal（髓鞘语义；与 MyeloPal 小浆宝/骨髓瘤区分）。

## 二、参考基准（第 3 节第 2 步）

- 移植样板（客户端链路底本）：cervical-workbench；成熟对比基准：breast-cancer-workbench/prototypes/v0.4（首页 hero、五 Tab、分类眉题、卡片与最近报告表）。
- 结构基准：aml-workbench/prototypes/v0.2 的 #mind/mind-burden（导航分组、生活影响线、事件泳道）。
- 只抄结构与元素体系，不抄病种语义。非肿瘤红线：无 D+N 治疗日历（改为「缓解中第 N 天 / 复发中第 N 天」）、无疗效预后判定、无肿瘤标志物口径。

## 三、里程碑计划（M0–M9）

| 里程碑 | 交付 | 闸口 |
| --- | --- | --- |
| M0 | 骨架 + 文档九件 + 基线 check 绿 + 首次 commit | — |
| M1 | 医学约束 10 主题 + 证据台账 + 用户研究（0 访谈如实）+ DIFF-MATRIX 重名率实测 ≤70% + SPEC/INTERACTION-DESIGN 全量 | G1 |
| M2 | 演示数据构建器（A/B 两套）+ prototypes/v0.2 四件套 + primer 三件套 + 探针（显式 --url）+ 独立评审 P0=0 + README 截图 | G2 |
| M3 | schema/0001_initial.sql + freeze-contract sha256 + 判读列断言 | G3 |
| M4 | scripts/fetch-cidp-trials 走 unified-trial-mcp → research/cidp/ 四件套（FAILED 如实） | — |
| M5 | dsh 七件 + src→lib + MinerU 六部件 + apiBase 契约 + test 五套 + check 全绿 + HVT | V1 |
| M6 | pack → 四要素 → pnpm 装 Desktop profile → bundles → 重启新会话 → 真机走查 → 截图 | V2/V3 |
| M7 | tag + release + CHANGELOG（无人值守：只备草稿 docs/release-draft/，不发布） | — |
| M8 | BACKLOG 状态行回填 PR（无人值守：只备草稿） | — |
| M9 | 经验回流 starter（本轮已知候选：init 骨架与 check-agent-pane-contract 自洽缺口） | — |

## 四、裁剪决定（有出处）

- 临床试验线：**预设裁剪候选**——CIDP 属罕见病，公开登记量级有限；M4 实跑 unified-trial-mcp 后按实际快照量级定夺（≥某可用量级才保留四段链路）。裁剪与否都以 M4 实测为依据写进 SPEC 与设置·临床数据库 tab，不静默缺失。
- 量表（INCAT/RODS 等）不做成判定工具：只提供「医生原文引用 + 自记笔记」通道，界面不计算、不分级（K5 红线）。

## 五、可回退默认值（无人值守，晨审追认）

| 决策点 | 默认值 | 可回退为 |
| --- | --- | --- |
| 服务主体 | 本机 CIDP 患者自用 + 家属照护者协助 | 患者组织志愿者协作 |
| 病程覆盖 | 确诊后全程随访（输注循环 + 复发缓解 + 长期并发症） | 只覆盖治疗循环期 |
| MinerU | 未接入形态（勾选与保存不联网，如实标注） | 接入后替换解析链 |
| 品牌占位名 | 小髓宝 MyelinPal | 用户改名 |
| 临床试验线 | 待 M4 实测后裁剪或保留 | 强制保留四段链路 |
| 演示数据 | 两套合成档案（A 刚确诊 1 次输注；B 多年随访多次输注+复发） | 用户自备脱敏数据 |

## 六、无人值守边界

仅：认领 issue、私有仓、本地 commit、项目内文件与脚本、装本机 DSH Desktop profile。M7 tag/release、M8 回填 PR 只备草稿。0 患者访谈、0 临床审核如实标注。
