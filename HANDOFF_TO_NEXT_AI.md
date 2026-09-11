# HANDOFF_TO_NEXT_AI

Document de relais destiné à une autre IA (ou à toi-même dans une
future session) qui reprendrait ce projet. Lis ce document en entier
avant de modifier quoi que ce soit — il t'évite de deviner ce qui a
été fait.

## 1. Résumé du projet

KENNY'S MOAS est une application scolaire (notes, devoirs, emploi du
temps, révisions, bibliothèque de documents) sous forme d'**une seule
page HTML autonome** (`index.html`, ~2900 lignes de JS/CSS/HTML),
utilisable en navigateur, en PWA installée, ou en app de bureau via
`app.py` (pywebview). Toutes les données vivent en local
(`localStorage` pour les données structurées, `IndexedDB` pour les
fichiers binaires de la Bibliothèque et les sauvegardes automatiques).

## 2. État initial (avant cette session)

Application déjà mature (11 "rondes" de correctifs antérieures selon
les commentaires du code et `RAPPORT-ANALYSE.md`) : aucune
fonctionnalité Google, aucune synchronisation distante, export/import
JSON manuel uniquement. Un correctif (édition d'une note existante)
avait été appliqué juste avant cette session — voir
`RAPPORT-ANALYSE.md` pour le détail.

## 3. Travail effectué cette session

Implémentation complète de la connexion Google et de la
synchronisation Google Drive (authentification, dossier applicatif,
synchronisation bidirectionnelle des données et des fichiers,
synchronisation au démarrage/automatique/manuelle, mode hors-ligne,
gestion des conflits, gestion des erreurs, import multiple depuis
Drive), packagée avec sa documentation et livrée en ZIP. Détail
complet ci-dessous.

## 4. Architecture ajoutée

### 4.1 Emplacement du code

Tout le nouveau code JS est dans **un seul bloc autonome** de
`index.html`, repérable par le commentaire
`SYNCHRONISATION GOOGLE DRIVE`, juste avant le module
`EXPORT CALENDRIER NATIF (.ICS)` préexistant. C'est une IIFE
(`(function(){...})();`) qui s'appuie sur les fonctions/variables déjà
globales de l'app (`$`, `$$`, `esc`, `uid`, `toast`, `confirmDlg`,
`askText`, `dlg`, `trapTab`, `LS`, `collectLS`, `dbGet/dbPut/dbAll/
dbDel`, `importFiles`, `chooseImportType`, `LIB_IMPORT_TYPES`,
`renderLib`, `renderAll`, `applyTheme`, `cls`, `customClasses`, `SET`)
sans les redéfinir.

### 4.2 Authentification Google

- Bibliothèque officielle **Google Identity Services** (GIS), chargée
  **dynamiquement** (`<script src="https://accounts.google.com/gsi/client">`
  injecté en JS) uniquement au moment où l'utilisateur clique sur
  "Se connecter avec Google" ou "Importer depuis Google Drive" — donc
  **aucune requête réseau Google n'a lieu tant que l'utilisateur n'a
  rien demandé**, pour préserver l'usage 100% hors-ligne existant.
- Flux utilisé : `google.accounts.oauth2.initTokenClient` (flux
  "implicite" côté navigateur, pas de "client secret", pas de
  backend). Le token d'accès obtenu vit **uniquement en mémoire JS**
  (jamais persisté sur disque).
- Scope : `drive.file` (accès limité aux fichiers créés par l'app ou
  explicitement choisis via le sélecteur Google) + `openid email
  profile` pour afficher qui est connecté (`/oauth2/v3/userinfo`).
- Reconnexion silencieuse tentée au démarrage si l'utilisateur était
  déjà connecté lors d'une session précédente (`prompt:''`) ; en cas
  d'échec (session Google expirée), aucune fenêtre intempestive n'est
  affichée — l'interface retombe simplement sur "Se connecter avec
  Google" au prochain besoin.

### 4.3 Dossier Google Drive de l'application

