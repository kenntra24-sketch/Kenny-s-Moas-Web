# 🔒 BOÎTE NOIRE — KENNY'S MOAS v2 (GitHub Pages + Google Drive)

**Dernière mise à jour :** 9 septembre 2026
**But de ce document :** tout ce qu'il faut savoir sur ce projet, en un
seul endroit. Si tu reprends seul, avec quelqu'un d'autre, ou avec moi
plus tard — ce document suffit.

---

## 1. LE PROJET, EN UNE PHRASE

**KENNY'S MOAS** est une app de gestion scolaire (devoirs, notes, bibliothèque
de fichiers) qui existe en deux versions : **v1-local** (100% locale,
zéro compte, déjà fonctionnelle) et **v2-github-drive** (identique à v1,
avec en plus une option — jamais obligatoire — de sauvegarde automatique
vers Google Drive).

Ce document couvre **v2-github-drive**.

---

## 2. DÉCISIONS PRISES (dans l'ordre où elles ont été prises)

### 2.1 — Backend nécessaire pour l'OAuth Google ?
**Décision initiale :** un petit backend sur Google Cloud Run (gratuit,
pas de secret côté client).
**Décision finale (révisée) :** **aucun backend du tout**. Google fournit
un système officiel pour les apps 100% navigateur — Google Identity
Services (GIS) — qui donne un token d'accès directement dans le
navigateur, sans jamais exposer de secret. C'est plus simple, plus
robuste, et tout aussi gratuit. Cloud Run a été abandonné.

### 2.2 — Fréquence de l'auto-backup vers Drive
**Décision :** toutes les **30 secondes**, + un sync supplémentaire **à
la fermeture de l'onglet** (détecté via l'événement `visibilitychange`,
plus fiable que `beforeunload` sur mobile).

### 2.3 — Historique des sauvegardes sur Drive
**Décision :** **une seule sauvegarde conservée**. Le fichier
`Mon Drive/KENNY'S MOAS/backup.json` est écrasé à chaque sync — pas de
fichiers numérotés, pas d'accumulation.

### 2.4 — Structure des fichiers (revue après un problème réel)
**Décision initiale :** fichiers séparés `js/auth.js` et `js/drive-sync.js`
dans un dossier `js/`.
**Décision finale (révisée) :** **tout est fusionné dans `index.html`**,
en scripts inline. Raison : lors du premier essai de déploiement sur
GitHub Pages, l'utilisateur a eu des difficultés à créer un dossier `js/`
correctement (upload à la racine au lieu du sous-dossier), ce qui causait
des erreurs 404 et empêchait la connexion Google de fonctionner. Fusionner
tout dans un seul fichier élimine ce point de friction complètement.

---

## 3. ARCHITECTURE FINALE (celle qui est dans le zip)

```
v2-github-drive/
├── index.html              (app complète, y compris l'auth Google et la sync Drive, tout-en-un)
├── sw.js                   (service worker, identique à v1)
├── manifest.webmanifest    (identique à v1)
├── icon-192.png, icon-512.png, icon-192-maskable.png,
│   icon-512-maskable.png, icon.ico, icon.png   (identiques à v1)
└── BOITE-NOIRE.md          (ce document)
```

**Zéro backend. Zéro secret. Zéro dossier séparé. Zéro coût.**

### Comment ça marche techniquement
- **Connexion** : bouton "🔑 Connecter à Google Drive" dans Réglages →
  ouvre une fenêtre Google via GIS → l'utilisateur autorise → un token
  d'accès est stocké dans `localStorage` du navigateur (jamais côté
  serveur, il n'y a pas de serveur)
- **Scope utilisé** : `drive.file` — l'app ne voit QUE les fichiers
  qu'elle a elle-même créés, jamais le reste du Drive de l'utilisateur
- **Sync automatique** : toutes les 30s + à la fermeture, envoie un
  snapshot léger (réglages, devoirs, notes, événements — pas les fichiers
  PDF, trop lourds pour du 30s) vers `backup.json` sur Drive
- **Restauration** : bouton "📥 Restaurer depuis Drive" → retélécharge
  `backup.json` et réimporte les données dans le navigateur
- **Déconnexion** : bouton dédié → révoque le token → l'app redevient
  100% locale, comme v1, sans rien casser

---

## 4. CE QUI RESTE À FAIRE (actions humaines uniquement — rien de technique)

