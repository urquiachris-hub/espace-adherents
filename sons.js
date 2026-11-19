/* Générateur de sons apaisants (Web Audio), sans fichier à télécharger. */
window.AASons = (() => {
  let ctx = null, src = null, gain = null, extra = [], timer = null, endAt = 0, current = null, silence = null;

  /* Sur iPhone, le Web Audio est coupé quand le téléphone est en mode silencieux.
     Lire en même temps un petit fichier silencieux avec un lecteur audio classique
     fait passer le téléphone en mode « lecture » et rend le son audible. */
  function silenceUrl() {
    const rate = 8000, n = rate / 2, b = new ArrayBuffer(44 + n), v = new DataView(b);
    const s = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVE'); s(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    s(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  }
  function deverrouiller() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    try {
      if (!silence) { silence = new Audio(silenceUrl()); silence.loop = true; silence.setAttribute('playsinline', ''); }
      const p = silence.play(); if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }

  // Ondes de détente : notes graves (150 à 220 Hz), loin des aigus où se situent la plupart des acouphènes.
  const ONDES = {
    delta: { porteuse: 150, battement: 2.5, bruit: 'brun', niveauBruit: 0.22 },
    theta: { porteuse: 200, battement: 6, bruit: 'rose', niveauBruit: 0.18 },
    alpha: { porteuse: 220, battement: 10, bruit: 'rose', niveauBruit: 0.15 },
  };

  /* Volume : le curseur va de 0,02 à 0,8. L'oreille perçoit le volume de façon logarithmique,
     donc on applique une courbe exponentielle : presque inaudible au minimum, progressif ensuite.
     NIVEAU égalise les ambiances entre elles (mesuré : le bruit blanc est naturellement le plus fort). */
  const NIVEAU = { blanc: 0.59, rose: 0.86, brun: 0.82, pluie: 1.39, ocean: 0.87, delta: 0.96, theta: 0.98, alpha: 0.98 };
  function courbe(v) {
    const t = Math.min(1, Math.max(0, (Number(v) - 0.02) / 0.78));
    return (0.0004 * Math.pow(200, t)) / 0.12;
  }
  const cible = (v) => courbe(v) * (NIVEAU[current] || 1);

  function buffer(kind) {
    const len = ctx.sampleRate * 4, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === 'blanc') d[i] = w * 0.5;
        else if (kind === 'rose') {
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
          b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      }
    }
    return b;
  }

  function stopNow() {
    try { src && src.stop(); } catch (e) {}
    extra.forEach((n) => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) {} });
    extra = []; src = null; current = null; clearInterval(timer); timer = null; endAt = 0;
    try { silence && silence.pause(); } catch (e) {}
  }

  function play(kind, volume) {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    stopNow();
    deverrouiller();
    gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination);
    const onde = ONDES[kind];
    const base = onde ? onde.bruit : { blanc: 'blanc', rose: 'rose', brun: 'brun', pluie: 'rose', ocean: 'brun' }[kind];
    src = ctx.createBufferSource(); src.buffer = buffer(base); src.loop = true;
    let node = src;
    if (kind === 'pluie') {
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000;
      node.connect(hp); hp.connect(lp); node = lp;
    }
    if (kind === 'ocean') {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
      const swell = ctx.createGain(); swell.gain.value = 0.55;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.09;
      const depth = ctx.createGain(); depth.gain.value = 0.45;
      lfo.connect(depth); depth.connect(swell.gain); lfo.start();
      node.connect(lp); lp.connect(swell); node = swell; extra.push(lfo);
    }
    if (onde) {
      // Battement binaural : une note grave dans chaque oreille, légèrement décalées.
      // Le cerveau perçoit la différence comme une pulsation lente. Casque nécessaire.
      const gBruit = ctx.createGain(); gBruit.gain.value = onde.niveauBruit;
      node.connect(gBruit); node = gBruit;
      const fusion = ctx.createChannelMerger(2);
      [[onde.porteuse, 0], [onde.porteuse + onde.battement, 1]].forEach(([f, canal]) => {
        const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
        const g = ctx.createGain(); g.gain.value = 0.24;
        o.connect(g); g.connect(fusion, 0, canal); o.start(); extra.push(o);
      });
      fusion.connect(gain);
    }
    node.connect(gain);
    src.start();
    current = kind;
    gain.gain.setTargetAtTime(cible(volume), ctx.currentTime, 0.4);
  }

  function setVolume(v) { if (gain && ctx) gain.gain.setTargetAtTime(cible(v), ctx.currentTime, 0.1); }

  function stop(fade = 1.5) {
    if (!gain || !ctx) return stopNow();
    gain.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
    const g = gain; setTimeout(() => { if (gain === g) stopNow(); }, fade * 1000 + 200);
  }

  function minuterie(min, onTick) {
    clearInterval(timer); timer = null; endAt = 0;
    if (!min) { onTick && onTick(0); return; }
    endAt = Date.now() + min * 60000;
    timer = setInterval(() => {
      const left = Math.max(0, endAt - Date.now());
      onTick && onTick(left);
      if (left <= 0) { clearInterval(timer); timer = null; stop(20); }
    }, 1000);
  }

  const etat = () => (ctx ? ctx.state : 'aucun');
  return { play, stop, setVolume, minuterie, etat, enCours: () => current };
})();

