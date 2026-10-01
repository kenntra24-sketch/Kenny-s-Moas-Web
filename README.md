# KENNY'S MOAS — Module d'Assistance Scolaire

Application d'organisation scolaire : cours, devoirs, notes, révisions, bibliothèque de fichiers, emploi du temps. Elle tourne **dans le navigateur, hors ligne** :
tes données restent sur ton appareil. Synchronisation Google Drive facultative. Version : `source/package.json` · historique : `CHANGELOG.md`.

## Ce que contient ce dépôt

| Où | Quoi |
|---|---|
| **`index.html`** (racine) | **L'application, déjà compilée.** Une seule page d'entrée. Avec `app.js`, `app.css`, `sw.js`, les icônes, `pdf.*.mjs`, `splash/`, `config.local.js`. |
| `legacy/index.html` | Page de la version d'origine, ouverte depuis Réglages → Google Drive → « synchronisation avancée » (fichiers, historique, Picker). |
| `LANCER.bat` + `serve.py` | Lancement local sous Windows (Python requis). |
| `source/` | Le code source (React + TypeScript) pour **modifier** l'appli. `source/index.html` est le fichier source de développement : ne l'ouvre pas, il s'affiche en blanc. |
| `docs/` | Documentation et notes de l'application d'origine. |

## Utiliser

- **Sur ton PC** : double-clique sur `LANCER.bat` → `http://127.0.0.1:8765` (les données de l'ancienne version, stockées pour cette adresse, sont retrouvées).
- **En ligne (GitHub Pages)** — voir ci-dessous.
- **Secours sans Python** : double-clique sur `index.html` (pas de lecteur PDF ni de mode hors-ligne dans ce mode).

## Mettre en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages → Build and deployment → Source : « Deploy from a branch »**, branche `main`, dossier **`/ (root)`**, puis Save.
2. Après une minute, l'appli est sur `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/`.
3. Pour que la connexion Google Drive marche en ligne, ajoute `https://TON-PSEUDO.github.io` (le domaine seul, sans le chemin) aux **origines JavaScript autorisées** de ton ID client dans Google Cloud Console.
4. Les données restent dans ton navigateur : elles ne sont pas partagées entre l'adresse en ligne et `127.0.0.1:8765` (utilise la sauvegarde/restauration Google Drive pour les transférer).

## Google Drive

Les identifiants (ID client OAuth + clé API) sont dans `config.local.js` (racine) et `source/public/config.local.js`, **inclus volontairement** (choix du propriétaire, usage personnel).
Si le dépôt est public, n'importe qui peut les lire : restreins la clé API dans Google Cloud (référents `http://127.0.0.1:8765/*`, `http://localhost:8765/*` et ton adresse GitHub Pages ; APIs Drive et Picker uniquement),
garde l'écran de consentement en mode Test avec ton compte comme seul utilisateur test, et si besoin supprime-les puis recrée-en. Configuration détaillée : `docs/legacy/SETUP.md`.

## Reconstruire l'application

Deux builds existent. **Celui du dépôt (racine) est le build autonome** (esbuild, sans Vite ni Tailwind) ; le build officiel `pnpm build` (Vite + Tailwind) est celui de la Pièce 0.

```bash
cd source
npm i --no-save esbuild react react-dom          # 1. outils du build autonome (une seule fois)
node tools/build-standalone.mjs                  # 2. compile → source/dist/
cp dist/app.js dist/app.css ../                  # 3. copie le bundle à la racine (index.html est identique, ne pas le toucher sauf changement voulu)
node tools/verify-sync.mjs                       # 4. échoue si un libellé clé manque dans le bundle racine ou si sw.js est incohérent
```

Tests automatisés de la Pièce 1 (liens, migration, remplacement de fichier) : `cd source && npx tsx --test tests/p1.test.ts` (aucun navigateur requis).
Après toute livraison : incrémenter `CACHE` dans `sw.js` **et** `source/public/sw.js` (les deux fichiers doivent rester identiques).

## Publier sur GitHub

```bash
git init                                   # une seule fois, à la racine du projet (le dossier qui contient index.html)
git add -A && git commit -m "P1 : liens, remarques, catégories, remplacement de fichier"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/NOM-DU-DEPOT.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Source : « Deploy from a branch »**, branche `main`, dossier **`/ (root)`** → Save. Adresse finale : `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/` (une minute de délai). Pour les mises à jour suivantes : `git add -A && git commit -m "…" && git push`. Le fichier `.nojekyll` (déjà présent) doit rester à la racine.

## Modifier le code

Dans `source/` : `pnpm install`, puis `pnpm dev` (aperçu) ou `pnpm build` (build officiel Vite + Tailwind).
Le build autonome utilisé pour ce dépôt : `pnpm add -D esbuild` puis `node tools/build-standalone.mjs` → crée `source/dist/`.
**Pour republier** : copier le contenu de `source/dist/` à la racine du dépôt (en écrasant), puis envoyer sur GitHub. Voir `source/RELAIS-FUSION.md` et `source/REFONTE-UI-02.md` pour l'état d'avancement.
