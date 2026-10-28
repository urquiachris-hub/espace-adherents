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
      id: 's1', type: 'Sophrologie', ordre: 10, titre: 'Respiration 4-6', duree_min: 5, rythme: '4-6',
      objectif: "Faire retomber la tension quand l'acouphène devient envahissant.",
      etapes: `Asseyez-vous confortablement, les pieds bien à plat, le dos droit sans être raide.
Posez une main sur le ventre.
Inspirez par le nez pendant 4 secondes en laissant le ventre se gonfler.
Expirez doucement par la bouche pendant 6 secondes, comme pour souffler sur une bougie sans l'éteindre.
Suivez le cercle à l'écran pendant 5 minutes.
Pour finir, reprenez une respiration libre et remarquez ce qui a changé dans votre corps.`,
    },
    {
      id: 's2', type: 'Sophrologie', ordre: 20, titre: 'Cohérence cardiaque 5-5', duree_min: 5, rythme: '5-5',
      objectif: 'Un rendez-vous régulier pour apaiser le stress, idéalement 3 fois par jour.',
      etapes: `Installez-vous assis·e, les épaules relâchées.
Inspirez pendant 5 secondes en suivant le cercle qui grandit.
Expirez pendant 5 secondes en suivant le cercle qui diminue.
Gardez ce rythme pendant 5 minutes, soit 6 respirations par minute.
Le matin, avant le déjeuner et en fin d'après-midi sont de bons moments.`,
    },
    {
      id: 's3', type: 'Sophrologie', ordre: 30, titre: 'Ancrage dans les appuis', duree_min: 5, rythme: '',
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
      id: 's4', type: 'Sophrologie', ordre: 40, titre: 'Balayage du corps', duree_min: 8, rythme: '',
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
      id: 's5', type: 'Sophrologie', ordre: 50, titre: "Changer de point d'écoute", duree_min: 5, rythme: '',
      objectif: "Montrer à son attention qu'elle peut se poser ailleurs que sur l'acouphène.",
      etapes: `Asseyez-vous près d'une fenêtre ou dehors.
Repérez un son lointain : une voiture, un oiseau, le vent. Écoutez-le quelques respirations.
Puis un son proche : votre respiration, un tic-tac, un frottement de tissu.
Revenez vers le son lointain, puis de nouveau vers le son proche.
Votre acouphène fait partie du paysage sonore, comme les autres sons. Laissez-le là, sans le chasser.
Terminez par trois respirations lentes.`,
    },
    {
      id: 's6', type: 'Sophrologie', ordre: 60, titre: 'Lieu ressource', duree_min: 7, rythme: '',
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
    {
      id: 's7', ordre: 70, type: 'Sophrologie', titre: 'Respiration carrée', duree_min: 3, rythme: '4-4-4-4',
      objectif: 'Se poser en quelques minutes, au calme ou avant un moment stressant.',
      etapes: `Installez-vous assis·e, le dos droit, les épaules relâchées. [5]
Inspirez par le nez en comptant jusqu'à 4. [5]
Gardez l'air en comptant jusqu'à 4, sans forcer. [5]
Expirez doucement en comptant jusqu'à 4. [5]
Restez poumons vides en comptant jusqu'à 4, puis recommencez. [5]
Suivez le carré à l'écran pendant 3 minutes. Si retenir l'air vous gêne, raccourcissez les pauses. [10]`,
    },
    {
      id: 's8', ordre: 80, type: 'Sophrologie', titre: 'Relâcher les muscles un à un', duree_min: 10, rythme: '',
      objectif: "Faire baisser la tension physique, idéal avant de dormir.",
      etapes: `Allongez-vous ou asseyez-vous confortablement. Fermez les yeux si vous le souhaitez. [8]
Serrez fort les poings pendant 5 secondes. [6]
Relâchez d'un coup. Sentez la différence entre la tension et la détente. [12]
Remontez les épaules vers les oreilles, tenez 5 secondes. [6]
Relâchez. Laissez les épaules descendre. [12]
Serrez la mâchoire et plissez le visage, 5 secondes. [6]
Relâchez la mâchoire, le front, les yeux. [12]
Contractez le ventre, 5 secondes. [6]
Relâchez et respirez dans le ventre. [12]
Serrez les cuisses et les fessiers, 5 secondes. [6]
Relâchez. [12]
Pointez les pieds vers vous, contractez les mollets, 5 secondes. [6]
Relâchez. Sentez tout le corps lourd et détendu. [20]
Restez dans cette détente aussi longtemps que vous le souhaitez. [15]`,
    },
    {
      id: 's9', ordre: 90, type: 'Sophrologie', titre: 'Évacuer les tensions de la journée', duree_min: 6, rythme: '',
      objectif: 'Une sophrologie en mouvement pour se débarrasser du stress accumulé.',
      etapes: `Debout, pieds écartés de la largeur du bassin, bras le long du corps. [6]
Inspirez par le nez et retenez l'air. [4]
Pendant que vous retenez l'air, haussez plusieurs fois les épaules vers les oreilles. [6]
Expirez par la bouche en relâchant d'un coup les épaules, comme si vous laissiez tomber un sac trop lourd. [8]
Accueillez les sensations dans les épaules et la nuque. [10]
Recommencez deux fois. [25]
Maintenant, tournez doucement la tête de droite à gauche, sans forcer, sur une respiration calme. [20]
Revenez au centre. Respirez librement. [10]
Remarquez ce qui a changé dans votre corps, sans juger. [12]`,
    },
    {
      id: 's10', ordre: 100, type: 'Sophrologie', titre: 'Le son devient paysage', duree_min: 7, rythme: '',
      objectif: "Changer de regard sur l'acouphène en l'intégrant à une scène apaisante.",
      etapes: `Installez-vous confortablement, fermez les yeux. Prenez trois respirations lentes. [15]
Écoutez votre acouphène quelques instants, sans chercher à le chasser. Remarquez simplement sa hauteur et son rythme. [12]
Imaginez maintenant un lieu calme qui pourrait produire ce son : le vent dans les pins, une rivière, des cigales en été, la mer au loin. [15]
Placez-vous dans ce paysage. Voyez les couleurs, la lumière, le ciel. [15]
Sentez l'air sur votre peau, le sol sous vos pieds. [15]
Laissez le son faire partie du décor, comme un élément parmi d'autres. [15]
Respirez tranquillement dans ce paysage. Vous n'avez rien à faire. [25]
Avant de revenir, dites-vous que ce paysage reste à votre disposition. [8]
Bougez les doigts, étirez-vous, ouvrez les yeux. [6]`,
    },
    {
      id: 's11', ordre: 110, type: 'Sophrologie', titre: 'Se projeter dans un bon moment', duree_min: 6, rythme: '',
      objectif: "Nourrir la confiance en se projetant dans un moment agréable à venir.",
      etapes: `Installez-vous et fermez les yeux. Respirez calmement. [12]
Pensez à un moment agréable qui vous attend : une sortie, un repas avec des proches, un séjour. [10]
Imaginez-vous la veille de ce moment. Sentez l'envie, la curiosité. [12]
Imaginez maintenant le moment lui-même. Où êtes-vous ? Avec qui ? Que voyez-vous ? [15]
Remarquez que vous vous sentez bien, capable, à votre place. [12]
Gardez une image ou un mot qui résume ce moment. [10]
Respirez profondément en accueillant cette image. [10]
Revenez doucement ici, en gardant ce sentiment avec vous. [8]`,
    },
    {
      id: 's12', ordre: 15, type: 'Sophrologie', titre: 'Pause SOS de 3 minutes', duree_min: 3, rythme: '',
      objectif: "Quand le bruit prend toute la place : un exercice court pour reprendre pied.",
      etapes: `Arrêtez ce que vous faites. Posez les deux pieds au sol. [5]
Nommez trois choses que vous voyez autour de vous. [10]
Sentez le contact de vos pieds sur le sol, de votre dos sur le siège. [8]
Inspirez lentement par le nez, en comptant jusqu'à 4. [5]
Expirez encore plus lentement par la bouche, en comptant jusqu'à 6. [7]
Encore une fois. Inspirez sur 4. [5]
Expirez sur 6. [7]
Une dernière fois. [12]
Si vous le pouvez, lancez un son doux dans la rubrique Sons, à faible volume. [5]
Dites-vous : c'est un moment difficile, et il va passer. [8]`,
    },
    {
      id: 't1', ordre: 210, type: 'TCC', titre: 'Comprendre le cercle vicieux', duree_min: 5, rythme: '',
      objectif: "Comprendre pourquoi la gêne augmente quand on s'inquiète, pour mieux casser le cercle.",
      etapes: `Le cerveau trie en permanence les sons : il met de côté ceux qui ne sont pas importants. [6]
Quand un acouphène est vécu comme une menace, le cerveau le classe comme important et le surveille. [6]
Plus on le surveille, plus on l'entend. Plus on l'entend, plus on s'inquiète. Et plus on s'inquiète, plus il paraît fort. [8]
La fatigue et le stress renforcent encore ce cercle. [5]
La bonne nouvelle : on peut agir sur chaque étape. Sur l'inquiétude, avec le carnet des pensées. Sur l'attention, avec l'entraînement de l'attention. Sur le stress, avec la respiration et la relaxation. [8]
Le but n'est pas de faire disparaître le son, mais qu'il redevienne un bruit de fond, comme le ronronnement d'un frigo. [8]
Prenez un moment pour repérer votre propre cercle : qu'est-ce qui augmente votre gêne, et qu'est-ce qui l'apaise ? Notez-le dans votre journal. [15]`,
    },
    {
      id: 't2', ordre: 220, type: 'TCC', titre: 'Le carnet des pensées', duree_min: 10, rythme: '',
      objectif: "Repérer les pensées qui augmentent la détresse et trouver des pensées plus justes.",
      etapes: `Pensez à un moment récent où l'acouphène vous a pesé. [10]
Décrivez la situation en une phrase : où étiez-vous, que faisiez-vous ? [12]
Quelle pensée vous a traversé l'esprit ? Par exemple : ça ne s'arrêtera jamais, je vais devenir fou, je ne vais pas dormir. [12]
Quelle émotion avez-vous ressentie, et à quelle intensité, sur 10 ? [10]
Maintenant, interrogez cette pensée. Est-elle tout à fait vraie ? Avez-vous déjà vécu des moments où c'était moins fort ? [15]
Que diriez-vous à un ami qui aurait cette pensée ? [12]
Formulez une pensée plus juste. Par exemple : c'est difficile ce soir, mais j'ai déjà réussi à m'endormir malgré le bruit. [15]
Notez l'émotion à nouveau, sur 10. Même un petit changement compte. [8]
Vous pouvez remplir ce carnet dans la rubrique Journal, partie Carnet des pensées. [5]`,
    },
    {
      id: 't3', ordre: 230, type: 'TCC', titre: 'Prendre de la distance avec ses pensées', duree_min: 5, rythme: '',
      objectif: "Ne plus se laisser emporter par les pensées négatives liées au bruit.",
      etapes: `Choisissez une pensée qui revient souvent, par exemple : je n'en peux plus de ce bruit. [8]
Répétez-la intérieurement quelques secondes. Remarquez l'effet qu'elle a sur vous. [10]
Maintenant, ajoutez devant : j'ai la pensée que… je n'en peux plus de ce bruit. [8]
Puis : je remarque que j'ai la pensée que… je n'en peux plus de ce bruit. [8]
Sentez la petite distance qui s'installe. La pensée est là, mais vous n'êtes pas la pensée. [12]
Imaginez cette pensée écrite sur une feuille qui flotte sur une rivière, et laissez-la passer. [15]
Revenez à votre respiration, et à ce qui compte pour vous aujourd'hui. [10]`,
    },
    {
      id: 't4', ordre: 240, type: 'TCC', titre: "Entraîner son attention", duree_min: 8, rythme: '',
      objectif: "Apprendre à déplacer son attention volontairement, pour que l'acouphène ne la capte plus en permanence.",
      etapes: `Asseyez-vous dans un endroit où l'on entend plusieurs sons : une fenêtre ouverte, une pièce avec un bruit de fond. [8]
Repérez trois sons différents en plus de l'acouphène, par exemple une voiture, un oiseau, le frigo. [12]
Concentrez-vous sur le premier son, uniquement sur lui, pendant 10 secondes. [10]
Passez au deuxième son, 10 secondes. [10]
Puis au troisième, 10 secondes. [10]
Maintenant, changez de son plus vite : 5 secondes chacun. Premier son. [5]
Deuxième. [5]
Troisième. [5]
Enfin, essayez d'écouter tous les sons en même temps, comme un paysage sonore. [20]
Si l'acouphène revient au premier plan, c'est normal : ramenez simplement votre attention vers les autres sons. [8]
Pratiqué chaque jour, cet exercice rend l'attention plus souple. [5]`,
    },
    {
      id: 't5', ordre: 250, type: 'TCC', titre: 'Retrouver les activités qui font du bien', duree_min: 10, rythme: '',
      objectif: "Ne plus laisser l'acouphène réduire votre vie : réintroduire pas à pas ce qui vous fait du bien.",
      etapes: `Pensez aux activités que vous aimiez et que vous faites moins depuis vos acouphènes : marcher, voir des amis, bricoler, lire, faire du sport. [12]
Choisissez-en une seule, simple et réaliste cette semaine. [10]
Décidez quand : quel jour, à quelle heure, combien de temps. [10]
Prévoyez ce qui pourrait vous aider : un fond sonore, des bouchons si c'est bruyant, quelqu'un pour vous accompagner. [10]
Après l'activité, notez dans votre journal le plaisir ressenti sur 10, et la gêne de l'acouphène sur 10. [8]
Souvent, on remarque que la gêne est plus faible quand on est occupé par quelque chose d'agréable. [6]
La semaine suivante, ajoutez une activité. Avancez à petits pas. [6]`,
    },
    {
      id: 't6', ordre: 260, type: 'TCC', titre: 'Sortir du silence total', duree_min: 5, rythme: '',
      objectif: "Le silence complet rend l'acouphène plus présent : retrouver un environnement sonore doux.",
      etapes: `Dans le silence, le cerveau tend l'oreille, et l'acouphène ressort davantage. [6]
À l'inverse, couvrir totalement l'acouphène empêche le cerveau de s'y habituer. [6]
Le juste milieu : un fond sonore doux, réglé un peu en dessous de votre acouphène. [6]
Repérez les moments de silence de votre journée : le soir, la nuit, le bureau calme. [10]
Pour chacun, choisissez un fond sonore : radio douce, fenêtre entrouverte, ou un son de la rubrique Sons. [10]
Essayez pendant une semaine, puis notez dans votre journal si la gêne a évolué. [6]
Gardez les protections auditives pour les bruits forts seulement, pas pour le quotidien. [6]`,
    },
    {
      id: 't7', ordre: 270, type: 'TCC', titre: 'Mieux dormir', duree_min: 5, rythme: '',
      objectif: "Des habitudes simples qui aident à retrouver un meilleur sommeil malgré l'acouphène.",
      etapes: `Gardez des heures de coucher et de lever régulières, même le week-end. [6]
Réservez le lit au sommeil : évitez d'y regarder les écrans ou d'y ruminer. [6]
Une heure avant de dormir, baissez la lumière et choisissez une activité calme. [6]
Lancez un fond sonore doux pour la nuit, avec l'arrêt automatique. [6]
Si vous ne dormez pas au bout d'une vingtaine de minutes, levez-vous. Faites quelque chose de calme dans une autre pièce, et revenez quand le sommeil arrive. [8]
Évitez le café après midi, l'alcool le soir, et les siestes de plus de 20 minutes. [6]
Si les difficultés de sommeil durent, parlez-en à votre médecin : elles se soignent. [6]`,
    },
    {
      id: 't8', ordre: 280, type: 'TCC', titre: 'Mon plan de crise', duree_min: 10, rythme: '',
      objectif: "Préparer à l'avance ce que vous ferez quand l'acouphène devient insupportable.",
      etapes: `Prenez un moment calme pour préparer votre plan. Il servira les jours difficiles. [8]
Repérez vos signaux d'alerte : fatigue, irritabilité, isolement, pensées noires. [12]
Listez trois choses qui vous apaisent rapidement : un exercice de respiration, un son doux, une marche, une douche chaude. [15]
Listez deux personnes que vous pouvez appeler ou à qui écrire. [12]
Notez le contact de votre médecin ou de votre ORL. [8]
Si un jour vous avez des idées suicidaires, appelez le 3114, gratuit, 24 heures sur 24. En cas d'urgence, le 15 ou le 112. [8]
Vous pouvez enregistrer votre plan dans la rubrique Journal, partie Mon plan de crise, pour l'avoir toujours sous la main. [6]`,
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