/* Bloc « Ondes de détente » ajouté à la page Sons (à intégrer dans app.js lors d'une prochaine mise à jour). */
(() => {
  const ONDES = [
    ['delta', 'Endormissement', 'Pulsation très lente (2,5 Hz) sous un bruit brun'],
    ['theta', 'Apaiser l’anxiété', 'Pulsation lente (6 Hz) sous un bruit rose'],
    ['alpha', 'Calme éveillé', 'Pulsation à 10 Hz, pour une pause dans la journée'],
  ];
  function ajouter() {
    const grille = document.querySelector('.sons[aria-label="Ambiances"]');
    if (!grille || document.getElementById('ondes')) return;
    const vue = grille.parentElement;
    const bloc = document.createElement('div');
    bloc.innerHTML = `<h2 style="margin:20px 0 6px">Ondes de détente</h2>
      <p class="muet petit" style="margin:0 0 10px">🎧 Avec un casque ou des écouteurs uniquement : chaque oreille reçoit une note légèrement différente. Des études montrent des effets modestes sur l’anxiété, variables selon les personnes. Ce n’est pas un traitement.</p>
      <div class="sons" id="ondes" role="group" aria-label="Ondes de détente">${ONDES.map(([k, t, d]) => `<button type="button" class="son" data-onde="${k}" aria-pressed="${window.AASons.enCours() === k}"><strong>${t}</strong><span class="muet petit">${d}</span></button>`).join('')}</div>`;
    grille.after(bloc);
    const reste = vue.querySelector('#reste'), stopB = vue.querySelector('#stop');
    const tick = (ms) => { if (reste) reste.textContent = ms ? `Arrêt dans ${Math.ceil(ms / 60000)} min` : ''; };
    bloc.querySelectorAll('[data-onde]').forEach((b) => b.addEventListener('click', () => {
      const vol = Number((vue.querySelector('#vol') || {}).value || 0.25);
      const m = vue.querySelector('#minu button[aria-pressed="true"]');
      try { window.AASons.play(b.dataset.onde, vol); } catch (e) { if (reste) reste.textContent = 'Le son ne peut pas démarrer sur cet appareil.'; return; }
      window.AASons.minuterie(m ? Number(m.dataset.m) : 30, tick);
      vue.querySelectorAll('.son').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (stopB) stopB.disabled = false;
      setTimeout(() => { if (window.AASons.etat() !== 'running' && reste) reste.textContent = 'Le son est bloqué par le navigateur : touchez de nouveau l’ambiance.'; }, 1200);
    }));
    // Choisir un bruit classique désélectionne les ondes.
    grille.addEventListener('click', (e) => { if (e.target.closest('.son')) bloc.querySelectorAll('.son').forEach((x) => x.setAttribute('aria-pressed', 'false')); });
  }
  new MutationObserver(ajouter).observe(document.documentElement, { childList: true, subtree: true });
})();

/* Pastille « son en cours · Arrêter » visible sur toutes les pages sauf Sons,
   pour couper une ambiance sans revenir dans l'onglet Sons. */
(() => {
  const NOMS = { rose: 'Bruit rose', brun: 'Bruit brun', blanc: 'Bruit blanc', pluie: 'Pluie', ocean: 'Océan', delta: 'Endormissement', theta: 'Apaiser l’anxiété', alpha: 'Calme éveillé' };
  let pastille = null, coupeA = 0;
  function maj() {
    const k = window.AASons.enCours();
    if (!k || location.hash.startsWith('#/sons') || Date.now() - coupeA < 2500) { if (pastille) pastille.style.display = 'none'; return; }
    if (!pastille) {
      pastille = document.createElement('div');
      pastille.id = 'aa-son-en-cours'; pastille.setAttribute('role', 'status');
      pastille.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--nav-h, 64px) + env(safe-area-inset-bottom, 0px) + 10px);z-index:30;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:999px;background:var(--fg);color:var(--bg);box-shadow:0 4px 14px rgba(0,0,0,.2);font-size:.9rem;white-space:nowrap;max-width:calc(100% - 24px)';
      pastille.innerHTML = '<span></span><button type="button" style="border:0;border-radius:999px;padding:7px 14px;background:var(--accent);color:var(--accent-fg, #fff);font:inherit;font-weight:700;cursor:pointer">Arrêter</button>';
      pastille.querySelector('button').addEventListener('click', () => { coupeA = Date.now(); window.AASons.stop(0.6); window.AASons.minuterie(0); pastille.style.display = 'none'; });
      document.body.appendChild(pastille);
    }
    pastille.querySelector('span').textContent = '🔊 ' + (NOMS[k] || 'Son') + ' en cours';
    pastille.style.display = 'flex';
  }
  setInterval(maj, 700);
  window.addEventListener('hashchange', maj);
})();
