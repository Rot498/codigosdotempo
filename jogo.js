// Motor do jogo: interface por promessas (await). Estado, salvamento, mapa, desafios e finais.
const $ = id => document.getElementById(id);
const DIF = [{ n: "Fácil", dano: 15, tempo: 1.5, dica: true }, { n: "Normal", dano: 25, tempo: 1, dica: true }, { n: "Desafio", dano: 34, tempo: .7, dica: false }];
const ERAS = [{ id: "babbage", ano: 1832, nome: "Oficina de Londres", quem: "Babbage" }, { id: "turing", ano: 1942, nome: "Bunker de guerra", quem: "Turing" }, { id: "futuro", ano: 2150, nome: "Laboratório do futuro", quem: "Ada" }];
const S = { nome: "Viajante", est: [0, 0, 0], moedas: 0, frags: new Set(), pistas: [], vistos: new Set(), energia: 100, conf: 0, erros: 0, dif: 1, concl: [false, false, false], trofeus: new Set(), rank: [], minis: 0, ano: 2025, cap: 0, motivo: "" };
const total = () => S.est.reduce((a, b) => a + b, 0);
const log = $("log"), TIMEOUT = Symbol("tempo"), CHAVE = "codigosdotempo-v1";
let teclaAtiva = null;

const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
const add = (el, alvo = log) => { alvo.appendChild(el); el.scrollIntoView({ behavior: "smooth", block: "end" }); return el; };

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify({ nome: S.nome, est: S.est, moedas: S.moedas, frags: [...S.frags], pistas: S.pistas, vistos: [...S.vistos], conf: S.conf, erros: S.erros, dif: S.dif, concl: S.concl, trofeus: [...S.trofeus], rank: S.rank, minis: S.minis })); } catch (e) { /* sem storage */ }
}
function carregar() {
  try { const j = JSON.parse(localStorage.getItem(CHAVE)); if (!j) return false; Object.assign(S, j, { frags: new Set(j.frags), vistos: new Set(j.vistos), trofeus: new Set(j.trofeus) }); return true; } catch (e) { return false; }
}
const temProgresso = () => S.concl.some(Boolean) || S.frags.size > 0;
const zerar = () => Object.assign(S, { est: [0, 0, 0], moedas: 0, frags: new Set(), pistas: [], vistos: new Set(), conf: 0, erros: 0, concl: [false, false, false], energia: 100, ano: 2025, minis: 0 });

function digitar(el, t, fim) {
  if (window.RAPIDO) { el.textContent = t; return; }
  let i = 0; const id = setInterval(() => { el.textContent = t.slice(0, ++i); if (i >= t.length) { clearInterval(id); fim && fim(); } }, 14);
  el.onclick = () => { clearInterval(id); el.textContent = t; fim && fim(); };
}
const travar = () => { teclaAtiva = null; log.querySelectorAll("button,input").forEach(b => { if (!b.closest(".ajuda")) b.disabled = true; }); };

