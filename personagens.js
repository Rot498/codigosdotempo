// Personagens (SVG) e cenários de fundo. Sem imagens externas.
const PERS = {
  babbage: { nome: "Charles Babbage", pele: "#f0c9a0", cabelo: "#9aa0a8", estilo: "costeletas", roupa: "#6b3f1d", acc: "cartola" },
  turing:  { nome: "Alan Turing", pele: "#f2cfae", cabelo: "#3b2a1d", estilo: "curto", roupa: "#2f4a36", acc: "gravata" },
  ada:     { nome: "Ada Lovelace", pele: "#f4d6bd", cabelo: "#2b1b14", estilo: "cachos", roupa: "#7a2f5b", acc: "laco" },
  almeida: { nome: "Prof. Almeida", pele: "#e9bf98", cabelo: "#eeeeee", estilo: "calvo", roupa: "#3d5a80", acc: "oculos" },
  robo:    { nome: "Robô T-1", robo: true }
};
const BOCA = { feliz: "M33 57Q45 68 57 57", triste: "M34 63Q45 55 56 63", neutro: "M36 60H54", surpreso: "M45 56a4 5 0 1 0 .1 0" };
const SOB = { feliz: ["M29 36Q35 31 42 35", "M48 35Q55 31 61 36"], triste: ["M29 34L42 38", "M61 34L48 38"], neutro: ["M30 36H42", "M48 36H60"], surpreso: ["M29 32Q35 27 42 31", "M48 31Q55 27 61 32"] };

function personagem(id, emo = "neutro") {
  const p = PERS[id], b = BOCA[emo] || BOCA.neutro, s = SOB[emo] || SOB.neutro;
  if (p.robo) {
    const r = emo === "surpreso" ? 7 : 5;
    return `<svg viewBox="0 -8 90 108"><rect x="44" y="-4" width="2" height="16" fill="#8aa"/><circle cx="45" cy="-4" r="4" fill="#3fd8ff"/><rect x="14" y="12" width="62" height="62" rx="12" fill="#9fb3c8"/><rect x="22" y="22" width="46" height="34" rx="8" fill="#0b1630"/><circle class="olho" cx="36" cy="38" r="${r}" fill="#3fd8ff"/><circle class="olho" cx="54" cy="38" r="${r}" fill="#3fd8ff"/><path d="${b}" transform="translate(0,2)" fill="none" stroke="#3fd8ff" stroke-width="3" stroke-linecap="round"/><rect x="26" y="76" width="38" height="24" rx="6" fill="#7b8fa6"/></svg>`;
  }
  const c = p.cabelo;
  const hair = {
    curto: `<path d="M19 44Q19 16 45 16Q71 16 71 44Q60 28 45 28Q30 28 19 44Z" fill="${c}"/>`,
    costeletas: `<path d="M19 44Q19 16 45 16Q71 16 71 44Q60 28 45 28Q30 28 19 44Z" fill="${c}"/><rect x="17" y="38" width="8" height="24" rx="4" fill="${c}"/><rect x="65" y="38" width="8" height="24" rx="4" fill="${c}"/>`,
    cachos: `<circle cx="45" cy="22" r="15" fill="${c}"/><circle cx="22" cy="44" r="10" fill="${c}"/><circle cx="68" cy="44" r="10" fill="${c}"/><circle cx="24" cy="62" r="7" fill="${c}"/><circle cx="66" cy="62" r="7" fill="${c}"/>`,
    calvo: `<ellipse cx="20" cy="46" rx="6" ry="11" fill="${c}"/><ellipse cx="70" cy="46" rx="6" ry="11" fill="${c}"/>`
  }[p.estilo];
  const acc = {
    cartola: `<rect x="28" y="-6" width="34" height="26" rx="3" fill="#222"/><rect x="21" y="17" width="48" height="6" rx="3" fill="#222"/>`,
    oculos: `<circle cx="36" cy="46" r="7" fill="none" stroke="#222" stroke-width="2"/><circle cx="54" cy="46" r="7" fill="none" stroke="#222" stroke-width="2"/><path d="M43 46h4" stroke="#222" stroke-width="2"/>`,
    gravata: `<path d="M40 74l5 10 5-10z" fill="#c0392b"/>`,
    laco: `<path d="M45 12L33 5v14zM45 12L57 5v14z" fill="#ff7eb6"/>`
  }[p.acc] || "";
  return `<svg viewBox="0 -8 90 108"><path d="M10 100Q12 74 45 74Q78 74 80 100Z" fill="${p.roupa}"/><circle cx="45" cy="46" r="26" fill="${p.pele}"/>${hair}<circle class="olho" cx="36" cy="46" r="3" fill="#222"/><circle class="olho" cx="54" cy="46" r="3" fill="#222"/>${s.map(d => `<path d="${d}" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round"/>`).join("")}<path d="${b}" stroke="#7a2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>${acc}</svg>`;
}

function cena(e) {
  const g = (x, y, r, col) => `<g class="gira" style="--d:${r > 30 ? 20 : 12}s"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="${r / 3}" stroke-dasharray="${r / 2.2} ${r / 2.2}"/><circle cx="${x}" cy="${y}" r="${r / 3}" fill="${col}"/></g>`;
  const bg = (a, b) => `<defs><linearGradient id="g${e}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="140" fill="url(#g${e})"/>`;
  const T = {
    babbage: bg("#3a2614", "#1a1008") + g(110, 70, 44, "#b8742a") + g(190, 100, 26, "#e0a845") + g(650, 60, 50, "#b8742a") + g(735, 112, 28, "#e0a845") + `<rect x="300" y="36" width="200" height="84" rx="6" fill="#2a1a0c" stroke="#e0a845" stroke-width="2"/>` + [330, 370, 410, 450].map(x => `<rect x="${x}" y="48" width="24" height="60" rx="3" fill="#b8742a"/>`).join(""),
    turing: bg("#0a1a10", "#050d08") + [0, 1, 2, 3, 4].map(i => `<rect x="${40 + i * 70}" y="${90 - i % 3 * 12}" width="54" height="50" fill="#14301f" stroke="#1f5a37"/>`).join("") + `<circle cx="650" cy="70" r="56" fill="none" stroke="#4be08a" stroke-width="2"/><circle cx="650" cy="70" r="28" fill="none" stroke="#1f9d57"/><g class="gira" style="--d:4s"><line x1="650" y1="70" x2="650" y2="14" stroke="#4be08a" stroke-width="3"/></g><rect x="360" y="52" width="130" height="62" rx="6" fill="#0f2a1a" stroke="#4be08a"/><text x="425" y="90" fill="#4be08a" font-family="monospace" font-size="16" text-anchor="middle">ENIGMA</text>`,
    futuro: bg("#0a1230", "#050a1a") + Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${i * 18 + 20}" x2="800" y2="${i * 18 + 20}" stroke="#3fd8ff" stroke-opacity=".12"/>`).join("") + `<circle cx="130" cy="70" r="40" fill="none" stroke="#3fd8ff" stroke-width="2"/><circle cx="130" cy="70" r="24" fill="none" stroke="#6a5cff" stroke-width="2"/>${g(680, 70, 36, "#6a5cff")}<rect x="385" y="14" width="30" height="112" fill="#3fd8ff" fill-opacity=".18"/><circle cx="400" cy="70" r="12" fill="#3fd8ff"/>`
  };
  return `<svg viewBox="0 0 800 140" preserveAspectRatio="xMidYMid slice">${T[e]}</svg>`;
}
