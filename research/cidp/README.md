# research/cidp · M4 临床库四件套（2026-11-12 00:14 实跑）

- 工具：unified-trial-mcp（MCP stdio，`~/Downloads/unified_search_trials`；绝不自己拼 URL）
- 快照日：2026-11-12（manifest.snapshotDate）
- 检索词 4：英文标准名 / 中文标准名 / CIDP 缩写宽检索 / demyelinating polyneuropathy IVIG 扩展
- **190 条**（ictrp 179 + chinadrugtrials 11，同登记号合并）
- 通道终态（如实，SKIP 不算查过）：SUCCESS 4 · NO_RESULTS 10 · **FAILED 5（chictr_online 各查询均 FAILED）** · NEEDS_SETUP 4（离线语料仅胰腺癌覆盖）· TIMEOUT 1（首查 ictrp 超时，后续查询 SUCCESS 补齐——不把超时算查过）
- 状态口径：登记 ≠ 有效 ≠ 安全 ≠ 可入组；一律「登记状态，未核实」

## 文件

| 文件 | 内容 | 一致性 |
| --- | --- | --- |
| manifest.json | 采集口径 + 每文件 sha256 + 诚实声明 | recordCount 190 = dbCount 190 |
| trials-2026.jsonl | 190 行，字段与 MCP records 映射 | sha256 对上 |
| cidp_trials_2026.sqlite | trials 表 190 行 + source_statuses 通道终态表 | sha256 对上 |

## 一期决定（写进 DEV-PLAN §四 追认）

快照量级充足（190 条），但一期（原型 v0.1 + 开发版 0.1.0）**不建匹配链路**：35 号四段链路的匹配字段建模未在一期完成，硬凑会造出假符合度。临床页与设置·临床数据库 tab 同口径声明：「快照已建（190 条，research/cidp/），一期未提供匹配功能；登记状态一律未核实」。这不是「检索不到」的裁剪——是「不假装有匹配功能」的如实声明，为后续迭代留底。
