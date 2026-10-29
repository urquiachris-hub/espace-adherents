/* Découpe le texte d'un exercice en étapes affichées à l'écran. */
window.AAVoix = (() => {
  /* « texte [12] » → {texte} : l'ancienne durée de pause entre crochets est ignorée */
  function lireEtapes(src) {
    return (src || '').split('\n').map((l) => l.trim()).filter(Boolean).map((l) => ({ texte: l.replace(/\s*\[\d{1,3}\]\s*$/, '') }));
  }
  return { lireEtapes };
})();
