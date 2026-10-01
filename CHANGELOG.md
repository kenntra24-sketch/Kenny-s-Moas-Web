## v1.5.0-P5b-FIX — 01/10/2026
- **Correctif Google Drive** : l'ID client de `config.local.js` commençait par le mot « client » (erreur 401 invalid_client). Corrigé.
- Ajout de la page `legacy/` (lien « synchronisation avancée » qui donnait une erreur 404 sur GitHub Pages).
- Ajout de `diagnostic.html` (vérifie le format de l'ID/clé et indique l'origine à autoriser dans Google Cloud).
- Guide GITHUB-PAGES.md mis à jour ; cache du service worker passé en v22.

## 1.5.0-p5b — Emploi du temps : plusieurs modèles, horaires, export .ics, rappels, cours du jour
- **Plusieurs emplois du temps** : créer (modèle TA1 ou grille vide), dupliquer, renommer, supprimer, choisir l'actif (liste en haut de l'écran). L'emploi du temps actif reste dans `me:<classe>:timetable` ; les autres sont rangés dans la NOUVELLE clé `me:<classe>:timetables`. Aucun emploi du temps n'est jamais écrasé (créer/changer écrit d'abord la liste rangée, puis l'actif) ; « Annuler » après suppression.
- **Horaires modifiables** (bouton « Horaires ») : heure de début/fin et nom de chaque créneau, ajout d'un créneau ou d'une pause, suppression d'un créneau inutilisé ; validation (début < fin, pas de chevauchement). Les cours déjà placés suivent.
- **Export `.ics`** depuis le nouveau modèle (`lib/timetableIcs.ts`) : un événement hebdomadaire (RRULE) par cours, fuseau Africa/Abidjan avec VTIMEZONE, salle, professeur, rappel optionnel (VALARM), UID stables. L'ancien export du calendrier est inchangé.
- **Rappels avant chaque cours** (notifications locales, seulement app ouverte) : réglage 5/10/15/30 min, clé `me:ttRemind` (préférence, hors sauvegarde de données).
- **Tableau de bord** : les cours du jour (horaire, salle, professeur) et « En cours ».
- Non fait (→ 5c) : semaines A/B, jours supplémentaires (Sam/Dim), copier-coller/glisser, Google Agenda en direct, événements récurrents du calendrier.

## 1.5.0-p2a — Identité : logo, icônes, symbole Drive
- Nouveau logo (`logo.svg`) et régénération de toutes les icônes/splash par `tools/make-icons.mjs` ; favicon SVG ; couleur de thème #24345c.
- Symbole Drive « nuage + flèche » + libellé « Sauvegarde Drive » ; états honnêtes ; heure de la dernière sauvegarde.
- Retiré : texte « Drive synchronisé », indication « Importer depuis Drive » (fonction inexistante), bouton Drive bleu codé en dur.

## 1.5.0-p1 (Pièce 1 : modèle de données) — 29/09/2026

