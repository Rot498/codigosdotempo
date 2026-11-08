// Efeitos: partículas, confete, tremor, voo do fragmento, som, música e túnel da viagem no tempo.
const FX = (() => {
  const off = window.RAPIDO || !document.getElementById("fx").getContext;
  if (off) { const n = () => {}; return { opts: { som: false, musica: false }, era: n, confete: n, erro: n, voo: n, som: n, musica: n, sweep: n, warp: () => Promise.resolve() }; }
  const cv = document.getElementById("fx"), c = cv.getContext("2d"), r = Math.random, opts = { som: true, musica: true };
  let tipo = "menu", ps = [], cf = [], ac, mid, passo = 0;
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; }; resize(); addEventListener("resize", resize);
  const COR = { babbage: "224,168,69", turing: "75,224,138", futuro: "63,216,255", menu: "224,168,69" };
  function novo() {
    const W = cv.width, H = cv.height;
    if (tipo === "babbage") return { x: r() * W, y: H + 10, vx: (r() - .5) * .6, vy: -.6 - r() * 1.4, s: 1 + r() * 2.5 };
    if (tipo === "futuro") return { x: r() * W, y: -10, vx: 0, vy: .6 + r() * 1.4, s: 12 + r() * 6, t: r() < .5 ? "0" : "1" };
    return { x: r() * W, y: r() * H, vx: (r() - .5) * .5, vy: (r() - .5) * .3, s: 1 + r() * 2 };
  }
  (function loop() {
    c.clearRect(0, 0, cv.width, cv.height);
    while (ps.length < 55) ps.push(novo());
    ps = ps.filter(p => {
      p.x += p.vx; p.y += p.vy; const a = .15 + .35 * (p.s % 1);
      c.fillStyle = `rgba(${COR[tipo]},${a})`;
      if (p.t) { c.font = p.s + "px monospace"; c.fillText(p.t, p.x, p.y); } else { c.beginPath(); c.arc(p.x, p.y, p.s, 0, 7); c.fill(); }
      return p.y > -20 && p.y < cv.height + 20 && p.x > -20 && p.x < cv.width + 20;
    });
    cf = cf.filter(k => {
      k.x += k.vx; k.y += k.vy; k.vy += .3; k.rot += k.vr; k.life--;
      c.save(); c.translate(k.x, k.y); c.rotate(k.rot); c.fillStyle = k.c; c.globalAlpha = Math.min(1, k.life / 30); c.fillRect(-k.s / 2, -k.s / 4, k.s, k.s / 2); c.restore();
      return k.life > 0;
    });
    requestAnimationFrame(loop);
  })();

  const ctx = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); return ac; } catch (e) { return null; } };
  function tom(f, t0, dur, tipoO = "sine", vol = .07) {
    const a = ctx(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
    o.type = tipoO; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .02);
  }
  const ESC = { babbage: [220, 262, 330, 392, 330, 262], turing: [147, 175, 220, 175, 196, 147], futuro: [262, 330, 392, 523, 392, 330], menu: [196, 247, 294, 247] };
  return {
    opts,
    era(e) { tipo = e; ps = []; },
    confete() { for (let i = 0; i < 60; i++) cf.push({ x: cv.width / 2 + (r() - .5) * 300, y: cv.height * .45, vx: (r() - .5) * 11, vy: -r() * 11 - 3, c: `hsl(${r() * 360},90%,60%)`, s: 6 + r() * 6, rot: r() * 6, vr: (r() - .5) * .4, life: 100 }); },
    erro() {
      const l = document.getElementById("log"), f = document.getElementById("flash");
      l.classList.remove("treme"); f.classList.remove("on"); void l.offsetWidth; l.classList.add("treme"); f.classList.add("on");
    },
    voo(el) {
      const b = document.getElementById("abrirDiario"); if (!el || !el.animate || !b) return;
      const a = el.getBoundingClientRect(), z = b.getBoundingClientRect(), s = document.createElement("div");
      s.textContent = "📜"; s.className = "voador"; s.style.left = a.left + a.width / 2 + "px"; s.style.top = a.top + "px"; document.body.append(s);
      s.animate([{ transform: "translate(0,0) scale(2)", opacity: 1 }, { transform: `translate(${z.left - a.left - a.width / 2 + 10}px,${z.top - a.top}px) scale(.6)`, opacity: .2 }], { duration: 900, easing: "ease-in" }).onfinish = () => s.remove();
    },
    som(t) {
      if (!opts.som) return;
      ({ ok: () => { tom(660, 0, .2); tom(880, .12, .25); }, erro: () => { tom(200, 0, .2, "sawtooth"); tom(150, .15, .25, "sawtooth"); }, clique: () => tom(520, 0, .12), gameover: () => [220, 196, 165, 110].forEach((f, i) => tom(f, i * .3, .6, "sawtooth", .08)), vitoria: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tom(f, i * .16, .5, "sine", .08)) }[t] || (() => {}))();
    },
    musica(e) {
      clearInterval(mid); if (!opts.musica || !ctx()) return; const n = ESC[e] || ESC.menu;
      mid = setInterval(() => { tom(n[passo++ % n.length], 0, .9, "triangle", .03); if (passo % n.length === 0) tom(n[0] / 2, 0, 1.6, "sine", .04); }, e === "futuro" ? 300 : 460);
    },
    sweep() { if (!opts.som || !ctx()) return; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime; o.type = "sawtooth"; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(1500, t + 3); g.gain.setValueAtTime(.05, t); g.gain.linearRampToValueAtTime(.09, t + 2.6); g.gain.exponentialRampToValueAtTime(.001, t + 3.4); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 3.5); },
    warp(w, ms) {
      return new Promise(res => {
        w.width = innerWidth; w.height = innerHeight; const x = w.getContext("2d"), s = [], t0 = performance.now();
        for (let i = 0; i < 240; i++) s.push({ a: r() * 6.28, d: r() * 60, v: 2 + r() * 4, h: r() * 360 });
        (function f() {
          const p = (performance.now() - t0) / ms, cx = w.width / 2, cy = w.height / 2;
          x.fillStyle = "rgba(5,8,22,.25)"; x.fillRect(0, 0, w.width, w.height);
          s.forEach(q => {
            const ox = cx + Math.cos(q.a) * q.d, oy = cy + Math.sin(q.a) * q.d; q.d += q.v * (1 + p * 5);
            x.strokeStyle = `hsl(${q.h + p * 200},90%,70%)`; x.lineWidth = 1 + q.d / 300; x.beginPath(); x.moveTo(ox, oy); x.lineTo(cx + Math.cos(q.a) * q.d, cy + Math.sin(q.a) * q.d); x.stroke();
            if (q.d > Math.max(cx, cy) * 1.5) q.d = r() * 20;
          });
          p < 1 ? requestAnimationFrame(f) : res();
        })();
      });
    }
  };
})();
const som = t => FX.som(t);
