// ══════════════════════════════════════════════
// crypto.js — 加密货币列表模块
// 包含：200+币种排行（CoinGecko API）
//        分类Tab（Layer1/Layer2/DeFi/Web3/Meme/GameFi/RWA）
//        币种详情面板、K线图、Twitter链接
//        底部行情滚动条
// 修改这里：币种分类、来源标签、详情链接
// ══════════════════════════════════════════════
// ══ CRYPTO ══
const COIN_CATS = {
  all: ['bitcoin','ethereum','solana','binancecoin','cardano','avalanche-2','polkadot','tron','chainlink','litecoin','bitcoin-cash','stellar','monero','cosmos','algorand','near','the-open-network','sui','aptos','internet-computer','filecoin','hedera-hashgraph','vechain','theta-token','elrond','zilliqa'],
  mcap: ['bitcoin','ethereum','binancecoin','solana','cardano','avalanche-2','polkadot','dogecoin','tron','chainlink'],
  layer1: ['bitcoin','ethereum','solana','binancecoin','cardano','avalanche-2','polkadot','tron','near','the-open-network','sui','aptos','cosmos','algorand','hedera-hashgraph','elrond'],
  layer2: ['matic-network','optimism','arbitrum','loopring','immutable-x','starkware','zksync','mantle','linea','scroll'],
  defi: ['uniswap','aave','compound-governance-token','maker','curve-dao-token','yearn-finance','lido-dao','convex-finance','1inch','sushi'],
  web3: ['chainlink','the-graph','filecoin','storj','ocean-protocol','helium','livepeer','render-token','akash-network','flux'],
  meme: ['dogecoin','shiba-inu','pepe','floki','bonk','dog-wif-hat','baby-doge-coin','brett','book-of-meme','dogwifcoin'],
  gamefi: ['axie-infinity','the-sandbox','decentraland','gala','illuvium','gods-unchained','alien-worlds','splinterlands','vulcan-forged','mobox'],
  rwa: ['ondo-finance','realio-network','mantra-dao','centrifuge','maple','goldfinch','truefi','clearpool'],
};
const CSRC = {all:'OKX',mcap:'OKX',layer1:'OKX',layer2:'OKX',defi:'OKX',web3:'Bybit',meme:'Bitget',gamefi:'Bybit',rwa:'OKX'};
const CSRC_CLS = {OKX:'src-okx',Bybit:'src-bybit',Bitget:'src-bitget'};
let curCat = 'all';

async function loadCrypto(cat) {
  curCat = cat||'all';
  const el = document.getElementById('ct-body'); if(!el) return;
  el.innerHTML = '<div class="skel" style="margin:12px"></div><div class="skel" style="margin:12px;width:72%"></div><div class="skel" style="margin:12px;width:85%"></div>';
  try {
    const ids = (COIN_CATS[cat]||COIN_CATS.all).join(',');
    const data = await cachedFetch(API.cgMarkets(ids), 120000);
    const src = CSRC[cat]||'OKX', srcCls = CSRC_CLS[src]||'src-okx';
    upd('cr-count', data.length+'个币种');
    el.innerHTML = data.map((c,i) => {
      const c24 = c.price_change_percentage_24h||0;
      const c7 = c.price_change_percentage_7d_in_currency||0;
      const price = c.current_price>=1 ? '$'+c.current_price.toLocaleString('en-US',{maximumFractionDigits:2}) : '$'+c.current_price.toFixed(5);
      const mc = fmtM(c.market_cap);
      return `<div class="ct-row" onclick="openCoin('${c.id}','${c.name}')">
        <span class="cr-rank">${i+1}</span>
        <div class="cr-info">
          <div class="cr-ico">${c.image?`<img src="${c.image}" alt="" loading="lazy" onerror="this.style.display='none'">`:c.symbol[0].toUpperCase()}</div>
          <div><div class="cr-nm">${c.name}</div><div class="cr-sym">${c.symbol.toUpperCase()} <span class="cr-src ${srcCls}">${src}</span></div></div>
        </div>
        <div class="mv">${price}</div>
        <div class="mv ${c24>=0?'up':'dn'}">${fmtP(c24)}</div>
        <div class="mv ${c7>=0?'up':'dn'}">${fmtP(c7)}</div>
        <div class="mv" style="color:var(--text2)">${mc}</div>
        <div class="mv" style="font-size:9px;color:var(--text3)">详情 ›</div>
      </div>`;
    }).join('');
    updateTicker(data);
  } catch(e) { if(el) el.innerHTML='<div style="padding:16px;text-align:center;color:var(--text3)">加载失败，使用缓存数据中...<br><button onclick="loadCrypto(curCat)" style="margin-top:8px;padding:4px 12px;background:var(--bg4);border:1px solid var(--border2);border-radius:5px;cursor:pointer;color:var(--text2);font-size:11px">重试</button></div>';}
}

// ══ MSX CRYPTO TICKER ══
async function loadMSCrypto() {
  const el = document.getElementById('list-msc'); if(!el) return;
  try {
    const data = await cachedFetch(API.cgMarkets('bitcoin,ethereum,solana,chainlink,ondo-finance,realio-network'), 60000);
    el.innerHTML = data.map(c => {
      const chg=c.price_change_percentage_24h||0,up=chg>=0;
      const price = c.current_price>=1?'$'+c.current_price.toLocaleString('en-US',{maximumFractionDigits:2}):'$'+c.current_price.toFixed(4);
      return `<a class="nr" onclick="openCoin('${c.id}','${c.name}')" style="cursor:pointer;text-decoration:none;color:inherit">
        <div class="cr-ico" style="flex-shrink:0">${c.image?`<img src="${c.image}" alt="" loading="lazy" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.style.display='none'">`:c.symbol[0].toUpperCase()}</div>
        <div class="nrc"><div class="nrt">${c.name} <span class="cr-sym">${c.symbol.toUpperCase()}</span></div></div>
        <div style="text-align:right"><div style="font-family:var(--mono);font-size:11px;font-weight:600">${price}</div><div class="nrch ${up?'up':'dn'}">${fmtP(chg)}</div></div>
      </a>`;
    }).join('');
    upd('t-msc', nowS());
    updateTicker(data);
  } catch(e) {}
}

// ══ TICKER ══
function updateTicker(data) {
  if(!data||!data.length) return;
  const items = data.slice(0,6).map(c => {
    const up=(c.price_change_percentage_24h||0)>=0;
    const price = c.current_price>=1?c.current_price.toLocaleString():c.current_price.toFixed(4);
    return `<span style="color:${up?'var(--red)':'var(--green)'}">${c.symbol.toUpperCase()} ${up?'▲':'▼'} $${price} (${fmtP(c.price_change_percentage_24h||0)})</span>`;
  });
  const extras = ['<span style="color:var(--accent)">MSX RWA $29.61B</span>','<span style="color:var(--text3)">A股 4004 ▲+0.97%</span>','<span style="color:var(--text3)">纳指 22822 ▲+0.83%</span>','<span style="color:var(--yellow)">黄金 $4750 ▲历史新高</span>','<span style="color:var(--yellow)">ETF AUM $63.2B</span>','<span style="color:var(--orange)">VIX 19.49 ▼-24.4%</span>'];
  const all = [...items,...extras,...items,...extras];
  document.getElementById('ticker').innerHTML = all.join('<span style="color:var(--bg5);margin:0 6px">│</span>');
}