const ui = {
  limpar: () => { log.innerHTML = ""; window.scrollTo(0, 0); },
  titulo: t => add(mk("h2", "titulo", t)),
  arte: t => add(mk("pre", "arte", t)),
  p: (t, c = "txt") => add(mk("p", c, t)),
  logo() { const i = mk("img", "logo-grande"); i.src = "logo.svg"; i.alt = "Códigos do Tempo"; return add(i); },
  cena(e) { const d = mk("div", "cena"); d.innerHTML = cena(e); return add(d); },
  dialogo(q, emo, t) {
    const d = mk("div", "dialogo"), av = mk("div", "av"), b = mk("div", "balao"), tx = mk("p", "");
    av.innerHTML = personagem(q, emo); b.append(mk("b", "nome", PERS[q].nome), tx); d.append(av, b); add(d);
    if (!window.RAPIDO) d.classList.add("falando");
    digitar(tx, t, () => d.classList.remove("falando")); return d;
  },
  botao(label = "Continuar") {
    return new Promise(res => {
      const b = mk("button", "btn btn-principal", label + "  ⏎");
      b.onclick = () => { b.disabled = true; som("clique"); res(); };
      add(b).focus({ preventScroll: true });
    });
  },
  escolher(ops) {
    return new Promise(res => {
      const box = mk("div", "opcoes");
      const fim = i => { teclaAtiva = null; [...box.children].forEach(b => b.disabled = true); box.children[i].classList.add("escolhida"); som("clique"); res(i); };
      ops.forEach((o, i) => { const b = mk("button", "btn"); b.append(mk("span", "num", i + 1), mk("span", "", o)); b.onclick = () => fim(i); box.appendChild(b); });
      teclaAtiva = n => { if (n >= 1 && n <= ops.length) fim(n - 1); };
      add(box);
    });
  },
  explorar(itens) {
    return new Promise(res => {
      const g = mk("div", "objetos"), out = mk("div", "saida"), fim = mk("button", "btn btn-principal", "Seguir para o desafio"), vis = new Set();
      fim.disabled = true;
      itens.forEach((it, i) => {
        const b = mk("button", "objeto"); b.append(mk("span", "ic", it.icone), mk("span", "", it.nome));
        b.onclick = () => {
          som("clique"); if (vis.has(i)) return; vis.add(i); b.classList.add("visto");
          if (!S.vistos.has(it.nome)) { S.vistos.add(it.nome); S.conf += it.conf || 0; }
          if (it.pista && !S.pistas.includes(it.pista)) S.pistas.push(it.pista);
          add(mk("p", "fala", it.icone + " " + it.texto), out);
          if (it.pista) add(mk("p", "dica", "📓 Pista anotada no caderno."), out);
          if (vis.size === itens.length) { fim.disabled = false; fim.focus({ preventScroll: true }); }
        };
        g.append(b);
      });
      fim.onclick = () => { fim.disabled = true; g.querySelectorAll("button").forEach(x => x.disabled = true); res(); };
      add(g); add(out); add(fim);
    });
  },
  booleanos(rotulos) {
    return new Promise(res => {
      const f = mk("div", "form"), checks = [];
      rotulos.forEach(r => {
        const l = mk("label", "sw"), c = mk("input"), v = mk("b", "", "false");
        c.type = "checkbox"; c.onchange = () => { v.textContent = c.checked ? "true" : "false"; som("clique"); };
        l.append(mk("span", "", r), c, v); f.appendChild(l); checks.push(c);
      });
      const ok = mk("button", "btn btn-principal", "Confirmar configuração");
      ok.onclick = () => { ok.disabled = true; checks.forEach(c => c.disabled = true); res(checks.map(c => c.checked)); };
      f.appendChild(ok); add(f);
    });
  },
  lampadas() {
    return new Promise(res => {
      const f = mk("div", "form"), row = mk("div", "lamps"), st = [false, false, false];
      ["A", "B", "C"].forEach((n, i) => {
        const b = mk("button", "lamp"); b.append(mk("span", "bulbo", "💡"), mk("b", "", n));
        b.onclick = () => { st[i] = !st[i]; b.classList.toggle("on", st[i]); som("clique"); }; row.append(b);
      });
      const ok = mk("button", "btn btn-principal", "Fechar circuito");
      ok.onclick = () => { ok.disabled = true; row.querySelectorAll("button").forEach(x => x.disabled = true); res([...st]); };
      f.append(row, ok); add(f);
    });
  },
  bits(n) {
    return new Promise(res => {
      const f = mk("div", "form"), row = mk("div", "bits"), val = mk("div", "binval", "Valor: 0"), bs = [];
      const calc = () => bs.reduce((s, b) => s + (b.textContent === "1" ? +b.dataset.v : 0), 0);
      for (let i = n - 1; i >= 0; i--) {
        const b = mk("button", "bit", "0"), w = mk("div", "bitcol"); b.dataset.v = 2 ** i;
        b.onclick = () => { b.textContent = b.textContent === "0" ? "1" : "0"; b.classList.toggle("on"); val.textContent = "Valor: " + calc(); som("clique"); };
        w.append(mk("small", "", 2 ** i), b); row.append(w); bs.push(b);
      }
      const ok = mk("button", "btn btn-principal", "Confirmar");
      ok.onclick = () => { ok.disabled = true; bs.forEach(b => b.disabled = true); res(calc()); };
      f.append(row, val, ok); add(f);
    });
  },
  cesar(cod) {
    return new Promise(res => {
      let k = 0;
      const f = mk("div", "form"), ctl = mk("div", "rotor"), dec = mk("div", "decod", cod), rot = mk("b", "", "Deslocamento: 0");
      const up = () => { rot.textContent = "Deslocamento: " + k; dec.textContent = cod.replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0) - 65 - k + 26) % 26 + 65)); som("clique"); };
      const m = mk("button", "btn", "◀"), p = mk("button", "btn", "▶");
      m.onclick = () => { k = (k + 25) % 26; up(); }; p.onclick = () => { k = (k + 1) % 26; up(); };
      const ok = mk("button", "btn btn-principal", "Enviar mensagem");
      ok.onclick = () => { ok.disabled = m.disabled = p.disabled = true; res(k); };
      ctl.append(m, rot, p); f.append(mk("div", "cod", "Cifrada: " + cod), ctl, dec, ok); add(f);
    });
  },
  blocos(lista) {
    return new Promise(res => {
      const f = mk("div", "form"), pool = mk("div", "pool"), seq = mk("div", "seq"), btns = [];
      seq.append(mk("small", "dica", "Seu programa (arraste as linhas para reordenar):"));
      const ordem = () => [...seq.querySelectorAll(".linha")].map(l => +l.dataset.i);
      const renum = () => seq.querySelectorAll(".linha").forEach((l, k) => l.firstChild.textContent = (k + 1) + ".");
      const linha = i => {
        const l = mk("div", "linha"); l.dataset.i = i; l.append(mk("span", "", ""), mk("span", "", lista[i]));
        l.onpointerdown = e => { l.setPointerCapture && l.setPointerCapture(e.pointerId); l.classList.add("arrastando"); };
        l.onpointermove = e => {
          if (!l.classList.contains("arrastando")) return;
          const alvo = document.elementFromPoint(e.clientX, e.clientY), t = alvo && alvo.closest && alvo.closest(".linha");
          if (t && t !== l && seq.contains(t)) { const r = t.getBoundingClientRect(); seq.insertBefore(l, e.clientY < r.top + r.height / 2 ? t : t.nextSibling); renum(); }
        };
        l.onpointerup = l.onpointercancel = () => l.classList.remove("arrastando");
        return l;
      };
      lista.map((_, i) => i).reverse().forEach(i => {
        const b = mk("button", "bloco", lista[i]);
        b.onclick = () => { b.disabled = true; seq.append(linha(i)); renum(); som("clique"); };
        pool.append(b); btns.push(b);
      });
      const lim = mk("button", "btn", "Limpar"), ok = mk("button", "btn btn-principal", "Executar programa");
      lim.onclick = () => { btns.forEach(b => b.disabled = false); seq.querySelectorAll(".linha").forEach(l => l.remove()); };
      ok.onclick = () => { ok.disabled = lim.disabled = true; btns.forEach(b => b.disabled = true); res(ordem()); };
      f.append(pool, seq, lim, ok); add(f);
    });
  },
  entrada(tipo, ph) {
    return new Promise(res => {
      const f = mk("div", "form"), i = mk("input");
      i.type = tipo; i.placeholder = ph || ""; if (tipo === "text") i.maxLength = 24;
      const ok = mk("button", "btn btn-principal", "Enviar");
      const fim = () => { if (!i.value.trim()) return; ok.disabled = i.disabled = true; res(tipo === "number" ? Number(i.value) : i.value.trim()); };
      ok.onclick = fim; i.onkeydown = e => { if (e.key === "Enter") fim(); };
      f.append(i, ok); add(f); i.focus({ preventScroll: true });
    });
  },
  timer(seg) {
    const bar = mk("div", "tempo"), fill = mk("i"); bar.append(fill); add(bar); let id;
    return {
      nova() {
        clearInterval(id); let t = seg; fill.style.width = "100%"; bar.dataset.t = t + "s";
        return new Promise(r => { id = setInterval(() => { t--; fill.style.width = (t / seg * 100) + "%"; bar.dataset.t = t + "s"; if (t <= 0) { clearInterval(id); r(TIMEOUT); } }, 1000); });
      },
      stop() { clearInterval(id); bar.remove(); }
    };
  }
};

