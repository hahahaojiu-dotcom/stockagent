// ══════════════════════════════════════════════
// onchain.js — BTC链上数据模块
// 包含：算力、区块高度、减半倒计时
//        200WMA、ahr999定投指数、矿工成本
//        恐慌贪婪指数、BTC价格走势图
// 修改这里：链上数据来源、计算公式
// ══════════════════════════════════════════════
// ══ ONCHAIN ══
async function loadOnchain() {
  loadFearGreed(); loadOCChart('30');
  try {
    const d = await cachedFetch(API.okxTicker('BTC-USDT'),30000);
    const t=d.data?.[0]; if(t){const p=parseFloat(t.last),o=parseFloat(t.open24h),c=(p-o)/o*100;upd('oc-price','$'+p.toLocaleString('en-US',{maximumFractionDigits:2}));upd('oc-price-c',(c>=0?'▲ +':'▼ ')+Math.abs(c).toFixed(2)+'%');updStyle('oc-price-c','color',c>=0?'var(--red)':'var(--green)');}
  } catch(e) {}
  try {
    const d = await cachedFetch(API.mempoolHash(),120000);
    const hr = d.currentHashrate||d.hashrate;
    if(hr) { upd('oc-hash',(hr/1e18).toFixed(1)); }
  } catch(e) { upd('oc-hash','911.9'); }
  try {
    const height = await cachedFetch(API.mempoolHeight(),60000);
    if(height){
      upd('oc-block',parseInt(height).toLocaleString());
      const next = Math.ceil(height/210000)*210000, rem = next-height;
      const daysLeft = Math.floor(rem*10/60/24);
      upd('oc-block-s',`距减半 ${rem.toLocaleString()} 区块`);
      upd('oc-halving',daysLeft+'天');
      const hd = new Date(Date.now()+daysLeft*86400000);
      upd('oc-halving-s','预计 '+hd.toLocaleDateString('zh-CN'));
    }
  } catch(e) { upd('oc-block','944,417'); upd('oc-halving','~733天'); }
  try {
    const d = await cachedFetch(API.cgGlobal(),300000);
    const data = d.data||{};
    const dom = (data.market_cap_percentage?.btc||0).toFixed(1);
    const mcap = data.total_market_cap?.usd||0;
    upd('oc-dom',dom+'%'); upd('oc-dom-s',parseFloat(dom)>55?'↑ 避险偏好':'↓ 山寨季信号');
    upd('oc-mcap','$'+(mcap/1e12).toFixed(2)+'T');
  } catch(e) {}
  try {
    const wd = await cachedFetch(API.okxCandles('BTC-USDT','1W','200'),3600000);
    const wc = wd.data||[];
    if(wc.length>=200){
      const closes = wc.map(c=>parseFloat(c[4])).reverse();
      const n=200,sw=closes.slice(-n).reduce((s,v,i)=>{const w=i+1;return s+v*w;},0)/closes.slice(-n).reduce((s,_,i)=>s+(i+1),0);
      const cur = closes[closes.length-1];
      upd('oc-wma','$'+Math.round(sw).toLocaleString()); upd('oc-wma-s',`当前/${(cur/sw).toFixed(2)}x 200WMA`);
      const dd = await cachedFetch(API.okxCandles('BTC-USDT','1D','200'),3600000);
      const dc = dd.data||[];
      if(dc.length>=200){
        const dcloses = dc.map(c=>parseFloat(c[4])).reverse();
        const dma = dcloses.slice(-200).reduce((s,v)=>s+v,0)/200;
        const lm = Math.exp(dcloses.reduce((s,v)=>s+Math.log(v),0)/dcloses.length);
        const ahr = (cur/dma)*(cur/lm);
        upd('oc-ahr',ahr.toFixed(3)); upd('oc-ahr-s',ahr<0.45?'🟢 适合定投':ahr<1.2?'🟡 可定投':'🔴 暂停定投');
        const bp = dma*0.6+sw*0.4;
        upd('oc-bp','$'+Math.round(bp).toLocaleString()); upd('oc-bp-s',cur>bp*1.3?'偏高估值':cur<bp*0.8?'偏低估值':'正常估值区间');
      }
    }
  } catch(e) {}
}