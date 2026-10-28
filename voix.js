/* Guidage vocal avec la voix de synthèse du téléphone (gratuit, sans connexion). */
window.AAVoix = (() => {
  const ok = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let run = 0, voix = null;

  function choisir() {
    try {
      const vs = window.speechSynthesis.getVoices();
      const fr = vs.filter((v) => /^fr/i.test(v.lang));
      voix = fr.find((v) => /fr[-_]FR/i.test(v.lang) && /Am[ée]lie|Audrey|Marie|Thomas|Google|Denise|Henri/i.test(v.name))
        || fr.find((v) => /fr[-_]FR/i.test(v.lang)) || fr[0] || null;
    } catch (e) { voix = null; }
  }
  if (ok) { choisir(); try { window.speechSynthesis.onvoiceschanged = choisir; } catch (e) {} }

  function utterance(texte, vitesse) {
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR'; if (voix) u.voice = voix;
    u.rate = vitesse || 0.88; u.pitch = 1; u.volume = 1;
    return u;
  }
  const dire = (texte, id) => new Promise((res) => {
    if (!ok || id !== run) return res();
    const u = utterance(texte);
    let fini = false; const fin = () => { if (!fini) { fini = true; res(); } };
    u.onend = fin; u.onerror = fin;
    // Garde-fou si le navigateur n'envoie jamais « onend »
    setTimeout(fin, Math.max(4000, texte.length * 120));
    window.speechSynthesis.speak(u);
  });
  const attendre = (ms, id) => new Promise((res) => {
    const t0 = Date.now();
    const tick = () => { if (id !== run || Date.now() - t0 >= ms) return res(); setTimeout(tick, 200); };
    tick();
  });

  /* etapes : [{texte, pause}] ; pause en secondes après la phrase */
  async function guider(etapes, opts = {}) {
    stop();
    const id = ++run;
    for (let i = 0; i < etapes.length; i++) {
      if (id !== run) return;
      opts.onStep && opts.onStep(i);
      await dire(etapes[i].texte, id);
      await attendre((etapes[i].pause || 8) * 1000, id);
    }
    if (id === run) {
      await dire("L'exercice est terminé. Prenez le temps de revenir à votre rythme.", id);
      if (id === run) { run++; opts.onFin && opts.onFin(); }
    }
  }
  function stop() { run++; if (ok) { try { window.speechSynthesis.cancel(); } catch (e) {} } }
  function annoncer(texte) { if (!ok) return; try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance(texte, 0.95)); } catch (e) {} }

  /* « texte [12] » → {texte, pause: 12} */
  function lireEtapes(src) {
    return (src || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
      const m = l.match(/^(.*?)\s*\[(\d{1,3})\]\s*$/);
      return m ? { texte: m[1], pause: Number(m[2]) } : { texte: l, pause: 8 };
    });
  }
  return { ok, guider, stop, annoncer, lireEtapes };
})();
