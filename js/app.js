// ══════════════════════════════════════════════
// app.js — 应用初始化入口
// 包含：自动刷新定时器、页面初始化
// 修改这里：刷新频率、初始化逻辑
// ══════════════════════════════════════════════
// ══ AUTO REFRESH ══
setInterval(()=>{ if(curPage==='hotspot')renderAllNews(); if(curPage==='market')loadMarket(); if(curPage==='onchain')loadOnchain(); }, 180000);
setInterval(()=>{ if(curPage==='crypto')loadCrypto(curCat); if(curPage==='msx')loadMSCrypto(); loadFearGreed(); }, 300000);

// ══ INIT ══
async function init() {
  renderAllNews();
  loadGH('list-gh');
  renderETF();
  renderMSXDynamic();
  renderRWA();
  renderSectors('A股');
  renderCalendar();
  document.getElementById('ticker').innerHTML='<span style="color:var(--text3)">正在加载实时行情...</span>';
  try {
    const d = await cachedFetch(API.cgMarkets('bitcoin,ethereum,solana,binancecoin'), 120000);
    updateTicker(d);
  } catch(e){}
  loadFearGreed();
  loadMSCrypto();
}
init();