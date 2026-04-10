// ══════════════════════════════════════════════
// crypto.js — 加密货币列表模块
// 数据来源：OKX 公开 API（全量现货交易对）
// 分类：总排行/市值排行/Layer1/Layer2/DeFi/Web3/Meme/GameFi/RWA
// ══════════════════════════════════════════════

const OKX_CATS = {
  all: null, // 全量从OKX拉取
  mcap: ['BTC-USDT','ETH-USDT','BNB-USDT','SOL-USDT','XRP-USDT','ADA-USDT','AVAX-USDT','DOGE-USDT','TRX-USDT','DOT-USDT','MATIC-USDT','LTC-USDT','SHIB-USDT','LINK-USDT','BCH-USDT','UNI-USDT','ATOM-USDT','XLM-USDT','ETC-USDT','NEAR-USDT','APT-USDT','ICP-USDT','FIL-USDT','HBAR-USDT','VET-USDT','ALGO-USDT','EGLD-USDT','XMR-USDT','EOS-USDT','THETA-USDT'],
  layer1: ['BTC-USDT','ETH-USDT','SOL-USDT','BNB-USDT','ADA-USDT','AVAX-USDT','TRX-USDT','DOT-USDT','NEAR-USDT','APT-USDT','ICP-USDT','ATOM-USDT','ALGO-USDT','HBAR-USDT','XTZ-USDT','EGLD-USDT','ONE-USDT','ZIL-USDT','KAVA-USDT','FTM-USDT','WAVES-USDT','MINA-USDT','ROSE-USDT','SUI-USDT','TON-USDT','SEI-USDT','INJ-USDT','TIA-USDT','OSMO-USDT','CELO-USDT'],
  layer2: ['MATIC-USDT','OP-USDT','ARB-USDT','LRC-USDT','IMX-USDT','METIS-USDT','BOBA-USDT','SKL-USDT','CELR-USDT','STRK-USDT','MANTA-USDT'],
  defi: ['UNI-USDT','AAVE-USDT','MKR-USDT','CRV-USDT','COMP-USDT','YFI-USDT','SUSHI-USDT','1INCH-USDT','BAL-USDT','SNX-USDT','LDO-USDT','CVX-USDT','PENDLE-USDT','RUNE-USDT','GMX-USDT','CAKE-USDT','DYDX-USDT','FXS-USDT','SPELL-USDT','BAND-USDT','KNC-USDT','ZRX-USDT','RDNT-USDT','JOE-USDT','ALPHA-USDT','OGN-USDT','PERP-USDT','ANKR-USDT','GNO-USDT','VELO-USDT'],
  web3: ['LINK-USDT','FIL-USDT','GRT-USDT','STORJ-USDT','OCEAN-USDT','HNT-USDT','LPT-USDT','RNDR-USDT','AKT-USDT','FLUX-USDT','AR-USDT','SC-USDT','GLM-USDT','NMR-USDT','API3-USDT','UMA-USDT','PYTH-USDT','WLD-USDT','TAO-USDT','FET-USDT','AGIX-USDT'],
  meme: ['DOGE-USDT','SHIB-USDT','PEPE-USDT','FLOKI-USDT','BONK-USDT','WIF-USDT','BOME-USDT','MEW-USDT','NEIRO-USDT','TURBO-USDT','POPCAT-USDT','MOG-USDT','PONKE-USDT','GOAT-USDT','MOODENG-USDT','PNUT-USDT','ACT-USDT','GIGA-USDT','FWOG-USDT'],
  gamefi: ['AXS-USDT','SAND-USDT','MANA-USDT','GALA-USDT','ILV-USDT','ENJ-USDT','ALICE-USDT','TLM-USDT','SLP-USDT','MOBOX-USDT','GODS-USDT','MC-USDT','GAL-USDT','AGLD-USDT','PRIME-USDT','BEAM-USDT','PIXEL-USDT','PORTAL-USDT','RONIN-USDT'],
  rwa: ['ONDO-USDT','OM-USDT','CFG-USDT','MPL-USDT','GFI-USDT','TRU-USDT','CPOOL-USDT','PAXG-USDT','XAUT-USDT'],
};

