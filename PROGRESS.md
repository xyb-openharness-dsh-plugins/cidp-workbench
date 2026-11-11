# PROGRESS · cidp-workbench（小髓宝 MyelinPal · CIDP 慢性炎性脱髓鞘性多发性神经根神经病）

> 本文件按夜纲第 1 节维护：当前里程碑、已完成、下一步、阻塞、各闸口结论。
> 判未完成看本文件尾部最新更新，不看头部。

## 当前里程碑：M0 骨架（2026-11-11 23:33 认领完成）

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
