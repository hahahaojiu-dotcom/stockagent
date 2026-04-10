// ══════════════════════════════════════════════
// msx.js — MSX & ETF模块 + 详情面板
// 包含：BTC现货ETF、RWA动态、MSX数据
//        右侧详情面板（币种/板块通用）
// ══════════════════════════════════════════════

// ── ETF数据 ──
const ETF_LIST = [
  {tick:'IBIT',name:'iShares Bitcoin Trust (BlackRock)',aum:'$42.8B',btc:594241,flow:168.4,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'FBTC',name:'Fidelity Wise Origin Bitcoin Fund',aum:'$10.2B',btc:141522,flow:45.2,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'GBTC',name:'Grayscale Bitcoin Trust',aum:'$19.8B',btc:274484,flow:-89.7,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'ARKB',name:'ARK 21Shares Bitcoin ETF',aum:'$3.1B',btc:43018,flow:-12.1,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'BITB',name:'Bitwise Bitcoin ETF',aum:'$2.4B',btc:33281,flow:8.6,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'HODL',name:'VanEck Bitcoin ETF',aum:'$0.8B',btc:11092,flow:2.1,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'EZBC',name:'Franklin Bitcoin ETF',aum:'$0.5B',btc:6934,flow:1.4,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
  {tick:'BTCO',name:'Invesco Galaxy Bitcoin ETF',aum:'$0.4B',btc:5547,flow:-0.8,url:'https://sosovalue.com/assets/etf/us-btc-spot'},
];

function renderETF() {
  const tot = ETF_LIST.reduce((a,e)=>a+e.flow,0);
  const te = document.getElementById('etf-tot');
  if(te){te.textContent=(tot>=0?'+$':'−$')+Math.abs(tot).toFixed(1)+'M';te.style.color=tot>=0?'var(--green)':'var(--red)';}
  const maxF = Math.max(...ETF_LIST.map(e=>Math.abs(e.flow)));
  document.getElementById('etf-grid').innerHTML = ETF_LIST.map(e => {
    const up=e.flow>=0, pct=Math.abs(e.flow)/maxF*100;
    return `<a class="etf-c" href="${e.url}" target="_blank" rel="noopener">
      <div class="etf-tick">${e.tick}</div>
      <div class="etf-name">${e.name}</div>
      <div class="etf-row"><span class="etf-lbl">AUM</span><span class="etf-val">${e.aum}</span></div>
      <div class="etf-row"><span class="etf-lbl">BTC持仓</span><span class="etf-val" style="color:var(--yellow)">${e.btc.toLocaleString()}</span></div>
      <div class="etf-row"><span class="etf-lbl">今日流向</span><span class="etf-val" style="color:${up?'var(--green)':'var(--red)'}">${up?'+$':'−$'}${Math.abs(e.flow).toFixed(1)}M</span></div>
      <div class="etf-bar"><div class="etf-fill" style="width:${pct.toFixed(0)}%;background:${up?'var(--green)':'var(--red)'}"></div></div>
    </a>`;
  }).join('');
}

function renderMSXDynamic() { if(typeof ND !== 'undefined' && ND.msx) renderList(ND.msx, 'list-msx'); }
function renderRWA() {
  renderList([
    {text:'美股代币化',change:5.2,url:'https://msx.finance',src:'$14.2B TVL'},
    {text:'美债/国债 RWA',change:2.1,url:'https://msx.finance',src:'$8.9B TVL'},
    {text:'房地产 RWA',change:-0.8,url:'https://msx.finance',src:'$3.8B TVL'},
    {text:'私募股权代币化',change:8.4,url:'https://msx.finance',src:'$1.6B TVL'},
    {text:'大宗商品 RWA',change:1.2,url:'https://msx.finance',src:'$0.9B TVL'},
  ], 'list-rwa');
}

// ══ 详情面板 ══
let dpInst = null;

// 关闭面板
function closeD() {
  document.getElementById('dp').classList.remove('open');
  if(dpInst){try{dpInst.remove();}catch(e){} dpInst=null;}
}

// 切换页面时自动关闭详情面板
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ni, .si').forEach(btn => {
    btn.addEventListener('click', () => closeD());
  });
});