document.addEventListener("keydown", e => { if (teclaAtiva && /^[1-9]$/.test(e.key)) teclaAtiva(+e.key); });
document.addEventListener("mousemove", e => { const x = (e.clientX / innerWidth - .5) * -18; document.querySelectorAll(".cena svg").forEach(s => s.style.transform = `translateX(${x}px) scale(1.06)`); });

function hud() {
  $("hudNome").textContent = S.nome; $("hudEstrelas").textContent = "★ " + total(); $("hudMoedas").textContent = "🪙 " + S.moedas; $("hudFrag").textContent = S.frags.size;
  const e = $("hudEnergia"), v = Math.max(0, S.energia); e.firstElementChild.style.width = v + "%"; e.dataset.v = v + "%";
}
const era = e => { document.body.dataset.era = e; FX.era(e); FX.musica(e); };

function desbloquear(id, silencioso) {
  S.frags.add(id); hud(); if (silencioso) return;
  const d = mk("div", "frag"); d.append(mk("h4", "", "✦ Fragmento Histórico Desbloqueado: " + FRAG[id].t), mk("p", "", FRAG[id].x)); add(d); FX.voo(d);
}

const pedir = d => ({
  escolha: () => ui.escolher(d.opcoes), bool: () => ui.booleanos(d.campos), numero: () => ui.entrada("number", "Sua resposta"),
  lampadas: () => ui.lampadas(), bits: () => ui.bits(d.bits), cesar: () => ui.cesar(d.codigo), blocos: () => ui.blocos(d.blocos)
}[d.tipo]());
const checar = (d, r) => ({
  escolha: () => r === d.correta, bool: () => d.valida(r), numero: () => r === d.correta, bits: () => r === d.correta, cesar: () => r === d.correta,
  lampadas: () => r.every((v, i) => v === d.alvo[i]), blocos: () => r.join() === d.blocos.map((_, i) => i).join()
}[d.tipo]());

