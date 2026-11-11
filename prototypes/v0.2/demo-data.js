/* 演示数据（唯一源）· 两组合成档案 · CIDP（慢性炎性脱髓鞘性多发性神经根神经病）
 * A：刚确诊、记录少、多处未知；B：多年随访、复发多次、输注与化验都多。
 * 全部为合成示例，不冒充真实病历；页面不写死数字，一切从这里读。
 * 本文件只放数据，不放逻辑；TODAY 由 app.js 固定。
 */
window.DEMO_DATA = {
  TODAY: '2026-11-11',
  /* 指标元数据（唯一源）：app.js 与服务端 metric_defs 都从这里读；阈值一律不在此出现 */
  metricDefs: [
    { key: 'IGG', db: 'igg', title: '免疫球蛋白 IgG（谷浓度）', category: 'immun', unit: 'g/L', color: '#2f6f8f', ord: 0 },
    { key: 'HB', db: 'hb', title: '血红蛋白（HB）', category: 'hemogram', unit: 'g/L', color: '#c96f2f', ord: 1 },
    { key: 'WBC', db: 'wbc', title: '白细胞（WBC）', category: 'hemogram', unit: '×10⁹/L', color: '#2e7d5b', ord: 2 },
    { key: 'PLT', db: 'plt', title: '血小板（PLT）', category: 'hemogram', unit: '×10⁹/L', color: '#5a7d2a', ord: 3 },
    { key: 'FPG', db: 'fpg', title: '空腹血糖', category: 'safety', unit: 'mmol/L', color: '#a3405e', ord: 4 },
    { key: 'TC', db: 'tc', title: '总胆固醇', category: 'safety', unit: 'mmol/L', color: '#b98a1f', ord: 5 },
    { key: 'CR', db: 'cr', title: '肌酐', category: 'safety', unit: 'µmol/L', color: '#3a7ca5', ord: 6 },
    { key: 'GRIP', db: 'grip', title: '握力（右手）', category: 'vitals', unit: 'kg', color: '#6b5b95', ord: 7 },
    { key: '体重', db: 'weight', title: '体重', category: 'vitals', unit: 'kg', color: '#8a5a44', ord: 8 }
  ],
  metricGroups: [
    { key: 'immun', title: '免疫球蛋白', items: ['IGG'] },
    { key: 'hemogram', title: '血象', items: ['HB', 'WBC', 'PLT'] },
    { key: 'safety', title: '安全监测（激素相关，医生安排）', items: ['FPG', 'TC', 'CR'] },
    { key: 'vitals', title: '体征与功能', items: ['GRIP', '体重'] }
  ],
  /* 临床数据库 tab 与裁剪声明同口径：状态由 M4 实测后回填 */
  snapshotMeta: { count: 0, date: null },
  profiles: [
    {
      id: 'demo-a',
      name: '示例档案 A',
      tag: '刚确诊 · 记录少 · 多处未知',
      isDemo: true,
      profile: {
        确诊经过: '2026-09 起双手、双脚麻木无力逐渐加重，神经内科查神经传导后医生说考虑 CIDP（原文照录）',
        进一步检查: '腰穿已做（结果未记，标注「未知」）；抗体检测未做，医生说「先治疗看看」（原话照录）',
        并发症筛查: '医生说用激素期间要查血糖（具体频次待复诊确认）',
        就诊医院: '示例市第一医院神经内科',
        医生行动计划原话: '手脚麻木加重或走不稳的时候，当天联系我；不要自己调整剂量。（李医生 2026-10-20 门诊原话照录）'
      },
      flares: [
        { id: 'a-f1', start: '2026-09-05', end: null, trigger: '未知', note: '麻木从脚开始，慢慢向上；医生说这就是这次的主要问题（事实描述）', private: false },
        { id: 'a-f2', start: '2026-10-30', end: '2026-11-05', trigger: '（私密示例）熬夜加班后', note: '短暂加重，两天好转，未就医仅自己记', private: true }
      ],
      labs: [
        { id: 'a-l1', metric: 'IGG', date: '2026-10-21', value: 18.2, unit: 'g/L', method: '免疫比浊', org: '示例市第一医院', private: false },
        { id: 'a-l2', metric: 'HB', date: '2026-10-21', value: 138, unit: 'g/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l3', metric: 'WBC', date: '2026-10-21', value: 7.4, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市第一医院', private: false },
        { id: 'a-l4', metric: 'FPG', date: '2026-10-21', value: 5.8, unit: 'mmol/L', method: '己糖激酶法', org: '示例市第一医院', private: false },
        { id: 'a-l5', metric: 'GRIP', date: '2026-11-08', value: 21, unit: 'kg', method: '自测（血压计法，方法待统一）', org: '自录', private: false },
        { id: 'a-l6', metric: '体重', date: '2026-11-08', value: 68.0, unit: 'kg', method: '自录', org: '自录', private: false },
        { id: 'a-l7', metric: 'HB', date: '（私密示例）十月外院', value: '（数值未记）', unit: 'g/L', method: '自述外院', org: '外院（未核对）', private: true }
      ],
      infusions: [
        { id: 'a-t1', date: '2026-10-20', kind: '免疫球蛋白输注', name: 'IVIG 首轮（剂量与天数见出院小结，原文照录）', note: '输注中轻微头痛，护士减慢滴速后好转（事实描述）', private: false },
        { id: 'a-t2', date: '2026-11-03', kind: '复诊', name: '神经内科复诊：医生说「下轮输注时间下次门诊定」（原话照录）', note: '', private: false }
      ],
      exams: [
        { id: 'a-x1', date: '2026-09-18', kind: '神经传导', org: '示例市第一医院 肌电图室', finding: '运动传导速度减慢（原文照录，具体数值见报告）', private: false }
      ],
      costs: [
        { id: 'a-c1', date: '2026-10-20', item: '免疫球蛋白输注', total: '（票据未整理）', reimbursed: '', outOfPocket: '', private: false }
      ],
      meds: [
        { id: 'a-m1', name: '（无长期用药记录）', schedule: '医生说先观察，暂不开药（原话照录）', since: '2026-10-20', note: '合成示例' }
      ],
      questions: [
        { id: 'a-q1', addedOn: '2026-11-10', q: '下一轮输注大概什么时候？需要提前查什么吗？', answered: false, private: false },
        { id: 'a-q2', addedOn: '2026-11-09', q: '（私密示例）脚麻影响开车，要不要跟单位说？', answered: false, private: true }
      ],
      hospitals: [
        { id: 'a-h1', name: '示例市第一医院', dept: '神经内科', contact: '电话见挂号单（未录入）', ver: 1 }
      ],
      reports: [
        { id: 'a-r1', title: '肌电图报告（2026-09-18）', date: '2026-09-18', kind: '检查', source: '原件已登记', keydesc: '医生批注「符合周围神经受累」（照录）', private: false },
        { id: 'a-r2', title: '腰穿报告', date: '（日期未知）', kind: '检查', source: '未取得原件', keydesc: '', private: false },
        { id: 'a-r3', title: '（私密示例）外院肌电图单（2026-11-02）', date: '2026-11-02', kind: '检查', source: '未核对', keydesc: '', private: true }
      ],
      docs: [
        { id: 'a-d1', name: '2026-10-20 门诊病历', date: '2026-10-20', type: '病历', state: '已登记' },
        { id: 'a-d2', name: '（日期未知示例）外院化验单', date: null, type: '化验', state: '待核对' }
      ],
      mind: {
        feel: [
          { d: '2026-11-06', text: '最怕的是不知道这次麻木会不会再加重，只能等复诊。', author: '本人', private: false },
          { d: '2026-11-09', text: '（私密记录示例）晚上脚麻得睡不着的时候心里发慌。', author: '本人', private: true }
        ],
        family: [
          { d: '2026-11-07', text: '爱人把复诊要问的问题写在了冰箱贴纸上。', author: '家属', private: false }
        ]
      }
    },
    {
      id: 'demo-b',
      name: '示例档案 B',
      tag: '多年随访 · 复发多次 · 记录多',
      isDemo: true,
      profile: {
        确诊经过: '2023-04 起双下肢无力伴麻木，2023-05 神经传导+腰穿后诊断 CIDP（原文照录）',
        进一步检查: '腰穿蛋白升高（医生报告原文）；抗体检测阴性；神经传导每年复查（次数见检查记录）',
        并发症筛查: '2024-01 起激素期间按医生安排定期查血糖、血脂（见化验记录）',
        就诊医院: '示例市中心医院神经内科；2025 起跨院随诊',
        医生行动计划原话: '麻木无力加重、走路变差或反复摔倒，当天联系我或到神经内科急诊；激素不要自己停。（陈医生 2026-06-12 门诊原话照录）'
      },
      flares: [
        { id: 'b-f1', start: '2023-04-10', end: '2023-07-15', trigger: '（起病）', note: '首次发病住院（时间按出院小结整理）', private: false },
        { id: 'b-f2', start: '2024-03-02', end: '2024-04-20', trigger: '未知', note: '复发，激素加量后好转（原话照录）', private: false },
        { id: 'b-f3', start: '2024-11-15', end: '2025-01-05', trigger: '劳累后', note: '二次复发，加做一轮 IVIG（见输注登记）', private: false },
        { id: 'b-f4', start: '2025-08-22', end: '2025-09-12', trigger: '（私密示例）出差劳累', note: '短暂加重未就医，仅自己记', private: true },
        { id: 'b-f5', start: '2025-12-08', end: '2026-01-18', trigger: '未知', note: '复发，输注+激素调整后缓解', private: false },
        { id: 'b-f6', start: '2026-10-28', end: null, trigger: '降温', note: '最近一次，双手麻加重，进行中', private: false }
      ],
      labs: [
        { id: 'b-l01', metric: 'IGG', date: '2023-05-20', value: 7.1, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l02', metric: 'HB', date: '2023-05-20', value: 141, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l03', metric: 'CR', date: '2023-05-20', value: 72, unit: 'µmol/L', method: '苦味酸法', org: '示例市中心医院', private: false },
        { id: 'b-l04', metric: 'IGG', date: '2023-08-15', value: 16.4, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l05', metric: 'FPG', date: '2023-08-15', value: 6.2, unit: 'mmol/L', method: '己糖激酶法', org: '示例市中心医院', private: false },
        { id: 'b-l06', metric: 'HB', date: '2023-08-15', value: 136, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l07', metric: 'IGG', date: '2024-02-10', value: 19.8, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l08', metric: 'TC', date: '2024-02-10', value: 6.1, unit: 'mmol/L', method: '酶法', org: '示例市中心医院', private: false },
        { id: 'b-l09', metric: 'GRIP', date: '2024-04-22', value: 18, unit: 'kg', method: '自测（血压计法）', org: '自录', private: false },
        { id: 'b-l10', metric: 'IGG', date: '2024-11-20', value: 21.2, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l11', metric: 'FPG', date: '2024-11-20', value: 6.8, unit: 'mmol/L', method: '己糖激酶法', org: '示例市中心医院', private: false },
        { id: 'b-l12', metric: 'WBC', date: '2024-11-20', value: 9.6, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l13', metric: 'IGG', date: '2025-02-14', value: 17.5, unit: 'g/L', method: '免疫比浊', org: '示例市第二医院', private: false },
        { id: 'b-l14', metric: 'HB', date: '2025-02-14', value: 129, unit: 'g/L', method: '血常规 五分类', org: '示例市第二医院', private: false },
        { id: 'b-l15', metric: 'PLT', date: '2025-02-14', value: 198, unit: '×10⁹/L', method: '血常规 五分类', org: '示例市第二医院', private: false },
        { id: 'b-l16', metric: 'IGG', date: '2025-09-05', value: 20.4, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l17', metric: 'CR', date: '2025-09-05', value: 78, unit: 'µmol/L', method: '酶法', org: '示例市中心医院', private: false },
        { id: 'b-l18', metric: 'GRIP', date: '2026-01-20', value: 24, unit: 'kg', method: '自测（血压计法）', org: '自录', private: false },
        { id: 'b-l19', metric: 'IGG', date: '2026-02-15', value: 18.9, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l20', metric: 'FPG', date: '2026-02-15', value: 5.9, unit: 'mmol/L', method: '己糖激酶法', org: '示例市中心医院', private: false },
        { id: 'b-l21', metric: 'TC', date: '2026-02-15', value: 5.4, unit: 'mmol/L', method: '酶法', org: '示例市中心医院', private: false },
        { id: 'b-l22', metric: 'HB', date: '2026-11-01', value: 133, unit: 'g/L', method: '血常规 五分类', org: '示例市中心医院', private: false },
        { id: 'b-l23', metric: 'IGG', date: '2026-11-01', value: 19.6, unit: 'g/L', method: '免疫比浊', org: '示例市中心医院', private: false },
        { id: 'b-l24', metric: '体重', date: '2026-11-01', value: 62.5, unit: 'kg', method: '自录', org: '自录', private: false },
        { id: 'b-l25', metric: 'IGG', date: '2026-10-05', value: '（数值未记，私密示例）', unit: 'g/L', method: '自述外院', org: '外院（未核对）', private: true }
      ],
      infusions: [
        { id: 'b-t01', date: '2023-05-22', kind: '免疫球蛋白输注', name: 'IVIG 首轮 5 天（出院小结原文照录）', note: '输注第 2 天轻微头痛，减慢滴速后好转', private: false },
        { id: 'b-t02', date: '2023-06-20', kind: '免疫球蛋白输注', name: 'IVIG 维持第 1 轮（剂量照处方）', note: '', private: false },
        { id: 'b-t03', date: '2023-07-18', kind: '免疫球蛋白输注', name: 'IVIG 维持第 2 轮', note: '', private: false },
        { id: 'b-t04', date: '2024-03-08', kind: '免疫球蛋白输注', name: '复发后加做一轮 IVIG（医生门诊原话照录）', note: '本次输注反应轻', private: false },
        { id: 'b-t05', date: '2024-11-18', kind: '免疫球蛋白输注', name: '复发后 IVIG（原文照录）', note: '', private: false },
        { id: 'b-t06', date: '2025-12-10', kind: '免疫球蛋白输注', name: '复发后 IVIG（原文照录）', note: '输注中腰背酸胀，暂停 20 分钟后继续', private: false },
        { id: 'b-t07', date: '2026-02-13', kind: '免疫球蛋白输注', name: '维持输注', note: '', private: false },
        { id: 'b-t08', date: '2026-06-12', kind: '复诊', name: '年度复诊：医生调整激素方案（原话见用药档案）', note: '', private: false },
        { id: 'b-t09', date: '2026-10-30', kind: '复诊', name: '复发随诊：医生说「本轮先观察，输注下次定」（原话照录）', note: '', private: false }
      ],
      exams: [
        { id: 'b-x1', date: '2023-05-12', kind: '神经传导', org: '示例市中心医院 肌电图室', finding: '上下肢运动+感觉传导均减慢（原文照录）', private: false },
        { id: 'b-x2', date: '2024-05-16', kind: '神经传导', org: '示例市中心医院 肌电图室', finding: '较前好转（医生报告原文）', private: false },
        { id: 'b-x3', date: '2025-05-20', kind: '神经传导', org: '示例市第二医院 肌电图室', finding: '正中神经运动传导速度改善（数值见报告，跨院可比组不同）', private: false },
        { id: 'b-x4', date: '2026-05-15', kind: '神经传导', org: '示例市中心医院 肌电图室', finding: '大体同前（原文照录）', private: false },
        { id: 'b-x5', date: '2023-05-15', kind: '腰穿', org: '示例市中心医院', finding: '蛋白升高（医生报告原文）', private: false }
      ],
      costs: [
        { id: 'b-c01', date: '2023-05-22', item: '免疫球蛋白输注', total: 28500, reimbursed: 14250, outOfPocket: 14250, private: false },
        { id: 'b-c02', date: '2023-06-20', item: '免疫球蛋白输注', total: 11200, reimbursed: 5600, outOfPocket: 5600, private: false },
        { id: 'b-c03', date: '2024-03-08', item: '免疫球蛋白输注', total: 10800, reimbursed: 5400, outOfPocket: 5400, private: false },
        { id: 'b-c04', date: '2024-11-18', item: '免疫球蛋白输注', total: 10800, reimbursed: 5400, outOfPocket: 5400, private: false },
        { id: 'b-c05', date: '2025-12-10', item: '免疫球蛋白输注', total: 11600, reimbursed: 5800, outOfPocket: 5800, private: false },
        { id: 'b-c06', date: '2026-02-13', item: '免疫球蛋白输注', total: 10200, reimbursed: 5100, outOfPocket: 5100, private: false },
        { id: 'b-c07', date: '2026-05-15', item: '检查', total: 620, reimbursed: 310, outOfPocket: 310, private: false },
        { id: 'b-c08', date: '（日期未知示例，私密）', item: '其他', total: '（未记）', reimbursed: '', outOfPocket: '', private: true }
      ],
      meds: [
        { id: 'b-m1', name: '泼尼松（医生方案原话照录）', schedule: '「目前每天 2 片，每 2 周减半片，减到每天 1 片维持；具体以我下次门诊说的为准。」（陈医生 2026-06-12 原话）', since: '2024-01-15', note: '本台不提供剂量建议；激素调整只录医生原话' }
      ],
      questions: [
        { id: 'b-q1', addedOn: '2026-11-05', q: '这次双手麻加重，要不要提前输注？', answered: false, private: false },
        { id: 'b-q2', addedOn: '2026-10-20', q: '激素减到维持量后，血糖还用多查一次吗？', answered: false, private: false },
        { id: 'b-q3', addedOn: '2026-09-30', q: '（私密示例）最近体重掉得快，跟激素有关吗？', answered: false, private: true }
      ],
      hospitals: [
        { id: 'b-h1', name: '示例市中心医院', dept: '神经内科（肌电图室）', contact: '电话见出院小结', ver: 2 },
        { id: 'b-h2', name: '示例市第二医院', dept: '神经内科门诊', contact: '出处引用：2025-02-14 化验单抬头', ver: 1 }
      ],
      reports: [
        { id: 'b-r1', title: '出院小结（2023-07-15）', date: '2023-07-15', kind: '病历', source: '原件已登记', keydesc: '「出院诊断：CIDP」（医生报告原文）', private: false },
        { id: 'b-r2', title: '肌电图报告（2026-05-15）', date: '2026-05-15', kind: '检查', source: '原件已登记', keydesc: '', private: false },
        { id: 'b-r3', title: '年度复诊化验单（2026-02-15）', date: '2026-02-15', kind: '化验', source: '原件已登记', keydesc: '', private: false },
        { id: 'b-r4', title: '外院肌电图报告（2025-05-20）', date: '2025-05-20', kind: '检查', source: '未取得原件', keydesc: '跨院可比组不同，只陈列不合并', private: false },
        { id: 'b-r5', title: '（私密示例）外院化验单（2026-10-05）', date: '2026-10-05', kind: '化验', source: '未核对', keydesc: '', private: true }
      ],
      docs: [
        { id: 'b-d1', name: '2023-07-15 出院小结', date: '2023-07-15', type: '病历', state: '已登记' },
        { id: 'b-d2', name: '2026-05-15 肌电图报告', date: '2026-05-15', type: '检查', state: '已登记' },
        { id: 'b-d3', name: '（日期未知示例）旧腰穿报告', date: null, type: '检查', state: '待核对' }
      ],
      mind: {
        feel: [
          { d: '2026-11-01', text: '三年了，复发来的时候还是会心里一沉，但至少知道该做什么了。', author: '本人', private: false },
          { d: '2026-11-08', text: '（私密记录示例）这次手麻比上次轻，但还是怕影响工作打字。', author: '本人', private: true }
        ],
        family: [
          { d: '2026-11-03', text: '女儿把每次输注的日子帮我在台历上圈出来了。', author: '家属', private: false }
        ]
      }
    }
  ]
}
