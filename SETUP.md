# SETUP — Configuration Google Drive

La connexion Google et la synchronisation Google Drive sont **déjà
codées et prêtes** dans `index.html`, mais elles ont besoin de deux
identifiants propres à **ton propre projet Google Cloud**, gratuits,
que Anthropic/Claude ne peut pas créer à ta place (ça nécessite un
compte Google et une action manuelle dans la console Google).

Sans cette étape, l'app affiche simplement "pas encore configurée"
dans Réglages → Google Drive et continue de fonctionner normalement
en local (aucune fonctionnalité existante n'est affectée).

## 1. Créer un projet Google Cloud (5 minutes)

1. Va sur <https://console.cloud.google.com/>.
2. Crée un nouveau projet (ex. "Kennys Moas").
3. Dans **API et services → Bibliothèque**, active :
   - **Google Drive API**
   - **Google Picker API**

## 2. Configurer l'écran de consentement OAuth

1. **API et services → Écran de consentement OAuth**.
2. Type d'utilisateur : **Externe** (suffisant pour un usage
   personnel/petit groupe).
3. Renseigne un nom d'appli ("KENNY'S MOAS"), un e-mail de support et
   un e-mail de contact développeur.
4. Scopes à ajouter : `.../auth/drive.file`, `openid`, `.../auth/userinfo.email`,
   `.../auth/userinfo.profile`.
5. Dans **Utilisateurs test**, ajoute ton propre compte Google (et
   ceux de toute personne qui doit pouvoir se connecter).

   ⚠️ **Important** : tant que l'appli reste en statut **"Test"** (ce
   qui est le cas par défaut et suffit largement ici), seuls les
   comptes ajoutés en "utilisateurs test" peuvent se connecter, et
   Google limite la durée de session pour les scopes sensibles comme
   `drive.file` (reconnexion à refaire de temps en temps — normal,
   pas un bug de l'application). Passer l'appli en statut "Production"
   lèverait cette limite mais demande une validation Google (pas
   nécessaire pour un usage personnel).

## 3. Créer les identifiants

### Client ID OAuth (obligatoire — connexion Google + Drive)

1. **API et services → Identifiants → Créer des identifiants → ID
   client OAuth**.
2. Type d'application : **Application Web**.
3. **Origines JavaScript autorisées** — ajoute-les **toutes** si tu
   comptes utiliser plusieurs modes de lancement :
   - `http://127.0.0.1:8765` (app de bureau via `app.py` — port fixe,
     voir ci-dessous)
   - `https://TON-PSEUDO.github.io` (si déployé sur GitHub Pages —
     remplace par ton vrai nom d'utilisateur/organisation)
   - `http://localhost:PORT` (si tu testes dans un simple navigateur
     via un serveur local type `python -m http.server`)
4. Pas d'"URI de redirection" à renseigner (l'app utilise le flux
   "token client" de Google Identity Services, sans redirection).
5. Clique sur **Créer** puis copie le **Client ID** généré (se
   termine par `.apps.googleusercontent.com`).

### Clé API (obligatoire — sélecteur de fichiers "Importer depuis
Google Drive")

1. **API et services → Identifiants → Créer des identifiants → Clé
   API**.
2. Restreins-la (recommandé) aux mêmes origines que ci-dessus et à
   l'API "Google Picker API".
3. Copie la clé générée.

## 4. Coller les identifiants dans l'application

Ouvre `index.html`, cherche (Ctrl+F) le bloc
`SYNCHRONISATION GOOGLE DRIVE` (juste avant la section
`EXPORT CALENDRIER NATIF`), et remplace :

```js
const GD_CLIENT_ID = 'REMPLACE_PAR_TON_CLIENT_ID.apps.googleusercontent.com';
const GD_API_KEY    = 'REMPLACE_PAR_TA_CLE_API';
```

par tes vraies valeurs. Enregistre le fichier. C'est tout — aucune
autre étape, aucune dépendance à installer, aucun serveur à héberger.

Ces deux valeurs ne sont **pas des secrets** : elles sont conçues pour
être visibles côté navigateur et sont protégées par la liste
d'origines autorisées côté Google, pas par le fait d'être cachées.
Elles peuvent donc rester en clair dans `index.html`, y compris si le
projet est publié publiquement sur GitHub.

## 5. Port fixe de l'app de bureau

`app.py` essaie désormais d'utiliser le port fixe **8765** en priorité
(nécessaire pour que l'origine `http://127.0.0.1:8765` déclarée à
l'étape 3 corresponde réellement à l'app lancée). Si ce port est déjà
occupé par un autre programme sur ta machine, l'app retombe
automatiquement sur un port libre quelconque — l'application continue
de fonctionner, mais la connexion Google échouera tant que ce port
est occupé (message d'erreur clair affiché, pas de plantage). Ferme le
programme qui occupe le port 8765, ou modifie `FIXED_PORT` dans
`app.py` **et** l'origine correspondante dans Google Cloud Console.

## 6. Déploiement GitHub Pages

Aucune étape de build. Dépose le contenu du dossier tel quel dans un
dépôt (branche `main` ou `gh-pages`), active GitHub Pages dans les
paramètres du dépôt sur ce dossier, et ajoute l'URL GitHub Pages
obtenue (`https://TON-PSEUDO.github.io` ou
`https://TON-PSEUDO.github.io/nom-du-repo`, selon la configuration)
dans la liste des origines JavaScript autorisées (étape 3). Le
service worker (`sw.js`) et le manifeste utilisent déjà des chemins
relatifs (`./`), donc un déploiement dans un sous-dossier fonctionne
sans modification.

## Sécurité — ce qui n'est jamais présent dans ce projet

- Aucun mot de passe, aucune clé privée, aucun "client secret" OAuth
  (le flux utilisé n'en nécessite pas).
- Le Client ID et la clé API sont publics par conception (voir
  ci-dessus) — rien d'autre n'est stocké en clair.
- Les identifiants **tokens d'accès Google** obtenus après connexion
  restent uniquement en mémoire JavaScript (jamais écrits sur disque,
  jamais dans `localStorage`) ; seul le profil (nom/e-mail/photo) et
  des identifiants de dossiers Drive publics sont mémorisés
  localement pour éviter de redemander la connexion à chaque
  ouverture.