// ── 打开OKX币种详情（crypto.js调用）
async function openCoinOKX(instId, name, symbol) {
  closeD();
  const dp = document.getElementById('dp');
  document.getElementById('dp-t').textContent = name + ' / ' + symbol;
  document.getElementById('dp-p').textContent = '$…';
  document.getElementById('dp-meta').innerHTML = '<span style="color:var(--text3)">加载中...</span>';
  document.getElementById('dp-pb').innerHTML = `<div class="pg" style="margin-bottom:10px">
    ${[['1H','1H'],['4H','4H'],['1D','1天'],['1W','1周'],['1M','1月']].map(([bar,lbl])=>
      `<button class="pill ${bar==='1D'?'active':''}" onclick="swp(this);loadDPChartOKX('${instId}','${bar}')">${lbl}</button>`
    ).join('')}
  </div>`;
  document.getElementById('dp-tags').innerHTML = '';
  dp.classList.add('open');
  // 加载价格
  try {
    const d = await cachedFetch(API.okxTicker(instId), 15000);
    const t = d.data?.[0];
    if(t) {
      const price=parseFloat(t.last), open=parseFloat(t.open24h);
      const chg=(price-open)/open*100;
      upd('dp-p', '$'+price.toLocaleString('en-US',{maximumFractionDigits:price>=1?2:6}));
      document.getElementById('dp-meta').innerHTML = `
        <span class="${chg>=0?'up':'dn'}">${fmtP(chg)} 24H</span>
        <span>最高: $${parseFloat(t.high24h).toLocaleString('en-US',{maximumFractionDigits:2})}</span>
        <span>最低: $${parseFloat(t.low24h).toLocaleString('en-US',{maximumFractionDigits:2})}</span>
        <span>成交量: ${fmtM(parseFloat(t.volCcy24h)*price)}</span>
      `;
      // 统计数据
      document.getElementById('dp-s').innerHTML = `
        <div class="dpst"><div class="dpstl">当前价格</div><div class="dpstv">$${price.toLocaleString('en-US',{maximumFractionDigits:price>=1?2:6})}</div></div>
        <div class="dpst"><div class="dpstl">24H涨跌</div><div class="dpstv ${chg>=0?'up':'dn'}">${fmtP(chg)}</div></div>
        <div class="dpst"><div class="dpstl">24H最高</div><div class="dpstv">$${parseFloat(t.high24h).toLocaleString('en-US',{maximumFractionDigits:2})}</div></div>
        <div class="dpst"><div class="dpstl">24H最低</div><div class="dpstv">$${parseFloat(t.low24h).toLocaleString('en-US',{maximumFractionDigits:2})}</div></div>
        <div class="dpst"><div class="dpstl">24H成交量</div><div class="dpstv">${parseFloat(t.vol24h).toLocaleString('en-US',{maximumFractionDigits:0})} ${symbol}</div></div>
        <div class="dpst"><div class="dpstl">24H成交额</div><div class="dpstv">${fmtM(parseFloat(t.volCcy24h)*price)}</div></div>
        <div class="dpst"><div class="dpstl">开盘价</div><div class="dpstv">$${open.toLocaleString('en-US',{maximumFractionDigits:2})}</div></div>
        <div class="dpst"><div class="dpstl">来源</div><div class="dpstv cr-src src-okx">OKX</div></div>
      `;
    }
  } catch(e) {}
  // 加载K线
  loadDPChartOKX(instId, '1D');
  // 链接（包含Twitter）
  const tw = (typeof COIN_TWITTER !== 'undefined') ? COIN_TWITTER[symbol] : null;
  const links = [
    ...(tw ? [{t:`@${tw} — Twitter/X`, url:`https://twitter.com/${tw}`, s:'Twitter', cls:'dpl-twitter'}] : []),
    {t:`OKX — ${symbol}/USDT 行情`, url:`https://www.okx.com/trade-spot/${instId.toLowerCase()}`, s:'OKX'},
    {t:`TradingView — ${symbol}USDT`, url:`https://www.tradingview.com/chart/?symbol=OKX:${symbol}USDT`, s:'TV'},
    {t:`CoinGecko — ${name}`, url:`https://www.coingecko.com/en/coins/${symbol.toLowerCase()}`, s:'CG'},
  ];
  document.getElementById('dp-l').innerHTML = links.map(l =>
    `<a class="dpl ${l.cls||''}" href="${l.url}" target="_blank">
      <span class="dplt">${l.t} <span class="et">${l.s}</span></span>
      <span class="dpla">↗</span>
    </a>`
  ).join('');
}

