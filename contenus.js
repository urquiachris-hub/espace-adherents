/* Contenus de départ de l'espace adhérents.
   Servent au mode démo et à générer supabase/seed.sql.
   Contenus santé : rédigés d'après Santé.fr et la recommandation HAS du 16/07/2026,
   à faire relire par un professionnel de santé avant la mise en ligne. */
window.AA_CONTENUS = {
  articles: [
    {
      id: 'a1', ordre: 10, categorie: 'Comprendre',
      titre: "Les acouphènes, c'est quoi ?",
      resume: "Sifflements, bourdonnements, grésillements : ce que l'on sait de ce bruit que vous êtes seul·e à entendre.",
      source_nom: 'Santé.fr', source_url: 'https://www.sante.fr/node/2055505',
      contenu: `Un acouphène est un bruit que l'on perçoit sans qu'aucun son extérieur ne le produise : sifflement, bourdonnement, tintement, grésillement. Il peut toucher une oreille ou les deux, être permanent ou passager.

## D'où viennent-ils ?

La cause la plus fréquente est une lésion des cellules sensorielles de l'oreille interne, liée au bruit excessif ou au vieillissement. Les acouphènes accompagnent souvent une baisse de l'audition.

D'autres causes existent : bouchon de cérumen, otite, hypertension, maladie de Ménière, certains médicaments. Parfois, la cause reste inconnue.

## Un handicap qui ne se voit pas

Personne autour de vous n'entend ce bruit. C'est ce qui le rend difficile à expliquer, et parfois isolant. Le stress, la fatigue et le manque de sommeil peuvent augmenter la gêne, qui à son tour augmente le stress.

## Ce qu'il faut retenir

- Un acouphène est un symptôme : il mérite un avis médical, surtout s'il est récent.
- La gêne peut diminuer, même quand le bruit reste. C'est tout l'objet de la prise en charge.
- Vous n'êtes pas seul·e : en parler à d'autres personnes concernées aide.`,
    },
    {
      id: 'a2', ordre: 20, categorie: 'Se soigner',
      titre: 'Quand consulter, et qui ?',
      resume: 'Les signes qui doivent faire consulter vite, et le parcours de soin recommandé.',
      source_nom: 'HAS, recommandation du 16/07/2026 ; Santé.fr', source_url: 'https://www.has-sante.fr/jcms/p_4196187/fr/acouphenes-invalidants-des-cles-pour-ameliorer-le-diagnostic-et-la-prise-en-charge-des-adultes',
      contenu: `## Consultez le jour même si l'acouphène s'accompagne de :

- une baisse brutale de l'audition ;
- des vertiges ;
- un mal de tête inhabituel ou un état confus ;
- des signes neurologiques (faiblesse, trouble de la parole, de la vision).

En cas de doute, appelez le 15.

## Consultez rapidement (dans les jours qui viennent) si :

- l'acouphène est très pénible ou ne s'améliore pas en quelques jours ;
- vous avez mal à l'oreille ;
- l'acouphène bat au rythme de votre pouls (acouphène « pulsatile ») ;
- il ne touche qu'une seule oreille.

## Le parcours de soin

1. **Votre médecin traitant** fait le premier bilan, recherche les signes de gravité et coordonne la suite.
2. **L'ORL** mesure votre audition et caractérise l'acouphène. Une imagerie peut être demandée selon les cas.
3. **Une consultation de synthèse** vous explique les résultats et le projet de soin.

## Si le moral flanche

L'anxiété, les troubles du sommeil et la déprime sont fréquents avec des acouphènes invalidants. Parlez-en à votre médecin : ils se soignent. Si vous avez des idées suicidaires, appelez le **3114** (gratuit, 24 h/24).`,
    },
    {
      id: 'a3', ordre: 30, categorie: 'Se soigner',
      titre: 'Ce que recommande la HAS (juillet 2026)',
      resume: "Les premières recommandations françaises sur les acouphènes invalidants de l'adulte, en clair.",
      source_nom: 'HAS ; Vidal, 2026', source_url: 'https://www.vidal.fr/actualites/38105-acouphenes-les-therapies-cognitivo-comportementales-indiquees-dans-tous-les-cas.html',
      contenu: `Le 16 juillet 2026, la Haute Autorité de santé a publié sa recommandation « Acouphènes invalidants chez l'adulte : diagnostic et prise en charge ». Voici les points clés.

## Les TCC, fil conducteur

Les thérapies cognitivo-comportementales (TCC) sont recommandées dans tous les cas. Elles n'effacent pas le bruit : elles aident à changer la façon dont on y réagit, pour que la gêne recule.

## L'audition d'abord

Si vous entendez moins bien, un appareillage auditif peut être proposé. L'audioprothésiste intervient alors sur orientation du médecin.

## Mesurer pour suivre

La gêne se mesure avec des questionnaires simples (intensité, gêne, sommeil, anxiété), refaits à chaque étape. Le journal de cette application peut vous aider à préparer vos rendez-vous.

## Les médicaments

Leur bénéfice attendu est modeste. Ils servent surtout à traiter ce qui accompagne les acouphènes : troubles du sommeil, anxiété, dépression.

## Bouger

L'activité physique est recommandée en cas d'anxiété associée. C'est aussi ce que nous vivons à Acouphènes Aventure : le mouvement aide à tenir.`,
    },
    {
      id: 'a4', ordre: 40, categorie: 'Au quotidien',
      titre: 'Protéger ses oreilles au quotidien',
      resume: 'Concerts, outils, écouteurs : les bons réflexes pour ne pas aggraver les choses.',
      source_nom: 'Santé.fr ; Écoute tes oreilles', source_url: 'https://www.sante.fr/node/2055505',
      contenu: `Avec des acouphènes, protéger ses oreilles des sons trop forts est encore plus important.

## Les repères

- À partir de **85 dB** (une rue très passante, une tondeuse), une exposition prolongée abîme l'oreille.
- Un concert atteint souvent **105 dB** : sans protection, l'oreille est en danger en peu de temps.

## Les bons réflexes

- Portez des bouchons en concert, en festival, au bricolage, et gardez-les **tout le temps** : les retirer à mi-parcours annule l'effet.
- Éloignez-vous des enceintes et faites des pauses au calme.
- Écouteurs : volume raisonnable, pas plus d'une heure d'affilée.
- Des bouchons moulés sur mesure (chez un audioprothésiste) sont plus confortables pour un usage régulier.

## Attention au « trop » de protection

Se couper de tous les sons au quotidien peut rendre l'acouphène plus présent. Protégez-vous du bruit fort, pas du silence ordinaire.`,
    },
    {
      id: 'a5', ordre: 50, categorie: 'Au quotidien',
      titre: 'Mieux dormir avec des acouphènes',
      resume: "Le soir, le silence rend le bruit plus présent. Quelques pistes pour s'endormir.",
      source_nom: 'Santé.fr', source_url: 'https://www.sante.fr/node/2055505',
      contenu: `Le soir, quand tout se tait, l'acouphène prend toute la place. Voici des pistes simples.

## Un fond sonore doux

Une musique calme, un bruit de pluie ou un bruit rose à faible volume rendent l'acouphène moins saillant. Réglez le volume **en dessous** de votre acouphène : le but n'est pas de le couvrir, mais d'adoucir le contraste avec le silence. La rubrique **Sons** de l'application propose plusieurs ambiances avec minuterie.

## Une routine apaisante

- Couchez-vous et levez-vous à heures régulières.
- Évitez les écrans et l'actualité dans l'heure qui précède.
- Un exercice de respiration ou de détente (rubrique **Souffler**) aide à faire retomber la tension.

## Si le sommeil reste difficile

Parlez-en à votre médecin : les troubles du sommeil se soignent et font partie de la prise en charge recommandée.`,
    },
    {
      id: 'a6', ordre: 60, categorie: 'Vivre avec',
      titre: 'En parler à son entourage',
      resume: "Expliquer un bruit que personne n'entend : des mots pour se faire comprendre.",
      source_nom: 'Acouphènes Aventure', source_url: '',
      contenu: `Vos proches ne peuvent pas entendre votre acouphène. Ils ne le comprennent pas toujours, et vous non plus n'avez pas forcément les mots.

## Quelques phrases qui aident

- « J'entends un sifflement en permanence. Les jours de fatigue, il prend toute la place. »
- « Les endroits bruyants me coûtent beaucoup d'énergie : si je pars plus tôt, ce n'est pas contre toi. »
- « Je n'ai pas besoin de solution, juste que tu saches. »

## Ce que l'entourage peut faire

- Choisir un endroit calme pour se parler.
- Ne pas minimiser (« tu n'as qu'à ne pas y penser »).
- Proposer une activité dehors : marcher ensemble apaise souvent plus qu'une longue discussion.

## Rejoindre d'autres personnes concernées

Les groupes de parole, les sorties et les séjours de l'association sont faits pour ça. L'espace **Échanges** de l'application aussi.`,
    },
  ],

  sophro: [
    {
      id: 's1', ordre: 10, titre: 'Respiration 4-6', duree_min: 5, rythme: '4-6',
      objectif: "Faire retomber la tension quand l'acouphène devient envahissant.",
      etapes: `Asseyez-vous confortablement, les pieds bien à plat, le dos droit sans être raide.
Posez une main sur le ventre.
Inspirez par le nez pendant 4 secondes en laissant le ventre se gonfler.
Expirez doucement par la bouche pendant 6 secondes, comme pour souffler sur une bougie sans l'éteindre.
Suivez le cercle à l'écran pendant 5 minutes.
Pour finir, reprenez une respiration libre et remarquez ce qui a changé dans votre corps.`,
    },
    {
      id: 's2', ordre: 20, titre: 'Cohérence cardiaque 5-5', duree_min: 5, rythme: '5-5',
      objectif: 'Un rendez-vous régulier pour apaiser le stress, idéalement 3 fois par jour.',
      etapes: `Installez-vous assis·e, les épaules relâchées.
Inspirez pendant 5 secondes en suivant le cercle qui grandit.
Expirez pendant 5 secondes en suivant le cercle qui diminue.
Gardez ce rythme pendant 5 minutes, soit 6 respirations par minute.
Le matin, avant le déjeuner et en fin d'après-midi sont de bons moments.`,
    },
    {
      id: 's3', ordre: 30, titre: 'Ancrage dans les appuis', duree_min: 5, rythme: '',
      objectif: "Ramener l'attention dans le corps, loin du bruit.",
      etapes: `Debout ou assis·e, fermez les yeux si vous le souhaitez.
Sentez vos pieds sur le sol : le talon, la plante, les orteils.
Sentez le poids de votre corps, les points de contact avec la chaise ou le sol.
Inspirez en imaginant que l'air descend jusqu'aux pieds.
À l'expiration, laissez le corps devenir un peu plus lourd, plus stable.
Si l'attention repart vers l'acouphène, ramenez-la doucement vers vos appuis, sans vous juger.
Restez ainsi quelques minutes, puis ouvrez les yeux et reprenez votre activité.`,
    },
    {
      id: 's4', ordre: 40, titre: 'Balayage du corps', duree_min: 8, rythme: '',
      objectif: 'Relâcher les tensions une à une, par exemple avant de dormir.',
      etapes: `Allongez-vous sur le dos, les bras le long du corps.
Portez votre attention sur le front : relâchez-le. Puis les yeux, la mâchoire, la langue.
Descendez vers la nuque et les épaules : laissez-les s'enfoncer dans le support.
Les bras, les mains, jusqu'au bout des doigts.
La poitrine qui se soulève, le ventre qui se détend.
Le dos, le bassin, les cuisses, les genoux, les mollets, les pieds.
Prenez conscience du corps entier, détendu, posé.
Restez ainsi autant que vous le souhaitez.`,
    },
    {
      id: 's5', ordre: 50, titre: "Changer de point d'écoute", duree_min: 5, rythme: '',
      objectif: "Montrer à son attention qu'elle peut se poser ailleurs que sur l'acouphène.",
      etapes: `Asseyez-vous près d'une fenêtre ou dehors.
Repérez un son lointain : une voiture, un oiseau, le vent. Écoutez-le quelques respirations.
Puis un son proche : votre respiration, un tic-tac, un frottement de tissu.
Revenez vers le son lointain, puis de nouveau vers le son proche.
Votre acouphène fait partie du paysage sonore, comme les autres sons. Laissez-le là, sans le chasser.
Terminez par trois respirations lentes.`,
    },
    {
      id: 's6', ordre: 60, titre: 'Lieu ressource', duree_min: 7, rythme: '',
      objectif: "Se construire un refuge intérieur à retrouver quand c'est dur.",
      etapes: `Installez-vous confortablement et fermez les yeux.
Pensez à un lieu où vous vous sentez bien, réel ou imaginaire : une plage, une forêt, un sommet.
Observez les couleurs, la lumière, les formes.
Sentez la température de l'air, le sol sous vos pieds.
Remarquez les odeurs, et les sons de ce lieu, doux et familiers.
Restez-y quelques instants en respirant calmement.
Avant de revenir, dites-vous que ce lieu reste disponible, à tout moment.
Bougez doucement les doigts, étirez-vous, ouvrez les yeux.`,
    },
  ],

  newsletters: [
    {
      id: 'n1', titre: 'La lettre n° 1', date_parution: '2026-10-11',
      resume: 'Les actualités de l\'association, le séjour de répit de novembre et les infos utiles sur les acouphènes.',
      url_pdf: 'https://drive.google.com/file/d/1Co7Z4RBt9otrtKyE9c0F-1rGayBgr1Jm/view',
    },
  ],

  evenements: [
    {
      id: 'e1', titre: 'Séjour de répit au Ranch des Lamberts', type: 'Séjour',
      debut: '2026-11-20T16:00:00+01:00', fin: '2026-11-22T16:00:00+01:00',
      lieu: 'Moulis-en-Médoc (Gironde)', places: 8, prix: 110,
      description: "Trois jours au rythme doux : équithérapie et balade à cheval, ateliers bien-être et gestion du stress, repas partagés, temps de repos et échanges. Hébergement, repas et adhésion compris.",
    },
    {
      id: 'e2', titre: 'Assemblée générale 2027', type: 'AG',
      debut: '2027-01-23T10:00:00+01:00', fin: null,
      lieu: 'Lieu à confirmer', places: null, prix: null,
      description: "Bilan de l'année, comptes, projets 2027 et élection du conseil d'administration. Date proposée, à confirmer.",
    },
  ],

  annuaire: [
    { id: 'd1', ordre: 10, categorie: 'Urgences', nom: 'SAMU', telephone: '15', description: 'Urgence médicale.' },
    { id: 'd2', ordre: 11, categorie: 'Urgences', nom: 'Numéro européen', telephone: '112', description: "Urgence, depuis n'importe quel pays de l'UE." },
    { id: 'd3', ordre: 12, categorie: 'Urgences', nom: 'Personnes sourdes ou malentendantes', telephone: '114', description: 'Urgences par SMS, visio ou tchat.' , site: 'https://www.info.urgence114.fr' },
    { id: 'd4', ordre: 13, categorie: 'Urgences', nom: 'Prévention du suicide', telephone: '3114', description: 'Écoute professionnelle, gratuite, 24 h/24.', site: 'https://3114.fr' },
    { id: 'd5', ordre: 20, categorie: 'Soins', nom: 'Trouver un ORL ou un médecin', description: "Annuaire officiel de l'Assurance maladie.", site: 'https://annuairesante.ameli.fr' },
    { id: 'd6', ordre: 21, categorie: 'Soins', nom: 'Recommandation HAS sur les acouphènes', description: 'Le parcours de soin recommandé (juillet 2026).', site: 'https://www.has-sante.fr/jcms/p_4196187/fr/acouphenes-invalidants-des-cles-pour-ameliorer-le-diagnostic-et-la-prise-en-charge-des-adultes' },
    { id: 'd7', ordre: 30, categorie: 'Associations', nom: 'France Acouphènes', description: 'Association nationale de personnes concernées : écoute, groupes, informations.', site: 'https://www.france-acouphenes.fr' },
    { id: 'd8', ordre: 31, categorie: 'Associations', nom: "Association nationale de l'audition", description: "Organise la Journée nationale de l'audition (mars).", site: 'https://www.association-nationale-audition.org' },
    { id: 'd9', ordre: 40, categorie: "L'association", nom: 'Acouphènes Aventure', telephone: '06 31 30 16 62', description: 'Christophe, président. Écrivez-nous : acouphenes.aventure@gmail.com', site: 'https://acouphenesaventure.fr' },
  ],

  messages: [
    { id: 'm1', auteur: 'Christophe U.', contenu: "Bienvenue dans l'espace d'échange ! Ici on partage ses astuces, ses coups de mou et ses victoires. Bienveillance avant tout, et pas de conseils médicaux : pour ça, on renvoie vers les pros.", parent_id: null, created_at: '2026-10-24T18:00:00+02:00' },
  ],
};
