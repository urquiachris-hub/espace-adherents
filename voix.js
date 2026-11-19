/* Découpe le texte d'un exercice en étapes affichées à l'écran. */
window.AAVoix = (() => {
  /* « texte [12] » → {texte} : l'ancienne durée de pause entre crochets est ignorée */
  function lireEtapes(src) {
    return (src || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => ({ texte: l.replace(/\s*\[\d{1,3}\]\s*$/, '') }));
  }
  return { lireEtapes };
})();

/* Arrêter la respiration guidée coupe aussi l'enregistrement audio de l'exercice,
   et changer de page coupe tout enregistrement en cours. */
(() => {
  const couper = () => document.querySelectorAll('audio').forEach((a) => { try { a.pause(); } catch (e) {} });
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('#go');
    if (b && b.textContent.trim() === 'Arrêter') couper();
  }, true);
  window.addEventListener('hashchange', couper);
})();
