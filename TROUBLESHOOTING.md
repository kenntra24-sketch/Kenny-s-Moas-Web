# Dépannage

## Général

**"Pas encore configurée" affiché dans Réglages → Google Drive**
Les identifiants Google n'ont pas encore été renseignés dans
`index.html`. Suis `SETUP.md`.

**L'app fonctionne mais je ne veux pas de Google Drive**
Aucun problème : ignore simplement cette carte dans Réglages. Rien
n'est envoyé nulle part tant que tu ne cliques pas sur
"Se connecter avec Google".

## Connexion Google

**La fenêtre de connexion Google ne s'ouvre pas au premier clic**
Le script Google (chargé uniquement à la demande, pas au démarrage,
pour ne pas dépendre d'Internet en usage normal) peut prendre un bref
instant à charger la toute première fois, ce qui empêche parfois le
navigateur d'ouvrir la fenêtre de connexion immédiatement après un
clic. Reclique une seconde fois sur "Se connecter avec Google" — la
seconde tentative fonctionne normalement.

**"redirect_uri_mismatch" ou "origin_mismatch"**
L'origine (`http://127.0.0.1:8765`, ton URL GitHub Pages, etc.) n'est
pas déclarée dans la liste des "Origines JavaScript autorisées" du
Client ID OAuth (Google Cloud Console → Identifiants). Voir `SETUP.md`
étape 3.

**Je suis reconnecté à chaque ouverture de l'app**
Normal si l'appli Google Cloud est en statut "Test" (voir
`SETUP.md`) : Google limite alors la durée de vie des sessions pour
les scopes comme `drive.file`. Ce n'est pas un bug de l'application.

**"Accès refusé" / mon compte n'est pas autorisé**
Ajoute ton compte Google dans la liste des "Utilisateurs test" de
l'écran de consentement OAuth (Google Cloud Console).

## Synchronisation

**"Synchroniser maintenant" indique une erreur**
Regarde le message affiché (toast) : il indique la cause précise
(session expirée, hors ligne, quota Drive dépassé, fichier
introuvable…). En cas de session expirée, l'app retente
automatiquement une reconnexion interactive une fois avant d'afficher
l'erreur — accepte la fenêtre Google qui s'ouvre si besoin.

**Une boîte de dialogue de conflit apparaît**
Cela signifie que les données ont changé à la fois sur cet appareil
et sur Google Drive depuis la dernière synchronisation. Une
sauvegarde automatique de la version locale est prise avant toute
action (visible dans Réglages → Sauvegarde automatique), donc aucun
choix n'est risqué : tu peux toujours revenir en arrière ensuite.

**La synchronisation automatique ne se déclenche pas**
Elle ne fonctionne que pendant que l'application reste ouverte dans
un onglet/une fenêtre (limite technique d'une app locale sans
serveur — pas de vraies notifications push). À la réouverture, une
synchronisation est relancée automatiquement.

**Les fichiers de la Bibliothèque ne se synchronisent pas**
Vérifie qu'ils ont bien été importés après connexion à Google Drive,
ou clique sur "Synchroniser maintenant" : l'envoi des fichiers
existants se fait au fil des synchronisations suivantes, pas
rétroactivement en une fois pour de très gros volumes (pour éviter de
saturer la connexion).

## Import depuis Google Drive

**Un fichier Google Docs/Sheets/Slides n'apparaît pas après
sélection**
Volontaire et documenté : ces formats "natifs Google" (pas de fichier
binaire réel) ne sont pas pris en charge par l'import — seuls les
fichiers uploadés (PDF, images, `.docx`, `.xlsx`, etc.) le sont,
cohérent avec le lecteur intégré existant qui gère déjà PDF/images/
texte nativement. Pour importer un Google Doc, exporte-le d'abord en
PDF/Word depuis Google Drive, puis importe ce fichier exporté.

**"Non pris en charge" affiché après un import**
Même cause que ci-dessus.

## App de bureau (`app.py`)

**La connexion Google échoue uniquement en app de bureau**
Vérifie que le port 8765 est libre sur ta machine (voir `SETUP.md`
étape 5) et que `http://127.0.0.1:8765` est bien dans la liste des
origines autorisées.

**Après avoir créé un `.exe` avec PyInstaller, Google Drive ne
fonctionne plus**
Le `.exe` embarque la même app.py avec le même port fixe — vérifie
qu'aucun antivirus/pare-feu ne bloque le petit serveur local
(`127.0.0.1:8765`), nécessaire même sans la fonctionnalité Google
Drive.

## Build / déploiement GitHub Pages

**Page blanche après déploiement**
Vérifie que tous les fichiers (`index.html`, `sw.js`,
`manifest.webmanifest`, `pdf.min.mjs`, `pdf.worker.min.mjs`, les
icônes) ont bien été déposés côte à côte, sans renommer de dossier —
tous les chemins sont relatifs (`./...`).

**Le lecteur PDF ne fonctionne pas en ligne**
Vérifie que `pdf.min.mjs` et `pdf.worker.min.mjs` sont bien présents
au même niveau que `index.html` dans le déploiement (ils sont
volumineux et parfois oubliés lors d'un dépôt manuel).