async function desafio(d0) {
  const d = d0.variantes ? Object.assign({}, d0, d0.variantes[Math.floor(Math.random() * d0.variantes.length)]) : d0, cfg = DIF[S.dif];
  ui.titulo(d.titulo); (d.intro || []).forEach(t => ui.p(t));
  const q = d.quem || "babbage", tm = d.tempo ? ui.timer(Math.max(5, Math.round(d.tempo * cfg.tempo))) : null;
  if (d.fala) ui.dialogo(q, "neutro", d.fala);
  if (d.pergunta) ui.p(d.pergunta, "destaque");
  const aj = mk("div", "ajuda"), bd = mk("button", "chip chip-btn", "💡 Dica (1🪙)"), br = mk("button", "chip chip-btn", "⚡ Recarga (2🪙)");
  bd.onclick = () => { if (S.moedas < 1 || !d.dica) { ui.p(d.dica ? "Você não tem moedas." : "Sem dica para este desafio.", "dica"); return; } S.moedas--; hud(); ui.dialogo(q, "neutro", "Dica: " + d.dica); som("clique"); };
  br.onclick = () => { if (S.moedas < 2 || S.energia >= 100) { ui.p("Precisa de 2 moedas e energia abaixo de 100%.", "dica"); return; } S.moedas -= 2; S.energia = Math.min(100, S.energia + 25); hud(); som("ok"); };
  aj.append(bd, br); add(aj);
  for (let i = 1; ; i++) {
    if (i > 1) ui.p("Tentativa " + i, "dica");
    const inp = pedir(d), r = tm ? await Promise.race([inp, tm.nova()]) : await inp;
    let ok = false;
    if (r === TIMEOUT) { travar(); ui.p("⏰ Tempo esgotado!", "erro"); } else ok = checar(d, r);
    if (ok) {
      aj.remove(); if (tm) tm.stop(); som("ok"); FX.confete(); ui.dialogo(q, "feliz", d.acerto);
      if (i === 1) { S.est[S.cap] += d.estrelas || 0; S.moedas += d.estrelas || 0; if (d.frag) desbloquear(d.frag, d.silencioso); }
      else ui.p("Você passou no desafio, mas não ganhou o fragmento por não acertar na primeira tentativa.", "dica");
      hud(); return true;
    }
    S.erros++; S.energia -= cfg.dano; hud(); som("erro"); FX.erro(); ui.dialogo(q, "triste", d.erro);
    if (S.energia <= 0) { aj.remove(); if (tm) tm.stop(); ui.p("⚡ A energia da máquina do tempo acabou!", "erro"); return false; }
    ui.p("Energia restante: " + S.energia + "%", "dica");
    if (cfg.dica && d.dica) ui.dialogo(q, "neutro", "Dica: " + d.dica);
  }
}

async function rodar(lista, ganchos = {}) {
  for (let i = 0; i < lista.length; i++) {
    if (!(await desafio(lista[i]))) return false;
    if (ganchos[i]) await ganchos[i]();
  }
  return true;
}