- Recherche (`files.list` avec requête sur le nom + type dossier)
  d'un dossier `KENNY'S MOAS` à la racine du Drive de l'utilisateur ;
  créé s'il n'existe pas. Son identifiant est mémorisé
  (`localStorage` clé `me:sync:folderId`) pour éviter de le
  rechercher/recréer à chaque lancement, **avec vérification qu'il
  existe encore** (sinon nouvelle recherche/création — évite les
  dossiers fantômes après suppression manuelle par l'utilisateur).
- Un sous-dossier `Bibliothèque` y est créé de la même façon pour les
  fichiers de la Bibliothèque.
- Aucun risque de doublon de dossier d'un lancement à l'autre (l'ID
  mémorisé est toujours revérifié avant réutilisation).

### 4.4 Synchronisation des données (localStorage)

- Un seul fichier Drive JSON : `kennys-moas-data.json`, contenant la
  même structure que l'export manuel existant
  (`collectLS()` — toutes les clés `localStorage` préfixées `me:`,
  **sauf** celles préfixées `me:sync:` qui sont l'état interne du
  moteur de synchronisation lui-même et ne doivent jamais être
  synchronisées).
- Algorithme (dans `syncDataBlob()`) :
  1. Récupère les métadonnées du fichier distant (`modifiedTime`).
  2. Calcule un hash SHA-256 du contenu local actuel.
  3. Compare au dernier `modifiedTime` connu et au dernier hash
     poussé (mémorisés dans `localStorage`,
     `me:sync:lastRemoteModified` / `me:sync:lastPushedHash`).
  4. Quatre cas : rien n'a changé (ne fait rien) ; seul le distant a
     changé (télécharge et applique) ; seul le local a changé
     (envoie) ; **les deux ont changé → conflit**.
- **Conflit** : jamais résolu silencieusement. Une sauvegarde de la
  version locale est prise via le mécanisme de "Sauvegarde
  automatique" déjà existant (`dbPut('backups', ...)`), puis une
  boîte de dialogue demande explicitement à l'utilisateur de choisir
  "Garder cet appareil" ou "Garder Google Drive". Stratégie
  documentée volontairement simple (pas de fusion champ par champ) —
  voir section Limitations.

### 4.5 Synchronisation des fichiers de la Bibliothèque (incrémentale)

- Chaque fichier local reçoit un champ `driveFileId` une fois envoyé
  une première fois sur Drive (dans le sous-dossier `Bibliothèque`,
  avec `appProperties.localId` pointant vers l'identifiant local,
  pour un rapprochement fiable même si `driveFileId` était perdu).
- À chaque synchronisation : seuls les fichiers **sans** `driveFileId`
  sont envoyés (le contenu binaire d'un fichier importé n'est jamais
  modifié après coup dans cette app, donc un envoi initial suffit —
  pas de re-upload à chaque sync) ; côté téléchargement, seuls les
  fichiers Drive **absents localement** (par correspondance
  `driveFileId`/`appProperties.localId`) sont récupérés. Ceci évite
  les téléchargements/envois complets inutiles à chaque
  synchronisation, conformément à la consigne d'éviter le
  re-téléchargement systématique.
- Les documents "natifs Google" (Google Docs/Sheets/Slides,
  `mimeType` commençant par `application/vnd.google-apps.`) sont
  délibérément ignorés lors du téléchargement (pas de contenu binaire
  exportable directement sans passer par l'API d'export Drive, hors
  périmètre de cette session — voir Limitations).

### 4.6 Synchronisation au démarrage / automatique / manuelle

- **Démarrage** : les données locales s'affichent immédiatement
  (aucun changement au chargement initial existant) ; une tentative
  de synchronisation silencieuse est lancée en tâche de fond *si*
  l'utilisateur était déjà connecté lors d'une session précédente.
- **Automatique** : `setInterval` configurable (0 = désactivée / 10 /
  30 / 60 minutes, défaut 30), stocké dans
  `localStorage` (`me:sync:autoMinutes`). Ne fonctionne, comme
  documenté au moment de l'implémentation, que **pendant que l'onglet/
  fenêtre reste ouvert** (limite inhérente à une app locale sans
  serveur — pas de vraies notifications push). Relancé automatiquement
  à la prochaine ouverture.
- **Manuelle** : bouton "Synchroniser maintenant", protégé par un
  verrou `isSyncing` empêchant toute exécution concurrente (un second
  clic pendant une synchronisation en cours affiche un simple
  avertissement au lieu de lancer une seconde synchronisation).

### 4.7 Mode hors-ligne

- Vérification `navigator.onLine` avant toute tentative de
  synchronisation (échec propre et message clair si hors-ligne, pas
  de blocage de l'app).
- Un écouteur `online` supplémentaire relance une synchronisation
  silencieuse dès la reconnexion.
- Les données locales ne sont **jamais** supprimées ou remplacées du
  simple fait que Google/Internet est indisponible.

### 4.8 Import multiple depuis Google Drive

- Utilise le **sélecteur Google Picker** officiel
  (`google.picker.PickerBuilder`, chargé dynamiquement comme GIS),
  avec sélection multiple activée (`MULTISELECT_ENABLED`). C'est la
  méthode recommandée par Google pour donner accès à des fichiers
  *choisis par l'utilisateur* tout en gardant le scope minimal
  `drive.file` (sans lui, il faudrait un scope beaucoup plus large
  type `drive.readonly`, plus intrusif et nécessitant une validation
  Google pour un usage en production).
- Après sélection : téléchargement de chaque fichier
  (`files.get?alt=media`), conversion en objet `File` standard, puis
  **réutilisation telle quelle de la fonction `importFiles()`
  existante** (même logique que l'import local : catégorisation via
  `chooseImportType`, pas de doublon de code d'import).
- Déduplication : les fichiers déjà importés (même `driveFileId`) sont
  ignorés et comptés séparément dans le message de fin.
- Erreurs par fichier isolées (un échec n'interrompt pas les autres),
  conformément à la consigne.

### 4.9 État de synchronisation (interface)

Carte "Google Drive" dans Réglages : compte connecté (nom + photo),
statut textuel + couleur (connecté / synchronisation en cours /
hors-ligne / conflit / erreur), date de dernière synchronisation,
boutons Synchroniser maintenant / Importer depuis Google Drive / Se
déconnecter, sélecteur de fréquence automatique. Pas de redesign
global de l'app — tout est contenu dans cette carte, cohérente avec le
style déjà en place (classes CSS existantes réutilisées, aucune classe
CSS ajoutée).

### 4.10 Gestion des erreurs

Chaque appel réseau Google passe par `driveFetch()`, qui traduit les
erreurs HTTP en types explicites (`auth`, `auth_required`, `network`,
`quota`, `forbidden`, `notfound`, `invalid`, `drive`) avec un message
utilisateur dédié pour chacun (voir `syncNow()`). Un `401` déclenche
une tentative silencieuse de renouvellement du token avant d'échouer
réellement ; en synchronisation manuelle, une expiration de session
déclenche une reconnexion interactive automatique avant d'abandonner.
Aucune erreur Google ne remonte comme exception non interceptée
jusqu'au reste de l'application.

### 4.11 Sécurité

Aucun secret dans le projet (voir `SETUP.md`). Le Client ID et la clé
API sont des placeholders à remplacer par l'utilisateur avec ses
propres identifiants Google Cloud (gratuits, propres à son projet).
`.gitignore` ajouté.

## 5. Fichiers créés

`README.md`, `SETUP.md`, `HANDOFF_TO_NEXT_AI.md`, `CHANGELOG.md`,
`TROUBLESHOOTING.md`, `PROJECT_INVENTORY.md`, `MANIFEST.json`,
`FINAL_VERIFICATION.md`, `.gitignore`.

## 6. Fichiers modifiés

- `index.html` : ajout du bloc `SYNCHRONISATION GOOGLE DRIVE` (voir
  §4.1), ajout de la carte HTML `#gdriveCard` dans la section
  Réglages, un appel `renderGDriveUI()` ajouté en fin de
  `renderSettings()`, un `addEventListener('online', ...)`
  supplémentaire. **Aucune ligne existante n'a été supprimée ou
  réécrite.**
