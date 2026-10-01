# Mettre KENNY'S MOAS en ligne (GitHub Pages) — pas à pas

## 1. Activer le site (une seule fois)
Dépôt GitHub > **Settings** > **Pages** > Source : **Deploy from a branch** > Branch : **main** / dossier **/(root)** > Save.
Après 1 à 2 minutes, l'adresse est : `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`

## 2. Google Drive (indispensable pour la synchro en ligne)
Google Cloud Console > APIs et services > Identifiants > ton ID client OAuth > **Origines JavaScript autorisées** > ajoute :
`https://TON-PSEUDO.github.io`   (sans le nom du dépôt, sans « / » à la fin)
Garde aussi `http://127.0.0.1:8765` pour l'usage sur ton PC.
Clé API : restriction « Référents HTTP » = `https://TON-PSEUDO.github.io/*` et `http://127.0.0.1:8765/*`, limitée à l'API Google Drive.
Si l'écran de consentement est en mode « Test » : ajoute ton adresse Gmail dans « Utilisateurs test » (la connexion expire alors après 7 jours).

## 3. Installer sur téléphone
Ouvre l'adresse dans Safari (iPhone) ou Chrome (Android) > Partager > « Sur l'écran d'accueil ».

## 4. Chaque nouvelle version
Remplace les fichiers du dossier du dépôt par ceux du nouveau zip > GitHub Desktop > Commit > Push. Le site se met à jour tout seul. Au besoin, ferme et rouvre l'appli deux fois (le cache se renouvelle).
