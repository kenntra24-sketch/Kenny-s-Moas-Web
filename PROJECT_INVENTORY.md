# Inventaire du projet

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | L'application entière (HTML + CSS + JS en un seul fichier, ~2900 lignes). Contient désormais aussi le module de synchronisation Google Drive (bloc `SYNCHRONISATION GOOGLE DRIVE`). |
| `app.py` | Lance l'app comme logiciel de bureau (serveur HTTP local + fenêtre `pywebview`, sans navigateur visible). Port fixe 8765 (voir `SETUP.md`). |
| `manifest.webmanifest` | Manifeste PWA (nom, icônes, couleurs, installation sur téléphone/ordinateur). |
| `sw.js` | Service worker : cache l'app pour un fonctionnement hors-ligne une fois chargée une première fois (stratégie "cache d'abord", voir `TROUBLESHOOTING.md`). |
| `pdf.min.mjs`, `pdf.worker.min.mjs` | PDF.js (build officiel Mozilla), embarqué en local pour le lecteur PDF intégré, 100% hors-ligne. |
| `icon*.png`, `icon.ico` | Icônes de l'app (PWA, bureau, iOS). |
| `splash/*.png` | Écrans de démarrage iOS (évite le flash blanc à l'ouverture depuis l'écran d'accueil). |
| `.gitignore` | Exclut les artefacts de build (`dist/`, `build/`, `*.spec`), fichiers Python compilés, fichiers d'OS/éditeurs. Aucun secret n'existe dans ce projet à exclure (voir `SETUP.md`). |
| `README.md` | Présentation générale, lancement, fonctionnalités. |
| `SETUP.md` | Configuration Google obligatoire pour activer la connexion/synchronisation Drive. |
| `HANDOFF_TO_NEXT_AI.md` | Document de relais technique détaillé pour reprendre le projet. |
| `CHANGELOG.md` | Historique des modifications, dont celles de cette session. |
| `TROUBLESHOOTING.md` | Problèmes courants et solutions. |
| `PROJECT_INVENTORY.md` | Ce fichier. |
| `MANIFEST.json` | Métadonnées de version/intégrité du livrable (à ne pas confondre avec `manifest.webmanifest`, le manifeste PWA). |
| `FINAL_VERIFICATION.md` | Rapport final de vérification (build, ZIP, SHA-256, tests, limites). |
| `GUIDE.md` | Guide utilisateur pour lancer l'app de bureau (`pip install pywebview`, `python app.py`, création d'un `.exe`). |
| `RAPPORT-ANALYSE.md`, `HANDOFF.md`, `RELAIS-iOS-DESIGN.md` | Archives des sessions de travail précédentes (conservées telles quelles, non modifiées). |

## Où se trouve la logique de synchronisation Google Drive ?

Tout le code ajouté cette session est regroupé dans **un seul bloc**
à l'intérieur de `index.html`, clairement délimité par le commentaire
`/* ================= SYNCHRONISATION GOOGLE DRIVE ================= */`,
juste avant le module `EXPORT CALENDRIER NATIF (.ICS)` existant. Il
est écrit comme une IIFE autonome (`(function(){ ... })();`) qui ne
touche à aucune fonction existante, sauf :

- un appel ajouté en fin de `renderSettings()` (`renderGDriveUI()`) ;
- un `addEventListener('online', ...)` supplémentaire (en plus de
  celui déjà existant, sans le remplacer) pour relancer la
  synchronisation à la reconnexion réseau ;
- une nouvelle carte `<div class="card" id="gdriveCard">` ajoutée
  dans la section Réglages (aucune carte existante modifiée).

Voir `HANDOFF_TO_NEXT_AI.md` pour le détail de l'architecture.
