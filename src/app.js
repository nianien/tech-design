// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function navigate(page) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-' + page).classList.add('active');
  var btn = document.querySelector('.nav-btn[data-page="' + page + '"]');
  if (btn) btn.classList.add('active');
  if (page === 'knowledge') showFileList();
  if (page === 'knowledge' && graphInitialized && document.getElementById('dtab-graph').classList.contains('active')) {
    setTimeout(function() { resizeCanvas(); draw(); }, 100);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mock Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Agents
var AGENTS = [
  { name: '需求分析阶段', desc: '需求识别与分析', flows: [
    { name: '需求识别智能体', time: '编辑于 20 分钟' },
    { name: '模板匹配智能体', time: '编辑于 34 分钟' },
    { name: '基座智能体', time: '编辑于 24 分钟' },
    { name: '需求分类流程', time: '编辑于 2 小时' },
  ]},
  { name: '方案设计阶段', desc: '方案生成与评估', flows: [
    { name: '方案生成智能体', time: '编辑于 1 小时' },
    { name: '约束检查流程', time: '编辑于 3 小时' },
    { name: '多目标优化', time: '编辑于 5 小时' },
  ]},
  { name: '工艺规划阶段', desc: '工艺路线规划', flows: [
    { name: '工序排列智能体', time: '编辑于 2 小时' },
    { name: '刀具选型流程', time: '编辑于 4 小时' },
    { name: '加工参数推理', time: '编辑于 1 天' },
    { name: '工时估算流程', time: '编辑于 1 天' },
    { name: '质量控制流程', time: '编辑于 2 天' },
  ]},
  { name: '生产制造阶段', desc: '生产调度与监控', flows: [
    { name: '生产排程智能体', time: '编辑于 3 小时' },
    { name: '设备匹配流程', time: '编辑于 6 小时' },
  ]},
  { name: '船舶总体设计', desc: '总体方案与舱室布置', flows: [
    { name: '概念方案生成智能体', time: '编辑于 2 小时' },
    { name: '舱室布置评估流程', time: '编辑于 6 小时' },
    { name: '重量重心核算', time: '编辑于 1 天' },
  ]},
  { name: '船舶结构改型', desc: '结构参数生成与规则校核', flows: [
    { name: '规则参数生成', time: '编辑于 3 小时' },
    { name: '孔参数生成', time: '编辑于 5 小时' },
    { name: '特殊参数生成', time: '编辑于 1 天' },
    { name: '参数方案预览', time: '编辑于 2 天' },
  ]},
  { name: '海工平台结构设计', desc: '强度校核与疲劳评估', flows: [
    { name: '载荷组合生成', time: '编辑于 4 小时' },
    { name: '结构强度校核', time: '编辑于 1 天' },
    { name: '疲劳寿命评估', time: '编辑于 2 天' },
  ]},
  { name: '舰船设备布置', desc: '设备接口与干涉检查', flows: [
    { name: '设备接口对齐', time: '编辑于 6 小时' },
    { name: '干涉检查流程', time: '编辑于 1 天' },
    { name: '检修可达性评估', time: '编辑于 2 天' },
  ]},
  { name: '推进系统优化', desc: '推力匹配与能效分析', flows: [
    { name: '推进匹配计算', time: '编辑于 5 小时' },
    { name: '能效优化建议', time: '编辑于 1 天' },
  ]},
  { name: '液压站智能升级', desc: '泵站监测与故障诊断', flows: [
    { name: '振动诊断智能体', time: '编辑于 2 小时' },
    { name: '泵组健康评估流程', time: '编辑于 6 小时' },
    { name: '能耗优化建议', time: '编辑于 1 天' },
  ]},
  { name: '数控机床工艺优化', desc: '工艺参数推荐与质量闭环', flows: [
    { name: '切削参数推荐', time: '编辑于 3 小时' },
    { name: '刀具寿命预测', time: '编辑于 8 小时' },
    { name: '工序质量追溯', time: '编辑于 2 天' },
  ]},
  { name: '焊接工艺知识工程', desc: '焊接规则库与工艺卡生成', flows: [
    { name: '焊缝参数推理', time: '编辑于 4 小时' },
    { name: '缺陷风险预警', time: '编辑于 1 天' },
  ]},
  { name: '装配线节拍优化', desc: '产线平衡与调度策略', flows: [
    { name: '节拍分析流程', time: '编辑于 5 小时' },
    { name: '瓶颈工位识别', time: '编辑于 1 天' },
    { name: '排程策略生成', time: '编辑于 2 天' },
  ]},
  { name: '质量检测自动化', desc: '无损检测与尺寸检测', flows: [
    { name: '缺陷识别智能体', time: '编辑于 7 小时' },
    { name: '测量结果归档', time: '编辑于 1 天' },
  ]},
  { name: '设备预测性维护', desc: '状态监测与寿命预测', flows: [
    { name: '故障模式识别', time: '编辑于 6 小时' },
    { name: '剩余寿命预测', time: '编辑于 2 天' },
  ]},
  { name: '工业知识图谱应用', desc: '跨系统知识融合与检索', flows: [
    { name: '知识抽取流程', time: '编辑于 3 小时' },
    { name: '图谱构建与校验', time: '编辑于 1 天' },
    { name: '语义检索服务', time: '编辑于 2 天' },
  ]},
  { name: '能源管理与碳排核算', desc: '能耗监控与碳排分析', flows: [
    { name: '能耗数据清洗', time: '编辑于 4 小时' },
    { name: '碳排核算流程', time: '编辑于 1 天' },
  ]},
  { name: '初始项目', desc: '基础模板项目', flows: [
    { name: 'Vector Store RAG (1)', time: '编辑于 59 分钟' },
    { name: '新建流程 (3)', time: '编辑于 24 分钟' },
    { name: '基座智能体', time: '编辑于 24 分钟' },
    { name: '需求识别智能体', time: '编辑于 34 分钟' },
    { name: '新建流程 (4)', time: '编辑于 7 小时' },
    { name: '新建流程 (2)', time: '编辑于 4 天' },
    { name: 'lf-uznngx', time: '编辑于 4 天' },
    { name: 'test_flow (7)', time: '编辑于 5 天' },
    { name: '新建流程 (1)', time: '编辑于 5 天' },
  ]},
];

// Tools
var TOOLS = [
  { name: '图纸解析服务', url: 'http://118.196.47.120:8000/sse', type: 'SSE' },
  { name: '知识图谱构建', url: 'http://118.196.47.120:8001/sse', type: 'SSE' },
  { name: 'CAD格式转换', url: 'http://118.196.47.120:8008/mcp', type: 'SSE' },
  { name: '工艺参数推理', url: 'http://118.196.47.120:8009/mcp', type: 'SSE' },
  { name: '材料数据库查询', url: 'http://118.196.47.120:8000/sse', type: 'SSE' },
  { name: 'CAE仿真求解', url: 'http://118.196.47.120:8010/mcp', type: 'SSE' },
  { name: '结构强度校核', url: 'http://118.196.47.120:8011/mcp', type: 'SSE' },
  { name: '装配干涉检查', url: 'http://118.196.47.120:8012/mcp', type: 'SSE' },
  { name: '公差分析（尺寸链）', url: 'http://118.196.47.120:8013/mcp', type: 'SSE' },
  { name: 'BOM清单生成', url: 'http://118.196.47.120:8014/mcp', type: 'SSE' },
  { name: '参数化建模助手', url: 'http://118.196.47.120:8015/mcp', type: 'SSE' },
  { name: '渲染预览服务', url: 'http://118.196.47.120:8016/sse', type: 'SSE' },
  { name: '版本发布助手', url: 'http://118.196.47.120:8017/mcp', type: 'SSE' },
  { name: 'RBAC权限管理', url: 'http://118.196.47.120:8018/mcp', type: 'SSE' },
  { name: '工程量估算', url: 'http://118.196.47.120:8019/mcp', type: 'SSE' },
];

// Models
var MODELS = [
  { name: 'Doubao-Seed-1.6', on: true },
  { name: 'Deepseek-V3', on: true },
  { name: 'Deepseek-V3.1', on: true },
  { name: 'Doubao-Seed-1.6-vision', on: true },
  { name: 'Seedream', on: false },
];
var EMBED_MODELS = [
  { name: 'Doubao-embedding', on: true },
];

// Files
var FILES = [
  { name: '液压阀体装配图.dwg', type: 'DWG', size: '2.4 MB', time: '2026-04-13 09:15', status: 'done', entities: 24, storage: ['structured','vector','graph'], domain: '机械制造' },
  { name: '齿轮箱总成.step', type: 'STEP', size: '15.8 MB', time: '2026-04-13 08:42', status: 'done', entities: 38, storage: ['structured','graph'], domain: '机械制造' },
  { name: '涡轮叶片工艺卡.pdf', type: 'PDF', size: '1.2 MB', time: '2026-04-12 16:30', status: 'done', entities: 56, storage: ['structured','vector'], domain: '航空航天' },
  { name: '车削工艺技术规范.docx', type: 'DOCX', size: '3.6 MB', time: '2026-04-12 15:00', status: 'done', entities: 41, storage: ['structured','vector'], domain: '机械制造' },
  { name: '主轴承座铸造图.dwg', type: 'DWG', size: '3.1 MB', time: '2026-04-12 14:20', status: 'done', entities: 31, storage: ['structured','graph'], domain: '机械制造' },
  { name: '电机端盖加工图.dxf', type: 'DXF', size: '890 KB', time: '2026-04-12 11:05', status: 'parsing', entities: '\u2014', storage: [], domain: '电气工程' },
  { name: '切削参数推荐表.xlsx', type: 'XLSX', size: '245 KB', time: '2026-04-12 09:30', status: 'done', entities: 128, storage: ['structured'], domain: '机械制造' },
  { name: '法兰盘焊接工艺.pdf', type: 'PDF', size: '2.8 MB', time: '2026-04-11 17:45', status: 'done', entities: 42, storage: ['structured','vector'], domain: '焊接工艺' },
  { name: '减速器壳体.step', type: 'STEP', size: '22.3 MB', time: '2026-04-11 15:30', status: 'pending', entities: '\u2014', storage: [], domain: '机械制造' },
  { name: '铸造缺陷检测标准.md', type: 'TXT', size: '56 KB', time: '2026-04-11 14:00', status: 'done', entities: 18, storage: ['vector'], domain: '质量检测' },
  { name: '曲轴锻造毛坯图.dwg', type: 'DWG', size: '4.5 MB', time: '2026-04-11 10:15', status: 'done', entities: 29, storage: ['structured','graph'], domain: '机械制造' },
  { name: '轴承装配示意图.png', type: 'PNG', size: '1.8 MB', time: '2026-04-11 08:45', status: 'done', entities: 12, storage: ['vector'], domain: '机械制造' },
  { name: '气缸体精加工图.iges', type: 'IGES', size: '8.7 MB', time: '2026-04-10 16:00', status: 'done', entities: 45, storage: ['structured','graph'], domain: '汽车制造' },
  { name: '数控编程脚本.py', type: 'CODE', size: '34 KB', time: '2026-04-10 14:30', status: 'done', entities: 8, storage: ['structured'], domain: '数控加工' },
  { name: '连杆总成装配图.dwg', type: 'DWG', size: '1.9 MB', time: '2026-04-10 09:30', status: 'done', entities: 33, storage: ['structured','vector','graph'], domain: '汽车制造' },
];

// Knowledge tree structure: 领域-主题-知识点
var KNOWLEDGE_TREE = [
  { name: '机械制造', icon: '\u2699\uFE0F', children: [
    { name: '车削工艺', points: ['切削参数','刀具选型','表面粗糙度','公差配合'] },
    { name: '铸造工艺', points: ['砂型铸造','压力铸造','铸造缺陷','收缩率'] },
    { name: '锻造工艺', points: ['自由锻造','模锻','毛坯设计','热处理'] },
    { name: '装配工艺', points: ['配合精度','装配顺序','密封设计','紧固件'] },
  ]},
  { name: '航空航天', icon: '\u2708\uFE0F', children: [
    { name: '叶片加工', points: ['五轴铣削','电火花加工','涂层工艺'] },
    { name: '复合材料', points: ['碳纤维成型','铺层设计','固化工艺'] },
  ]},
  { name: '汽车制造', icon: '\uD83D\uDE97', children: [
    { name: '发动机零件', points: ['气缸体加工','曲轴加工','连杆加工'] },
    { name: '冲压工艺', points: ['模具设计','板材成型','回弹补偿'] },
  ]},
  { name: '焊接工艺', icon: '\uD83D\uDD25', children: [
    { name: 'MIG焊', points: ['焊接参数','焊丝选型','气体保护'] },
    { name: 'TIG焊', points: ['钨极选择','电流模式','焊缝质量'] },
  ]},
  { name: '质量检测', icon: '\uD83D\uDD0D', children: [
    { name: '无损检测', points: ['超声检测','射线检测','磁粉检测'] },
    { name: '尺寸检测', points: ['三坐标测量','光学扫描','粗糙度测量'] },
  ]},
];

// Business
var FLOWS = [
  { name: 'Vector Store RAG (1)', time: '编辑于 59 分钟' },
  { name: '新建流程 (9) (1)', time: '编辑于 59 分钟' },
  { name: '新建流程 (9)', time: '编辑于 1 小时' },
  { name: 'Vector Store RAG', time: '编辑于 2 小时' },
];

// Resources
var RES_FOLDERS = [
  { name: '我的资源', children: [
    { name: '..', children: [
      { name: '北理工', children: [] }
    ]},
    { name: '液压系统设计', children: [] },
    { name: '齿轮箱项目', children: [] },
    { name: '涡轮叶片研发', children: [] },
    { name: '新建项目', children: [] },
    { name: '新建项目 (3)', children: [] },
    { name: '新建项目 (4)', children: [] },
    { name: '新建项目 (5)', children: [] },
    { name: '新建项目 (7)', children: [] },
    { name: 'test', children: [] },
    { name: 'test2', children: [] },
  ]}
];
var RES_FILES = [
  { name: '液压阀体设计说明书', type: 'DOCX', size: '14.41 KB', time: '2026/3/27 16:02:15' },
  { name: '齿轮箱装配工艺文档', type: 'DOCX', size: '16.37 KB', time: '2026/3/27 16:02:28' },
  { name: '涡轮叶片材料规范', type: 'DOCX', size: '16.76 KB', time: '2026/3/27 16:02:43' },
  { name: '推进系统轴承设计文档', type: 'DOCX', size: '14.16 KB', time: '2026/3/27 16:02:54' },
  { name: 'plate_50x30x10_4holes', type: 'CATPART', size: '64.68 KB', time: '2026/3/30 10:00:44' },
  { name: '铸造工艺参数表', type: 'XLSX', size: '23.5 KB', time: '2026/4/01 09:15:20' },
  { name: '阀芯加工程序', type: 'NC', size: '8.2 KB', time: '2026/4/02 14:30:00' },
  { name: '质检报告模板', type: 'PDF', size: '156 KB', time: '2026/4/05 11:20:33' },
];

// Knowledge Graph Data
var NODE_TYPES = {
  part:     { label: '零件/组件', color: '#06b6d4', bg: '#ecfeff', emoji: '\u2699\uFE0F' },
  material: { label: '材料',     color: '#3b82f6', bg: '#eff6ff', emoji: '\uD83E\uDDF1' },
  process:  { label: '工艺/加工', color: '#8b5cf6', bg: '#f5f3ff', emoji: '\uD83D\uDD27' },
  param:    { label: '尺寸参数', color: '#f59e0b', bg: '#fffbeb', emoji: '\uD83D\uDCD0' },
  standard: { label: '标准/规范', color: '#10b981', bg: '#ecfdf5', emoji: '\uD83D\uDCCB' },
  assembly: { label: '装配关系', color: '#f43f5e', bg: '#fff1f2', emoji: '\uD83D\uDD17' },
};
var GRAPH_DATA = {
  nodes: [
    { id:0,  name:'液压阀体',   type:'part',     attrs:{'图号':'HV-2024-001','重量':'4.2kg','材质':'HT250','工序':'铸造+精加工'}},
    { id:1,  name:'阀芯',       type:'part',     attrs:{'图号':'HV-2024-002','重量':'0.8kg','材质':'40Cr','表面处理':'镀铬'}},
    { id:2,  name:'阀盖',       type:'part',     attrs:{'图号':'HV-2024-003','重量':'1.5kg','材质':'QT450-10','密封':'O型圈'}},
    { id:3,  name:'弹簧座',     type:'part',     attrs:{'图号':'HV-2024-004','重量':'0.3kg','材质':'45钢','热处理':'调质'}},
    { id:4,  name:'密封圈',     type:'part',     attrs:{'图号':'HV-2024-005','规格':'\u03C632\u00D73.5','材质':'NBR','硬度':'70\u00B15'}},
    { id:5,  name:'HT250',      type:'material', attrs:{'类型':'灰铸铁','抗拉强度':'\u2265250MPa','硬度':'HB170-241','标准':'GB/T 9439'}},
    { id:6,  name:'40Cr',       type:'material', attrs:{'类型':'合金结构钢','抗拉强度':'\u2265980MPa','屈服强度':'\u2265785MPa','淬透性':'良好'}},
    { id:7,  name:'QT450-10',   type:'material', attrs:{'类型':'球墨铸铁','抗拉强度':'\u2265450MPa','延伸率':'\u226510%','标准':'GB/T 1348'}},
    { id:8,  name:'NBR橡胶',    type:'material', attrs:{'类型':'丁腈橡胶','耐温':'-40~120\u00B0C','耐油性':'优良','应用':'液压密封'}},
    { id:9,  name:'CNC精加工',  type:'process',  attrs:{'设备':'DMG MORI NTX','精度':'IT6','粗糙度':'Ra0.8','工时':'45min'}},
    { id:10, name:'铸造成形',   type:'process',  attrs:{'工艺':'砂型铸造','收缩率':'1.0%','浇注温度':'1380\u00B0C','冷却':'自然冷却'}},
    { id:11, name:'表面镀铬',   type:'process',  attrs:{'镀层厚度':'20-50\u03BCm','硬度':'HV800-1000','工艺':'硬铬电镀','耐磨性':'优'}},
    { id:12, name:'热处理调质', type:'process',  attrs:{'淬火温度':'840\u00B0C','回火温度':'520\u00B0C','硬度':'HRC28-32','介质':'油冷'}},
    { id:13, name:'\u03C632H7', type:'param',    attrs:{'公差':'+0.025/0','基准':'A','检测':'三坐标','配合':'间隙配合'}},
    { id:14, name:'Ra0.8',      type:'param',    attrs:{'参数':'表面粗糙度','检测方法':'轮廓仪','适用面':'密封面','等级':'精密'}},
    { id:15, name:'\u03C665\u00B10.02', type:'param', attrs:{'类型':'外径公差','测量':'千分尺','基准':'B','精度等级':'IT5'}},
    { id:16, name:'0.02 A',     type:'param',    attrs:{'类型':'同轴度','基准':'A轴','检测':'CMM','等级':'精密'}},
    { id:17, name:'GB/T 9439',  type:'standard', attrs:{'名称':'灰铸铁件','版本':'2010','范围':'铸铁材料','级别':'国标'}},
    { id:18, name:'ISO 4401',   type:'standard', attrs:{'名称':'液压阀安装面','版本':'2005','范围':'接口标准','级别':'国际'}},
    { id:19, name:'GB/T 3452.1',type:'standard', attrs:{'名称':'O型圈尺寸','版本':'2005','范围':'密封件','级别':'国标'}},
    { id:20, name:'阀体-阀芯装配', type:'assembly', attrs:{'配合':'H7/f6','间隙':'0.02-0.04mm','润滑':'液压油','方式':'滑动配合'}},
    { id:21, name:'阀体-阀盖装配', type:'assembly', attrs:{'连接':'M8螺栓\u00D74','扭矩':'25N\u00B7m','密封':'O型圈','方式':'法兰连接'}},
    { id:22, name:'回位弹簧',   type:'part',     attrs:{'图号':'HV-2024-006','材质':'60Si2Mn','刚度':'15N/mm','自由长度':'45mm'}},
    { id:23, name:'磨削加工',   type:'process',  attrs:{'设备':'外圆磨床','精度':'IT5','粗糙度':'Ra0.4','砂轮':'CBN'}},
  ],
  edges: [
    {source:0,target:5,label:'材质'},{source:1,target:6,label:'材质'},
    {source:2,target:7,label:'材质'},{source:4,target:8,label:'材质'},
    {source:0,target:9,label:'加工方式'},{source:0,target:10,label:'成形工艺'},
    {source:1,target:11,label:'表面处理'},{source:1,target:9,label:'加工方式'},
    {source:3,target:12,label:'热处理'},{source:0,target:13,label:'尺寸要求'},
    {source:0,target:14,label:'粗糙度'},{source:1,target:15,label:'外径'},
    {source:1,target:16,label:'形位公差'},{source:5,target:17,label:'执行标准'},
    {source:0,target:18,label:'接口标准'},{source:4,target:19,label:'尺寸标准'},
    {source:20,target:0,label:'包含'},{source:20,target:1,label:'包含'},
    {source:21,target:0,label:'包含'},{source:21,target:2,label:'包含'},
    {source:21,target:4,label:'密封件'},{source:0,target:3,label:'安装'},
    {source:3,target:22,label:'安装'},{source:1,target:23,label:'精加工'},
    {source:9,target:14,label:'达到'},{source:23,target:15,label:'保证'},
  ]
};

var DEFAULT_NODE_TYPES = JSON.parse(JSON.stringify(NODE_TYPES));
var DEFAULT_GRAPH_DATA = JSON.parse(JSON.stringify(GRAPH_DATA));

// Keep 3D model knowledge graph consistent with houtai.html (pump example)
var MODEL3D_NODE_TYPES = {
  part:     { label: '零件/组件', color: '#06b6d4', bg: '#ecfeff', emoji: '\u2699\uFE0F' },
  material: { label: '材料',     color: '#3b82f6', bg: '#eff6ff', emoji: '\uD83E\uDDF1' },
  param:    { label: '尺寸',     color: '#f59e0b', bg: '#fffbeb', emoji: '\uD83D\uDCD0' },
};
var MODEL3D_GRAPH_DATA = {
  nodes: [
    { id:0,  name:'多级离心泵', type:'part',     attrs:{'图号':'MP-2024-001','重量':'35kg','级数':'3级','转速':'2900rpm'}},
    { id:1,  name:'泵体',       type:'part',     attrs:{'图号':'MP-2024-002','重量':'18.5kg','材质':'HT250','工序':'铸造+精加工'}},
    { id:2,  name:'叶轮',       type:'part',     attrs:{'图号':'MP-2024-003','重量':'2.3kg','材质':'2Cr13','类型':'闭式叶轮'}},
    { id:3,  name:'导叶',       type:'part',     attrs:{'图号':'MP-2024-004','重量':'1.8kg','材质':'HT200','功能':'导流增压'}},
    { id:4,  name:'泵轴',       type:'part',     attrs:{'图号':'MP-2024-005','重量':'3.6kg','材质':'45钢','热处理':'调质'}},
    { id:5,  name:'机械密封',   type:'part',     attrs:{'图号':'MP-2024-006','型号':'104-25','材质':'SiC/碳化钨'}},
    { id:6,  name:'轴承',       type:'part',     attrs:{'图号':'MP-2024-007','型号':'6208-2RS','类型':'深沟球轴承','精度':'P6'}},
    { id:7,  name:'HT250',      type:'material', attrs:{'类型':'灰铸铁','抗拉强度':'\u2265250MPa','硬度':'HB170-241'}},
    { id:8,  name:'2Cr13',      type:'material', attrs:{'类型':'马氏体不锈钢','抗拉强度':'\u2265540MPa','耐蚀性':'良好'}},
    { id:9,  name:'45钢',       type:'material', attrs:{'类型':'优质碳素钢','抗拉强度':'\u2265600MPa','屈服强度':'\u2265355MPa'}},
    { id:10, name:'\u03C665h6', type:'param',    attrs:{'类型':'轴径公差','公差':'-0.013~-0.032','配合':'过渡配合'}},
    { id:11, name:'Ra0.8',      type:'param',    attrs:{'参数':'表面粗糙度','适用面':'密封面/轴承位','等级':'精密'}},
    { id:12, name:'Q=25m\u00B3/h', type:'param', attrs:{'类型':'额定流量','扬程':'80m','效率':'68%','功率':'15kW'}},
    { id:13, name:'DN65/DN50',  type:'param',    attrs:{'类型':'进出口口径','进口':'DN65','出口':'DN50'}},
  ],
  edges: [
    {source:0,target:1,label:'包含'},{source:0,target:2,label:'包含'},
    {source:0,target:3,label:'包含'},{source:0,target:4,label:'包含'},
    {source:0,target:5,label:'包含'},{source:0,target:6,label:'包含'},
    {source:1,target:7,label:'材质'},{source:3,target:7,label:'材质'},
    {source:2,target:8,label:'材质'},{source:4,target:9,label:'材质'},
    {source:4,target:10,label:'轴径'},{source:4,target:11,label:'粗糙度'},
    {source:0,target:12,label:'性能参数'},{source:0,target:13,label:'接口尺寸'},
  ]
};

function applyKnowledgeGraphForFile(f) {
  var t = String((f && f.type) || '').toUpperCase();
  var is3d = (t === 'STEP' || t === 'IGES' || t === 'STL');
  if (is3d) {
    NODE_TYPES = JSON.parse(JSON.stringify(MODEL3D_NODE_TYPES));
    GRAPH_DATA = JSON.parse(JSON.stringify(MODEL3D_GRAPH_DATA));
  } else {
    NODE_TYPES = JSON.parse(JSON.stringify(DEFAULT_NODE_TYPES));
    GRAPH_DATA = JSON.parse(JSON.stringify(DEFAULT_GRAPH_DATA));
  }

  // Update legend block to match current NODE_TYPES (and keep 3D consistent with houtai.html)
  var legend = document.getElementById('graphLegend');
  if (legend) {
    var title = legend.querySelector('.legend-title');
    while (legend.firstChild) legend.removeChild(legend.firstChild);
    if (title) legend.appendChild(title);
    Object.keys(NODE_TYPES).forEach(function(k) {
      var ti = NODE_TYPES[k];
      var item = document.createElement('div');
      item.className = 'legend-item';
      var dot = document.createElement('div');
      dot.className = 'legend-dot';
      dot.style.background = ti.color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(ti.label));
      legend.appendChild(item);
    });
  }

  // Reset graph runtime state so the next init uses the new dataset
  graphInitialized = false;
  simulationRunning = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  animFrame = null;
  graphNodes = [];
  selectedNode = null;
  hoveredNode = null;
  dragNode = null;
  graphScale = 1;
  graphOffsetX = 0;
  graphOffsetY = 0;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Agents
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderAgents() {
  // Sidebar
  var sideList = document.getElementById('agentSidebarList');
  if (sideList) {
    while (sideList.firstChild) sideList.removeChild(sideList.firstChild);
    AGENTS.forEach(function(a, idx) {
      var item = document.createElement('div');
      item.className = 'center-sidebar-item' + (idx === 0 ? ' active' : '');
      var icon = document.createElement('span');
      icon.className = 'cs-icon';
      icon.textContent = '\uD83D\uDCC1';
      var name = document.createElement('span');
      name.textContent = a.name;
      name.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
      item.appendChild(icon);
      item.appendChild(name);
      item.addEventListener('click', function() {
        sideList.querySelectorAll('.center-sidebar-item').forEach(function(el) { el.classList.remove('active'); });
        item.classList.add('active');
        showAgentDetail(idx);
      });
      sideList.appendChild(item);
    });
  }

  // Grid
  var grid = document.getElementById('agentGrid');

  AGENTS.forEach(function(a, idx) {
    var card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', function() { showAgentDetail(idx); });
    var icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.style.background = 'var(--blue-light)';
    icon.textContent = '\uD83D\uDCC1';
    var title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = a.name;
    var desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = a.desc;
    var actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.textContent = '\u22EF';
    actions.addEventListener('click', function(e) { e.stopPropagation(); });
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

function showAgentList() {
  document.getElementById('agentList').style.display = 'block';
  document.getElementById('agentDetail').style.display = 'none';
}

function showAgentDetail(idx) {
  var agent = AGENTS[idx];
  document.getElementById('agentList').style.display = 'none';
  document.getElementById('agentDetail').style.display = 'block';
  document.getElementById('agentDetailName').textContent = agent.name;

  var grid = document.getElementById('agentFlowsGrid');
  while (grid.firstChild) grid.removeChild(grid.firstChild);

  if (!agent.flows || agent.flows.length === 0) {
    var empty = document.createElement('div');
    empty.className = 'empty-hint';
    empty.style.gridColumn = '1 / -1';
    var p = document.createElement('p');
    p.textContent = '\u6682\u65E0\u6D41\u7A0B\uFF0C\u70B9\u51FB\u201C+ \u65B0\u5EFA\u6D41\u7A0B\u201D\u5F00\u59CB\u521B\u5EFA';
    empty.appendChild(p);
    grid.appendChild(empty);
    return;
  }

  agent.flows.forEach(function(f) {
    var card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.alignItems = 'flex-start';
    card.style.gap = '12px';
    card.style.padding = '18px 20px';
    card.addEventListener('click', (function(flowName, aIdx) {
      return function() { showFlowEditor(aIdx, flowName); };
    })(f.name, idx));

    var icon = document.createElement('div');
    icon.style.cssText = 'width:36px;height:36px;border-radius:8px;background:#d1fae5;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>';

    var info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0;';
    var name = document.createElement('div');
    name.style.cssText = 'font-size:0.92rem;font-weight:600;color:var(--text-dark);margin-bottom:3px;';
    name.textContent = f.name;
    var time = document.createElement('div');
    time.style.cssText = 'font-size:0.78rem;color:var(--text-muted);';
    time.textContent = f.time;
    info.appendChild(name);
    info.appendChild(time);

    var actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.style.cssText = 'position:static;opacity:1;color:var(--text-muted);cursor:pointer;';
    actions.textContent = '\u22EF';

    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Tools
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Tool Center Editor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var TOOL_BUILTIN = [
  { name: '\u6A21\u578B\u6570\u636E\u96C6', icon: '\uD83D\uDCCA', color: 'var(--green)' },
  { name: '\u81EA\u9002\u5E94\u91C7\u6837', icon: '\uD83C\uDFAF', color: 'var(--cyan)' },
  { name: '\u4EE3\u7406\u6A21\u578B', icon: '\uD83E\uDDE0', color: 'var(--blue)' },
  { name: '\u8FED\u4EE3\u4F18\u5316', icon: '\u267B\uFE0F', color: 'var(--violet)' },
];
var TOOL_CUSTOM = [
  { name: '\u8BBE\u5907\u635F\u8017\u5206\u6790\u670D\u52A11' },
  { name: '\u8BBE\u5907\u635F\u8017\u5206\u6790\u670D\u52A12', active: true },
  { name: '\u8BBE\u5907\u635F\u8017\u5206\u6790\u670D\u52A13' },
  { name: '\u8BBE\u5907\u635F\u8017\u5206\u6790\u670D\u52A14' },
];
var TOOL_ALGO_CATS = [
  { id: 'classify', name: '\u5206\u7C7B', icon: '\u2587\u2587' },
  { id: 'regression', name: '\u56DE\u5F52', icon: '\uD83D\uDCC8' },
  { id: 'cluster', name: '\u805A\u7C7B', icon: '\u2B24' },
  { id: 'dim', name: '\u964D\u7EF4', icon: '\uD83D\uDD0D' },
  { id: 'recommend', name: '\u63A8\u8350', icon: '\u2B50' },
  { id: 'similar', name: '\u76F8\u4F3C', icon: '\uD83D\uDD17' },
  { id: 'eval', name: '\u8BC4\u4F30', icon: '\uD83D\uDCCB' },
  { id: 'other', name: '\u5176\u4ED6', icon: '\u2699' },
];
var TOOL_ALGOS = {
  classify: [
    { name: '\u903B\u8F91\u5206\u7C7B', icon: '\u2587\u2587' },
    { name: 'Softmax\u591A\u5206\u7C7B', icon: '\u2587\u2587' },
  ],
  regression: [{ name: '\u7EBF\u6027\u56DE\u5F52', icon: '\uD83D\uDCC8' }, { name: '\u591A\u9879\u5F0F\u56DE\u5F52', icon: '\uD83D\uDCC8' }],
  cluster: [{ name: 'K-Means', icon: '\u2B24' }, { name: 'DBSCAN', icon: '\u2B24' }],
  dim: [{ name: 'PCA', icon: '\uD83D\uDD0D' }],
  recommend: [{ name: '\u534F\u540C\u8FC7\u6EE4', icon: '\u2B50' }],
  similar: [{ name: '\u4F59\u5F26\u76F8\u4F3C\u5EA6', icon: '\uD83D\uDD17' }],
  eval: [{ name: '\u6DF7\u6DC6\u77E9\u9635', icon: '\uD83D\uDCCB' }],
  other: [{ name: '\u81EA\u5B9A\u4E49\u7B97\u6CD5', icon: '\u2699' }],
};
var toolAlgoActive = 'classify';

var TOOL_FLOW_NODES = [
  { id: 'tn1', title: '\u903B\u8F91\u5206\u7C7B', x: 160, y: 200 },
  { id: 'tn2', title: '\u903B\u8F91\u5206\u7C7B', x: 480, y: 200 },
  { id: 'tn3', title: '\u903B\u8F91\u5206\u7C7B', x: 800, y: 200 },
];
var TOOL_FLOW_EDGES = [
  { source: 'tn1', target: 'tn2' },
  { source: 'tn2', target: 'tn3' },
];
var toolFlowZoomLevel = 1, toolFlowPanX = 0, toolFlowPanY = 0;
var toolFlowDragNode = null, toolFlowDragStartX = 0, toolFlowDragStartY = 0, toolFlowNodeStartX = 0, toolFlowNodeStartY = 0;
var toolFlowPanning = false, toolFlowPanStartX = 0, toolFlowPanStartY = 0, toolFlowPanStartOX = 0, toolFlowPanStartOY = 0;

function renderTools() {
  renderToolSidebar();
  renderToolAlgoPanel();
  renderToolFlowNodes();
}

function renderToolSidebar() {
  var builtinList = document.getElementById('toolBuiltinList');
  var customList = document.getElementById('toolCustomList');
  if (!builtinList || !customList) return;
  while (builtinList.firstChild) builtinList.removeChild(builtinList.firstChild);
  while (customList.firstChild) customList.removeChild(customList.firstChild);

  TOOL_BUILTIN.forEach(function(t) {
    var item = document.createElement('div');
    item.className = 'flow-sb-item';
    var icon = document.createElement('span');
    icon.className = 'flow-sb-icon';
    icon.textContent = t.icon;
    var name = document.createElement('span');
    name.textContent = t.name;
    item.appendChild(icon);
    item.appendChild(name);
    builtinList.appendChild(item);
  });

  TOOL_CUSTOM.forEach(function(t) {
    var item = document.createElement('div');
    item.className = 'flow-sb-item' + (t.active ? ' active' : '');
    if (t.active) item.style.cssText = 'background:var(--blue-light);color:var(--blue)';
    var icon = document.createElement('span');
    icon.className = 'flow-sb-icon';
    icon.textContent = '\u2699\uFE0F';
    var name = document.createElement('span');
    name.textContent = t.name;
    var dots = document.createElement('span');
    dots.className = 'flow-sb-dots';
    dots.textContent = '\u22EF';
    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(dots);
    item.addEventListener('click', function() {
      TOOL_CUSTOM.forEach(function(c) { c.active = false; });
      t.active = true;
      document.getElementById('toolEditorName').textContent = t.name;
      renderToolSidebar();
    });
    customList.appendChild(item);
  });
}

function renderToolAlgoPanel() {
  var tabsEl = document.getElementById('toolAlgoTabs');
  var listEl = document.getElementById('toolAlgoList');
  if (!tabsEl || !listEl) return;
  while (tabsEl.firstChild) tabsEl.removeChild(tabsEl.firstChild);
  while (listEl.firstChild) listEl.removeChild(listEl.firstChild);

  TOOL_ALGO_CATS.forEach(function(cat) {
    var btn = document.createElement('button');
    btn.className = 'tool-algo-tab' + (toolAlgoActive === cat.id ? ' active' : '');
    var iconSpan = document.createElement('span');
    iconSpan.className = 'tool-algo-tab-icon';
    iconSpan.textContent = cat.icon;
    var nameSpan = document.createElement('span');
    nameSpan.textContent = cat.name;
    btn.appendChild(iconSpan);
    btn.appendChild(nameSpan);
    btn.addEventListener('click', function() {
      toolAlgoActive = cat.id;
      renderToolAlgoPanel();
    });
    tabsEl.appendChild(btn);
  });

  var algos = TOOL_ALGOS[toolAlgoActive] || [];
  algos.forEach(function(a) {
    var item = document.createElement('div');
    item.className = 'tool-algo-item';
    var icon = document.createElement('span');
    icon.className = 'tool-algo-item-icon';
    icon.textContent = a.icon;
    var name = document.createElement('span');
    name.className = 'tool-algo-item-name';
    name.textContent = a.name;
    item.appendChild(icon);
    item.appendChild(name);
    listEl.appendChild(item);
  });
}

function renderToolFlowNodes() {
  var container = document.getElementById('toolFlowNodesContainer');
  var svgEl = document.getElementById('toolFlowLines');
  if (!container || !svgEl) return;
  while (container.firstChild) container.removeChild(container.firstChild);

  TOOL_FLOW_NODES.forEach(function(n) {
    var node = document.createElement('div');
    node.className = 'flow-node';
    node.style.cssText = 'left:' + n.x + 'px;top:' + n.y + 'px;width:200px;border-color:var(--amber)';
    node.setAttribute('data-id', n.id);

    var header = document.createElement('div');
    header.className = 'flow-node-header';
    header.style.borderColor = 'var(--amber)';
    var iconEl = document.createElement('div');
    iconEl.className = 'flow-node-icon';
    iconEl.style.cssText = 'background:var(--amber-light);color:var(--amber)';
    iconEl.textContent = '\u2587\u2587';
    var titleEl = document.createElement('div');
    titleEl.className = 'flow-node-title';
    titleEl.textContent = n.title;
    header.appendChild(iconEl);
    header.appendChild(titleEl);

    // Ports
    var portIn = document.createElement('div');
    portIn.className = 'flow-port flow-port-in';
    portIn.style.cssText = 'position:absolute;left:-5px;top:50%;width:10px;height:10px;border-radius:50%;background:var(--amber);border:2px solid var(--bg-white);transform:translateY(-50%);z-index:5';
    var portOut = document.createElement('div');
    portOut.className = 'flow-port flow-port-out';
    portOut.style.cssText = 'position:absolute;right:-5px;top:50%;width:10px;height:10px;border-radius:50%;background:var(--amber);border:2px solid var(--bg-white);transform:translateY(-50%);z-index:5';

    node.appendChild(header);
    node.appendChild(portIn);
    node.appendChild(portOut);

    // Click to show config
    node.addEventListener('click', function(e) {
      e.stopPropagation();
      showToolNodeConfig(n);
    });

    // Drag
    node.addEventListener('mousedown', function(e) {
      if (e.target.closest('.tool-node-config')) return;
      e.stopPropagation();
      toolFlowDragNode = n;
      toolFlowDragStartX = e.clientX;
      toolFlowDragStartY = e.clientY;
      toolFlowNodeStartX = n.x;
      toolFlowNodeStartY = n.y;
      node.classList.add('dragging');
    });

    container.appendChild(node);
  });

  drawToolFlowEdges();
  applyToolFlowTransform();

  // Canvas pan
  var canvas = document.getElementById('toolFlowCanvas');
  if (canvas && !canvas._toolPanInit) {
    canvas._toolPanInit = true;
    canvas.addEventListener('mousedown', function(e) {
      if (e.target !== canvas && !e.target.classList.contains('flow-lines')) return;
      toolFlowPanning = true;
      toolFlowPanStartX = e.clientX; toolFlowPanStartY = e.clientY;
      toolFlowPanStartOX = toolFlowPanX; toolFlowPanStartOY = toolFlowPanY;
      hideToolNodeConfig();
    });
    document.addEventListener('mousemove', function(e) {
      if (toolFlowDragNode) {
        var dx = (e.clientX - toolFlowDragStartX) / toolFlowZoomLevel;
        var dy = (e.clientY - toolFlowDragStartY) / toolFlowZoomLevel;
        toolFlowDragNode.x = toolFlowNodeStartX + dx;
        toolFlowDragNode.y = toolFlowNodeStartY + dy;
        var el = container.querySelector('[data-id="' + toolFlowDragNode.id + '"]');
        if (el) { el.style.left = toolFlowDragNode.x + 'px'; el.style.top = toolFlowDragNode.y + 'px'; }
        drawToolFlowEdges();
      }
      if (toolFlowPanning) {
        toolFlowPanX = toolFlowPanStartOX + (e.clientX - toolFlowPanStartX);
        toolFlowPanY = toolFlowPanStartOY + (e.clientY - toolFlowPanStartY);
        applyToolFlowTransform();
      }
    });
    document.addEventListener('mouseup', function() {
      if (toolFlowDragNode) {
        var el = container.querySelector('[data-id="' + toolFlowDragNode.id + '"]');
        if (el) el.classList.remove('dragging');
        toolFlowDragNode = null;
      }
      toolFlowPanning = false;
    });
  }
}

function drawToolFlowEdges() {
  var svg = document.getElementById('toolFlowLines');
  var container = document.getElementById('toolFlowNodesContainer');
  if (!svg || !container) return;
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  TOOL_FLOW_EDGES.forEach(function(e) {
    var srcNode = TOOL_FLOW_NODES.find(function(n) { return n.id === e.source; });
    var tgtNode = TOOL_FLOW_NODES.find(function(n) { return n.id === e.target; });
    if (!srcNode || !tgtNode) return;
    var x1 = srcNode.x + 200, y1 = srcNode.y + 30;
    var x2 = tgtNode.x, y2 = tgtNode.y + 30;
    var cx = (x1 + x2) / 2;
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + cx + ',' + y1 + ' ' + cx + ',' + y2 + ' ' + x2 + ',' + y2);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#d29922');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
  });
}

function applyToolFlowTransform() {
  var container = document.getElementById('toolFlowNodesContainer');
  var svg = document.getElementById('toolFlowLines');
  var t = 'translate(' + toolFlowPanX + 'px,' + toolFlowPanY + 'px) scale(' + toolFlowZoomLevel + ')';
  if (container) container.style.transform = t;
  if (svg) svg.style.transform = t;
}

function toolFlowZoom(dir) {
  toolFlowZoomLevel = Math.max(0.3, Math.min(2, toolFlowZoomLevel + dir * 0.1));
  document.getElementById('toolZoomLabel').textContent = Math.round(toolFlowZoomLevel * 100) + '%';
  applyToolFlowTransform();
}

function showToolNodeConfig(node) {
  var cfg = document.getElementById('toolNodeConfig');
  if (!cfg) return;
  cfg.style.display = 'block';
  cfg.style.left = (node.x + 10) + 'px';
  cfg.style.top = (node.y + 70) + 'px';
  while (cfg.firstChild) cfg.removeChild(cfg.firstChild);

  var title = document.createElement('div');
  title.className = 'tool-node-config-title';
  title.textContent = '\u8282\u70B9\u914D\u7F6E';
  cfg.appendChild(title);

  var body = document.createElement('div');
  body.className = 'tool-node-config-body';
  var fields = [
    { label: '\u91C7\u6837\u7B97\u6CD5', type: 'select', options: ['OLHS', 'LHS', 'Random', 'Sobol'], extra: { type: 'select', options: ['x1', 'x2', 'x3'] } },
    { label: '\u53D8\u91CF\u6570', type: 'input', value: '2' },
    { label: '\u533A\u95F4', type: 'input', value: '[680,1100]' },
    { label: '\u7CBE\u5EA6', type: 'select', options: ['0.00', '0.01', '0.001', '0.0001'] },
  ];
  fields.forEach(function(f) {
    var row = document.createElement('div');
    row.className = 'tool-node-config-row';
    var lbl = document.createElement('label');
    lbl.textContent = f.label;
    row.appendChild(lbl);
    if (f.type === 'select') {
      var sel = document.createElement('select');
      f.options.forEach(function(o) {
        var opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        sel.appendChild(opt);
      });
      row.appendChild(sel);
      if (f.extra) {
        var sel2 = document.createElement('select');
        sel2.style.maxWidth = '80px';
        f.extra.options.forEach(function(o) {
          var opt = document.createElement('option');
          opt.value = o; opt.textContent = o;
          sel2.appendChild(opt);
        });
        row.appendChild(sel2);
      }
    } else {
      var inp = document.createElement('input');
      inp.value = f.value || '';
      row.appendChild(inp);
    }
    body.appendChild(row);
  });
  cfg.appendChild(body);

  var footer = document.createElement('div');
  footer.className = 'tool-node-config-footer';
  var saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary';
  saveBtn.textContent = '\u4FDD\u5B58';
  saveBtn.addEventListener('click', function() { hideToolNodeConfig(); });
  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn';
  cancelBtn.textContent = '\u53D6\u6D88';
  cancelBtn.addEventListener('click', function() { hideToolNodeConfig(); });
  footer.appendChild(saveBtn);
  footer.appendChild(cancelBtn);
  cfg.appendChild(footer);
}

function hideToolNodeConfig() {
  var cfg = document.getElementById('toolNodeConfig');
  if (cfg) cfg.style.display = 'none';
}

document.addEventListener('click', function(e){
  var btn = e.target && e.target.closest ? e.target.closest('.k-nav-btn') : null;
  if(!btn) return;
  document.querySelectorAll('.k-nav-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  if (btn.dataset && btn.dataset.kpage === 'qa') {
    showQaPage();
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Models
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderModels() {
  var container = document.getElementById('modelsContainer');
  function makeSection(title, models) {
    var sec = document.createElement('div');
    sec.className = 'model-section';
    var h = document.createElement('h3');
    h.textContent = title;
    sec.appendChild(h);
    models.forEach(function(m) {
      var item = document.createElement('div');
      item.className = 'model-item';
      var info = document.createElement('div');
      info.className = 'model-info';
      var icon = document.createElement('div');
      icon.className = 'model-icon';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
      var name = document.createElement('div');
      name.className = 'model-name';
      name.textContent = m.name;
      info.appendChild(icon);
      info.appendChild(name);
      var toggle = document.createElement('button');
      toggle.className = 'toggle' + (m.on ? ' on' : '');
      toggle.addEventListener('click', function() { this.classList.toggle('on'); });
      item.appendChild(info);
      item.appendChild(toggle);
      sec.appendChild(item);
    });
    container.appendChild(sec);
  }
  makeSection('\u8BED\u8A00\u6A21\u578B', MODELS);
  makeSection('\u5D4C\u5165\u6A21\u578B', EMBED_MODELS);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Files (Knowledge Center)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var KB_ACTIVE_CAT = 'all';
var KB_CATS = [
  { id: 'drawing2d', name: '二维图纸', ext: 'DWG/DXF', emoji: '📌', bg: '#dbeafe', fg: '#1d4ed8', types: ['DWG','DXF'] },
  { id: 'model3d', name: '三维模型', ext: 'STEP/IGES/STL/GLB', emoji: '📦', bg: '#d1fae5', fg: '#047857', types: ['STEP','IGES','STL','GLB'] },
  { id: 'doc', name: '工艺文档', ext: 'PDF/DOCX/TXT', emoji: '📄', bg: '#fee2e2', fg: '#b91c1c', types: ['PDF','DOCX','TXT','MD'] },
  { id: 'data', name: '数据表格', ext: 'Excel/CSV', emoji: '📊', bg: '#ecfeff', fg: '#0e7490', types: ['XLSX','CSV'] },
  { id: 'img', name: '工业图片', ext: 'PNG/JPG', emoji: '🖼️', bg: '#fce7f3', fg: '#be185d', types: ['PNG','JPG','JPEG'] },
  { id: 'code', name: '数控代码', ext: 'Python/NC', emoji: '💻', bg: '#1e293b', fg: '#22d3ee', types: ['CODE','PY','NC'] },
];

function kbCatCount(catId) {
  if (catId === 'all') return FILES.length;
  var cat = KB_CATS.find(function(c) { return c.id === catId; });
  if (!cat) return 0;
  return FILES.filter(function(f) { return cat.types.indexOf(String(f.type || '').toUpperCase()) >= 0; }).length;
}

function renderKbTypeList() {
  var host = document.getElementById('kbTypeBar');
  if (!host) return;
  while (host.firstChild) host.removeChild(host.firstChild);
  var mkChip = function(text, id, dotBg) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kb-chip' + (KB_ACTIVE_CAT === id ? ' active' : '');
    btn.innerHTML =
      '<span class="kb-chip-dot" style="background:' + (dotBg || 'currentColor') + '"></span>' +
      '<span>' + text + '</span>' +
      '<span class="kb-chip-count">' + kbCatCount(id) + '</span>';
    btn.addEventListener('click', function() {
      KB_ACTIVE_CAT = id;
      renderKbTypeList();
      renderFiles();
    });
    return btn;
  };
  host.appendChild(mkChip('全部', 'all', '#94a3b8'));

  KB_CATS.forEach(function(c) {
    host.appendChild(mkChip(c.name, c.id, c.fg));
  });
}

function filePassCat(f) {
  if (KB_ACTIVE_CAT === 'all') return true;
  var cat = KB_CATS.find(function(c) { return c.id === KB_ACTIVE_CAT; });
  if (!cat) return true;
  return cat.types.indexOf(String(f.type || '').toUpperCase()) >= 0;
}

function renderFiles() {
  var tbody = document.getElementById('fileTableBody');
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  var qEl = document.getElementById('fileSearch');
  var q = qEl ? String(qEl.value || '').toLowerCase().trim() : '';
  FILES.forEach(function(f, idx) {
    if (!filePassCat(f)) return;
    if (q && String(f.name || '').toLowerCase().indexOf(q) < 0) return;
    var tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', function() { if (f.status === 'done') showFileDetail(idx); });

    var tdCheck = document.createElement('td');
    tdCheck.innerHTML = '<input type="checkbox" onclick="event.stopPropagation()">';

    var tdName = document.createElement('td');
    tdName.style.display = 'flex';
    tdName.style.alignItems = 'center';
    tdName.style.gap = '10px';
    var icon = document.createElement('div');
    icon.className = 'file-icon ' + f.type.toLowerCase();
    icon.textContent = f.type;
    var nameSpan = document.createElement('span');
    nameSpan.style.fontWeight = '500';
    nameSpan.style.color = 'var(--text-dark)';
    nameSpan.textContent = f.name;
    tdName.appendChild(icon);
    tdName.appendChild(nameSpan);

    var tdType = document.createElement('td');
    tdType.textContent = f.type;
    tdType.style.fontFamily = 'var(--font-mono)';
    tdType.style.fontSize = '0.8rem';

    var tdSize = document.createElement('td');
    tdSize.textContent = f.size;

    var tdStatus = document.createElement('td');
    var badge = document.createElement('span');
    if (f.status === 'done') {
      badge.className = 'badge badge-green';
      badge.innerHTML = '<span class="badge-dot"></span>\u5DF2\u89E3\u6790';
    } else if (f.status === 'parsing') {
      badge.className = 'badge badge-amber';
      badge.innerHTML = '<span class="badge-dot"></span>\u89E3\u6790\u4E2D';
    } else {
      badge.className = 'badge badge-gray';
      badge.innerHTML = '<span class="badge-dot"></span>\u5F85\u89E3\u6790';
    }
    tdStatus.appendChild(badge);

    var tdEntities = document.createElement('td');
    tdEntities.textContent = f.entities;
    tdEntities.style.fontFamily = 'var(--font-mono)';

    var tdActions = document.createElement('td');
    var viewBtn = document.createElement('button');
    viewBtn.className = 'btn';
    viewBtn.textContent = '\u67E5\u770B';
    viewBtn.style.padding = '4px 12px';
    viewBtn.style.fontSize = '0.78rem';
    if (f.status !== 'done') { viewBtn.disabled = true; viewBtn.style.opacity = '0.4'; }
    viewBtn.addEventListener('click', function(e) { e.stopPropagation(); if (f.status === 'done') showFileDetail(idx); });
    tdActions.appendChild(viewBtn);

    // Storage tags
    var tdStorage = document.createElement('td');
    var storageDiv = document.createElement('div');
    storageDiv.className = 'storage-tags';
    var storageLabels = { structured: '\u7ED3\u6784\u5316', vector: '\u5411\u91CF\u5316', graph: '\u56FE\u8C31' };
    var storageCls = { structured: 's-structured', vector: 's-vector', graph: 's-graph' };
    if (f.storage) {
      f.storage.forEach(function(s) {
        var tag = document.createElement('span');
        tag.className = 'storage-tag ' + storageCls[s];
        tag.textContent = storageLabels[s];
        storageDiv.appendChild(tag);
      });
    }
    tdStorage.appendChild(storageDiv);

    // Domain
    var tdDomain = document.createElement('td');
    tdDomain.textContent = f.domain || '\u2014';
    tdDomain.style.fontSize = '0.82rem';
    tdDomain.style.color = 'var(--text-secondary)';

    tr.appendChild(tdCheck);
    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdSize);
    tr.appendChild(tdStorage);
    tr.appendChild(tdDomain);
    tr.appendChild(tdStatus);
    tr.appendChild(tdEntities);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });
}

function renderKnowledgeTree() {
  var body = document.getElementById('knowledgeTreeBody');
  while (body.firstChild) body.removeChild(body.firstChild);

  KNOWLEDGE_TREE.forEach(function(domain, di) {
    var domDiv = document.createElement('div');
    domDiv.className = 'k-domain';

    var btn = document.createElement('button');
    btn.className = 'k-domain-btn';
    var emoji = document.createElement('span');
    emoji.textContent = domain.icon;
    var nameSpan = document.createElement('span');
    nameSpan.textContent = domain.name;
    var arrow = document.createElement('span');
    arrow.className = 'k-arrow';
    arrow.textContent = '\u25B6';
    btn.appendChild(emoji);
    btn.appendChild(nameSpan);
    btn.appendChild(arrow);

    var topicsList = document.createElement('div');
    topicsList.className = 'k-topics';

    domain.children.forEach(function(topic) {
      var topicEl = document.createElement('div');
      topicEl.className = 'k-topic';
      var dot = document.createElement('span');
      dot.className = 'k-topic-dot';
      var tName = document.createElement('span');
      tName.textContent = topic.name;
      topicEl.appendChild(dot);
      topicEl.appendChild(tName);

      var pointsList = document.createElement('div');
      pointsList.className = 'k-points';

      if (topic.points) {
        topic.points.forEach(function(pt) {
          var ptEl = document.createElement('div');
          ptEl.className = 'k-point';
          ptEl.textContent = pt;
          pointsList.appendChild(ptEl);
        });
      }

      topicEl.addEventListener('click', function() {
        var wasActive = topicEl.classList.contains('active');
        topicsList.querySelectorAll('.k-topic').forEach(function(t) { t.classList.remove('active'); });
        topicsList.querySelectorAll('.k-points').forEach(function(p) { p.classList.remove('open'); });
        if (!wasActive) {
          topicEl.classList.add('active');
          pointsList.classList.add('open');
        }
      });

      topicsList.appendChild(topicEl);
      topicsList.appendChild(pointsList);
    });

    btn.addEventListener('click', function() {
      var wasOpen = btn.classList.contains('open');
      body.querySelectorAll('.k-domain-btn').forEach(function(b) { b.classList.remove('open'); });
      body.querySelectorAll('.k-topics').forEach(function(t) { t.classList.remove('open'); });
      if (!wasOpen) {
        btn.classList.add('open');
        topicsList.classList.add('open');
      }
    });

    domDiv.appendChild(btn);
    domDiv.appendChild(topicsList);
    body.appendChild(domDiv);
  });
}

function filterFiles() { renderFiles(); }

var KC_QA_CHAT = [];
var KC_QA_PREVIEW = null; // 'drawing2d' | 'model3d' | null

function showQaPage() {
  var list = document.getElementById('knowledgeList');
  var detail = document.getElementById('knowledgeDetail');
  var qaPage = document.getElementById('page-qa');
  if (list) list.style.display = 'none';
  if (detail) detail.style.display = 'none';
  if (qaPage) qaPage.style.display = 'block';
  if (KC_QA_CHAT.length === 0) kcQaNewChat();
  renderKcQa();
}

function hideQaPage() {
  var qaPage = document.getElementById('page-qa');
  if (qaPage) qaPage.style.display = 'none';
  var list = document.getElementById('knowledgeList');
  if (list) list.style.display = 'block';
}

function openKcQaModal() { showQaPage(); }
function closeKcQaModal() { hideQaPage(); }

function kcQaNewChat() {
  KC_QA_CHAT = [
    { role: 'assistant', text: '你好！我是工业知识问答助手，可以基于知识库为您提供可追溯的工程问答。\n\n您可以尝试以下问题：\n• 查看液压阀体的二维图纸\n• 展示多级泵的三维模型\n• 泵体的材质参数是什么？' },
  ];
  KC_QA_PREVIEW = null;
  qaClosePreview();
  renderKcQa();
}

function renderKcQa() {
  var body = document.getElementById('kcQaBody');
  var hist = document.getElementById('kcQaHistory');
  var hist2 = document.getElementById('kcQaHistory2');
  if (!body) return;

  while (body.firstChild) body.removeChild(body.firstChild);
  KC_QA_CHAT.forEach(function(m) {
    var wrap = document.createElement('div');
    wrap.className = 'qa-msg' + (m.role === 'user' ? ' user' : '');

    if (m.role === 'user') {
      var bubble = document.createElement('div');
      bubble.className = 'qa-bubble';
      bubble.textContent = m.text;
      var avatar = document.createElement('div');
      avatar.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#3b82f6;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.78rem;flex-shrink:0';
      avatar.textContent = 'U';
      wrap.appendChild(bubble);
      wrap.appendChild(avatar);
    } else {
      var aiAvatar = document.createElement('div');
      aiAvatar.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#f1f5f9;color:#64748b;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:600;flex-shrink:0;border:1px solid #2d333b';
      aiAvatar.textContent = 'AI';
      var bubble2 = document.createElement('div');
      bubble2.className = 'qa-bubble';

      if (m.thinking) {
        var thinkDiv = document.createElement('div');
        thinkDiv.style.cssText = 'margin-bottom:10px;padding:8px 12px;background:#fef3c7;border-radius:8px;font-size:0.78rem;color:#92400e';
        thinkDiv.textContent = m.thinking;
        bubble2.appendChild(thinkDiv);
      }

      var textNode = document.createTextNode(m.text);
      bubble2.appendChild(textNode);

      if (m.actions && m.actions.length) {
        var actDiv = document.createElement('div');
        actDiv.style.cssText = 'margin-top:12px;display:flex;gap:8px;flex-wrap:wrap';
        m.actions.forEach(function(a) {
          var btn = document.createElement('button');
          btn.className = 'btn btn-primary';
          btn.style.cssText = 'padding:6px 14px;font-size:0.78rem;border-radius:8px';
          btn.textContent = a.label;
          btn.addEventListener('click', function() {
            qaShowPreview(a.action);
          });
          actDiv.appendChild(btn);
        });
        bubble2.appendChild(actDiv);
      }

      if (m.thumbs) {
        var thumbDiv = document.createElement('div');
        thumbDiv.style.cssText = 'margin-top:10px;display:flex;gap:10px;font-size:1rem;opacity:0.5';
        thumbDiv.textContent = '\uD83D\uDC4D  \uD83D\uDCA1';
        bubble2.appendChild(thumbDiv);
      }

      wrap.appendChild(aiAvatar);
      wrap.appendChild(bubble2);
    }

    body.appendChild(wrap);
  });
  body.scrollTop = body.scrollHeight;

  // History sidebar
  if (hist) {
    while (hist.firstChild) hist.removeChild(hist.firstChild);
    var todayTopics = [
      { t: '\u6DB2\u538B\u9600\u4F53\u6750\u6599\u67E5\u8BE2', active: true },
      { t: '\u9F7F\u8F6E\u7BB1\u88C5\u914D\u5DE5\u827A' },
      { t: '\u6DA1\u8F6E\u53F6\u7247\u52A0\u5DE5\u53C2\u6570' },
    ];
    todayTopics.forEach(function(x) {
      var it = document.createElement('div');
      it.className = 'qa-hitem' + (x.active ? ' active' : '');
      var b = document.createElement('b');
      b.textContent = x.t;
      it.appendChild(b);
      it.addEventListener('click', function() {
        KC_QA_CHAT.push({ role: 'user', text: x.t });
        KC_QA_CHAT.push({ role: 'assistant', text: '\u6536\u5230\u3002\u6211\u5C06\u57FA\u4E8E\u77E5\u8BC6\u5E93\u8FDB\u884C\u68C0\u7D22\u5E76\u7ED9\u51FA\u53EF\u8FFD\u6EAF\u7684\u56DE\u7B54\u3002', thumbs: true });
        renderKcQa();
      });
      hist.appendChild(it);
    });
  }

  if (hist2) {
    while (hist2.firstChild) hist2.removeChild(hist2.firstChild);
    var weekTopics = [
      { t: '\u8F6C\u5316\u533B\u5B66\u697C\u623F\u95F4\u7EDF\u8BA1' },
      { t: '\u94F8\u9020\u7F3A\u9677\u68C0\u6D4B\u6807\u51C6' },
      { t: '\u5207\u524A\u53C2\u6570\u63A8\u8350' },
    ];
    weekTopics.forEach(function(x) {
      var it = document.createElement('div');
      it.className = 'qa-hitem';
      var b = document.createElement('b');
      b.textContent = x.t;
      it.appendChild(b);
      it.addEventListener('click', function() {
        KC_QA_CHAT.push({ role: 'user', text: x.t });
        KC_QA_CHAT.push({ role: 'assistant', text: '\u6536\u5230\u3002\u6211\u5C06\u57FA\u4E8E\u77E5\u8BC6\u5E93\u8FDB\u884C\u68C0\u7D22\u5E76\u7ED9\u51FA\u53EF\u8FFD\u6EAF\u7684\u56DE\u7B54\u3002', thumbs: true });
        renderKcQa();
      });
      hist2.appendChild(it);
    });
  }
}

// mode: 'file_2d' | 'file_3d' | 'graph_2d' | 'graph_3d'
function qaShowPreview(mode) {
  KC_QA_PREVIEW = mode;
  var layout = document.querySelector('.qa-page-layout');
  var panel = document.getElementById('qaPreviewPanel');
  var body = document.getElementById('qaPreviewBody');
  var title = document.getElementById('qaPreviewTitle');
  if (!panel || !body || !layout) return;

  layout.classList.add('with-preview');
  panel.style.display = 'flex';
  while (body.firstChild) body.removeChild(body.firstChild);

  if (mode === 'file_2d') {
    title.textContent = '\u4E8C\u7EF4\u56FE\u7EB8\u9884\u89C8';
    var img = document.createElement('img');
    img.src = 'resources/\u4E8C\u7EF4\u56FE\u7EB8.png';
    img.alt = '\u4E8C\u7EF4\u56FE\u7EB8';
    img.style.cssText = 'width:100%;height:auto;border-radius:8px;border:1px solid #2d333b';
    body.appendChild(img);
  } else if (mode === 'file_3d') {
    title.textContent = '\u4E09\u7EF4\u6A21\u578B\u9884\u89C8';
    var container3d = document.createElement('div');
    container3d.style.cssText = 'width:100%;height:100%;min-height:500px;background:#0d1117;border-radius:8px;overflow:hidden;border:1px solid #2d333b';
    body.appendChild(container3d);
    setTimeout(function() {
      var w = container3d.clientWidth;
      var h = container3d.clientHeight;
      if (typeof THREE === 'undefined') return;
      var scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0d1117);
      var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      container3d.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      var controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      var loader = new THREE.STLLoader();
      loader.load('resources/pump.STL', function(geometry) {
        var material = new THREE.MeshPhongMaterial({ color: 0x6e8898, specular: 0x58a6ff, shininess: 60 });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        var box = new THREE.Box3().setFromObject(mesh);
        var center = box.getCenter(new THREE.Vector3());
        var size = box.getSize(new THREE.Vector3());
        var maxDim = Math.max(size.x, size.y, size.z);
        camera.position.set(center.x + maxDim, center.y + maxDim * 0.6, center.z + maxDim);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();
      });
      (function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      })();
    }, 50);
  } else if (mode === 'graph_2d' || mode === 'graph_3d') {
    title.textContent = '\u77E5\u8BC6\u56FE\u8C31';
    var is3d = mode === 'graph_3d';
    var gd = is3d ? MODEL3D_GRAPH_DATA : DEFAULT_GRAPH_DATA;
    var nt = is3d ? MODEL3D_NODE_TYPES : DEFAULT_NODE_TYPES;

    // legend
    var legendDiv = document.createElement('div');
    legendDiv.style.cssText = 'display:flex;gap:14px;font-size:0.75rem;margin-bottom:12px;flex-wrap:wrap';
    var usedTypes = {};
    gd.nodes.forEach(function(n) { usedTypes[n.type] = true; });
    Object.keys(nt).forEach(function(k) {
      if (!usedTypes[k]) return;
      var item = document.createElement('span');
      item.style.cssText = 'display:flex;align-items:center;gap:4px;color:#64748b';
      var dot = document.createElement('span');
      dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + nt[k].color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(nt[k].label));
      legendDiv.appendChild(item);
    });
    body.appendChild(legendDiv);

    var cvs = document.createElement('canvas');
    cvs.style.cssText = 'width:100%;height:calc(100% - 40px);min-height:450px;border-radius:8px;background:#161b22;border:1px solid #2d333b;cursor:grab';
    body.appendChild(cvs);

    setTimeout(function() { initMiniGraph(cvs, gd, nt); }, 80);
  }
}

function initMiniGraph(cvs, gd, nt) {
  var rect = cvs.getBoundingClientRect();
  var dpr = window.devicePixelRatio || 1;
  var mW = rect.width, mH = rect.height;
  cvs.width = mW * dpr; cvs.height = mH * dpr;
  var mCtx = cvs.getContext('2d');
  mCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  var mScale = 1, mOffX = 0, mOffY = 0;
  var mSelected = null, mHovered = null, mDrag = null;
  var mIsDragging = false, mIsPanning = false, mLastX = 0, mLastY = 0;
  var mRunning = true;

  var mNodes = gd.nodes.map(function(n, i) {
    var a = (i / gd.nodes.length) * Math.PI * 2;
    var r = 120 + Math.random() * 60;
    return {
      id: n.id, name: n.name, type: n.type, attrs: n.attrs,
      x: mW/2 + Math.cos(a)*r + (Math.random()-0.5)*40,
      y: mH/2 + Math.sin(a)*r + (Math.random()-0.5)*40,
      vx: 0, vy: 0,
      radius: n.type === 'part' ? 20 : 14
    };
  });

  // Detail panel
  var detailEl = document.createElement('div');
  detailEl.style.cssText = 'display:none;position:absolute;bottom:16px;right:16px;width:220px;background:#fff;border:1px solid #2d333b;border-radius:12px;padding:14px;box-shadow:0 4px 16px rgba(0,0,0,0.08);font-size:0.82rem;z-index:10';
  cvs.parentElement.style.position = 'relative';
  cvs.parentElement.appendChild(detailEl);

  function mCoords(e) {
    var r = cvs.getBoundingClientRect();
    return { x: (e.clientX - r.left - mOffX) / mScale, y: (e.clientY - r.top - mOffY) / mScale };
  }
  function mFindNode(gx, gy) {
    for (var i = mNodes.length-1; i >= 0; i--) {
      var n = mNodes[i], dx = gx-n.x, dy = gy-n.y;
      if (dx*dx+dy*dy < (n.radius+5)*(n.radius+5)) return n;
    }
    return null;
  }

  function mSimulate() {
    var rep = 2000, att = 0.006, damp = 0.85, ctr = 0.012;
    for (var i = 0; i < mNodes.length; i++) {
      for (var j = i+1; j < mNodes.length; j++) {
        var a = mNodes[i], b = mNodes[j];
        var dx = b.x-a.x, dy = b.y-a.y, d = Math.sqrt(dx*dx+dy*dy)||1;
        var f = rep/(d*d);
        a.vx -= dx/d*f; a.vy -= dy/d*f;
        b.vx += dx/d*f; b.vy += dy/d*f;
      }
    }
    gd.edges.forEach(function(e) {
      var a = mNodes[e.source], b = mNodes[e.target];
      if (!a || !b) return;
      var dx = b.x-a.x, dy = b.y-a.y, d = Math.sqrt(dx*dx+dy*dy)||1;
      var f = (d-100)*att;
      a.vx += dx/d*f; a.vy += dy/d*f;
      b.vx -= dx/d*f; b.vy -= dy/d*f;
    });
    var total = 0;
    mNodes.forEach(function(n) {
      n.vx += (mW/2 - n.x)*ctr; n.vy += (mH/2 - n.y)*ctr;
      if (n === mDrag) return;
      n.vx *= damp; n.vy *= damp;
      n.x += n.vx*0.3; n.y += n.vy*0.3;
      total += Math.abs(n.vx) + Math.abs(n.vy);
    });
    if (total < 0.5) mRunning = false;
  }

  function mDraw() {
    mCtx.clearRect(0, 0, mW, mH);
    mCtx.strokeStyle = '#21262d'; mCtx.lineWidth = 0.5;
    for (var x = 0; x < mW; x += 40) { mCtx.beginPath(); mCtx.moveTo(x,0); mCtx.lineTo(x,mH); mCtx.stroke(); }
    for (var y = 0; y < mH; y += 40) { mCtx.beginPath(); mCtx.moveTo(0,y); mCtx.lineTo(mW,y); mCtx.stroke(); }

    mCtx.save();
    mCtx.translate(mOffX, mOffY);
    mCtx.scale(mScale, mScale);

    gd.edges.forEach(function(edge) {
      var a = mNodes[edge.source], b = mNodes[edge.target];
      if (!a || !b) return;
      var hl = mSelected && (mSelected.id === a.id || mSelected.id === b.id);
      mCtx.beginPath(); mCtx.moveTo(a.x, a.y); mCtx.lineTo(b.x, b.y);
      mCtx.strokeStyle = hl ? 'rgba(59,130,246,0.6)' : 'rgba(209,213,219,0.6)';
      mCtx.lineWidth = hl ? 2 : 1; mCtx.stroke();
      var mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      mCtx.font = '10px "Noto Sans SC",sans-serif';
      mCtx.fillStyle = hl ? 'rgba(59,130,246,0.9)' : 'rgba(156,163,175,0.7)';
      mCtx.textAlign = 'center'; mCtx.textBaseline = 'middle';
      mCtx.fillText(edge.label || '', mx, my - 6);
    });

    mNodes.forEach(function(node) {
      var ti = nt[node.type] || { color:'#94a3b8', emoji:'\u2699', bg:'#f1f5f9' };
      var isSel = mSelected && mSelected.id === node.id;
      var isHov = mHovered && mHovered.id === node.id;
      var isConn = false;
      if (mSelected) {
        gd.edges.forEach(function(e) {
          if ((e.source === mSelected.id && e.target === node.id) || (e.target === mSelected.id && e.source === node.id)) isConn = true;
        });
      }
      var dim = mSelected && !isSel && !isConn;

      if (isSel || isHov) {
        var g = mCtx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius*2.5);
        g.addColorStop(0, ti.color+'20'); g.addColorStop(1, ti.color+'00');
        mCtx.beginPath(); mCtx.arc(node.x, node.y, node.radius*2.5, 0, Math.PI*2);
        mCtx.fillStyle = g; mCtx.fill();
      }

      mCtx.beginPath(); mCtx.arc(node.x, node.y, node.radius, 0, Math.PI*2);
      mCtx.fillStyle = dim ? '#21262d' : '#161b22'; mCtx.fill();
      mCtx.strokeStyle = dim ? '#2d333b' : (isSel ? ti.color : ti.color+'80');
      mCtx.lineWidth = isSel ? 2.5 : 1.5; mCtx.stroke();

      mCtx.font = (node.radius*0.65)+'px sans-serif';
      mCtx.textAlign = 'center'; mCtx.textBaseline = 'middle';
      mCtx.fillStyle = ti.color;
      mCtx.fillText(ti.emoji || '\u2699', node.x, node.y);

      mCtx.font = '500 10px "Noto Sans SC",sans-serif';
      mCtx.fillStyle = dim ? '#484f58' : '#c9d1d9';
      mCtx.textBaseline = 'top';
      mCtx.fillText(node.name, node.x, node.y + node.radius + 10);
    });

    mCtx.restore();
  }

  function mSelect(node) {
    mSelected = node;
    if (!node) { detailEl.style.display = 'none'; mDraw(); return; }
    var ti = nt[node.type] || { color:'#94a3b8', label:'', emoji:'', bg:'#f1f5f9' };
    while (detailEl.firstChild) detailEl.removeChild(detailEl.firstChild);

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:10px';
    var icon = document.createElement('div');
    icon.style.cssText = 'width:32px;height:32px;border-radius:50%;background:' + (ti.bg||'#f1f5f9') + ';display:flex;align-items:center;justify-content:center;font-size:16px';
    icon.textContent = ti.emoji || '';
    var nameWrap = document.createElement('div');
    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-weight:600;color:#e6edf3';
    nameEl.textContent = node.name;
    var typeEl = document.createElement('div');
    typeEl.style.cssText = 'font-size:0.72rem;color:' + ti.color;
    typeEl.textContent = ti.label;
    nameWrap.appendChild(nameEl);
    nameWrap.appendChild(typeEl);
    header.appendChild(icon);
    header.appendChild(nameWrap);
    detailEl.appendChild(header);

    if (node.attrs) {
      var grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px';
      Object.keys(node.attrs).forEach(function(k) {
        var cell = document.createElement('div');
        cell.style.cssText = 'padding:6px 8px;background:#1c2333;border-radius:6px';
        var lbl = document.createElement('div');
        lbl.style.cssText = 'font-size:0.68rem;color:#94a3b8';
        lbl.textContent = k;
        var val = document.createElement('div');
        val.style.cssText = 'font-size:0.78rem;color:#e6edf3;font-weight:500';
        val.textContent = node.attrs[k];
        cell.appendChild(lbl);
        cell.appendChild(val);
        grid.appendChild(cell);
      });
      detailEl.appendChild(grid);
    }
    detailEl.style.display = 'block';
    mDraw();
  }

  var mAnimId = null;
  function mTick() {
    if (mRunning) mSimulate();
    mDraw();
    mAnimId = requestAnimationFrame(mTick);
  }
  mTick();

  cvs.addEventListener('mousedown', function(e) {
    var c = mCoords(e), n = mFindNode(c.x, c.y);
    if (n) { mDrag = n; mIsDragging = false; } else { mIsPanning = true; }
    mLastX = e.clientX; mLastY = e.clientY;
    cvs.style.cursor = 'grabbing';
  });
  cvs.addEventListener('mousemove', function(e) {
    var c = mCoords(e);
    if (mDrag) {
      mIsDragging = true; mDrag.x = c.x; mDrag.y = c.y;
      mDrag.vx = 0; mDrag.vy = 0; mRunning = true;
    } else if (mIsPanning) {
      mOffX += e.clientX - mLastX; mOffY += e.clientY - mLastY;
    } else {
      var n = mFindNode(c.x, c.y);
      if (n !== mHovered) { mHovered = n; cvs.style.cursor = n ? 'pointer' : 'grab'; }
    }
    mLastX = e.clientX; mLastY = e.clientY;
  });
  cvs.addEventListener('mouseup', function() {
    if (mDrag && !mIsDragging) mSelect(mDrag);
    mDrag = null; mIsPanning = false; mIsDragging = false;
    cvs.style.cursor = 'grab';
  });
  cvs.addEventListener('wheel', function(e) {
    e.preventDefault();
    var r = cvs.getBoundingClientRect();
    var mx = e.clientX - r.left, my = e.clientY - r.top;
    var d = e.deltaY > 0 ? 0.9 : 1.1;
    var ns = Math.max(0.3, Math.min(3, mScale * d));
    mOffX = mx - (mx - mOffX)*(ns/mScale);
    mOffY = my - (my - mOffY)*(ns/mScale);
    mScale = ns;
  }, { passive: false });
}

function qaClosePreview() {
  var layout = document.querySelector('.qa-page-layout');
  var panel = document.getElementById('qaPreviewPanel');
  if (layout) layout.classList.remove('with-preview');
  if (panel) panel.style.display = 'none';
  KC_QA_PREVIEW = null;
}

function qaToggleFullscreen() {}

function kcQaSend() {
  var input = document.getElementById('kcQaInput');
  if (!input) return;
  var text = String(input.value || '').trim();
  if (!text) return;
  input.value = '';
  KC_QA_CHAT.push({ role: 'user', text: text });

  var lower = text.toLowerCase();
  if (lower.indexOf('\u4E8C\u7EF4\u56FE\u7EB8') >= 0 || lower.indexOf('dwg') >= 0 || lower.indexOf('dxf') >= 0) {
    KC_QA_CHAT.push({
      role: 'assistant',
      thinking: '\uD83E\uDDE0 \u601D\u8003\u8FC7\u7A0B\n\uD83D\uDD0D \u5DF2\u6536\u5230\u60A8\u7684\u95EE\u9898\uFF0C\u6B63\u5728\u68C0\u7D22\u4E8C\u7EF4\u56FE\u7EB8\u4FE1\u606F\u2026\n\u2714 \u547D\u4E2D 2 \u6761\u76F8\u5173\u56FE\u7EB8\u8BB0\u5F55\u3002\n\u2705 \u57FA\u4E8E\u56FE\u8C31\u5173\u7CFB\u63A8\u7406\u5DF2\u5B8C\u6210\u3002',
      text: '\u5DF2\u627E\u5230\u76F8\u5173\u4E8C\u7EF4\u56FE\u7EB8\uFF1A\u6DB2\u538B\u9600\u4F53\u88C5\u914D\u56FE.dwg\n\n\u6587\u4EF6\u4FE1\u606F\uFF1A\n\u2022 \u683C\u5F0F\uFF1ADWG\n\u2022 \u5927\u5C0F\uFF1A2.4 MB\n\u2022 \u5305\u542B 24 \u4E2A\u53EF\u89E3\u6790\u5B9E\u4F53\n\n\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u67E5\u770B\uFF1A',
      actions: [
        { label: '\uD83D\uDCC4 \u4E8C\u7EF4\u56FE\u7EB8', action: 'file_2d' },
        { label: '\uD83D\uDD17 \u77E5\u8BC6\u56FE\u8C31', action: 'graph_2d' }
      ],
      thumbs: true
    });
    renderKcQa();
    return;
  }

  if (lower.indexOf('\u4E09\u7EF4\u6A21\u578B') >= 0 || lower.indexOf('step') >= 0 || lower.indexOf('stl') >= 0 || lower.indexOf('3d') >= 0) {
    KC_QA_CHAT.push({
      role: 'assistant',
      thinking: '\uD83E\uDDE0 \u601D\u8003\u8FC7\u7A0B\n\uD83D\uDD0D \u5DF2\u6536\u5230\u60A8\u7684\u95EE\u9898\uFF0C\u6B63\u5728\u68C0\u7D22\u4E09\u7EF4\u6A21\u578B\u4FE1\u606F\u2026\n\u2714 \u547D\u4E2D 1 \u6761\u76F8\u5173\u6A21\u578B\u8BB0\u5F55\u3002\n\u2705 \u57FA\u4E8E\u56FE\u8C31\u5173\u7CFB\u63A8\u7406\u5DF2\u5B8C\u6210\u3002',
      text: '\u5DF2\u627E\u5230\u76F8\u5173\u4E09\u7EF4\u6A21\u578B\uFF1A\u591A\u7EA7\u79BB\u5FC3\u6CF5 (pump.STL)\n\n\u6A21\u578B\u4FE1\u606F\uFF1A\n\u2022 \u683C\u5F0F\uFF1ASTL\n\u2022 \u5927\u5C0F\uFF1A4.7 MB\n\u2022 \u96F6\u4EF6\uFF1A\u6CF5\u4F53/\u53F6\u8F6E/\u5BFC\u53F6/\u6CF5\u8F74\n\n\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u67E5\u770B\uFF1A',
      actions: [
        { label: '\uD83D\uDCE6 \u4E09\u7EF4\u6A21\u578B', action: 'file_3d' },
        { label: '\uD83D\uDD17 \u77E5\u8BC6\u56FE\u8C31', action: 'graph_3d' }
      ],
      thumbs: true
    });
    renderKcQa();
    return;
  }

  // Default response
  KC_QA_CHAT.push({
    role: 'assistant',
    text: '\u6211\u5DF2\u6839\u636E\u60A8\u7684\u95EE\u9898\u8FDB\u884C\u68C0\u7D22\u4E0E\u6574\u5408\uFF1A\n1) \u89E3\u6790\u7ED3\u679C\uFF1A\u63D0\u53D6\u5B9E\u4F53/\u5C5E\u6027\u5E76\u5F62\u6210\u7ED3\u6784\u5316\u8868\uFF1B\n2) \u7ED3\u679C\u56FE\u8C31\uFF1A\u6839\u636E\u5173\u7CFB\u62BD\u53D6\u751F\u6210\u8282\u70B9-\u8FB9\uFF1B\n3) \u53EF\u8FFD\u6EAF\uFF1A\u6BCF\u4E2A\u7ED3\u8BBA\u90FD\u7ED9\u51FA\u6765\u6E90\u6587\u4EF6\u4E0E\u5B57\u6BB5\u4F9D\u636E\u3002\n\n\u63D0\u793A\uFF1A\u8F93\u5165\u201C\u4E8C\u7EF4\u56FE\u7EB8\u201D\u6216\u201C\u4E09\u7EF4\u6A21\u578B\u201D\u53EF\u67E5\u770B\u5BF9\u5E94\u9884\u89C8\u3002',
    thumbs: true
  });
  renderKcQa();
}

function showFileList() {
  document.getElementById('knowledgeList').style.display = 'block';
  document.getElementById('knowledgeDetail').style.display = 'none';
  var qaPage = document.getElementById('page-qa');
  if (qaPage) qaPage.style.display = 'none';
}

function showFileDetail(idx) {
  var f = FILES[idx];
  document.getElementById('knowledgeList').style.display = 'none';
  document.getElementById('knowledgeDetail').style.display = 'block';
  document.getElementById('detailFileName').textContent = f.name;

  applyKnowledgeGraphForFile(f);

  // File info panel
  var infoPanel = document.getElementById('fileInfoPanel');
  while (infoPanel.firstChild) infoPanel.removeChild(infoPanel.firstChild);
  var infoData = [
    ['文件名', f.name], ['格式', f.type], ['大小', f.size],
    ['上传者', '张工'], ['上传时间', f.time]
  ];
  infoData.forEach(function(d) {
    var row = document.createElement('div');
    row.className = 'info-row';
    var label = document.createElement('span');
    label.className = 'info-label';
    label.textContent = d[0];
    var val = document.createElement('span');
    val.className = 'info-value';
    val.textContent = d[1];
    row.appendChild(label);
    row.appendChild(val);
    infoPanel.appendChild(row);
  });

  // Parse stats
  var statsPanel = document.getElementById('parseStatsPanel');
  while (statsPanel.firstChild) statsPanel.removeChild(statsPanel.firstChild);
  var eCount = typeof f.entities === 'number' ? f.entities : 0;
  var statsData = [
    ['实体数量', eCount], ['关系数量', Math.floor(eCount * 1.1)],
    ['类型数量', 6], ['解析耗时', (eCount * 0.3).toFixed(1) + 's']
  ];
  statsData.forEach(function(d) {
    var row = document.createElement('div');
    row.className = 'info-row';
    var label = document.createElement('span');
    label.className = 'info-label';
    label.textContent = d[0];
    var val = document.createElement('span');
    val.className = 'info-value';
    val.textContent = d[1];
    row.appendChild(label);
    row.appendChild(val);
    statsPanel.appendChild(row);
  });

  // Entity table
  renderEntityTable();
  renderPreviewPanel(f);

  setTimeout(function() {
    if (!graphInitialized) initGraph();
    else { resizeCanvas(); draw(); }
  }, 30);
}

function renderPreviewPanel(f) {
  var host = document.getElementById('dtab-preview');
  if (!host) return;
  var t = String((f && f.type) || '').toUpperCase();
  var name = String((f && f.name) || '');
  var meta = (t ? (t + ' · ') : '') + (f && f.size ? f.size : '—') + ' · ' + (f && f.time ? f.time : '—');

  host.innerHTML = '';
  var wrap = document.createElement('div');
  wrap.className = 'preview-wrap';
  wrap.innerHTML =
    '<div class="preview-toolbar">' +
      '<div style="min-width:0">' +
        '<b>文件预览</b>' +
        '<div class="preview-meta" title="' + escapeHtml(name) + '">' + escapeHtml(name) + '</div>' +
      '</div>' +
      '<div class="preview-meta" style="text-align:right">' + escapeHtml(meta) + '</div>' +
    '</div>' +
    '<div class="preview-body">' +
      '<div class="preview-frame" id="pvFrame"></div>' +
    '</div>';
  host.appendChild(wrap);

  var frame = wrap.querySelector('#pvFrame');
  if (!frame) return;

  if (t === 'PDF') {
    frame.innerHTML =
      '<div style="padding:12px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px">' +
        '<div style="display:flex;align-items:center;gap:10px;min-width:0">' +
          '<span class="badge badge-rose"><span class="badge-dot"></span>PDF</span>' +
          '<span style="font-size:0.82rem;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">已生成可视化缩略图（示意）</span>' +
        '</div>' +
        '<span class="badge badge-gray">页数：' + (t === 'PDF' ? '6' : '—') + '</span>' +
      '</div>' +
      '<div style="padding:12px">' +
        '<div class="preview-pages">' +
          '<div class="preview-page"><b>第 1 页</b></div>' +
          '<div class="preview-page"><b>第 2 页</b></div>' +
          '<div class="preview-page"><b>第 3 页</b></div>' +
        '</div>' +
        '<div class="preview-kv">' +
          '<div class="pv"><div class="k">提取摘要</div><div class="v">工艺卡 / 参数范围 / 质量要求</div></div>' +
          '<div class="pv"><div class="k">关键字段</div><div class="v">56 实体 · 62 关系</div></div>' +
        '</div>' +
      '</div>';
    return;
  }

  if (t === 'DOCX' || t === 'TXT' || t === 'MD') {
    var excerpt = t === 'DOCX'
      ? '1. 适用范围：车削/铣削/磨削通用工艺\\n2. 刀具选型：硬质合金，推荐牌号...\\n3. 切削参数：Vc=120~180m/min，f=0.08~0.25mm/r\\n4. 表面粗糙度：Ra0.8（关键面）\\n5. 质量检验：首件 + 抽检...'
      : (t === 'MD'
        ? '# 铸造缺陷检测标准\\n\\n- 缺陷类型：缩孔/夹渣/气孔\\n- 检测方法：UT/RT/MT\\n- 判定规则：按 GB/T 与企业标准\\n\\n## 记录要求\\n- 缺陷位置\\n- 尺寸\\n- 复检结论'
        : '检测流程：\\n1) 确认零件批次与图号\\n2) 选择检测方法（超声/射线/磁粉）\\n3) 记录缺陷位置与尺寸\\n4) 输出判定结论与建议处置');
    frame.innerHTML = '<div class="preview-code">' + escapeHtml(excerpt) + '</div>';
    return;
  }

  if (t === 'CODE' || /\.py$/i.test(name) || /\.js$/i.test(name)) {
    var code =
      'def extract_features(dwg_doc):\\n' +
      '    dims = []\\n' +
      '    for e in dwg_doc.entities:\\n' +
      '        if e.type in (\"DIMENSION\", \"TEXT\"):\\n' +
      '            dims.append({\"value\": e.value, \"pos\": e.pos})\\n' +
      '    return dims\\n\\n' +
      'def build_graph(entities):\\n' +
      '    nodes = []\\n' +
      '    edges = []\\n' +
      '    for x in entities:\\n' +
      '        nodes.append({\"id\": len(nodes), \"name\": x[\"name\"], \"type\": x[\"type\"]})\\n' +
      '    return {\"nodes\": nodes, \"edges\": edges}\\n';
    frame.innerHTML = '<div class="preview-code">' + escapeHtml(code) + '</div>';
    return;
  }

  if (t === 'XLSX' || t === 'CSV') {
    frame.innerHTML =
      '<div style="padding:12px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<span class="badge badge-green"><span class="badge-dot"></span>表格预览</span>' +
          '<span style="font-size:0.82rem;color:var(--text-secondary)">展示前 8 行（示意）</span>' +
        '</div>' +
        '<span class="badge badge-gray">Sheet: 参数推荐</span>' +
      '</div>' +
      '<div style="padding:0 0 8px 0">' +
        '<table class="preview-mini-table">' +
          '<thead><tr><th style="width:120px">材料</th><th style="width:120px">刀具</th><th>Vc</th><th>f</th><th>ap</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>40Cr</td><td>CNMG1204</td><td>160</td><td>0.18</td><td>1.5</td></tr>' +
            '<tr><td>QT450-10</td><td>WNMG0804</td><td>140</td><td>0.22</td><td>2.0</td></tr>' +
            '<tr><td>HT250</td><td>CNMG1204</td><td>120</td><td>0.25</td><td>2.5</td></tr>' +
            '<tr><td>铝合金</td><td>VNMG1604</td><td>280</td><td>0.12</td><td>1.2</td></tr>' +
            '<tr><td>不锈钢</td><td>CNMG1204</td><td>110</td><td>0.10</td><td>1.0</td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>';
    return;
  }

  if (t === 'PNG' || t === 'JPG' || t === 'JPEG') {
    frame.innerHTML =
      '<div class="preview-hero">' +
        '<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#ffffff"/>' +
              '<stop offset="1" stop-color="#f8fafc"/>' +
            '</linearGradient>' +
            '<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">' +
              '<feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(15,23,42,0.12)"/>' +
            '</filter>' +
          '</defs>' +
          '<rect x="0" y="0" width="900" height="520" fill="url(#g1)"/>' +
          '<rect x="70" y="60" width="760" height="400" rx="16" fill="#fff" stroke="rgba(148,163,184,0.55)" filter="url(#shadow)"/>' +
          '<path d="M140 360 L260 220 L340 300 L430 200 L540 330 L620 270 L760 360" fill="none" stroke="#3b82f6" stroke-width="4" opacity="0.55"/>' +
          '<circle cx="260" cy="220" r="8" fill="#10b981"/>' +
          '<circle cx="430" cy="200" r="8" fill="#10b981"/>' +
          '<circle cx="620" cy="270" r="8" fill="#10b981"/>' +
          '<text x="120" y="115" font-size="16" font-family="Noto Sans SC, sans-serif" fill="#0f172a" font-weight="600">装配示意预览（示意图）</text>' +
          '<text x="120" y="145" font-size="12" font-family="JetBrains Mono, monospace" fill="#64748b">PNG raster · annotations</text>' +
          '<rect x="120" y="170" width="300" height="170" rx="12" fill="rgba(59,130,246,0.06)" stroke="rgba(59,130,246,0.25)"/>' +
          '<rect x="460" y="170" width="300" height="170" rx="12" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)"/>' +
          '<text x="140" y="200" font-size="12" fill="#0f172a" font-weight="600">关键特征</text>' +
          '<text x="140" y="226" font-size="12" fill="#475569">• 装配配合面</text>' +
          '<text x="140" y="250" font-size="12" fill="#475569">• 螺栓孔位置</text>' +
          '<text x="140" y="274" font-size="12" fill="#475569">• 轴承座定位</text>' +
          '<text x="480" y="200" font-size="12" fill="#0f172a" font-weight="600">提取结果</text>' +
          '<text x="480" y="226" font-size="12" fill="#475569">• 12 实体</text>' +
          '<text x="480" y="250" font-size="12" fill="#475569">• 14 关系</text>' +
          '<text x="480" y="274" font-size="12" fill="#475569">• 6 类别</text>' +
        '</svg>' +
      '</div>';
    return;
  }

  // 2D / 3D previews (keep consistent with houtai.html)
  if (t === 'DWG' || t === 'DXF') {
    var heroDiv = document.createElement('div');
    heroDiv.className = 'preview-hero';
    var img = document.createElement('img');
    img.src = 'resources/二维图纸.png';
    img.alt = '二维图纸预览';
    img.style.cssText = 'width:100%;height:auto;display:block';
    heroDiv.appendChild(img);
    frame.appendChild(heroDiv);
    return;
  }

  if (t === 'STEP' || t === 'IGES' || t === 'STL') {
    var container3d = document.createElement('div');
    container3d.className = 'preview-hero';
    container3d.style.cssText = 'width:100%;height:520px;background:#0d1117';
    container3d.id = 'glbContainer';
    frame.appendChild(container3d);
    setTimeout(function() {
      if (window.location && window.location.protocol === 'file:') {
        container3d.innerHTML =
          '<div class="empty-hint" style="padding:48px 20px">' +
            '<p style="font-weight:600;color:var(--text-dark)">三维模型无法在本地文件模式加载</p>' +
            '<p style="font-size:0.82rem;margin-top:6px;color:var(--text-muted)">你当前是 file:// 打开，浏览器会拦截 three.js 的模型请求。请用本地静态服务器打开（例如：python3 -m http.server）</p>' +
          '</div>';
        return;
      }

      if (!window.THREE || !THREE.OrbitControls || !THREE.STLLoader) {
        container3d.innerHTML =
          '<div class="empty-hint" style="padding:48px 20px">' +
            '<p style="font-weight:600;color:var(--text-dark)">三维预览依赖未加载</p>' +
            '<p style="font-size:0.82rem;margin-top:6px;color:var(--text-muted)">请检查 three.js / OrbitControls / STLLoader 脚本是否可访问</p>' +
          '</div>';
        return;
      }

      var tries = 0;
      function start() {
        tries += 1;
        var w = container3d.clientWidth;
        var h = container3d.clientHeight;
        if ((!w || !h) && tries < 30) return setTimeout(start, 50);
        if (!w || !h) return;

        container3d.innerHTML = '';
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0d1117);
        var camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(window.devicePixelRatio);
        container3d.appendChild(renderer.domElement);
        var ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        var loader = new THREE.STLLoader();
        var stlUrl = new URL('resources/pump.STL', window.location.href).toString();
        loader.load(stlUrl, function(geometry) {
          var material = new THREE.MeshPhongMaterial({ color: 0x6e8898, specular: 0x58a6ff, shininess: 60 });
          var model = new THREE.Mesh(geometry, material);
          scene.add(model);
          var box = new THREE.Box3().setFromObject(model);
          var center = box.getCenter(new THREE.Vector3());
          var size = box.getSize(new THREE.Vector3());
          var maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(center.x + maxDim, center.y + maxDim * 0.6, center.z + maxDim);
          camera.lookAt(center);
          controls.target.copy(center);
          controls.update();
        }, undefined, function() {
          container3d.innerHTML =
            '<div class="empty-hint" style="padding:48px 20px">' +
              '<p style="font-weight:600;color:var(--text-dark)">三维模型加载失败</p>' +
              '<p style="font-size:0.82rem;margin-top:6px;color:var(--text-muted)">未能加载 ' + escapeHtml(stlUrl) + '</p>' +
            '</div>';
        });

        function onResize() {
          var nw = container3d.clientWidth;
          var nh = container3d.clientHeight;
          if (!nw || !nh) return;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
        window.addEventListener('resize', onResize, { passive: true });

        function animate() {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }
        animate();
      }

      start();
    }, 50);
    return;
  }

  if (t === 'DWG' || t === 'DXF') {
    frame.innerHTML =
      '<div class="preview-hero">' +
        '<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#ffffff"/>' +
              '<stop offset="1" stop-color="#f8fafc"/>' +
            '</linearGradient>' +
          '</defs>' +
          '<rect x="0" y="0" width="900" height="520" fill="url(#bg2)"/>' +
          '<rect x="40" y="30" width="820" height="460" rx="14" fill="#fff" stroke="rgba(148,163,184,0.60)"/>' +
          '<rect x="62" y="52" width="620" height="416" rx="10" fill="rgba(2,6,23,0.02)" stroke="rgba(148,163,184,0.35)"/>' +
          '<rect x="700" y="52" width="138" height="140" rx="10" fill="rgba(59,130,246,0.05)" stroke="rgba(59,130,246,0.25)"/>' +
          '<text x="714" y="78" font-size="12" fill="#0f172a" font-weight="600">标题栏</text>' +
          '<text x="714" y="102" font-size="11" fill="#64748b">图号: DWG-01</text>' +
          '<text x="714" y="122" font-size="11" fill="#64748b">比例: 1:2</text>' +
          '<text x="714" y="142" font-size="11" fill="#64748b">单位: mm</text>' +
          '<g transform="translate(90,95)">' +
            '<rect x="0" y="0" width="520" height="320" rx="10" fill="none" stroke="rgba(30,41,59,0.35)" stroke-width="2"/>' +
            '<rect x="70" y="60" width="380" height="200" rx="10" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.65"/>' +
            '<circle cx="150" cy="140" r="18" fill="none" stroke="#10b981" stroke-width="3" opacity="0.8"/>' +
            '<circle cx="370" cy="140" r="18" fill="none" stroke="#10b981" stroke-width="3" opacity="0.8"/>' +
            '<circle cx="150" cy="220" r="18" fill="none" stroke="#10b981" stroke-width="3" opacity="0.8"/>' +
            '<circle cx="370" cy="220" r="18" fill="none" stroke="#10b981" stroke-width="3" opacity="0.8"/>' +
            '<path d="M70 38 H450" stroke="rgba(148,163,184,0.7)" stroke-width="2"/>' +
            '<path d="M70 38 V50 M450 38 V50" stroke="rgba(148,163,184,0.7)" stroke-width="2"/>' +
            '<text x="252" y="32" font-size="12" fill="#475569" font-family="JetBrains Mono, monospace">380</text>' +
            '<path d="M40 60 V260" stroke="rgba(148,163,184,0.7)" stroke-width="2"/>' +
            '<path d="M40 60 H52 M40 260 H52" stroke="rgba(148,163,184,0.7)" stroke-width="2"/>' +
            '<text x="18" y="166" font-size="12" fill="#475569" font-family="JetBrains Mono, monospace" transform="rotate(-90 18 166)">200</text>' +
          '</g>' +
          '<text x="72" y="48" font-size="12" fill="#0f172a" font-weight="600">二维图纸预览（可显示的示意渲染）</text>' +
          '<text x="72" y="488" font-size="11" fill="#64748b" font-family="JetBrains Mono, monospace">DWG/DXF 预览通常需CAD渲染服务；此处为前端可视化占位示意（确保页面可展示内容）。</text>' +
        '</svg>' +
      '</div>';
    return;
  }

  if (t === 'STEP' || t === 'IGES' || t === 'STL') {
    frame.innerHTML =
      '<div class="preview-hero">' +
        '<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg">' +
          '<defs>' +
            '<linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">' +
              '<stop offset="0" stop-color="#ffffff"/>' +
              '<stop offset="1" stop-color="#f8fafc"/>' +
            '</linearGradient>' +
          '</defs>' +
          '<rect x="0" y="0" width="900" height="520" fill="url(#g3)"/>' +
          '<text x="70" y="70" font-size="12" fill="#0f172a" font-weight="600">三维模型预览（示意渲染）</text>' +
          '<text x="70" y="94" font-size="11" fill="#64748b" font-family="JetBrains Mono, monospace">' + escapeHtml(t) + ' · wireframe</text>' +
          '<g transform="translate(170,120)">' +
            '<path d="M120 40 L340 0 L520 120 L300 160 Z" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.45)" stroke-width="2"/>' +
            '<path d="M120 40 L120 280 L300 400 L300 160" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.40)" stroke-width="2"/>' +
            '<path d="M300 160 L300 400 L520 360 L520 120" fill="rgba(245,158,11,0.06)" stroke="rgba(245,158,11,0.40)" stroke-width="2"/>' +
            '<path d="M120 280 L340 240 L520 360 L300 400 Z" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.35)" stroke-width="2"/>' +
            '<circle cx="260" cy="220" r="18" fill="none" stroke="#0ea5e9" stroke-width="3" opacity="0.65"/>' +
            '<circle cx="420" cy="240" r="12" fill="none" stroke="#10b981" stroke-width="3" opacity="0.65"/>' +
          '</g>' +
          '<g transform="translate(70,360)">' +
            '<rect x="0" y="0" width="760" height="120" rx="14" fill="#fff" stroke="rgba(148,163,184,0.55)"/>' +
            '<text x="16" y="32" font-size="12" fill="#0f172a" font-weight="600">可识别要素</text>' +
            '<text x="16" y="58" font-size="12" fill="#475569">• 零件/子装配 • 孔/面特征 • 关键尺寸 • 材料/工艺属性</text>' +
            '<text x="16" y="84" font-size="12" fill="#475569">• 支持：与右侧解析结果/图谱联动展示</text>' +
          '</g>' +
        '</svg>' +
      '</div>';
    return;
  }

  frame.innerHTML =
    '<div class="empty-hint" style="padding:48px 20px">' +
      '<p style="font-weight:600;color:var(--text-dark)">暂无可用预览</p>' +
      '<p style="font-size:0.82rem;margin-top:6px;color:var(--text-muted)">当前类型：' + escapeHtml(t || '—') + '</p>' +
    '</div>';
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderEntityTable() {
  var tbody = document.getElementById('entityTableBody');
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  GRAPH_DATA.nodes.forEach(function(node) {
    var tr = document.createElement('tr');
    var typeInfo = NODE_TYPES[node.type];

    var tdName = document.createElement('td');
    tdName.style.fontWeight = '500';
    tdName.style.color = 'var(--text-dark)';
    tdName.textContent = node.name;

    var tdType = document.createElement('td');
    var badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.background = typeInfo.bg;
    badge.style.color = typeInfo.color;
    badge.textContent = typeInfo.label;
    tdType.appendChild(badge);

    var tdAttrs = document.createElement('td');
    tdAttrs.style.fontSize = '0.8rem';
    tdAttrs.style.color = 'var(--text-secondary)';
    tdAttrs.style.maxWidth = '300px';
    var attrKeys = Object.keys(node.attrs);
    tdAttrs.textContent = attrKeys.slice(0, 2).map(function(k) { return k + ': ' + node.attrs[k]; }).join(' | ');

    var tdRels = document.createElement('td');
    var relCount = GRAPH_DATA.edges.filter(function(e) { return e.source === node.id || e.target === node.id; }).length;
    tdRels.textContent = relCount;
    tdRels.style.fontFamily = 'var(--font-mono)';

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdAttrs);
    tr.appendChild(tdRels);
    tbody.appendChild(tr);
  });
}

function switchDetailTab(tab) {
  document.querySelectorAll('[data-dtab]').forEach(function(b) { b.classList.toggle('active', b.dataset.dtab === tab); });
  document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
  document.getElementById('dtab-' + tab).classList.add('active');
  if (tab === 'graph') {
    setTimeout(function() { if (!graphInitialized) initGraph(); else { resizeCanvas(); draw(); } }, 50);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Business
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderBusiness() {
  var grid = document.getElementById('businessGrid');
  while (grid.firstChild) grid.removeChild(grid.firstChild);

  var rbacCard = document.createElement('div');
  rbacCard.className = 'main-card';
  rbacCard.innerHTML =
    '<div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px">' +
      '<div style="min-width:0">' +
        '<div style="font-weight:600;color:var(--text-dark)">RBAC 权限设置</div>' +
        '<div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">角色-权限-用户分配与审计</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">' +
        '<span class="badge badge-blue"><span class="badge-dot"></span>启用</span>' +
        '<button class="btn">导入策略</button>' +
        '<button class="btn btn-primary">新增角色</button>' +
      '</div>' +
    '</div>' +
    '<div class="main-card-body">' +
      '<div style="display:grid;grid-template-columns:1fr;gap:14px">' +
        '<div>' +
          '<table class="data-table">' +
            '<thead><tr><th>角色</th><th>用户数</th><th>权限范围</th><th>状态</th></tr></thead>' +
            '<tbody>' +
              '<tr><td style="font-weight:500;color:var(--text-dark)">系统管理员</td><td>3</td><td style="color:var(--text-secondary)">全局</td><td><span class="badge badge-green"><span class="badge-dot"></span>生效</span></td></tr>' +
              '<tr><td style="font-weight:500;color:var(--text-dark)">项目负责人</td><td>12</td><td style="color:var(--text-secondary)">项目级</td><td><span class="badge badge-green"><span class="badge-dot"></span>生效</span></td></tr>' +
              '<tr><td style="font-weight:500;color:var(--text-dark)">工艺工程师</td><td>28</td><td style="color:var(--text-secondary)">知识/工具</td><td><span class="badge badge-green"><span class="badge-dot"></span>生效</span></td></tr>' +
              '<tr><td style="font-weight:500;color:var(--text-dark)">访客</td><td>46</td><td style="color:var(--text-secondary)">只读</td><td><span class="badge badge-gray"><span class="badge-dot"></span>限制</span></td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<span class="badge badge-gray">最小权限</span>' +
          '<span class="badge badge-gray">审批流</span>' +
          '<span class="badge badge-gray">操作审计</span>' +
          '<span class="badge badge-gray">敏感资源保护</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  grid.appendChild(rbacCard);

  var relCard = document.createElement('div');
  relCard.className = 'main-card';
  relCard.innerHTML =
    '<div style="padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px">' +
      '<div style="min-width:0">' +
        '<div style="font-weight:600;color:var(--text-dark)">软件版本发布管理</div>' +
        '<div style="margin-top:4px;font-size:0.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">版本、环境、灰度与回滚</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">' +
        '<span class="badge badge-amber"><span class="badge-dot"></span>待发布</span>' +
        '<button class="btn">发布记录</button>' +
        '<button class="btn btn-primary">创建发布</button>' +
      '</div>' +
    '</div>' +
    '<div class="main-card-body">' +
      '<div style="display:grid;grid-template-columns:1fr;gap:14px">' +
        '<div class="info-card" style="padding:14px;border-radius:12px">' +
          '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center">' +
            '<div>' +
              '<div style="font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">当前版本</div>' +
              '<div style="margin-top:6px;font-size:1.05rem;font-weight:600;color:var(--text-dark);font-family:var(--font-mono)">v2.3.0</div>' +
            '</div>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end">' +
              '<span class="badge badge-green"><span class="badge-dot"></span>测试环境</span>' +
              '<span class="badge badge-gray"><span class="badge-dot"></span>生产未发布</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<table class="data-table">' +
            '<thead><tr><th>版本</th><th>环境</th><th>状态</th><th>操作人</th><th>时间</th></tr></thead>' +
            '<tbody>' +
              '<tr><td style="font-family:var(--font-mono)">v2.3.0</td><td>测试</td><td><span class="badge badge-green"><span class="badge-dot"></span>已发布</span></td><td>admin</td><td style="color:var(--text-secondary)">2026-04-13 10:20</td></tr>' +
              '<tr><td style="font-family:var(--font-mono)">v2.2.3</td><td>生产</td><td><span class="badge badge-blue"><span class="badge-dot"></span>稳定</span></td><td>release-bot</td><td style="color:var(--text-secondary)">2026-04-10 18:05</td></tr>' +
              '<tr><td style="font-family:var(--font-mono)">v2.2.2</td><td>生产</td><td><span class="badge badge-gray"><span class="badge-dot"></span>已回滚</span></td><td>admin</td><td style="color:var(--text-secondary)">2026-04-08 09:12</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>' +
    '</div>';
  grid.appendChild(relCard);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Render: Resources
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderResources() {
  // Folder tree
  var tree = document.getElementById('resFolderTree');
  while (tree.firstChild) tree.removeChild(tree.firstChild);

  function renderFolder(folder, depth) {
    var item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 12px 6px ' + (12 + depth * 18) + 'px;cursor:pointer;font-size:0.85rem;color:var(--text);border-radius:0;transition:background 0.1s;';
    item.addEventListener('mouseenter', function() { item.style.background = 'var(--bg-hover)'; });
    item.addEventListener('mouseleave', function() { item.style.background = ''; });

    if (folder.children && folder.children.length > 0) {
      var arrow = document.createElement('span');
      arrow.style.cssText = 'font-size:0.6rem;color:var(--text-muted);width:12px;flex-shrink:0;';
      arrow.textContent = '\u25B6';
      item.appendChild(arrow);
    } else {
      var spacer = document.createElement('span');
      spacer.style.width = '12px';
      spacer.style.flexShrink = '0';
      item.appendChild(spacer);
    }

    var folderIcon = document.createElement('span');
    folderIcon.style.cssText = 'color:var(--text-muted);display:flex;align-items:center;';
    folderIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
    item.appendChild(folderIcon);

    var nameEl = document.createElement('span');
    nameEl.textContent = folder.name;
    item.appendChild(nameEl);

    tree.appendChild(item);

    if (folder.children) {
      folder.children.forEach(function(child) {
        renderFolder(child, depth + 1);
      });
    }
  }

  RES_FOLDERS.forEach(function(f) {
    // Root item with special icon
    var rootItem = document.createElement('div');
    rootItem.style.cssText = 'display:flex;align-items:center;gap:6px;padding:8px 12px;font-size:0.88rem;font-weight:600;color:var(--text-dark);background:var(--blue-light);border-left:3px solid var(--blue);';
    var rIcon = document.createElement('span');
    rIcon.style.cssText = 'display:flex;align-items:center;color:var(--blue);';
    rIcon.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>';
    rootItem.appendChild(rIcon);
    var rName = document.createElement('span');
    rName.textContent = f.name;
    rootItem.appendChild(rName);
    tree.appendChild(rootItem);

    if (f.children) {
      f.children.forEach(function(child) {
        renderFolder(child, 1);
      });
    }
  });

  // File grid
  var grid = document.getElementById('resFileGrid');
  while (grid.firstChild) grid.removeChild(grid.firstChild);

  var fileTypeIcons = {
    DOCX: { bg: '#eff6ff', stroke: '#3b82f6' },
    CATPART: { bg: '#f3f4f6', stroke: '#6b7280' },
    XLSX: { bg: '#ecfdf5', stroke: '#059669' },
    NC: { bg: '#1e293b', stroke: '#22d3ee' },
    PDF: { bg: '#fff1f2', stroke: '#f43f5e' },
  };

  RES_FILES.forEach(function(f) {
    var card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'padding:16px;position:relative;';

    // Delete button
    var delBtn = document.createElement('button');
    delBtn.className = 'tool-delete';
    delBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>';
    card.appendChild(delBtn);

    // File icon
    var iconWrap = document.createElement('div');
    iconWrap.style.cssText = 'width:48px;height:56px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;';
    var colors = fileTypeIcons[f.type] || { bg: '#f3f4f6', stroke: '#6b7280' };
    iconWrap.innerHTML = '<svg width="40" height="48" viewBox="0 0 40 48" fill="none"><path d="M4 4a4 4 0 014-4h16l12 12v28a4 4 0 01-4 4H8a4 4 0 01-4-4V4z" fill="#f8f9fa" stroke="' + colors.stroke + '" stroke-width="1.5"/><path d="M24 0v8a4 4 0 004 4h8" fill="#f0f1f5" stroke="' + colors.stroke + '" stroke-width="1.5"/></svg>';
    card.appendChild(iconWrap);

    // Name
    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-size:0.88rem;font-weight:600;color:var(--text-dark);margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    nameEl.textContent = f.name;
    card.appendChild(nameEl);

    // Meta
    var meta = [f.type, f.size, f.time];
    meta.forEach(function(m) {
      var line = document.createElement('div');
      line.style.cssText = 'font-size:0.75rem;color:var(--text-muted);line-height:1.6;';
      line.textContent = m;
      card.appendChild(line);
    });

    grid.appendChild(card);
  });
}

function resNavigateUp() {
  // Mock - just visual feedback
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Knowledge Graph (Light Theme)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var canvas, ctx, W, H;
var graphNodes = [], graphScale = 1, graphOffsetX = 0, graphOffsetY = 0;
var selectedNode = null, hoveredNode = null, dragNode = null;
var isDragging = false, isPanning = false, lastMouseX = 0, lastMouseY = 0;
var graphInitialized = false, simulationRunning = false, animFrame = null;

function resizeCanvas() {
  canvas = document.getElementById('graphCanvas');
  ctx = canvas.getContext('2d');
  var rect = canvas.parentElement.getBoundingClientRect();
  W = rect.width; H = rect.height;
  canvas.width = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function initGraph() {
  resizeCanvas();
  graphNodes = GRAPH_DATA.nodes.map(function(n, i) {
    var angle = (i / GRAPH_DATA.nodes.length) * Math.PI * 2;
    var r = 160 + Math.random() * 80;
    return {
      id: n.id, name: n.name, type: n.type, attrs: n.attrs,
      x: W/2 + Math.cos(angle)*r + (Math.random()-0.5)*50,
      y: H/2 + Math.sin(angle)*r + (Math.random()-0.5)*50,
      vx: 0, vy: 0,
      radius: n.type === 'part' ? 20 : n.type === 'assembly' ? 18 : 14,
    };
  });
  graphScale = 1; graphOffsetX = 0; graphOffsetY = 0;
  simulationRunning = true; graphInitialized = true;
  setupCanvasEvents();
  requestAnimationFrame(tick);
}

function tick() {
  if (!document.getElementById('dtab-graph').classList.contains('active')) return;
  if (simulationRunning) simulate();
  draw();
  animFrame = requestAnimationFrame(tick);
}

function simulate() {
  var rep = 2500, att = 0.005, damp = 0.85, center = 0.01, alpha = 0.3;
  for (var i = 0; i < graphNodes.length; i++) {
    for (var j = i+1; j < graphNodes.length; j++) {
      var a = graphNodes[i], b = graphNodes[j];
      var dx = b.x-a.x, dy = b.y-a.y;
      var d = Math.sqrt(dx*dx+dy*dy)||1;
      var f = rep/(d*d);
      a.vx -= dx/d*f; a.vy -= dy/d*f;
      b.vx += dx/d*f; b.vy += dy/d*f;
    }
  }
  GRAPH_DATA.edges.forEach(function(e) {
    var a = graphNodes[e.source], b = graphNodes[e.target];
    var dx = b.x-a.x, dy = b.y-a.y;
    var d = Math.sqrt(dx*dx+dy*dy)||1;
    var f = (d-110)*att;
    a.vx += dx/d*f; a.vy += dy/d*f;
    b.vx -= dx/d*f; b.vy -= dy/d*f;
  });
  var total = 0;
  graphNodes.forEach(function(n) {
    n.vx += (W/2 - n.x)*center;
    n.vy += (H/2 - n.y)*center;
    if (n === dragNode) return;
    n.vx *= damp; n.vy *= damp;
    n.x += n.vx*alpha; n.y += n.vy*alpha;
    total += Math.abs(n.vx) + Math.abs(n.vy);
  });
  if (total < 0.5) simulationRunning = false;
}

function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);
  // Light grid
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 0.5;
  for (var x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for (var y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

  ctx.save();
  ctx.translate(graphOffsetX, graphOffsetY);
  ctx.scale(graphScale, graphScale);

  // Edges
  GRAPH_DATA.edges.forEach(function(edge) {
    var a = graphNodes[edge.source], b = graphNodes[edge.target];
    var hl = selectedNode && (selectedNode.id === a.id || selectedNode.id === b.id);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = hl ? 'rgba(59,130,246,0.6)' : 'rgba(209,213,219,0.6)';
    ctx.lineWidth = hl ? 2 : 1;
    ctx.stroke();
    if (hl || graphScale > 0.7) {
      var mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
      ctx.font = '10px "Noto Sans SC",sans-serif';
      ctx.fillStyle = hl ? 'rgba(59,130,246,0.9)' : 'rgba(156,163,175,0.7)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(edge.label, mx, my - 6);
    }
  });

  // Nodes
  graphNodes.forEach(function(node) {
    var ti = NODE_TYPES[node.type];
    var isSel = selectedNode && selectedNode.id === node.id;
    var isHov = hoveredNode && hoveredNode.id === node.id;
    var isConn = false;
    if (selectedNode) {
      GRAPH_DATA.edges.forEach(function(e) {
        if ((e.source === selectedNode.id && e.target === node.id) || (e.target === selectedNode.id && e.source === node.id)) isConn = true;
      });
    }
    var dim = selectedNode && !isSel && !isConn;

    if (isSel || isHov) {
      var g = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, node.radius*2.5);
      g.addColorStop(0, ti.color + '20'); g.addColorStop(1, ti.color + '00');
      ctx.beginPath(); ctx.arc(node.x, node.y, node.radius*2.5, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.fill();
    }

    ctx.beginPath(); ctx.arc(node.x, node.y, node.radius, 0, Math.PI*2);
    ctx.fillStyle = dim ? '#21262d' : '#161b22';
    ctx.fill();
    ctx.strokeStyle = dim ? '#2d333b' : (isSel ? ti.color : ti.color + '80');
    ctx.lineWidth = isSel ? 2.5 : 1.5;
    ctx.stroke();

    ctx.font = (node.radius * 0.65) + 'px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(ti.emoji, node.x, node.y);

    ctx.font = '500 10px "Noto Sans SC",sans-serif';
    ctx.fillStyle = dim ? '#484f58' : '#c9d1d9';
    ctx.fillText(node.name, node.x, node.y + node.radius + 12);
  });

  ctx.restore();
}

function setupCanvasEvents() {
  canvas.addEventListener('mousedown', function(e) {
    var c = gCoords(e); var n = findNode(c.x, c.y);
    if (n) { dragNode = n; isDragging = false; } else { isPanning = true; }
    lastMouseX = e.clientX; lastMouseY = e.clientY;
  });
  canvas.addEventListener('mousemove', function(e) {
    var c = gCoords(e);
    if (dragNode) {
      isDragging = true; dragNode.x = c.x; dragNode.y = c.y;
      dragNode.vx = 0; dragNode.vy = 0; simulationRunning = true;
      if (!animFrame) animFrame = requestAnimationFrame(tick);
    } else if (isPanning) {
      graphOffsetX += e.clientX - lastMouseX; graphOffsetY += e.clientY - lastMouseY;
    } else {
      var n = findNode(c.x, c.y);
      if (n !== hoveredNode) { hoveredNode = n; canvas.style.cursor = n ? 'pointer' : 'default'; }
    }
    lastMouseX = e.clientX; lastMouseY = e.clientY;
  });
  canvas.addEventListener('mouseup', function() {
    if (dragNode && !isDragging) selectGraphNode(dragNode);
    dragNode = null; isPanning = false; isDragging = false;
  });
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left, my = e.clientY - rect.top;
    var d = e.deltaY > 0 ? 0.9 : 1.1;
    var ns = Math.max(0.3, Math.min(3, graphScale * d));
    graphOffsetX = mx - (mx - graphOffsetX) * (ns / graphScale);
    graphOffsetY = my - (my - graphOffsetY) * (ns / graphScale);
    graphScale = ns; draw();
  }, { passive: false });
}

function gCoords(e) {
  var r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left - graphOffsetX)/graphScale, y: (e.clientY - r.top - graphOffsetY)/graphScale };
}
function findNode(gx, gy) {
  for (var i = graphNodes.length-1; i >= 0; i--) {
    var n = graphNodes[i]; var dx = gx-n.x, dy = gy-n.y;
    if (dx*dx+dy*dy < (n.radius+5)*(n.radius+5)) return n;
  }
  return null;
}

function selectGraphNode(node) {
  selectedNode = node;
  var panel = document.getElementById('graphDetailPanel');
  if (!node) { panel.classList.remove('visible'); draw(); return; }
  panel.classList.add('visible');
  var ti = NODE_TYPES[node.type];
  var iconEl = document.getElementById('gdpIcon');
  iconEl.style.background = ti.bg; iconEl.textContent = ti.emoji;
  document.getElementById('gdpName').textContent = node.name;
  document.getElementById('gdpType').textContent = ti.label;
  var attrsEl = document.getElementById('gdpAttrs');
  while (attrsEl.firstChild) attrsEl.removeChild(attrsEl.firstChild);
  Object.keys(node.attrs).forEach(function(k) {
    var item = document.createElement('div');
    item.className = 'gdp-attr';
    var label = document.createElement('div');
    label.className = 'gdp-attr-label';
    label.textContent = k;
    var val = document.createElement('div');
    val.className = 'gdp-attr-value';
    val.textContent = node.attrs[k];
    item.appendChild(label);
    item.appendChild(val);
    attrsEl.appendChild(item);
  });
  draw();
}

function graphZoom(f) {
  var ns = Math.max(0.3, Math.min(3, graphScale*f));
  graphOffsetX = W/2 - (W/2 - graphOffsetX)*(ns/graphScale);
  graphOffsetY = H/2 - (H/2 - graphOffsetY)*(ns/graphScale);
  graphScale = ns; draw();
}
function graphFit() {
  if (!graphNodes.length) return;
  var minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  graphNodes.forEach(function(n) {
    if(n.x-30<minX)minX=n.x-30; if(n.x+30>maxX)maxX=n.x+30;
    if(n.y-30<minY)minY=n.y-30; if(n.y+30>maxY)maxY=n.y+30;
  });
  var gw=maxX-minX, gh=maxY-minY;
  graphScale = Math.min((W-40)/gw, (H-40)/gh, 1.5);
  graphOffsetX = (W-gw*graphScale)/2 - minX*graphScale;
  graphOffsetY = (H-gh*graphScale)/2 - minY*graphScale;
  draw();
}
function resetLayout() {
  graphNodes.forEach(function(n, i) {
    var a = (i/graphNodes.length)*Math.PI*2, r = 160+Math.random()*80;
    n.x = W/2+Math.cos(a)*r; n.y = H/2+Math.sin(a)*r; n.vx=0; n.vy=0;
  });
  graphScale=1; graphOffsetX=0; graphOffsetY=0;
  simulationRunning=true;
  if (!animFrame) animFrame = requestAnimationFrame(tick);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Init
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
renderAgents();
renderTools();
renderModels();
renderKbTypeList();
renderFiles();
renderKnowledgeTree();

// File upload mock
var fileUploadEl = document.getElementById('fileUploadInput');
if (fileUploadEl) {
  fileUploadEl.addEventListener('change', function() {
    var fileList = this.files;
    if (!fileList || !fileList.length) return;
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      var name = f.name;
      var sizeMB = f.size / (1024 * 1024);
      var sizeStr = sizeMB >= 1 ? sizeMB.toFixed(1) + ' MB' : Math.round(f.size / 1024) + ' KB';
      var ext = name.split('.').pop().toUpperCase();
      var typeMap = { DWG:'DWG', DXF:'DXF', PDF:'PDF', DOCX:'DOCX', STEP:'STEP', IGES:'IGES', STL:'STL', GLB:'GLB', GLTF:'GLB', XLSX:'XLSX', CSV:'CSV', PNG:'PNG', JPG:'JPG', JPEG:'JPG', PY:'CODE', JS:'CODE', NC:'CODE', TXT:'TXT', MD:'TXT' };
      var type = typeMap[ext] || ext;
      var domainMap = { DWG:'\u673A\u68B0\u5236\u9020', DXF:'\u7535\u6C14\u5DE5\u7A0B', STEP:'\u673A\u68B0\u5236\u9020', IGES:'\u6C7D\u8F66\u5236\u9020', STL:'\u673A\u68B0\u5236\u9020', GLB:'\u673A\u68B0\u5236\u9020', PDF:'\u822A\u7A7A\u822A\u5929', DOCX:'\u673A\u68B0\u5236\u9020' };
      var now = new Date();
      var timeStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
      FILES.unshift({
        name: name, type: type, size: sizeStr, time: timeStr,
        status: 'parsing', entities: '\u2014', storage: [], domain: domainMap[ext] || '\u5176\u4ED6'
      });
      // Simulate parsing completion after 2 seconds
      (function(idx) {
        setTimeout(function() {
          FILES[idx].status = 'done';
          FILES[idx].entities = Math.floor(Math.random() * 40) + 10;
          FILES[idx].storage = ['structured', 'vector'];
          renderKbTypeList();
          renderFiles();
        }, 2000);
      })(0);
    }
    renderKbTypeList();
    renderFiles();
    this.value = '';
  });
}
renderBusiness();
renderResources();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Flow Editor
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var currentFlowAgentIdx = 0;
var flowZoomLevel = 1;
var flowPanX = 0, flowPanY = 0;
var flowDragNode = null, flowDragStartX = 0, flowDragStartY = 0, flowNodeStartX = 0, flowNodeStartY = 0;
var flowCanvasPanning = false, flowPanStartX = 0, flowPanStartY = 0, flowPanStartOX = 0, flowPanStartOY = 0;

// Default flow template for demo
var FLOW_TEMPLATES = {
  default: {
    nodes: [
      { id:'n1', type:'input', title:'\u804A\u5929\u8F93\u5165', desc:'\u4ECEPlayground\u83B7\u53D6\u804A\u5929\u8F93\u5165\u3002', x:60, y:260,
        fields:[{label:'\u8F93\u5165\u6587\u672C',type:'textarea',value:''}],
        outLabel:'\u804A\u5929\u6D88\u606F' },
      { id:'n2', type:'agent', title:'\u9700\u6C42\u8BC6\u522B\u667A\u80FD\u4F53', desc:'\u7528\u4F5C\u6A21\u677F\u6765\u521B\u5EFA\u81EA\u5DF1\u7684\u7EC4\u4EF6\u3002', x:340, y:80,
        fields:[{label:'\u8F93\u5165\u503C',type:'input',value:'\u63A5\u6536\u8F93\u5165'}],
        outLabel:'\u8F93\u51FA' },
      { id:'n3', type:'llm', title:'\u706B\u5C71\u5F15\u64CE\u65B9\u821F\u5E73\u53F0', desc:'\u4F7F\u7528\u706B\u5C71\u5F15\u64CE\u65B9\u821F\u6A21\u578B\u751F\u6210\u6587\u672C\u3002', x:340, y:320,
        fields:[
          {label:'Input',type:'input',value:'\u63A5\u6536\u8F93\u5165'},
          {label:'System Message',type:'textarea',value:'\u5C06\u8F93\u5165\u8F6C\u5316\u4E3A\u7ED3\u6784\u5316\u6570\u636E'},
          {label:'\u6A21\u578B\u540D\u79F0',type:'select',options:['Doubao-Seed-1.6','Deepseek-V3','Deepseek-V3.1']},
        ],
        outLabel:'Model Response' },
      { id:'n4', type:'tool', title:'MCP\u5DE5\u5177', desc:'\u8FDE\u63A5\u5230MCP\u670D\u52A1\u5668\u4EE5\u4F7F\u7528\u5176\u5DE5\u5177\u3002', x:60, y:500,
        fields:[
          {label:'MCP\u670D\u52A1\u5668',type:'select',options:['\u56FE\u7EB8\u89E3\u6790\u670D\u52A1','\u77E5\u8BC6\u56FE\u8C31\u6784\u5EFA','CAD\u683C\u5F0F\u8F6C\u6362']},
          {label:'Actions',type:'tags',value:['TEXT_EXTRACT','CATPART_ANALYZE','GET_EQUATIONS']},
        ],
        outLabel:'Toolset' },
      { id:'n5', type:'agent', title:'\u6A21\u677F\u5339\u914D\u667A\u80FD\u4F53', desc:'\u7528\u4F5C\u6A21\u677F\u6765\u521B\u5EFA\u81EA\u5DF1\u7684\u7EC4\u4EF6\u3002', x:660, y:60,
        fields:[{label:'\u8F93\u5165\u503C',type:'input',value:'\u63A5\u6536\u8F93\u5165'}],
        outLabel:'\u8F93\u51FA' },
      { id:'n6', type:'agent', title:'\u667A\u80FD\u4F53', desc:'\u5B9A\u4E49\u667A\u80FD\u4F53\u7684\u6307\u4EE4\uFF0C\u7136\u540E\u8F93\u5165\u4EFB\u52A1\u4F7F\u7528\u5DE5\u5177\u5B8C\u6210\u3002', x:660, y:280,
        fields:[
          {label:'\u8BED\u8A00\u6A21\u578B',type:'select',options:['Doubao-Seed-1.6','Deepseek-V3']},
          {label:'\u667A\u80FD\u4F53\u6307\u4EE4',type:'textarea',value:'\u60A8\u662F\u4E00\u4F4D\u9AD8\u5EA6\u81EA\u4E3B\u4E14\u96C6\u6210\u5EA6\u6781\u9AD8\u2026'},
          {label:'Tools',type:'input',value:''},
        ],
        outLabel:'\u54CD\u5E94' },
      { id:'n7', type:'custom', title:'\u81EA\u5B9A\u4E49\u7EC4\u4EF6', desc:'\u7528\u4F5C\u6A21\u677F\u6765\u521B\u5EFA\u81EA\u5DF1\u7684\u7EC4\u4EF6\u3002', x:960, y:180,
        fields:[
          {label:'\u8F93\u5165\u503C',type:'input',value:'\u63A5\u6536\u8F93\u5165'},
          {label:'\u8F93\u5165\u503C',type:'input',value:'\u63A5\u6536\u8F93\u5165'},
        ],
        outLabel:'\u8F93\u51FA' },
      { id:'n8', type:'output', title:'\u804A\u5929\u8F93\u51FA', desc:'\u5411\u7528\u6237\u53D1\u9001\u6700\u7EC8\u54CD\u5E94\u3002', x:1200, y:220,
        fields:[], outLabel:'' },
    ],
    edges: [
      { from:'n1', to:'n2' },
      { from:'n1', to:'n3' },
      { from:'n4', to:'n3' },
      { from:'n2', to:'n5' },
      { from:'n3', to:'n6' },
      { from:'n5', to:'n7' },
      { from:'n6', to:'n7' },
      { from:'n7', to:'n8' },
    ]
  }
};

var MCP_SIDEBAR_ITEMS = [
  '\u56FE\u7EB8\u89E3\u6790\u670D\u52A1','\u77E5\u8BC6\u56FE\u8C31\u6784\u5EFA','CAD\u683C\u5F0F\u8F6C\u6362',
  '\u5DE5\u827A\u53C2\u6570\u63A8\u7406','\u6750\u6599\u6570\u636E\u5E93\u67E5\u8BE2','lf-test','lf-starter_project',
];

function showFlowEditor(agentIdx, flowName) {
  currentFlowAgentIdx = agentIdx;
  document.getElementById('agentList').style.display = 'none';
  document.getElementById('agentDetail').style.display = 'none';
  document.getElementById('agentFlowEditor').style.display = 'block';

  var agent = AGENTS[agentIdx];
  document.getElementById('flowBreadProject').textContent = agent.name;
  document.getElementById('flowEditorName').textContent = flowName;

  // Render sidebar
  var sbList = document.getElementById('flowSidebarList');
  while (sbList.firstChild) sbList.removeChild(sbList.firstChild);
  MCP_SIDEBAR_ITEMS.forEach(function(name) {
    var item = document.createElement('div');
    item.className = 'flow-sb-item';
    var icon = document.createElement('div');
    icon.className = 'flow-sb-icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>';
    var nameEl = document.createElement('span');
    nameEl.textContent = name;
    var dots = document.createElement('span');
    dots.className = 'flow-sb-dots';
    dots.textContent = '\u22EE';
    item.appendChild(icon);
    item.appendChild(nameEl);
    item.appendChild(dots);
    sbList.appendChild(item);
  });

  // Render flow
  renderFlowNodes();
}

function showAgentFlows() {
  document.getElementById('agentFlowEditor').style.display = 'none';
  document.getElementById('agentDetail').style.display = 'block';
}

function renderFlowNodes() {
  var flow = FLOW_TEMPLATES.default;
  var container = document.getElementById('flowNodesContainer');
  var svgEl = document.getElementById('flowLines');
  while (container.firstChild) container.removeChild(container.firstChild);
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  flowZoomLevel = 1; flowPanX = 0; flowPanY = 0;
  container.style.transform = '';
  svgEl.style.transform = '';

  var typeIcons = {
    input: '\uD83D\uDCAC', agent: '\u2699\uFE0F', llm: '\uD83E\uDDE0',
    tool: '\uD83D\uDD27', custom: '<>', output: '\uD83D\uDCAC'
  };

  // Create nodes
  flow.nodes.forEach(function(n) {
    var el = document.createElement('div');
    el.className = 'flow-node';
    el.setAttribute('data-type', n.type);
    el.setAttribute('data-id', n.id);
    el.style.left = n.x + 'px';
    el.style.top = n.y + 'px';

    // Header
    var header = document.createElement('div');
    header.className = 'flow-node-header';
    var iconEl = document.createElement('span');
    iconEl.className = 'flow-node-icon';
    iconEl.textContent = typeIcons[n.type] || '\u2699\uFE0F';
    var titleEl = document.createElement('span');
    titleEl.className = 'flow-node-title';
    titleEl.textContent = n.title;
    var runBtn = document.createElement('button');
    runBtn.className = 'flow-node-run';
    runBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21"/></svg>';
    header.appendChild(iconEl);
    header.appendChild(titleEl);
    header.appendChild(runBtn);
    el.appendChild(header);

    // Desc
    if (n.desc) {
      var desc = document.createElement('div');
      desc.className = 'flow-node-desc';
      desc.textContent = n.desc;
      el.appendChild(desc);
    }

    // Body with fields
    if (n.fields && n.fields.length > 0) {
      var body = document.createElement('div');
      body.className = 'flow-node-body';
      n.fields.forEach(function(f) {
        var fg = document.createElement('div');
        fg.className = 'flow-node-field';
        var lab = document.createElement('div');
        lab.className = 'flow-node-label';
        lab.textContent = f.label;
        fg.appendChild(lab);

        if (f.type === 'select') {
          var sel = document.createElement('select');
          sel.className = 'flow-node-select';
          f.options.forEach(function(o) {
            var opt = document.createElement('option');
            opt.textContent = o;
            sel.appendChild(opt);
          });
          fg.appendChild(sel);
        } else if (f.type === 'textarea') {
          var ta = document.createElement('input');
          ta.className = 'flow-node-input';
          ta.value = f.value;
          ta.placeholder = '\u8F93\u5165\u5185\u5BB9...';
          fg.appendChild(ta);
        } else if (f.type === 'tags') {
          var tagsDiv = document.createElement('div');
          tagsDiv.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;';
          f.value.forEach(function(t) {
            var tag = document.createElement('span');
            tag.style.cssText = 'font-size:0.68rem;padding:2px 6px;background:#f0f1f5;border-radius:3px;color:var(--text-secondary);font-family:var(--font-mono);';
            tag.textContent = t;
            tagsDiv.appendChild(tag);
          });
          fg.appendChild(tagsDiv);
        } else {
          var inp = document.createElement('input');
          inp.className = 'flow-node-input';
          inp.value = f.value;
          inp.placeholder = '\u63A5\u6536\u8F93\u5165';
          fg.appendChild(inp);
        }
        body.appendChild(fg);
      });
      el.appendChild(body);
    }

    // Footer
    if (n.outLabel) {
      var footer = document.createElement('div');
      footer.className = 'flow-node-footer';
      var outSpan = document.createElement('span');
      outSpan.textContent = n.outLabel;
      footer.appendChild(outSpan);
      el.appendChild(footer);
    }

    // Ports
    if (n.type !== 'input') {
      var portIn = document.createElement('div');
      portIn.className = 'flow-port in';
      el.appendChild(portIn);
    }
    if (n.type !== 'output') {
      var portOut = document.createElement('div');
      portOut.className = 'flow-port out';
      el.appendChild(portOut);
    }

    // Drag
    el.addEventListener('mousedown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      flowDragNode = el;
      flowDragStartX = e.clientX;
      flowDragStartY = e.clientY;
      flowNodeStartX = parseInt(el.style.left);
      flowNodeStartY = parseInt(el.style.top);
      el.classList.add('dragging');
    });

    container.appendChild(el);
  });

  // Draw connections
  drawFlowEdges();

  // Canvas panning
  var canvasEl = document.getElementById('flowCanvas');
  canvasEl.addEventListener('mousedown', function(e) {
    if (e.target === canvasEl || e.target === svgEl) {
      flowCanvasPanning = true;
      flowPanStartX = e.clientX;
      flowPanStartY = e.clientY;
      flowPanStartOX = flowPanX;
      flowPanStartOY = flowPanY;
    }
  });

  document.addEventListener('mousemove', function(e) {
    if (flowDragNode) {
      var dx = (e.clientX - flowDragStartX) / flowZoomLevel;
      var dy = (e.clientY - flowDragStartY) / flowZoomLevel;
      flowDragNode.style.left = (flowNodeStartX + dx) + 'px';
      flowDragNode.style.top = (flowNodeStartY + dy) + 'px';
      drawFlowEdges();
    }
    if (flowCanvasPanning) {
      flowPanX = flowPanStartOX + (e.clientX - flowPanStartX);
      flowPanY = flowPanStartOY + (e.clientY - flowPanStartY);
      applyFlowTransform();
    }
  });

  document.addEventListener('mouseup', function() {
    if (flowDragNode) {
      flowDragNode.classList.remove('dragging');
      flowDragNode = null;
    }
    flowCanvasPanning = false;
  });
}

function drawFlowEdges() {
  var flow = FLOW_TEMPLATES.default;
  var svgEl = document.getElementById('flowLines');
  while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

  flow.edges.forEach(function(edge) {
    var fromEl = document.querySelector('.flow-node[data-id="' + edge.from + '"]');
    var toEl = document.querySelector('.flow-node[data-id="' + edge.to + '"]');
    if (!fromEl || !toEl) return;

    var fromPort = fromEl.querySelector('.flow-port.out');
    var toPort = toEl.querySelector('.flow-port.in');
    if (!fromPort || !toPort) return;

    var fx = parseInt(fromEl.style.left) + fromEl.offsetWidth;
    var fy = parseInt(fromEl.style.top) + fromPort.offsetTop + 5;
    var tx = parseInt(toEl.style.left);
    var ty = parseInt(toEl.style.top) + toPort.offsetTop + 5;

    var cx = Math.abs(tx - fx) * 0.5;
    var d = 'M' + fx + ',' + fy + ' C' + (fx + cx) + ',' + fy + ' ' + (tx - cx) + ',' + ty + ' ' + tx + ',' + ty;

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#a5b4fc');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    svgEl.appendChild(path);
  });
}

function applyFlowTransform() {
  var container = document.getElementById('flowNodesContainer');
  var svgEl = document.getElementById('flowLines');
  var t = 'translate(' + flowPanX + 'px,' + flowPanY + 'px) scale(' + flowZoomLevel + ')';
  container.style.transform = t;
  container.style.transformOrigin = '0 0';
  svgEl.style.transform = t;
  svgEl.style.transformOrigin = '0 0';
}

function flowZoom(dir) {
  flowZoomLevel = Math.max(0.3, Math.min(2, flowZoomLevel + dir * 0.1));
  document.getElementById('flowZoomLabel').textContent = Math.round(flowZoomLevel * 100) + '%';
  applyFlowTransform();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MCP Modal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var mcpModalType = 'sse';

function openMcpModal(type) {
  mcpModalType = type;
  var titles = { json: 'JSON', stdio: 'STDIO', sse: 'SSE' };
  var descs = {
    json: '通过 JSON 配置文件添加 MCP 服务器。',
    stdio: '配置 STDIO 类型的 MCP 服务器（本地进程通信）。',
    sse: '配置可流式 HTTP/SSE 类型的 MCP 服务器。'
  };
  document.getElementById('mcpModalTitle').textContent = '添加 MCP 服务器 (' + titles[type] + ')';
  document.getElementById('mcpModalDesc').textContent = descs[type];

  var body = document.getElementById('mcpModalBody');
  while (body.firstChild) body.removeChild(body.firstChild);

  if (type === 'json') {
    body.appendChild(makeFormGroup('名称', 'mcpName', '名称', false));
    var tg = document.createElement('div');
    tg.className = 'form-group';
    var tl = document.createElement('label');
    tl.className = 'form-label';
    tl.textContent = 'JSON 配置';
    tl.innerHTML += '<span class="required">*</span>';
    var ta = document.createElement('textarea');
    ta.className = 'form-textarea';
    ta.placeholder = '{\n  "mcpServers": {\n    "server-name": {\n      "url": "http://...",\n      "type": "sse"\n    }\n  }\n}';
    tg.appendChild(tl);
    tg.appendChild(ta);
    body.appendChild(tg);
  } else if (type === 'stdio') {
    body.appendChild(makeFormGroup('名称', 'mcpName', '名称', false));
    body.appendChild(makeFormGroup('命令', 'mcpCmd', '例如: python3, node', true));
    body.appendChild(makeFormGroup('参数', 'mcpArgs', '例如: server.py --port 8080', false));
    body.appendChild(makeFormGroup('工作目录', 'mcpCwd', '/path/to/working/directory', false));
    body.appendChild(makeKVSection('环境变量'));
  } else {
    body.appendChild(makeFormGroup('名称', 'mcpName', '名称', false));
    body.appendChild(makeFormGroup('可流式 HTTP/SSE URL', 'mcpUrl', '可流式 HTTP/SSE URL', true));
    body.appendChild(makeKVSection('请求头'));
    body.appendChild(makeKVSection('环境变量'));
  }

  document.getElementById('mcpModal').classList.add('open');
}

function closeMcpModal() {
  document.getElementById('mcpModal').classList.remove('open');
}

function makeFormGroup(label, id, placeholder, required) {
  var g = document.createElement('div');
  g.className = 'form-group';
  var l = document.createElement('label');
  l.className = 'form-label';
  l.textContent = label;
  if (required) {
    var req = document.createElement('span');
    req.className = 'required';
    req.textContent = '*';
    l.appendChild(req);
  }
  var input = document.createElement('input');
  input.className = 'form-input';
  input.type = 'text';
  input.id = id;
  input.placeholder = placeholder;
  g.appendChild(l);
  g.appendChild(input);
  return g;
}

function makeKVSection(title) {
  var g = document.createElement('div');
  g.className = 'form-group';
  var l = document.createElement('label');
  l.className = 'form-label';
  l.textContent = title;
  g.appendChild(l);

  var container = document.createElement('div');
  container.className = 'kv-container';

  function addRow() {
    var row = document.createElement('div');
    row.className = 'kv-row';
    var k = document.createElement('input');
    k.className = 'form-input';
    k.type = 'text';
    k.placeholder = 'Type key...';
    var v = document.createElement('input');
    v.className = 'form-input';
    v.type = 'text';
    v.placeholder = 'Type a value...';
    var removeBtn = document.createElement('button');
    removeBtn.className = 'kv-icon-btn';
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';
    removeBtn.addEventListener('click', function() {
      row.parentElement.removeChild(row);
    });
    var addBtn = document.createElement('button');
    addBtn.className = 'kv-icon-btn';
    addBtn.type = 'button';
    addBtn.textContent = '+';
    addBtn.style.fontSize = '1.1rem';
    addBtn.addEventListener('click', function() { addRow(); });
    row.appendChild(k);
    row.appendChild(v);
    row.appendChild(removeBtn);
    row.appendChild(addBtn);
    container.appendChild(row);
  }

  addRow();
  g.appendChild(container);
  return g;
}

function submitMcpForm() {
  var nameInput = document.getElementById('mcpName');
  var name = nameInput ? nameInput.value.trim() : '';
  if (!name) name = '新服务 ' + (TOOLS.length + 1);

  var url = '';
  var urlInput = document.getElementById('mcpUrl');
  if (urlInput) url = urlInput.value.trim() || 'http://localhost:8000/sse';

  var typeMap = { json: 'JSON', stdio: 'STDIO', sse: 'SSE' };
  TOOLS.push({ name: name, url: url || 'stdio://' + name, type: typeMap[mcpModalType] });

  var grid = document.getElementById('toolsGrid');
  while (grid.firstChild) grid.removeChild(grid.firstChild);
  renderTools();
  closeMcpModal();
}

// Filter tabs click
document.querySelectorAll('.filter-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    this.parentElement.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
    this.classList.add('active');
  });
});

window.addEventListener('resize', function() {
  if (graphInitialized && document.getElementById('dtab-graph') && document.getElementById('dtab-graph').classList.contains('active')) {
    resizeCanvas(); draw();
  }
});

// Expose handlers used by inline onclick attributes
Object.assign(window, {
  navigate,
  showAgentList,
  showAgentFlows,
  flowZoom,
  openMcpModal,
  closeMcpModal,
  submitMcpForm,
  showFileList,
  graphZoom,
  graphFit,
  resetLayout,
  closeKcQaModal,
  kcQaNewChat,
  kcQaSend,
  showQaPage,
  hideQaPage,
  qaShowPreview,
  qaClosePreview,
  qaToggleFullscreen,
  toolFlowZoom,
  showToolNodeConfig,
  hideToolNodeConfig,
  resNavigateUp,
});