- `app.py` : port local fixe (8765) tenté en priorité avant repli sur
  un port aléatoire, nécessaire pour une origine OAuth stable. Le
  reste du fichier est inchangé.
- `sw.js` : nom du cache incrémenté (`r12` → `r13`) pour forcer la
  mise à jour côté utilisateurs ayant déjà installé la PWA.

## 7. Fichiers supprimés

Aucun.

## 8. Tests effectués

Voir `FINAL_VERIFICATION.md` pour le détail complet (build, ZIP,
SHA-256). Résumé :

- Vérification syntaxique complète de `index.html` (script principal
  extrait et passé à `node --check`) et de `app.py`
  (`python3 -m ast`) : **OK**, aucune erreur.
- Vérification de l'équilibre des balises HTML critiques (`section`,
  `div`, `dialog`) après modification : **OK**.
- Relecture manuelle ligne par ligne du module ajouté pour vérifier
  que chaque fonction/variable globale utilisée (`$`, `toast`,
  `dbPut`, `importFiles`, etc.) existe bien dans le fichier et avec la
  bonne signature.

## 9. Tests **non** effectués (nécessitent une configuration externe
impossible dans cet environnement)

Cet environnement de développement n'a pas d'accès réseau sortant et
ne peut pas ouvrir de vraie fenêtre de navigateur. Il est donc
**impossible d'y tester réellement** :

- la première connexion Google (popup OAuth réelle) ;
- la création/récupération effective du dossier Drive ;
- un import simple ou multiple réel depuis Google Drive (Picker) ;
- une synchronisation réelle (montée/descente) entre deux appareils ;
- la détection de conflit en conditions réelles (deux modifications
  concurrentes) ;
- le comportement après fermeture/réouverture avec une vraie session
  Google ;
- le build/déploiement réel sur GitHub Pages (dépend d'un dépôt Git et
  d'une configuration Google Cloud propres à l'utilisateur final) ;
