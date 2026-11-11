# USER-ACCEPTANCE-AUTOFIX 巡检记录（2026-11-12 01:10 · 按 pericarditis 家族提示词 A–F）

> 时机：M5 完成后生效。逐类先检查后判定；本仓所有类均「检查通过，无需修复轮」。三态如实。

## DP 疾病概要（每轮必查第一条）

| 检查 | 结论 | 证据 |
| --- | --- | --- |
| 顶栏可点「?」（data-primer-open），aria-label 含四段 | 通过 | index.html L39（aria-label 全四段名） |
| 首页状态卡第二入口 | 通过 | app.js primerBtn（probe P1b：entries≥2 且文字入口可开四段、Esc 焦点回归） |
| 点击后 #disease-primer 真实出现（primer.js 动态建 DOM） | 通过 | probe-disease-primer 10/10（原型 --url 形态）+ 10/10（public dev-server 形态） |
| 四段标题按序 + 来源行 + 双入口 + Esc 退一层 | 通过 | 同上（P2/P4/P5/P7） |
| 探针显式 --url 指向本仓 | 通过 | 签认表 URL=127.0.0.1:<port>/prototypes/v0.2/index.html 与 8166/ dev-server，非 starter examples |

## A 设置与弹层

- 通过：顶栏「设置」开弹层，三 tab（工作区/文档解析 MinerU/临床数据库）可切（probe CFG1 tabs 逐字比对）；侧栏无设置项（PAGES 无「设置」，grep data-action="settings" 仅顶栏 1 处）；MinerU 同意勾选 + 「勾选与保存不联网」在（原型与 public 同源）。

## B 功能线完整性

- 通过：一级导航 11 页（含「临床」裁剪声明页）vs breast v0.4 菜单体系并排——缺的只有试验匹配线，**有出处**（DEV-PLAN §四 + 临床页/设置 tab 同口径声明：快照 190 条已留存、一期未建匹配链路——不静默缺失）；21 叶子路由全渲染非空（probe IP2 + check-probe-coverage 对账 21/21）；每个可写页空态有下一步按钮（ADD1/ADD2）。

## C 试验匹配红线

- 不适用（n/a，如实）：本仓裁剪匹配线（有出处声明）；快照与检索通道终态在 research/cidp/（FAILED 5 条如实，未写零结果）；禁词「匹配指数/入选概率/eligible/suitability」全仓 grep：唯一命中是 dsh/workbench.js 注释里的否定声明（非患者可见文案；check-wording 患者可见文案 0 命中）。

## D 指标卡与指标体系

- 通过：看板最近值卡（TILE1 ≥5，实测 9）；指标检测页 3D 卡随数据成组（MC1：9 卡 4 组——免疫球蛋白/血象/安全监测/体征）；翻转双通道（FLIP2：aria-pressed=true + .flipped class + matrix3d rotateY(-1)，先重置再点防污染）；卡片定高 194±1（MT07）；「较上次」只写同方法同机构组内差值（MT 口径，无好坏暗示）。

## E 录入窗口

- 通过：8 个可写页页首「＋」主按钮（ADD1 全 true）；6 类表单本体在（ADD2：化验/输注/检查/费用/报告/感受 + 复诊/医院）；三态保存（保存并继续录入/保存并关闭/取消）逐表单在；字段 ≤6；数字输入 inputmode="decimal"（费用/化验）；无裸删除（更正=新版本，grep「不可恢复」=0）；就医信息多医院逐条卡 + 修改=新版本提示（F6）；医生原话类（行动计划/激素方案）只照抄（demo-data 照录口径）。

## F 修复铁律（门禁汇总）

| 门禁 | 数字 |
| --- | --- |
| npm run check | exit 0（含 agent-pane-contract 10 断言、探针覆盖 21 路由、版本字面量、ui-parity、tokens） |
| npm test | **39/39** |
| npm run audit | **44/44 · 0 失败 · 0 待人工** |
| probe-cidp-m2 | **39/39**（自起服务，--url 口径） |
| probe-disease-primer | **10/10**（原型 + public 双形态） |
| probe-page-view | **13/13**（原型 + public 双形态） |
| pack | tgz 46 文件 3,090,666 字节；装机 Desktop profile + bundles 74 + 重启宿主加载无失败 |

## 遗留（如实）

- V3 UI 级真机走查待人工（Desktop GUI 会话授权不可无人值守）。
- P2 打磨项六条（枚举写死、注释残留等）见 G2 签认，不阻断。
