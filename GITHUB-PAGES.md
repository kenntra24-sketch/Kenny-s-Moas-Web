# Mettre KENNY'S MOAS en ligne (GitHub Pages) — pas à pas

Ton site : `https://kenntra24-sketch.github.io/<nom-du-dépôt>/`

## 1. Mettre les fichiers sur GitHub
Dans ton dépôt : supprime l'ancien contenu, puis envoie **tout le contenu de ce zip** (les fichiers à la racine, pas un dossier dedans).
`index.html` doit être directement à la racine du dépôt.

## 2. Activer le site (une seule fois)
Dépôt > **Settings** > **Pages** > Source : **Deploy from a branch** > Branch : **main** / **/(root)** > Save.

## 3. Google Drive — vérifier avec diagnostic.html
Ouvre `https://kenntra24-sketch.github.io/<nom-du-dépôt>/diagnostic.html` : la page te dit si l'ID client et la clé ont le bon format, et quelle adresse autoriser.

Erreurs fréquentes de Google :
- **401 invalid_client / « OAuth client was not found »** : l'ID client est faux (mot « client » ou espace collé devant, ID tronqué, client supprimé, ou ID d'un autre projet).
- **origin_mismatch** : ajoute l'origine ci-dessous.
- **access_blocked** : écran de consentement en mode « Test » → ajoute ton Gmail en utilisateur test.

Dans Google Cloud Console (projet de l'ID client) :
1. **Google Auth Platform > Clients** > ton client « Application Web » > *Origines JavaScript autorisées* :
   `https://kenntra24-sketch.github.io` (sans le nom du dépôt, sans « / » final) + `http://127.0.0.1:8765` pour le PC. Enregistre (peut prendre quelques minutes).
2. **Google Auth Platform > Audience** > *Utilisateurs test* : ajoute ton Gmail si l'appli est en « Test » (la connexion expire alors après 7 jours).
3. **API et services > Bibliothèque** : active **Google Drive API**.
4. **API et services > Identifiants** > ta clé API : restriction « Sites web » = `https://kenntra24-sketch.github.io/*` et `http://127.0.0.1:8765/*`, limitée à l'API Google Drive (ou sans restriction pour tester).

## 4. Installer sur téléphone
Safari (iPhone) ou Chrome (Android) > ouvre l'adresse > Partager > « Sur l'écran d'accueil ».

## 5. Chaque nouvelle version
Remplace les fichiers du dépôt par ceux du nouveau zip > Commit. Au besoin, ferme et rouvre l'appli deux fois (le cache se renouvelle).