Toutes ces étapes demandent des clics sur des interfaces web (Google
Cloud Console, GitHub) que je ne peux pas faire à la place de
l'utilisateur — pas de connecteur/accès disponible pour ça.

1. **Créer un Client ID Google** (gratuit, ~10 min, une seule fois) :
   - console.cloud.google.com → nouveau projet
   - Activer "Google Drive API"
   - Configurer l'écran de consentement OAuth (type External, ajouter
     son propre email en "Test user")
   - Credentials → Create OAuth client ID → type "Web application" →
     ajouter l'URL GitHub Pages dans "Authorized JavaScript origins"
     (le domaine seul, ex. `https://tonnom.github.io`, SANS le chemin
     du repo après)
   - Copier le Client ID généré (ressemble à
     `123456789-abc...apps.googleusercontent.com`)

2. **Coller le Client ID dans le code** :
   - Ouvrir `index.html`, chercher (Ctrl+F) : `REMPLACE-MOI`
   - Remplacer par le vrai Client ID entre les apostrophes

3. **Déployer sur GitHub Pages** :
   - Créer un repo GitHub (public)
   - Uploader **tous les fichiers directement à la racine** du repo
     (pas de sous-dossier — c'est le piège qui a posé problème la
     dernière fois)
   - Settings → Pages → Source : branche main, dossier `/ (root)`
   - Attendre 1-2 min, récupérer l'URL générée

4. **Tester en vrai** :
   - Ouvrir l'URL, aller dans Réglages
   - Cliquer "Connecter à Google Drive" → autoriser
   - Vérifier que `backup.json` apparaît dans `Mon Drive/KENNY'S MOAS/`
     après ~30s
   - Tester le bouton "Restaurer depuis Drive"

---

## 5. PROBLÈMES DÉJÀ RENCONTRÉS ET LEÇONS (pour éviter de refaire les mêmes erreurs)

| Problème rencontré | Cause | Solution appliquée |
|---|---|---|
| Bouton "Connecter" ne réagissait pas du tout | `auth.js` et `drive-sync.js` étaient à la racine du repo au lieu d'être dans un dossier `js/`, donc 404 en console | Tout fusionné dans `index.html`, plus de dossier séparé |
| Confusion sur quelle URL mettre dans Google Cloud | Confusion entre URL du repo Git (`.git`) et URL GitHub Pages (`.github.io`) | Clarifié : c'est bien l'URL `.github.io`, domaine seul sans le chemin du repo |
| Difficulté à créer un dossier sur GitHub via le gestionnaire de fichiers local | GitHub ne permet pas d'uploader un dossier vide ; il faut soit glisser-déposer un dossier complet, soit taper `dossier/fichier.ext` comme nom lors de la création d'un nouveau fichier | Devenu non-pertinent : plus besoin de dossier du tout |

---

## 6. LIMITES CONNUES DE LA SOLUTION

- Le token Google expire après ~1h ; un renouvellement silencieux est
  tenté automatiquement. S'il échoue (rare), il suffit de recliquer sur
  "Connecter" — aucune donnée n'est jamais perdue.
- La sauvegarde automatique ne contient pas les fichiers PDF de la
  bibliothèque (trop volumineux pour un envoi toutes les 30s). L'export
  manuel complet (bouton déjà existant dans l'app) inclut tout, fichiers
  compris.
- En mode "Test" sur Google Cloud (suffisant pour un usage perso/familial,
  jusqu'à 100 utilisateurs), un écran "Google n'a pas vérifié cette app"
  apparaît à la connexion — c'est normal, il suffit de cliquer
  "Paramètres avancés" → "Accéder à KENNY'S MOAS (dangereux)".

---

## 7. FICHIERS SOURCE — OÙ LES TROUVER

Le zip complet (`kennys-moas-v2-github-drive.zip`) a été partagé dans la
conversation Claude. Il contient tout le code nécessaire, prêt à
déployer après les étapes de la section 4.

Ce document (`BOITE-NOIRE.md`) est inclus dans ce même zip, à la racine.

---

## 8. RÉSUMÉ ULTRA-COURT

Code terminé et vérifié. Zéro backend. Un seul fichier `index.html` à
déployer. Il reste seulement : créer un Client ID Google, le coller
dans le code, uploader sur GitHub Pages, tester. Toutes les instructions
précises sont dans la section 4 ci-dessus.
