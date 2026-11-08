const C="codigos-v1",F=["index.html","style.css","dados.js","personagens.js","efeitos.js","minijogos.js","jogo.js","icone.svg","logo.svg","manifest.json"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