// OKX上各币种对应的Twitter账号（用于详情页跳转）
const COIN_TWITTER = {
  'BTC':'bitcoin','ETH':'ethereum','SOL':'solana','BNB':'BNBCHAIN','XRP':'Ripple',
  'ADA':'Cardano','AVAX':'avax','DOGE':'dogecoin','TRX':'Tronfoundation','DOT':'Polkadot',
  'MATIC':'0xPolygon','LTC':'LitecoinProject','SHIB':'Shibtoken','LINK':'chainlink',
  'BCH':'BitcoinCashOrg','UNI':'Uniswap','ATOM':'cosmos','XLM':'StellarOrg',
  'ETC':'eth_classic','NEAR':'nearprotocol','APT':'Aptos_Network','ICP':'dfinity',
  'FIL':'Filecoin','HBAR':'hedera','VET':'vechainofficial','ALGO':'Algorand',
  'XMR':'monero','EOS':'block_one_','THETA':'Theta_Network','OP':'Optimism',
  'ARB':'arbitrum','LRC':'loopringorg','IMX':'immutablex','AAVE':'AaveAave',
  'MKR':'MakerDAO','CRV':'CurveFinance','COMP':'compoundfinance','YFI':'iearnfinance',
  'SUSHI':'SushiSwap','1INCH':'1inch','SNX':'synthetix_io','LDO':'LidoFinance',
  'PENDLE':'pendle_fi','RUNE':'THORChain','GMX':'GMX_IO','CAKE':'pancakeswap',
  'DYDX':'dYdX','GRT':'graphprotocol','OCEAN':'OceanProtocol','RNDR':'rendernetwork',
  'AR':'onlyarweave','FET':'Fetch_ai','WLD':'worldcoin','TAO':'bittensor_',
  'PEPE':'pepecoineth','FLOKI':'RealFlokiInu','BONK':'bonk_inu','WIF':'dogwifcoin',
  'AXS':'AxieInfinity','SAND':'TheSandboxGame','MANA':'decentraland','GALA':'GoGalaGames',
  'ENJ':'enjin','ONDO':'OndoFinance','PAXG':'PaxosGlobal','XAUT':'TetherTo',
  'INJ':'Injective_','TIA':'celestia','SEI':'SeiNetwork','SUI':'SuiNetwork',
  'TON':'ton_blockchain','STRK':'StarkWareLtd','MANTA':'mantanetwork',
};

let curCat = 'all';
let okxAllTickers = [];

function okxToRow(t, rank) {
  const price = parseFloat(t.last);
  const open = parseFloat(t.open24h);
  const chg24 = open > 0 ? (price - open) / open * 100 : 0;
  const sym = t.instId.replace(/-USDT$|-USDC$/,'');
  return { rank, id: t.instId, symbol: sym, name: sym, price, chg24,
    volCcy: parseFloat(t.volCcy24h),
    image: `https://static.okx.com/cdn/oksupport/asset/currency/icon/${sym.toLowerCase()}.png` };
}

async function loadCrypto(cat) {
  curCat = cat || 'all';
  const el = document.getElementById('ct-body'); if(!el) return;
  el.innerHTML = '<div class="skel" style="margin:12px"></div><div class="skel" style="margin:12px;width:72%"></div><div class="skel" style="margin:12px;width:85%"></div>';
  try {
    if(cat === 'all' || cat === 'mcap') {
      if(!okxAllTickers.length) {
        const d = await cachedFetch(API.okxTickers(), 60000);
        okxAllTickers = (d.data||[])
          .filter(t => t.instId.endsWith('-USDT') && parseFloat(t.volCcy24h) > 50)
          .sort((a,b) => parseFloat(b.volCcy24h) - parseFloat(a.volCcy24h));
      }
      const items = okxAllTickers.slice(0, cat==='mcap' ? 50 : 150);
      upd('cr-count', items.length+'个币种 · OKX');
      renderCryptoTable(items.map((t,i) => okxToRow(t, i+1)));
    } else {
      const pairs = OKX_CATS[cat] || [];
      const results = [];
      for(let i=0; i<pairs.length; i+=10) {
        const batch = pairs.slice(i, i+10);
        const res = await Promise.all(batch.map(id =>
          cachedFetch(API.okxTicker(id), 30000).then(d=>d.data?.[0]).catch(()=>null)
        ));
        results.push(...res.filter(Boolean));
      }
      upd('cr-count', results.length+'个币种 · OKX');
      renderCryptoTable(results.map((t,i) => okxToRow(t, i+1)));
    }
  } catch(e) {
    if(el) el.innerHTML='<div style="padding:16px;text-align:center;color:var(--text3)">加载失败<br><button onclick="loadCrypto(curCat)" style="margin-top:8px;padding:4px 12px;background:var(--bg4);border:1px solid var(--border2);border-radius:5px;cursor:pointer;color:var(--text2);font-size:11px">重试</button></div>';
  }
}

