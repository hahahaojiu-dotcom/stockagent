// ══════════════════════════════════════════════
// market.js — 市场总览模块
// 包含：加密货币价格（OKX）、A股数据（东财）
//        美股、黄金、原油、恐慌贪婪指数、K线图
// 修改这里：行情数据来源、备用静态数据
// ══════════════════════════════════════════════
// ══ MARKET ══
async function loadMarket() {
  // BTC/ETH/SOL via OKX
  for(const [id,vid,cid,col] of [['BTC-USDT','m-btc','m-btc-c','var(--yellow)'],['ETH-USDT','m-eth','m-eth-c','var(--blue)'],['SOL-USDT','m-sol','m-sol-c','#9945ff']]) {
    try {
      const d = await cachedFetch(API.okxTicker(id), 30000);
      const t = d.data?.[0]; if(!t) continue;
      const price = parseFloat(t.last), open = parseFloat(t.open24h), chg = (price-open)/open*100;
      upd(vid, '$'+price.toLocaleString('en-US',{maximumFractionDigits:2}));
      updStyle(vid,'color',col);
      upd(cid, (chg>=0?'▲ +':'▼ ')+Math.abs(chg).toFixed(2)+'%');
      updStyle(cid,'color',chg>=0?'var(--red)':'var(--green)');
    } catch(e) {}
  }
  loadFearGreed();
  // A股
  for(const [code,vid,cid] of [['1.000001','m-sh','m-sh-c'],['0.399001','m-sz','m-sz-c'],['0.399006','m-cy','m-cy-c'],['1.000300','m-hs3','m-hs3-c']]) {
    try {
      const d = await cachedFetch(API.efdata(code), 60000);
      const f = d.data; if(!f) continue;
      const price = (f.f43/100).toFixed(2);
      const chg = f.f170!=null ? (f.f170/100).toFixed(2) : ((f.f43-f.f46)/f.f46*100).toFixed(2);
      const up = parseFloat(chg)>=0;
      upd(vid, parseFloat(price).toLocaleString());
      updStyle(vid,'color',up?'var(--red)':'var(--green)');
      upd(cid, (up?'▲ +':'▼ ')+chg+'%');
      updStyle(cid,'color',up?'var(--red)':'var(--green)');
    } catch(e) {
      const fb = {'m-sh':['4,004.65','+0.97%',true],'m-sz':['14,322.57','+2.33%',true],'m-cy':['2,142.55','+1.23%',true],'m-hs3':['3,981.22','+0.39%',true]};
      const [p,c,u] = fb[vid]||['—','—',true];
      upd(vid,p); updStyle(vid,'color',u?'var(--red)':'var(--green)');
      upd(cid,(u?'▲ +':'▼ ')+c); updStyle(cid,'color',u?'var(--red)':'var(--green)');
    }
  }
  // Gold & Oil
  try {
    const d = await cachedFetch(API.okxTicker('XAU-USD'), 60000);
    const t = d.data?.[0]; if(t) {
      const p=parseFloat(t.last),o=parseFloat(t.open24h),c=(p-o)/o*100;
      upd('m-gold','$'+p.toLocaleString('en-US',{maximumFractionDigits:2}));
      upd('m-gold-c',(c>=0?'▲ +':'▼ ')+Math.abs(c).toFixed(2)+'%');
      updStyle('m-gold-c','color',c>=0?'var(--red)':'var(--green)');
    }
  } catch(e) { upd('m-gold','$4,750.10'); upd('m-gold-c','▲ +0.34%'); }
  try {
    const d = await cachedFetch(API.okxTicker('CRUDE_OIL-USD'), 60000);
    const t = d.data?.[0]; if(t) {
      const p=parseFloat(t.last),o=parseFloat(t.open24h),c=(p-o)/o*100;
      upd('m-oil','$'+p.toFixed(2));
      upd('m-oil-c',(c>=0?'▲ +':'▼ ')+Math.abs(c).toFixed(2)+'%');
      updStyle('m-oil-c','color',c>=0?'var(--red)':'var(--green)');
    }
  } catch(e) { upd('m-oil','$98.75'); upd('m-oil-c','▲ +0.90%'); }
}

