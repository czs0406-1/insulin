
import { HistoryEvent, InsulinType } from './types';

export const INSULIN_HISTORY: HistoryEvent[] = [
  {
    year: '1921',
    title: '伟大的发现',
    description: '弗雷德里克·班廷与查尔斯·贝斯特在多伦多大学成功提取了胰岛素，开启了医学新纪元。这是人类历史上首次从动物胰腺中分离出有效的降糖物质。',
    image: ''
  },
  {
    year: '1922',
    title: '首位获救者',
    description: '14岁的莱昂纳德·汤普森成为世界上第一个接受胰岛素治疗的人，生命之火重燃。这一临床成功标志着糖尿病从“绝症”转变为“可控疾病”。',
    image: ''
  },
  {
    year: '1923',
    title: '诺贝尔奖',
    description: '班廷和麦克劳德因发现胰岛素被授予诺贝尔生理学或医学奖，表彰其对人类的杰出贡献。这是药学史上最具里程碑意义的时刻之一。',
    image: ''
  },
  {
    year: '1982',
    title: '基因工程时代',
    description: '首个重组人胰岛素获批，标志着生物技术药学的飞跃，实现了产量与纯度的质变，彻底摆脱了对动物提取的依赖。',
    image: ''
  }
];

export const INSULIN_TYPES: InsulinType[] = [
  {
    id: 'rapid',
    name: '超短效胰岛素',
    onset: '10-15 分',
    peak: '1-2 小时',
    duration: '3-5 小时',
    description: '犹如快马加鞭，常在餐前即刻使用，完美匹配餐后血糖上升。',
    color: 'bg-rose-500'
  },
  {
    id: 'regular',
    name: '短效胰岛素',
    onset: '30-60 分',
    peak: '2-4 小时',
    duration: '6-8 小时',
    description: '稳健的中坚力量，餐前30分钟的经典之选。',
    color: 'bg-amber-500'
  },
  {
    id: 'nph',
    name: '中效胰岛素',
    onset: '2-4 小时',
    peak: '4-10 小时',
    duration: '10-16 小时',
    description: '外观浑浊但作用持久，为人体提供平稳的基础保障。',
    color: 'bg-emerald-500'
  },
  {
    id: 'long',
    name: '长效胰岛素',
    onset: '1-2 小时',
    peak: '无明显峰值',
    duration: '24 小时+',
    description: '如静谧的流水，全天候守护血糖平衡，降低夜间低血糖风险。',
    color: 'bg-indigo-600'
  }
];

export const EXPERT_KNOWLEDGE = {
  categories: [
    { id: 'storage', name: '储存科学', icon: '❄️' },
    { id: 'usage', name: '临床使用', icon: '💉' },
    { id: 'safety', name: '紧急避险', icon: '⚠️' },
    { id: 'lifestyle', name: '生活方式', icon: '🏃' },
    { id: 'science', name: '药理科普', icon: '🧬' }
  ],
  faqs: [
    {
      cat: 'storage',
      question: "冷冻过后的胰岛素还能用吗？",
      answer: "【绝对禁止使用】。胰岛素是蛋白质类药物，一旦结冰，其蛋白质空间结构会被破坏，药效丧失且可能引起过敏反应。请务必保存在 2-8℃，切勿贴近冰箱内壁。",
      citation: "Source: 中国糖尿病药物注射指南"
    },
    {
      cat: 'storage',
      question: "夏天出门旅行，胰岛素怎么办？",
      answer: "应存放在专用的【胰岛素保温盒】中。避免放在汽车后备箱、行李箱中。在飞机上，请务必随身携带，不可托运，因为货舱气温过低可能导致冻结。",
      citation: "Source: 国际药学协会建议"
    },
    {
      cat: 'usage',
      question: "如果忘记注射了该怎么补救？",
      answer: "【视情况而定】。如果想起时离正常注射时间较近，可按原剂量补打；若离下次时间较近，切勿两剂量合用，以免发生严重低血糖。建议咨询主治医生调整。",
      citation: "Source: 临床药学手册"
    },
    {
      cat: 'usage',
      question: "为什么注射部位会出现硬块？",
      answer: "这是【皮下脂肪增生】。通常是因为在同一部位重复注射或重复使用针头导致的。应严格执行“四象限轮换法”，每次注射点距离上次至少1cm。",
      citation: "Source: 注射技术标准"
    },
    {
      cat: 'safety',
      question: "低血糖的“15法则”是什么？",
      answer: "发生低血糖时：1.立即吃15g快速糖（3-5块糖果或150ml果汁）；2.等待15分钟测量血糖；3.若未达标，再吃15g，直到恢复正常。",
      citation: "Source: ADA 诊疗标准"
    },
    {
      cat: 'safety',
      question: "不小心打多了剂量怎么办？",
      answer: "1. 立即监测血糖；2. 摄入适量碳水化合物（如面包、饼干）；3. 密切观察有无心慌、手抖等症状；4. 若剂量过大且血糖持续下降，必须【立即就医】。",
      citation: "Source: 急诊药学规程"
    },
    {
      cat: 'lifestyle',
      question: "使用胰岛素期间能喝酒吗？",
      answer: "【不建议】。酒精会抑制肝糖原输出，显著增加“迟发型低血糖”的风险。如果必须饮酒，请勿空腹，并务必加强血糖监测，且告知家人或朋友。",
      citation: "Source: 糖尿病患者教育手册"
    },
    {
      cat: 'lifestyle',
      question: "运动对胰岛素有影响吗？",
      answer: "有的。运动会增加肌肉对葡萄糖的利用。剧烈运动前后需调整剂量或补充碳水，防止运动诱发的低血糖。建议运动前咨询医生制定个性化方案。",
      citation: "Source: 运动医学指南"
    },
    {
      cat: 'science',
      question: "胰岛素可以口服吗？",
      answer: "目前主流胰岛素【不可口服】。因为胰岛素本质是蛋白质，会被胃部的消化酶彻底分解失去活性。全球药学家正在研发新型口服制剂，但尚未普及。",
      citation: "Source: 生物制药前沿评论"
    }
  ]
};

export const QUIZ_QUESTIONS = [
  {
    question: "胰岛素被发现于哪一年？",
    options: ["1911年", "1921年", "1931年", "1941年"],
    correct: 1,
    explanation: "1921年，班廷和贝斯特在多伦多大学成功提取了胰岛素。"
  },
  {
    question: "未开封的胰岛素理想保存温度是多少？",
    options: ["-20℃以下", "0℃以下", "2-8℃", "25℃常温"],
    correct: 2,
    explanation: "冷藏（2-8℃）可以保持蛋白质分子的稳定性。"
  },
  {
    question: "为了防止皮下硬结，注射时最应该注意？",
    options: ["加大剂量", "轮换注射部位", "快速按压", "停止用药"],
    correct: 1,
    explanation: "定期轮换注射部位（如腹部不同象限）能有效预防脂肪萎缩或硬结。"
  }
];