function renderCryptoTable(items) {
  const el = document.getElementById('ct-body'); if(!el) return;
  el.innerHTML = items.map(c => {
    const priceStr = c.price>=1 ? '$'+c.price.toLocaleString('en-US',{maximumFractionDigits:2}) : '$'+c.price.toFixed(c.price<0.0001?8:5);
    const volStr = fmtM(c.volCcy*c.price);
    return `<div class="ct-row" onclick="openCoinOKX('${c.id}','${c.name}','${c.symbol}')">
      <span class="cr-rank">${c.rank}</span>
      <div class="cr-info">
        <div class="cr-ico"><img src="${c.image}" alt="" loading="lazy" onerror="this.parentElement.textContent='${(c.symbol[0]||'?')}'"></div>
        <div><div class="cr-nm">${c.name}</div><div class="cr-sym">${c.symbol} <span class="cr-src src-okx">OKX</span></div></div>
      </div>
      <div class="mv">${priceStr}</div>
      <div class="mv ${c.chg24>=0?'up':'dn'}">${fmtP(c.chg24)}</div>
      <div class="mv fl">—</div>
      <div class="mv" style="color:var(--text2)">${volStr}</div>
      <div class="mv" style="font-size:9px;color:var(--text3)">详情 ›</div>
    </div>`;
  }).join('');
  if(items.length) updateTickerOKX(items.slice(0,8));
}

function updateTickerOKX(items) {
  const parts = items.map(c => {
    const up = c.chg24>=0;
    const price = c.price>=1 ? c.price.toLocaleString() : c.price.toFixed(4);
    return `<span style="color:${up?'var(--red)':'var(--green)'}">${c.symbol} ${up?'▲':'▼'} $${price} (${fmtP(c.chg24)})</span>`;
  });
  const extras = ['<span style="color:var(--accent)">MSX RWA $29.61B</span>','<span style="color:var(--yellow)">黄金 ▲历史新高</span>','<span style="color:var(--yellow)">ETF AUM $63.2B</span>','<span style="color:var(--orange)">VIX 19.49 ▼-24.4%</span>'];
  const all = [...parts,...extras,...parts,...extras];
  const t = document.getElementById('ticker');
  if(t) t.innerHTML = all.join('<span style="color:var(--bg5);margin:0 6px">│</span>');
}

function updateTicker(data) {
  if(!data||!data.length) return;
  const items = data.slice(0,6).map(c => {
    const up=(c.price_change_percentage_24h||0)>=0;
    const price = c.current_price>=1?c.current_price.toLocaleString():c.current_price.toFixed(4);
    return `<span style="color:${up?'var(--red)':'var(--green)'}">${c.symbol.toUpperCase()} ${up?'▲':'▼'} $${price} (${fmtP(c.price_change_percentage_24h||0)})</span>`;
  });
  const extras = ['<span style="color:var(--accent)">MSX RWA $29.61B</span>','<span style="color:var(--yellow)">黄金 ▲历史新高</span>'];
  const all=[...items,...extras,...items,...extras];
  const t=document.getElementById('ticker');
  if(t) t.innerHTML=all.join('<span style="color:var(--bg5);margin:0 6px">│</span>');
}

async function loadMSCrypto() {
  const el = document.getElementById('list-msc'); if(!el) return;
  try {
    const pairs = ['BTC-USDT','ETH-USDT','SOL-USDT','LINK-USDT','ONDO-USDT'];
    const results = await Promise.all(pairs.map(id =>
      cachedFetch(API.okxTicker(id), 30000).then(d=>d.data?.[0]).catch(()=>null)
    ));
    el.innerHTML = results.filter(Boolean).map(t => {
      const price=parseFloat(t.last),open=parseFloat(t.open24h);
      const chg=open>0?(price-open)/open*100:0;
      const up=chg>=0, sym=t.instId.replace('-USDT','');
      const priceStr=price>=1?'$'+price.toLocaleString('en-US',{maximumFractionDigits:2}):'$'+price.toFixed(4);
      return `<a class="nr" onclick="openCoinOKX('${t.instId}','${sym}','${sym}')" style="cursor:pointer;text-decoration:none;color:inherit">
        <div class="cr-ico" style="flex-shrink:0"><img src="https://static.okx.com/cdn/oksupport/asset/currency/icon/${sym.toLowerCase()}.png" style="width:100%;height:100%;border-radius:50%;object-fit:cover" onerror="this.parentElement.textContent='${sym[0]}'"></div>
        <div class="nrc"><div class="nrt">${sym} <span class="cr-sym">USDT</span></div></div>
        <div style="text-align:right"><div style="font-family:var(--mono);font-size:11px;font-weight:600">${priceStr}</div><div class="nrch ${up?'up':'dn'}">${fmtP(chg)}</div></div>
      </a>`;
    }).join('');
    upd('t-msc', nowS());
  } catch(e) {}
}
