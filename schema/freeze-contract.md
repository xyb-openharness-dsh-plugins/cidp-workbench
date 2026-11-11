# freeze-contract · cidp-workbench

- 冻结文件：schema/0001_initial.sql
- sha256：`c60dc8cc3c738062211eec38ffc6ad7e195b01c7b3e96a61ae6afef8b34d04db`
- 冻结时间：2026-11-12 00:10（M3 · 夜间无人值守）
- 纪律：G3 后结构变更只能新增 000N_*.sql；改冻结文件会被 check 拦下。判读列断言（check-schema-words）已入 check 链。
- 表清单（20）：档案级 2（subjects / section_titles）· 指标 3（metric_defs / lab_results / metric_group_titles）· 通用 7（reports / hospitals / visit_questions / mind_notes / viewpoints / documents / meds）· 专属 5（flare_events / infusion_events / exam_events / cost_records / profile_facts）· 导入 3（import_batches / import_candidates / import_conflicts）
- 语境要点：flare_events.end_date IS NULL=复发中；infusion_events 无排程列（「下次输注」只存医生原话）；exam_events.finding_text 只存原文；cost_records 金额以文本存（读时算汇总）；全部派生值（缓解第 N 天/距上次输注/复发次数/费用合计）读时计算不落库。
