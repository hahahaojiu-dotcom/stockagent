// ══════════════════════════════════════════════
// news.js — 热点追踪模块
// 包含：新闻渲染、后端API拉取、本地静态备用数据
//        经济数据日历、热点筛选、GitHub Trending
//        刷新逻辑
// 修改这里：新闻来源、静态备用数据、日历事件
// ══════════════════════════════════════════════
// ══ NEWS ══
// ── 渲染新闻列表（支持两种数据格式：后端API格式 和 本地静态格式）
function renderList(items, id) {
  const el = document.getElementById(id); if(!el) return;
  if(!items||!items.length){
    el.innerHTML='<div style="padding:14px;text-align:center;color:var(--text3);font-size:11px">暂无数据</div>';
    return;
  }
  el.innerHTML = items.map((it,i) => {
    // 兼容后端API格式（title字段）和本地静态格式（text字段）
    const title = it.title || it.text || '';
    const url = it.url || '';
    const time = it.published || it.fetched_at || it.time || null;
    const src = it.src || '';
    const href = url ? `href="${url}" target="_blank" rel="noopener"` : '';
    return `<a class="nr" ${href}>
      <div class="nn ${nc(i)}">${i+1}</div>
      <div class="nrc">
        <div class="nrt">${title}</div>
        <div class="nrf">${ft(time)}${url?`<span class="et">↗ 原文</span>`:''}${src?`<span style="color:var(--accent);font-size:8px">${src}</span>`:''}</div>
      </div>
      ${it.change!=null?`<span class="nrch ${it.change>=0?'up':'dn'}">${it.change>=0?'+':''}${it.change}%</span>`:''}
    </a>`;
  }).join('');
}

// ── 后端API地址
const BACKEND = 'https://api.mktdesk.app';

// ── 从后端拉取新闻并渲染（带本地缓存兜底）
async function loadNewsFromAPI(source, listId, timeId, limit=50) {
  const el = document.getElementById(listId);
  const te = document.getElementById(timeId);
  if(!el) return;
  // 显示加载中
  el.innerHTML = '<div class="skel"></div><div class="skel" style="width:80%"></div>';
  try {
    const data = await cachedFetch(`${BACKEND}/api/news/${source}?limit=${limit}`, 120000);
    const items = data.data || [];
    if(items.length > 0) {
      renderList(items, listId);
      if(te) te.textContent = nowS();
    } else {
      // 后端没数据时用本地静态备用数据
      if(ND[source]) renderList(ND[source], listId);
      if(te) te.textContent = '备用数据';
    }
  } catch(e) {
    // 请求失败时用本地静态备用数据
    if(ND[source]) renderList(ND[source], listId);
    if(te) te.textContent = '离线模式';
  }
}

