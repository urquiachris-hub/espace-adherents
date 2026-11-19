/* Mon acouphène : l'adhérent retrouve, curseur par curseur, le son qu'il entend,
   pour le faire écouter à ses proches. Tout est généré dans le téléphone (Web Audio).
   Les sons enregistrés restent sur le téléphone (données de santé, non centralisées). */
window.AAAcouphene = (() => {
  'use strict';
  const FMIN = 100, FMAX = 12000, DUREE_MAX = 120, VOL_MAX = 0.9, MAX_COUCHES = 2;
  const CLE_OK = 'aa_acou_avert', CLE_PROFILS = 'aa_acou_profils', CLE_VOL = 'aa_acou_vol';

  const TYPES = [
    { id: 'sifflement', nom: 'Sifflement', f: 5000, purete: 0, timbre: 0, pulse: 0, gresil: 0 },
    { id: 'bourdon', nom: 'Bourdonnement', f: 120, purete: 10, timbre: 60, pulse: 0, gresil: 0 },
    { id: 'souffle', nom: 'Souffle', f: 3000, purete: 90, timbre: 0, pulse: 0, gresil: 0 },
    { id: 'gresil', nom: 'Grésillement', f: 4000, purete: 30, timbre: 10, pulse: 0, gresil: 80 },
    { id: 'cigales', nom: 'Cigales', f: 6000, purete: 25, timbre: 30, pulse: 85, gresil: 0 },
    { id: 'pulse', nom: 'Battement', f: 300, purete: 20, timbre: 20, pulse: 20, gresil: 0 },
  ];
  const nouvelleCouche = (type = 'sifflement') => {
    const t = TYPES.find((x) => x.id === type);
    return { type, f: t.f, purete: t.purete, timbre: t.timbre, pulse: t.pulse, gresil: t.gresil, pan: 0, niveau: 80 };
  };

  const lire = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const sliderVersF = (v) => FMIN * Math.pow(FMAX / FMIN, v / 1000);
  const fVersSlider = (f) => Math.round(1000 * Math.log(f / FMIN) / Math.log(FMAX / FMIN));
  const pulseHz = (v) => (v <= 0 ? 0 : 0.5 * Math.pow(80, v / 100));
  const fmtHz = (f) => (f >= 1000 ? (f / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' kHz' : Math.round(f) + ' Hz');
  const motHauteur = (f) => (f < 250 ? 'grave' : f < 1000 ? 'médium' : f < 4000 ? 'aigu' : f < 8000 ? 'très aigu' : 'extrêmement aigu');

  // ---------- moteur ----------
  function bufferBruit(ctx, sec = 4) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }
  function bufferCrepitement(ctx, sec = 3) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate), d = b.getChannelData(0);
    let i = 0;
    while (i < d.length) {
      i += Math.floor(ctx.sampleRate * (0.004 + Math.random() * 0.045));
      const len = Math.floor(ctx.sampleRate * (0.0008 + Math.random() * 0.003)), amp = 0.4 + Math.random() * 0.6;
      for (let k = 0; k < len && i + k < d.length; k++) d[i + k] = amp * (Math.random() * 2 - 1) * (1 - k / len);
    }
    return b;
  }
  function construireCouche(ctx, sortie, bufs, c) {
    const n = {};
    n.sin = ctx.createOscillator(); n.sin.type = 'sine';
    n.saw = ctx.createOscillator(); n.saw.type = 'sawtooth';
    n.sawLp = ctx.createBiquadFilter(); n.sawLp.type = 'lowpass';
    n.gSin = ctx.createGain(); n.gSaw = ctx.createGain(); n.gTon = ctx.createGain();
    n.bruit = ctx.createBufferSource(); n.bruit.buffer = bufs.bruit; n.bruit.loop = true;
    n.bp = ctx.createBiquadFilter(); n.bp.type = 'bandpass';
    n.bp2 = ctx.createBiquadFilter(); n.bp2.type = 'bandpass';
    n.gBruit = ctx.createGain();
    n.crep = ctx.createBufferSource(); n.crep.buffer = bufs.crep; n.crep.loop = true;
    n.crepBp = ctx.createBiquadFilter(); n.crepBp.type = 'bandpass'; n.crepBp.Q.value = 1.5;
    n.gCrep = ctx.createGain();
    n.somme = ctx.createGain(); n.puls = ctx.createGain();
    n.lfo = ctx.createOscillator(); n.lfo.type = 'sine'; n.gLfo = ctx.createGain();
    n.niveau = ctx.createGain();
    n.pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    n.sin.connect(n.gSin).connect(n.gTon);
    n.saw.connect(n.sawLp).connect(n.gSaw).connect(n.gTon);
    n.gTon.connect(n.somme);
    n.bruit.connect(n.bp).connect(n.bp2).connect(n.gBruit).connect(n.somme);
    n.crep.connect(n.crepBp).connect(n.gCrep).connect(n.somme);
    const fin = n.somme.connect(n.puls).connect(n.niveau);
    (n.pan ? fin.connect(n.pan) : fin).connect(sortie);
    n.lfo.connect(n.gLfo).connect(n.puls.gain);

    n.maj = (c, lisse = true) => {
      const t = ctx.currentTime, set = (p, v) => (lisse ? p.setTargetAtTime(v, t, 0.03) : p.setValueAtTime(v, t));
      const f = c.f, p = c.purete / 100, tb = c.timbre / 100, g = c.gresil / 100;
      set(n.sin.frequency, f); set(n.saw.frequency, f);
      set(n.sawLp.frequency, Math.min(f * 6, ctx.sampleRate / 2 - 100));
      set(n.gSin.gain, (1 - tb) * 0.5); set(n.gSaw.gain, tb * 0.35);
      set(n.gTon.gain, Math.cos(p * Math.PI / 2) * (1 - g * 0.6));
      const Q = 0.6 + 25 * Math.pow(1 - p, 2);
      set(n.bp.frequency, f); set(n.bp.Q, Q); set(n.bp2.frequency, f); set(n.bp2.Q, Q);
      const bande = Math.max(f / Q, 20);
      const compense = Math.min(0.3 / (0.577 * Math.sqrt(2 * bande / ctx.sampleRate)), 60);
      set(n.gBruit.gain, Math.sin(p * Math.PI / 2) * compense * 0.6 * (1 - g * 0.5));
      set(n.crepBp.frequency, Math.max(f, 600)); set(n.gCrep.gain, g * 1.4);
      const hz = pulseHz(c.pulse), prof = hz > 0 ? 0.48 : 0;
      set(n.lfo.frequency, hz || 1); set(n.gLfo.gain, prof); set(n.puls.gain, 1 - prof);
      set(n.niveau.gain, c.niveau / 100);
      if (n.pan) set(n.pan.pan, c.pan);
    };
    n.maj(c, false);
    const sources = [n.sin, n.saw, n.bruit, n.crep, n.lfo];
    n.demarrer = (t = 0) => sources.forEach((s) => s.start(t));
    n.arreter = () => sources.forEach((s) => { try { s.stop(); } catch (e) {} });
    return n;
  }

  // Sur iPhone en mode silencieux, un petit fichier silencieux lu en boucle rend le Web Audio audible.
  let silence = null;
  function deverrouiller() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    try {
      if (!silence) {
        const rate = 8000, n = rate / 2, b = new ArrayBuffer(44 + n), v = new DataView(b);
        const s = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
        s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVE'); s(12, 'fmt ');
        v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
        v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
        s(36, 'data'); v.setUint32(40, n, true);
        for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
        silence = new Audio(URL.createObjectURL(new Blob([b], { type: 'audio/wav' })));
        silence.loop = true; silence.setAttribute('playsinline', '');
      }
      const p = silence.play(); if (p && p.catch) p.catch(() => {});
    } catch (e) {}
  }

  let ctx = null, bufs = null, master = null, fondu = null, graphes = [], lecture = false, debut = 0, timer = null;
  let couches = [nouvelleCouche()], active = 0, volume = lire(CLE_VOL, 35), vue = null;

  function initAudio() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    bufs = { bruit: bufferBruit(ctx), crep: bufferCrepitement(ctx) };
    master = ctx.createGain(); fondu = ctx.createGain(); fondu.gain.value = 0;
    const lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -10; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.1;
    master.connect(fondu).connect(lim).connect(ctx.destination);
    majVolume(false);
  }
  function majVolume(lisse = true) {
    if (!master) return;
    const v = Math.pow(volume / 100, 2) * VOL_MAX;
    lisse ? master.gain.setTargetAtTime(v, ctx.currentTime, 0.05) : master.gain.setValueAtTime(v, ctx.currentTime);
  }
  function reconstruire() {
    graphes.forEach((g) => g.arreter());
    graphes = couches.map((c) => { const g = construireCouche(ctx, master, bufs, c); g.demarrer(); return g; });
  }
  async function demarrer() {
    try { if (window.AASons && window.AASons.enCours()) window.AASons.stop(0.3); } catch (e) {}
    initAudio(); deverrouiller();
    if (ctx.state !== 'running') { try { await ctx.resume(); } catch (e) {} }
    reconstruire();
    const t = ctx.currentTime;
    fondu.gain.cancelScheduledValues(t); fondu.gain.setValueAtTime(fondu.gain.value, t);
    fondu.gain.linearRampToValueAtTime(1, t + 1.5);
    lecture = true; debut = Date.now(); clearInterval(timer);
    timer = setInterval(tic, 500); tic(); majLecteur();
    setTimeout(() => { if (lecture && ctx.state !== 'running' && vue) vue.querySelector('#ma-min').textContent = 'Le son est bloqué par le navigateur : touchez de nouveau le bouton.'; }, 1200);
  }
  function arreter(message) {
    clearInterval(timer);
    if (!lecture) return;
    lecture = false;
    const t = ctx.currentTime;
    fondu.gain.cancelScheduledValues(t); fondu.gain.setValueAtTime(fondu.gain.value, t);
    fondu.gain.linearRampToValueAtTime(0, t + 0.4);
    const anciens = graphes; graphes = [];
    setTimeout(() => { anciens.forEach((g) => g.arreter()); try { silence && silence.pause(); } catch (e) {} }, 500);
    majLecteur(message);
  }
  function tic() {
    const reste = Math.max(0, DUREE_MAX - (Date.now() - debut) / 1000);
    const el = vue && vue.querySelector('#ma-min');
    if (el) el.textContent = `Arrêt automatique dans ${Math.floor(reste / 60)} min ${String(Math.floor(reste % 60)).padStart(2, '0')}`;
    if (reste <= 0) arreter('Arrêté après 2 min. Faites une pause avant de reprendre.');
  }
  function majLecteur(message) {
    if (!vue || !vue.isConnected) return;
    vue.querySelector('#ma-etat').textContent = lecture ? 'En écoute' : 'Prêt';
    const b = vue.querySelector('#ma-play');
    b.setAttribute('aria-label', lecture ? 'Arrêter' : 'Écouter');
    b.innerHTML = lecture
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    if (!lecture) vue.querySelector('#ma-min').textContent = message || 'Arrêt automatique après 2 min';
  }
  const majCouche = (i) => { if (lecture && graphes[i]) graphes[i].maj(couches[i]); };

  // ---------- export WAV (10 s, rendu hors temps réel) ----------
  async function creerWav() {
    const sr = 44100, sec = 10;
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const off = new OAC(2, sr * sec, sr);
    const b = { bruit: bufferBruit(off), crep: bufferCrepitement(off) };
    const m = off.createGain(); m.gain.value = Math.pow(Math.max(volume, 30) / 100, 2) * VOL_MAX;
    const env = off.createGain();
    env.gain.setValueAtTime(0, 0); env.gain.linearRampToValueAtTime(1, 1); env.gain.setValueAtTime(1, sec - 1); env.gain.linearRampToValueAtTime(0, sec);
    const lim = off.createDynamicsCompressor(); lim.threshold.value = -10; lim.ratio.value = 20; lim.knee.value = 0;
    m.connect(env).connect(lim).connect(off.destination);
    couches.forEach((c) => construireCouche(off, m, b, c).demarrer(0));
    const rendu = await off.startRendering();
    const L = rendu.getChannelData(0), R = rendu.getChannelData(1), n = L.length;
    const buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
    const s = (o, t) => [...t].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true);
    s(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0, o = 44; i < n; i++, o += 4) {
      v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true);
      v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true);
    }
    return new Blob([buf], { type: 'audio/wav' });
  }

  // ---------- vue ----------
  function rendre() {
    if (!vue) return;
    const c = couches[active];
    vue.querySelector('#ma-couches').innerHTML = couches.map((_, i) => `<button type="button" data-i="${i}" aria-pressed="${i === active}">Son ${i + 1}</button>`).join('')
      + (couches.length < MAX_COUCHES ? '<button type="button" data-ajout="1">+ Ajouter un 2e son</button>' : '');
    vue.querySelector('#ma-types').innerHTML = TYPES.map((t) => `<button type="button" data-t="${t.id}" aria-pressed="${c.type === t.id}">${t.nom}</button>`).join('');
    const set = (id, val, txt) => { vue.querySelector('#' + id).value = val; vue.querySelector('#' + id + '-v').textContent = txt; };
    set('ma-f', fVersSlider(c.f), `${fmtHz(c.f)} · ${motHauteur(c.f)}`);
    set('ma-purete', c.purete, c.purete < 15 ? 'note nette' : c.purete < 60 ? 'un peu soufflé' : 'souffle');
    set('ma-timbre', c.timbre, c.timbre < 20 ? 'doux' : c.timbre < 60 ? 'un peu métallique' : 'métallique');
    const hz = pulseHz(c.pulse);
    set('ma-pulse', c.pulse, hz === 0 ? 'continu' : hz < 3 ? 'battement lent' : hz < 12 ? 'battement rapide' : 'vibration');
    set('ma-gresil', c.gresil, c.gresil === 0 ? 'aucun' : c.gresil < 50 ? 'léger' : 'fort');
    set('ma-niveau', c.niveau, c.niveau + ' %');
    set('ma-vol', volume, volume + ' %');
    vue.querySelectorAll('#ma-oreille button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.pan) === c.pan)));
    vue.querySelector('#ma-suppr').hidden = couches.length < 2;
  }
  function rendreProfils() {
    const l = lire(CLE_PROFILS, []), ul = vue.querySelector('#ma-profils');
    ul.innerHTML = l.length ? l.map((p, i) => `<li><span>${esc(p.nom)}</span><span class="ma-actions"><button type="button" class="btn petit secondaire" data-ecouter="${i}">Écouter</button><button type="button" class="btn petit secondaire" data-suppr="${i}">Supprimer</button></span></li>`).join('')
      : '<li class="muet petit">Aucun son enregistré pour l’instant.</li>';
  }

  function formulaire() {
    return `
      <div class="carte ma-lecteur">
        <button type="button" class="ma-play" id="ma-play" aria-label="Écouter"></button>
        <div><div class="ma-etat" id="ma-etat">Prêt</div><div class="muet petit" id="ma-min" aria-live="polite">Arrêt automatique après 2 min</div></div>
        <div class="champ ma-plein"><label for="ma-vol">Volume général <span class="muet petit" id="ma-vol-v"></span></label><input id="ma-vol" type="range" min="0" max="100"></div>
      </div>
      <div class="carte form">
        <div class="onglets" id="ma-couches"></div>
        <div><h2 style="margin-bottom:8px">À quoi ressemble ce son ?</h2><div class="onglets" id="ma-types"></div></div>
        <div class="champ">
          <label for="ma-f">Hauteur <span class="muet petit" id="ma-f-v"></span></label>
          <div class="ma-hauteur"><button type="button" class="ma-fin" id="ma-moins" aria-label="Un peu plus grave">−</button><input id="ma-f" type="range" min="0" max="1000" step="1"><button type="button" class="ma-fin" id="ma-plus" aria-label="Un peu plus aigu">+</button></div>
          <div class="ma-bornes"><span>Grave</span><span>Très aigu</span></div>
        </div>
        ${[['ma-purete', 'Net ou soufflé', 'Note nette', 'Souffle'], ['ma-timbre', 'Couleur', 'Doux', 'Métallique'], ['ma-pulse', 'Rythme', 'Continu', 'Vibration rapide'], ['ma-gresil', 'Grésillement', 'Aucun', 'Fort']]
          .map(([id, l, a, b]) => `<div class="champ"><label for="${id}">${l} <span class="muet petit" id="${id}-v"></span></label><input id="${id}" type="range" min="0" max="100"><div class="ma-bornes"><span>${a}</span><span>${b}</span></div></div>`).join('')}
        <div><label>Dans quelle oreille ?</label><div class="onglets" id="ma-oreille"><button type="button" data-pan="-1">Gauche</button><button type="button" data-pan="0">Les deux</button><button type="button" data-pan="1">Droite</button></div></div>
        <div class="champ"><label for="ma-niveau">Volume de ce son <span class="muet petit" id="ma-niveau-v"></span></label><input id="ma-niveau" type="range" min="0" max="100"></div>
        <div><button type="button" class="btn petit secondaire" id="ma-suppr" hidden>Retirer ce son</button></div>
      </div>
      <div class="carte form">
        <h2>Garder ce son</h2>
        <p class="muet petit" style="margin:0">Il est enregistré uniquement sur ce téléphone. L’association n’y a pas accès.</p>
        <div class="ma-ligne"><input id="ma-nom" maxlength="40" placeholder="Ex. : mon acouphène le soir" aria-label="Nom du son"><button type="button" class="btn secondaire" id="ma-garder">Enregistrer</button></div>
        <ul class="ma-profils" id="ma-profils"></ul>
      </div>
      <div class="carte form">
        <h2>Le faire écouter</h2>
        <p class="muet petit" style="margin:0">Créez un enregistrement de 10 secondes à envoyer par message à un proche, ou à faire écouter à votre médecin.</p>
        <div><button type="button" class="btn" id="ma-export">Créer le fichier (10 s)</button></div>
        <p class="muet petit" id="ma-msg" aria-live="polite" style="margin:0"></p>
      </div>
      <p class="muet petit">Ce son est une approximation : au-delà de 8 000 Hz environ, les écouteurs de téléphone restituent mal les sons. Ce n’est pas un examen médical. Pour un bilan précis de votre acouphène, parlez-en à votre médecin, à un ORL ou à un audioprothésiste.</p>`;
  }

  function brancher(v) {
    const c = () => couches[active];
    const curseur = (id, cle, conv = Number) => v.querySelector('#' + id).addEventListener('input', (e) => { c()[cle] = conv(e.target.value); majCouche(active); rendre(); });
    curseur('ma-f', 'f', (x) => sliderVersF(Number(x)));
    curseur('ma-purete', 'purete'); curseur('ma-timbre', 'timbre'); curseur('ma-pulse', 'pulse'); curseur('ma-gresil', 'gresil'); curseur('ma-niveau', 'niveau');
    const pas = (s) => { c().f = Math.min(FMAX, Math.max(FMIN, c().f * Math.pow(2, s / 24))); majCouche(active); rendre(); };
    v.querySelector('#ma-moins').addEventListener('click', () => pas(-1));
    v.querySelector('#ma-plus').addEventListener('click', () => pas(1));
    v.querySelector('#ma-vol').addEventListener('input', (e) => { volume = Number(e.target.value); ecrire(CLE_VOL, volume); majVolume(); rendre(); });
    v.querySelector('#ma-play').addEventListener('click', () => (lecture ? arreter() : demarrer()));
    v.querySelector('#ma-couches').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.ajout) { const n = nouvelleCouche('souffle'); n.niveau = 50; couches.push(n); active = couches.length - 1; if (lecture) reconstruire(); }
      else active = Number(b.dataset.i);
      rendre();
    });
    v.querySelector('#ma-types').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const garde = { pan: c().pan, niveau: c().niveau };
      couches[active] = Object.assign(nouvelleCouche(b.dataset.t), garde); majCouche(active); rendre();
    });
    v.querySelector('#ma-oreille').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; c().pan = Number(b.dataset.pan); majCouche(active); rendre(); });
    v.querySelector('#ma-suppr').addEventListener('click', () => { couches.splice(active, 1); active = 0; if (lecture) reconstruire(); rendre(); });
    v.querySelector('#ma-garder').addEventListener('click', () => {
      const champ = v.querySelector('#ma-nom');
      const nom = champ.value.trim() || 'Mon acouphène du ' + new Date().toLocaleDateString('fr-FR');
      const l = lire(CLE_PROFILS, []); l.unshift({ nom, couches: JSON.parse(JSON.stringify(couches)), date: Date.now() });
      if (ecrire(CLE_PROFILS, l.slice(0, 10))) { champ.value = ''; rendreProfils(); }
      else alert('Impossible d’enregistrer sur ce téléphone (navigation privée ?).');
    });
    v.querySelector('#ma-profils').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const l = lire(CLE_PROFILS, []);
      if (b.dataset.ecouter != null) { const p = l[Number(b.dataset.ecouter)]; if (!p) return; couches = JSON.parse(JSON.stringify(p.couches)); active = 0; rendre(); lecture ? reconstruire() : demarrer(); }
      if (b.dataset.suppr != null) { const i = Number(b.dataset.suppr); if (!confirm(`Supprimer « ${l[i].nom} » ?`)) return; l.splice(i, 1); ecrire(CLE_PROFILS, l); rendreProfils(); }
    });
    v.querySelector('#ma-export').addEventListener('click', async (e) => {
      const btn = e.currentTarget, msg = v.querySelector('#ma-msg');
      btn.disabled = true; msg.textContent = 'Préparation du fichier…';
      try {
        const blob = await creerWav(), nom = 'mon-acouphene.wav';
        const fichier = new File([blob], nom, { type: 'audio/wav' });
        if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
          try { await navigator.share({ files: [fichier], title: 'Mon acouphène' }); msg.textContent = 'Fichier partagé.'; }
          catch (x) { msg.textContent = x && x.name === 'AbortError' ? 'Partage annulé.' : 'Le partage a échoué.'; }
        } else {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nom; document.body.appendChild(a); a.click(); a.remove();
          msg.textContent = 'Fichier téléchargé : vous pouvez l’envoyer.';
        }
      } catch (x) { msg.textContent = 'Ce téléphone ne permet pas de créer le fichier.'; }
      btn.disabled = false;
    });
  }

  function monter(v) {
    vue = v;
    v.innerHTML = `<a href="#/sons" class="petit">← Sons</a><h1>Mon acouphène</h1>
      <p class="muet">Retrouvez, réglage par réglage, le son que vous entendez. Ensuite, faites-le écouter à vos proches : c’est souvent le meilleur moyen de leur faire comprendre ce que vous vivez.</p>
      <div id="ma-corps"></div>`;
    const corps = v.querySelector('#ma-corps');
    const ouvrir = () => { corps.innerHTML = formulaire(); brancher(v); majLecteur(); rendre(); rendreProfils(); };
    if (lire(CLE_OK, false)) return ouvrir();
    corps.innerHTML = `<div class="carte form ma-avert">
        <h2>Avant de commencer</h2>
        <ul>
          <li>Baissez le volume de votre téléphone, puis montez doucement.</li>
          <li>Si un son devient désagréable ou douloureux, arrêtez tout de suite. C’est encore plus important si vous êtes sensible aux bruits (hyperacousie).</li>
          <li>Cet outil sert à faire entendre votre acouphène aux autres. Il n’est pas fait pour être écouté en boucle : l’écoute s’arrête seule après 2 minutes.</li>
        </ul>
        <div><button type="button" class="btn" id="ma-ok">J’ai compris, commencer</button></div>
      </div>`;
    corps.querySelector('#ma-ok').addEventListener('click', () => { ecrire(CLE_OK, true); ouvrir(); });
  }

  // Styles du module (reprennent les variables de styles.css).
  const css = document.createElement('style');
  css.textContent = `
    .ma-lecteur{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:14px 16px}
    .ma-plein{grid-column:1/-1}
    .ma-play{width:72px;height:72px;border-radius:50%;border:0;background:var(--fg);color:var(--bg);display:grid;place-items:center;cursor:pointer}
    .ma-play svg{width:28px;height:28px}
    .ma-etat{font-weight:700}
    .ma-hauteur{display:flex;align-items:center;gap:8px}
    .ma-hauteur input{flex:1}
    .ma-fin{width:40px;height:40px;flex:none;border-radius:50%;border:1px solid var(--border);background:var(--surface);font-size:1.2rem;line-height:1;cursor:pointer}
    .ma-bornes{display:flex;justify-content:space-between;font-size:.8rem;color:var(--fg-2)}
    .ma-ligne{display:flex;gap:8px;flex-wrap:wrap}
    .ma-ligne input{flex:1;min-width:160px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--bg)}
    .ma-profils{list-style:none;padding:0;margin:0}
    .ma-profils li{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 0;border-top:1px solid var(--border)}
    .ma-profils li>span:first-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .ma-actions{display:flex;gap:6px;flex:none}
    .ma-avert{border-left:4px solid var(--accent)}
    .ma-avert ul{margin:0;padding-left:20px}
    .ma-avert li{margin-bottom:6px}`;
  document.head.appendChild(css);

  return { monter, arreter: () => arreter() };
})();
