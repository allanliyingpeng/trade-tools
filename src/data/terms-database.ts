export interface TradeTerm {
  id: string
  term: string
  abbreviation?: string
  englishTerm: string
  category: string
  subCategory?: string
  definition: string
  englishDefinition: string
  examples: string[]
  relatedTerms: string[]
  importance: 'high' | 'medium' | 'low'
  tags: string[]
  references?: string[]
  notes?: string
  version?: string // 如 "Incoterms 2020"
}

export const tradeTermsData: TradeTerm[] = [
  // Incoterms 2020 - 最重要的11个术语
  {
    id: 'exw',
    term: '工厂交货',
    abbreviation: 'EXW',
    englishTerm: 'Ex Works',
    category: 'incoterms',
    subCategory: 'e_group',
    definition: '卖方在其所在地或其他指定的地点（如工厂、仓库等）将货物交给买方处置时，即完成交货。卖方不办理出口清关手续，也不将货物装上任何运输工具。',
    englishDefinition: 'The seller delivers when it places the goods at the disposal of the buyer at the seller\'s premises or at another named place. The seller does not need to load the goods on any collecting vehicle, nor does it need to clear the goods for export.',
    examples: [
      'EXW 上海工厂（Incoterms 2020）',
      '买方需承担从卖方所在地提取货物的一切费用和风险',
      '卖方责任最小的贸易术语'
    ],
    relatedTerms: ['FCA', 'DAP', 'DDP'],
    importance: 'high',
    tags: ['Incoterms 2020', 'E组', '起始点交货', '最小责任'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'fca',
    term: '货交承运人',
    abbreviation: 'FCA',
    englishTerm: 'Free Carrier',
    category: 'incoterms',
    subCategory: 'f_group',
    definition: '卖方在指定的地点将货物交给买方指定的承运人或其他人，或由卖方选择的承运人或其他人。',
    englishDefinition: 'The seller delivers the goods to the carrier or another person nominated by the buyer at the seller\'s premises or another named place.',
    examples: [
      'FCA 上海港（Incoterms 2020）',
      'FCA 仓库地址（Incoterms 2020）',
      '适用于任何运输方式'
    ],
    relatedTerms: ['EXW', 'CPT', 'FOB'],
    importance: 'high',
    tags: ['Incoterms 2020', 'F组', '承运人交货', '多式联运'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'cpt',
    term: '运费付至',
    abbreviation: 'CPT',
    englishTerm: 'Carriage Paid To',
    category: 'incoterms',
    subCategory: 'c_group',
    definition: '卖方向其指定的承运人交货，但卖方还必须支付将货物运至目的地的运费。买方承担交货之后的一切风险和其他费用。',
    englishDefinition: 'The seller delivers the goods to the carrier or another person nominated by the seller at an agreed place and that the seller must contract for and pay the costs of carriage necessary to bring the goods to the named place of destination.',
    examples: [
      'CPT 纽约（Incoterms 2020）',
      '卖方支付运费但风险在交货时转移',
      '适用于任何运输方式'
    ],
    relatedTerms: ['CIP', 'CFR', 'CIF'],
    importance: 'high',
    tags: ['Incoterms 2020', 'C组', '运费付至', '多式联运'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'cip',
    term: '运费、保险费付至',
    abbreviation: 'CIP',
    englishTerm: 'Carriage and Insurance Paid To',
    category: 'incoterms',
    subCategory: 'c_group',
    definition: '卖方向其指定的承运人交货，但卖方还必须支付将货物运至目的地的运费，并办理买方在运输途中灭失或损坏货物风险的保险。',
    englishDefinition: 'The seller delivers the goods to the carrier or another person nominated by the seller at an agreed place and that the seller must contract for and pay the costs of carriage and insurance necessary to bring the goods to the named place of destination.',
    examples: [
      'CIP 纽约（Incoterms 2020）',
      '卖方必须投保至少相当于货物价值110%的保险',
      'Institute Cargo Clauses (A) 或类似条款'
    ],
    relatedTerms: ['CPT', 'CIF', 'DDP'],
    importance: 'high',
    tags: ['Incoterms 2020', 'C组', '保险', '多式联运'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'dap',
    term: '目的地交货',
    abbreviation: 'DAP',
    englishTerm: 'Delivered at Place',
    category: 'incoterms',
    subCategory: 'd_group',
    definition: '卖方在指定的目的地交货，货物在到达的运输工具上交给买方处置，卖方承担将货物运至指定地点的一切风险。',
    englishDefinition: 'The seller delivers when the goods are placed at the disposal of the buyer on the arriving means of transport ready for unloading at the named place of destination.',
    examples: [
      'DAP 买方仓库，纽约（Incoterms 2020）',
      '卖方承担运输风险但不负责卸货',
      '不包括进口清关费用'
    ],
    relatedTerms: ['DPU', 'DDP', 'CPT'],
    importance: 'high',
    tags: ['Incoterms 2020', 'D组', '目的地交货', '卖方风险'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'dpu',
    term: '目的地卸货交货',
    abbreviation: 'DPU',
    englishTerm: 'Delivered at Place Unloaded',
    category: 'incoterms',
    subCategory: 'd_group',
    definition: '卖方在指定的目的地卸货后交货。卖方承担将货物运至指定地点并卸货的一切风险和费用。',
    englishDefinition: 'The seller delivers when the goods, once unloaded from the arriving means of transport, are placed at the disposal of the buyer at a named place of destination.',
    examples: [
      'DPU 买方仓库，纽约（Incoterms 2020）',
      '卖方负责卸货但不负责进口清关',
      '取代了DAT术语'
    ],
    relatedTerms: ['DAP', 'DDP', 'DAT'],
    importance: 'medium',
    tags: ['Incoterms 2020', 'D组', '卸货交货', '新增术语'],
    references: ['ICC Incoterms 2020'],
    notes: '在Incoterms 2020中取代了DAT',
    version: 'Incoterms 2020'
  },
  {
    id: 'ddp',
    term: '完税后交货',
    abbreviation: 'DDP',
    englishTerm: 'Delivered Duty Paid',
    category: 'incoterms',
    subCategory: 'd_group',
    definition: '卖方在指定的目的地，办理完进口清关手续，将在交货运输工具上尚未卸下的货物交与买方，完成交货。',
    englishDefinition: 'The seller delivers the goods when the goods are placed at the disposal of the buyer, cleared for import on the arriving means of transport ready for unloading at the named place of destination.',
    examples: [
      'DDP 买方仓库，纽约（Incoterms 2020）',
      '卖方承担最大责任和费用',
      '包括进口关税和税费'
    ],
    relatedTerms: ['DAP', 'DPU', 'EXW'],
    importance: 'high',
    tags: ['Incoterms 2020', 'D组', '完税交货', '最大责任'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'fas',
    term: '船边交货',
    abbreviation: 'FAS',
    englishTerm: 'Free Alongside Ship',
    category: 'incoterms',
    subCategory: 'f_group',
    definition: '卖方在指定的装运港将货物交到船边，即完成交货。买方必须承担自那时起货物灭失或损坏的一切风险。',
    englishDefinition: 'The seller delivers when the goods are placed alongside the vessel nominated by the buyer at the named port of shipment.',
    examples: [
      'FAS 上海港（Incoterms 2020）',
      '仅适用于海运和内河运输',
      '卖方负责出口清关'
    ],
    relatedTerms: ['FOB', 'CFR', 'CIF'],
    importance: 'medium',
    tags: ['Incoterms 2020', 'F组', '海运专用', '船边交货'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'fob',
    term: '装运港船上交货',
    abbreviation: 'FOB',
    englishTerm: 'Free on Board',
    category: 'incoterms',
    subCategory: 'f_group',
    definition: '卖方在指定的装运港将货物交到买方指定的船上，即完成交货。买方必须承担自那时起货物灭失或损坏的一切风险。',
    englishDefinition: 'The seller delivers the goods on board the vessel nominated by the buyer at the named port of shipment or procures the goods already so delivered.',
    examples: [
      'FOB 上海港（Incoterms 2020）',
      '仅适用于海运和内河运输',
      '传统且常用的海运术语'
    ],
    relatedTerms: ['FAS', 'CFR', 'CIF'],
    importance: 'high',
    tags: ['Incoterms 2020', 'F组', '海运专用', '船上交货'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'cfr',
    term: '成本加运费',
    abbreviation: 'CFR',
    englishTerm: 'Cost and Freight',
    category: 'incoterms',
    subCategory: 'c_group',
    definition: '卖方向承运人交货并支付将货物运至指定目的港所需的费用。买方承担货物交到承运人之后的风险。',
    englishDefinition: 'The seller delivers the goods on board the vessel or procures the goods already so delivered and must pay the costs and freight necessary to bring the goods to the named port of destination.',
    examples: [
      'CFR 纽约港（Incoterms 2020）',
      '仅适用于海运和内河运输',
      '不包括保险费用'
    ],
    relatedTerms: ['CIF', 'FOB', 'CPT'],
    importance: 'high',
    tags: ['Incoterms 2020', 'C组', '海运专用', '成本运费'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },
  {
    id: 'cif',
    term: '成本、保险费加运费',
    abbreviation: 'CIF',
    englishTerm: 'Cost, Insurance and Freight',
    category: 'incoterms',
    subCategory: 'c_group',
    definition: '卖方向承运人交货并支付将货物运至指定目的港所需的费用，还要办理买方在运输途中货物风险的保险。',
    englishDefinition: 'The seller delivers the goods on board the vessel or procures the goods already so delivered, pays the costs and freight necessary to bring the goods to the named port of destination and procures marine insurance against the buyer\'s risk.',
    examples: [
      'CIF 纽约港（Incoterms 2020）',
      '仅适用于海运和内河运输',
      '最常用的海运术语之一'
    ],
    relatedTerms: ['CFR', 'CIP', 'FOB'],
    importance: 'high',
    tags: ['Incoterms 2020', 'C组', '海运专用', '保险'],
    references: ['ICC Incoterms 2020'],
    version: 'Incoterms 2020'
  },

  // 支付条款
  {
    id: 'lc',
    term: '信用证',
    abbreviation: 'L/C',
    englishTerm: 'Letter of Credit',
    category: 'payment',
    subCategory: 'documentary_credit',
    definition: '银行根据进口商的申请和指示，向出口商开立的有条件的付款承诺。银行保证在出口商提交符合信用证条款的单据时付款。',
    englishDefinition: 'A conditional undertaking by a bank to pay the exporter, given by the bank at the request of the importer. The bank undertakes to pay against presentation of stipulated documents provided all terms and conditions of the credit are complied with.',
    examples: [
      '不可撤销即期信用证',
      '延期付款信用证',
      '承兑信用证'
    ],
    relatedTerms: ['D/P', 'D/A', 'T/T', 'SWIFT'],
    importance: 'high',
    tags: ['支付方式', '银行保证', '单据贸易', '风险控制'],
    references: ['UCP 600', 'ISP98']
  },
  {
    id: 'tt',
    term: '电汇',
    abbreviation: 'T/T',
    englishTerm: 'Telegraphic Transfer',
    category: 'payment',
    subCategory: 'remittance',
    definition: '银行通过电传、电报或SWIFT系统将款项汇至另一银行的汇款方式。是国际贸易中最常用的付款方式之一。',
    englishDefinition: 'A method of electronic funds transfer from one bank to another through the SWIFT network. It is one of the most common payment methods in international trade.',
    examples: [
      'T/T 30% 预付，70% 见提单副本付款',
      'T/T in advance（预付电汇）',
      'T/T at sight（即期电汇）'
    ],
    relatedTerms: ['L/C', 'D/P', 'SWIFT', 'Wire Transfer'],
    importance: 'high',
    tags: ['支付方式', '银行汇款', '预付款', '快速付款'],
    references: ['SWIFT MT103']
  },
  {
    id: 'dp',
    term: '付款交单',
    abbreviation: 'D/P',
    englishTerm: 'Documents against Payment',
    category: 'payment',
    subCategory: 'collection',
    definition: '出口商通过银行向进口商提示单据，进口商付款后才能取得单据的贸易结算方式。',
    englishDefinition: 'A method of payment where documents are released to the importer only upon payment of the amount due.',
    examples: [
      'D/P at sight（即期付款交单）',
      'D/P 30 days after sight（见单后30天付款交单）',
      '通过托收银行办理'
    ],
    relatedTerms: ['D/A', 'L/C', '托收', 'Collection'],
    importance: 'high',
    tags: ['支付方式', '单据控制', '托收', '中等风险'],
    references: ['URC 522']
  },
  {
    id: 'da',
    term: '承兑交单',
    abbreviation: 'D/A',
    englishTerm: 'Documents against Acceptance',
    category: 'payment',
    subCategory: 'collection',
    definition: '出口商通过银行向进口商提示单据，进口商承兑汇票后即可取得单据，到期时再付款的贸易结算方式。',
    englishDefinition: 'A method of payment where documents are released to the importer upon acceptance of a draft, with payment due at maturity.',
    examples: [
      'D/A 60 days after sight',
      'D/A 90 days after date',
      '买方承兑后取得单据'
    ],
    relatedTerms: ['D/P', '汇票', 'Bill of Exchange', 'Acceptance'],
    importance: 'medium',
    tags: ['支付方式', '延期付款', '汇票', '较高风险'],
    references: ['URC 522']
  },

  // 运输单据
  {
    id: 'bl',
    term: '海运提单',
    abbreviation: 'B/L',
    englishTerm: 'Bill of Lading',
    category: 'documents',
    subCategory: 'transport_documents',
    definition: '船公司或其代理人签发的货物收据，同时也是物权凭证和运输合同的证明。是海运中最重要的单据之一。',
    englishDefinition: 'A document issued by a carrier or its agent acknowledging receipt of cargo for shipment. It serves as a receipt, a contract of carriage, and a document of title.',
    examples: [
      '正本提单（Original B/L）',
      '电放提单（Telex Release）',
      '记名提单（Straight B/L）'
    ],
    relatedTerms: ['AWB', 'Sea Waybill', 'FCR', 'Shipping'],
    importance: 'high',
    tags: ['运输单据', '物权凭证', '海运', '提货凭证'],
    references: ['Hague-Visby Rules', 'Hamburg Rules']
  },
  {
    id: 'awb',
    term: '空运单',
    abbreviation: 'AWB',
    englishTerm: 'Air Waybill',
    category: 'documents',
    subCategory: 'transport_documents',
    definition: '航空货运代理或航空公司签发的货物收据和运输合同证明，但不是物权凭证。',
    englishDefinition: 'A document issued by an airline or its agent as a receipt for cargo and evidence of the contract of carriage, but it is not a document of title.',
    examples: [
      'MAWB（主运单）',
      'HAWB（分运单）',
      '航空公司运单'
    ],
    relatedTerms: ['B/L', 'Air Cargo', 'MAWB', 'HAWB'],
    importance: 'high',
    tags: ['运输单据', '空运', '货运收据', '非物权凭证'],
    references: ['Warsaw Convention', 'Montreal Convention']
  },

  // 保险条款
  {
    id: 'icc_a',
    term: '协会货物条款A',
    abbreviation: 'ICC(A)',
    englishTerm: 'Institute Cargo Clauses (A)',
    category: 'insurance',
    subCategory: 'cargo_clauses',
    definition: '承保范围最广的海上货物保险条款，采用"一切险"方式，除明确除外的风险外，承保所有意外损失。',
    englishDefinition: 'The broadest marine cargo insurance clause providing "all risks" coverage except for specifically excluded perils.',
    examples: [
      '承保一切意外损失',
      '除外责任较少',
      '保险费较高'
    ],
    relatedTerms: ['ICC(B)', 'ICC(C)', 'Marine Insurance', 'All Risks'],
    importance: 'high',
    tags: ['保险', '一切险', '海上保险', '最广承保'],
    references: ['Institute of London Underwriters']
  },

  // 质量标准
  {
    id: 'iso9001',
    term: 'ISO 9001质量管理体系',
    abbreviation: 'ISO 9001',
    englishTerm: 'ISO 9001 Quality Management System',
    category: 'quality',
    subCategory: 'management_systems',
    definition: '国际标准化组织制定的质量管理体系标准，规定了质量管理体系的要求，适用于各种类型和规模的组织。',
    englishDefinition: 'An international standard for quality management systems that specifies requirements for a quality management system applicable to any organization.',
    examples: [
      'ISO 9001:2015版本',
      '质量管理体系认证',
      '持续改进要求'
    ],
    relatedTerms: ['ISO 14001', 'CE Mark', 'Quality Control', 'QMS'],
    importance: 'high',
    tags: ['质量标准', '管理体系', '国际认证', 'ISO'],
    references: ['ISO 9001:2015']
  },

  // 海关清关
  {
    id: 'co',
    term: '原产地证书',
    abbreviation: 'C/O',
    englishTerm: 'Certificate of Origin',
    category: 'customs',
    subCategory: 'certificates',
    definition: '证明货物原产地或制造地的文件，用于确定货物的关税待遇和贸易政策措施。',
    englishDefinition: 'A document certifying the country of origin or manufacture of goods, used to determine tariff treatment and trade policy measures.',
    examples: [
      '一般原产地证书（C/O）',
      '普惠制原产地证书（Form A）',
      '区域贸易协定原产地证书'
    ],
    relatedTerms: ['Form A', 'GSP', 'FTA', 'Rules of Origin'],
    importance: 'high',
    tags: ['原产地', '关税优惠', '海关单据', '贸易协定'],
    references: ['WTO Agreement on Rules of Origin']
  },

  // 包装标识
  {
    id: 'dangerous_goods',
    term: '危险品标识',
    abbreviation: 'DG',
    englishTerm: 'Dangerous Goods Labels',
    category: 'shipping',
    subCategory: 'packaging',
    definition: '用于标识危险货物类别和性质的标准化标签和标记，确保运输安全。',
    englishDefinition: 'Standardized labels and markings used to identify the class and nature of dangerous goods to ensure safe transportation.',
    examples: [
      '第1类：爆炸品',
      '第3类：易燃液体',
      '第8类：腐蚀性物质'
    ],
    relatedTerms: ['IMDG Code', 'UN Number', 'MSDS', 'Hazmat'],
    importance: 'medium',
    tags: ['危险品', '运输安全', '包装标识', '国际规则'],
    references: ['IMDG Code', 'ADR', 'IATA DGR']
  },

  // 贸易金融
  {
    id: 'factoring',
    term: '保理',
    abbreviation: '',
    englishTerm: 'Factoring',
    category: 'finance',
    subCategory: 'trade_finance',
    definition: '指供应商将其应收账款转让给保理商，由保理商提供贸易融资、销售分户账管理、应收账款催收等服务的综合性金融服务。',
    englishDefinition: 'A financial service where a supplier assigns its receivables to a factor, who provides trade financing, sales ledger management, and debt collection services.',
    examples: [
      '无追索权保理',
      '有追索权保理',
      '国际保理'
    ],
    relatedTerms: ['Invoice Discounting', 'Trade Finance', 'Receivables', 'FCI'],
    importance: 'medium',
    tags: ['贸易金融', '应收账款', '融资服务', '风险转移'],
    references: ['FCI General Rules']
  },

  // 电子商务
  {
    id: 'edi',
    term: '电子数据交换',
    abbreviation: 'EDI',
    englishTerm: 'Electronic Data Interchange',
    category: 'documents',
    subCategory: 'electronic',
    definition: '计算机与计算机之间按照约定的标准格式自动进行商务单据和数据交换的电子化手段。',
    englishDefinition: 'The electronic exchange of business documents and data between computer systems using standardized formats.',
    examples: [
      'UN/EDIFACT标准',
      '采购订单EDI',
      '发票EDI传输'
    ],
    relatedTerms: ['UN/EDIFACT', 'XML', 'Electronic Commerce', 'Paperless Trading'],
    importance: 'medium',
    tags: ['电子贸易', '数据交换', '标准化', '无纸化'],
    references: ['UN/EDIFACT Standards']
  }
]

// 术语分类配置
export const termCategories = [
  {
    code: 'all',
    name: '全部',
    nameEn: 'All',
    icon: '📚',
    count: 0
  },
  {
    code: 'incoterms',
    name: 'Incoterms 2020',
    nameEn: 'Incoterms 2020',
    icon: '🚢',
    description: '国际贸易术语解释通则',
    count: 0
  },
  {
    code: 'payment',
    name: '付款条件',
    nameEn: 'Payment Terms',
    icon: '💳',
    description: '支付方式和结算条款',
    count: 0
  },
  {
    code: 'documents',
    name: '贸易单据',
    nameEn: 'Trade Documents',
    icon: '📄',
    description: '运输和商业单据',
    count: 0
  },
  {
    code: 'shipping',
    name: '运输条款',
    nameEn: 'Shipping Terms',
    icon: '🚛',
    description: '运输方式和条件',
    count: 0
  },
  {
    code: 'insurance',
    name: '保险条款',
    nameEn: 'Insurance Terms',
    icon: '🛡️',
    description: '保险条件和责任',
    count: 0
  },
  {
    code: 'customs',
    name: '海关清关',
    nameEn: 'Customs Clearance',
    icon: '🏛️',
    description: '通关手续和单据',
    count: 0
  },
  {
    code: 'quality',
    name: '质量标准',
    nameEn: 'Quality Standards',
    icon: '✅',
    description: '质量认证和标准',
    count: 0
  },
  {
    code: 'finance',
    name: '贸易金融',
    nameEn: 'Trade Finance',
    icon: '🏦',
    description: '融资和金融工具',
    count: 0
  }
]

// 计算每个分类的术语数量
termCategories.forEach(category => {
  if (category.code === 'all') {
    category.count = tradeTermsData.length
  } else {
    category.count = tradeTermsData.filter(term => term.category === category.code).length
  }
})

// 热门术语
export const popularTerms = [
  'FOB', 'CIF', 'EXW', 'L/C', 'T/T', 'D/P', 'D/A', 'B/L', 'AWB', 'C/O'
]

// 搜索功能
export function searchTerms(
  query: string,
  options: {
    category?: string,
    language?: 'zh' | 'en' | 'both'
  } = {}
): TradeTerm[] {
  const { category, language = 'both' } = options
  const normalizedQuery = query.toLowerCase().trim()

  if (!normalizedQuery) {
    return category && category !== 'all'
      ? tradeTermsData.filter(term => term.category === category)
      : tradeTermsData
  }

  return tradeTermsData.filter(term => {
    // 分类过滤
    if (category && category !== 'all' && term.category !== category) {
      return false
    }

    // 搜索匹配
    const searchFields = [
      term.term,
      term.abbreviation || '',
      term.englishTerm,
      term.definition,
      term.englishDefinition,
      ...term.tags,
      ...term.relatedTerms
    ].join(' ').toLowerCase()

    return searchFields.includes(normalizedQuery)
  })
}

// 根据ID获取术语
export function getTermById(id: string): TradeTerm | undefined {
  return tradeTermsData.find(term => term.id === id)
}

// 获取相关术语
export function getRelatedTerms(termId: string): TradeTerm[] {
  const term = getTermById(termId)
  if (!term) return []

  return term.relatedTerms
    .map(relatedId => getTermById(relatedId.toLowerCase().replace(/[^a-z0-9]/g, '')))
    .filter((relatedTerm): relatedTerm is TradeTerm => relatedTerm !== undefined)
    .slice(0, 5)
}

// 根据分类获取术语
export function getTermsByCategory(categoryCode: string): TradeTerm[] {
  if (categoryCode === 'all') return tradeTermsData
  return tradeTermsData.filter(term => term.category === categoryCode)
}

// 兼容性导出
export const termsDatabase = tradeTermsData