// ══ NEWS DATA ══
const ND = {
  cls:[
    {text:'【财联社电报】特朗普政府势将暂停实施琼斯法以抑制油价上涨',time:rT(2,8),url:'https://www.cls.cn/telegraph'},
    {text:'欧洲水泥股下挫 欧盟据悉拟放宽碳规则',time:rT(8,20),url:'https://www.cls.cn/telegraph'},
    {text:'两部门印发示范文本推动合同节水管理健康有序发展',time:rT(20,35),url:'https://www.cls.cn/telegraph'},
    {text:'财联社电，纳斯达克100指数跌幅扩大至1.5%',time:rT(35,50),url:'https://www.cls.cn/telegraph'},
    {text:'【电报】中东地缘冲突威胁全球9%电解铝产能，利用率逼近99%',time:rT(50,80),url:'https://www.cls.cn/telegraph'},
    {text:'欧盟考虑放宽碳减额规则并扩大国家援助以遏制电价上涨',time:rT(80,120),url:'https://www.cls.cn/telegraph'},
    {text:'财联社电，美上周EIA天然气库存减少380亿立方英尺',time:rT(120,180),url:'https://www.cls.cn/telegraph'},
    {text:'国际油价短线拉升 涨幅扩大至10%',time:rT(180,240),url:'https://www.cls.cn/telegraph'},
    {text:'A股三大指数午后拉升，沪指涨幅扩大至0.8%',time:rT(240,360),url:'https://www.cls.cn/telegraph'},
    {text:'北向资金今日净流入超15亿元，科技板块获大幅加仓',time:rT(360,480),url:'https://www.cls.cn/telegraph'},
  ],
  hwj:[
    {text:'中东股市收盘播报｜本周沙特阿美累涨约3.8%',time:rT(3,10),url:'https://wallstreetcn.com/articles/live'},
    {text:'意大利银行业监管警告橡树资本旗下银行救援计划存在风险',time:rT(10,25),url:'https://wallstreetcn.com/articles/live'},
    {text:'报道：特朗普政府拟暂停《琼斯法案》从而实现平抑油价',time:rT(25,45),url:'https://wallstreetcn.com/articles/live'},
    {text:'欧洲科技初创企业从未见过如此大规模的融资潮',time:rT(45,70),url:'https://wallstreetcn.com/articles/live'},
    {text:'CFTC针对预测市场发布指导意见和先行制度',time:rT(70,110),url:'https://wallstreetcn.com/articles/live'},
    {text:'标普500跌幅扩大至1.3%，道指下跌675点，跌幅超1.4%',time:rT(110,160),url:'https://wallstreetcn.com/articles/live'},
    {text:'美联储官员：需要看到更多降通胀证据才会行动',time:rT(160,240),url:'https://wallstreetcn.com/articles/live'},
    {text:'黄金突破$4750，创历史新高',time:rT(240,360),url:'https://wallstreetcn.com/articles/live'},
  ],
  '36k':[
    {text:'Meta与CoreWeave达成210亿美元合作协议，AI算力军备竞赛升级',time:rT(4,12),url:'https://36kr.com/newsflashes'},
    {text:'热门中概股美股盘前多数下跌，理想汽车跌超3%',time:rT(12,28),url:'https://36kr.com/newsflashes'},
    {text:'帝尔激光：拟发行H股并在港交所主板上市',time:rT(28,50),url:'https://36kr.com/newsflashes'},
    {text:'腾讯推出OpenClaw安全工具箱',time:rT(50,80),url:'https://36kr.com/newsflashes'},
    {text:'微软、Meta推动数据中心租赁市场激增7000亿美元',time:rT(80,130),url:'https://36kr.com/newsflashes'},
    {text:'宝马智驾放弃L3级自动驾驶',time:rT(130,200),url:'https://36kr.com/newsflashes'},
    {text:'华为盘古大模型5.0发布，多项指标超越GPT-4o',time:rT(200,360),url:'https://36kr.com/newsflashes'},
    {text:'字节跳动豆包日活破亿，AI应用市场格局初定',time:rT(360,480),url:'https://36kr.com/newsflashes'},
  ],
  js:[
    {text:'🇺🇸 美联储官员：通胀数据仍在高位，降息时机尚不成熟',time:rT(5,15),url:'https://jin10.com'},
    {text:'🇺🇸 美国3月非农就业数据超预期，失业率维持4.1%',time:rT(15,40),url:'https://jin10.com'},
    {text:'🇺🇸 美国3月CPI同比下降0.1%，通胀降温加速',time:rT(40,80),url:'https://jin10.com'},
    {text:'🇺🇸 美国PPI生产者物价指数：上游价格压力持续',time:rT(80,130),url:'https://jin10.com'},
    {text:'🇺🇸 密歇根大学消费者信心初值低于预期',time:rT(130,200),url:'https://jin10.com'},
    {text:'🇺🇸 VIX恐慌指数暴跌24.4%，市场恐慌情绪快速消退',time:rT(200,360),url:'https://jin10.com'},
    {text:'🇯🇵 日本央行讨论进一步加息的具体条件',time:rT(360,480),url:'https://jin10.com'},
    {text:'🇪🇺 欧元区2月PMI终值确认制造业持续萎缩',time:rT(480,720),url:'https://jin10.com'},
    {text:'🛢 沙特宣布将继续维持自愿减产协议至下季度末',time:rT(720,1440),url:'https://jin10.com'},
  ],
  pp:[
    {text:'"堕抄"风波中，不愿"沉默"的人',time:rT(10,40),url:'https://www.thepaper.cn/'},
    {text:'美国贸易代表：与16个贸易伙伴发起301调查',time:rT(40,90),url:'https://www.thepaper.cn/'},
    {text:'中国也无意填补美国留下的"真空"',time:rT(90,180),url:'https://www.thepaper.cn/'},
    {text:'全国两会圆满闭幕，多项重大决议通过',time:rT(180,360),url:'https://www.thepaper.cn/'},
    {text:'国家统计局：3月CPI同比下降0.1%，环比持平',time:rT(360,720),url:'https://www.thepaper.cn/'},
  ],
  xq:[
    {text:'英伟达 NVDA',change:-2.06,time:rT(0,5),url:'https://xueqiu.com/S/NVDA'},
    {text:'胜宏科技 SZ002384',change:-1.51,time:rT(0,5),url:'https://xueqiu.com/S/SZ002384'},
    {text:'寒武纪-U SH688256',change:0.00,time:rT(0,5),url:'https://xueqiu.com/S/SH688256'},
    {text:'宝丰能源 SH600989',change:5.90,time:rT(0,5),url:'https://xueqiu.com/S/SH600989'},
    {text:'中国能建 SH601868',change:10.14,time:rT(0,5),url:'https://xueqiu.com/S/SH601868'},
    {text:'阿里巴巴 BABA',change:-1.38,time:rT(0,5),url:'https://xueqiu.com/S/BABA'},
    {text:'比亚迪 SZ002594',change:2.33,time:rT(0,5),url:'https://xueqiu.com/S/SZ002594'},
    {text:'宁德时代 SZ300750',change:1.87,time:rT(0,5),url:'https://xueqiu.com/S/SZ300750'},
    {text:'台积电 TSM',change:-4.69,time:rT(0,5),url:'https://xueqiu.com/S/TSM'},
  ],
  tc:[
    {text:'数据分析：BTC矿工成本告急，$72950均成本意味着什么？',time:rT(3,15),url:'https://www.techflowpost.com/newsletter/index.html'},
    {text:'当发币变成流水线：交易所和做市商始终是食物链顶端',time:rT(15,50),url:'https://www.techflowpost.com/newsletter/index.html'},
    {text:'RWA赛道TVL破270亿：谁在吃这块蛋糕？',time:rT(50,100),url:'https://www.techflowpost.com/newsletter/index.html'},
    {text:'Meta 210亿押注CoreWeave：AI算力军备竞赛重塑科技股估值逻辑',time:rT(100,200),url:'https://www.techflowpost.com/newsletter/index.html'},
    {text:'停摆结束=市场反弹？BTC历次政府重启后表现全解析',time:rT(200,360),url:'https://www.techflowpost.com/newsletter/index.html'},
    {text:'Ondo Finance Q1：RWA代币化总量突破50亿美元',time:rT(360,720),url:'https://www.techflowpost.com/newsletter/index.html'},
  ],
  cd:[
    {text:'Bitcoin, Ether, XRP and Crypto Market Overview',time:rT(5,20),url:'https://www.coindesk.com/markets/'},
    {text:'Bitcoin ETF Bleed Continues: MSBT 31M Inflows Fails to Reverse Trend',time:rT(20,60),url:'https://www.coindesk.com/markets/'},
    {text:'Ondo Finance Expands Tokenized Lineup with Eaton Stock and iShares ETFs',time:rT(60,120),url:'https://www.coindesk.com/business/'},
    {text:'Hyperliquid Continues DEX Expansion Despite Market Pressure',time:rT(120,240),url:'https://www.coindesk.com/markets/'},
    {text:'RWA Sector TVL Hits $27.4B, BlackRock BUIDL Tops at $2.93B',time:rT(240,480),url:'https://www.coindesk.com/markets/'},
  ],
  tb:[
    {text:'Bitcoin ETF资金持续外流深度分析',time:rT(10,30),url:'https://www.theblock.co/data/etfs/bitcoin-etf'},
    {text:'BTC 7D涨幅8%但恐贪指数仅16，历史背离怎么看',time:rT(30,90),url:'https://www.theblock.co/markets/'},
    {text:'Binance上线USDT保证金石油和天然气永续合约',time:rT(90,200),url:'https://www.theblock.co/markets/'},
    {text:'MicroStrategy持仓BTC达766,970枚，mNAV溢价1.10x',time:rT(200,360),url:'https://www.theblock.co/markets/'},
  ],
  xt:[
    {text:'吃龙虾❤️喝！万字拆解OpenClaw的架构与设计',time:rT(2,12),url:'https://juejin.cn/hot'},
    {text:'什么AI写Android最好用？官方做了基准测试排名',time:rT(12,35),url:'https://juejin.cn/hot'},
    {text:'深度解析GPT-4o多模态能力的实现原理',time:rT(35,80),url:'https://juejin.cn/hot'},
    {text:'Rust异步编程最佳实践2025版',time:rT(80,200),url:'https://juejin.cn/hot'},
    {text:'从零开始搭建AI应用：LangChain实战指南',time:rT(200,480),url:'https://juejin.cn/hot'},
  ],
  comp:[
    {text:'Ondo Finance：MEXC扩展代币化产品线，新增伊顿股票和iShares ETF',time:rT(10,30),url:'https://www.stablecoininsider.com/mexc-expands-ondo-finance-tokenized-lineup-with-eaton-stock-and-ishares-etfs/',src:'Ondo'},
    {text:'Backed：持续深耕欧洲合规代币化证券市场',time:rT(30,90),url:'https://backed.fi/',src:'Backed'},
    {text:'Dinari：dShares美股代币化，与MSX高度竞争',time:rT(90,200),url:'https://dinari.com/dshares',src:'Dinari'},
    {text:'Robinhood欧洲版持续推进代币化赛道',time:rT(200,400),url:'https://robinhood.com/eu/en/invest/',src:'Robinhood'},
    {text:'RWA赛道TVL：$27.41B，Top3：Tether Gold/BlackRock/Ondo',time:rT(400,720),url:'https://defillama.com/categories',src:'DefiLlama'},
  ],
  msx:[
    {text:'MSX平台24H RWA交易量突破$120.78M，链上优质资产流通创新高',time:rT(5,20),url:'https://msx.finance'},
    {text:'MicroStrategy持仓策略引发RWA代币化讨论，美股代币化赛道加速布局',time:rT(20,60),url:'https://msx.finance'},
    {text:'MSX Pre-IPO专区新增3支股权代币，总融资规模扩至$2.3B',time:rT(60,120),url:'https://msx.finance'},
    {text:'Solana链上RWA锁仓量超$1.2B，MSX占据主要份额',time:rT(120,240),url:'https://msx.finance'},
    {text:'BlackRock BUIDL基金突破$500M，机构资金持续流入RWA赛道',time:rT(240,480),url:'https://msx.finance'},
    {text:'MSX用户数突破18万，30日新增2.1万活跃钱包地址',time:rT(480,960),url:'https://msx.finance'},
  ]
};

