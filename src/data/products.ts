import mazuGoldAmulet from '@/assets/products/mazu-gold-amulet.jpg';
import shunfengerKeychain from '@/assets/products/shunfenger-keychain.jpg';
import qianliyanKeychain from '@/assets/products/qianliyan-keychain.jpg';
import fortuneGoldenShovel from '@/assets/products/fortune-golden-shovel.jpg';
import peaceIncenseBag from '@/assets/products/peace-incense-bag.jpg';
import mazuCarPendant from '@/assets/products/mazu-car-pendant.jpg';
import fortuneRedEnvelope from '@/assets/products/fortune-red-envelope.jpg';
import blessingNotebook from '@/assets/products/blessing-notebook.jpg';
import incenseCandleSet from '@/assets/products/incense-candle-set.jpg';
import pilgrimageBadge from '@/assets/products/pilgrimage-badge.jpg';
import fuLuShouOrnament from '@/assets/products/fu-lu-shou-ornament.jpg';
import fortunePhoneStand from '@/assets/products/fortune-phone-stand.jpg';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tags: string[];
  oneLiner: string;
  bullets: string[];
  specs: {
    material: string;
    craft: string;
    size: string;
  };
  steps: string[];
  faq: { question: string; answer: string }[];
  image: string;
  category: 'carry' | 'gift' | 'home' | 'office';
  price: number;
  stock: number;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: '媽祖金箔護身符',
    slug: 'mazu-gold-amulet',
    tags: ['隨身', '開運', '熱門'],
    oneLiner: '鎮瀾宮開光加持，隨身守護平安',
    bullets: [
      '999純金箔封裝，永不褪色',
      '鎮瀾宮主殿開光，媽祖親臨加持',
      '防水防刮設計，可隨身攜帶'
    ],
    specs: {
      material: '999純金箔、航太級鋁合金外殼、防水樹脂封裝',
      craft: '傳統開光儀式、現代精密封裝工藝',
      size: '4.5cm × 2.8cm × 0.3cm'
    },
    steps: [
      '雙手合十，心誠則靈',
      '默念心願三次，感謝媽祖庇佑',
      '隨身攜帶或置於貼身處'
    ],
    faq: [
      { question: '需要過香爐嗎？', answer: '出廠已完成開光儀式，無需再過香爐，直接佩戴即可。' },
      { question: '可以送人嗎？', answer: '可以，護身符可轉贈給親友，祝福會一同傳遞。' },
      { question: '洗澡可以戴嗎？', answer: '採用防水封裝設計，日常洗澡、運動皆可佩戴。' },
      { question: '如何驗證真偽？', answer: '每件商品附有專屬序號，可至官網驗證頁查詢。' }
    ],
    image: mazuGoldAmulet,
    category: 'carry',
    price: 1880,
    stock: 50,
    inStock: true
  },
  {
    id: '2',
    name: '順風耳鑰匙圈',
    slug: 'shunfenger-keychain',
    tags: ['隨身', '送禮', '千里眼'],
    oneLiner: '聽見四方福音，引領事業順遂',
    bullets: [
      '精緻立體雕刻，細節栩栩如生',
      '霧金電鍍工藝，質感超群',
      '結實耐用，日常使用不褪色'
    ],
    specs: {
      material: '鋅合金本體、24K霧金電鍍、不鏽鋼扣環',
      craft: '3D立體精雕、多層電鍍工藝',
      size: '5cm × 3cm × 0.8cm'
    },
    steps: [
      '輕撫順風耳，專注聆聽內心',
      '許下事業或學業心願',
      '掛於隨身鑰匙或包包'
    ],
    faq: [
      { question: '與千里眼有什麼不同？', answer: '順風耳主聽覺靈敏、人際溝通；千里眼主視野開闊、洞察先機。可搭配收藏。' },
      { question: '會不會很重？', answer: '整體約25g，輕巧適中不累贅。' },
      { question: '可以當吊飾嗎？', answer: '可以，附有牢固扣環，可掛於包包、後視鏡等處。' },
      { question: '如何保養？', answer: '避免碰撞刮傷，可用軟布輕拭保持光澤。' }
    ],
    image: shunfengerKeychain,
    category: 'carry',
    price: 680,
    stock: 120,
    inStock: true
  },
  {
    id: '3',
    name: '千里眼鑰匙圈',
    slug: 'qianliyan-keychain',
    tags: ['隨身', '送禮', '順風耳'],
    oneLiner: '洞察先機遠見，事業一路長紅',
    bullets: [
      '精緻立體雕刻，神韻生動',
      '霧金電鍍工藝，典雅大方',
      '耐用設計，長久陪伴'
    ],
    specs: {
      material: '鋅合金本體、24K霧金電鍍、不鏽鋼扣環',
      craft: '3D立體精雕、多層電鍍工藝',
      size: '5cm × 3cm × 0.8cm'
    },
    steps: [
      '手握千里眼，靜心凝視前方',
      '許下遠見或投資相關心願',
      '隨身攜帶，時刻提醒自己放眼未來'
    ],
    faq: [
      { question: '與順風耳搭配有加乘效果嗎？', answer: '傳統信仰中兩尊為媽祖護法，成對收藏象徵耳聰目明、全方位守護。' },
      { question: '電鍍會脫落嗎？', answer: '採用多層電鍍工藝，正常使用不易脫落。' },
      { question: '有保固嗎？', answer: '提供一年非人為損壞保固。' },
      { question: '可以刻字嗎？', answer: '目前版本不提供刻字服務，未來可能推出客製版。' }
    ],
    image: qianliyanKeychain,
    category: 'carry',
    price: 680,
    stock: 120,
    inStock: true
  },
  {
    id: '4',
    name: '財庫開運金鏟',
    slug: 'fortune-golden-shovel',
    tags: ['居家', '開運', '招財'],
    oneLiner: '鏟進財富，守住財庫不漏財',
    bullets: [
      '迷你精緻金鏟，招財寓意滿滿',
      '開光加持，財運亨通',
      '可放錢包或辦公桌招財'
    ],
    specs: {
      material: '黃銅鍍24K金、實木底座',
      craft: '手工打磨、開光加持',
      size: '鏟身8cm × 2cm、底座6cm × 4cm'
    },
    steps: [
      '選擇財位或辦公桌擺放',
      '每月初一十五擦拭保養',
      '心誠祈願，財源滾滾來'
    ],
    faq: [
      { question: '要放在哪裡最好？', answer: '建議放在家中財位、辦公桌左前方或收銀台附近。' },
      { question: '可以放錢包裡嗎？', answer: '可以，迷你尺寸適合放入錢包夾層，隨身招財。' },
      { question: '需要定期開光嗎？', answer: '出廠已開光，平時保持清潔即可，農曆新年可回廟過香爐。' },
      { question: '送長輩適合嗎？', answer: '非常適合，祝福財運亨通是最好的心意。' }
    ],
    image: fortuneGoldenShovel,
    category: 'home',
    price: 1280,
    stock: 80,
    inStock: true
  },
  {
    id: '5',
    name: '平安香火袋',
    slug: 'peace-incense-bag',
    tags: ['隨身', '平安', '傳統'],
    oneLiner: '鎮瀾宮香火，平安伴左右',
    bullets: [
      '內含鎮瀾宮正統香灰',
      '手工刺繡精緻工藝',
      '傳統祈福，現代質感'
    ],
    specs: {
      material: '絲綢布料、鎮瀾宮香灰、棉線刺繡',
      craft: '手工刺繡、傳統香火封裝',
      size: '6cm × 4cm'
    },
    steps: [
      '隨身攜帶或掛於身上',
      '每日出門前輕觸香火袋',
      '心存善念，平安自來'
    ],
    faq: [
      { question: '香火會不會過期？', answer: '香火經過特殊處理封裝，可長久保存。' },
      { question: '可以打開看嗎？', answer: '建議不要打開，以保持香火的完整與靈力。' },
      { question: '小朋友可以戴嗎？', answer: '可以，特別適合保佑孩童平安健康。' },
      { question: '有不同顏色嗎？', answer: '目前提供紅色（平安）與金色（招財）兩款。' }
    ],
    image: peaceIncenseBag,
    category: 'carry',
    price: 580,
    stock: 200,
    inStock: true
  },
  {
    id: '6',
    name: '媽祖賜福車掛',
    slug: 'mazu-car-pendant',
    tags: ['隨身', '行車', '平安'],
    oneLiner: '行車平安，媽祖隨行守護',
    bullets: [
      '精緻車用吊飾設計',
      '開光加持護行車',
      '高質感不晃動設計'
    ],
    specs: {
      material: '水晶內芯、金屬外框、高強度掛繩',
      craft: '雷射雕刻、開光加持',
      size: '主體4cm × 4cm、總長15cm'
    },
    steps: [
      '掛於後視鏡或車內適當位置',
      '發車前默念平安',
      '保持安全駕駛，媽祖庇佑'
    ],
    faq: [
      { question: '會不會影響行車視線？', answer: '設計輕巧，不會遮擋視線，且採防晃動設計。' },
      { question: '可以掛機車嗎？', answer: '可以，但建議避免長期日曬雨淋。' },
      { question: '掛繩斷了可以換嗎？', answer: '提供備用掛繩，也可回購更換。' },
      { question: '有夜光功能嗎？', answer: '部分款式有夜光設計，可在商品規格確認。' }
    ],
    image: mazuCarPendant,
    category: 'carry',
    price: 980,
    stock: 90,
    inStock: true
  },
  {
    id: '7',
    name: '開運紅包袋組',
    slug: 'fortune-red-envelope',
    tags: ['送禮', '節慶', '招財'],
    oneLiner: '鎮瀾宮聯名紅包，福氣滿滿',
    bullets: [
      '精美燙金印刷設計',
      '六入一組多款圖案',
      '送禮自用兩相宜'
    ],
    specs: {
      material: '120g高級卡紙、燙金工藝',
      craft: '燙金印刷、壓紋處理',
      size: '9cm × 17cm（標準紅包尺寸）'
    },
    steps: [
      '選擇適合金額的紅包款式',
      '裝入現金或禮券',
      '雙手奉上，祝福滿滿'
    ],
    faq: [
      { question: '一組有幾個？', answer: '一組六入，包含三種不同設計款式。' },
      { question: '可以放支票嗎？', answer: '尺寸為標準紅包大小，可放入一般支票。' },
      { question: '有企業訂製服務嗎？', answer: '50組以上可洽詢客製化印製服務。' },
      { question: '平常可以用嗎？', answer: '當然可以，任何需要送紅包的場合都適用。' }
    ],
    image: fortuneRedEnvelope,
    category: 'gift',
    price: 380,
    stock: 300,
    inStock: true
  },
  {
    id: '8',
    name: '祈福筆記本',
    slug: 'blessing-notebook',
    tags: ['辦公', '文創', '送禮'],
    oneLiner: '每一筆都是祈願，寫下美好未來',
    bullets: [
      '封面燙金媽祖圖騰',
      '內頁附祈福小語',
      '質感裝幀送禮大方'
    ],
    specs: {
      material: '硬殼精裝、80g道林紙內頁',
      craft: '燙金封面、穿線裝幀',
      size: 'A5（14.8cm × 21cm）、192頁'
    },
    steps: [
      '翻開第一頁寫下年度心願',
      '每日記錄感恩與祈願',
      '年末回顧，感謝媽祖庇佑'
    ],
    faq: [
      { question: '內頁是空白還是橫線？', answer: '採用淡灰格線設計，書寫整齊又不失自由度。' },
      { question: '紙質會透墨嗎？', answer: '使用80g高品質道林紙，鋼筆書寫也不透墨。' },
      { question: '有其他尺寸嗎？', answer: '目前僅提供A5尺寸，攜帶方便。' },
      { question: '可以刻字嗎？', answer: '封面可加購燙金刻字服務。' }
    ],
    image: blessingNotebook,
    category: 'office',
    price: 680,
    stock: 150,
    inStock: true
  },
  {
    id: '9',
    name: '香火蠟燭禮盒',
    slug: 'incense-candle-set',
    tags: ['居家', '送禮', '儀式'],
    oneLiner: '點亮心願，香氛沉澱心靈',
    bullets: [
      '天然大豆蠟無煙配方',
      '融入鎮瀾宮香火元素',
      '精美禮盒包裝'
    ],
    specs: {
      material: '天然大豆蠟、棉芯、精油香氛',
      craft: '手工澆注、香火祝福',
      size: '蠟燭直徑7cm × 高8cm、禮盒20cm × 10cm × 10cm'
    },
    steps: [
      '選擇安靜時刻點燃',
      '閉眼深呼吸，感受香氣',
      '心中默念祈願，讓願望隨煙裊裊上達'
    ],
    faq: [
      { question: '可以燃燒多久？', answer: '約可燃燒40小時，建議每次燃燒不超過4小時。' },
      { question: '香味是什麼？', answer: '調配專屬「鎮瀾香」，帶有淡雅檀香與花香。' },
      { question: '有過敏成分嗎？', answer: '採用天然成分，但仍建議敏感體質先小範圍測試。' },
      { question: '禮盒包裝好看嗎？', answer: '採用質感燙金禮盒，送禮非常體面。' }
    ],
    image: incenseCandleSet,
    category: 'gift',
    price: 1580,
    stock: 60,
    inStock: true
  },
  {
    id: '10',
    name: '遶境紀念徽章',
    slug: 'pilgrimage-badge',
    tags: ['隨身', '收藏', '遶境'],
    oneLiner: '遶境精神隨身帶，信仰永誌不忘',
    bullets: [
      '年度遶境限定設計',
      '精緻琺瑯彩工藝',
      '可別於衣物或收藏'
    ],
    specs: {
      material: '銅合金底材、琺瑯彩填充',
      craft: '琺瑯填色、電鍍拋光',
      size: '3cm × 3cm'
    },
    steps: [
      '別於胸前或帽子上',
      '參與遶境時配戴更添儀式感',
      '收藏紀念這份信仰'
    ],
    faq: [
      { question: '每年設計都不同嗎？', answer: '是的，每年遶境推出限定款，具有收藏價值。' },
      { question: '別針會刺傷衣服嗎？', answer: '採用安全別針設計，不易損傷布料。' },
      { question: '可以買往年款嗎？', answer: '視庫存情況，部分往年款可能售罄。' },
      { question: '有收藏盒嗎？', answer: '附贈精美收藏小盒，方便保存。' }
    ],
    image: pilgrimageBadge,
    category: 'carry',
    price: 480,
    stock: 180,
    inStock: true
  },
  {
    id: '11',
    name: '福祿壽擺飾組',
    slug: 'fu-lu-shou-ornament',
    tags: ['居家', '送禮', '祝壽'],
    oneLiner: '福祿壽三全，圓滿人生祈願',
    bullets: [
      '三尊一組完整祝福',
      '細緻手工彩繪',
      '送長輩最佳選擇'
    ],
    specs: {
      material: '高密度樹脂、環保彩繪漆',
      craft: '手工彩繪、開光加持',
      size: '每尊高約12cm'
    },
    steps: [
      '擇吉日擺放於客廳或神桌',
      '福居中、祿在左、壽在右',
      '定期擦拭保持潔淨'
    ],
    faq: [
      { question: '擺放位置有講究嗎？', answer: '建議擺放高處、面向大門，避免放在臥室或廁所旁。' },
      { question: '可以只買單尊嗎？', answer: '建議成組購買以獲得完整祝福，暫不提供單尊販售。' },
      { question: '樹脂材質耐用嗎？', answer: '高密度樹脂非常耐用，但請避免摔落。' },
      { question: '顏色會褪嗎？', answer: '使用環保耐光漆，正常室內擺放不易褪色。' }
    ],
    image: fuLuShouOrnament,
    category: 'home',
    price: 2880,
    stock: 40,
    inStock: true
  },
  {
    id: '12',
    name: '開運手機支架',
    slug: 'fortune-phone-stand',
    tags: ['辦公', '實用', '開運'],
    oneLiner: '辦公開運，事業步步高升',
    bullets: [
      '精緻金屬設計',
      '穩固支撐各尺寸手機',
      '開光加持辦公好運'
    ],
    specs: {
      material: '鋅合金、防滑矽膠墊',
      craft: '金屬壓鑄、霧金電鍍',
      size: '10cm × 8cm × 8cm'
    },
    steps: [
      '放置於辦公桌左手邊',
      '每日開工前輕觸支架',
      '保持正向心態，好運自來'
    ],
    faq: [
      { question: '平板可以用嗎？', answer: '10吋以下平板皆可穩固支撐。' },
      { question: '角度可以調整嗎？', answer: '提供兩段式角度調整，適合不同使用情境。' },
      { question: '底部會刮桌面嗎？', answer: '底部配有防滑矽膠墊，不會刮傷桌面。' },
      { question: '送同事適合嗎？', answer: '非常適合，實用又帶有祝福寓意。' }
    ],
    image: fortunePhoneStand,
    category: 'office',
    price: 880,
    stock: 100,
    inStock: true
  }
];

export const categories = [
  { id: 'all', label: '全部' },
  { id: 'carry', label: '隨身' },
  { id: 'gift', label: '送禮' },
  { id: 'home', label: '居家' },
  { id: 'office', label: '辦公' }
];