- **Remarques** remplacent « Mes erreurs » (même magasin `errors`, même clé localStorage : l'app d'origine reste compatible). Genres : Erreur · À retenir · Question · Idée. **Toutes les erreurs existantes deviennent des remarques de genre « Erreur »**, boîte Leitner, prochaine révision et liens intacts.
- **Liens entre objets** : nouveau module unique `src/lib/relations.ts` (`linkObjects`, `unlinkObjects`, `getRelated`, `removeAllReferencesTo`, `repointReferences`, `checkIntegrity`). Les anciens champs `fileId`, `linkType`/`linkId`, `homeworkId` restent lus et conservés ; `links: Link[]` est rempli par migration.
- **Catégories de document** : `category` = Cours · Fiche · Exercice · Notes (l'ancien `libraryType` est conservé). Plus de « Fiche de révision / résumé / méthode / Note de classe » dans l'import ; catégorie modifiable depuis « Modifier le fichier ».
- **Remplacer l'ancien** ne supprime plus/recrée plus : le contenu est écrasé **en gardant l'id** (matière, catégorie, favori, étiquettes, associations conservés). Progression de lecture et marque-pages remis à zéro (le contenu a changé).
- **Suppression propre** (fichier, devoir, note, événement, remarque) : la confirmation dit ce qui est lié (« 1 devoir utilise ce fichier »), les références sont nettoyées, « Annuler » remet tout. Contrôle d'intégrité silencieux au démarrage.
- **Migration idempotente** (schéma 2, par classe) exécutée avant le premier rendu ; matières : champ `id` ajouté (`color`/`icon` prévus pour la pièce 2).
- `sw.js` : cache `kennys-moas-react-v14`. Nouveau `tools/verify-sync.mjs`. Bundle racine recompilé avec le build autonome.

## 1.4.1 (Phase « Import intelligent ») — 29/09/2026

- **L'import demande maintenant la nature du fichier** (bouton Ajouter, zone de dépôt, Bibliothèque) : Cours, Fiches (révision, résumé, méthode, explicative), Schéma, Note de classe, Autre support, ou Devoir / Exercice / Autre travail.
- Un fichier « Devoir/Exercice/Autre » crée automatiquement un devoir relié (`fileId`) dans l'onglet Devoirs. Le type apparaît en étiquette dans la Bibliothèque.
- Le champ « fichier associé » (notes, devoirs, événements) importe sans poser la question. Fichiers déjà importés inchangés.
- `sw.js` : cache `kennys-moas-react-v12`. **Non testé en navigateur / non recompilé** : `app.js` et `app.css` à la racine sont ceux de la Phase 5 (voir docs).

## 1.4.1 (Phase 5) — 28/09/2026 — texte sélectionnable dans le lecteur

- **Couche de texte** : le texte des PDF est maintenant sélectionnable et copiable dans le lecteur (souris et tactile), superposé exactement au rendu de la page, à tout niveau de zoom. Base des futurs surlignages/annotations (Phases 6-7).
- Elle est recalculée à chaque page/zoom et abandonnée proprement si tu changes de page ou fermes le lecteur en plein rendu (pas de texte fantôme, 0 erreur console). Si elle ne peut pas être construite, la page reste affichée normalement.
- PDF scannés (images sans texte) : rien à sélectionner — comportement attendu.
- `sw.js` : cache `kennys-moas-react-v11`.

## 1.4.1 (Phase 4) — 28/09/2026 — position de lecture + marque-pages

- **Panneau « Marque-pages »** (bouton avec compteur) : liste triée par page, clic = aller à la page (le panneau se ferme), ✕ = supprimer ; message d'aide quand il est vide. Échap ferme d'abord le panneau/menu, puis le lecteur. Le bouton marque-page de la barre ajoute/retire la page courante.
- **Reprise de lecture** : le fichier s'ouvre directement à la dernière page lue, avec le zoom mémorisé, et un bandeau « Reprise à la page N. [Depuis le début] » (disparaît seul après 8 s ou dès que tu changes de page).
- **Sauvegarde finale à la fermeture** : la page atteinte est enregistrée même si tu fermes en plein rendu (jamais avant le chargement complet du PDF, donc pas d'écrasement par la page 1).
- Fermer le lecteur en plein rendu ne produit plus d'erreur console (« Transport destroyed »).
- `sw.js` : cache `kennys-moas-react-v10`.

## 1.4.1 (Phase 3) — 28/09/2026 — contrôles du lecteur

- **Zoom − / +** avec pourcentage exact (0,5 à 3, pas 0,15 ; 100 % = largeur de la fenêtre de lecture, comme l'app d'origine). Raccourcis : `+`, `-`, `0`.
- **Ajuster largeur / Ajuster page** (boutons à l'état visible) ; ré-appliqué au redimensionnement (anti-rebond 300 ms).
- **Marque-page** (bouton, page courante) : ajout/retrait, enregistré dans `read.bookmarks` (`{p, label}`). Le panneau de liste arrive en Phase 4.
- **Menu « plus »** : Imprimer (ouvre le fichier dans un nouvel onglet) et Télécharger. Échap ferme d'abord le menu, puis le lecteur.
- Rendu net (résolution écran, plafonnée à 2× et à 16 M pixels). Zoom/ajustement mémorisés par fichier dans `read.zoom` / `read.fit` (le champ `mode` n'est pas touché).
- `sw.js` : cache `kennys-moas-react-v9`.

## 1.4.1 (Phase 0 + Phase 2) — 28/09/2026 — lecteur plein écran

- **Lecteur plein écran** : ouvrir un PDF/une image affiche un mode lecture dédié (en-tête « Retour » + nom + matière + pagination + Télécharger). Échap ou « Retour » ferment et rendent le focus ; flèches ←/→ (ou PageUp/PageDown) changent de page. Le reste de l'appli est inerte et ne défile plus pendant la lecture. Utilisable à 390×844.
- **Conflit `files.progress` levé** : `progress` = pourcentage lu (0-100), comme l'app d'origine ; la page de reprise est stockée dans le magasin IndexedDB `read` (`{id, page}`), champs inconnus conservés. Les anciennes valeurs (numéro de page, v1.3.x) ne sont pas migrées : elles sont corrigées à la prochaine ouverture du fichier.
- **Polyfill `Map.getOrInsertComputed` ajouté à `legacy/index.html`** (filet de sécurité), avant le module PDF.js.
- `sw.js` : cache `kennys-moas-react-v8`. `package.json` : `1.4.1-convergence`.

## 1.2.0 — 20/09/2026 — emploi du temps

- **Créneaux enfin supprimables** : avant, seules les heures ajoutées à la main pouvaient être retirées. Toutes les lignes
  (08h→17h compris) ont maintenant une croix au survol ; masquer un créneau est réversible via une puce qui le réaffiche.
- **Semaine raccourcie à Lundi–Vendredi** : chaque colonne de jour a sa propre croix. Masquer Samedi (ou tout autre jour vide)
  ne demande pas de confirmation ; un jour qui contient des cours en demande une, comme pour un créneau.
- **Fini les créneaux « superposés »** : ajouter "8h" en plus de "08h" fusionne désormais avec la ligne existante au lieu de
  créer une ligne en double (les deux notations représentaient la même heure).
- **Couleurs de matières plus distinctes** : nouvelle palette (14 teintes, une seule par famille — plus de vert/violet/orange
  en double), fond des cases plus marqué, et légende des matières sous la grille.

## 1.2.1 — 23/09/2026 — polish UI (parties A–E, complet)

- **Emploi du temps** : la grille se recentre automatiquement sur les heures utilisées (masque les lignes vides en
  début/fin, bouton « + N heures masquées » pour tout réafficher) ; lignes légèrement moins hautes. Données/édition
  inchangées.
- **Notes** : cartes de résumé plus compactes, valeur plus visible ; libellés « Meilleure moyenne » / « Moyenne la
  plus basse » (au lieu de « Meilleure matière » / « À améliorer »). Calculs de moyennes/coefficients inchangés.
- **Mes erreurs** : la fenêtre est un peu plus large sur desktop (nouvelle taille `md`, 600px) ; Matière et Chapitre
  partagent une ligne sur grand écran. Comportement mobile/sauvegarde inchangé.
- **Bibliothèque** : cartes de matière plus compactes (grille resserrée), plus de cartes visibles par ligne.
- **Barre latérale** : largeur réduite (240px→226px en mode normal, idem large/étroit), espacements internes des
  boutons de navigation resserrés ; mode réduit (icônes seules), tooltips et navigation/état actif inchangés.
- `sw.js` : cache `kennys-moas-react-v5` → `v7` (force la mise à jour des utilisateurs existants).

# Changelog

## 1.1.1 — 20/09/2026 — dépôt prêt à publier
- **Le site compilé est à la racine** (`index.html`) : le dépôt fonctionne tel quel (LANCER.bat, double-clic, GitHub Pages). Le code source est rangé dans `source/`.
  Avant, seul le fichier source (page blanche) était présent.
- **Compatible GitHub Pages / sous-dossier** : le service worker (`sw.js`) et son enregistrement utilisent des chemins relatifs (avant : `/sw.js`, `/index.html`… qui
  ne marchent que sur la racine d'un domaine). Cache `kennys-moas-react-v5`.
- `serve.py` sert le dossier où il se trouve. Doublons supprimés (`src/imports`, copies de `docs/legacy` et de `pdf.min.mjs`).
- `.gitattributes` (règles Git LFS de Figma Make) retiré. `.nojekyll` ajouté.

## 1.1.0 — 20/09/2026
- Surface « Verre » (Réglages › Surface) : panneaux en verre dépoli, halos dérivés de l'accent, clair/sombre, replis opaques.
- Synchronisation Google Drive dans l'interface (sauvegarde/restauration dans le dossier privé de l'appli ; scope `drive.appdata`) ; pastille « Drive » reliée à l'état réel.
- Identifiants Google isolés dans `config.local.js` (plus en dur dans le code). `README.md`, `CHANGELOG.md`.
- Corrigé : la refonte UI 02 ne compilait pas (quatre icônes manquantes dans `Icons.tsx`).

## 1.0.0
- Fusion React (design Phase 1) + fonctions de l'application d'origine.

## 1.5.0-p2b (30/09/2026)
- Bundle racine recompilé (icônes de navigation, couleur par section, taille du texte) et vérifié dans Chromium.
- Zones tactiles ≥ 44 px sur écrans tactiles.
- Cache SW v16.

## 1.5.0-p2c (30/09/2026)
- Réglages → Matières : couleur au choix par matière, remise en automatique, boutons Monter/Descendre.
- Cache SW v17.

## 1.5.0-p2b (suite)
- Classes : ajout de Première/Terminale A1 et A2 (la classe par défaut ne change pas ; données rangées par nom de classe, rien de migré). Cache SW v17.

## 1.5.0-p2c (30/09/2026)
- Matières : icône par matière (12 icônes, automatique par défaut), suggestions de matières courantes (Espagnol, AP/Musique, EDHC, Entrepreneuriat…). Cache SW v18.

## 1.5.0-p2c2 (30/09/2026)
- Matières : bouton « Regrouper dans une autre matière » (déplace notes, devoirs, remarques, événements, séances, emploi du temps et fichiers ; annulable). Icône dans Devoirs. Cache SW v19.

## 1.5.0-p5a (30/09/2026)
- Emploi du temps de classe : créneaux réels, blocs fusionnés, pauses, modèle TA1 (3 cases à confirmer), volume horaire, édition, étude. Nouvelle clé `timetable` (ancienne Semaine type intacte). Cache SW v20.
- Coefficients par défaut pour les classes A1/A2.