// ── OKX K线图
async function loadDPChartOKX(instId, bar) {
  const w = document.getElementById('dp-cw');
  w.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:11px">加载中...</div>';
  try {
    const barMap = {'1H':'1H','4H':'4H','1D':'1Dutc','1W':'1Wutc','1M':'1Mutc'};
    const limit = {'1H':48,'4H':60,'1D':'1D'==='1D'?90:90,'1W':52,'1M':24};
    const lim = {'1H':48,'4H':60,'1D':90,'1W':52,'1M':24}[bar]||90;
    const d = await cachedFetch(API.okxCandles(instId, barMap[bar]||'1Dutc', lim), 30000);
    const candles = (d.data||[]).reverse();
    w.innerHTML = '';
    if(dpInst){try{dpInst.remove();}catch(e){}}
    const up = candles.length>1 && parseFloat(candles[candles.length-1][4]) >= parseFloat(candles[0][4]);
    const chart = LightweightCharts.createChart(w, {
      width:w.offsetWidth, height:200,
      layout:{background:{color:'transparent'},textColor:'#8b949e'},
      grid:{vertLines:{color:'rgba(255,255,255,0.04)'},horzLines:{color:'rgba(255,255,255,0.04)'}},
      rightPriceScale:{borderColor:'rgba(255,255,255,0.07)'},
      timeScale:{borderColor:'rgba(255,255,255,0.07)',timeVisible:true}
    });
    dpInst = chart;
    const s = chart.addAreaSeries({
      lineColor:up?'#f85149':'#3fb950',
      topColor:up?'rgba(248,81,73,.22)':'rgba(63,185,80,.22)',
      bottomColor:'rgba(0,0,0,0)', lineWidth:1.5, priceLineVisible:false
    });
    s.setData(candles.map(c=>({time:Math.floor(parseInt(c[0])/1000), value:parseFloat(c[4])})));
    chart.timeScale().fitContent();
    new ResizeObserver(()=>{if(w.offsetWidth>0)chart.resize(w.offsetWidth,200);}).observe(w);
  } catch(e) {
    w.innerHTML='<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3)">图表加载失败</div>';
  }
}

// ── 板块详情面板
function openSector(name, price, chg, url, cat) {
  closeD();
  document.getElementById('dp-t').textContent = name;
  document.getElementById('dp-p').textContent = price !== '—' ? price : name;
  const up = parseFloat(chg) >= 0;
  document.getElementById('dp-meta').innerHTML = `<span class="${up?'up':'dn'}">${chg}</span><span>板块行情</span>`;
  document.getElementById('dp-pb').innerHTML = '';
  document.getElementById('dp-cw').innerHTML = `<div style="height:120px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:11px;flex-direction:column;gap:6px"><span>点击下方链接查看K线</span></div>`;
  document.getElementById('dp-s').innerHTML = '';
  document.getElementById('dp-tags').innerHTML = `<span class="dp-tag">${cat}</span>`;
  const links = [
    {t:`${name} — 实时行情`, url, s:'跳转'},
    ...(cat==='A股'?[
      {t:'东方财富 板块列表', url:'https://quote.eastmoney.com/center/boardlist.html', s:'东财'},
      {t:'同花顺 板块数据', url:'https://q.10jqka.com.cn/', s:'同花顺'},
    ]:[]),
    ...(cat==='美股'?[
      {t:'Finviz 热力图', url:'https://finviz.com/map.ashx', s:'Finviz'},
      {t:'TradingView 美股', url:'https://www.tradingview.com/markets/stocks-usa/', s:'TV'},
    ]:[]),
    ...(cat==='大宗'?[{t:'Investing.com 大宗商品', url:'https://cn.investing.com/commodities/', s:'Investing'}]:[]),
    ...(cat==='全球'?[{t:'TradingView 全球指数', url:'https://www.tradingview.com/markets/world-indices/', s:'TV'}]:[]),
  ];
  document.getElementById('dp-l').innerHTML = links.map(l =>
    `<a class="dpl" href="${l.url}" target="_blank"><span class="dplt">${l.t} <span class="et">${l.s}</span></span><span class="dpla">↗</span></a>`
  ).join('');
  document.getElementById('dp').classList.add('open');
}

// ── CoinGecko币种详情（market.js用）
async function openCoin(coinId, name) {
  closeD();
  document.getElementById('dp-t').textContent = name;
  document.getElementById('dp-p').textContent = '$…';
  document.getElementById('dp-meta').textContent = '加载中...';
  document.getElementById('dp').classList.add('open');
  document.getElementById('dp-pb').innerHTML = `<div class="pg" style="margin-bottom:10px">
    ${[['1','1天'],['7','7天'],['30','1月'],['90','3月'],['365','1年'],['max','全部']].map(([d,l])=>
      `<button class="pill ${d==='30'?'active':''}" onclick="swp(this);loadDPChart('${coinId}','${d}')">${l}</button>`
    ).join('')}
  </div>`;
  document.getElementById('dp-tags').innerHTML = '';
  await loadDPChart(coinId,'30');
  loadDPInfo(coinId);
}

