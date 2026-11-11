# DEV-REQUIREMENTS · 硬约束与可验证方式（2026-11-12 · M5 版）

> 每条硬约束都要能被一条命令或一张截图验证；不能验证的写「待人工（缺什么）」。

| # | 硬约束 | 可验证方式 | 状态 |
| --- | --- | --- | --- |
| H1 | 仅回顾不解读：界面无判读词/无颜色暗示好坏 | npm run check（check-wording 8 条禁词 0 命中）+ probe BAN1 | 通过 |
| H2 | 无判读列：schema 无 diagnosis/risk_level/score/activity/next_due 类列 | npm test（schema.test 判读列 0）+ check-schema-words | 通过 |
| H3 | 派生值读时算不落库（缓解中第 N 天/距上次输注/复发次数/费用合计） | npm test（readmodels.test 派生值三条） | 通过 |
| H4 | 私密三出口（看板摘要/导出/AI 上下文）代码级过滤 | npm test（readmodels.test 三出口）+ probe Q35a/b/c | 通过 |
| H5 | 更正=新增版本（ver+superseded_by），无裸删除 | npm test（schema.test 更正链）；grep「不可恢复」=0 | 通过 |
| H6 | 演示唯一源：demo-data.js 单源，读模型 parity | npm test（demo-parity canonical 逐字节） | 通过 |
| H7 | 化验可比组=方法+机构，不合并不做差 | 原型口径文案（看板本台口径卡）+ 指标卡差值逻辑（同组内） | 通过（探针 MT 组） |
| H8 | 版本四处同源（VERSION/package.json/CHANGELOG/README） | npm run check（check-version-literal）+ audit | 通过 |
| H9 | AI 草稿只填不发；agent-draft 桥无自动发送 | npm run check（check-agent-pane-contract 7 条）+ probe Q17 | 通过 |
| H10 | 会话激活按宿主归属服务判定（禁 Boolean(conversation)/ensureSession({})） | check-agent-pane-contract #1/#2 + 装机 V3 人工走查 | 通过（静态）+ 待人工（V3） |
| H11 | 资料目录口径：拒绝主目录/桌面/下载根/tmp | 设置·工作区 tab 文案（截图）；开发版 open-store 走宿主 | 通过（文案态） |
| H12 | MinerU 未接入形态如实标注（勾选与保存不联网） | 设置·MinerU tab 文案（截图） | 通过 |
| H13 | 阈值一律【待核】；量表只录医生原文 | 全站【待核】抽查 + probe P8（趋势段无禁止词） | 通过 |
| H14 | 临床试验快照「登记状态，未核实」；FAILED 不计查过 | research/cidp/manifest.json honesty + 临床页声明 | 通过 |
| H15 | 面板宽度 25–45% 可拖可收；收起不卸载 | probe Q5 + 40 号静态（src/client.js AGENT_PANE 同源） | 通过 |
| H16 | 390 宽无横向溢出（CDP 实测口径） | probe Q26（scrollWidth===clientWidth===390） | 通过 |
