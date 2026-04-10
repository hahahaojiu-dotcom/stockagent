// ══════════════════════════════════════════════
// msx.js — MSX & ETF模块 + 详情面板
// 包含：BTC现货ETF资金流向、RWA赛道动态
//        MSX平台数据、加密实时行情
//        右侧详情滑出面板（币种/板块通用）
// 修改这里：ETF数据、MSX动态内容、RWA数据
// ══════════════════════════════════════════════
// ══ ETF ══
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

function renderMSXDynamic() { renderList(ND.msx, 'list-msx'); }
function renderRWA() {
  renderList([
    {text:'美股代币化',change:5.2,url:'https://msx.finance',src:'$14.2B TVL'},
    {text:'美债/国债 RWA',change:2.1,url:'https://msx.finance',src:'$8.9B TVL'},
    {text:'房地产 RWA',change:-0.8,url:'https://msx.finance',src:'$3.8B TVL'},
    {text:'私募股权代币化',change:8.4,url:'https://msx.finance',src:'$1.6B TVL'},
    {text:'大宗商品 RWA',change:1.2,url:'https://msx.finance',src:'$0.9B TVL'},
  ], 'list-rwa');
}

// ══ DETAIL PANEL ══
let dpInst = null;
function closeD() { document.getElementById('dp').classList.remove('open'); }

function openSector(name, price, chg, url, cat) {
  document.getElementById('dp-t').textContent = name;
  document.getElementById('dp-p').textContent = price;
  const up = parseFloat(chg)>=0;
  const meta = document.getElementById('dp-meta');
  meta.innerHTML = `<span class="${up?'up':'dn'}">${chg}</span><span>板块行情</span>`;
  document.getElementById('dp-pb').innerHTML = '';
  document.getElementById('dp-cw').innerHTML = `<div style="height:180px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:11px;flex-direction:column;gap:8px">
    <span>点击下方链接查看 K 线图</span>
  </div>`;
  document.getElementById('dp-s').innerHTML = '';
  document.getElementById('dp-tags').innerHTML = '';
  const links = [
    {t:`${name} — 实时行情`,url,s:'跳转'},
    ...(cat==='A股'?[{t:'同花顺 板块数据',url:'https://q.10jqka.com.cn/',s:'同花顺'},{t:'东方财富 板块列表',url:'https://quote.eastmoney.com/center/boardlist.html',s:'东财'}]:[]),
    ...(cat==='美股'?[{t:'Finviz 热力图',url:'https://finviz.com/map.ashx',s:'Finviz'},{t:'TradingView',url:`https://www.tradingview.com/`,s:'TV'}]:[]),
    ...(cat==='大宗'?[{t:'Investing.com 大宗商品',url:'https://cn.investing.com/commodities/',s:'Investing'}]:[]),
    ...(cat==='全球'?[{t:'TradingView 全球指数',url:'https://www.tradingview.com/markets/world-indices/',s:'TV'}]:[]),
  ];
  document.getElementById('dp-l').innerHTML = links.map(l=>`<a class="dpl" href="${l.url}" target="_blank"><span class="dplt">${l.t} <span class="et">${l.s}</span></span><span class="dpla">↗</span></a>`).join('');
  document.getElementById('dp').classList.add('open');
}

