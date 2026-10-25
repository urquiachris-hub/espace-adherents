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
    const base = { blanc: 'blanc', rose: 'rose', brun: 'brun', pluie: 'rose', ocean: 'brun' }[kind];
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
    node.connect(gain);
    src.start();
    gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.4);
    current = kind;
  }

  function setVolume(v) { if (gain && ctx) gain.gain.setTargetAtTime(v, ctx.currentTime, 0.1); }

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