// ══ FEAR & GREED ══
async function loadFearGreed() {
  try {
    const d = await cachedFetch(API.fng(5), 600000);
    const vals = d.data||[], cur = vals[0]||{};
    const score = parseInt(cur.value||50), label = cur.value_classification||'—';
    let col = 'var(--yellow)';
    if(score<25) col='var(--red)'; else if(score<45) col='var(--orange)'; else if(score<55) col='var(--yellow)'; else if(score<75) col='var(--green)'; else col='var(--accent)';
    ['m-fg','fg-num'].forEach(id=>{upd(id,score);updStyle(id,'color',col);});
    ['m-fg-l','fg-lab'].forEach(id=>{upd(id,label);updStyle(id,'color',col);});
    const arc=document.getElementById('fg-arc'); if(arc){arc.setAttribute('stroke-dasharray',`${score/100*94} 94`);arc.setAttribute('stroke',col);}
    if(vals[1]) upd('fg-y',vals[1].value+' ('+vals[1].value_classification+')');
    if(vals[2]) upd('fg-w',vals[2].value+' ('+vals[2].value_classification+')');
    if(vals[4]) upd('fg-m',vals[4].value+' ('+vals[4].value_classification+')');
  } catch(e) {}
}

// ══ CHARTS ══
let mcI=null, dpI=null, ocI=null;
async function buildChart(container, coinId, days, priceEl, chgEl, instRef) {
  container.innerHTML = '<div class="cl-msg">加载中...</div>';
  try {
    const d = await cachedFetch(API.cgChart(coinId,days), 60000);
    const prices = d.prices||[]; container.innerHTML='';
    if(instRef.v){try{instRef.v.remove();}catch(e){}}
    const chart = LightweightCharts.createChart(container, {width:container.offsetWidth,height:container.clientHeight||260,layout:{background:{color:'transparent'},textColor:'#8b949e'},grid:{vertLines:{color:'rgba(255,255,255,0.04)'},horzLines:{color:'rgba(255,255,255,0.04)'}},rightPriceScale:{borderColor:'rgba(255,255,255,0.08)'},timeScale:{borderColor:'rgba(255,255,255,0.08)',timeVisible:true}});
    instRef.v = chart;
    const up = prices.length>1 && prices[prices.length-1][1]>=prices[0][1];
    const s = chart.addAreaSeries({lineColor:up?'#f85149':'#3fb950',topColor:up?'rgba(248,81,73,.22)':'rgba(63,185,80,.22)',bottomColor:'rgba(0,0,0,0)',lineWidth:1.5,priceLineVisible:false});
    s.setData(prices.map(([ts,v])=>({time:Math.floor(ts/1000),value:v})));
    chart.timeScale().fitContent();
    const last=prices[prices.length-1],first=prices[0];
    if(last&&first){
      const chg=((last[1]-first[1])/first[1]*100).toFixed(2);
      if(priceEl) upd(priceEl,'$'+last[1].toLocaleString('en-US',{maximumFractionDigits:2}));
      if(chgEl){upd(chgEl,(chg>=0?'+':'')+chg+'%');updStyle(chgEl,'color',parseFloat(chg)>=0?'var(--red)':'var(--green)');}
    }
    new ResizeObserver(()=>{if(container.offsetWidth>0)chart.resize(container.offsetWidth,container.clientHeight||260);}).observe(container);
  } catch(e) {container.innerHTML='<div class="cl-msg">图表加载失败</div>';}
}
function loadMC(days){buildChart(document.getElementById('mc-b'),'bitcoin',days,'mc-p','mc-c',{get v(){return mcI},set v(x){mcI=x}});}
function loadOCChart(days){buildChart(document.getElementById('oc-chart'),'bitcoin',days,'oc-cp','oc-cc',{get v(){return ocI},set v(x){ocI=x}});}