function recompensa(ok) {
  if (ok) { S.moedas += 2; S.energia = Math.min(100, S.energia + 25); S.minis++; hud(); som("ok"); FX.confete(); ui.p("Bônus conquistado: +2 🪙 e +25% de energia!", "ok"); }
  else ui.p("Não foi dessa vez, mas o bônus era opcional.", "dica");
}
const bonusCartoes = async () => { ui.titulo("⚡ BÔNUS: CARTÕES PERFURADOS"); ui.p("Babbage precisa de cartões perfurados! Pegue 8 antes do tempo acabar. Mova a cesta com 1, 2, 3 ou ← → (ou toque na pista)."); recompensa(await mini.cartoes()); };
const bonusCabos = async () => { ui.titulo("⚡ BÔNUS: RELIGAR OS CABOS"); ui.p("Os cabos do portal se soltaram! Ligue cada cor ao terminal correspondente. Erros custam tempo."); recompensa(await mini.cabos()); };

async function viagem(de, para) {
  som("clique"); if (window.RAPIDO || de === para) return;
  const v = $("viagem"), a = $("ano"); a.textContent = de; v.className = "on"; FX.sweep();
  const w = FX.warp($("warp"), 3400), t0 = performance.now();
  const tick = () => { const p = Math.min(1, (performance.now() - t0) / 3000); a.textContent = Math.round(de + (para - de) * p * p); if (p < 1) requestAnimationFrame(tick); }; tick();
  setTimeout(() => v.classList.add("entra"), 2000); setTimeout(() => v.classList.add("flash"), 2800);
  await w; v.className = "";
}

async function cap1() {
  S.cap = 0; era("babbage");
  while (true) {
    S.energia = 100; S.est[0] = 0; ["babbage1", "babbage2", "babbage3"].forEach(f => S.frags.delete(f)); hud();
    ui.limpar(); ui.cena("babbage"); ui.titulo("CAPÍTULO 1: O SÉCULO DAS MÁQUINAS");
    ui.p("A máquina começa a vibrar... Você está em Londres, 1832, numa oficina repleta de engrenagens.");
    ui.dialogo("babbage", "feliz", "Charles Babbage, prazer. E esta é a minha Máquina Diferencial!");
    ui.p("Explore a oficina clicando nos objetos:", "destaque"); await ui.explorar(ITENS_CAP1);
    ui.dialogo("babbage", "neutro", "Agora, talvez você possa me ajudar com alguns problemas lógicos!");
    if (!(await rodar(DESAFIOS_CAP1, { 1: bonusCartoes }))) return false;
    ui.titulo(`PARABÉNS, ${S.nome.toUpperCase()}! VOCÊ COMPLETOU O CAPÍTULO 1!`);
    ui.p(`TOTAL DE ESTRELAS (Cap. 1): ${S.est[0]}/6`, "destaque");
    ui.dialogo("babbage", "feliz", "Você seria um excelente assistente!");
    S.concl[0] = true; salvar(); await ui.botao("Seguir para o próximo capítulo"); return true;
  }
}

async function cap2() {
  S.cap = 1; era("turing");
  while (true) {
    S.energia = 100; S.est[1] = 0; ["turing1", "turing2", "turing3"].forEach(f => S.frags.delete(f)); hud();
    ui.limpar(); ui.cena("turing"); ui.titulo("CAPÍTULO 2: O CÓDEX");
    ui.p("Você acorda em um bunker militar em 1942. Tudo está em silêncio. Você se lembra da máquina do tempo e do caderno do seu avô.");
    ui.dialogo("almeida", "neutro", "Cuidado, neto. Neste tempo, um passo errado pode ser o último.");
    ui.p("Você vê uma porta iluminada e uma fresta escura ao lado.", "destaque");
    if ((await ui.escolher(["Entrar pela porta", "Passar pela fresta"])) !== 1) {
      ui.p("A porta leva a um corredor com armadilhas. Você cai em uma delas e não resiste aos ferimentos.", "erro");
      S.motivo = "Você caiu em uma armadilha no corredor do bunker. Neste tempo, um passo errado é o último."; return false;
    }
    ui.p("Você avança pela fresta e chega à sala de comunicações. Explore:"); await ui.explorar(ITENS_CAP2);
    if (!(await rodar(DESAFIOS_CAP2))) return false;
    ui.dialogo("turing", "surpreso", "Você parece saber coisas que ninguém deveria saber... De onde você vem?");
    const s = await ui.escolher(["Contar tudo sobre o futuro", "Guardar segredo para proteger a linha do tempo"]);
    if (s === 1 && !S.vistos.has("segredo")) { S.vistos.add("segredo"); S.conf += 2; }
    ui.dialogo("turing", s === 1 ? "feliz" : "neutro", s === 1 ? "Sábia decisão. Alguns segredos mudam o mundo." : "Fascinante... mas ninguém vai acreditar em nós.");
    ui.titulo("CONCLUÍDO: CAPÍTULO 2");
    ui.p("Você encontra sua máquina do tempo escondida atrás de um pano e se despede dos ecos de uma guerra devastadora.");
    S.concl[1] = true; salvar(); await ui.botao("Seguir para o próximo capítulo"); return true;
  }
}