async function loadDPChart(coinId, days) {
  const w = document.getElementById('dp-cw');
  w.innerHTML = '<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:11px">加载中...</div>';
  try {
    const d = await cachedFetch(API.cgChart(coinId,days),60000);
    const prices = d.prices||[]; w.innerHTML='';
    if(dpInst){try{dpInst.remove();}catch(e){}}
    const chart = LightweightCharts.createChart(w,{width:w.offsetWidth,height:200,layout:{background:{color:'transparent'},textColor:'#8b949e'},grid:{vertLines:{color:'rgba(255,255,255,0.04)'},horzLines:{color:'rgba(255,255,255,0.04)'}},rightPriceScale:{borderColor:'rgba(255,255,255,0.07)'},timeScale:{borderColor:'rgba(255,255,255,0.07)',timeVisible:true}});
    dpInst=chart;
    const up=prices.length>1&&prices[prices.length-1][1]>=prices[0][1];
    const s=chart.addAreaSeries({lineColor:up?'#f85149':'#3fb950',topColor:up?'rgba(248,81,73,.22)':'rgba(63,185,80,.22)',bottomColor:'rgba(0,0,0,0)',lineWidth:1.5,priceLineVisible:false});
    s.setData(prices.map(([ts,v])=>({time:Math.floor(ts/1000),value:v})));
    chart.timeScale().fitContent();
    const last=prices[prices.length-1],first=prices[0];
    if(last&&first){
      const chg=((last[1]-first[1])/first[1]*100).toFixed(2);
      upd('dp-p','$'+last[1].toLocaleString('en-US',{maximumFractionDigits:2}));
      document.getElementById('dp-meta').innerHTML=`<span class="${parseFloat(chg)>=0?'up':'dn'}">${(parseFloat(chg)>=0?'+':'')+chg}%</span>`;
    }
    new ResizeObserver(()=>{if(w.offsetWidth>0)chart.resize(w.offsetWidth,200);}).observe(w);
  } catch(e){w.innerHTML='<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3)">加载失败</div>';}
}

async function loadDPInfo(coinId) {
  try {
    const info = await cachedFetch(API.cgCoin(coinId),300000);
    const md = info.market_data||{};
    upd('dp-p','$'+(md.current_price?.usd||0).toLocaleString('en-US',{maximumFractionDigits:2}));
    document.getElementById('dp-s').innerHTML = [
      {l:'当前价格',v:'$'+(md.current_price?.usd||0).toLocaleString('en-US',{maximumFractionDigits:2})},
      {l:'市值排名',v:'#'+(info.market_cap_rank||'—')},
      {l:'总市值',v:fmtM(md.market_cap?.usd)},
      {l:'24H交易量',v:fmtM(md.total_volume?.usd)},
      {l:'7D涨跌',v:fmtP(md.price_change_percentage_7d)},
      {l:'30D涨跌',v:fmtP(md.price_change_percentage_30d)},
      {l:'历史最高',v:md.ath?.usd?'$'+md.ath.usd.toLocaleString('en-US',{maximumFractionDigits:2}):'—'},
      {l:'流通量',v:md.circulating_supply?md.circulating_supply.toLocaleString('en-US',{maximumFractionDigits:0}):'—'},
    ].map(s=>`<div class="dpst"><div class="dpstl">${s.l}</div><div class="dpstv">${s.v}</div></div>`).join('');
    const tags=(info.categories||[]).slice(0,6);
    document.getElementById('dp-tags').innerHTML=tags.map(t=>`<span class="dp-tag">${t}</span>`).join('');
    // 链接含Twitter
    const tw=info.links?.twitter_screen_name;
    const links=[
      ...(tw?[{t:`@${tw} — Twitter/X`,url:`https://twitter.com/${tw}`,s:'Twitter',cls:'dpl-twitter'}]:[]),
      {t:`CoinGecko — ${info.name}`,url:`https://www.coingecko.com/en/coins/${coinId}`,s:'CoinGecko'},
      {t:`TradingView — ${(info.symbol||'').toUpperCase()}USD`,url:`https://www.tradingview.com/symbols/${(info.symbol||'btc').toUpperCase()}USD/`,s:'TV'},
    ];
    if(info.links?.homepage?.[0]) links.push({t:`${info.name} 官网`,url:info.links.homepage[0],s:'官网'});
    if(info.links?.subreddit_url) links.push({t:`r/${info.symbol} Reddit`,url:info.links.subreddit_url,s:'Reddit'});
    document.getElementById('dp-l').innerHTML=links.map(l=>
      `<a class="dpl ${l.cls||''}" href="${l.url}" target="_blank"><span class="dplt">${l.t} <span class="et">${l.s}</span></span><span class="dpla">↗</span></a>`
    ).join('');
  } catch(e){}
}
