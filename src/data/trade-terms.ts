export type TradeTermCategory = 'incoterms' | 'payment' | 'document' | 'logistics'

export interface TradeTerm {
  id: string
  code: string
  name_en: string
  name_zh: string
  category: TradeTermCategory
  description_en: string
  description_zh: string
  responsibilities_en?: string[]
  responsibilities_zh?: string[]
}

export const tradeTerms: TradeTerm[] = [
  // Incoterms 2020
  {
    id: 'exw',
    code: 'EXW',
    name_en: 'Ex Works',
    name_zh: '工厂交货',
    category: 'incoterms',
    description_en: 'The seller makes the goods available at their premises. The buyer bears all costs and risks from that point.',
    description_zh: '卖方在其所在地或其他指定地点（如工场、工厂或仓库）将货物交给买方处置时，即履行了交货义务。买方承担从该点起的全部费用和风险。',
    responsibilities_en: [
      'Make goods available at named place',
      'Provide commercial invoice',
      'Provide packaging suitable for transport',
      'Notify buyer when goods are ready'
    ],
    responsibilities_zh: [
      '在指定地点交付货物',
      '提供商业发票',
      '提供适合运输的包装',
      '货物准备好时通知买方'
    ]
  },
  {
    id: 'fca',
    code: 'FCA',
    name_en: 'Free Carrier',
    name_zh: '货交承运人',
    category: 'incoterms',
    description_en: 'The seller delivers goods to a carrier nominated by the buyer at a named place.',
    description_zh: '卖方将货物交给买方指定的承运人或其他人，或由卖方选择承运人将货物交给该承运人。',
    responsibilities_en: [
      'Deliver goods to carrier at named place',
      'Clear goods for export',
      'Provide commercial invoice and documentation',
      'Provide proof of delivery'
    ],
    responsibilities_zh: [
      '在指定地点将货物交给承运人',
      '办理出口清关手续',
      '提供商业发票和相关文件',
      '提供交货凭证'
    ]
  },
  {
    id: 'cpt',
    code: 'CPT',
    name_en: 'Carriage Paid To',
    name_zh: '运费付至',
    category: 'incoterms',
    description_en: 'The seller pays for the carriage of goods to the named destination.',
    description_zh: '卖方向指定目的地的承运人交付货物，并支付将货物运至目的地的运费。',
    responsibilities_en: [
      'Pay carriage costs to named destination',
      'Clear goods for export',
      'Deliver goods to carrier',
      'Provide transport document'
    ],
    responsibilities_zh: [
      '支付到指定目的地的运费',
      '办理出口清关手续',
      '将货物交给承运人',
      '提供运输单据'
    ]
  },
  {
    id: 'cip',
    code: 'CIP',
    name_en: 'Carriage and Insurance Paid To',
    name_zh: '运费及保险费付至',
    category: 'incoterms',
    description_en: 'Same as CPT but seller also procures and pays for insurance.',
    description_zh: '与CPT相同，但卖方还需购买并支付保险费。',
    responsibilities_en: [
      'Pay carriage and insurance costs',
      'Clear goods for export',
      'Provide insurance cover',
      'Provide transport and insurance documents'
    ],
    responsibilities_zh: [
      '支付运费和保险费',
      '办理出口清关手续',
      '提供保险保障',
      '提供运输和保险单据'
    ]
  },
  {
    id: 'dap',
    code: 'DAP',
    name_en: 'Delivered at Place',
    name_zh: '目的地交货',
    category: 'incoterms',
    description_en: 'The seller delivers when goods are placed at the disposal of the buyer on the arriving means of transport ready for unloading at the named place of destination.',
    description_zh: '卖方在指定目的地，将到达的运输工具上准备卸货的货物交给买方处置时，即完成交货。',
    responsibilities_en: [
      'Deliver goods to named place of destination',
      'Bear all costs until delivery',
      'Clear goods for export',
      'Provide all transport documents'
    ],
    responsibilities_zh: [
      '在指定目的地交付货物',
      '承担交货前的所有费用',
      '办理出口清关手续',
      '提供所有运输单据'
    ]
  },
  {
    id: 'dpu',
    code: 'DPU',
    name_en: 'Delivered at Place Unloaded',
    name_zh: '卸货港交货',
    category: 'incoterms',
    description_en: 'The seller delivers when goods are unloaded from the arriving means of transport and placed at the disposal of the buyer at a named place of destination.',
    description_zh: '卖方在指定目的地将货物从到达的运输工具上卸下并交给买方处置时，即完成交货。',
    responsibilities_en: [
      'Unload goods at named place',
      'Bear all costs including unloading',
      'Clear goods for export',
      'Provide proof of delivery'
    ],
    responsibilities_zh: [
      '在指定地点卸货',
      '承担包括卸货在内的所有费用',
      '办理出口清关手续',
      '提供交货凭证'
    ]
  },
  {
    id: 'ddp',
    code: 'DDP',
    name_en: 'Delivered Duty Paid',
    name_zh: '完税后交货',
    category: 'incoterms',
    description_en: 'The seller delivers goods when they are placed at the disposal of the buyer, cleared for import on the arriving means of transport, ready for unloading at the named place of destination.',
    description_zh: '卖方在指定目的地，办理完进口清关手续，将在交货运输工具上尚未卸下的货物交给买方，完成交货。',
    responsibilities_en: [
      'Clear goods for import',
      'Pay all duties and taxes',
      'Bear all costs to destination',
      'Provide all documents for import'
    ],
    responsibilities_zh: [
      '办理进口清关手续',
      '支付所有关税和税费',
      '承担到目的地的所有费用',
      '提供进口所需的所有文件'
    ]
  },
  {
    id: 'fas',
    code: 'FAS',
    name_en: 'Free Alongside Ship',
    name_zh: '船边交货',
    category: 'incoterms',
    description_en: 'The seller delivers when goods are placed alongside the vessel at the named port of shipment.',
    description_zh: '卖方在指定装运港将货物交到船边时，即完成交货。',
    responsibilities_en: [
      'Deliver goods alongside ship',
      'Clear goods for export',
      'Bear costs until goods alongside ship',
      'Provide delivery notice'
    ],
    responsibilities_zh: [
      '将货物交到船边',
      '办理出口清关手续',
      '承担货物到船边的费用',
      '提供交货通知'
    ]
  },
  {
    id: 'fob',
    code: 'FOB',
    name_en: 'Free on Board',
    name_zh: '船上交货',
    category: 'incoterms',
    description_en: 'The seller delivers goods on board the vessel nominated by the buyer at the named port of shipment.',
    description_zh: '卖方在指定装运港将货物装上买方指定的船舶时，即完成交货。',
    responsibilities_en: [
      'Load goods on board vessel',
      'Clear goods for export',
      'Bear costs until goods on board',
      'Provide bill of lading or shipping receipt'
    ],
    responsibilities_zh: [
      '将货物装上船舶',
      '办理出口清关手续',
      '承担货物装船前的费用',
      '提供提单或装船收据'
    ]
  },
  {
    id: 'cfr',
    code: 'CFR',
    name_en: 'Cost and Freight',
    name_zh: '成本加运费',
    category: 'incoterms',
    description_en: 'The seller pays the costs and freight to bring goods to the port of destination.',
    description_zh: '卖方支付将货物运至指定目的港所需的费用和运费。',
    responsibilities_en: [
      'Pay costs and freight to destination port',
      'Load goods on board vessel',
      'Clear goods for export',
      'Provide bill of lading'
    ],
    responsibilities_zh: [
      '支付到目的港的费用和运费',
      '将货物装上船舶',
      '办理出口清关手续',
      '提供提单'
    ]
  },
  {
    id: 'cif',
    code: 'CIF',
    name_en: 'Cost, Insurance and Freight',
    name_zh: '成本、保险费加运费',
    category: 'incoterms',
    description_en: 'Same as CFR but seller also procures and pays for marine insurance.',
    description_zh: '与CFR相同，但卖方还需购买并支付海运保险。',
    responsibilities_en: [
      'Pay costs, insurance and freight',
      'Load goods on board vessel',
      'Provide marine insurance',
      'Provide bill of lading and insurance policy'
    ],
    responsibilities_zh: [
      '支付成本、保险费和运费',
      '将货物装上船舶',
      '提供海运保险',
      '提供提单和保险单'
    ]
  },

  // 支付方式 Payment Terms
  {
    id: 'lc',
    code: 'L/C',
    name_en: 'Letter of Credit',
    name_zh: '信用证',
    category: 'payment',
    description_en: 'A financial document issued by a bank guaranteeing payment to the seller, provided the terms and conditions are met.',
    description_zh: '银行开出的一种金融文件，保证在满足条款和条件的情况下向卖方付款。',
    responsibilities_en: [
      'Buyer applies for L/C at bank',
      'Bank issues L/C to seller',
      'Seller ships goods and presents documents',
      'Bank pays upon document compliance'
    ],
    responsibilities_zh: [
      '买方在银行申请开立信用证',
      '银行向卖方开出信用证',
      '卖方发货并提交单据',
      '银行审单无误后付款'
    ]
  },
  {
    id: 'tt',
    code: 'T/T',
    name_en: 'Telegraphic Transfer',
    name_zh: '电汇',
    category: 'payment',
    description_en: 'Electronic transfer of funds from buyer to seller\'s bank account.',
    description_zh: '买方通过银行电子转账方式将资金转入卖方银行账户。',
    responsibilities_en: [
      'Buyer initiates wire transfer',
      'Funds transferred electronically',
      'Quick and secure payment method',
      'Common for advance payments'
    ],
    responsibilities_zh: [
      '买方发起电汇转账',
      '资金通过电子方式转移',
      '快速安全的付款方式',
      '常用于预付款'
    ]
  },
  {
    id: 'dp',
    code: 'D/P',
    name_en: 'Documents against Payment',
    name_zh: '付款交单',
    category: 'payment',
    description_en: 'The exporter instructs the bank to release shipping documents only when the buyer pays.',
    description_zh: '出口商指示银行只有在买方付款后才能交出装运单据。',
    responsibilities_en: [
      'Seller ships goods and sends documents to bank',
      'Bank presents documents to buyer',
      'Buyer pays to receive documents',
      'Payment releases title documents'
    ],
    responsibilities_zh: [
      '卖方发货并将单据送交银行',
      '银行向买方提示单据',
      '买方付款后获得单据',
      '付款后获得货权单据'
    ]
  },
  {
    id: 'da',
    code: 'D/A',
    name_en: 'Documents against Acceptance',
    name_zh: '承兑交单',
    category: 'payment',
    description_en: 'Documents are released against buyer\'s acceptance of a time draft, payment due at maturity.',
    description_zh: '凭买方承兑远期汇票交付单据，到期日付款。',
    responsibilities_en: [
      'Seller presents time draft and documents',
      'Buyer accepts draft to receive documents',
      'Payment due at draft maturity',
      'Risk of non-payment at maturity'
    ],
    responsibilities_zh: [
      '卖方提示远期汇票和单据',
      '买方承兑汇票后获得单据',
      '汇票到期日付款',
      '存在到期不付款风险'
    ]
  },
  {
    id: 'oa',
    code: 'O/A',
    name_en: 'Open Account',
    name_zh: '赊销',
    category: 'payment',
    description_en: 'Goods are shipped and delivered before payment is due, based on trust between parties.',
    description_zh: '基于双方信任关系，先发货后付款的贸易方式。',
    responsibilities_en: [
      'Seller ships goods on credit terms',
      'Buyer receives goods before payment',
      'Payment due on agreed terms',
      'Requires strong buyer credit rating'
    ],
    responsibilities_zh: [
      '卖方按信用条件发货',
      '买方先收货后付款',
      '按约定条件付款',
      '需要买方有良好信用评级'
    ]
  },

  // 单证术语 Document Terms
  {
    id: 'bl',
    code: 'B/L',
    name_en: 'Bill of Lading',
    name_zh: '提单',
    category: 'document',
    description_en: 'A document issued by a carrier acknowledging receipt of goods and promising delivery to the consignee.',
    description_zh: '承运人签发的货物收据，承诺将货物交付给收货人的单据。',
    responsibilities_en: [
      'Evidence of contract of carriage',
      'Receipt for goods shipped',
      'Document of title to goods',
      'Required for cargo release'
    ],
    responsibilities_zh: [
      '运输合同的证明',
      '货物装运收据',
      '货物所有权凭证',
      '提货必需单据'
    ]
  },
  {
    id: 'awb',
    code: 'AWB',
    name_en: 'Air Waybill',
    name_zh: '空运单',
    category: 'document',
    description_en: 'Transport document for air freight, serving as receipt and contract of carriage.',
    description_zh: '空运货物的运输单据，作为收据和运输合同。',
    responsibilities_en: [
      'Contract between shipper and airline',
      'Receipt for goods accepted',
      'Instructions for cargo handling',
      'Not negotiable document'
    ],
    responsibilities_zh: [
      '托运人与航空公司的合同',
      '货物接收收据',
      '货物处理指示',
      '不可转让单据'
    ]
  },
  {
    id: 'co',
    code: 'C/O',
    name_en: 'Certificate of Origin',
    name_zh: '原产地证明',
    category: 'document',
    description_en: 'Document certifying the country where goods were manufactured or produced.',
    description_zh: '证明货物制造或生产国别的文件。',
    responsibilities_en: [
      'Certifies country of origin',
      'Required for customs clearance',
      'May qualify for preferential tariffs',
      'Issued by authorized body'
    ],
    responsibilities_zh: [
      '证明货物原产国',
      '清关必需文件',
      '可享受优惠关税',
      '由授权机构签发'
    ]
  },
  {
    id: 'fa',
    code: 'F/A',
    name_en: 'Freight Account',
    name_zh: '运费账单',
    category: 'document',
    description_en: 'Statement of freight charges for transportation services.',
    description_zh: '运输服务费用的账单明细。',
    responsibilities_en: [
      'Details of freight charges',
      'Breakdown of transport costs',
      'Basis for freight payment',
      'Required for cost accounting'
    ],
    responsibilities_zh: [
      '运费详细收费',
      '运输成本明细',
      '运费支付依据',
      '成本核算需要'
    ]
  },
  {
    id: 'pl',
    code: 'P/L',
    name_en: 'Packing List',
    name_zh: '装箱单',
    category: 'document',
    description_en: 'Detailed list of goods packed in each container or package.',
    description_zh: '每个集装箱或包装内货物的详细清单。',
    responsibilities_en: [
      'Lists contents of each package',
      'Shows quantity and description',
      'Assists customs inspection',
      'Required for cargo handling'
    ],
    responsibilities_zh: [
      '列出各包装内容',
      '显示数量和描述',
      '协助海关检查',
      '货物处理必需'
    ]
  },
  {
    id: 'ci',
    code: 'C/I',
    name_en: 'Commercial Invoice',
    name_zh: '商业发票',
    category: 'document',
    description_en: 'Bill for goods from seller to buyer, showing transaction details.',
    description_zh: '卖方向买方开具的货物账单，显示交易详情。',
    responsibilities_en: [
      'Shows goods sold and prices',
      'Required for customs clearance',
      'Basis for duty calculation',
      'Proof of transaction'
    ],
    responsibilities_zh: [
      '显示销售货物和价格',
      '清关必需文件',
      '关税计算依据',
      '交易证明'
    ]
  },

  // 物流术语 Logistics Terms
  {
    id: 'fcl',
    code: 'FCL',
    name_en: 'Full Container Load',
    name_zh: '整箱货',
    category: 'logistics',
    description_en: 'Shipment that fills an entire container, used by one shipper.',
    description_zh: '一个托运人独用一个集装箱的货物装运方式。',
    responsibilities_en: [
      'One shipper uses entire container',
      'More cost-effective for large shipments',
      'Direct loading and unloading',
      'Better cargo security'
    ],
    responsibilities_zh: [
      '一个托运人使用整个集装箱',
      '大货量更经济',
      '直接装卸',
      '货物安全性更好'
    ]
  },
  {
    id: 'lcl',
    code: 'LCL',
    name_en: 'Less than Container Load',
    name_zh: '拼箱货',
    category: 'logistics',
    description_en: 'Shipment that shares container space with other shippers.',
    description_zh: '与其他托运人共享集装箱空间的货物装运方式。',
    responsibilities_en: [
      'Shares container with other cargo',
      'Cost-effective for small shipments',
      'Requires consolidation service',
      'Longer transit times'
    ],
    responsibilities_zh: [
      '与其他货物共享集装箱',
      '小货量经济实惠',
      '需要拼箱服务',
      '运输时间较长'
    ]
  },
  {
    id: 'teu',
    code: 'TEU',
    name_en: 'Twenty-foot Equivalent Unit',
    name_zh: '20英尺标准箱',
    category: 'logistics',
    description_en: 'Standard unit for measuring container ship capacity, based on 20-foot container.',
    description_zh: '以20英尺集装箱为基准的集装箱船运力计量单位。',
    responsibilities_en: [
      'Standard container measurement unit',
      'Used for port and ship capacity',
      '20 feet long container',
      'Industry standard metric'
    ],
    responsibilities_zh: [
      '标准集装箱计量单位',
      '用于港口和船舶运力',
      '20英尺长的集装箱',
      '行业标准度量'
    ]
  },
  {
    id: 'feu',
    code: 'FEU',
    name_en: 'Forty-foot Equivalent Unit',
    name_zh: '40英尺标准箱',
    category: 'logistics',
    description_en: 'Container measurement unit based on 40-foot container, equals 2 TEU.',
    description_zh: '以40英尺集装箱为基准的计量单位，等于2个TEU。',
    responsibilities_en: [
      'Equals two TEU units',
      '40 feet long container',
      'Higher capacity than TEU',
      'Common for dry cargo'
    ],
    responsibilities_zh: [
      '等于两个TEU单位',
      '40英尺长的集装箱',
      '比TEU容量更大',
      '干货运输常用'
    ]
  },
  {
    id: 'cy',
    code: 'CY',
    name_en: 'Container Yard',
    name_zh: '集装箱堆场',
    category: 'logistics',
    description_en: 'Designated area in port for storing and handling containers.',
    description_zh: '港口内指定的集装箱存储和操作区域。',
    responsibilities_en: [
      'Container storage facility',
      'Loading and unloading area',
      'Pre-customs inspection zone',
      'Managed by port authority'
    ],
    responsibilities_zh: [
      '集装箱存储设施',
      '装卸作业区域',
      '海关前检查区',
      '港务局管理'
    ]
  },
  {
    id: 'cfs',
    code: 'CFS',
    name_en: 'Container Freight Station',
    name_zh: '集装箱货运站',
    category: 'logistics',
    description_en: 'Facility where LCL cargo is consolidated into or stripped from containers.',
    description_zh: '拼箱货物装箱和拆箱的设施。',
    responsibilities_en: [
      'LCL cargo consolidation point',
      'Container stuffing and stripping',
      'Cargo sorting and storage',
      'Documentation processing'
    ],
    responsibilities_zh: [
      '拼箱货集拼点',
      '集装箱装箱拆箱',
      '货物分拣存储',
      '单证处理'
    ]
  }
]

export const categoryLabels: Record<TradeTermCategory, { en: string; zh: string }> = {
  incoterms: { en: 'Trade Terms', zh: '贸易术语' },
  payment: { en: 'Payment Terms', zh: '支付方式' },
  document: { en: 'Document Terms', zh: '单证术语' },
  logistics: { en: 'Logistics Terms', zh: '物流术语' }
}

export const getCategoryCount = (category: TradeTermCategory): number => {
  return tradeTerms.filter(term => term.category === category).length
}

export const getAllCategories = (): TradeTermCategory[] => {
  return ['incoterms', 'payment', 'document', 'logistics']
}