async function cap3() {
  S.cap = 2; era("futuro");
  while (true) {
    S.energia = 100; S.est[2] = 0; ["ada1", "ada2"].forEach(f => S.frags.delete(f)); hud();
    ui.limpar(); ui.cena("futuro"); ui.titulo("CAPÍTULO 3: DE VOLTA PARA 2025");
    ui.p("Você chega a um laboratório altamente tecnológico, repleto de luzes LED e hologramas. Um painel exibe: \"PARA RETORNAR, RESOLVA OS CÓDIGOS DO FUTURO\".");
    ui.dialogo("robo", "feliz", "Olá, viajante! Sou o T-1, guardião da máquina do tempo."); await ui.explorar(ITENS_CAP3);
    if (!(await desafio(DESAFIOS_CAP3[0]))) return false;
    await bonusCabos();
    ui.p("Você acessa o painel de controle:"); ui.arte(ARTE.painel);
    if (!(await desafio(DESAFIOS_CAP3[1]))) return false;
    ui.titulo(`PARABÉNS, ${S.nome.toUpperCase()}! TODOS OS CÓDIGOS FORAM DECIFRADOS!`);
    ui.p("A máquina do tempo está pronta para levar você de volta para casa.");
    ui.titulo("FRAGMENTOS DE ADA LOVELACE COLETADOS");
    ["ada1", "ada2"].forEach(id => { const d = mk("div", "frag"); d.append(mk("h4", "", FRAG[id].t), mk("p", S.frags.has(id) ? "" : "dica", S.frags.has(id) ? FRAG[id].x : "Não adquirido.")); add(d); });
    S.concl[2] = true; salvar(); await ui.botao("Ligar a máquina do tempo e voltar para casa"); return true;
  }
}

function finalDoJogo() {
  const pts = S.frags.size + S.conf;
  const F = pts >= 10 ? ["FINAL A: HERDEIRO DO TEMPO", "feliz", "Você reuniu cada fragmento e protegeu a linha do tempo. A máquina agora é sua, e a história da computação cabe inteira neste caderno!"]
    : pts >= 6 ? ["FINAL B: APRENDIZ DO PROFESSOR", "neutro", "Você aprendeu muito, mas ainda faltam peças do quebra-cabeça. Volte à máquina e descubra o que ficou para trás!"]
    : ["FINAL C: VIAJANTE CURIOSO", "triste", "Você voltou inteiro, mas quase sem lembranças da viagem. Que tal tentar de novo, acertando de primeira?"];
  ui.limpar(); ui.titulo(F[0]); ui.dialogo("almeida", F[1], F[2]); FX.confete();
  const t = mk("div", "linha-tempo"); [["1832", "Babbage"], ["1942", "Turing"], ["2025", "Ada e o futuro"]].forEach(([a, n]) => { const i = mk("div", "marco"); i.append(mk("b", "", a), mk("span", "", n)); t.append(i); }); add(t);
  const ganhos = { viajante: true, perfeito: S.erros === 0, colecionador: S.frags.size === 8, estrelas: total() >= 7, guardiao: S.vistos.has("segredo"), detetive: S.pistas.length >= 6, engenheiro: S.minis >= 2 };
  const novos = TROFEUS.filter(x => ganhos[x.id] && !S.trofeus.has(x.id)); novos.forEach(x => S.trofeus.add(x.id));
  S.rank.push({ n: S.nome, p: pts, f: F[0].slice(0, 7), d: new Date().toLocaleDateString("pt-BR") }); S.rank.sort((a, b) => b.p - a.p); S.rank = S.rank.slice(0, 5); salvar();
  ui.p(`Pontuação: ${pts} · Fragmentos: ${S.frags.size}/8 · Erros: ${S.erros} · Estrelas: ${total()}`, "destaque");
  ui.p(novos.length ? "🏆 Novos troféus: " + novos.map(x => x.i + " " + x.n).join("  |  ") : "Nenhum troféu novo desta vez.", "dica");
}