- le fonctionnement de `pywebview`/`pyinstaller` (nécessitent un
  environnement graphique + `pip install`, indisponibles ici).

**Ne prétends jamais que ces tests ont été effectués s'ils ne l'ont
pas réellement été.** La prochaine IA (ou l'utilisateur) doit les
effectuer après avoir suivi `SETUP.md`.

## 10. Résultats

Code complet, cohérent avec l'architecture existante, syntaxiquement
valide, aucune fonctionnalité existante cassée (vérifié par lecture
complète du diff). Fonctionnellement non testable en conditions
réelles dans cet environnement (voir §9) — c'est une limite de
l'environnement d'exécution, pas un choix de qualité.

## 11. Limitations connues

- Pas de fusion fine en cas de conflit (choix binaire "garder l'un ou
  l'autre" au niveau du fichier de données entier, pas champ par
  champ). Suffisant pour un usage mono-utilisateur multi-appareils
  typique (le cas d'usage principal ici), mais à améliorer si l'app
  devait un jour être utilisée par plusieurs personnes en parallèle
  sur le même compte.
- Synchronisation automatique inactive app fermée (limite technique
  inhérente, déjà présente et documentée pour les rappels de devoirs
  avant cette session — comportement volontairement cohérent).
- Documents Google natifs (Docs/Sheets/Slides) non importables
  directement (voir §4.5 et `TROUBLESHOOTING.md`).
- En statut Google Cloud "Test" (cas par défaut, voir `SETUP.md`), les
  sessions Google expirent plus vite qu'en "Production" — comportement
  de Google, pas de l'application.
- Aucun test end-to-end réel n'a pu être exécuté (voir §9) : à faire
  après configuration (`SETUP.md`) par l'utilisateur ou une prochaine
  session avec accès réseau/navigateur réel.

## 12. Configuration restante à la charge de l'utilisateur

Entièrement décrite dans `SETUP.md` : création d'un projet Google
Cloud, activation des API Drive + Picker, écran de consentement OAuth,
Client ID + clé API à coller dans `index.html`, éventuellement
déclaration de l'origine GitHub Pages.

## 13. Risques

- Si le port 8765 est occupé sur la machine de l'utilisateur, la
  connexion Google échouera en app de bureau tant qu'il n'est pas
  libéré (message d'erreur clair, pas de plantage — voir
  `TROUBLESHOOTING.md`).
- Si l'utilisateur commite `index.html` sur un dépôt public après y
  avoir collé ses identifiants Google, le Client ID et la clé API
  deviennent publics — **c'est normal et sans risque** pour ce type
  d'identifiants (voir `SETUP.md`, section Sécurité), à condition que
  les restrictions d'origine soient bien configurées côté Google Cloud
  Console.

## 14. Points à ne pas casser

- Le module Google Drive est une IIFE volontairement isolée : toute
  modification future devrait rester dans ce bloc plutôt que de
  disperser la logique de synchronisation ailleurs dans le fichier.
- Ne jamais synchroniser les clés `localStorage` préfixées
  `me:sync:` (état interne du moteur de sync) — `collectLSForSync()`
  les filtre déjà, ne pas retirer ce filtre.
- Ne jamais écraser une différence détectée entre local et distant
  sans passer par la boîte de dialogue de conflit (voir §4.4) — c'est
  la garantie centrale "aucune perte silencieuse" de cette
  implémentation.
- Le port fixe 8765 dans `app.py` doit rester cohérent avec l'origine
  déclarée dans Google Cloud Console si l'un des deux est modifié.

## 15. Commandes importantes

```bash
# Lancer l'app de bureau
pip install pywebview
python app.py

# Créer un .exe (Windows)
pip install pyinstaller
pyinstaller --onefile --windowed --add-data "index.html;." --add-data "sw.js;." --add-data "manifest.webmanifest;." --add-data "icon-192.png;." --add-data "icon-512.png;." --add-data "icon-192-maskable.png;." --add-data "icon-512-maskable.png;." --add-data "icon.ico;." --icon=icon.ico --name "KENNYS-MOAS" app.py

# Vérifier la syntaxe JS après modification (extraire le <script> principal puis) :
node --check main_script.js

# Vérifier la syntaxe Python
python3 -m py_compile app.py
```

## 16. Prochaines évolutions possibles

- Fusion de conflit plus fine (par exemple au niveau de chaque liste :
  notes/devoirs/événements séparément plutôt qu'un seul bloc).
- Vraie synchronisation en arrière-plan via un Service Worker
  "periodic background sync" (support navigateur encore limité au
  moment de cette session).
- Export/import des documents Google natifs via l'API d'export Drive
  (conversion PDF).
- Indicateur de synchronisation visible aussi hors de la page
  Réglages (ex. petite pastille dans la barre de navigation).
