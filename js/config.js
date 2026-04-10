// ══════════════════════════════════════════════
// config.js — 全局配置、缓存、工具函数、导航
// 修改这里：API地址、代理地址、缓存时间、工具函数
// ══════════════════════════════════════════════
// ══ CONFIG ══
const PROXY = 'https://stockagent-proxy.frs031.workers.dev';
const API = {
  okxTicker: id => `${PROXY}/api/okx/market/ticker?instId=${id}`,
  okxTickers: ids => `${PROXY}/api/okx/market/tickers?instType=SPOT`,
  okxCandles: (id,bar,limit) => `${PROXY}/api/okx/market/candles?instId=${id}&bar=${bar}&limit=${limit}`,
  fng: n => `${PROXY}/api/fng/?limit=${n}`,
  mempoolHash: () => `${PROXY}/api/mempool/v1/mining/hashrate/3d`,
  mempoolHeight: () => `${PROXY}/api/mempool/blocks/tip/height`,
  cgMarkets: ids => `${PROXY}/api/coingecko/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&sparkline=false&price_change_percentage=24h,7d`,
  cgGlobal: () => `${PROXY}/api/coingecko/global`,
  cgCoin: id => `${PROXY}/api/coingecko/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
  cgChart: (id,days) => `${PROXY}/api/coingecko/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
  efdata: code => `${PROXY}/api/efdata/stock/get?ut=bd1d9195e7a64bc5a37adb8e3fc86f18&fltt=2&invt=2&secid=${code}&fields=f43,f44,f45,f46,f47,f48,f57,f58,f107,f170`,
  github: q => `${PROXY}/api/github/search/repositories?q=${q}&sort=stars&order=desc&per_page=10`,
};

// ══ CACHE ══
const CACHE = {};
async function cachedFetch(url, ttlMs = 300000) {
  const now = Date.now();
  if (CACHE[url] && (now - CACHE[url].ts < ttlMs)) return CACHE[url].data;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    CACHE[url] = { data, ts: now };
    return data;
  } catch(e) {
    if (CACHE[url]) { console.warn('Using cached data for:', url); return CACHE[url].data; }
    throw e;
  }
}

// ══ UTILS ══
setInterval(() => { document.getElementById('clock').textContent = new Date().toLocaleTimeString('zh-CN',{hour12:false}); }, 1000);
function swp(el){el.closest('.pg').querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');}
function ft(ts){if(!ts)return'';const d=ts instanceof Date?ts:new Date(ts),now=new Date(),diff=Math.floor((now-d)/1000);if(isNaN(d.getTime()))return'';if(diff<60)return diff+'秒前';if(diff<3600)return Math.floor(diff/60)+'分前';if(diff<86400)return Math.floor(diff/3600)+'小时前';return(d.getMonth()+1)+'/'+(d.getDate());}
function rT(a,b){return new Date(Date.now()-(Math.random()*(b-a)+a)*60000);}
function nc(i){return['n1','n2','n3'][i]||'nx';}
function fmtM(n){if(!n)return'—';if(n>=1e12)return'$'+(n/1e12).toFixed(2)+'T';if(n>=1e9)return'$'+(n/1e9).toFixed(2)+'B';if(n>=1e6)return'$'+(n/1e6).toFixed(0)+'M';return'$'+n.toLocaleString();}
function fmtP(n,d=2){if(n==null)return'—';return(n>=0?'+':'')+n.toFixed(d)+'%';}
function nowS(){return new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})+' 更新';}
function upd(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}
function updStyle(id,s,v){const e=document.getElementById(id);if(e)e.style[s]=v;}

// ══ NAV ══
let curPage = 'hotspot';
function nav(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni,.si').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+id)?.classList.add('active');
  const nm={hotspot:'热点追踪',market:'市场总览',crypto:'加密货币',onchain:'链上数据',sector:'板块行情',msx:'◈ MSX & ETF'};
  document.querySelectorAll('.ni').forEach(b=>{if(b.textContent.trim()===nm[id])b.classList.add('active');});
  curPage = id;
  if(id==='market'){loadMarket();loadMC('1');}
  if(id==='sector')renderSectors('A股');
  if(id==='msx'){renderMSXDynamic();renderRWA();loadMSCrypto();renderETF();}
  if(id==='crypto')loadCrypto('all');
  if(id==='onchain')loadOnchain();
}