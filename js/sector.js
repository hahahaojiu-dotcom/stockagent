// ══════════════════════════════════════════════
// sector.js — 板块行情模块
// 包含：A股板块、美股板块、大宗商品、全球指数
//        点击跳转TradingView/Yahoo/东财
// 修改这里：板块数据、跳转链接
// ══════════════════════════════════════════════
// ══ SECTORS ══
const SD = {
  'A股':[
    {cat:'科技',n:'半导体',price:'—',ch:'+3.2%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK0447'},
    {cat:'科技',n:'人工智能',price:'—',ch:'+4.1%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK0800'},
    {cat:'新能源',n:'光伏/储能',price:'—',ch:'+1.8%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK1026'},
    {cat:'新能源',n:'新能源汽车',price:'—',ch:'+2.3%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK0732'},
    {cat:'医疗',n:'医药生物',price:'—',ch:'-0.9%',u:false,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK0465'},
    {cat:'医疗',n:'医疗器械',price:'—',ch:'+0.4%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'科技',n:'消费电子',price:'—',ch:'+2.4%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'科技',n:'云计算',price:'—',ch:'+1.7%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'金融',n:'银行',price:'—',ch:'+0.3%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html#boards2-88.BK0475'},
    {cat:'金融',n:'保险',price:'—',ch:'+0.6%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'地产',n:'房地产',price:'—',ch:'-1.2%',u:false,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'军工',n:'航空航天',price:'—',ch:'+1.5%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'军工',n:'国防军工',price:'—',ch:'+0.9%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'消费',n:'白酒',price:'—',ch:'+0.7%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'消费',n:'食品饮料',price:'—',ch:'+0.4%',u:true,url:'https://quote.eastmoney.com/center/boardlist.html'},
    {cat:'能源',n:'煤炭',price:'—',ch:'-0.5%',u:false,url:'https://quote.eastmoney.com/center/boardlist.html'},
  ],
  '美股':[
    {cat:'科技',n:'AI/芯片 (NVDA/AMD)',price:'$875.39',ch:'+2.8%',u:true,url:'https://finance.yahoo.com/quote/NVDA/'},
    {cat:'科技',n:'云计算 (MSFT/AMZN)',price:'$415.62',ch:'+1.4%',u:true,url:'https://finance.yahoo.com/quote/MSFT/'},
    {cat:'科技',n:'Meta+AI算力',price:'$531.19',ch:'+5.2%',u:true,url:'https://finance.yahoo.com/quote/META/'},
    {cat:'科技',n:'CoreWeave',price:'$52.80',ch:'+12.1%',u:true,url:'https://finance.yahoo.com/quote/CRWV/'},
    {cat:'科技',n:'半导体设备 (AMAT)',price:'$163.50',ch:'+3.2%',u:true,url:'https://finance.yahoo.com/quote/AMAT/'},
    {cat:'金融',n:'摩根大通 (JPM)',price:'$201.45',ch:'+0.8%',u:true,url:'https://finance.yahoo.com/quote/JPM/'},
    {cat:'医疗',n:'生物医药 (MRNA)',price:'$42.15',ch:'+0.9%',u:true,url:'https://finance.yahoo.com/quote/MRNA/'},
    {cat:'能源',n:'西方石油 (OXY)',price:'$52.30',ch:'+4.2%',u:true,url:'https://finance.yahoo.com/quote/OXY/'},
    {cat:'汽车',n:'特斯拉 (TSLA)',price:'$248.71',ch:'+3.1%',u:true,url:'https://finance.yahoo.com/quote/TSLA/'},
    {cat:'消费',n:'亚马逊 (AMZN)',price:'$198.92',ch:'+1.2%',u:true,url:'https://finance.yahoo.com/quote/AMZN/'},
    {cat:'传媒',n:'奈飞 (NFLX)',price:'$624.53',ch:'+2.1%',u:true,url:'https://finance.yahoo.com/quote/NFLX/'},
    {cat:'策略股',n:'MicroStrategy (MSTR)',price:'$354.12',ch:'+4.8%',u:true,url:'https://finance.yahoo.com/quote/MSTR/'},
    {cat:'ETF',n:'QQQ 纳斯达克ETF',price:'$455.23',ch:'+1.24%',u:true,url:'https://finance.yahoo.com/quote/QQQ/'},
    {cat:'ETF',n:'SPY 标普500ETF',price:'$527.18',ch:'+0.56%',u:true,url:'https://finance.yahoo.com/quote/SPY/'},
    {cat:'矿企',n:'马拉松数字 (MARA)',price:'$17.45',ch:'+6.2%',u:true,url:'https://finance.yahoo.com/quote/MARA/'},
    {cat:'矿企',n:'Riot Platforms (RIOT)',price:'$10.82',ch:'+5.8%',u:true,url:'https://finance.yahoo.com/quote/RIOT/'},
  ],
  '大宗':[
    {cat:'贵金属',n:'黄金 XAU/USD',price:'$4,750',ch:'+0.34%',u:true,url:'https://cn.investing.com/commodities/gold'},
    {cat:'贵金属',n:'白银 XAG/USD',price:'$27.42',ch:'-0.8%',u:false,url:'https://cn.investing.com/commodities/silver'},
    {cat:'贵金属',n:'铂金 XPT/USD',price:'$982',ch:'+0.5%',u:true,url:'https://cn.investing.com/commodities/platinum'},
    {cat:'能源',n:'布伦特原油',price:'$96.58',ch:'+0.69%',u:true,url:'https://cn.investing.com/commodities/brent-oil'},
    {cat:'能源',n:'WTI 原油',price:'$98.75',ch:'+0.90%',u:true,url:'https://cn.investing.com/commodities/crude-oil'},
    {cat:'能源',n:'天然气',price:'$2.14',ch:'-2.1%',u:false,url:'https://cn.investing.com/commodities/natural-gas'},
    {cat:'工业金属',n:'铜 HG',price:'$5.77/磅',ch:'+0.17%',u:true,url:'https://cn.investing.com/commodities/copper'},
    {cat:'工业金属',n:'铝',price:'$3,370/吨',ch:'+0.33%',u:true,url:'https://cn.investing.com/commodities/aluminum'},
    {cat:'工业金属',n:'镍',price:'$16,850',ch:'-1.4%',u:false,url:'https://cn.investing.com/commodities/nickel'},
    {cat:'农产品',n:'小麦 ZW',price:'$575.50',ch:'+0.17%',u:true,url:'https://cn.investing.com/commodities/us-wheat'},
    {cat:'农产品',n:'玉米 ZC',price:'$444.75',ch:'+0.17%',u:true,url:'https://cn.investing.com/commodities/us-corn'},
    {cat:'农产品',n:'大豆 ZS',price:'$1,102',ch:'-1.4%',u:false,url:'https://cn.investing.com/commodities/us-soybeans'},
  ],
  '全球':[
    {cat:'中国',n:'上证指数 🇨🇳',price:'4,004.65',ch:'+0.97%',u:true,url:'https://finance.yahoo.com/quote/000001.SS/'},
    {cat:'中国',n:'沪深300 🇨🇳',price:'3,981.22',ch:'+0.39%',u:true,url:'https://finance.yahoo.com/quote/000300.SS/'},
    {cat:'亚太',n:'日经225 🇯🇵',price:'56,739',ch:'+1.51%',u:true,url:'https://finance.yahoo.com/quote/%5EN225/'},
    {cat:'亚太',n:'恒生指数 🇭🇰',price:'25,988',ch:'+0.92%',u:true,url:'https://finance.yahoo.com/quote/%5EHSI/'},
    {cat:'亚太',n:'韩国KOSPI 🇰🇷',price:'5,886',ch:'+1.87%',u:true,url:'https://finance.yahoo.com/quote/%5EKS11/'},
    {cat:'亚太',n:'ASX200 🇦🇺',price:'7,891',ch:'+0.15%',u:true,url:'https://finance.yahoo.com/quote/%5EAXJO/'},
    {cat:'欧洲',n:'德国DAX 🇩🇪',price:'23,806',ch:'-1.14%',u:false,url:'https://finance.yahoo.com/quote/%5EGDAXI/'},
    {cat:'欧洲',n:'英国富时100 🇬🇧',price:'10,603',ch:'-0.05%',u:false,url:'https://finance.yahoo.com/quote/%5EFTSE/'},
    {cat:'欧洲',n:'法国CAC40 🇫🇷',price:'8,245',ch:'-0.22%',u:false,url:'https://finance.yahoo.com/quote/%5EFCHI/'},
    {cat:'美洲',n:'标普500 🇺🇸',price:'6,824',ch:'+0.62%',u:true,url:'https://finance.yahoo.com/quote/%5EGSPC/'},
    {cat:'美洲',n:'纳斯达克 🇺🇸',price:'22,822',ch:'+0.83%',u:true,url:'https://finance.yahoo.com/quote/%5EIXIC/'},
    {cat:'美洲',n:'道琼斯 🇺🇸',price:'48,185',ch:'+0.58%',u:true,url:'https://finance.yahoo.com/quote/%5EDJI/'},
  ]
};

function renderSectors(cat) {
  const items = SD[cat]||SD['A股'];
  document.getElementById('sec-g').innerHTML = items.map(s => `
    <div class="scc" onclick="openSector('${s.n}','${s.price}','${s.ch}','${s.url}','${cat}')">
      <div class="sc-cat">${s.cat}</div>
      <div class="sc-nm">${s.n}</div>
      <div class="sc-pr">${s.price}</div>
      <div class="sc-ch" style="color:${s.u?'var(--red)':'var(--green)'}">${s.ch}</div>
      <div class="sc-bar" style="width:${(Math.random()*55+20).toFixed(0)}%;background:${s.u?'var(--red)':'var(--green)'}"></div>
    </div>`).join('');
}