async function telaTrofeus() {
  ui.limpar(); ui.titulo("🏆 TROFÉUS E RANKING"); const g = mk("div", "trofeus");
  TROFEUS.forEach(x => { const d = mk("div", "trofeu" + (S.trofeus.has(x.id) ? "" : " bloq")); d.append(mk("b", "", x.i + " " + x.n), mk("small", "", x.d)); g.append(d); }); add(g);
  ui.titulo("RANKING (melhores partidas)");
  if (!S.rank.length) ui.p("Nenhuma partida concluída ainda.", "dica");
  S.rank.forEach((r, i) => add(mk("div", "rank", `${i + 1}º  ${r.n}  ·  ${r.p} pts  ·  ${r.f}  ·  ${r.d}`)));
  await ui.botao("Voltar ao Menu Principal");
}
async function textoMenu(titulo, linhas) { ui.limpar(); ui.titulo(titulo); linhas.forEach(l => ui.p(l)); await ui.botao("Voltar ao Menu Principal"); }

async function gameOver(msg) {
  som("gameover"); FX.erro(); if (window.RAPIDO) return;
  const v = $("gameover"), btn = $("goBtn"); $("goMsg").textContent = ""; btn.style.visibility = "hidden"; v.className = "on";
  const cv = $("ruido"), c = cv.getContext("2d"); cv.width = 160; cv.height = 90; let on = true;
  (function f() { if (!on) return; const im = c.createImageData(160, 90); for (let i = 0; i < im.data.length; i += 4) { const x = Math.random() * 255 | 0; im.data[i] = x; im.data[i + 1] = x * .2; im.data[i + 2] = x * .2; im.data[i + 3] = 255; } c.putImageData(im, 0, 0); setTimeout(() => requestAnimationFrame(f), 70); })();
  digitar($("goMsg"), msg); await new Promise(r => setTimeout(r, 1800)); btn.style.visibility = "visible"; btn.focus();
  await new Promise(r => btn.onclick = r); on = false; v.className = "";
}

async function animacaoVitoria() {
  FX.sweep(); if (window.RAPIDO) return;
  const v = $("retorno"), ano = $("anoRet"), bar = $("carga"), txt = $("cargaTxt"), msg = $("msgRet"), btn = $("retBtn"), esp = ms => new Promise(r => setTimeout(r, ms));
  ano.textContent = 2150; bar.style.width = "0%"; txt.textContent = "ENERGIA 0%"; msg.textContent = "Ligando a máquina do tempo..."; btn.style.visibility = "hidden"; v.className = "on";
  const t0 = performance.now();
  const tick = () => { const p = Math.min(1, (performance.now() - t0) / 3200); bar.style.width = p * 100 + "%"; txt.textContent = "ENERGIA " + Math.round(p * 100) + "%"; if (p < 1) requestAnimationFrame(tick); }; tick();
  await esp(300); v.classList.add("s1"); await esp(1800); v.classList.add("s2"); msg.textContent = "Sincronizando com o ano de origem...";
  const t1 = performance.now(); await new Promise(r => { const f = () => { const p = Math.min(1, (performance.now() - t1) / 3000), e = p * p * (3 - 2 * p); ano.textContent = Math.round(2150 - 125 * e); p < 1 ? requestAnimationFrame(f) : r(); }; f(); });
  v.classList.add("flash"); som("vitoria"); await esp(700); v.classList.add("s4"); FX.confete();
  msg.textContent = `Retorno concluído! Bem-vindo(a) de volta a 2025, ${S.nome}.`; btn.style.visibility = "visible"; btn.focus();
  await new Promise(r => btn.onclick = r); v.className = "";
}

async function jornada() {
  const i0 = S.concl.findIndex(x => !x); S.ano = i0 > 0 ? ERAS[i0 - 1].ano : 2025;
  while (true) {
    const i = S.concl.findIndex(x => !x); if (i < 0) break;
    await viagem(S.ano, ERAS[i].ano); S.ano = ERAS[i].ano;
    if (!(await [cap1, cap2, cap3][i]())) {
      await gameOver(S.motivo || "A energia da máquina do tempo acabou! A linha do tempo se rompeu e você ficou preso entre as eras..."); S.motivo = "";
      era("menu"); ui.limpar(); ui.titulo("☠ GAME OVER"); ui.p("Você não conseguiu completar o capítulo. O que deseja fazer?");
      if ((await ui.escolher(["TENTAR NOVAMENTE ESTE CAPÍTULO", "VOLTAR AO MENU"])) === 1) return;
    }
  }
  await animacaoVitoria(); S.ano = 2025; finalDoJogo();
  const f = await ui.escolher(["JOGAR NOVAMENTE (nova jornada)", "VOLTAR AO MENU"]);
  zerar(); salvar(); hud(); if (f === 0) await jornada();
}

