# Changelog

## Session — Synchronisation Google Drive (cette session)

### Ajouté
- Connexion Google réelle (Google Identity Services, flux "token
  client" côté navigateur, sans backend) — Réglages → Google Drive.
- Intégration Google Drive : création/retrouvaille automatique d'un
  dossier applicatif `KENNY'S MOAS` (+ sous-dossier `Bibliothèque`)
  dans le Drive de l'utilisateur, sans doublon d'un lancement à
  l'autre.
- Synchronisation bidirectionnelle des données (notes, devoirs,
  matières, réglages…) via un fichier `kennys-moas-data.json` sur
  Drive, avec détection de conflit (timestamp + hash local) et
  résolution par choix explicite de l'utilisateur (aucune perte
  silencieuse — sauvegarde automatique prise avant toute résolution).
- Synchronisation incrémentale des fichiers de la Bibliothèque (un
  fichier Drive par document, envoyé une seule fois, jamais
  retéléchargé si déjà présent).
- Synchronisation au démarrage (silencieuse, ne bloque jamais
  l'affichage de l'app), synchronisation automatique configurable
  (désactivée / 10 / 30 / 60 min, défaut 30), et bouton
  "Synchroniser maintenant" (protégé contre les exécutions
  concurrentes).
- Import multiple depuis Google Drive via le sélecteur natif Google
  (Picker) : sélection de plusieurs fichiers en une opération,
  intégration dans la Bibliothèque existante (même logique que
  l'import local), avec détection des doublons déjà importés.
- Gestion d'erreurs dédiée : session expirée, refus d'autorisation,
  absence d'Internet, quota Drive dépassé, fichier introuvable/
  invalide — chaque cas affiche un message clair sans jamais faire
  planter le reste de l'application.
- Indicateurs d'état dans Réglages → Google Drive : connecté / non
  connecté, en cours de synchronisation, dernière synchronisation,
  hors-ligne, conflit, erreur.
- `.gitignore` ajouté (hygiène de dépôt / préparation GitHub Pages).
- `app.py` : port local fixe (8765, avec repli automatique si occupé)
  nécessaire pour déclarer une origine OAuth stable auprès de Google.
- `sw.js` : nom de cache incrémenté (`r13`) pour que les utilisateurs
  ayant déjà installé l'app en PWA reçoivent bien cette mise à jour.
- Documentation : `SETUP.md`, `HANDOFF_TO_NEXT_AI.md`,
  `TROUBLESHOOTING.md`, `PROJECT_INVENTORY.md`, `MANIFEST.json`,
  `FINAL_VERIFICATION.md`, et ce `CHANGELOG.md`.

### Inchangé
- Aucune fonctionnalité existante (navigation, notes, devoirs, emploi
  du temps, bibliothèque, export/import JSON, sauvegarde automatique
  locale, thèmes, etc.) n'a été modifiée ou retirée. Tout continue de
  fonctionner sans connexion Google.

### Non fait / documenté comme limite
- Voir `HANDOFF_TO_NEXT_AI.md` (section Limitations) et
  `TROUBLESHOOTING.md`.

---

## Sessions précédentes

Voir `RAPPORT-ANALYSE.md` et `HANDOFF.md` pour l'historique détaillé
des sessions antérieures (correctif d'édition des notes, lecteur PDF
hors-ligne, refonte cosmétique, fusion de fonctionnalités, etc.).