async function renderAllNews() {
  const apiSources = [
    ['cls','list-cls','t-cls',80],
    ['hwj','list-hwj','t-hwj',50],
    ['36k','list-36k','t-36k',50],
    ['tc', 'list-tc', 't-tc', 50],
    ['js', 'list-js', 't-js', 80],
  ];
  await Promise.allSettled(
    apiSources.map(([src,lid,tid,lim]) => loadNewsFromAPI(src,lid,tid,lim))
  );
  ['pp','xq','xt','comp','msx'].forEach(k => {
    if(ND[k]){renderList(ND[k],'list-'+k);const te=document.getElementById('t-'+k);if(te)te.textContent=nowS();}
  });
}

// ══ CALENDAR ══
const ECON_EVENTS = {
  // key = "YYYY-M-D"
  '2026-4-7': [
    {n:'NFIB小企业乐观指数',t:'18:00',lvl:'med'},{n:'3年期国债标售',t:'次日01:00',lvl:'med'},
  ],
  '2026-4-8': [
    {n:'FOMC会议纪要',t:'次日02:00',lvl:'high'},{n:'PPI生产者物价',t:'20:30',lvl:'high'},
  ],
  '2026-4-9': [
    {n:'CPI消费者物价★',t:'20:30',lvl:'high'},{n:'初请失业金',t:'20:30',lvl:'med'},
  ],
  '2026-4-10': [
    {n:'PPI最终需求',t:'20:30',lvl:'med'},{n:'密歇根消费者信心初值',t:'22:00',lvl:'high'},
  ],
  '2026-4-11': [
    {n:'密歇根通胀预期',t:'22:00',lvl:'med'},
  ],
  '2026-4-14': [
    {n:'零售销售数据',t:'20:30',lvl:'high'},
  ],
  '2026-4-15': [
    {n:'工业生产指数',t:'21:15',lvl:'med'},{n:'纽约联储制造业',t:'20:30',lvl:'low'},
  ],
  '2026-4-16': [
    {n:'建筑许可数据',t:'20:30',lvl:'med'},{n:'褐皮书',t:'次日02:00',lvl:'med'},
  ],
  '2026-4-17': [
    {n:'初请失业金',t:'20:30',lvl:'med'},{n:'费城联储制造业',t:'20:30',lvl:'med'},
  ],
};