async function menu() {
  while (true) {
    era("menu"); ui.limpar(); ui.logo(); ui.p(`Olá, ${S.nome}! O que deseja fazer?`);
    const itens = [];
    if (temProgresso()) itens.push(["CONTINUAR JORNADA", async () => { await jornada(); }]);
    itens.push([temProgresso() ? "NOVA JORNADA (apaga o progresso)" : "INICIAR JORNADA TEMPORAL", async () => { zerar(); salvar(); hud(); await jornada(); }],
      ["COMO JOGAR", () => textoMenu("COMO JOGAR", COMO_JOGAR)], ["REGRAS DO JOGO", () => textoMenu("REGRAS DO JOGO", REGRAS)], ["TROFÉUS E RANKING", telaTrofeus],
      ["DIFICULDADE: " + DIF[S.dif].n, async () => { S.dif = (S.dif + 1) % 3; salvar(); }], ["SAIR", null]);
    const o = await ui.escolher(itens.map(x => x[0]));
    if (!itens[o][1]) return despedida(`Saindo do jogo... Até mais, ${S.nome}!`);
    await itens[o][1]();
  }
}

async function despedida(msg) { era("menu"); ui.limpar(); ui.titulo("ATÉ A PRÓXIMA!"); ui.p(msg); await ui.botao("Jogar de novo"); location.reload(); }

function aplicarUI(salvo) {
  let u = {}; try { u = JSON.parse(localStorage.getItem("ct-ui")) || {}; } catch (e) { /* */ }
  const aplica = () => { document.documentElement.dataset.tema = u.tema || ""; document.body.style.setProperty("--fs", (u.fs || 17) + "px"); FX.opts.som = u.som !== false; FX.opts.musica = u.musica !== false; $("som").textContent = FX.opts.som ? "🔊" : "🔇"; $("musica").style.opacity = FX.opts.musica ? 1 : .4; try { localStorage.setItem("ct-ui", JSON.stringify(u)); } catch (e) { /* */ } };
  $("tema").onclick = () => { u.tema = u.tema === "claro" ? "" : "claro"; aplica(); };
  $("fonte").onclick = () => { u.fs = u.fs >= 21 ? 17 : (u.fs || 17) + 2; aplica(); };
  $("som").onclick = () => { u.som = !(u.som !== false); aplica(); };
  $("musica").onclick = () => { u.musica = !(u.musica !== false); aplica(); FX.musica(document.body.dataset.era); };
  aplica();
}

async function main() {
  const salvo = carregar(); aplicarUI(); hud();
  ui.cena("babbage"); ui.logo();
  ui.dialogo("almeida", "neutro", "Meu neto... guardei uma máquina do tempo no porão. Use-a com sabedoria. Cada época esconde um código que o mundo esqueceu.");
  await ui.botao("Começar sua aventura");
  if (salvo && S.nome && S.nome !== "Viajante") ui.p(`Bem-vindo de volta, ${S.nome}!`, "ok");
  else { ui.titulo("DIGITE SEU NOME PARA ESTA MISSÃO"); S.nome = await ui.entrada("text", "Seu nome"); salvar(); hud(); ui.p(`${S.nome}, você está diante da incrível máquina do tempo do seu avô...`); await ui.botao("Acessar o menu"); }
  if (salvo) await ui.botao("Acessar o menu");
  await menu();
}

const diario = $("diario");
$("abrirDiario").onclick = () => {
  const l = $("listaFrag"); l.innerHTML = ""; l.append(mk("h4", "", "Fragmentos históricos"));
  if (!S.frags.size) l.append(mk("p", "dica", "Nenhum fragmento ainda. Acerte desafios de primeira para desbloqueá-los!"));
  S.frags.forEach(id => { const d = mk("div", "frag"); d.append(mk("h4", "", FRAG[id].t), mk("p", "", FRAG[id].x)); l.append(d); });
  l.append(mk("h4", "", "Pistas do caderno")); if (!S.pistas.length) l.append(mk("p", "dica", "Explore os objetos das cenas para achar pistas."));
  S.pistas.forEach(p => l.append(mk("p", "fala", p))); diario.showModal();
};
$("fechar").onclick = () => diario.close();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
main();