async function openCoin(coinId, name) {
  document.getElementById('dp-t').textContent = name;
  document.getElementById('dp-p').textContent = '$…';
  document.getElementById('dp-meta').textContent = '加载中...';
  document.getElementById('dp').classList.add('open');
  document.getElementById('dp-pb').innerHTML = `<div class="pg" style="margin-bottom:10px">
    ${[['1','1天'],['7','7天'],['30','1月'],['90','3月'],['365','1年'],['max','全部']].map(([d,l])=>`<button class="pill ${d==='30'?'active':''}" onclick="swp(this);loadDPChart('${coinId}','${d}')">${l}</button>`).join('')}
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
    dpInst = chart;
    const up=prices.length>1&&prices[prices.length-1][1]>=prices[0][1];
    const s=chart.addAreaSeries({lineColor:up?'#f85149':'#3fb950',topColor:up?'rgba(248,81,73,.22)':'rgba(63,185,80,.22)',bottomColor:'rgba(0,0,0,0)',lineWidth:1.5,priceLineVisible:false});
    s.setData(prices.map(([ts,v])=>({time:Math.floor(ts/1000),value:v})));
    chart.timeScale().fitContent();
    const last=prices[prices.length-1],first=prices[0];
    if(last&&first){
      const chg=((last[1]-first[1])/first[1]*100).toFixed(2);
      upd('dp-p','$'+last[1].toLocaleString('en-US',{maximumFractionDigits:2}));
      const meta=document.getElementById('dp-meta');
      meta.innerHTML=`<span class="${parseFloat(chg)>=0?'up':'dn'}">${(parseFloat(chg)>=0?'+':'')+chg}%</span><span>({'1':'1天','7':'7天','30':'1月','90':'3月','365':'1年','max':'全部'}[days]||days)</span>`;
    }
    new ResizeObserver(()=>{if(w.offsetWidth>0)chart.resize(w.offsetWidth,200);}).observe(w);
  } catch(e) {w.innerHTML='<div style="height:200px;display:flex;align-items:center;justify-content:center;color:var(--text3)">加载失败</div>';}
}

async function loadDPInfo(coinId) {
  try {
    const info = await cachedFetch(API.cgCoin(coinId),300000);
    const md = info.market_data||{};
    upd('dp-p','$'+(md.current_price?.usd||0).toLocaleString('en-US',{maximumFractionDigits:2}));
    const stats=[
      {l:'当前价格',v:'$'+(md.current_price?.usd||0).toLocaleString('en-US',{maximumFractionDigits:2})},
      {l:'市值排名',v:'#'+(info.market_cap_rank||'—')},
      {l:'总市值',v:fmtM(md.market_cap?.usd)},
      {l:'24H交易量',v:fmtM(md.total_volume?.usd)},
      {l:'7D涨跌',v:fmtP(md.price_change_percentage_7d)},
      {l:'30D涨跌',v:fmtP(md.price_change_percentage_30d)},
      {l:'历史最高',v:md.ath?.usd?'$'+md.ath.usd.toLocaleString('en-US',{maximumFractionDigits:2}):'—'},
      {l:'流通量',v:md.circulating_supply?md.circulating_supply.toLocaleString('en-US',{maximumFractionDigits:0}):'—'},
    ];
    document.getElementById('dp-s').innerHTML = stats.map(s=>`<div class="dpst"><div class="dpstl">${s.l}</div><div class="dpstv">${s.v}</div></div>`).join('');
    // Tags
    const tags = (info.categories||[]).slice(0,6);
    document.getElementById('dp-tags').innerHTML = tags.map(t=>`<span class="dp-tag">${t}</span>`).join('');
    // Links including Twitter
    const tw = info.links?.twitter_screen_name;
    const links = [
      {t:`CoinGecko — ${info.name}`,url:`https://www.coingecko.com/en/coins/${coinId}`,s:'CoinGecko'},
      {t:`TradingView — ${(info.symbol||'').toUpperCase()}USD`,url:`https://www.tradingview.com/symbols/${(info.symbol||'btc').toUpperCase()}USD/`,s:'TradingView'},
    ];
    if(tw) links.push({t:`@${tw} — Twitter/X`,url:`https://twitter.com/${tw}`,s:'Twitter'});
    if(info.links?.homepage?.[0]) links.push({t:`${info.name} 官方网站`,url:info.links.homepage[0],s:'官网'});
    if(info.links?.blockchain_site?.[0]) links.push({t:'链上数据浏览器',url:info.links.blockchain_site[0],s:'链上'});
    if(info.links?.subreddit_url) links.push({t:`r/${info.symbol} Reddit`,url:info.links.subreddit_url,s:'Reddit'});
    document.getElementById('dp-l').innerHTML = links.map(l=>`<a class="dpl" href="${l.url}" target="_blank"><span class="dplt">${l.t} <span class="et">${l.s}</span></span><span class="dpla">↗</span></a>`).join('');
  } catch(e) {}
}