// Minijogos bônus: cartões perfurados (ação) e ligação de cabos (tempo limite). Resolvem true/false.
const mini = {
  cartoes() {
    if (window.RAPIDO) return Promise.resolve(true);
    return new Promise(res => {
      const box = mk("div", "mini"), cv = mk("canvas"), info = mk("div", "dica"), pular = mk("button", "btn", "Pular bônus");
      cv.width = 360; cv.height = 400; box.append(info, cv, pular); add(box);
      const c = cv.getContext("2d"), W = 360, L = 3, lw = W / L, meta = 8;
      let cesta = 1, pegos = 0, t = 20, cards = [], raf, last = performance.now(), spawn = 0, fim = false;
      const key = e => { if (e.key === "ArrowLeft") cesta = Math.max(0, cesta - 1); else if (e.key === "ArrowRight") cesta = Math.min(2, cesta + 1); else if (/^[1-3]$/.test(e.key)) cesta = +e.key - 1; };
      cv.onpointerdown = e => { const r = cv.getBoundingClientRect(); cesta = Math.min(2, Math.max(0, Math.floor((e.clientX - r.left) / r.width * L))); };
      document.addEventListener("keydown", key);
      const encerrar = ok => { if (fim) return; fim = true; cancelAnimationFrame(raf); document.removeEventListener("keydown", key); pular.disabled = true; res(ok); };
      pular.onclick = () => encerrar(false);
      const loop = now => {
        const dt = (now - last) / 1000; last = now; t -= dt; spawn -= dt;
        if (spawn <= 0) { cards.push({ l: Math.floor(Math.random() * L), y: -30 }); spawn = .7; }
        c.clearRect(0, 0, W, 400); c.fillStyle = "rgba(0,0,0,.35)"; c.fillRect(0, 0, W, 400);
        for (let i = 1; i < L; i++) { c.fillStyle = "rgba(255,255,255,.1)"; c.fillRect(i * lw, 0, 1, 400); }
        cards = cards.filter(k => { k.y += 190 * dt; if (k.y > 340 && k.y < 372 && k.l === cesta) { pegos++; FX.som("ok"); return false; } return k.y < 400; });
        cards.forEach(k => { c.fillStyle = "#e8d9b0"; c.fillRect(k.l * lw + 22, k.y, lw - 44, 34); c.fillStyle = "#333"; for (let j = 0; j < 4; j++) c.fillRect(k.l * lw + 30 + j * 18, k.y + 8 + (j % 2) * 10, 8, 8); });
        c.fillStyle = "#e0a845"; c.fillRect(cesta * lw + 14, 368, lw - 28, 22);
        info.textContent = `Cartões: ${pegos}/${meta} · Tempo: ${Math.max(0, Math.ceil(t))}s`;
        if (pegos >= meta) return encerrar(true); if (t <= 0) return encerrar(false); raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
  },
  cabos() {
    if (window.RAPIDO) return Promise.resolve(true);
    return new Promise(res => {
      const cores = ["#ff4d4d", "#4dd2ff", "#6fd08c", "#ffd34d"], box = mk("div", "mini"), info = mk("div", "dica", "Clique num terminal da esquerda e depois na cor igual da direita. Tempo: 25s"),
        esq = mk("div", "col"), dir = mk("div", "col"), fios = mk("div", "fios"), pular = mk("button", "btn", "Pular bônus");
      let sel = null, ok = 0, t = 25, fim = false;
      const id = setInterval(() => { t--; info.textContent = `Ligue as cores iguais. Tempo: ${t}s`; if (t <= 0) fechar(false); }, 1000);
      function fechar(r) { if (fim) return; fim = true; clearInterval(id); box.querySelectorAll("button").forEach(x => x.disabled = true); res(r); }
      const term = (cor, lado) => {
        const b = mk("button", "term"); b.style.setProperty("--c", cor);
        b.onclick = () => {
          if (b.classList.contains("lig")) return;
          if (lado === "e") { esq.querySelectorAll(".term").forEach(x => x.classList.remove("sel")); b.classList.add("sel"); sel = b; }
          else if (sel) {
            if (sel.style.getPropertyValue("--c") === cor) { sel.classList.add("lig"); b.classList.add("lig"); sel.classList.remove("sel"); sel = null; FX.som("ok"); if (++ok === 4) fechar(true); }
            else { FX.som("erro"); t = Math.max(1, t - 3); sel.classList.remove("sel"); sel = null; }
          }
        };
        return b;
      };
      cores.forEach(c => esq.append(term(c, "e"))); [...cores].sort(() => Math.random() - .5).forEach(c => dir.append(term(c, "d")));
      fios.append(esq, dir); pular.onclick = () => fechar(false); box.append(info, fios, pular); add(box);
    });
  }
};
