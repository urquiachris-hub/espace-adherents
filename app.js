/* Acouphènes Aventure · Espace adhérents
   Application web sans compilation. Deux modes :
   - démo (aucune configuration) : données d'exemple dans le navigateur ;
   - réel (config.js rempli) : Supabase, connexion par code reçu par mail. */
(() => {
  'use strict';
  const C = window.AA_CONFIG || {};
  const DEMO = !C.supabaseUrl || !C.supabaseAnonKey;
  const root = document.getElementById('app');

  // ---------- outils ----------
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'x' + Math.random().toString(36).slice(2));
  const fDate = (iso, opt) => iso ? new Date(iso).toLocaleDateString('fr-FR', opt || { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const fHeure = (iso) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fEur = (v) => v == null || v === '' ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(v);
  const auj = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const toLocalInput = (iso) => { if (!iso) return ''; const d = new Date(iso); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
  const safeUrl = (u) => /^https?:\/\//i.test(u || '') ? u : '';
  const safeAudio = (u) => /^(https?:\/\/|blob:)/i.test(u || '') ? u : '';

  function md(src) {
    const inline = (t) => t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const out = []; let list = null, para = [];
    const flushP = () => { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } };
    const flushL = () => { if (list) { out.push(`<${list.t}>` + list.items.map((i) => '<li>' + inline(i) + '</li>').join('') + `</${list.t}>`); list = null; } };
    esc(src).split('\n').forEach((raw) => {
      const l = raw.trim();
      if (!l) { flushP(); flushL(); return; }
      let m;
      if ((m = l.match(/^#{2,3}\s+(.*)/))) { flushP(); flushL(); out.push('<h2>' + inline(m[1]) + '</h2>'); }
      else if ((m = l.match(/^[-•]\s+(.*)/))) { flushP(); if (!list || list.t !== 'ul') { flushL(); list = { t: 'ul', items: [] }; } list.items.push(m[1]); }
      else if ((m = l.match(/^\d+\.\s+(.*)/))) { flushP(); if (!list || list.t !== 'ol') { flushL(); list = { t: 'ol', items: [] }; } list.items.push(m[1]); }
      else { flushL(); para.push(l); }
    });
    flushP(); flushL();
    return out.join('');
  }

  const ICONES = {
    accueil: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    articles: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    sons: '<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2"/>',
    sophro: '<circle cx="12" cy="12" r="8"/><path d="M8.5 12a3.5 3.5 0 0 1 7 0"/>',
    plus: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    agenda: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    journal: '<path d="M4 19l5-6 4 3 7-9"/><path d="M4 4v16h16"/>',
    lettre: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/>',
    echanges: '<path d="M4 5h12v9H8l-4 3z"/><path d="M16 9h4v9l-3-2h-7v-2"/>',
    aide: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/>',
    compte: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    admin: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
    idees: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  };
  const ico = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[n] || ''}</svg>`;
  const LOGO = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="var(--fg)"/><path d="M8 31l9-12 6 8 4-5 13 9" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M14 16c3-3 7-3 10 0M18 12c4-4 10-4 14 0" fill="none" stroke="var(--bg)" stroke-width="2.4" stroke-linecap="round"/></svg>';

  // ---------- données : mode démo ----------
  function demoApi() {
    const base = JSON.parse(JSON.stringify(window.AA_CONTENUS));
    const tables = {
      articles: base.articles.map((r) => ({ publie: true, ...r })),
      sophro: base.sophro.map((r) => ({ publie: true, valide: false, audio_url: '', ...r })),
      newsletters: base.newsletters.map((r) => ({ publie: true, ...r })),
      evenements: base.evenements.map((r) => ({ publie: true, inscription_ouverte: true, ...r })),
      annuaire: base.annuaire,
      membres: [
        { email: 'christophe@exemple.fr', prenom: 'Christophe', nom: 'Urquia', role: 'admin', actif: true, valide_jusqu: '2027-08-31' },
        { email: 'camille@exemple.fr', prenom: 'Camille', nom: 'Martin', role: 'adherent', actif: true, valide_jusqu: '2027-08-31' },
      ],
    };
    const ext = store.get('aa_demo_tables_v2', null);
    if (ext) Object.assign(tables, ext);
    let msgs = store.get('aa_demo_msgs', null) || base.messages.map((m) => ({ ...m, masque: false, mine: false }));
    let insc = store.get('aa_demo_insc', []);
    let signal = store.get('aa_demo_sig', []);
    let user = store.get('aa_demo_user', null);
    let sugg = store.get('aa_demo_sugg', null) || [
      { id: 'sg1', user_id: 'autre', auteur: 'Camille Martin', email: 'camille@exemple.fr', anonyme: false, type: "Une envie de sortie ou d'activité", message: "Une marche douce au bord du lac de Cazaux un dimanche matin, avec un pique-nique ? Je veux bien repérer le parcours.", aide: true, statut: 'Nouveau', reponse: null, repondu_at: null, created_at: new Date(Date.now() - 2 * 864e5).toISOString() },
      { id: 'sg2', user_id: 'autre', auteur: 'Anonyme', email: null, anonyme: true, type: 'Une idée', message: "Un groupe de parole en visio le soir, pour ceux qui habitent loin de Bordeaux.", aide: false, statut: 'En cours', reponse: "Merci pour l'idée ! On teste une première visio en janvier, l'annonce arrivera dans la lettre.", repondu_at: new Date(Date.now() - 864e5).toISOString(), created_at: new Date(Date.now() - 5 * 864e5).toISOString() },
    ];
    const save = () => { store.set('aa_demo_tables_v2', tables); store.set('aa_demo_msgs', msgs); store.set('aa_demo_insc', insc); store.set('aa_demo_sig', signal); store.set('aa_demo_sugg', sugg); };
    const tri = { articles: (a, b) => a.ordre - b.ordre, sophro: (a, b) => a.ordre - b.ordre, annuaire: (a, b) => a.ordre - b.ordre, newsletters: (a, b) => b.date_parution.localeCompare(a.date_parution), evenements: (a, b) => a.debut.localeCompare(b.debut), membres: (a, b) => a.email.localeCompare(b.email) };
    return {
      demo: true,
      async session() { return user; },
      async verifierAdhesion() { return true; },
      async envoyerCode() { return true; },
      async verifierCode(email, code, admin) {
        if (!/^\d{6}$/.test(code)) throw new Error('Le code contient 6 chiffres.');
        user = { email, prenom: admin ? 'Christophe' : 'Camille', nom: admin ? 'Urquia' : 'Martin', role: admin ? 'admin' : 'adherent', valide_jusqu: '2027-08-31' };
        store.set('aa_demo_user', user); return user;
      },
      async deconnexion() { user = null; store.del('aa_demo_user'); },
      async lister(t) { return [...tables[t]].filter((r) => user?.role === 'admin' || r.publie !== false).sort(tri[t] || (() => 0)); },
      async enregistrer(t, row) {
        const key = t === 'membres' ? 'email' : 'id';
        if (t !== 'membres' && !row.id) row.id = uid();
        const i = tables[t].findIndex((r) => r[key] === row[key]);
        if (i >= 0) tables[t][i] = { ...tables[t][i], ...row }; else tables[t].push(row);
        save(); return row;
      },
      async enregistrerPlusieurs(t, rows) { for (const r of rows) await this.enregistrer(t, r); return rows.length; },
      async supprimer(t, id) { const key = t === 'membres' ? 'email' : 'id'; tables[t] = tables[t].filter((r) => r[key] !== id); save(); },
      async placesRestantes(id) { const e = tables.evenements.find((x) => x.id === id); if (!e || e.places == null) return null; return Math.max(0, e.places - 3 - insc.filter((x) => x === id).length); },
      async mesInscriptions() { return insc; },
      async inscrire(id) { if (!insc.includes(id)) insc.push(id); save(); },
      async desinscrire(id) { insc = insc.filter((x) => x !== id); save(); },
      async inscrits() { return insc.map((id) => { const e = tables.evenements.find((x) => x.id === id) || {}; return { evenement_id: id, titre: e.titre, debut: e.debut, email: user.email, prenom: user.prenom, nom: user.nom, created_at: new Date().toISOString() }; }); },
      async messages() { return msgs.filter((m) => user?.role === 'admin' || !m.masque || m.mine).map((m) => ({ ...m, user_id: m.mine ? 'moi' : 'autre' })); },
      monId() { return 'moi'; },
      async publier(contenu, parent_id) { msgs.push({ id: uid(), auteur: `${user.prenom} ${user.nom[0]}.`, contenu, parent_id: parent_id || null, created_at: new Date().toISOString(), masque: false, mine: true }); save(); },
      async signaler(id) { if (!signal.includes(id)) signal.push(id); save(); },
      async signalements() { return signal.map((message_id) => ({ message_id })); },
      async masquer(id, v) { const m = msgs.find((x) => x.id === id); if (m) m.masque = v; save(); },
      async supprimerMessage(id) { msgs = msgs.filter((m) => m.id !== id && m.parent_id !== id); save(); },
      async suggestions() { return sugg.filter((x) => user?.role === 'admin' || x.user_id === 'moi').sort((a, b) => b.created_at.localeCompare(a.created_at)); },
      async proposer(r) { sugg.push({ id: uid(), user_id: 'moi', auteur: r.anonyme ? 'Anonyme' : `${user.prenom} ${user.nom}`, email: r.anonyme ? null : user.email, anonyme: !!r.anonyme, type: r.type, message: r.message, aide: !!r.aide, statut: 'Nouveau', reponse: null, repondu_at: null, created_at: new Date().toISOString() }); save(); },
      async repondre(id, statut, reponse) { const x = sugg.find((y) => y.id === id); if (!x) return; if ((reponse || '') !== (x.reponse || '')) x.repondu_at = reponse ? new Date().toISOString() : null; x.statut = statut; x.reponse = reponse || null; save(); },
      async retirerSuggestion(id) { sugg = sugg.filter((x) => x.id !== id); save(); },
      async envoyerAudio(blob) { return URL.createObjectURL(blob); },
    };
  }

  // ---------- données : Supabase ----------
  function chargerScript(src) {
    return new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error('Chargement impossible : vérifiez votre connexion.')); document.head.appendChild(s); });
  }
  async function supabaseApi() {
    await chargerScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
    const sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } });
    const ok = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
    let monId = null;
    const tri = { articles: ['ordre', true], sophro: ['ordre', true], annuaire: ['ordre', true], newsletters: ['date_parution', false], evenements: ['debut', true], membres: ['email', true] };
    const profil = async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) return null;
      monId = s.session.user.id;
      const p = ok(await sb.rpc('mon_profil'));
      if (!p) { await sb.auth.signOut(); throw new Error("Votre adhésion n'est plus active. Renouvelez-la sur HelloAsso, puis reconnectez-vous."); }
      const fin = p.valide_jusqu;
      if (fin && fin < auj() && p.role !== 'admin') { await sb.auth.signOut(); throw new Error("Votre adhésion a expiré. Renouvelez-la sur HelloAsso pour retrouver l'accès."); }
      return p;
    };
    return {
      demo: false,
      session: profil,
      async verifierAdhesion(email) { return ok(await sb.rpc('adhesion_valide', { p_email: email })); },
      async envoyerCode(email) { ok(await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } })); return true; },
      async verifierCode(email, code) { ok(await sb.auth.verifyOtp({ email, token: code, type: 'email' })); return profil(); },
      async deconnexion() { await sb.auth.signOut(); },
      async lister(t) { const [col, asc] = tri[t] || ['id', true]; return ok(await sb.from(t).select('*').order(col, { ascending: asc })); },
      async enregistrer(t, row) {
        const r = { ...row }; if (t !== 'membres' && !r.id) delete r.id;
        const q = t === 'membres' ? sb.from(t).upsert(r, { onConflict: 'email' }) : (r.id ? sb.from(t).update(r).eq('id', r.id) : sb.from(t).insert(r));
        ok(await q); return r;
      },
      async enregistrerPlusieurs(t, rows) { ok(await sb.from(t).upsert(rows, { onConflict: t === 'membres' ? 'email' : 'id' })); return rows.length; },
      async supprimer(t, id) { ok(await sb.from(t).delete().eq(t === 'membres' ? 'email' : 'id', id)); },
      async placesRestantes(id) { return ok(await sb.rpc('places_restantes', { p_evt: id })); },
      async mesInscriptions() { return ok(await sb.from('inscriptions').select('evenement_id').eq('user_id', monId)).map((r) => r.evenement_id); },
      async inscrire(id) { ok(await sb.from('inscriptions').insert({ evenement_id: id })); },
      async desinscrire(id) { ok(await sb.from('inscriptions').delete().eq('evenement_id', id).eq('user_id', monId)); },
      async inscrits() { return ok(await sb.from('inscrits_admin').select('*').order('debut')); },
      async messages() { return ok(await sb.from('messages').select('*').order('created_at', { ascending: true })); },
      monId() { return monId; },
      async publier(contenu, parent_id) { ok(await sb.from('messages').insert({ contenu, parent_id: parent_id || null, auteur: '-' })); },
      async signaler(id) { const { error } = await sb.from('signalements').insert({ message_id: id }); if (error && !/duplicate/i.test(error.message)) throw new Error(error.message); },
      async signalements() { return ok(await sb.from('signalements').select('message_id')); },
      async masquer(id, v) { ok(await sb.from('messages').update({ masque: v }).eq('id', id)); },
      async supprimerMessage(id) { ok(await sb.from('messages').delete().eq('id', id)); },
      async suggestions() { return ok(await sb.from('suggestions').select('*').order('created_at', { ascending: false })); },
      async proposer(r) { ok(await sb.from('suggestions').insert({ type: r.type, message: r.message, aide: !!r.aide, anonyme: !!r.anonyme })); },
      async repondre(id, statut, reponse) { ok(await sb.from('suggestions').update({ statut, reponse: reponse || null }).eq('id', id)); },
      async retirerSuggestion(id) { ok(await sb.from('suggestions').delete().eq('id', id)); },
      async envoyerAudio(blob, nom) {
        const ext = /mp4|m4a|aac/.test(blob.type) ? 'm4a' : /mpeg|mp3/.test(blob.type) ? 'mp3' : /webm/.test(blob.type) ? 'webm' : /ogg/.test(blob.type) ? 'ogg' : /wav/.test(blob.type) ? 'wav' : 'audio';
        const chemin = `${nom}-${Date.now()}.${ext}`;
        ok(await sb.storage.from('audios').upload(chemin, blob, { contentType: blob.type || 'audio/mp4', upsert: false }));
        return sb.storage.from('audios').getPublicUrl(chemin).data.publicUrl;
      },
    };
  }

  // ---------- journal (reste sur l'appareil) ----------
  const journal = {
    lire() { return store.get('aa_journal', []).sort((a, b) => a.jour.localeCompare(b.jour)); },
    ecrire(e) { const all = journal.lire().filter((x) => x.jour !== e.jour); all.push(e); store.set('aa_journal', all); },
    effacer() { store.del('aa_journal'); },
  };

  // ---------- état ----------
  let api = null, moi = null;
  const gere = () => ['admin', 'sophrologue'].includes(moi?.role);
  const cache = {};
  async function data(t, force) { if (force || !cache[t]) cache[t] = await api.lister(t); return cache[t]; }
  const oublier = (...t) => t.forEach((x) => delete cache[x]);

  const NAV = [
    ['accueil', 'Accueil', ''], ['articles', 'Lire', ''], ['sons', 'Sons', ''], ['sophro', 'Souffler', ''],
    ['agenda', 'Agenda', 'nav-2'], ['journal', 'Journal', 'nav-2'], ['echanges', 'Échanges', 'nav-2'],
    ['idees', 'Boîte à idées', 'nav-2'], ['lettre', 'La lettre', 'nav-2'], ['aide', 'Aide', 'nav-2'], ['compte', 'Mon compte', 'nav-2'], ['plus', 'Plus', 'nav-plus'],
  ];

  function coquille() {
    const items = [...NAV];
    if (gere()) items.splice(items.length - 1, 0, ['admin', 'Gestion', 'nav-2']);
    root.innerHTML = `${api.demo ? '<div class="demo-bandeau">Démonstration : les données restent dans ce navigateur, aucun mail n\'est envoyé.</div>' : ''}
      <div class="app">
        <nav class="nav" aria-label="Navigation principale">
          <div class="logo-side">Acouphènes Aventure</div>
          ${items.map(([k, l, c]) => `<a href="#/${k}" data-k="${k}" class="${c}">${ico(k)}<span>${l}</span></a>`).join('')}
        </nav>
        <main class="main" id="vue" tabindex="-1"></main>
      </div>`;
  }

  // ---------- vues ----------
  const VUES = {};

  VUES.accueil = async (v) => {
    const evts = (await data('evenements')).filter((e) => e.publie !== false && new Date(e.fin || e.debut) >= new Date());
    const prochain = evts[0];
    const j = journal.lire().find((e) => e.jour === auj());
    let nouv = 0;
    if (moi.role === 'admin') { try { nouv = (await api.suggestions()).filter((x) => x.statut === 'Nouveau').length; } catch (e) { nouv = 0; } }
    v.innerHTML = `
      <header class="marque">${LOGO}<div><div class="sur-titre">Espace adhérents</div><h1>Bonjour ${esc(moi.prenom || '')}</h1></div></header>
      ${nouv ? `<a class="lien-carte" href="#/admin/idees"><div class="alerte">${nouv} nouveau${nouv > 1 ? 'x' : ''} message${nouv > 1 ? 's' : ''} dans la boîte à idées</div></a>` : ''}
      ${prochain ? `<a class="lien-carte" href="#/agenda"><div class="carte"><div class="sur-titre">Prochain rendez-vous</div><h2>${esc(prochain.titre)}</h2><p class="muet">${esc(fDate(prochain.debut, { weekday: 'long', day: 'numeric', month: 'long' }))} · ${esc(prochain.lieu || '')}</p></div></a>` : ''}
      <a class="lien-carte" href="#/journal"><div class="carte"><div class="sur-titre">Mon journal</div><h2>${j ? 'Noté pour aujourd\'hui, merci.' : 'Comment ça va aujourd\'hui ?'}</h2><p class="muet petit">${j ? `Gêne ${j.gene}/10 · sommeil ${j.sommeil}/10` : 'Trente secondes pour suivre votre acouphène, votre sommeil et votre stress.'}</p></div></a>
      <section class="grille" aria-label="Raccourcis">
        <a class="tuile" href="#/sons">${ico('sons')}<strong>Sons apaisants</strong><span class="muet petit">Bruit rose, pluie, océan, avec minuterie</span></a>
        <a class="tuile" href="#/sophro">${ico('sophro')}<strong>Souffler</strong><span class="muet petit">Respiration et sophrologie guidées</span></a>
        <a class="tuile" href="#/articles">${ico('articles')}<strong>Comprendre</strong><span class="muet petit">Articles relus et sourcés</span></a>
        <a class="tuile" href="#/echanges">${ico('echanges')}<strong>Échanges</strong><span class="muet petit">Entre adhérents, en confiance</span></a>
        <a class="tuile" href="#/idees">${ico('idees')}<strong>Boîte à idées</strong><span class="muet petit">Une idée, une envie, une question ? Écrivez-moi</span></a>
        <a class="tuile" href="#/lettre">${ico('lettre')}<strong>La lettre</strong><span class="muet petit">Toutes les newsletters</span></a>
        <a class="tuile" href="#/aide">${ico('aide')}<strong>Trouver de l'aide</strong><span class="muet petit">Urgences, soins, associations</span></a>
      </section>
      <p class="muet petit">Cette application ne remplace pas un avis médical. En cas de baisse brutale de l'audition ou de vertiges, consultez le jour même.</p>`;
  };

  VUES.plus = async (v) => {
    const items = NAV.filter(([, , c]) => c === 'nav-2');
    if (gere()) items.push(['admin', 'Gestion', '']);
    v.innerHTML = `<h1>Plus</h1><div class="liste">${items.map(([k, l]) => `<a class="tuile" style="min-height:0;flex-direction:row;align-items:center;gap:12px" href="#/${k}">${ico(k)}<strong>${l}</strong></a>`).join('')}</div>`;
  };

  VUES.articles = async (v, [, id]) => {
    const all = (await data('articles')).filter((a) => a.publie !== false || moi.role === 'admin');
    if (id) {
      const a = all.find((x) => x.id === id);
      if (!a) { v.innerHTML = '<p>Article introuvable.</p><a href="#/articles">Retour aux articles</a>'; return; }
      v.innerHTML = `<a href="#/articles" class="petit">← Tous les articles</a>
        <article class="prose"><div class="sur-titre">${esc(a.categorie)}</div><h1>${esc(a.titre)}</h1>${a.resume ? `<p class="muet">${esc(a.resume)}</p>` : ''}${md(a.contenu)}</article>
        ${a.source_nom ? `<p class="source">Source : ${safeUrl(a.source_url) ? `<a href="${esc(a.source_url)}" target="_blank" rel="noopener">${esc(a.source_nom)}</a>` : esc(a.source_nom)}. Cet article informe, il ne remplace pas un avis médical.</p>` : ''}`;
      return;
    }
    const cats = [...new Set(all.map((a) => a.categorie))];
    let filtre = '';
    const draw = () => {
      const l = all.filter((a) => !filtre || a.categorie === filtre);
      v.querySelector('#liste-a').innerHTML = l.map((a) => `<a class="lien-carte" href="#/articles/${esc(a.id)}"><div class="carte"><span class="chip">${esc(a.categorie)}</span><h2 style="margin-top:8px">${esc(a.titre)}</h2><p class="muet petit" style="margin:6px 0 0">${esc(a.resume || '')}</p></div></a>`).join('') || '<p class="muet">Aucun article pour l\'instant.</p>';
      v.querySelectorAll('.onglets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === filtre)));
    };
    v.innerHTML = `<h1>Comprendre</h1><p class="muet">Des articles courts, relus et sourcés, pour mieux vivre avec les acouphènes.</p>
      <div class="onglets"><button type="button" data-c="">Tous</button>${cats.map((c) => `<button type="button" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="liste" id="liste-a"></div>`;
    v.querySelectorAll('.onglets button').forEach((b) => b.addEventListener('click', () => { filtre = b.dataset.c; draw(); }));
    draw();
  };

  VUES.sons = async (v) => {
    const SONS = [['rose', 'Bruit rose', 'Doux et équilibré'], ['brun', 'Bruit brun', 'Grave, enveloppant'], ['blanc', 'Bruit blanc', 'Clair, plus aigu'], ['pluie', 'Pluie', 'Averse régulière'], ['ocean', 'Océan', 'Houle lente']];
    let vol = store.get('aa_vol', 0.25), min = store.get('aa_min', 30);
    v.innerHTML = `<h1>Sons apaisants</h1>
      <p class="muet">Un fond sonore doux rend l'acouphène moins présent, surtout le soir. Réglez le volume <strong>en dessous</strong> de votre acouphène : le but n'est pas de le couvrir.</p>
      <div class="sons" role="group" aria-label="Ambiances">${SONS.map(([k, t, d]) => `<button type="button" class="son" data-s="${k}" aria-pressed="${window.AASons.enCours() === k}"><strong>${t}</strong><span class="muet petit">${d}</span></button>`).join('')}</div>
      <div class="carte form">
        <div class="champ"><label for="vol">Volume</label><input id="vol" type="range" min="0.02" max="0.8" step="0.01" value="${vol}"></div>
        <div><label>Arrêt automatique</label><div class="minuterie" id="minu">${[[15, '15 min'], [30, '30 min'], [60, '1 h'], [0, 'Jamais']].map(([m, t]) => `<button type="button" data-m="${m}" aria-pressed="${m === min}">${t}</button>`).join('')}</div></div>
        <div class="actions"><button type="button" class="btn" id="stop" ${window.AASons.enCours() ? '' : 'disabled'}>Arrêter</button><span class="muet petit" id="reste" aria-live="polite"></span></div>
      </div>
      <p class="muet petit">Vous n'entendez rien ? Montez le volume du téléphone ; sur iPhone, vérifiez aussi le bouton du mode silencieux sur le côté.</p>
      <p class="muet petit">Astuce : avec un casque, gardez un volume faible. En cas d'hyperacousie, préférez le haut-parleur du téléphone posé à distance. La thérapie sonore se décide avec un ORL ou un audioprothésiste.</p>`;
    const reste = v.querySelector('#reste'), stopB = v.querySelector('#stop');
    const tick = (ms) => { reste.textContent = ms ? `Arrêt dans ${Math.ceil(ms / 60000)} min` : ''; };
    v.querySelectorAll('.son').forEach((b) => b.addEventListener('click', () => {
      try { window.AASons.play(b.dataset.s, vol); } catch (e) { reste.textContent = "Le son ne peut pas démarrer sur cet appareil."; return; }
      window.AASons.minuterie(min, tick);
      v.querySelectorAll('.son').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); stopB.disabled = false;
      setTimeout(() => { if (window.AASons.etat() !== 'running') reste.textContent = "Le son est bloqué par le navigateur : touchez de nouveau l'ambiance."; }, 1200);
    }));
    v.querySelector('#vol').addEventListener('input', (e) => { vol = Number(e.target.value); store.set('aa_vol', vol); window.AASons.setVolume(vol); });
    v.querySelectorAll('#minu button').forEach((b) => b.addEventListener('click', () => {
      min = Number(b.dataset.m); store.set('aa_min', min);
      v.querySelectorAll('#minu button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (window.AASons.enCours()) window.AASons.minuterie(min, tick);
    }));
    stopB.addEventListener('click', () => { window.AASons.stop(); window.AASons.minuterie(0, tick); v.querySelectorAll('.son').forEach((x) => x.setAttribute('aria-pressed', 'false')); stopB.disabled = true; });
  };

  let souffleTimer = null;
  function arreterGuidage() {
    clearTimeout(souffleTimer);
    if (window.__aaWake) { try { window.__aaWake.release(); } catch (e) {} window.__aaWake = null; }
  }
  async function garderEcran() { try { if (navigator.wakeLock) window.__aaWake = await navigator.wakeLock.request('screen'); } catch (e) {} }

  VUES.sophro = async (v, [, id]) => {
    const all = (await data('sophro')).map((s) => ({ type: 'Sophrologie', ...s, type: s.type || 'Sophrologie' }));
    if (id) {
      const s = all.find((x) => x.id === id);
      if (!s) { v.innerHTML = '<p>Exercice introuvable.</p>'; return; }
      const etapes = window.AAVoix.lireEtapes(s.etapes);
      const r = (s.rythme || '').split('-').map(Number).filter((n) => n > 0);
      const rythme = r.length === 2 || r.length === 4 ? r : null;
      v.innerHTML = `<a href="#/sophro" class="petit">← Tous les exercices</a>
        <header><div class="sur-titre">${esc(s.type === 'TCC' ? 'Inspiré des TCC' : 'Sophrologie')} · ${esc(s.duree_min || '')} min ${s.valide ? '' : '· <span class="chip rouge">En attente de relecture</span>'}</div><h1>${esc(s.titre)}</h1><p class="muet">${esc(s.objectif || '')}</p></header>
        ${safeAudio(s.audio_url) ? `<div class="carte form">
          <div class="sur-titre">Version audio</div>
          <audio controls preload="none" src="${esc(s.audio_url)}" style="width:100%"></audio>
        </div>` : ''}
        ${rythme ? `<div class="carte souffle"><div class="bulle" id="bulle">Prêt·e ?</div><div class="actions"><button type="button" class="btn secondaire" id="go">Respiration guidée</button></div><span class="muet petit" id="cpt" aria-live="polite"></span></div>` : ''}
        <ol class="etapes" id="etapes">${etapes.map((e) => `<li><span>${esc(e.texte)}</span></li>`).join('')}</ol>
        <p class="muet petit">${s.type === 'TCC' ? "Exercice d'auto-assistance inspiré des thérapies cognitivo-comportementales. Il ne remplace pas une TCC menée par un professionnel, recommandée par la HAS." : 'Exercice de détente rédigé pour l\'association.'} Arrêtez si vous ressentez un inconfort.</p>`;
      if (rythme) {
        const ph = rythme.length === 2 ? [['Inspirez', rythme[0], 1], ['Expirez', rythme[1], 0.6]] : [['Inspirez', rythme[0], 1], ['Retenez', rythme[1], 1], ['Expirez', rythme[2], 0.6], ['Retenez', rythme[3], 0.6]];
        const bulle = v.querySelector('#bulle'), go = v.querySelector('#go'), cpt = v.querySelector('#cpt');
        let on = false;
        const arret = () => { clearTimeout(souffleTimer); on = false; go.textContent = 'Respiration guidée'; bulle.textContent = 'Prêt·e ?'; bulle.style.transitionDuration = '1s'; bulle.style.transform = 'scale(.6)'; cpt.textContent = ''; };
        go.addEventListener('click', () => {
          if (on) return arret();
          on = true; go.textContent = 'Arrêter'; garderEcran();
          const finT = Date.now() + (s.duree_min || 5) * 60000;
          const cycle = (k) => {
            if (!on) return;
            if (Date.now() >= finT) { arret(); bulle.textContent = 'Terminé'; return; }
            const [mot, d, sc] = ph[k % ph.length];
            bulle.style.transitionDuration = d + 's'; bulle.style.transform = `scale(${sc})`; bulle.textContent = mot;
            cpt.textContent = `Encore ${Math.ceil((finT - Date.now()) / 60000)} min`;
            souffleTimer = setTimeout(() => cycle(k + 1), d * 1000);
          };
          cycle(0);
        });
      }
      return;
    }
    let onglet = store.get('aa_sophro_tab', 'Sophrologie');
    const draw = () => {
      const l = all.filter((s) => s.type === onglet);
      v.querySelectorAll('.onglets button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.t === onglet)));
      v.querySelector('#note-t').hidden = onglet !== 'TCC';
      v.querySelector('#liste-s').innerHTML = l.map((s) => `<a class="lien-carte" href="#/sophro/${esc(s.id)}"><div class="carte"><div class="entete"><h2>${esc(s.titre)}</h2><span class="chip">${esc(s.duree_min || '')} min</span></div><p class="muet petit" style="margin:6px 0 0">${esc(s.objectif || '')}</p></div></a>`).join('') || '<p class="muet">Aucun exercice pour l\'instant.</p>';
    };
    v.innerHTML = `<h1>Souffler</h1><p class="muet">Des exercices pour relâcher la tension et changer de regard sur l'acouphène.</p>
      <div class="onglets"><button type="button" data-t="Sophrologie">Sophrologie et détente</button><button type="button" data-t="TCC">Mieux vivre avec (TCC)</button></div>
      <p class="alerte petit" id="note-t" hidden>Ces exercices d'auto-assistance s'inspirent des thérapies cognitivo-comportementales (TCC). Ils complètent mais ne remplacent pas une TCC avec un professionnel : parlez-en à votre médecin.</p>
      <div class="liste" id="liste-s"></div>`;
    v.querySelectorAll('.onglets button').forEach((b) => b.addEventListener('click', () => { onglet = b.dataset.t; store.set('aa_sophro_tab', onglet); draw(); }));
    draw();
  };

  VUES.lettre = async (v) => {
    const l = await data('newsletters');
    v.innerHTML = `<h1>La lettre</h1><p class="muet">Chaque trimestre : les nouvelles de l'association, l'actualité des acouphènes et les actions des autres associations.</p>
      <div class="liste">${l.map((n) => `<div class="carte"><div class="sur-titre">${esc(fDate(n.date_parution))}</div><h2>${esc(n.titre)}</h2><p class="muet petit">${esc(n.resume || '')}</p>${safeUrl(n.url_pdf) ? `<a class="btn secondaire petit" href="${esc(n.url_pdf)}" target="_blank" rel="noopener">Lire la lettre</a>` : ''}</div>`).join('') || '<p class="muet">Aucune lettre publiée.</p>'}</div>`;
  };

  VUES.agenda = async (v) => {
    const all = (await data('evenements')).filter((e) => e.publie !== false);
    const mes = await api.mesInscriptions();
    const now = new Date();
    const futurs = all.filter((e) => new Date(e.fin || e.debut) >= now), passes = all.filter((e) => new Date(e.fin || e.debut) < now).reverse();
    const carte = (e) => `<div class="carte" data-e="${esc(e.id)}">
      <div class="entete"><span class="chip">${esc(e.type)}</span>${mes.includes(e.id) ? '<span class="chip vert">Inscrit·e</span>' : ''}</div>
      <h2 style="margin-top:8px">${esc(e.titre)}</h2>
      <p class="muet petit" style="margin:4px 0">${esc(fDate(e.debut, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))} à ${esc(fHeure(e.debut))}${e.fin ? ` → ${esc(fDate(e.fin, { day: 'numeric', month: 'long' }))}` : ''}<br>${esc(e.lieu || '')}${e.prix ? ` · ${esc(fEur(e.prix))}` : ''}</p>
      <p>${esc(e.description || '')}</p>
      <p class="petit muet places"></p>
      ${new Date(e.fin || e.debut) >= now && e.inscription_ouverte !== false ? `<div class="actions"><button type="button" class="btn ${mes.includes(e.id) ? 'secondaire' : ''}" data-act="${mes.includes(e.id) ? 'out' : 'in'}">${mes.includes(e.id) ? 'Me désinscrire' : "M'inscrire"}</button></div>` : ''}
      <p class="petit erreur-e" style="color:var(--rouge)"></p></div>`;
    v.innerHTML = `<h1>Agenda</h1><p class="muet">Séjours, sorties, groupes de parole et conférences. L'inscription réserve votre place ; je reviens vers vous pour les détails.</p>
      <div class="liste">${futurs.map(carte).join('') || '<p class="muet">Aucun rendez-vous prévu pour l\'instant.</p>'}</div>
      ${passes.length ? `<details><summary class="muet">Rendez-vous passés (${passes.length})</summary><div class="liste" style="margin-top:12px">${passes.map(carte).join('')}</div></details>` : ''}`;
    for (const e of all) {
      const el = v.querySelector(`[data-e="${CSS.escape(e.id)}"]`); if (!el) continue;
      if (e.places != null) api.placesRestantes(e.id).then((n) => { if (n != null) el.querySelector('.places').textContent = n > 0 ? `${n} place${n > 1 ? 's' : ''} restante${n > 1 ? 's' : ''} sur ${e.places}` : 'Complet'; }).catch(() => {});
      const b = el.querySelector('[data-act]');
      if (b) b.addEventListener('click', async () => {
        if (b.dataset.act === 'out' && !b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Confirmer la désinscription'; return; }
        b.disabled = true;
        try { b.dataset.act === 'in' ? await api.inscrire(e.id) : await api.desinscrire(e.id); render(); }
        catch (err) { el.querySelector('.erreur-e').textContent = /row-level|policy/i.test(err.message) ? "Inscription impossible : l'évènement est complet ou fermé." : err.message; b.disabled = false; }
      });
    }
  };

  VUES.journal = async (v) => {
    const today = journal.lire().find((e) => e.jour === auj()) || { jour: auj(), intensite: 5, gene: 5, sommeil: 5, stress: 5, note: '' };
    const C4 = [['intensite', "Force de l'acouphène", '0 = inaudible, 10 = très fort'], ['gene', 'Gêne ressentie', '0 = aucune, 10 = insupportable'], ['sommeil', 'Qualité du sommeil', '0 = très mauvais, 10 = excellent'], ['stress', 'Niveau de stress', '0 = détendu·e, 10 = très stressé·e']];
    v.innerHTML = `<h1>Mon journal</h1>
      <p class="muet">Notez chaque jour en trente secondes. Au fil des semaines, vous verrez ce qui aide et ce qui pèse, et vous aurez des repères à montrer à votre médecin ou à votre ORL.</p>
      <div class="alerte petit">Vos notes restent uniquement sur cet appareil. Personne d'autre, pas même l'association, n'y a accès.</div>
      <form class="carte form" id="fj">
        <div class="champ"><label for="jour">Jour</label><input type="date" id="jour" value="${esc(today.jour)}" max="${auj()}"></div>
        <div class="curseurs">${C4.map(([k, t, d]) => `<div><div class="curseur-l"><label for="j-${k}" style="margin:0">${t}</label><output id="o-${k}">${today[k]}</output></div><input type="range" id="j-${k}" min="0" max="10" step="1" value="${today[k]}" aria-describedby="d-${k}"><div class="muet petit" id="d-${k}">${d}</div></div>`).join('')}</div>
        <div class="champ"><label for="j-note">Une note (facultatif)</label><textarea id="j-note" placeholder="Bruit au travail, bonne balade, nuit agitée…">${esc(today.note || '')}</textarea></div>
        <div class="actions"><button class="btn" type="submit">Enregistrer</button><span class="muet petit" id="j-ok" aria-live="polite"></span></div>
      </form>
      <section class="carte"><h2>Les 30 derniers jours</h2><div class="graph" id="graph"></div><div class="legende"><span><i style="background:var(--accent)"></i>Gêne</span><span><i style="background:var(--fg)"></i>Force</span><span><i style="background:var(--vert)"></i>Sommeil</span></div></section>
      <details class="carte" id="carnet"><summary><strong>Carnet des pensées</strong> <span class="muet petit">(exercice TCC)</span></summary>
        <form class="form" id="fc" style="margin-top:12px">
          <div class="champ"><label for="c-sit">La situation</label><input type="text" id="c-sit" placeholder="Ex. le soir, au moment de dormir"></div>
          <div class="champ"><label for="c-pen">La pensée qui m'a traversé</label><textarea id="c-pen" placeholder="Ex. ça ne s'arrêtera jamais"></textarea></div>
          <div><div class="curseur-l"><label for="c-e1" style="margin:0">Intensité de l'émotion avant</label><output id="o-e1">5</output></div><input type="range" id="c-e1" min="0" max="10" value="5"></div>
          <div class="champ"><label for="c-alt">Une pensée plus juste</label><textarea id="c-alt" placeholder="Ex. c'est dur ce soir, mais j'ai déjà réussi à m'endormir malgré le bruit"></textarea></div>
          <div><div class="curseur-l"><label for="c-e2" style="margin:0">Intensité de l'émotion après</label><output id="o-e2">5</output></div><input type="range" id="c-e2" min="0" max="10" value="5"></div>
          <div class="actions"><button class="btn" type="submit">Enregistrer</button><span class="muet petit" id="c-ok" aria-live="polite"></span></div>
        </form>
        <div class="liste" id="c-liste" style="margin-top:12px"></div>
      </details>
      <details class="carte" id="plan"><summary><strong>Mon plan de crise</strong></summary>
        <form class="form" id="fp" style="margin-top:12px">
          <div class="champ"><label for="p-sig">Mes signaux d'alerte</label><textarea id="p-sig" placeholder="Fatigue, irritabilité, je m'isole…"></textarea></div>
          <div class="champ"><label for="p-apa">Ce qui m'apaise vite</label><textarea id="p-apa" placeholder="Pause SOS, bruit rose, marche, douche chaude…"></textarea></div>
          <div class="champ"><label for="p-pers">Les personnes que je peux appeler</label><textarea id="p-pers" placeholder="Prénom et numéro"></textarea></div>
          <div class="champ"><label for="p-soin">Mon médecin, mon ORL</label><textarea id="p-soin" placeholder="Nom et numéro"></textarea></div>
          <p class="alerte petit" style="margin:0">Idées suicidaires : appelez le <strong>3114</strong> (gratuit, 24 h/24). Urgence : <strong>15</strong> ou <strong>112</strong>.</p>
          <div class="actions"><button class="btn" type="submit">Enregistrer mon plan</button><span class="muet petit" id="p-ok" aria-live="polite"></span></div>
        </form>
      </details>
      <section class="carte form"><h2>Mes données</h2><p class="muet petit">Copiez votre journal pour le coller dans un mail ou un tableur avant un rendez-vous.</p>
        <div class="actions"><button type="button" class="btn secondaire petit" id="copie">Copier mon journal</button><button type="button" class="btn secondaire petit" id="eff">Tout effacer</button></div><span class="petit muet" id="msg-d" aria-live="polite"></span>
        <textarea id="txt-d" hidden readonly></textarea></section>`;
    C4.forEach(([k]) => v.querySelector('#j-' + k).addEventListener('input', (e) => { v.querySelector('#o-' + k).textContent = e.target.value; }));
    v.querySelector('#jour').addEventListener('change', (e) => {
      const x = journal.lire().find((r) => r.jour === e.target.value);
      C4.forEach(([k]) => { const val = x ? x[k] : 5; v.querySelector('#j-' + k).value = val; v.querySelector('#o-' + k).textContent = val; });
      v.querySelector('#j-note').value = x ? x.note || '' : '';
    });
    v.querySelector('#fj').addEventListener('submit', (e) => {
      e.preventDefault();
      const r = { jour: v.querySelector('#jour').value || auj(), note: v.querySelector('#j-note').value.trim() };
      C4.forEach(([k]) => { r[k] = Number(v.querySelector('#j-' + k).value); });
      journal.ecrire(r); v.querySelector('#j-ok').textContent = 'Enregistré.'; dessinerGraph(v.querySelector('#graph'));
    });
    const csv = () => ['jour;force;gene;sommeil;stress;note', ...journal.lire().map((r) => [r.jour, r.intensite, r.gene, r.sommeil, r.stress, (r.note || '').replace(/[;\n]/g, ' ')].join(';'))].join('\n');
    v.querySelector('#copie').addEventListener('click', async () => {
      const t = csv(); const msg = v.querySelector('#msg-d');
      try { await navigator.clipboard.writeText(t); msg.textContent = 'Copié.'; }
      catch (e) { const ta = v.querySelector('#txt-d'); ta.hidden = false; ta.value = t; ta.select(); msg.textContent = 'Sélectionnez le texte ci-dessous et copiez-le.'; }
    });
    const eff = v.querySelector('#eff');
    eff.addEventListener('click', () => {
      if (!eff.dataset.ok) { eff.dataset.ok = '1'; eff.textContent = 'Confirmer : tout effacer'; return; }
      journal.effacer(); store.del('aa_carnet'); store.del('aa_plan'); render();
    });
    const cl = v.querySelector('#c-liste');
    const drawC = () => { const l = store.get('aa_carnet', []).slice(-5).reverse(); cl.innerHTML = l.map((c) => `<div class="msg" style="border-top:1px solid var(--border);padding-top:8px"><div class="msg-tete"><strong>${esc(c.sit || 'Sans titre')}</strong><span>${esc(fDate(c.date, { day: 'numeric', month: 'short' }))} · ${esc(c.e1)} → ${esc(c.e2)}/10</span></div><div class="petit"><em>${esc(c.pen)}</em><br>→ ${esc(c.alt)}</div></div>`).join(''); };
    ['e1', 'e2'].forEach((k) => v.querySelector('#c-' + k).addEventListener('input', (e) => { v.querySelector('#o-' + k).textContent = e.target.value; }));
    v.querySelector('#fc').addEventListener('submit', (e) => {
      e.preventDefault();
      const c = { date: new Date().toISOString(), sit: v.querySelector('#c-sit').value.trim(), pen: v.querySelector('#c-pen').value.trim(), alt: v.querySelector('#c-alt').value.trim(), e1: v.querySelector('#c-e1').value, e2: v.querySelector('#c-e2').value };
      if (!c.pen) { v.querySelector('#c-ok').textContent = 'Notez au moins la pensée.'; return; }
      store.set('aa_carnet', [...store.get('aa_carnet', []), c]); e.target.reset(); v.querySelector('#o-e1').textContent = '5'; v.querySelector('#o-e2').textContent = '5';
      v.querySelector('#c-ok').textContent = 'Enregistré.'; drawC();
    });
    drawC();
    const plan = store.get('aa_plan', {});
    [['sig', 'p-sig'], ['apa', 'p-apa'], ['pers', 'p-pers'], ['soin', 'p-soin']].forEach(([k, id]) => { v.querySelector('#' + id).value = plan[k] || ''; });
    v.querySelector('#fp').addEventListener('submit', (e) => {
      e.preventDefault();
      store.set('aa_plan', { sig: v.querySelector('#p-sig').value, apa: v.querySelector('#p-apa').value, pers: v.querySelector('#p-pers').value, soin: v.querySelector('#p-soin').value });
      v.querySelector('#p-ok').textContent = 'Plan enregistré sur ce téléphone.';
    });
    if (location.hash.includes('carnet')) v.querySelector('#carnet').open = true;
    if (location.hash.includes('plan')) v.querySelector('#plan').open = true;
    dessinerGraph(v.querySelector('#graph'));
  };

  function dessinerGraph(box) {
    const rows = journal.lire().slice(-30);
    if (rows.length < 2) { box.innerHTML = '<p class="muet petit">Le graphique apparaît à partir de deux jours notés.</p>'; return; }
    const W = 640, H = 200, ml = 28, mr = 10, mt = 10, mb = 26;
    const x = (i) => ml + (i * (W - ml - mr)) / (rows.length - 1);
    const y = (val) => mt + (H - mt - mb) * (1 - val / 10);
    const ligne = (k) => rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[k]).toFixed(1)}`).join('');
    const grid = [0, 5, 10].map((t) => `<line x1="${ml}" x2="${W - mr}" y1="${y(t)}" y2="${y(t)}" stroke="var(--border)"/><text x="${ml - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="var(--fg-2)">${t}</text>`).join('');
    const lab = (i) => { const [, m, d] = rows[i].jour.split('-'); return `${d}/${m}`; };
    const xl = [0, rows.length - 1].map((i, n) => `<text x="${x(i)}" y="${H - 6}" text-anchor="${n ? 'end' : 'start'}" font-size="11" fill="var(--fg-2)">${lab(i)}</text>`).join('');
    const path = (k, c, w) => `<path d="${ligne(k)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const pts = rows.map((r, i) => `<circle cx="${x(i)}" cy="${y(r.gene)}" r="3" fill="var(--accent)"><title>${lab(i)} : gêne ${r.gene}, force ${r.intensite}, sommeil ${r.sommeil}</title></circle>`).join('');
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution de la gêne, de la force de l'acouphène et du sommeil">${grid}${xl}${path('sommeil', 'var(--vert)', 1.6)}${path('intensite', 'var(--fg)', 1.6)}${path('gene', 'var(--accent)', 2.4)}${pts}</svg>`;
  }

  VUES.aide = async (v) => {
    const all = await data('annuaire');
    const cats = [...new Set(all.map((a) => a.categorie))];
    v.innerHTML = `<h1>Trouver de l'aide</h1>
      ${cats.map((c) => `<section class="liste"><h2>${esc(c)}</h2>${all.filter((a) => a.categorie === c).map((a) => `<div class="carte"><div class="entete"><h3>${esc(a.nom)}</h3>${a.telephone ? `<a class="btn petit" href="tel:${esc(a.telephone.replace(/\s/g, ''))}">${esc(a.telephone)}</a>` : ''}</div>${a.description ? `<p class="muet petit" style="margin:6px 0 0">${esc(a.description)}</p>` : ''}${safeUrl(a.site) ? `<p class="petit" style="margin:6px 0 0"><a href="${esc(a.site)}" target="_blank" rel="noopener">${esc(a.site.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></p>` : ''}</div>`).join('')}</section>`).join('')}`;
  };

  VUES.echanges = async (v) => {
    const [msgs, sig] = await Promise.all([api.messages(), moi.role === 'admin' ? api.signalements() : Promise.resolve([])]);
    const sigSet = new Set(sig.map((s) => s.message_id));
    const me = api.monId();
    const fils = msgs.filter((m) => !m.parent_id).sort((a, b) => b.created_at.localeCompare(a.created_at));
    const un = (m) => `<div class="msg" data-m="${esc(m.id)}">
        <div class="msg-tete"><strong>${esc(m.auteur)}</strong><span>${esc(fDate(m.created_at, { day: 'numeric', month: 'short' }))} ${esc(fHeure(m.created_at))}</span></div>
        ${m.masque ? '<span class="chip rouge">Masqué par la modération</span>' : ''}${sigSet.has(m.id) ? ' <span class="chip rouge">Signalé</span>' : ''}
        <div style="white-space:pre-wrap">${esc(m.contenu)}</div>
        <div class="actions" style="gap:14px">
          ${!m.parent_id ? '<button type="button" class="lien-btn" data-a="rep">Répondre</button>' : ''}
          ${m.user_id !== me ? '<button type="button" class="lien-btn" data-a="sig">Signaler</button>' : ''}
          ${m.user_id === me || moi.role === 'admin' ? '<button type="button" class="lien-btn" data-a="sup">Supprimer</button>' : ''}
          ${moi.role === 'admin' ? `<button type="button" class="lien-btn" data-a="mas">${m.masque ? 'Réafficher' : 'Masquer'}</button>` : ''}
        </div></div>`;
    v.innerHTML = `<h1>Échanges</h1>
      <details class="carte petit"><summary><strong>La charte de l'espace</strong></summary>
        <ul><li>Bienveillance : chacun vit ses acouphènes à sa façon.</li><li>Pas de conseil médical ni de traitement à recommander : on partage son vécu, on renvoie vers les professionnels.</li><li>Pas de publicité.</li><li>Ce qui se dit ici reste ici : ne partagez pas les messages des autres à l'extérieur.</li><li>Un message vous gêne ? Signalez-le, je le regarde rapidement.</li></ul>
        <p class="muet">Seuls les adhérents connectés lisent ces messages. Votre prénom et l'initiale de votre nom s'affichent.</p></details>
      <form class="carte form" id="fm"><div class="champ"><label for="nm">Nouveau message</label><textarea id="nm" maxlength="2000" required placeholder="Une astuce, une question, une bonne nouvelle…"></textarea></div><div class="actions"><button class="btn" type="submit">Publier</button><span class="petit" id="em" style="color:var(--rouge)"></span></div></form>
      <div class="liste">${fils.map((f) => `<div class="carte">${un(f)}<div class="reponses">${msgs.filter((r) => r.parent_id === f.id).map(un).join('')}</div><form class="form rep" data-p="${esc(f.id)}" hidden style="margin-top:10px"><textarea maxlength="2000" required aria-label="Votre réponse"></textarea><div class="actions"><button class="btn petit" type="submit">Répondre</button></div></form></div>`).join('') || '<p class="muet">Soyez le premier ou la première à écrire.</p>'}</div>`;
    v.querySelector('#fm').addEventListener('submit', async (e) => {
      e.preventDefault(); const t = v.querySelector('#nm').value.trim(); if (!t) return;
      try { await api.publier(t); render(); } catch (err) { v.querySelector('#em').textContent = err.message; }
    });
    v.querySelectorAll('form.rep').forEach((f) => f.addEventListener('submit', async (e) => {
      e.preventDefault(); const t = f.querySelector('textarea').value.trim(); if (!t) return;
      await api.publier(t, f.dataset.p); render();
    }));
    v.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', async () => {
      const id = b.closest('[data-m]').dataset.m, a = b.dataset.a;
      if (a === 'rep') { const f = b.closest('.carte').querySelector('form.rep'); f.hidden = !f.hidden; if (!f.hidden) f.querySelector('textarea').focus(); return; }
      if (a === 'sup' && !b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Confirmer la suppression'; return; }
      if (a === 'sig') { await api.signaler(id); b.textContent = 'Signalé, merci'; b.disabled = true; return; }
      if (a === 'sup') await api.supprimerMessage(id);
      if (a === 'mas') { const m = msgs.find((x) => x.id === id); await api.masquer(id, !m.masque); }
      render();
    }));
  };

  const STATUTS = ['Nouveau', 'Lu', 'En cours', 'Réalisé', 'Pas retenu'];
  const TYPES_IDEE = ['Une idée', "Une envie de sortie ou d'activité", 'Une question', "Un retour sur l'association", 'Autre'];
  const chipStatut = (s, adm) => `<span class="chip${s === 'Réalisé' ? ' vert' : s === 'Pas retenu' ? ' rouge' : ''}">${esc(s === 'Nouveau' && !adm ? 'Envoyé' : s)}</span>`;

  VUES.idees = async (v) => {
    const l = (await api.suggestions()).filter((x) => moi.role !== 'admin' || x.user_id === api.monId());
    v.innerHTML = `<h1>Boîte à idées</h1>
      <p class="muet">L'association se construit avec vous. Une idée de sortie, une envie, une question ou un retour sur ce qui marche ou pas : écrivez-moi ici. Je lis tout et je vous réponds dans l'application.<br><span class="petit">Christophe, président</span></p>
      <form class="carte form" id="fi">
        <div class="champ"><label for="i-t">C'est plutôt…</label><select id="i-t">${TYPES_IDEE.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="champ"><label for="i-m">Votre message</label><textarea id="i-m" maxlength="3000" required placeholder="Ex. : une marche douce au bord de l'eau, un atelier sommeil, un groupe de parole en visio…"></textarea></div>
        <label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="i-a"> Je veux bien donner un coup de main pour le mettre en place</label>
        <label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="i-x"> Envoyer sans mon nom (je ne pourrai pas vous recontacter en dehors de l'appli)</label>
        <div class="actions"><button class="btn" type="submit">Envoyer</button><span class="petit" id="i-r" aria-live="polite"></span></div>
        <p class="petit muet" style="margin:0">Seul le président lit ces messages. Ils ne sont pas visibles par les autres adhérents. Pour échanger avec tout le monde, passez par <a href="#/echanges">Échanges</a>.</p>
      </form>
      <h2>Mes messages</h2>
      <div class="liste">${l.map((x) => `<div class="carte" data-s="${esc(x.id)}">
          <div class="entete"><strong>${esc(x.type)}</strong>${chipStatut(x.statut)}</div>
          <p class="petit muet" style="margin:0">Envoyé le ${esc(fDate(x.created_at, { day: 'numeric', month: 'long' }))}${x.anonyme ? ' · sans mon nom' : ''}</p>
          <div style="white-space:pre-wrap">${esc(x.message)}</div>
          ${x.reponse ? `<div class="reponses"><div class="msg"><div class="msg-tete"><strong>Réponse de Christophe</strong><span>${esc(x.repondu_at ? fDate(x.repondu_at, { day: 'numeric', month: 'short' }) : '')}</span></div><div style="white-space:pre-wrap">${esc(x.reponse)}</div></div></div>` : ''}
          ${x.statut === 'Nouveau' ? '<div class="actions"><button type="button" class="lien-btn" data-del>Retirer ce message</button></div>' : ''}
        </div>`).join('') || '<p class="muet">Vous n\'avez encore rien envoyé.</p>'}</div>`;
    v.querySelector('#fi').addEventListener('submit', async (e) => {
      e.preventDefault();
      const m = v.querySelector('#i-m').value.trim(); if (!m) return;
      const b = e.target.querySelector('button'); b.disabled = true;
      try { await api.proposer({ type: v.querySelector('#i-t').value, message: m, aide: v.querySelector('#i-a').checked, anonyme: v.querySelector('#i-x').checked }); v.querySelector('#i-r').textContent = 'Merci, c\'est bien envoyé !'; setTimeout(render, 900); }
      catch (err) { v.querySelector('#i-r').textContent = err.message; b.disabled = false; }
    });
    v.querySelectorAll('[data-del]').forEach((d) => d.addEventListener('click', async () => {
      if (!d.dataset.ok) { d.dataset.ok = '1'; d.textContent = 'Confirmer'; return; }
      await api.retirerSuggestion(d.closest('[data-s]').dataset.s); render();
    }));
  };

  VUES.compte = async (v) => {
    const th = store.get('aa_theme', 'auto');
    v.innerHTML = `<h1>Mon compte</h1>
      <div class="carte"><p style="margin:0"><strong>${esc(moi.prenom || '')} ${esc(moi.nom || '')}</strong><br><span class="muet">${esc(moi.email)}</span></p>
        ${moi.valide_jusqu ? `<p class="petit muet">Adhésion valable jusqu'au ${esc(fDate(moi.valide_jusqu))}.</p>` : ''}
        ${C.lienAdhesion ? `<a class="btn secondaire petit" href="${esc(C.lienAdhesion)}" target="_blank" rel="noopener">Renouveler mon adhésion</a>` : ''}</div>
      <div class="carte form"><div class="champ"><label for="theme">Affichage</label><select id="theme"><option value="auto">Comme mon téléphone</option><option value="light">Clair</option><option value="dark">Sombre</option></select></div></div>
      <div class="carte"><h2>Installer l'application</h2><p class="petit">Sur iPhone : dans Safari, touchez <strong>Partager</strong> puis <strong>Sur l'écran d'accueil</strong>.<br>Sur Android : dans Chrome, menu ⋮ puis <strong>Installer l'application</strong>.</p></div>
      <details class="carte petit"><summary><strong>Mes données personnelles</strong></summary>
        <p>L'association conserve votre nom, votre mail, vos inscriptions, vos messages et ceux de la boîte à idées, uniquement pour faire fonctionner cet espace. Ils ne sont ni vendus ni partagés.</p>
        <p>Votre journal reste sur votre téléphone : l'association n'y a pas accès.</p>
        <p>Pour consulter, corriger ou supprimer vos données, écrivez à acouphenes.aventure@gmail.com.</p></details>
      <button type="button" class="btn secondaire" id="out">Me déconnecter</button>`;
    const s = v.querySelector('#theme'); s.value = th;
    s.addEventListener('change', () => { store.set('aa_theme', s.value); appliquerTheme(); });
    v.querySelector('#out').addEventListener('click', async () => { await api.deconnexion(); moi = null; Object.keys(cache).forEach((k) => delete cache[k]); ecranConnexion(); });
  };

  // ---------- gestion (admin) ----------
  const ROLES = [['adherent', 'Adhérent'], ['sophrologue', 'Sophrologue'], ['admin', 'Admin']];
  const SCHEMAS = {
    articles: { titre: 'Articles', cle: 'titre', champs: [['titre', 'Titre', 'text', true], ['categorie', 'Catégorie', ['Comprendre', 'Se soigner', 'Au quotidien', 'Vivre avec', 'Actualités']], ['resume', 'Résumé', 'textarea'], ['contenu', 'Texte (## pour un intertitre, - pour une liste)', 'long'], ['source_nom', 'Source', 'text'], ['source_url', 'Lien de la source', 'url'], ['ordre', 'Ordre', 'number'], ['publie', 'Publié', 'check']] },
    evenements: { titre: 'Agenda', cle: 'titre', champs: [['titre', 'Titre', 'text', true], ['type', 'Type', ['Séjour', 'Sortie', 'Groupe de parole', 'Conférence', 'AG', 'Autre']], ['debut', 'Début', 'datetime', true], ['fin', 'Fin', 'datetime'], ['lieu', 'Lieu', 'text'], ['description', 'Description', 'textarea'], ['places', 'Places (vide = sans limite)', 'number'], ['prix', 'Prix (€)', 'number'], ['inscription_ouverte', 'Inscriptions ouvertes', 'check'], ['publie', 'Publié', 'check']] },
    newsletters: { titre: 'Lettres', cle: 'titre', champs: [['titre', 'Titre', 'text', true], ['date_parution', 'Date de parution', 'date', true], ['resume', 'Résumé', 'textarea'], ['url_pdf', 'Lien de lecture (Drive partagé « tous les utilisateurs disposant du lien »)', 'url'], ['publie', 'Publié', 'check']] },
    annuaire: { titre: 'Annuaire', cle: 'nom', champs: [['categorie', 'Catégorie', ['Urgences', 'Soins', 'Associations', "L'association"]], ['nom', 'Nom', 'text', true], ['description', 'Description', 'textarea'], ['telephone', 'Téléphone', 'text'], ['site', 'Site', 'url'], ['ordre', 'Ordre', 'number']] },
    sophro: { titre: 'Exercices', cle: 'titre', champs: [['titre', 'Titre', 'text', true], ['type', 'Catégorie', ['Sophrologie', 'TCC']], ['objectif', 'Objectif', 'textarea'], ['duree_min', 'Durée (min)', 'number'], ['rythme', 'Animation de respiration', ['', '4-6', '5-5', '4-4-4-4']], ['etapes', 'Étapes (une par ligne)', 'long'], ['audio_url', "Lien de l'audio (Supabase Storage › audios)", 'url'], ['valide', 'Relu par la sophrologue', 'check'], ['publie', 'Publié', 'check'], ['ordre', 'Ordre', 'number']] },
  };

  function formulaire(t, row, onDone) {
    const S = SCHEMAS[t]; const f = document.createElement('form'); f.className = 'carte form';
    f.innerHTML = `<h2>${row.id ? 'Modifier' : 'Ajouter'}</h2>` + S.champs.map(([k, l, type, req]) => {
      const val = row[k] ?? (type === 'check' ? true : '');
      const id = `f-${t}-${k}`;
      if (Array.isArray(type)) return `<div class="champ"><label for="${id}">${l}</label><select id="${id}" name="${k}">${type.map((o) => `<option value="${esc(o)}" ${o === val ? 'selected' : ''}>${esc(o || '(aucune)')}</option>`).join('')}</select></div>`;
      if (type === 'check') return `<label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="${id}" name="${k}" ${val ? 'checked' : ''}> ${l}</label>`;
      if (type === 'textarea' || type === 'long') return `<div class="champ"><label for="${id}">${l}</label><textarea id="${id}" name="${k}" ${type === 'long' ? 'style="min-height:260px"' : ''} ${req ? 'required' : ''}>${esc(val)}</textarea></div>`;
      const it = type === 'datetime' ? 'datetime-local' : type;
      const v2 = type === 'datetime' ? toLocalInput(val) : val;
      return `<div class="champ"><label for="${id}">${l}</label><input id="${id}" name="${k}" type="${it}" value="${esc(v2)}" ${req ? 'required' : ''} ${type === 'number' ? 'step="any"' : ''}></div>`;
    }).join('') + `<div class="actions"><button class="btn" type="submit">Enregistrer</button><button class="btn secondaire" type="button" data-x>Annuler</button>${row.id && moi.role === 'admin' ? '<button class="btn secondaire" type="button" data-del>Supprimer</button>' : ''}</div><p class="petit err" style="color:var(--rouge)"></p>`;
    if (t === 'sophro') f.querySelector(`#f-sophro-audio_url`).closest('.champ').after(enregistreur(row, f));
    f.querySelector('[data-x]').addEventListener('click', () => onDone(false));
    const del = f.querySelector('[data-del]');
    if (del) del.addEventListener('click', async () => {
      if (!del.dataset.ok) { del.dataset.ok = '1'; del.textContent = 'Confirmer la suppression'; return; }
      await api.supprimer(t, row.id); oublier(t); onDone(true);
    });
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const out = row.id ? { id: row.id } : {};
      S.champs.forEach(([k, , type]) => {
        const el = f.elements[k];
        if (type === 'check') out[k] = el.checked;
        else if (type === 'number') out[k] = el.value === '' ? null : Number(el.value);
        else if (type === 'datetime') out[k] = el.value ? new Date(el.value).toISOString() : null;
        else out[k] = el.value === '' && type !== 'long' && type !== 'textarea' && !Array.isArray(type) ? null : el.value;
      });
      try { await api.enregistrer(t, out); oublier(t); onDone(true); } catch (err) { f.querySelector('.err').textContent = err.message; }
    });
    return f;
  }

  // ---------- enregistrer sa voix (exercices guidés) ----------
  function scriptPour(row) {
    const S = window.AA_SCRIPTS || {};
    const c = (window.AA_CONTENUS?.sophro || []).find((x) => x.id === row.id || x.titre === row.titre);
    return S[row.id] || (c && S[c.id]) || '';
  }
  const fDuree = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

  function enregistreur(row, form) {
    const box = document.createElement('div');
    box.className = 'carte enreg';
    const script = scriptPour(row);
    const peutEnregistrer = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    box.innerHTML = `<h3 style="margin:0">Voix de l'exercice</h3>
      <div id="r-actuel"></div>
      ${peutEnregistrer ? `<div class="actions"><button type="button" class="btn" id="r-go">Enregistrer ma voix</button><button type="button" class="btn secondaire" id="r-stop" hidden>Arrêter</button><span class="enreg-temps" id="r-t" aria-live="off"></span></div>` : '<p class="petit muet">Ce navigateur ne permet pas d\'enregistrer. Utilisez Safari (iPhone) ou Chrome, ou envoyez un fichier.</p>'}
      <p class="petit" id="r-msg" aria-live="polite"></p>
      <div id="r-essai" hidden><audio controls style="width:100%"></audio><div class="actions"><button type="button" class="btn" id="r-ok">Utiliser cet enregistrement</button><button type="button" class="btn secondaire" id="r-redo">Recommencer</button></div></div>
      ${script ? `<details id="r-script"><summary><strong>Texte à lire</strong> <span class="muet petit">(les silences sont indiqués entre crochets)</span></summary><div class="script-lecture">${script.split(/\n\n+/).map((p) => /^\[silence/.test(p) ? `<p class="silence">${esc(p.replace(/[\[\]]/g, ''))}</p>` : `<p>${esc(p)}</p>`).join('')}</div></details>` : '<p class="petit muet">Pas de script prévu pour cet exercice : lisez les étapes ci-dessus, en laissant des silences.</p>'}
      <div class="champ" id="r-fichier"><label for="r-fic">Ou choisir un fichier audio (Dictaphone, ElevenLabs… : m4a, mp3)</label><input id="r-fic" type="file" accept="audio/*"></div>
      <p class="petit muet" style="margin:0">Conseils : pièce calme, téléphone posé à 20-30 cm, voix lente. Mettez le téléphone en mode avion pour ne pas être interrompu.</p>`;
    const $ = (q) => box.querySelector(q);
    const msg = (t, err) => { $('#r-msg').textContent = t; $('#r-msg').style.color = err ? 'var(--rouge)' : ''; };
    const champUrl = form.querySelector('#f-sophro-audio_url');
    const afficherActuel = () => {
      const u = safeAudio(champUrl.value);
      $('#r-actuel').innerHTML = u ? `<p class="petit" style="margin:0 0 6px">Enregistrement actuel :</p><audio controls preload="none" src="${esc(u)}" style="width:100%"></audio><div class="actions"><button type="button" class="lien-btn" id="r-del">Retirer cet enregistrement</button></div>` : '<p class="petit muet" style="margin:0">Pas encore d\'enregistrement : les adhérents suivent les étapes écrites.</p>';
      const d = $('#r-del');
      if (d) d.addEventListener('click', async () => { if (!d.dataset.ok) { d.dataset.ok = '1'; d.textContent = 'Confirmer le retrait'; return; } champUrl.value = ''; await sauver(''); });
    };
    const sauver = async (url) => {
      champUrl.value = url;
      if (row.id) { await api.enregistrer('sophro', { id: row.id, audio_url: url || null }); row.audio_url = url; oublier('sophro'); msg(url ? 'Enregistrement en ligne : les adhérents l\'entendent dès maintenant.' : 'Enregistrement retiré.'); }
      else msg('Audio prêt. Cliquez sur « Enregistrer » en bas du formulaire pour créer l\'exercice.');
      afficherActuel();
    };
    const envoyer = async (blob) => {
      if (blob.size > 45 * 1024 * 1024) { msg('Fichier trop lourd (45 Mo maximum).', true); return; }
      msg('Envoi en cours…');
      try { const url = await api.envoyerAudio(blob, (row.titre || 'exercice').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 40)); await sauver(url); }
      catch (e) { msg('Envoi impossible : ' + e.message, true); }
    };
    afficherActuel();
    $('#r-fic').addEventListener('change', (e) => { const fi = e.target.files[0]; if (fi) envoyer(fi); e.target.value = ''; });
    if (!peutEnregistrer) return box;

    let rec = null, flux = null, morceaux = [], debut = 0, tick = null, blob = null, wake = null;
    const formats = ['audio/mp4', 'audio/mp4;codecs=mp4a.40.2', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
    const fin = () => { clearInterval(tick); if (flux) flux.getTracks().forEach((t) => t.stop()); flux = null; if (wake) { try { wake.release(); } catch (e) {} wake = null; } };
    $('#r-go').addEventListener('click', async () => {
      msg(''); $('#r-essai').hidden = true;
      try { flux = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: true, channelCount: 1 } }); }
      catch (e) { msg("Micro inaccessible. Autorisez le micro pour ce site dans les réglages du navigateur, puis réessayez.", true); return; }
      const mime = formats.find((m) => MediaRecorder.isTypeSupported?.(m)) || '';
      try { rec = new MediaRecorder(flux, mime ? { mimeType: mime, audioBitsPerSecond: 128000 } : undefined); }
      catch (e) { rec = new MediaRecorder(flux); }
      morceaux = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) morceaux.push(e.data); };
      rec.onstop = () => {
        fin(); $('#r-actuel').hidden = false; $('#r-fichier').hidden = false;
        blob = new Blob(morceaux, { type: rec.mimeType || mime || 'audio/mp4' });
        const a = $('#r-essai audio'); if (a.src) URL.revokeObjectURL(a.src); a.src = URL.createObjectURL(blob);
        $('#r-essai').hidden = false; $('#r-go').hidden = false; $('#r-stop').hidden = true; $('#r-go').textContent = 'Recommencer l\'enregistrement';
        msg(/webm|ogg/.test(blob.type) ? 'Réécoutez avant de valider. Format WebM : certains iPhone anciens ne le liront pas ; pour être tranquille, enregistrez depuis un iPhone ou envoyez un fichier m4a/mp3.' : 'Réécoutez avant de valider.');
      };
      rec.start(1000); debut = Date.now();
      try { if (navigator.wakeLock) wake = await navigator.wakeLock.request('screen'); } catch (e) {}
      $('#r-go').hidden = true; $('#r-stop').hidden = false; $('#r-actuel').hidden = true; $('#r-fichier').hidden = true;
      const d = $('#r-script'); if (d) d.open = true;
      $('#r-t').textContent = '● 0:00';
      tick = setInterval(() => { $('#r-t').textContent = '● ' + fDuree((Date.now() - debut) / 1000); }, 500);
    });
    $('#r-stop').addEventListener('click', () => { if (rec && rec.state !== 'inactive') rec.stop(); $('#r-t').textContent = fDuree((Date.now() - debut) / 1000); });
    $('#r-redo').addEventListener('click', () => { $('#r-essai').hidden = true; blob = null; $('#r-go').click(); });
    $('#r-ok').addEventListener('click', () => { if (blob) envoyer(blob); $('#r-essai').hidden = true; });
    return box;
  }

  function parseCsv(txt) {
    const lignes = txt.replace(/\r/g, '').split('\n').filter((l) => l.trim());
    if (!lignes.length) return [];
    const sep = [';', '\t', ','].map((s) => [s, lignes[0].split(s).length]).sort((a, b) => b[1] - a[1])[0][0];
    const split = (l) => { const out = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map((x) => x.trim()); };
    const head = split(lignes[0]).map((h) => h.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));
    const pick = (re, pref) => { const c = head.map((h, i) => [h, i]).filter(([h]) => re.test(h)); const p = c.find(([h]) => pref && pref.test(h)); return (p || c[0] || [])[1]; };
    let iE = pick(/mail/, /adh|participant|beneficiaire/), iP = pick(/prenom/, /adh|participant|beneficiaire/), iN = pick(/^nom|[^e]nom/, /adh|participant|beneficiaire/);
    let rows = lignes.slice(1).map(split);
    if (iE == null) { iE = 0; rows = lignes.map(split); }
    const vus = new Set();
    return rows.map((r) => ({ email: (r[iE] || '').toLowerCase().trim(), prenom: iP != null ? r[iP] : '', nom: iN != null ? r[iN] : '' }))
      .filter((r) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email) && !vus.has(r.email) && vus.add(r.email));
  }

  VUES.admin = async (v, [, onglet]) => {
    if (!gere()) { v.innerHTML = '<p>Réservé à la gestion.</p>'; return; }
    // La sophrologue ne voit que les exercices
    const admin = moi.role === 'admin';
    onglet = admin ? onglet || 'membres' : 'sophro';
    const ONG = admin ? [['membres', 'Adhérents'], ['inscrits', 'Inscrits'], ['idees', 'Boîte à idées'], ['moderation', 'Modération'], ...Object.entries(SCHEMAS).map(([k, s]) => [k, s.titre])] : [['sophro', SCHEMAS.sophro.titre]];
    v.innerHTML = `<h1>Gestion</h1><div class="onglets">${ONG.map(([k, l]) => `<button type="button" data-o="${k}" aria-pressed="${k === onglet}">${l}</button>`).join('')}</div><div id="adm" class="liste"></div>`;
    v.querySelectorAll('[data-o]').forEach((b) => b.addEventListener('click', () => { location.hash = '#/admin/' + b.dataset.o; }));
    const box = v.querySelector('#adm');

    if (onglet === 'membres') {
      const m = await data('membres', true);
      const actifs = m.filter((x) => x.actif && (!x.valide_jusqu || x.valide_jusqu >= auj()));
      box.innerHTML = `<div class="carte form"><h2>Importer depuis HelloAsso</h2>
          <p class="petit muet">Dans HelloAsso : Adhésions › votre campagne › Exporter (CSV). Ouvrez le fichier, copiez tout et collez-le ici. Les adresses déjà présentes sont mises à jour.</p>
          <div class="champ"><label for="csv">Contenu du fichier</label><textarea id="csv" placeholder="Prénom;Nom;Email&#10;Camille;Martin;camille@exemple.fr"></textarea></div>
          <div class="champ"><label for="fin">Adhésion valable jusqu'au</label><input id="fin" type="date" value="${esc(C.finAdhesion || '2027-08-31')}"></div>
          <div class="actions"><button type="button" class="btn secondaire" id="prev">Vérifier</button><button type="button" class="btn" id="imp" disabled>Importer</button></div><p class="petit" id="res" aria-live="polite"></p></div>
        <div class="carte form"><h2>Ajouter une personne</h2>
          <div class="grille"><div class="champ"><label for="m-p">Prénom</label><input id="m-p" type="text"></div><div class="champ"><label for="m-n">Nom</label><input id="m-n" type="text"></div></div>
          <div class="champ"><label for="m-e">Mail</label><input id="m-e" type="email"></div>
          <div class="actions"><button type="button" class="btn" id="m-add">Ajouter</button></div><p class="petit" id="m-res" style="color:var(--rouge)"></p></div>
        <div class="carte"><h2>${actifs.length} adhérent${actifs.length > 1 ? 's' : ''} avec accès</h2><div class="tableau"><table><thead><tr><th>Nom</th><th>Mail</th><th>Jusqu'au</th><th>Rôle</th><th></th></tr></thead><tbody>
          ${m.map((x) => `<tr data-e="${esc(x.email)}"><td>${esc(x.prenom || '')} ${esc(x.nom || '')}</td><td>${esc(x.email)}</td><td>${esc(x.valide_jusqu ? fDate(x.valide_jusqu, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—')}</td><td>${x.email === moi.email ? esc(x.role) : `<select data-r aria-label="Rôle">${ROLES.map(([r, l]) => `<option value="${r}" ${r === x.role ? 'selected' : ''}>${l}</option>`).join('')}</select>`}</td><td><button type="button" class="lien-btn" data-t>${x.actif ? 'Retirer l\'accès' : 'Rendre l\'accès'}</button></td></tr>`).join('')}
        </tbody></table></div></div>`;
      let lu = [];
      box.querySelector('#prev').addEventListener('click', () => {
        lu = parseCsv(box.querySelector('#csv').value);
        box.querySelector('#res').textContent = lu.length ? `${lu.length} adresse${lu.length > 1 ? 's' : ''} trouvée${lu.length > 1 ? 's' : ''} : ${lu.slice(0, 3).map((r) => r.email).join(', ')}${lu.length > 3 ? '…' : ''}` : 'Aucune adresse mail trouvée. Vérifiez que la première ligne contient les titres de colonnes.';
        box.querySelector('#imp').disabled = !lu.length;
      });
      box.querySelector('#imp').addEventListener('click', async () => {
        const fin = box.querySelector('#fin').value || null;
        const exist = new Map(m.map((x) => [x.email, x]));
        const rows = lu.map((r) => ({ email: r.email, prenom: r.prenom || exist.get(r.email)?.prenom || null, nom: r.nom || exist.get(r.email)?.nom || null, actif: true, valide_jusqu: fin, role: exist.get(r.email)?.role || 'adherent' }));
        try { const n = await api.enregistrerPlusieurs('membres', rows); oublier('membres'); box.querySelector('#res').textContent = `${n} adhérent${n > 1 ? 's' : ''} importé${n > 1 ? 's' : ''}.`; setTimeout(render, 900); }
        catch (err) { box.querySelector('#res').textContent = err.message; }
      });
      box.querySelector('#m-add').addEventListener('click', async () => {
        const email = box.querySelector('#m-e').value.trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { box.querySelector('#m-res').textContent = 'Adresse mail invalide.'; return; }
        try { await api.enregistrer('membres', { email, prenom: box.querySelector('#m-p').value.trim() || null, nom: box.querySelector('#m-n').value.trim() || null, actif: true, role: 'adherent', valide_jusqu: C.finAdhesion || '2027-08-31' }); oublier('membres'); render(); }
        catch (err) { box.querySelector('#m-res').textContent = err.message; }
      });
      box.querySelectorAll('[data-r]').forEach((sel) => sel.addEventListener('change', async () => {
        const x = m.find((r) => r.email === sel.closest('tr').dataset.e);
        await api.enregistrer('membres', { ...x, role: sel.value }); oublier('membres'); render();
      }));
      box.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', async () => {
        const x = m.find((r) => r.email === b.closest('tr').dataset.e);
        if (x.email === moi.email) return;
        await api.enregistrer('membres', { ...x, actif: !x.actif }); oublier('membres'); render();
      }));
      return;
    }

    if (onglet === 'inscrits') {
      const l = await api.inscrits();
      const parEvt = {}; l.forEach((r) => { (parEvt[r.titre] = parEvt[r.titre] || []).push(r); });
      box.innerHTML = Object.entries(parEvt).map(([t, rs]) => `<div class="carte"><h2>${esc(t)} · ${rs.length}</h2><div class="tableau"><table><thead><tr><th>Nom</th><th>Mail</th><th>Inscrit le</th></tr></thead><tbody>${rs.map((r) => `<tr><td>${esc(r.prenom || '')} ${esc(r.nom || '')}</td><td>${esc(r.email)}</td><td>${esc(fDate(r.created_at, { day: '2-digit', month: '2-digit' }))}</td></tr>`).join('')}</tbody></table></div></div>`).join('') || '<p class="muet">Aucune inscription pour l\'instant.</p>';
      return;
    }

    if (onglet === 'idees') {
      const l = await api.suggestions();
      const filtre = store.get('aa_filtre_idees', 'actifs');
      const vis = l.filter((x) => filtre === 'tous' || (filtre === 'actifs' ? !['Réalisé', 'Pas retenu'].includes(x.statut) : x.statut === filtre));
      const n = (s) => l.filter((x) => x.statut === s).length;
      box.innerHTML = `<div class="onglets">${[['actifs', 'À traiter'], ['Nouveau', `Nouveaux (${n('Nouveau')})`], ['Réalisé', 'Réalisés'], ['Pas retenu', 'Pas retenus'], ['tous', `Tous (${l.length})`]].map(([k, t]) => `<button type="button" data-f="${esc(k)}" aria-pressed="${k === filtre}">${esc(t)}</button>`).join('')}</div>`
        + (vis.map((x) => `<form class="carte form" data-s="${esc(x.id)}">
            <div class="entete"><strong>${esc(x.type)}</strong>${chipStatut(x.statut, true)}</div>
            <p class="petit muet" style="margin:0">${esc(x.auteur || '')}${x.email ? ` · <a href="mailto:${esc(x.email)}">${esc(x.email)}</a>` : ''} · ${esc(fDate(x.created_at, { day: 'numeric', month: 'short' }))}${x.aide ? ' · <strong>prêt·e à aider</strong>' : ''}</p>
            <div style="white-space:pre-wrap">${esc(x.message)}</div>
            <div class="champ"><label>Statut</label><select name="statut">${STATUTS.map((s) => `<option ${s === x.statut ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
            <div class="champ"><label>Réponse (visible par l'adhérent dans l'appli)</label><textarea name="reponse" maxlength="3000">${esc(x.reponse || '')}</textarea></div>
            <div class="actions"><button class="btn petit" type="submit">Enregistrer</button><button class="lien-btn" type="button" data-del>Supprimer</button><span class="petit ok-msg" aria-live="polite"></span></div>
          </form>`).join('') || '<p class="muet">Rien ici pour l\'instant.</p>');
      box.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { store.set('aa_filtre_idees', b.dataset.f); render(); }));
      box.querySelectorAll('form[data-s]').forEach((f) => {
        f.addEventListener('submit', async (e) => {
          e.preventDefault();
          try { await api.repondre(f.dataset.s, f.elements.statut.value, f.elements.reponse.value.trim()); f.querySelector('.ok-msg').textContent = 'Enregistré.'; setTimeout(render, 700); }
          catch (err) { f.querySelector('.ok-msg').textContent = err.message; }
        });
        const d = f.querySelector('[data-del]');
        d.addEventListener('click', async () => { if (!d.dataset.ok) { d.dataset.ok = '1'; d.textContent = 'Confirmer la suppression'; return; } await api.retirerSuggestion(f.dataset.s); render(); });
      });
      return;
    }

    if (onglet === 'moderation') {
      const [msgs, sig] = await Promise.all([api.messages(), api.signalements()]);
      const ids = new Set(sig.map((s) => s.message_id));
      const l = msgs.filter((x) => ids.has(x.id) || x.masque);
      box.innerHTML = `<p class="muet petit">Messages signalés ou masqués. Gérez-les directement dans <a href="#/echanges">Échanges</a> (boutons Masquer / Supprimer).</p>` + (l.map((x) => `<div class="carte"><div class="msg-tete"><strong>${esc(x.auteur)}</strong><span>${ids.has(x.id) ? 'Signalé' : ''} ${x.masque ? '· Masqué' : ''}</span></div><div style="white-space:pre-wrap">${esc(x.contenu)}</div></div>`).join('') || '<p class="muet">Rien à modérer.</p>');
      return;
    }

    const S = SCHEMAS[onglet]; if (!S) return;
    const rows = await data(onglet, true);
    const liste = () => {
      box.innerHTML = (admin ? `<div class="actions"><button type="button" class="btn" id="add">Ajouter</button></div>` : '') + rows.map((r) => `<button type="button" class="carte" data-id="${esc(r.id)}" style="text-align:left;cursor:pointer;font:inherit;color:inherit"><div class="entete"><strong>${esc(r[S.cle])}</strong>${r.publie === false ? '<span class="chip rouge">Brouillon</span>' : ''}${onglet === 'sophro' && !r.valide ? '<span class="chip">À relire</span>' : ''}${onglet === 'sophro' && r.audio_url ? '<span class="chip vert">Voix enregistrée</span>' : ''}</div></button>`).join('');
      box.querySelector('#add')?.addEventListener('click', () => ouvrir({}));
      box.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => ouvrir(rows.find((r) => r.id === b.dataset.id))));
    };
    const ouvrir = (row) => { box.replaceChildren(formulaire(onglet, row, (chg) => { if (chg) render(); else liste(); })); box.querySelector('input,textarea,select')?.focus(); };
    liste();
  };

  // ---------- connexion ----------
  function ecranConnexion(msg) {
    let email = '';
    root.innerHTML = `${api.demo ? '<div class="demo-bandeau">Démonstration : tapez n\'importe quelle adresse puis n\'importe quel code à 6 chiffres.</div>' : ''}
      <div class="connexion"><div class="carte">
        <div class="marque">${LOGO}<div><div class="sur-titre">Acouphènes Aventure</div><h1 style="font-size:1.5rem">Espace adhérents</h1></div></div>
        <form class="form" id="f1">
          <p class="muet" style="margin:0">Entrez l'adresse mail utilisée pour votre adhésion sur HelloAsso. Vous recevrez un code de connexion.</p>
          <div class="champ"><label for="mail">Adresse mail</label><input id="mail" type="email" autocomplete="email" required inputmode="email"></div>
          ${api.demo ? '<label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="adm"> Voir la démo en tant que gestionnaire</label>' : ''}
          <button class="btn" type="submit">Recevoir mon code</button>
        </form>
        <form class="form" id="f2" hidden>
          <p style="margin:0">Un code à 6 chiffres vient d'être envoyé à <strong id="mail-aff"></strong>. Pensez à regarder dans les indésirables.</p>
          <div class="champ"><label for="code">Code reçu</label><input id="code" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="\\d{6}" required></div>
          <button class="btn" type="submit">Me connecter</button>
          <button class="lien-btn" type="button" id="retour">Changer d'adresse</button>
        </form>
        <div class="alerte erreur" id="err" ${msg ? '' : 'hidden'}>${esc(msg || '')}</div>
        <p class="muet petit" style="margin:0">Pas encore adhérent·e ? <a href="${esc(C.lienAdhesion || 'https://www.helloasso.com/associations/acouphenes-aventure')}" target="_blank" rel="noopener">Adhérer pour 15 € par an</a>. Un souci : acouphenes.aventure@gmail.com</p>
      </div></div>`;
    const err = (t) => { const e = root.querySelector('#err'); e.textContent = t; e.hidden = !t; };
    root.querySelector('#f1').addEventListener('submit', async (e) => {
      e.preventDefault(); err('');
      email = root.querySelector('#mail').value.trim().toLowerCase();
      const b = e.target.querySelector('button'); b.disabled = true;
      try {
        if (!(await api.verifierAdhesion(email))) { err("Cette adresse ne correspond à aucune adhésion en cours. Vérifiez l'adresse utilisée sur HelloAsso, ou écrivez-nous."); b.disabled = false; return; }
        await api.envoyerCode(email);
        root.querySelector('#f1').hidden = true; root.querySelector('#f2').hidden = false; root.querySelector('#mail-aff').textContent = email; root.querySelector('#code').focus();
      } catch (x) { err(/rate|seconds/i.test(x.message) ? 'Trop de demandes rapprochées. Patientez une minute puis réessayez.' : x.message); }
      b.disabled = false;
    });
    root.querySelector('#retour').addEventListener('click', () => { root.querySelector('#f1').hidden = false; root.querySelector('#f2').hidden = true; });
    root.querySelector('#f2').addEventListener('submit', async (e) => {
      e.preventDefault(); err('');
      const b = e.target.querySelector('button'); b.disabled = true;
      try { moi = await api.verifierCode(email, root.querySelector('#code').value.trim(), root.querySelector('#adm')?.checked); if (!moi) throw new Error('Connexion impossible.'); demarrer(); }
      catch (x) { err(/expired|invalid/i.test(x.message) ? 'Code incorrect ou expiré. Demandez-en un nouveau.' : x.message); b.disabled = false; }
    });
  }

  // ---------- routeur ----------
  async function render() {
    if (!moi) return;
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const k = VUES[parts[0]] ? parts[0] : 'accueil';
    arreterGuidage();
    document.querySelectorAll('.nav a').forEach((a) => { if (a.dataset.k === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    const v = document.getElementById('vue');
    try { await VUES[k](v, parts.length ? parts : ['accueil']); }
    catch (e) { v.innerHTML = `<div class="alerte erreur">Impossible de charger cette page : ${esc(e.message)}</div>`; }
    window.scrollTo(0, 0);
  }

  function demarrer() { coquille(); if (!location.hash) location.hash = '#/accueil'; render(); }
  function appliquerTheme() { const t = store.get('aa_theme', 'auto'); if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t); }

  window.addEventListener('hashchange', render);
  appliquerTheme();
  (async () => {
    root.innerHTML = '<div class="connexion"><p class="muet">Chargement…</p></div>';
    try { api = DEMO ? demoApi() : await supabaseApi(); }
    catch (e) { root.innerHTML = `<div class="connexion"><div class="alerte erreur">${esc(e.message)}</div></div>`; return; }
    try { moi = await api.session(); } catch (e) { return ecranConnexion(e.message); }
    moi ? demarrer() : ecranConnexion();
  })();

  if ('serviceWorker' in navigator && !DEMO && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