function renderCalendar() {
  const grid = document.getElementById('cal-grid'); if(!grid) return;
  const today = new Date();
  const days = ['周一','周二','周三','周四','周五','周六','周日'];
  // show current week Mon–Sun
  const mon = new Date(today);
  mon.setDate(today.getDate() - ((today.getDay()+6)%7));
  let html = '';
  for(let i=0;i<7;i++){
    const d = new Date(mon); d.setDate(mon.getDate()+i);
    const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    const isToday = d.toDateString()===today.toDateString();
    const events = ECON_EVENTS[key]||[];
    html += `<div class="cal-day${isToday?' today':''}">
      <div class="cal-dh"><span style="color:var(--text3)">${days[i]}</span><span class="dnum" style="margin-left:4px">${d.getDate()}日</span>${isToday?'<div class="today-dot"></div>':''}</div>
      ${events.map(ev=>`<div class="cal-ev ${ev.lvl}" title="${ev.t}">
        <div>${ev.n}</div><div class="ev-time">${ev.t}</div>
      </div>`).join('')}
      ${events.length===0?'<div style="font-size:9px;color:var(--text3)">无重要数据</div>':''}
    </div>`;
  }
  grid.innerHTML = html;
}

// ══ HOTSPOT FILTER ══
let curHSFilter = 'all';
function filterHS(cat, el) {
  curHSFilter = cat;
  swp(el);
  document.querySelectorAll('.hs-group').forEach(g => {
    const gc = g.dataset.cat;
    if(cat==='all' || gc===cat) g.classList.remove('hidden');
    else g.classList.add('hidden');
  });
}

