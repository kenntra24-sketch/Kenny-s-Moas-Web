# KENNY'S MOAS

Application scolaire tout-en-un (notes, devoirs, emploi du temps,
révisions, bibliothèque de documents) — une seule page web
(`index.html`), utilisable :

- **dans un navigateur** (double-clic sur `index.html`, ou hébergée
  sur un site type GitHub Pages) ;
- **comme application de bureau** sans navigateur visible, via
  `app.py` (voir `GUIDE.md`) ;
- **installée en PWA** sur téléphone/ordinateur (icône, mode
  hors-ligne) grâce à `manifest.webmanifest` + `sw.js`.

Toutes les données (notes, devoirs, réglages, documents importés)
sont stockées **localement** dans le navigateur (`localStorage` +
`IndexedDB`). Rien n'est envoyé sur un serveur, sauf si tu actives
volontairement la synchronisation Google Drive (voir plus bas).

## Lancer l'application

- **Navigateur** : ouvre `index.html`.
- **App de bureau** : voir `GUIDE.md` (`pip install pywebview` puis
  `python app.py`).
- **En ligne (GitHub Pages ou autre hébergeur statique)** : dépose
  tout le dossier tel quel, aucune étape de build n'est nécessaire.

## Fonctionnalités principales

Notes et moyennes pondérées, devoirs avec rappels, emploi du temps,
calendrier (export `.ics`), suivi des erreurs (méthode Leitner),
objectifs, bibliothèque de documents (lecteur PDF/images intégré,
hors-ligne), export/import JSON, sauvegardes automatiques locales,
thème clair/sombre/auto personnalisable.

## Synchronisation Google Drive (nouveau)

Fonctionnalité optionnelle : une fois connecté (Réglages → Google
Drive), l'application peut synchroniser tes données et les documents
de la Bibliothèque avec ton propre Google Drive, pour les retrouver
sur un autre appareil. Voir :

- **`SETUP.md`** — configuration Google obligatoire avant que le
  bouton "Se connecter avec Google" fonctionne (identifiants propres
  à ton propre projet Google Cloud, gratuits).
- **`HANDOFF_TO_NEXT_AI.md`** — détail technique complet de
  l'implémentation (architecture, choix de synchronisation, gestion
  des conflits, limites connues).
- **`TROUBLESHOOTING.md`** — problèmes courants liés à Google Drive.

Tant que cette configuration n'est pas faite, l'application fonctionne
exactement comme avant, entièrement en local.

## Structure du projet

Voir `PROJECT_INVENTORY.md` pour le détail fichier par fichier.

## Historique

Voir `CHANGELOG.md`. Les documents `RAPPORT-ANALYSE.md`, `HANDOFF.md`
et `RELAIS-iOS-DESIGN.md` sont conservés à titre d'archive des sessions
de travail précédentes.