// ══ GITHUB ══
async function loadGH(id) {
  const el = document.getElementById(id); if(!el) return;
  try {
    const d = new Date(); d.setDate(d.getDate()-1);
    const data = await cachedFetch(API.github(`created:>${d.toISOString().split('T')[0]}`), 600000);
    const repos = (data.items||[]).slice(0,10);
    el.innerHTML = repos.map((r,i) => `<a class="nr" href="${r.html_url}" target="_blank" rel="noopener">
      <div class="nn ${nc(i)}">${i+1}</div>
      <div class="nrc">
        <div class="nrt" style="color:var(--yellow)">${r.full_name}</div>
        <div class="nrt" style="font-size:10px;color:var(--text2);margin-top:1px">${(r.description||'').slice(0,55)}${r.description&&r.description.length>55?'…':''}</div>
        <div class="nrf">${ft(new Date(r.created_at))} · ${r.language||'—'} <span class="et">↗</span></div>
      </div>
      <span class="nrch" style="color:var(--yellow)">★${r.stargazers_count.toLocaleString()}</span>
    </a>`).join('');
    upd('t-gh', nowS());
  } catch(e) { if(el) el.innerHTML='<div style="padding:14px;text-align:center;color:var(--text3);font-size:11px">⚠ API限流</div>'; }
}

// ══ 简易英文标题翻译（用于The Block等英文来源）══
// 关键词替换，让英文新闻更易读
function autoTranslate(text) {
  if(!text) return text;
  // 如果标题大部分是英文才翻译
  const enRatio = (text.match(/[a-zA-Z]/g)||[]).length / text.length;
  if(enRatio < 0.5) return text; // 已经是中文，不处理
  const map = {
    'bitcoin':'比特币','ethereum':'以太坊','solana':'Solana','binance':'币安','coinbase':'Coinbase',
    'federal reserve':'美联储','fed':'美联储','interest rate':'利率','inflation':'通胀',
    'etf':'ETF','sec':'美SEC','crypto':'加密货币','blockchain':'区块链','defi':'DeFi',
    'stablecoin':'稳定币','nft':'NFT','tokenize':'代币化','wallet':'钱包',
    'rally':'反弹','drops':'下跌','falls':'下跌','rises':'上涨','surges':'大涨','plunges':'暴跌',
    'bullish':'看涨','bearish':'看跌','market cap':'市值','trading volume':'交易量',
    'ondo':'Ondo Finance','blackrock':'贝莱德','microstrategy':'MicroStrategy',
    'jpmorgan':'摩根大通','goldman sachs':'高盛','trump':'特朗普','white house':'白宫',
    'senate':'参议院','congress':'国会','regulation':'监管','compliance':'合规',
    'layer 1':'Layer1','layer 2':'Layer2','proof of stake':'PoS','proof of work':'PoW',
    'liquidity':'流动性','yield':'收益率','apy':'年化收益','tvl':'总锁仓',
    'rwa':'RWA资产','tokenized':'代币化','on-chain':'链上','off-chain':'链下',
  };
  let result = text;
  // 保留原文但在前面加[EN]标记，让用户知道这是英文新闻
  return '[EN] ' + result;
}

// ══ HOTSPOT REFRESH ══
let hsRef = false;
async function refreshHS() {
  if(hsRef) return; hsRef=true;
  const b=document.getElementById('hs-btn'),i=document.getElementById('hs-ic');
  b.disabled=true; i.style.animation='spin .6s linear infinite';
  await Promise.allSettled([renderAllNews(), loadGH('list-gh')]);
  hsRef=false; b.disabled=false; i.style.animation='';
}